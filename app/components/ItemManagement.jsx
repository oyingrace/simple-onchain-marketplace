"use client";

import React, { useEffect, useState } from "react";
import SellerItemsPanel from "./SellerItemsPanel";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";

const ensureEthSuffix = (price) => {
  if (!price) return "0 ETH";
  const trimmed = price.trim();
  return trimmed.toUpperCase().includes("ETH") ? trimmed : `${trimmed} ETH`;
};

const ItemManagement = () => {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    isSeller,
    message,
    connectWallet,
    registerSeller,
    createItem,
    updateItem,
    removeItem,
    getItemsBySeller,
    clearMessage,
  } = useContract();

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const loadItems = async () => {
    if (!walletAddress || !isConnected) return;
    setLoadingItems(true);
    const result = await getItemsBySeller(walletAddress);
    if (result?.success && Array.isArray(result.items)) {
      const normalized = result.items.map((it) => ({
        itemId: it.itemId?.toString?.() ?? `${it.itemId}`,
        name: it.name,
        description: it.description,
        // On-chain price is in Wei; format for display
        price: formatEthPrice(it.price),
        imageUrl: it.imageUrl,
        seller: it.seller,
        isActive: it.isActive,
      }));
      setItems(normalized);
    } else {
      setItems([]);
    }
    setLoadingItems(false);
  };

  useEffect(() => {
    if (isConnected && walletAddress && isSeller) {
      loadItems();
    }
  }, [isConnected, walletAddress, isSeller]);

  const handleCreate = async (values) => {
    const priceWithEth = ensureEthSuffix(values.price);
    const result = await createItem(
      values.name,
      values.description,
      priceWithEth,
      values.imageUrl
    );
    if (result?.success) {
      await loadItems();
    } else if (!result?.success && result?.message) {
      // message already set by hook; no-op
    }
  };

  const handleUpdate = async (itemId, values) => {
    const priceWithEth = ensureEthSuffix(values.price);
    const numericId = itemId.toString();
    const result = await updateItem(
      numericId,
      values.name,
      values.description,
      priceWithEth,
      values.imageUrl
    );
    if (result?.success) {
      await loadItems();
    }
  };

  const handleRemove = async (itemId) => {
