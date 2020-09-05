pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract StakeToken is Ownable, ERC20, ERC20Detailed {

	constructor() ERC20Detailed("USD", "USD", 18) public {

	}

	// Any one can mint for testing
	function mint(address to, uint256 amount) public {
		_mint(to, amount);
	}
}