import { ethers } from 'ethers';
import { getUniversalConnector } from './walletConnectConfig.js';

// Contract ABI - this should match the deployed contract
const CONTRACT_ABI = [
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
          }
        ],
        "internalType": "struct SimpleMarketplace.Purchase[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract configuration
const CONTRACT_ADDRESS = '0x5751E10eCf04a7a6776e3918Aabe4C1C59f69e57'; // the deployed contract address
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
      
      // Create contract instance
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

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
export const formatEthPrice = (priceInWei) => {
  try {
    const wei = typeof priceInWei === 'string' ? priceInWei : priceInWei.toString();
    const eth = ethers.formatEther(wei);
    return `${parseFloat(eth).toFixed(6)} ETH`;
  } catch {
    return '0 ETH';
  }
};

// Utility function to convert ETH to Wei
export const ethToWei = (ethAmount) => {
  try {
    return ethers.parseEther(ethAmount.replace(' ETH', '')).toString();
  } catch {
    return '0';
  }
};
