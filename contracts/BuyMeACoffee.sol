/**
 * @author Frank Ndetembea
 * @title BUY ME A COFFEE
 * @notice Buy me a coffee is popular website that creators, educators
 * entertainers, and all kinds of people use to create a landip page where anyone can send some amount of money as a thank for their services:
 * the benefit of decentralized application built on top of a blockchain
 * is that anyone from around the world can send amount of money as a thank you for the service.
 * @dev a decentralized Buy Me a Coffee smart contract that allows visitors to send you Fake(eth) as tips and leave nice messages
 */

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;
error YOU_MUST_SEND_SOME_EHT();
error YOU_ARE_NOT_THE_OWNER();

contract BuyMeACoffee {
    event NewMemo(address indexed from, uint256 timestamp, string name, string message);
    // address of the contract deployer . Marked payable so that
    // we can witdraw to this address later
    address payable public owner;

    // list of all memos received from coffee purchase
    Memo[] memos;

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    constructor() {
        //Store the address of the developer as payable addrss
        // when we withdraw funds, we'll withdraw here
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for owner (send an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        if (msg.value <= 0) {
            revert YOU_MUST_SEND_SOME_EHT();
        }
        // add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        // Emit a NewMemo event wih details about the memo
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stord in this contract tot he owener
     */
    function withdrawTips() public {
        if (msg.sender == owner) {
            owner.transfer(address(this).balance);
        } else {
            revert YOU_ARE_NOT_THE_OWNER();
        }
    }

    /**
     * @dev fetches all stored memos
     *
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
