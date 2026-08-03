import React, { createContext, useState, useContext, ReactNode } from 'react';

export type CartItem = {
  id: string; // unique cart item id (e.g., product_id OR product_id_var_id)
  productId: string; // The base product id
  name: string;
  price: number;
  quantity: number;
  variationName?: string; // Optional variation info
  type?: string; // veg or non-veg
  shopId?: string | null; // The shop this item belongs to
  cartItemId?: number; // Backend cart item ID
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  setCartItems: (items: CartItem[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === newItem.id);
      if (existingItemIndex > -1) {
        // Item exists, just increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }
      // New item
      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const setCartItems = (newItems: CartItem[]) => {
    setItems(newItems);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, clearCart, getTotalPrice, getTotalItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
