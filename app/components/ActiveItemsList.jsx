
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

