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
