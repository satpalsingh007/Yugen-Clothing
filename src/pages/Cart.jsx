import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getAvailableStock,
  } = useCart();

  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => {
            const availableStock = getAvailableStock(
              item,
              item.selectedSize
            );

            return (
              <div
                key={item.cartId}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "10px",
                }}
              >
                {/* 🖼️ IMAGE */}
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                {/* 📦 INFO */}
                <h3>{item.name}</h3>
                <p>Size: {item.selectedSize}</p>
                <p>Price: ₹{item.price}</p>

                {/* 📊 STOCK */}
                <p>
                  Stock left:{" "}
                  <strong>
                    {availableStock > 0
                      ? availableStock
                      : "Out of stock"}
                  </strong>
                </p>

                {/* 🔢 QUANTITY */}
                <div style={{ margin: "10px 0" }}>
                  <label>Quantity: </label>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    max={availableStock}
                    onChange={(e) =>
                      updateQuantity(
                        item.cartId,
                        Number(e.target.value)
                      )
                    }
                    style={{ width: "60px", marginLeft: "10px" }}
                  />
                </div>

                {/* ❌ REMOVE */}
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* 💰 TOTAL */}
          <h3>Total: ₹{getTotalPrice()}</h3>

          {/* 🚀 CHECKOUT */}
          <button
            onClick={() => navigate("/checkout")}
            disabled={cartItems.length === 0}
            style={{
              background: cartItems.length === 0 ? "gray" : "black",
              color: "white",
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              cursor:
                cartItems.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;