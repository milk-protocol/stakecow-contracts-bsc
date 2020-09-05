pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * @dev Milk Protocol
 */

contract Milk is ERC20, ERC20Detailed {
	constructor(address factory, uint256 totalSupply) ERC20Detailed("Milk Protocol", "MILK", 18) public {
		_mint(factory, totalSupply);
	}
}