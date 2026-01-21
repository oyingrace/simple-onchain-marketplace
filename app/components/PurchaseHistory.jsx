
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";

/**
 * PurchaseHistory Component
 * Displays a buyer's purchase history from on-chain purchases
 */
const PurchaseHistory = () => {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    getPurchases,
    message,
    clearMessage,
  } = useContract();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadPurchases();
    }
  }, [isConnected, walletAddress]);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const result = await getPurchases();
      if (result?.success && Array.isArray(result.purchases)) {
        // Filter purchases for the current buyer
        const buyerPurchases = result.purchases.filter(
          (p) => p.buyer?.toLowerCase() === walletAddress.toLowerCase()
        );
        setPurchases(buyerPurchases);
      } else {
        setPurchases([]);
      }
    } catch (error) {
      console.error("Error loading purchases:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = useMemo(() => {
    const total = purchases.reduce((sum, p) => {
      try {
        const price = formatEthPrice(p.price);
        const priceNumber = parseFloat(price.replace(" ETH", ""));
        return sum + (Number.isNaN(priceNumber) ? 0 : priceNumber);
      } catch {
        return sum;
      }
    }, 0);
    return total.toFixed(6);
  }, [purchases]);

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Purchase History
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Connect your wallet to view your purchase history
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Purchase History</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Total Spent:</span>{" "}
            <span className="text-indigo-600 font-semibold">
              {totalSpent} ETH
            </span>
          </div>
          <button
            onClick={loadPurchases}
            disabled={loading}
            className="text-sm text-indigo-600 hover:text-indigo-800 underline disabled:text-gray-400"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 text-sm p-3 rounded-md ${
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
        <div className="text-center py-8">
          <p className="text-gray-500">Loading purchase history...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-8">
