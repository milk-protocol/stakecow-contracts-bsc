const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const { toBN } = require('web3-utils');
const { BN, expectEvent, expectRevert, time, constants} = require('@openzeppelin/test-helpers');

const [ admin, deployer, user, user2 ] = accounts;

const Milk = contract.fromArtifact('Milk');
const CowFactory = contract.fromArtifact('CowFactory');
const StakeCow = contract.fromArtifact('GrowingCow');
const StakeToken = contract.fromArtifact('StakeToken');


describe("GrowingCow", function() {
	const BASE = new BN('10').pow(new BN('18'))
	const SUPPLY = new BN('1000000000').mul(BASE);

	beforeEach(async () => {
    var factory = await CowFactory.new({ from: admin });
		var milk = await Milk.new(factory.address, SUPPLY, { from: deployer });

		let factoryBalance = await milk.balanceOf(factory.address);
		let totalSupply = await milk.totalSupply();
		expect(factoryBalance.toString()).to.equal(totalSupply.toString());

		var stakeToken = await StakeToken.new();
		stakeToken.mint(user, new BN('200').mul(BASE));
		stakeToken.mint(user2, new BN('500').mul(BASE));
		let duration = 86400;  // 24 hours
		let reward = new BN('1000');
		let startTime = parseInt(new Date().getTime() / 1000);
		let totalReward = toBN(0);
		let totalPeriods = 5;

		let nextReward = reward.mul(BASE);

		for(i = 0; i < totalPeriods; i ++) {
			totalReward = totalReward.add(nextReward);
			nextReward = nextReward.mul(toBN(110)).div(toBN(100));
		}

		let tx = await factory.createGrowingCow({ from: admin });
		let cowAddress = tx.logs[0].args.cow;
		await factory.initializeGrowingCow(
			cowAddress,
			stakeToken.address, 
			milk.address, 
			duration, 
			reward.mul(BASE), 
			startTime,
			0, // fee
			constants.ZERO_ADDRESS,
			totalPeriods,
			{from: admin}
		)

		this.cow = await StakeCow.at(tx.logs[0].args.cow);
		this.stakeToken = stakeToken;
		this.milk = milk;

		let balance = await milk.balanceOf(this.cow.address);

		expect(balance.toString()).to.equal(totalReward.toString());
  });


	it("stake", async () => {
		await time.increase(1);
		let amount = new BN('100').mul(BASE);
		await this.stakeToken.approve(this.cow.address, amount, { from: user });
		await this.cow.stake(amount, { from: user });
		let balance = await this.cow.balanceOf(user);
		expect(balance).be.bignumber.to.equal(amount);
	});

	it("getReward", async() => {
		let amount = new BN('200').mul(BASE);
		await this.stakeToken.approve(this.cow.address, amount, { from: user });
		await this.cow.stake(amount, { from: user });
		await time.increase(10);
		let earned = await this.cow.earned(user);
		let rewardRate = await this.cow.rewardRate();
		await this.cow.getReward({from: user});
		let expectEarned = new BN('10').mul(rewardRate);
		let r = earned.divRound(expectEarned).toNumber();
		expect(Math.round(r)).to.equal(1);
	});

	it("earned", async () => {
		await time.increase(10);
		let amount = new BN('100').mul(BASE);
		await this.stakeToken.approve(this.cow.address, amount, { from: user });
		await this.cow.stake(amount, { from: user });
		let balance = await this.cow.balanceOf(user);
		let supply = await this.cow.totalSupply();
		expect(supply.toString()).to.equal(balance.toString());

		let initReward = await this.cow.initreward();
		let rewardRate = await this.cow.rewardRate();
		expect(rewardRate.toString()).to.equal((initReward / 86400).toString());

		await time.increase(10);

		let earned = await this.cow.earned(user);

		let rewardPerToken = new BN('10').mul(rewardRate).mul(BASE).div(supply);

		let expectEarned = rewardPerToken.mul(amount).div(BASE);

		expect(earned.toString()).to.equal(expectEarned.toString())
	});

	it("withdraw", async() => {
		await time.increase(1);
		let amount = new BN('100').mul(BASE);
		await this.stakeToken.approve(this.cow.address, amount, { from: user });
		await this.cow.stake(amount, { from: user });
		await this.cow.withdraw(amount.div(new BN('10')), { from: user });

		let balance = await this.stakeToken.balanceOf(user);
		let expectBalance = new BN('110').mul(BASE);
		expect(balance.toString()).to.equal(expectBalance.toString());
	});

	it("exit", async() => {
		await time.increase(1);
		let amount = new BN('100').mul(BASE);
		await this.stakeToken.approve(this.cow.address, amount, { from: user });
		await this.cow.stake(amount, { from: user });
		await time.increase(10);

		let rewardRate = await this.cow.rewardRate();
		let earned = await this.cow.earned(user);

		await this.cow.exit({from: user});

		let stakeBanalce = await this.stakeToken.balanceOf(user);
		let yieldBalance = await this.milk.balanceOf(user);

		expect(stakeBanalce.toString()).to.equal(new BN('200').mul(BASE).toString());
		expect(yieldBalance.toString()).to.equal(earned.toString());

	});

	it("checkFinish", async() => {
		await time.increase(0);
		let amount = new BN('100').mul(BASE);
		await this.stakeToken.approve(this.cow.address, new BN('200').mul(BASE), { from: user });
		await this.cow.stake(amount, { from: user });
		let finishTime = await this.cow.finishTime();
		await time.increaseTo(finishTime);
		let rewardRate = await this.cow.rewardRate();

		await time.increase(1);
		await this.stakeToken.approve(this.cow.address, new BN('200').mul(BASE), { from: user2 });
		await expectRevert(
			this.cow.stake(amount, { from: user2 }), "ERROR: Stake over"
		);
	});

});