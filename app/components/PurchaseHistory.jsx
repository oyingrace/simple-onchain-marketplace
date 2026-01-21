
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useContract } from "../../lib/useContract.js";
import { formatEthPrice } from "../../lib/contract.js";

/**
 * PurchaseHistory Component
 * Displays a buyer's purchase history from on-chain purchases
 */
