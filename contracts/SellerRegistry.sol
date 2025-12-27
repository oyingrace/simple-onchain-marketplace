// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SellerRegistry {
    struct Seller {
        address sellerAddress;
        string name;
        bool isRegistered;
        uint itemCount;
    }

    mapping(address => Seller) public sellers;
    mapping(uint => address) public itemToSeller; // itemId => seller address
    address[] public registeredSellers;

    event SellerRegistered(address indexed seller, string name);
    event ItemAssignedToSeller(uint indexed itemId, address indexed seller);

    // Register as a seller
    function registerSeller(string memory _name) external {
        require(!sellers[msg.sender].isRegistered, "Seller already registered");
        require(bytes(_name).length > 0, "Seller name cannot be empty");

        sellers[msg.sender] = Seller({
            sellerAddress: msg.sender,
            name: _name,
            isRegistered: true,
            itemCount: 0
        });

        registeredSellers.push(msg.sender);
        emit SellerRegistered(msg.sender, _name);
    }

    // Assign an item to a seller
    function assignItemToSeller(uint _itemId, address _seller) external {
        require(sellers[_seller].isRegistered, "Seller not registered");
        require(itemToSeller[_itemId] == address(0), "Item already assigned to a seller");

        itemToSeller[_itemId] = _seller;
        sellers[_seller].itemCount++;
        
        emit ItemAssignedToSeller(_itemId, _seller);
    }

    // Get seller information
    function getSeller(address _seller) external view returns (Seller memory) {
        return sellers[_seller];
    }

    // Get seller address for an item
    function getSellerForItem(uint _itemId) external view returns (address) {
        return itemToSeller[_itemId];
    }

    // Check if address is a registered seller
    function isSeller(address _seller) external view returns (bool) {
        return sellers[_seller].isRegistered;
    }

    // Get total number of registered sellers
    function getTotalSellers() external view returns (uint) {
        return registeredSellers.length;
    }

}

