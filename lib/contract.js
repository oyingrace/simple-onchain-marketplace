
import { ethers } from 'ethers';
import { getUniversalConnector } from './walletConnectConfig.js';

// Marketplace Contract ABI
const MARKETPLACE_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      },
      {
