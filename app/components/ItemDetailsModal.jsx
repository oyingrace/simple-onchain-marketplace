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
