
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
        this.signer = null;
        this.contract = null;
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  // Buy an item
  async buyItem(itemId, itemName, priceInEth) {
    try {
      if (!this.contract || !this.signer) {
        return {
          success: false,
          message: 'Wallet not connected. Please connect your wallet first.'
        };
      }

      // Convert price from ETH to Wei
      const priceInWei = ethers.parseEther(priceInEth.replace(' ETH', ''));

      // Call the buyItem function
      const tx = await this.contract.buyItem(
        ethers.getBigInt(itemId.replace('HS', '')), // Convert "HS001" to 1
        itemName,
        { value: priceInWei }
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        message: `Successfully purchased ${itemName}! Transaction confirmed.`,
        txHash: receipt.hash
      };

    } catch (error) {
      console.error('Error buying item:', error);
      return {
        success: false,
        message: `Failed to purchase item: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Create a new item listing
  async createItem(name, description, priceInEth, imageUrl) {
    try {
      if (!this.contract || !this.signer) {
        return {
          success: false,
          message: 'Wallet not connected. Please connect your wallet first.'
        };
      }

      // Convert price from ETH to Wei
      const priceInWei = ethers.parseEther(priceInEth.replace(' ETH', '').trim());

      // Call the createItem function
      const tx = await this.contract.createItem(
        name,
        description,
        priceInWei,
        imageUrl
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Get the itemId from the transaction receipt (from event)
      const itemId = receipt.logs[0]?.args?.itemId || null;

      return {
        success: true,
        message: `Successfully created item: ${name}!`,
        itemId: itemId ? itemId.toString() : null,
        txHash: receipt.hash
      };

    } catch (error) {
      console.error('Error creating item:', error);
      return {
        success: false,
        message: `Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Update an existing item listing
  async updateItem(itemId, name, description, priceInEth, imageUrl) {
    try {
      if (!this.contract || !this.signer) {
        return {
          success: false,
          message: 'Wallet not connected. Please connect your wallet first.'
        };
      }

      // Convert price from ETH to Wei
      const priceInWei = ethers.parseEther(priceInEth.replace(' ETH', '').trim());

      // Convert itemId to number (handle both "HS001" format and numeric strings)
      const numericItemId = typeof itemId === 'string' && itemId.startsWith('HS') 
        ? ethers.getBigInt(itemId.replace('HS', ''))
        : ethers.getBigInt(itemId.toString());

      // Call the updateItem function
      const tx = await this.contract.updateItem(
        numericItemId,
        name,
        description,
        priceInWei,
        imageUrl
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        message: `Successfully updated item: ${name}!`,
        txHash: receipt.hash
      };

    } catch (error) {
      console.error('Error updating item:', error);
      return {
        success: false,
        message: `Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Remove (deactivate) an item listing
  async removeItem(itemId) {
    try {
      if (!this.contract || !this.signer) {
        return {
          success: false,
          message: 'Wallet not connected. Please connect your wallet first.'
        };
      }

      const numericItemId = ethers.getBigInt(itemId.toString());

      const tx = await this.contract.removeItem(numericItemId);
      const receipt = await tx.wait();

      return {
        success: true,
        message: `Item ${numericItemId.toString()} removed successfully!`,
        txHash: receipt.hash
      };
    } catch (error) {
      console.error('Error removing item:', error);
      return {
        success: false,
        message: `Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get all items listed by a specific seller
  async getItemsBySeller(sellerAddress) {
    try {
      if (!this.contract) {
        return {
          success: false,
          message: 'Contract not initialized. Please connect your wallet first.'
        };
      }

      const items = await this.contract.getItemsBySeller(sellerAddress);
      return {
        success: true,
        items
      };
    } catch (error) {
      console.error('Error getting items by seller:', error);
      return {
        success: false,
        message: `Failed to get items: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get all active items
  async getActiveItems() {
    try {
      if (!this.contract) {
        return {
          success: false,
          message: 'Contract not initialized. Please connect your wallet first.'
        };
      }

      const items = await this.contract.getActiveItems();
      return {
        success: true,
        items
      };
    } catch (error) {
      console.error('Error getting active items:', error);
      return {
        success: false,
        message: `Failed to get active items: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get all purchases
  async getPurchases() {
    try {
      if (!this.contract) {
        return {
          success: false,
          message: 'Contract not initialized. Please connect your wallet first.'
        };
      }

      const purchases = await this.contract.getPurchases();
      return {
        success: true,
        purchases: purchases
      };

    } catch (error) {
      console.error('Error getting purchases:', error);
      return {
        success: false,
        message: `Failed to get purchases: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Register as a seller
  async registerSeller(sellerName) {
    try {
      if (!this.sellerRegistry || !this.signer) {
        return {
          success: false,
          message: 'Wallet not connected. Please connect your wallet first.'
        };
      }

      const tx = await this.sellerRegistry.registerSeller(sellerName);
      await tx.wait();

      return {
        success: true,
        message: `Successfully registered as seller: ${sellerName}!`
      };

    } catch (error) {
      console.error('Error registering seller:', error);
      return {
        success: false,
        message: `Failed to register seller: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Assign an item to a seller
  async assignItemToSeller(itemId, sellerAddress) {
    try {
      if (!this.contract || !this.signer) {
        return {
          success: false,
          message: 'Wallet not connected. Please connect your wallet first.'
        };
      }

      const tx = await this.contract.assignItemToSeller(
        ethers.getBigInt(itemId.replace('HS', '')),
        sellerAddress
      );
      await tx.wait();

      return {
        success: true,
        message: `Item ${itemId} assigned to seller successfully!`
      };

    } catch (error) {
      console.error('Error assigning item to seller:', error);
      return {
        success: false,
        message: `Failed to assign item: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get seller information
  async getSeller(sellerAddress) {
    try {
      if (!this.sellerRegistry) {
        return {
          success: false,
          message: 'Seller registry not initialized.'
        };
      }

      const seller = await this.sellerRegistry.getSeller(sellerAddress);
      return {
        success: true,
        seller: seller
      };

    } catch (error) {
      console.error('Error getting seller:', error);
      return {
        success: false,
        message: `Failed to get seller: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get seller for an item
  async getSellerForItem(itemId) {
    try {
      if (!this.contract) {
        return {
          success: false,
          message: 'Contract not initialized.'
        };
      }

      const sellerAddress = await this.contract.getSellerForItem(
        ethers.getBigInt(itemId.replace('HS', ''))
      );

      if (sellerAddress === ethers.ZeroAddress) {
        return {
          success: true,
          sellerAddress: null,
          message: 'Item not assigned to any seller'
        };
      }

      // Get seller details
      const sellerInfo = await this.getSeller(sellerAddress);
      
      return {
        success: true,
        sellerAddress: sellerAddress,
        seller: sellerInfo.success ? sellerInfo.seller : null
      };

    } catch (error) {
      console.error('Error getting seller for item:', error);
      return {
        success: false,
        message: `Failed to get seller: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Check if address is a registered seller
  async isSeller(sellerAddress) {
    try {
      if (!this.sellerRegistry) {
        return false;
      }

      return await this.sellerRegistry.isSeller(sellerAddress);

    } catch (error) {
      console.error('Error checking seller status:', error);
      return false;
    }
  }

  // Get current wallet address
  async getCurrentAddress() {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  // Check if wallet is connected
  isConnected() {
    return this.session !== null && this.contract !== null && this.signer !== null;
  }
}

// Create and export a singleton instance
export const marketplaceContract = new MarketplaceContract();

// Utility function to format ETH price
