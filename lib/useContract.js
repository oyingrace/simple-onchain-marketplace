import { useState, useEffect, useCallback } from 'react';
import { marketplaceContract } from './contract.js';

export const useContract = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  // Check wallet connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = useCallback(async () => {
    if (marketplaceContract.isConnected()) {
      const address = await marketplaceContract.getCurrentAddress();
      setWalletAddress(address || '');
      setIsConnected(true);
      
      // Check if user is a registered seller
      if (address) {
        const sellerStatus = await marketplaceContract.isSeller(address);
        setIsSeller(sellerStatus);
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setMessage('');
    
    try {
      const result = await marketplaceContract.connectWallet();
      if (result.success && result.address) {
        setWalletAddress(result.address);
        setIsConnected(true);
        setMessage('Wallet connected successfully!');
        
        // Check if user is a registered seller
        const sellerStatus = await marketplaceContract.isSeller(result.address);
        setIsSeller(sellerStatus);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      await marketplaceContract.disconnectWallet();
      setWalletAddress('');
      setIsConnected(false);
      setMessage('Wallet disconnected');
    } catch (error) {
      setMessage('Failed to disconnect wallet');
    }
  }, []);

  const buyItem = useCallback(async (itemId, itemName, price) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return false;
    }

    setMessage('Processing purchase...');

    try {
      const result = await marketplaceContract.buyItem(itemId, itemName, price);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        return true;
      } else {
        setMessage(`❌ ${result.message}`);
        return false;
      }
    } catch (error) {
      setMessage(`❌ Purchase failed: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, [isConnected]);

  const registerSeller = useCallback(async (sellerName) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return false;
    }

    setMessage('Registering as seller...');

    try {
      const result = await marketplaceContract.registerSeller(sellerName);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setIsSeller(true);
        return true;
      } else {
        setMessage(`❌ ${result.message}`);
        return false;
      }
    } catch (error) {
      setMessage(`❌ Registration failed: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, [isConnected]);

  const assignItemToSeller = useCallback(async (itemId, sellerAddress) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return false;
    }

    setMessage('Assigning item to seller...');

    try {
      const result = await marketplaceContract.assignItemToSeller(itemId, sellerAddress);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        return true;
      } else {
        setMessage(`❌ ${result.message}`);
        return false;
      }
    } catch (error) {
      setMessage(`❌ Assignment failed: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, [isConnected]);

  const createItem = useCallback(async (name, description, price, imageUrl) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return { success: false };
    }

    setMessage('Creating item...');

    try {
      const result = await marketplaceContract.createItem(name, description, price, imageUrl);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        return result;
      }
      setMessage(`❌ ${result.message}`);
      return result;
    } catch (error) {
      setMessage(`❌ Failed to create item: ${error.message || 'Unknown error'}`);
      return { success: false };
    }
  }, [isConnected]);

  const updateItem = useCallback(async (itemId, name, description, price, imageUrl) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return { success: false };
    }

    setMessage('Updating item...');

    try {
      const result = await marketplaceContract.updateItem(itemId, name, description, price, imageUrl);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        return result;
      }
      setMessage(`❌ ${result.message}`);
      return result;
    } catch (error) {
      setMessage(`❌ Failed to update item: ${error.message || 'Unknown error'}`);
      return { success: false };
    }
  }, [isConnected]);

  const removeItem = useCallback(async (itemId) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return { success: false };
    }

    setMessage('Removing item...');

    try {
      const result = await marketplaceContract.removeItem(itemId);

      if (result.success) {
        setMessage(`✅ ${result.message}`);
        return result;
      }
      setMessage(`❌ ${result.message}`);
      return result;
    } catch (error) {
      setMessage(`❌ Failed to remove item: ${error.message || 'Unknown error'}`);
      return { success: false };
    }
  }, [isConnected]);

  const getItemsBySeller = useCallback(async (sellerAddress) => {
    try {
      const result = await marketplaceContract.getItemsBySeller(sellerAddress);
      return result;
    } catch (error) {
      console.error('Error getting items by seller:', error);
      return { success: false, items: [] };
    }
  }, []);

  const getPurchases = useCallback(async () => {
    try {
      const result = await marketplaceContract.getPurchases();
      return result;
    } catch (error) {
      console.error('Error getting purchases:', error);
      return { success: false, purchases: [] };
    }
  }, []);

  const getSeller = useCallback(async (address) => {
    try {
      const result = await marketplaceContract.getSeller(address);
      return result;
    } catch (error) {
      console.error('Error getting seller info:', error);
      return { success: false, seller: null };
    }
  }, []);

  const getSellerForItem = useCallback(async (itemId) => {
    try {
      const result = await marketplaceContract.getSellerForItem(itemId);
      return result;
    } catch (error) {
      console.error('Error getting seller for item:', error);
      return { success: false, seller: null };
    }
  }, []);

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  return {
    walletAddress,
    isConnected,
    isConnecting,
    message,
    isSeller,
    connectWallet,
    disconnectWallet,
    buyItem,
    registerSeller,
    assignItemToSeller,
    getSellerForItem,
    createItem,
    updateItem,
    removeItem,
    getItemsBySeller,
    getPurchases,
    getSeller,
    clearMessage,
  };
};
