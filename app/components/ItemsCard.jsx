import React from 'react';

const ItemsCard = ({ items = [] }) => {
  const handleBuy = (itemId, itemName, price) => {
    console.log(`Purchasing ${itemName} (ID: ${itemId}) for ${price}`);
    // Add your purchase logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            {/* Image Container */}
            <div className="relative bg-gray-50 p-6">
              <div className="aspect-square w-full flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.itemName}
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-indigo-600">
                  {item.price}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {item.itemId}
                </span>
              </div>

              <button
                onClick={() => handleBuy(item.itemId, item.itemName, item.price)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No items to display</p>
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
      price: "0.05 ETH",
      image: "/black.png"
    },
    {
      itemId: "HS002", 
      itemName: "Headset-Red",
      price: "0.05 ETH",
      image: "/red.png"
    },
    {
      itemId: "HS003",
      itemName: "Headset-Blue",
      price: "0.05 ETH", 
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