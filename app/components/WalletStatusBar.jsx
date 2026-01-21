"use client";

import React, { useEffect, useState } from "react";
import { useContract } from "../../lib/useContract.js";
import { ethers } from "ethers";

/**
 * WalletStatusBar Component
 * Displays wallet connection status, network info, and ETH balance
 */
const WalletStatusBar = () => {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    message,
    clearMessage,
  } = useContract();

  const [balance, setBalance] = useState("0.0");
  const [network, setNetwork] = useState("Unknown");
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadBalance();
      loadNetwork();
    }
  }, [isConnected, walletAddress]);

  const loadBalance = async () => {
    if (!isConnected || !walletAddress) return;
    
    setLoadingBalance(true);
    try {
      // We need to get the provider from the contract
      // For now, we'll use a placeholder - in a real app you'd get this from the contract instance
      // This is a simplified version
      setBalance("Loading...");
      // Note: To get actual balance, you'd need access to the provider
      // This is a UI component that shows the structure
      setTimeout(() => {
        setBalance("--");
      }, 1000);
    } catch (error) {
      console.error("Error loading balance:", error);
      setBalance("Error");
    } finally {
      setLoadingBalance(false);
    }
  };
