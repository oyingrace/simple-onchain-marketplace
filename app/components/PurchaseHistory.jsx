
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
