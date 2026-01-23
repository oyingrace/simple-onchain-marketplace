
"use client";

import React, { useEffect, useState } from "react";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";
import ItemDetailsModal from "./ItemDetailsModal.jsx";

/**
 * ActiveItemsList Component
 * Fetches and displays all active items from the smart contract
 * Replaces hardcoded item lists
 */
const ActiveItemsList = () => {
  const {
    isConnected,
    buyItem,
    getActiveItems,
    getSellerForItem,
    message,
    clearMessage,
  } = useContract();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellerInfo, setSellerInfo] = useState({});

  useEffect(() => {
    loadActiveItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      loadSellerInfo(selectedItem.itemId);
    }
  }, [selectedItem]);

  const loadActiveItems = async () => {
    setLoading(true);
    try {
      const result = await getActiveItems();
      if (result?.success && Array.isArray(result.items)) {
        // Format items for display
        const formattedItems = result.items.map((item) => ({
          itemId: item.itemId?.toString() || `${item.itemId}`,
          name: item.name,
          description: item.description,
          price: formatEthPrice(item.price),
          priceWei: item.price, // Keep original for buying
          imageUrl: item.imageUrl,
          seller: item.seller,
          isActive: item.isActive,
        }));
        setItems(formattedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
