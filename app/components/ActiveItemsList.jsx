
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
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes("✅")
              ? "bg-green-50 text-green-700"
              : message.includes("❌")
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {message}
          <button
            onClick={clearMessage}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading items from blockchain...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            No active items found. Sellers can create items to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div className="relative bg-gray-50 p-4">
                <div className="aspect-square w-full flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.name}
                </h3>

                {sellerInfo[item.itemId] && (
                  <div className="text-xs text-gray-500 mb-2">
