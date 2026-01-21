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

  const loadNetwork = async () => {
    try {
      // Check if we're on Base Sepolia
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network.name || `Chain ${network.chainId}`);
      } else {
        setNetwork("Base Sepolia");
      }
    } catch (error) {
      console.error("Error loading network:", error);
      setNetwork("Unknown");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Wallet Status</p>
            <p className="text-lg font-semibold">Not Connected</p>
          </div>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-white text-indigo-600 hover:bg-gray-100 disabled:bg-gray-300 font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
