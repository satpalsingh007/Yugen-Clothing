import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const clearCart = () => {
    setCartItems([]);
  };

  // 🔥 Load cart from localStorage (optional but IMPORTANT)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      const parsed = JSON.parse(savedCart);

      // ✅ migrate old cart items
      const fixedCart = parsed.map((item) => ({
        ...item,
        productId: item.productId || item._id,
      }));

      setCartItems(fixedCart);
    }
  }, []);

  // 🔥 Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ SAFE STOCK FUNCTION (NO CRASH EVER)
  const getAvailableStock = (product, size) => {
    if (!product || !size) return 0;
    if (!product.stock) return 0;

    return product.stock?.[size] ?? 0;
  };

  // 🛒 ADD TO CART
  const addToCart = (product, selectedSize) => {
    if (!product || !selectedSize) return;

    const size = selectedSize.toUpperCase();
    const stock = getAvailableStock(product, size);

    const cartId = `${product._id}-${size}`;

    const existingItem = cartItems.find((item) => item.cartId === cartId);

    const existingQty = existingItem ? existingItem.quantity : 0;

    // 🚫 prevent over buying
    if (existingQty + 1 > stock) return;

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          images: product.images || [],
          stock: product.stock || {},
          selectedSize: size,
          cartId,
          quantity: 1,
        },
      ]);
    }
  };

  // ❌ REMOVE ITEM
  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // 🔁 UPDATE QUANTITY
  const updateQuantity = (cartId, qty) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartId !== cartId) return item;

        const stock = getAvailableStock(item, item.selectedSize);

        const quantity = Math.max(1, Math.min(qty, stock));

        return { ...item, quantity };
      }),
    );
  };

  // 💰 TOTAL PRICE
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getAvailableStock,
        clearCart, // ✅ ADD THIS
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
