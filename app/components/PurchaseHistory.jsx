
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
