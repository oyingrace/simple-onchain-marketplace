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

    struct Item {
        uint itemId;
        string name;
        string description;
        uint price;
        string imageUrl;
        address seller;
        bool isActive;
    }

    Purchase[] public purchases;
    Item[] public items;
    mapping(uint => uint) public itemIdToIndex; // itemId => index in items array
    uint public nextItemId = 1;

    event ItemBought(uint indexed itemId, string itemName, address indexed buyer, address indexed seller, uint price);
    event ItemCreated(uint indexed itemId, string name, address indexed seller, uint price);

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

    // Create a new item listing (only registered sellers can call this)
    function createItem(
        string calldata _name,
        string calldata _description,
        uint _price,
        string calldata _imageUrl
    ) external returns (uint) {
        require(sellerRegistry.isSeller(msg.sender), "Only registered sellers can create items");
        require(bytes(_name).length > 0, "Item name cannot be empty");
        require(_price > 0, "Item price must be greater than 0");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");

        uint currentItemId = nextItemId;
        nextItemId++;

        Item memory newItem = Item({
            itemId: currentItemId,
            name: _name,
            description: _description,
            price: _price,
            imageUrl: _imageUrl,
            seller: msg.sender,
            isActive: true
        });

        items.push(newItem);
        itemIdToIndex[currentItemId] = items.length - 1;

        // Automatically assign item to seller in registry
        sellerRegistry.assignItemToSeller(currentItemId, msg.sender);

        emit ItemCreated(currentItemId, _name, msg.sender, _price);
        return currentItemId;
    }
}