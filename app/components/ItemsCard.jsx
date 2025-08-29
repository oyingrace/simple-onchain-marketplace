"use client";

import React from 'react';

const ItemsCard = ({ items = [] }) => {
  const handleBuy = (itemId, itemName, price) => {
    console.log(`Purchasing ${itemName} (ID: ${itemId}) for ${price}`);
    // Add your purchase logic here
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm"
              >
                Buy Now
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

// Example usage with sample data
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