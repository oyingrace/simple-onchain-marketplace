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
    const total = sellerPurchases.reduce((sum, p) => {
      const priceNumber = parseFloat(formatPrice(p.price));
      return sum + (Number.isNaN(priceNumber) ? 0 : priceNumber);
    }, 0);
    return total.toFixed(6);
  }, [sellerPurchases]);

  const summaryCards = [
    {
      label: "Seller status",
      value: loadingSeller
        ? "Checking..."
        : isSeller
        ? "Registered"
        : "Not registered",
    },
    {
      label: "Items you’ve created",
      value: items.length.toString(),
    },
    {
      label: "Purchases for you",
      value: sellerPurchases.length.toString(),
    },
    {
      label: "Total earned",
      value: `${totalEarnings} ETH`,
    },
  ];

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Seller Dashboard
          </h2>
          <p className="text-sm text-gray-600">
            Create and manage your listings, view purchases, and track your
            earnings on-chain.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow border border-gray-100 flex flex-col gap-3">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-gray-700 text-sm">
                Connect your wallet to register as a seller and manage items.
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="self-start bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Connected:</span>{" "}
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
              {!isSeller && (
                <button
                  onClick={() => registerSeller("New Seller")}
                  className="self-start bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Register as Seller
                </button>
              )}
              {isSeller && (
                <div className="text-sm text-green-600 font-medium">
                  ✓ Registered seller
                </div>
              )}
            </div>
          )}
          {message && (
            <div
              className={`text-sm ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("❌")
                  ? "text-red-600"
                  : "text-blue-600"
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-semibold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <SellerItemsPanel
            items={items}
            loading={false}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            onRefresh={loadPurchases}
          />
        </div>

        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Purchases (on-chain)
            </h3>
            <button
              type="button"
              onClick={loadPurchases}
              disabled={loadingPurchases}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline disabled:text-gray-400"
            >
              {loadingPurchases ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loadingPurchases ? (
            <p className="text-sm text-gray-500">Loading purchases...</p>
          ) : purchases.length === 0 ? (
            <p className="text-sm text-gray-500">
              No purchases yet. Share your items to start selling.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Item
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Buyer
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Seller
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Price
