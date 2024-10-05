import React, { useState } from 'react';
import OrderForm from './OrderForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = ({ dishes, orders, setOrders, setDishes }) => {
  const [orderFormVisible, setOrderFormVisible] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const toggleDishSelection = (dish) => {
    if (dish.available_quantity === 0) {
      toast.error(`"${dish.name}" is currently out of stock. Please come back later.`);
      return;
    }

    setSelectedDishes(prev => {
      const newSelection = { ...prev };
      if (newSelection[dish.id]) {
        delete newSelection[dish.id];
      } else {
        newSelection[dish.id] = { dish, quantity: 1 };
      }
      return newSelection;
    });
  };

  const updateQuantity = (dish, quantity) => {
    if (quantity < 1 || quantity > dish.available_quantity) {
      return; // Prevent invalid quantities
    }
    setSelectedDishes(prev => ({
      ...prev,
      [dish.id]: { ...prev[dish.id], quantity },
    }));
  };

  const placeOrder = (orderDetails) => {
    let exceedsAvailability = false;

    // Check availability
    for (const item of Object.values(selectedDishes)) {
      const dish = dishes.find(d => d.id === item.dish.id);
      if (!dish || item.quantity > dish.available_quantity) {
        exceedsAvailability = true;
        break;
      }
    }

    if (exceedsAvailability) {
      setErrorMessage('Some dishes are no longer available. Please adjust your order.');
      toast.error('Unable to place order due to insufficient stock.');
      return;
    }

    // Update the available quantities
    const updatedDishes = dishes.map(dish => {
      const selected = selectedDishes[dish.id];
      if (selected) {
        return { ...dish, available_quantity: dish.available_quantity - selected.quantity };
      }
      return dish;
    });

    setDishes(updatedDishes); // Update dishes state in App.js

    // Create the order
    setOrders([...orders, { dishes: Object.values(selectedDishes), ...orderDetails }]);
    setSelectedDishes({});
    setOrderFormVisible(false);
    setErrorMessage('');
    toast.success('Order placed successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 border border-red-300 rounded">
          {errorMessage}
        </div>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map(dish => (
          <li key={dish.id} className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition">
            <img src={dish.image_url} alt={dish.name} className="w-full h-48 object-cover rounded-md mb-2" />
            <h3 className="font-semibold">{dish.name}</h3>
            <p className="text-gray-600">${dish.price}</p>
            <p className="text-gray-500">Available: {dish.available_quantity? dish.available_quantity :"Not Available"}</p>
            {dish.available_quantity > 0 && (
              <div>
                <button 
                  className={`mt-2 px-4 py-2 text-white rounded ${selectedDishes[dish.id] ? 'bg-red-500' : 'bg-green-500'} hover:bg-opacity-80`}
                  onClick={() => toggleDishSelection(dish)}
                >
                  {selectedDishes[dish.id] ? 'Remove' : 'Add'}
                </button>
                {selectedDishes[dish.id] && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="1"
                      max={dish.available_quantity}
                      value={selectedDishes[dish.id]?.quantity || 1}
                      onChange={(e) => updateQuantity(dish, parseInt(e.target.value))}
                      className="border rounded w-full p-1"
                    />
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {Object.keys(selectedDishes).length > 0 && (
        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setOrderFormVisible(true)}
        >
          Place Order
        </button>
      )}
      {orderFormVisible && (
        <OrderForm
          onSubmit={placeOrder}
          onClose={() => setOrderFormVisible(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Menu;
