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
    const numericId = itemId.toString();
    const result = await removeItem(numericId);
    if (result?.success) {
      await loadItems();
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Item Management
          </h2>
          <p className="text-sm text-gray-600">
            Create, update, and deactivate your marketplace items. All data is
            stored on-chain in the SimpleMarketplace contract.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow border border-gray-100 flex flex-col gap-3">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-gray-700 text-sm">
                Connect your wallet to manage your items.
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="self-start bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Connected:</span>{" "}
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
              {!isSeller && (
                <button
                  onClick={() => registerSeller("New Seller")}
                  className="self-start bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Register as Seller
                </button>
              )}
              {isSeller && (
                <div className="text-sm text-green-600 font-medium">
                  ✓ Registered seller
                </div>
              )}
            </div>
          )}
          {message && (
            <div
              className={`text-sm ${
                message.includes("✅")
