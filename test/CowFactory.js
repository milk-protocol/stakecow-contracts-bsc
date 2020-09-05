const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

const Web3EthAbi = require('web3-eth-abi');

const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

const [ admin, deployer, user ] = accounts;

const bytecode = "0x60806040526000603a556000603b556000603e556103e860415534801561002557600080fd5b5033603f60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550612436806100766000396000f3fe608060405234801561001057600080fd5b50600436106101a85760003560e01c80638b876347116100f9578063c8f33c9111610097578063df136d6511610071578063df136d65146106b7578063e9fad8ee146106d5578063ebe2b12b146106df578063f0b10c36146106fd576101a8565b8063c8f33c9114610631578063cd3daf9d1461064f578063d5f394881461066d576101a8565b80639c907b58116100d35780639c907b5814610557578063a694fc3a14610575578063b3f00674146105a3578063c4d66de8146105ed576101a8565b80638b876347146104c35780638da588971461051b578063978bbdb914610539576101a8565b80633d18b9121161016657806376d5de851161014057806376d5de85146103915780637b0a47ee146103db57806380faa57d146103f957806383a5041c14610417576101a8565b80633d18b912146102e557806351ed6a30146102ef57806370a0823114610339576101a8565b80628cc262146101ad5780630700037d146102055780630e15561a1461025d5780630fb5a6b41461027b57806318160ddd146102995780632e1a7d4d146102b7575b600080fd5b6101ef600480360360208110156101c357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061071b565b6040518082815260200191505060405180910390f35b6102476004803603602081101561021b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610802565b6040518082815260200191505060405180910390f35b61026561081a565b6040518082815260200191505060405180910390f35b610283610820565b6040518082815260200191505060405180910390f35b6102a1610826565b6040518082815260200191505060405180910390f35b6102e3600480360360208110156102cd57600080fd5b8101908080359060200190929190505050610830565b005b6102ed610b06565b005b6102f7610e21565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61037b6004803603602081101561034f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e47565b6040518082815260200191505060405180910390f35b610399610e90565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103e3610eb6565b6040518082815260200191505060405180910390f35b610401610ebc565b6040518082815260200191505060405180910390f35b6104c1600480360360e081101561042d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ecf565b005b610505600480360360208110156104d957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611167565b6040518082815260200191505060405180910390f35b61052361117f565b6040518082815260200191505060405180910390f35b610541611185565b6040518082815260200191505060405180910390f35b61055f61118b565b6040518082815260200191505060405180910390f35b6105a16004803603602081101561058b57600080fd5b8101908080359060200190929190505050611191565b005b6105ab611582565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61062f6004803603602081101561060357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115a8565b005b6106396116e9565b6040518082815260200191505060405180910390f35b6106576116ef565b6040518082815260200191505060405180910390f35b610675611787565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6106bf6117ad565b6040518082815260200191505060405180910390f35b6106dd6117b3565b005b6106e76117ce565b6040518082815260200191505060405180910390f35b6107056117d4565b6040518082815260200191505060405180910390f35b60006107fb604460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546107ed670de0b6b3a76400006107df6107c8604360008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546107ba6116ef565b6117da90919063ffffffff16565b6107d188610e47565b61182490919063ffffffff16565b6118aa90919063ffffffff16565b6118f490919063ffffffff16565b9050919050565b60446020528060005260406000206000915090505481565b603e5481565b60375481565b6000603454905090565b336108396116ef565b603d81905550610847610ebc565b603c81905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146109145761088a8161071b565b604460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550603d54604360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b603a5442106109be576109466064610938603260385461182490919063ffffffff16565b6118aa90919063ffffffff16565b6038819055506109636037546038546118aa90919063ffffffff16565b603b8190555061097e603754426118f490919063ffffffff16565b603a819055507fde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d6038546040518082815260200191505060405180910390a15b6039544211610a35576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f4552524f523a204e6f742073746172740000000000000000000000000000000081525060200191505060405180910390fd5b60008211610aab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f4552524f523a2043616e6e6f742077697468647261772030000000000000000081525060200191505060405180910390fd5b610ab48261197c565b3373ffffffffffffffffffffffffffffffffffffffff167f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5836040518082815260200191505060405180910390a25050565b33610b0f6116ef565b603d81905550610b1d610ebc565b603c81905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610bea57610b608161071b565b604460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550603d54604360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b603a544210610c9457610c1c6064610c0e603260385461182490919063ffffffff16565b6118aa90919063ffffffff16565b603881905550610c396037546038546118aa90919063ffffffff16565b603b81905550610c54603754426118f490919063ffffffff16565b603a819055507fde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d6038546040518082815260200191505060405180910390a15b6039544211610d0b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f4552524f523a204e6f742073746172740000000000000000000000000000000081525060200191505060405180910390fd5b6000610d163361071b565b90506000811115610e1d576000604460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610db33382603660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611a7c9092919063ffffffff16565b3373ffffffffffffffffffffffffffffffffffffffff167fe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486826040518082815260200191505060405180910390a2610e1681603e546118f490919063ffffffff16565b603e819055505b5050565b603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b603660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b603b5481565b6000610eca42603a54611b4d565b905090565b600060019054906101000a900460ff1680610eee5750610eed611b66565b5b80610f0557506000809054906101000a900460ff16155b610f5a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806123aa602e913960400191505060405180910390fd5b60008060019054906101000a900460ff161590508015610faa576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b3373ffffffffffffffffffffffffffffffffffffffff16603f60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461106d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f4552524f523a20466f7262696464656e0000000000000000000000000000000081525060200191505060405180910390fd5b611076886115a8565b86603660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260408190555081604260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550856037819055508360398190555061113c611137606461112960328961182490919063ffffffff16565b6118aa90919063ffffffff16565b611b7d565b801561115d5760008060016101000a81548160ff0219169083151502179055505b5050505050505050565b60436020528060005260406000206000915090505481565b60395481565b60405481565b60385481565b3361119a6116ef565b603d819055506111a8610ebc565b603c81905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611275576111eb8161071b565b604460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550603d54604360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b603a54421061131f576112a76064611299603260385461182490919063ffffffff16565b6118aa90919063ffffffff16565b6038819055506112c46037546038546118aa90919063ffffffff16565b603b819055506112df603754426118f490919063ffffffff16565b603a819055507fde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d6038546040518082815260200191505060405180910390a15b6039544211611396576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f4552524f523a204e6f742073746172740000000000000000000000000000000081525060200191505060405180910390fd5b6000821161140c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f4552524f523a2043616e6e6f74207374616b652030000000000000000000000081525060200191505060405180910390fd5b60006114376041546114296040548661182490919063ffffffff16565b6118aa90919063ffffffff16565b9050600061144e82856117da90919063ffffffff16565b905061145a8183611d51565b3373ffffffffffffffffffffffffffffffffffffffff167f9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d826040518082815260200191505060405180910390a26000821180156115075750600073ffffffffffffffffffffffffffffffffffffffff16604260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b1561157c5761157b604260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611a7c9092919063ffffffff16565b5b50505050565b604260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060019054906101000a900460ff16806115c757506115c6611b66565b5b806115de57506000809054906101000a900460ff16155b611633576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806123aa602e913960400191505060405180910390fd5b60008060019054906101000a900460ff161590508015611683576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b81603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080156116e55760008060016101000a81548160ff0219169083151502179055505b5050565b603c5481565b6000806116fa610826565b141561170a57603d549050611784565b611781611770611718610826565b611762670de0b6b3a7640000611754603b54611746603c54611738610ebc565b6117da90919063ffffffff16565b61182490919063ffffffff16565b61182490919063ffffffff16565b6118aa90919063ffffffff16565b603d546118f490919063ffffffff16565b90505b90565b603f60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b603d5481565b6117c46117bf33610e47565b610830565b6117cc610b06565b565b603a5481565b60415481565b600061181c83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250611e66565b905092915050565b60008083141561183757600090506118a4565b600082840290508284828161184857fe5b041461189f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806123896021913960400191505060405180910390fd5b809150505b92915050565b60006118ec83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250611f26565b905092915050565b600080828401905083811015611972576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b611991816034546117da90919063ffffffff16565b6034819055506119e981603560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546117da90919063ffffffff16565b603560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611a793382603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611a7c9092919063ffffffff16565b50565b611b48838473ffffffffffffffffffffffffffffffffffffffff1663a9059cbb905060e01b8484604051602401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611fec565b505050565b6000818310611b5c5781611b5e565b825b905092915050565b6000803090506000813b9050600081149250505090565b6000611b876116ef565b603d81905550611b95610ebc565b603c81905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611c6257611bd88161071b565b604460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550603d54604360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b603a544210611c8b57611c80603754836118aa90919063ffffffff16565b603b81905550611ced565b6000611ca242603a546117da90919063ffffffff16565b90506000611cbb603b548361182490919063ffffffff16565b9050611ce4603754611cd683876118f490919063ffffffff16565b6118aa90919063ffffffff16565b603b8190555050505b8160388190555042603c81905550611d10603754426118f490919063ffffffff16565b603a819055507fde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d826040518082815260200191505060405180910390a15050565b611d66826034546118f490919063ffffffff16565b603481905550611dbe82603560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546118f490919063ffffffff16565b603560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611e623330611e1984866118f490919063ffffffff16565b603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16612237909392919063ffffffff16565b5050565b6000838311158290611f13576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611ed8578082015181840152602081019050611ebd565b50505050905090810190601f168015611f055780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5060008385039050809150509392505050565b60008083118290611fd2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611f97578082015181840152602081019050611f7c565b50505050905090810190601f168015611fc45780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581611fde57fe5b049050809150509392505050565b61200b8273ffffffffffffffffffffffffffffffffffffffff1661233d565b61207d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f5361666545524332303a2063616c6c20746f206e6f6e2d636f6e74726163740081525060200191505060405180910390fd5b600060608373ffffffffffffffffffffffffffffffffffffffff16836040518082805190602001908083835b602083106120cc57805182526020820191506020810190506020830392506120a9565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d806000811461212e576040519150601f19603f3d011682016040523d82523d6000602084013e612133565b606091505b5091509150816121ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656481525060200191505060405180910390fd5b600081511115612231578080602001905160208110156121ca57600080fd5b8101908080519060200190929190505050612230576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a8152602001806123d8602a913960400191505060405180910390fd5b5b50505050565b612337848573ffffffffffffffffffffffffffffffffffffffff166323b872dd905060e01b858585604051602401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611fec565b50505050565b60008060007fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47060001b9050833f915080821415801561237f57506000801b8214155b9250505091905056fe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77436f6e747261637420696e7374616e63652068617320616c7265616479206265656e20696e697469616c697a65645361666545524332303a204552433230206f7065726174696f6e20646964206e6f742073756363656564a265627a7a723158203ef6e0214d94ffc3b7e9379175609fbb00528b75ad6a3630b6213493cc57bb3b64736f6c63430005100032";

