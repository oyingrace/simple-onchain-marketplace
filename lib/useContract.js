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

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  return {
    walletAddress,
    isConnected,
    isConnecting,
    message,
    connectWallet,
    disconnectWallet,
    buyItem,
    clearMessage,
  };
};
