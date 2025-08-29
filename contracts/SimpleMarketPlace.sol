// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleMarketplace {
    struct Purchase {
        uint itemId;
        string itemName;
        uint price;
        address buyer;
    }

    Purchase[] public purchases;

    event ItemBought(uint indexed itemId, string itemName, address indexed buyer, uint price);

    // Buy an item (frontend passes itemId, name, price)
    function buyItem(uint _itemId, string calldata _itemName) external payable {
        require(msg.value > 0, "Must send ETH to buy item");

        purchases.push(Purchase({
            itemId: _itemId,
            itemName: _itemName,
            price: msg.value,
            buyer: msg.sender
        }));

        emit ItemBought(_itemId, _itemName, msg.sender, msg.value);
    }

    // Get all purchases
    function getPurchases() external view returns (Purchase[] memory) {
        return purchases;
    }
}