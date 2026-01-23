
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
        "internalType": "string",
        "name": "_itemName",
        "type": "string"
      }
    ],
    "name": "buyItem",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPurchases",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "itemName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "seller",
            "type": "address"
          }
        ],
        "internalType": "struct SimpleMarketplace.Purchase[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_seller",
        "type": "address"
      }
    ],
    "name": "assignItemToSeller",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "getSellerForItem",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_imageUrl",
        "type": "string"
      }
    ],
    "name": "createItem",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_imageUrl",
        "type": "string"
      }
    ],
    "name": "updateItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "removeItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_seller",
        "type": "address"
      }
    ],
    "name": "getItemsBySeller",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "imageUrl",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct SimpleMarketplace.Item[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveItems",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "imageUrl",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct SimpleMarketplace.Item[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Seller Registry ABI
const SELLER_REGISTRY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "registerSeller",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_seller",
        "type": "address"
      }
    ],
    "name": "getSeller",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sellerAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRegistered",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "itemCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct SellerRegistry.Seller",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "getSellerForItem",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_seller",
        "type": "address"
      }
    ],
    "name": "isSeller",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract configuration
const MARKETPLACE_ADDRESS = '0x5751E10eCf04a7a6776e3918Aabe4C1C59f69e57'; // Update after deployment
const SELLER_REGISTRY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Update after deployment
const NETWORK_CONFIG = {
  chainId: '0x14a34', // Base Sepolia chainId in hex (84532)
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
};

// Contract helper class
export class MarketplaceContract {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.sellerRegistry = null;
    this.universalConnector = null;
    this.session = null;
  }

  // Initialize WalletConnect
  async initializeWalletConnect() {
    if (!this.universalConnector) {
      this.universalConnector = await getUniversalConnector();
    }
    return this.universalConnector;
  }

  // Connect wallet and initialize contract
  async connectWallet() {
    try {
      // Initialize WalletConnect
      const universalConnector = await this.initializeWalletConnect();
      
      if (!universalConnector) {
        return {
          success: false,
          message: 'Failed to initialize WalletConnect. Please try again.'
        };
      }

      // Connect using WalletConnect
      const { session: providerSession } = await universalConnector.connect();
      this.session = providerSession;

      if (!this.session) {
        return {
          success: false,
          message: 'Failed to connect wallet. Please try again.'
        };
      }

      // Get the account address
      const account = this.session.namespaces.eip155.accounts[0].split(':')[2];

      // Create provider and signer using WalletConnect
      this.provider = new ethers.BrowserProvider(universalConnector.provider);
      this.signer = await this.provider.getSigner();
      
      // Create contract instances
      this.contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, this.signer);
      this.sellerRegistry = new ethers.Contract(SELLER_REGISTRY_ADDRESS, SELLER_REGISTRY_ABI, this.signer);

      return {
        success: true,
        message: 'Wallet connected successfully!',
        address: account
      };

    } catch (error) {
      console.error('Error connecting wallet:', error);
      return {
        success: false,
        message: `Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Disconnect wallet
  async disconnectWallet() {
    try {
      if (this.universalConnector) {
        await this.universalConnector.disconnect();
        this.session = null;
        this.provider = null;
