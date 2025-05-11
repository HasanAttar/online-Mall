import React, { createContext, useState } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <StoreContext.Provider value={{ cart, addToCart, removeFromCart, selectedStore, setSelectedStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
