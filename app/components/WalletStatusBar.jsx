"use client";

import React, { useEffect, useState } from "react";
import { useContract } from "../../lib/useContract.js";
import { ethers } from "ethers";

/**
 * WalletStatusBar Component
 * Displays wallet connection status, network info, and ETH balance
