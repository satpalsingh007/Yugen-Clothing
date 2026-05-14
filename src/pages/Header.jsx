import React from "react";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Yugen logo" />
      </div>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <div className="actions">
        <Link to="/cart" className="cart-icon">
          <span className="cart-emoji">🛒</span>

          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Header;
