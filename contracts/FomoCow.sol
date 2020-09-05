pragma solidity ^0.5.16;

import "@openzeppelin/contracts/math/Math.sol";
import "./StakePool.sol";

/**
 * @dev https://cow.money
 * MILK will be halved at each period.
 */
 
contract FomoCow is StakePool {
    IERC20 public yieldToken;

    uint256 public duration;
    uint256 public initreward;
    uint256 public starttime;
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalRewards = 0;
    address public deployer;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    constructor () public {
        deployer = msg.sender;
    }

    function initialize(
        address _stakeToken, 
        address _yieldToken, 
        uint256 _duration, 
        uint256 _initreward, 
        uint256 _starttime
    ) public initializer 
    {
        require(deployer == msg.sender, "ERROR: Forbidden");

        super.initialize(_stakeToken);
        yieldToken = IERC20(_yieldToken);

        duration = _duration;
        starttime = _starttime;
        notifyRewardAmount(_initreward.mul(50).div(100));
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply() == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(totalSupply())
            );
    }

    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account]);
    }

    function stake(uint256 amount) public updateReward(msg.sender) checkhalve checkStart{
        require(amount > 0, "ERROR: Cannot stake 0");
        super._stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public updateReward(msg.sender) checkhalve checkStart{
        require(amount > 0, "ERROR: Cannot withdraw 0");
        super._withdraw(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward() public updateReward(msg.sender) checkhalve checkStart{
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            rewards[msg.sender] = 0;
            yieldToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
            totalRewards = totalRewards.add(reward);
        }
    }

    modifier checkhalve(){
        if (block.timestamp >= periodFinish) {
            initreward = initreward.mul(50).div(100);

            rewardRate = initreward.div(duration);
            periodFinish = block.timestamp.add(duration);
            emit RewardAdded(initreward);
        }
        _;
    }

    modifier checkStart(){
        require(block.timestamp > starttime,"ERROR: Not start");
        _;
    }

    function notifyRewardAmount(uint256 reward)
        internal
        updateReward(address(0))
    {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(duration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(duration);
        }
        initreward = reward;
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(duration);
        emit RewardAdded(reward);
    }
}