"use client";

import React from "react";
import { formatEthPrice } from "../../lib/contract.js";

/**
 * ItemDetailsModal Component
 * Displays detailed information about an item in a modal
 * 
 * Props:
 * - item: { itemId, name, description, price, imageUrl, seller, isActive }
 * - isOpen: boolean
 * - onClose: () => void
 * - onBuy: (itemId, itemName, price) => void
 * - isConnected: boolean
 * - sellerName?: string (optional seller name)
 */
const ItemDetailsModal = ({
  item,
  isOpen,
  onClose,
  onBuy,
  isConnected,
  sellerName,
}) => {
  if (!isOpen || !item) return null;

  const handleBuy = () => {
    if (onBuy && isConnected) {
      onBuy(item.itemId, item.name, item.price);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-w-full max-h-[300px] object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Item #{item.itemId}
                  </span>
                </div>
              </div>
