import { ethers } from 'ethers';

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
  }

  // Connect wallet and initialize contract
  async connectWallet() {
    try {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !window.ethereum) {
        return {
          success: false,
          message: 'MetaMask is not installed. Please install MetaMask to continue.'
        };
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      if (!account) {
        return {
          success: false,
          message: 'No accounts found. Please connect your wallet.'
        };
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Create contract instance
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(84532)) { // Base Sepolia chainId
        await this.switchToBaseSepolia();
      }

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

  // Switch to Base Sepolia network
  async switchToBaseSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG],
        });
      } else {
        throw switchError;
      }
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
    return this.contract !== null && this.signer !== null;
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
