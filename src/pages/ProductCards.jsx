import React from "react";
import { Link } from "react-router-dom";
import "../style/productcard.css";

const normalizeSizes = (sizes) => {
  if (!sizes) return [];
  if (Array.isArray(sizes)) {
    return sizes.flatMap(normalizeSizes);
  }
  if (typeof sizes === "string") {
    const trimmed = sizes.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        return normalizeSizes(JSON.parse(trimmed));
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  return [];
};

const ProductCards = ({ product }) => {
  const productSizes =
    normalizeSizes(product.sizes).length > 0
      ? normalizeSizes(product.sizes)
      : Object.keys(product.stock || {});

  const isSoldOut =
    productSizes.length === 0
      ? true
      : productSizes.every((size) => (product.stock?.[size] ?? 0) === 0);

  return (
    <div className="card" style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        {/* 🔥 FIXED: use _id instead of id */}
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="card-img"
          />
        </Link>

        {isSoldOut && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            Sold out
          </div>
        )}
      </div>

      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>

        {/* 🔥 FIXED: use _id here too */}
        <Link
          to={`/product/${product._id}`}
          className="btn"
          style={{
            background: isSoldOut ? "#888" : "black",
            cursor: isSoldOut ? "not-allowed" : "pointer",
            pointerEvents: isSoldOut ? "none" : "auto",
          }}
        >
          {isSoldOut ? "Sold Out" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

export default ProductCards;