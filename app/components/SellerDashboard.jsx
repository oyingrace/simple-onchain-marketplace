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
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);

  useEffect(() => {
    if (!isConnected || !walletAddress) return;
    loadPurchases();
    loadSellerDetails();
  }, [isConnected, walletAddress]);

  const loadSellerDetails = async () => {
    setLoadingSeller(true);
    const result = await getSeller(walletAddress);
    if (result?.success && result.seller) {
      setSellerDetails(result.seller);
    } else {
      setSellerDetails(null);
    }
    setLoadingSeller(false);
  };

  const loadPurchases = async () => {
    setLoadingPurchases(true);
    const result = await getPurchases();
    if (result?.success && Array.isArray(result.purchases)) {
      const normalized = result.purchases.map((p) => ({
        itemId: p.itemId?.toString?.() ?? `${p.itemId}`,
        itemName: p.itemName,
        price: p.price,
        buyer: p.buyer,
        seller: p.seller,
      }));
      setPurchases(normalized);
    } else {
