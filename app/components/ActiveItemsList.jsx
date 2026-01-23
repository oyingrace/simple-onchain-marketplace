
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
      console.error("Error loading active items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerInfo = async (itemId) => {
    try {
      const result = await getSellerForItem(itemId);
      if (result?.success && result.seller) {
        setSellerInfo((prev) => ({
          ...prev,
          [itemId]: result.seller,
        }));
      }
    } catch (error) {
      console.error("Error loading seller info:", error);
    }
  };

  const handleBuy = async (itemId, itemName, price) => {
    const success = await buyItem(itemId, itemName, price);
    if (success) {
      setSelectedItem(null);
      // Optionally reload items after purchase
      setTimeout(() => {
        loadActiveItems();
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse all active items from the blockchain
          </p>
        </div>
        <button
          onClick={loadActiveItems}
          disabled={loading}
          className="text-sm text-indigo-600 hover:text-indigo-800 underline disabled:text-gray-400"
