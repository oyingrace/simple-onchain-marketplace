"use client";

import React, { useEffect, useState } from "react";
import SellerItemsPanel from "./SellerItemsPanel";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";

const ensureEthSuffix = (price) => {
  if (!price) return "0 ETH";
  const trimmed = price.trim();
  return trimmed.toUpperCase().includes("ETH") ? trimmed : `${trimmed} ETH`;
};

const ItemManagement = () => {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    isSeller,
    message,
