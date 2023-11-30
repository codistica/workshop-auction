// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTAuction {
    IERC721 public nft;
    uint public nftId;
    address public seller;
    uint public endAt;
    bool public started;
    bool public ended;
    address public highestBidder;
    uint public highestBid;

    event Start();
    event Bid(address indexed sender, uint amount);
    event End(address winner, uint amount);

    constructor() {
        seller = msg.sender;
    }

    function registerNFT(address _nft, uint _nftId, uint _duration) external {
        require(!started, "Auction already started.");
        require(msg.sender == seller, "You are not the seller.");
        nft = IERC721(_nft);
        nftId = _nftId;
        endAt = block.timestamp + _duration;
        highestBid = address(0);
        highestBid = 0;
    }

    function start() external {
        require(msg.sender == seller, "You are not the seller.");
        require(!started, "Auction already started.");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        emit Start();
    }

    function bid() external payable {
        require(started, "Auction not started.");
        require(block.timestamp < endAt, "Auction ended.");
        require(msg.value > highestBid, "Bid not high enough.");

        if (highestBidder != address(0)) {
            payable(highestBidder).transfer(highestBid); // Refund the previous bidder
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit Bid(msg.sender, msg.value);
    }

    function end() external {
        require(started, "Auction not started.");
        require(block.timestamp >= endAt, "Auction not yet ended.");
        require(!ended, "Auction already ended.");

        ended = true;
        if (highestBidder != address(0)) {
            nft.transferFrom(address(this), highestBidder, nftId);
            payable(seller).transfer(highestBid);
        } else {
            nft.transferFrom(address(this), seller, nftId); // No bids, return NFT to seller
        }
        emit End(highestBidder, highestBid);
    }
}