const Milk = contract.fromArtifact('Milk');
const CowFactory = contract.fromArtifact('CowFactory');
const StakeCow = contract.fromArtifact('FomoCow');
const StakeToken = contract.fromArtifact('StakeToken');


describe("CowFactory", function() {
	const BASE = new BN('10').pow(new BN('18'))
	const SUPPLY = new BN('100000').mul(BASE);

	beforeEach(async () => {
		this.factory = await CowFactory.new({ from: admin });
		this.milk = await Milk.new(this.factory.address, SUPPLY);
		this.stakeToken = await StakeToken.new();
	});

	it("should deploy successfully", async ()=> {
		expect(await this.factory.owner()).to.equal(admin);
	});

	it("should create FomoCow successfully", async () => {
		var factory = this.factory;
		var milk = await Milk.new(factory.address, SUPPLY);

		let factoryBalance = await milk.balanceOf(factory.address);
		expect(factoryBalance.toString()).to.equal(SUPPLY.toString());

		var stakeToken = await StakeToken.new();
		let duration = 86400;  // 24 hours
		let reward = new BN('10000').mul(BASE);
		let startTime = parseInt(new Date().getTime() / 1000);
		let feeRate = 0; // 0
		let tx = await factory.createFomoCow( { from: admin });
		let cowAddress = tx.logs[0].args.cow;
		await factory.initializeFomoCow(
			cowAddress,
			stakeToken.address, 
			milk.address, 
			duration, 
			reward, 
			startTime, 
			0,
			constants.ZERO_ADDRESS,
			{from: admin}
		)

		let pool = await StakeCow.at(cowAddress);

		let poolBalance = await milk.balanceOf(pool.address);
		expect(poolBalance.toString()).to.equal(reward.toString());

		expect(await pool.deployer()).to.equal(factory.address);
	});

	it("createCow with bytecode", async() => {
		let cow = await StakeCow.new();
		let tx = await this.factory.createCow("othercow", bytecode, { from: admin });
		let cowAddress = tx.logs[0].args.cow;


		let reward = new BN('10000').mul(BASE);

		let params = Web3EthAbi.encodeFunctionCall(
			{
	      "constant": false,
	      "inputs": [
	        {
	          "internalType": "address",
	          "name": "_stakeToken",
	          "type": "address"
	        },
	        {
	          "internalType": "address",
	          "name": "_yieldToken",
	          "type": "address"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_duration",
	          "type": "uint256"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_initreward",
	          "type": "uint256"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_starttime",
	          "type": "uint256"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_feeRate",
	          "type": "uint256"
	        },
	        {
	          "internalType": "address",
	          "name": "_feeReceiver",
	          "type": "address"
	        }
	      ],
	      "name": "initialize",
	      "outputs": [],
	      "payable": false,
	      "stateMutability": "nonpayable",
	      "type": "function"
	    },
		[
			this.stakeToken.address,
	    this.milk.address,
	    3600,
	    reward,
	    parseInt(new Date().getTime() / 1000),
	    0,
	    constants.ZERO_ADDRESS,
    ]);

		let newTx = await this.factory.initializeCow(
			cowAddress,
			this.milk.address,
			reward,
			params,
			{ from: admin }
		);

		expect(newTx.receipt.status).to.equal(true);

		let newCow = await StakeCow.at(cowAddress);

		let balance = await this.milk.balanceOf(cowAddress);
		expect(balance.toString()).to.equal(reward.toString());
	});
});