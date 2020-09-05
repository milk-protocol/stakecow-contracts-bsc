const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const [ admin, deployer, user ] = accounts;

const Milk = contract.fromArtifact('Milk');

describe("Milk", function() {
	const BASE = new BN('10').pow(new BN('18'))

	it("should create Milk contract successfully", async ()=> {
		let totalSupply = new BN('101000').mul(BASE);
		let milk = await Milk.new(admin, totalSupply);
		expect(await milk.symbol()).to.equal("MILK");
		expect(await milk.decimals()).to.be.bignumber.equal(new BN('18'));
		var supply = await milk.totalSupply();
		expect(supply).be.bignumber.to.equal(totalSupply);
	});
});