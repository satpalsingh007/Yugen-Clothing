import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../style/Checkout.css";
import { API_URL } from "../config";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpay = async () => {
    try {
      // 1️⃣ Create order
      const res = await fetch(`${API_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getTotalPrice() * 100,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Order creation failed ❌");
        return;
      }

      // 2️⃣ Razorpay options
      const options = {
        key: "rzp_test_Sl9P6tjQspsPgO", // 🔥 PUT YOUR KEY HERE
        amount: data.amount,
        currency: "INR",
        name: "Yugen",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API_URL}/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...response,
                  cartItems,
                  user: form,
                }),
              },
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              alert(verifyData.message || "Verification failed ❌");
              return;
            }

            // ✅ Correct order
            clearCart();
            alert("🎉 Payment Successful!");
            window.location.href = "/";
          } catch (err) {
            console.error(err);
            alert("Verification error ❌");
          }
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        theme: {
          color: "#000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment error ❌");
    }
  };

  return (
    <div className="checkout-page">
  <div className="checkout-card">
    <h2 className="checkout-title">Checkout</h2>

    {/* FORM */}
    <div className="checkout-form">
      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" onChange={handleChange} />
    </div>

    {/* SUMMARY */}
    <div className="checkout-summary">
      <h3>Order Summary</h3>

      {cartItems.map((item) => (
        <div key={item.cartId} className="checkout-item">
          <span>{item.name} ({item.selectedSize})</span>
          <span>x {item.quantity}</span>
        </div>
      ))}

      <div className="checkout-total">
        Total: ₹{getTotalPrice()}
      </div>
    </div>

    {/* BUTTON */}
    <button className="checkout-btn" onClick={loadRazorpay}>
      Pay Now
    </button>
  </div>
</div>
  );
};

export default Checkout;
