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
