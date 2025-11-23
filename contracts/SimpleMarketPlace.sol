// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SellerRegistry.sol";

contract SimpleMarketplace {
    SellerRegistry public sellerRegistry;
    
    struct Purchase {
        uint itemId;
        string itemName;
        uint price;
        address buyer;
        address seller;
    }

    Purchase[] public purchases;

    event ItemBought(uint indexed itemId, string itemName, address indexed buyer, address indexed seller, uint price);

    // Constructor to set the SellerRegistry address
    constructor(address _sellerRegistryAddress) {
        sellerRegistry = SellerRegistry(_sellerRegistryAddress);
    }

    // Buy an item (frontend passes itemId, name, price)
    function buyItem(uint _itemId, string calldata _itemName) external payable {
        require(msg.value > 0, "Must send ETH to buy item");
        
        // Get the seller for this item
        address seller = sellerRegistry.getSellerForItem(_itemId);
        require(seller != address(0), "Item not assigned to a seller");

        // Record the purchase
        purchases.push(Purchase({
            itemId: _itemId,
            itemName: _itemName,
            price: msg.value,
            buyer: msg.sender,
            seller: seller
        }));

        // Send payment to the seller
        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Payment to seller failed");

        emit ItemBought(_itemId, _itemName, msg.sender, seller, msg.value);
    }

    // Assign an item to a seller (only registered sellers can call this)
    function assignItemToSeller(uint _itemId, address _seller) external {
        require(sellerRegistry.isSeller(_seller), "Seller not registered");
        sellerRegistry.assignItemToSeller(_itemId, _seller);
    }

    // Get all purchases
    function getPurchases() external view returns (Purchase[] memory) {
        return purchases;
    }

    // Get seller for an item
    function getSellerForItem(uint _itemId) external view returns (address) {
        return sellerRegistry.getSellerForItem(_itemId);
    }
}