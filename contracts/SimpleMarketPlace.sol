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
    event ItemUpdated(uint indexed itemId, string name, address indexed seller);
    event ItemRemoved(uint indexed itemId, address indexed seller);

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

    // Update an existing item listing (only the item's seller can call this)
    function updateItem(
        uint _itemId,
        string calldata _name,
        string calldata _description,
        uint _price,
        string calldata _imageUrl
    ) external {
        uint index = itemIdToIndex[_itemId];
        require(index < items.length, "Item does not exist");
        require(items[index].itemId == _itemId, "Item does not exist");
        require(items[index].seller == msg.sender, "Only the item seller can update it");
        require(items[index].isActive, "Cannot update inactive item");
        require(bytes(_name).length > 0, "Item name cannot be empty");
        require(_price > 0, "Item price must be greater than 0");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");

        items[index].name = _name;
        items[index].description = _description;
        items[index].price = _price;
        items[index].imageUrl = _imageUrl;

        emit ItemUpdated(_itemId, _name, msg.sender);
    }

    // Remove/deactivate an item listing (only the item's seller can call this)
    function removeItem(uint _itemId) external {
        uint index = itemIdToIndex[_itemId];
        require(index < items.length, "Item does not exist");
        require(items[index].itemId == _itemId, "Item does not exist");
        require(items[index].seller == msg.sender, "Only the item seller can remove it");
        require(items[index].isActive, "Item is already inactive");

        items[index].isActive = false;

        emit ItemRemoved(_itemId, msg.sender);
    }

    // Get a specific item by ID
    function getItem(uint _itemId) external view returns (Item memory) {
        uint index = itemIdToIndex[_itemId];
        require(index < items.length, "Item does not exist");
        require(items[index].itemId == _itemId, "Item does not exist");
        return items[index];
    }

    // Get all items listed by a specific seller
    function getItemsBySeller(address _seller) external view returns (Item[] memory) {
        require(sellerRegistry.isSeller(_seller), "Address is not a registered seller");
        
        uint count = 0;
        // First pass: count items
        for (uint i = 0; i < items.length; i++) {
            if (items[i].seller == _seller) {
                count++;
            }
        }
        
        // Second pass: populate array
        Item[] memory sellerItems = new Item[](count);
        uint currentIndex = 0;
        for (uint i = 0; i < items.length; i++) {
            if (items[i].seller == _seller) {
                sellerItems[currentIndex] = items[i];
                currentIndex++;
            }
        }
        
        return sellerItems;
    }

    // Get all active items
    function getActiveItems() external view returns (Item[] memory) {
        uint count = 0;
        // First pass: count active items
        for (uint i = 0; i < items.length; i++) {
            if (items[i].isActive) {
                count++;
            }
        }
        
        // Second pass: populate array
        Item[] memory activeItems = new Item[](count);
        uint currentIndex = 0;
        for (uint i = 0; i < items.length; i++) {
            if (items[i].isActive) {
                activeItems[currentIndex] = items[i];
                currentIndex++;
            }
        }
        
        return activeItems;
    }
}