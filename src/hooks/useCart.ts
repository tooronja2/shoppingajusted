
import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types/Product';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito del localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1, selectedOptions: any = {}) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.sku === product.sku && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.product.sku === product.sku && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { product, quantity, selectedOptions }];
    });
  };

  const removeFromCart = (sku: string, selectedOptions: any = {}) => {
    setItems(prevItems => 
      prevItems.filter(
        item => !(item.product.sku === sku && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      )
    );
  };

  const updateQuantity = (sku: string, quantity: number, selectedOptions: any = {}) => {
    if (quantity <= 0) {
      removeFromCart(sku, selectedOptions);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.sku === sku && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.precio * item.quantity), 0);
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};
