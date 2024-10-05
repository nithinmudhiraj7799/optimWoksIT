

// src/App.js
import React, { useState } from 'react';
import Menu from './Menu';
import OrderHistory from './OrderHistory';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [viewOrderHistory, setViewOrderHistory] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Restaurant Order System</h1>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          onClick={() => setViewOrderHistory(!viewOrderHistory)}
        >
          {viewOrderHistory ? 'View Menu' : 'View Order History'}
        </button>
        {viewOrderHistory ? (
          <OrderHistory orders={orders} />
        ) : (
          <Menu orders={orders} setOrders={setOrders} />
        )}
      </div>
    </div>
  );
};

export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Data from './dataFetch'; // Your Data component
// import Cart from './Cart'; // Your Cart component

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Data />} />
//         <Route path="/cart" element={<Cart />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App; // Ensure this line is here to export App

