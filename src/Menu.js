import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderForm from './OrderForm';

const Menu = ({ orders, setOrders }) => {
  const [dishes, setDishes] = useState([]);
  const [orderFormVisible, setOrderFormVisible] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await axios.get("https://api.jsonbin.io/v3/b/66faa41facd3cb34a88ed968");
      setDishes(response.data.record);
    };
    fetchDishes();
  }, []);

  const toggleDishSelection = (dish) => {
    setSelectedDishes(prev => {
      const newSelection = { ...prev };
      if (newSelection[dish.id]) {
        delete newSelection[dish.id]; // Remove the dish if already selected
      } else {
        newSelection[dish.id] = { dish, quantity: 1 }; // Select the dish with initial quantity of 1
      }
      return newSelection;
    });
  };

  const updateQuantity = (dish, quantity) => {
    if (quantity < 1) return; // Prevent setting quantity below 1
    setSelectedDishes(prev => ({
      ...prev,
      [dish.id]: { ...prev[dish.id], quantity: Math.min(quantity, dish.available_quantity) }, // Ensure max quantity doesn't exceed available
    }));
  };

  const placeOrder = (orderDetails) => {
    let exceedsAvailability = false;

    for (const item of Object.values(selectedDishes)) {
      if (item.quantity > item.dish.available_quantity) {
        exceedsAvailability = true;
        break;
      }
    }

    if (exceedsAvailability) {
      setErrorMessage('You cannot order more than the available quantity for one or more dishes.');
      return;
    }

    // Create the order and reset states
    setOrders([...orders, { dishes: Object.values(selectedDishes), ...orderDetails }]);
    setSelectedDishes({});
    setOrderFormVisible(false);
    setErrorMessage('');
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
            <p className="text-gray-500">Available: {dish.available_quantity}</p>
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
    </div>
  );
};

export default Menu;
