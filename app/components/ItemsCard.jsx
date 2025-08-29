"use client";

import React from 'react';
import { useContract } from '../../lib/useContract.js';

const ItemsCard = ({ items = [] }) => {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    message,
    connectWallet,
    disconnectWallet,
    buyItem,
    clearMessage,
  } = useContract();

  const handleBuy = async (itemId, itemName, price) => {
    const success = await buyItem(itemId, itemName, price);
    if (success) {
      // Purchase was successful
      console.log(`Successfully purchased ${itemName}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      

      <div className="mb-6 text-center">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Connected:</span> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
            <button
              onClick={disconnectWallet}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Disconnect
            </button>
          </div>
        )}
        
        {message && (
          <div className={`mt-2 text-sm ${message.includes('✅') ? 'text-green-600' : message.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
            {message}
            <button
              onClick={clearMessage}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-5">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            {/* Image Container */}
            <div className="relative bg-gray-50 p-2 sm:p-4">
              <div className="aspect-square w-full flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-50 h-50 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-2 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                {item.itemName}
              </h3>
              
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-base sm:text-lg font-bold text-indigo-600">
                  {item.price}
                </span>
              </div>

              <button
                onClick={() => handleBuy(item.itemId, item.itemName, item.price)}
                disabled={!isConnected}
                className={`w-full font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm ${
                  !isConnected 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {!isConnected ? 'Connect Wallet' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 text-base">No items to display</p>
        </div>
      )}
    </div>
  );
};

// Headset Data
const App = () => {
  const sampleItems = [
    {
      itemId: "HS001",
      itemName: "Headset-Black",
      price: "0.000005 ETH",
      image: "/black.png"
    },
    {
      itemId: "HS002", 
      itemName: "Headset-Red",
      price: "0.000005 ETH",
      image: "/red.png"
    },
    {
      itemId: "HS003",
      itemName: "Headset-Blue",
      price: "0.000005 ETH", 
      image: "/blue.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ItemsCard items={sampleItems} />
    </div>
  );
};

export default App;