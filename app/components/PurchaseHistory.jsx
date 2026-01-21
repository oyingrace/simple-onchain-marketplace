
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
