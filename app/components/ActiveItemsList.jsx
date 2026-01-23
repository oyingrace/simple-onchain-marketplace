
"use client";

import React, { useEffect, useState } from "react";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";
import ItemDetailsModal from "./ItemDetailsModal.jsx";

/**
 * ActiveItemsList Component
 * Fetches and displays all active items from the smart contract
 * Replaces hardcoded item lists
 */
const ActiveItemsList = () => {
  const {
    isConnected,
    buyItem,
    getActiveItems,
    getSellerForItem,
    message,
    clearMessage,
  } = useContract();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellerInfo, setSellerInfo] = useState({});

  useEffect(() => {
    loadActiveItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      loadSellerInfo(selectedItem.itemId);
    }
  }, [selectedItem]);

  const loadActiveItems = async () => {
    setLoading(true);
    try {
