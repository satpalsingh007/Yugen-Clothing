import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../style/productdetail.css";
import { API_URL } from "../config";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ popup state
  const [showPopup, setShowPopup] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await res.json();

      setProduct(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();

    const interval = setInterval(fetchProduct, 5000);

    return () => clearInterval(interval);
  }, [id]);

  // ✅ SAFE STOCK NORMALIZER
  const getStock = (stock) => {
    if (!stock) return {};

    if (stock instanceof Map) {
      return Object.fromEntries(stock);
    }

    return stock;
  };

  // ✅ SAFE SIZES
  const getSizes = (product) => {
    const stock = getStock(product.stock);
    return Object.keys(stock || {});
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const stockData = getStock(product.stock);
  const sizes = getSizes(product);

  const media = [...(product.images || [])];

  // only add reel if exists
  if (product.reel) {
    media.push(product.reel);
  }

  const isSoldOut = sizes.every(
    (size) => (stockData[size] ?? 0) === 0
  );

  const selectedStock = selectedSize
    ? stockData[selectedSize] ?? 0
    : 0;

  // ✅ add to cart handler
  const handleAddToCart = () => {
    addToCart(product, selectedSize);

    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  return (
    <div className="product-detail">

      {/* CAROUSEL */}
      <div className="carousel">

        {currentIndex === media.length - 1 && product.reel ? (
          <iframe
            className="carousel-frame"
            src={product.reel}
            title="Reel"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <img
            className="carousel-main-image"
            src={media[currentIndex]}
            alt={product.name}
          />
        )}

        {/* THUMBNAILS */}
        <div className="carousel-thumbnails">

          {(product.images || []).map((img, i) => (
            <button
              key={i}
              className={`carousel-thumb ${
                currentIndex === i ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(i)}
            >
              <img src={img} alt="" />
            </button>
          ))}

          {/* REEL BUTTON */}
          {product.reel && (
            <button
              className={`carousel-thumb ${
                currentIndex === media.length - 1
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setCurrentIndex(media.length - 1)
              }
            >
              🎥
            </button>
          )}

        </div>
      </div>

      {/* INFO */}
      <div className="product-detail-info">

        <h2>{product.name}</h2>

        <h3>₹{product.price}</h3>

        <p>{product.description}</p>

        {/* SIZES */}
        <h4>Select Size:</h4>

        <div className="size-buttons">

          {sizes.map((size) => {
            const stock = stockData[size] ?? 0;

            const isOut = stock === 0;

            return (
              <button
                key={size}
                disabled={isOut}
                className={`size-button ${
                  selectedSize === size
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}{" "}
                {isOut
                  ? "(Sold out)"
                  : `(${stock})`}
              </button>
            );
          })}

        </div>

        {/* STOCK INFO */}
        <p className="stock-info">
          {isSoldOut
            ? "Sold Out"
            : selectedSize
            ? `Only ${selectedStock} left`
            : "Select size"}
        </p>

        {/* ADD TO CART */}
        <button
          className="add-cart-btn"
          disabled={
            !selectedSize ||
            selectedStock === 0 ||
            isSoldOut
          }
          onClick={handleAddToCart}
        >
          {isSoldOut
            ? "Sold Out"
            : "Add to Cart"}
        </button>

        {/* POPUP */}
        {showPopup && (
          <div className="cart-popup">
            ✅ Added to cart
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;