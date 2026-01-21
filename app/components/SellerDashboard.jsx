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
      setPurchases([]);
    }
    setLoadingPurchases(false);
  };

  const handleCreate = async (values) => {
    const priceWithEth = ensureEthSuffix(values.price);
    const result = await createItem(
      values.name,
      values.description,
      priceWithEth,
      values.imageUrl
    );
    if (result?.success) {
      const newId =
        result.itemId?.toString?.() ?? `TEMP-${Date.now().toString()}`;
      setItems((prev) => [
        ...prev,
        {
          itemId: newId,
          name: values.name,
          description: values.description,
          price: priceWithEth,
          imageUrl: values.imageUrl,
          isActive: true,
        },
      ]);
    }
  };

  const handleUpdate = async (itemId, values) => {
    const priceWithEth = ensureEthSuffix(values.price);
    const result = await updateItem(
      itemId,
      values.name,
      values.description,
      priceWithEth,
      values.imageUrl
    );
    if (result?.success) {
      setItems((prev) =>
        prev.map((item) =>
          `${item.itemId}` === `${itemId}`
            ? { ...item, ...values, price: priceWithEth }
            : item
        )
      );
    }
  };

  const handleRemove = async (itemId) => {
    setItems((prev) => prev.filter((item) => `${item.itemId}` !== `${itemId}`));
  };

  const sellerPurchases = useMemo(() => {
    if (!walletAddress) return [];
    return purchases.filter(
      (p) => p.seller?.toLowerCase() === walletAddress.toLowerCase()
    );
  }, [purchases, walletAddress]);

  const totalEarnings = useMemo(() => {
