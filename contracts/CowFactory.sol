
pragma solidity ^0.5.16;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FomoCow.sol";
import "./GrowingCow.sol";


/**
 * @dev CowFactory
 */
contract CowFactory is Ownable {
  event CowBorn(address indexed cow);

  // Create Fomo cow
  function createFomoCow() public onlyOwner returns (address cow) {
    FomoCow pool = new FomoCow();
    cow = address(pool);
    emit CowBorn(cow);
  }

  function initializeFomoCow(
    address cow,
    address _stakeToken,
    address _yieldToken,
    uint256 _duration,
    uint256 _reward,
    uint256 _startTime
  ) public onlyOwner {
    FomoCow(cow).initialize(
      _stakeToken,
      _yieldToken,
      _duration,
      _reward,
      _startTime
    );
    IERC20(_yieldToken).transfer(cow, _reward);
  }

  // Create Growing cow
  function createGrowingCow() public onlyOwner returns (address cow)
  {
    GrowingCow pool = new GrowingCow();
    cow = address(pool);
    emit CowBorn(cow);
  }

  function initializeGrowingCow(
    address cow,
    address _stakeToken,
    address _yieldToken,
    uint256 _duration,
    uint256 _initReward,
    uint256 _startTime,
    uint256 _totalPeriods

  ) public onlyOwner {
    GrowingCow(cow).initialize(
      _stakeToken,
      _yieldToken,
      _duration,
      _initReward,
      _startTime,
      _totalPeriods
    );

    uint256 total = 0;
    uint256 nextReward = _initReward;
    for(uint256 i = 0; i < _totalPeriods; i++) {
      total = total + nextReward;
      nextReward = nextReward * 110 / 100;
    }
    IERC20(_yieldToken).transfer(cow, total);
  }

  function airdrop(address token, uint256 amount, address[] memory users) public onlyOwner {
    for(uint256 i = 0; i < users.length; i++) {
      IERC20(token).transfer(users[i], amount);
    }
  }
}


  