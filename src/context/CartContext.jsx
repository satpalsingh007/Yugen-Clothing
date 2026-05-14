import React, { createContext, useContext, useEffect, useState } from "react";

import { API_URL } from "../config";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ LOAD CART
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

  // ✅ SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ CLEAR CART
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // ✅ SAFE STOCK CHECK
  const getAvailableStock = (product, size) => {
    if (!product || !size) return 0;
    if (!product.stock) return 0;

    return product.stock?.[size] ?? 0;
  };

  // ✅ REFRESH CART STOCK FROM SERVER
  const refreshCartStock = async () => {
    try {
      const updatedCart = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const res = await fetch(`${API_URL}/products/${item.productId}`);

            if (!res.ok) return item;

            const latestProduct = await res.json();

            const latestStock = latestProduct.stock?.[item.selectedSize] ?? 0;

            // ❌ REMOVE ITEM IF SOLD OUT
            if (latestStock <= 0) {
              return null;
            }

            // ✅ ADJUST QUANTITY
            return {
              ...item,
              stock: latestProduct.stock,
              quantity: Math.min(item.quantity, latestStock),
            };
          } catch {
            return item;
          }
        }),
      );

      const filteredCart = updatedCart.filter(Boolean);

      setCartItems(filteredCart);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ AUTO REFRESH EVERY 5 SECONDS
  useEffect(() => {
    if (cartItems.length === 0) return;

    refreshCartStock();

    const interval = setInterval(() => {
      refreshCartStock();
    }, 5000);

    return () => clearInterval(interval);
  }, [cartItems.length]);

  // 🛒 ADD TO CART
  const addToCart = (product, selectedSize) => {
    if (!product || !selectedSize) return;

    const size = selectedSize.toUpperCase();

    const stock = getAvailableStock(product, size);

    const cartId = `${product._id}-${size}`;

    const existingItem = cartItems.find((item) => item.cartId === cartId);

    const existingQty = existingItem ? existingItem.quantity : 0;

    // ❌ PREVENT OVERBUYING
    if (existingQty >= stock) {
      alert(`Only ${stock} left in stock`);
      return;
    }

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity + 1,
                latestStock: stock,
              }
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
          latestStock: stock,
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

        const stock = item.latestStock ?? 0;

        // allow empty while typing
        if (qty === "") {
          return {
            ...item,
            quantity: "",
          };
        }

        let quantity = Number(qty);

        // invalid number
        if (isNaN(quantity)) {
          quantity = 1;
        }

        // prevent below 1
        if (quantity < 1) {
          quantity = 1;
        }

        // prevent above stock
        if (quantity > stock) {
          quantity = stock;
        }

        return {
          ...item,
          quantity,
        };
      }),
    );
  };

  // 💰 TOTAL
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
        clearCart,
        refreshCartStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
