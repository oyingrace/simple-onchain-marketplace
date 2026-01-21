"use client";

import React, { useEffect, useMemo, useState } from "react";
import SellerItemsPanel from "./SellerItemsPanel";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";

const formatPrice = (value) => {
  try {
    return formatEthPrice(value);
  } catch {
    return "0 ETH";
  }
};

const ensureEthSuffix = (price) => {
  if (!price) return "0 ETH";
  return price.toUpperCase().includes("ETH") ? price : `${price} ETH`;
};

const SellerDashboard = () => {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    message,
    isSeller,
    connectWallet,
    registerSeller,
    createItem,
    updateItem,
    getPurchases,
    getSeller,
    clearMessage,
  } = useContract();

  const [items, setItems] = useState([]);
