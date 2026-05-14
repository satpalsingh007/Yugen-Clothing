import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    refreshCartStock,
  } = useCart();

  const navigate = useNavigate();

  // ✅ auto refresh stock when cart opens
  useEffect(() => {
    refreshCartStock();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "650px",
        margin: "auto",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "2rem",
        }}
      >
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => {
            const availableStock = item.latestStock ?? 0;

            const isOutOfStock = availableStock === 0;

            return (
              <div
                key={item.cartId}
                style={{
                  border: "1px solid #e5e5e5",
                  padding: "16px",
                  marginBottom: "18px",
                  borderRadius: "16px",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* IMAGE */}
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  style={{
                    width: "100%",
                    maxHeight: "260px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "14px",
                  }}
                />

                {/* INFO */}
                <h3
                  style={{
                    marginBottom: "8px",
                  }}
                >
                  {item.name}
                </h3>

                <p>
                  Size: <strong>{item.selectedSize}</strong>
                </p>

                <p>Price: ₹{item.price}</p>

                {/* STOCK */}
                <p
                  style={{
                    color: isOutOfStock ? "red" : "#1a8917",
                    fontWeight: "600",
                  }}
                >
                  {isOutOfStock ? "Out of stock" : `${availableStock} left`}
                </p>

                {/* QUANTITY */}
                {!isOutOfStock && (
                  <div
                    style={{
                      margin: "14px 0",
                    }}
                  >
                    <label>Quantity: </label>

                    <input
                      type="number"
                      value={item.quantity}
                      max={availableStock}
                      onChange={(e) => {
                        updateQuantity(item.cartId, e.target.value);
                      }}
                      onBlur={() => {
                        // if empty after editing, reset to 1
                        if (item.quantity === "" || item.quantity < 1) {
                          updateQuantity(item.cartId, 1);
                        }
                      }}
                      style={{
                        width: "70px",
                        marginLeft: "10px",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}

                {/* WARNING */}
                {item.quantity > availableStock && !isOutOfStock && (
                  <p
                    style={{
                      color: "orange",
                      fontSize: "0.9rem",
                      marginBottom: "10px",
                    }}
                  >
                    Quantity adjusted due to stock changes
                  </p>
                )}

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  style={{
                    background: "#e53935",
                    color: "white",
                    padding: "10px 14px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* TOTAL */}
          <h3
            style={{
              marginTop: "25px",
              marginBottom: "18px",
            }}
          >
            Total: ₹{getTotalPrice()}
          </h3>

          {/* CHECKOUT */}
          <button
            onClick={() => navigate("/checkout")}
            disabled={
              cartItems.length === 0 ||
              cartItems.some((item) => (item.latestStock ?? 0) === 0)
            }
            style={{
              background: cartItems.length === 0 ? "#999" : "#000",
              color: "white",
              padding: "14px",
              width: "100%",
              borderRadius: "14px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
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
