import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCards";
import MovingText from "../components/MovingText";
import "../style/home.css";
import { FaArrowDown } from "react-icons/fa";
import { API_URL } from "../config";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-subtitle">Trending • PREMIUM • Limited</p>

          <h1 className="title">Yugen Clothing</h1>

          <p className="hero-description">
            For the ones who never dress average.
          </p>

          <button
            className="explore-btn"
            onClick={() => {
              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Explore
            <span className="bounce-arrow"><FaArrowDown/></span>
          </button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products-section">
        <div className="section-header">
          <h2>Latest Drops</h2>
          <div className="section-line"></div>
        </div>

        <div className="grid">
          {products.length === 0 ? (
            <div className="loader-wrapper">
              <div className="loader"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            products.map((product) => (
              <div className="product-wrapper" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>

      <MovingText />
    </div>
  );
};

export default Home;
