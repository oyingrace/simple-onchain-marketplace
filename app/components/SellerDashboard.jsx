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
