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
    clearMessage,
  };
};
