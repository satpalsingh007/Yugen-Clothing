import React, { useState, useEffect } from "react";
import "../style/admin.css";
import { API_URL } from "../config";

const EMPTY_PRODUCT = {
  name: "",
  price: "",
  description: "",
  reel: "",
  sizes: [],
  stock: {},
};

const AdminDashboard = () => {
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [sortType, setSortType] = useState("latest");

  const token = localStorage.getItem("token");
  
  const formatReelUrl = (url) => {
  if (!url) return "";

  if (url.includes("/embed")) return url;

  if (url.includes("instagram.com/reel/")) {
    return url.split("?")[0] + "embed";
  }

  return url;
};

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin";
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders(sortType);
  }, [sortType]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchOrders = async (type = "latest") => {
    try {
      const res = await fetch(
        `${API_URL}/orders?sort=${type}`
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        return alert("Delete failed: " + text);
      }

      fetchOrders(sortType);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const addSize = () => {
    const size = prompt("Enter size (S, M, L, XL...)");
    if (!size) return;

    const clean = size.toUpperCase();

    if (product.sizes.includes(clean)) return;

    setProduct({
      ...product,
      sizes: [...product.sizes, clean],
      stock: { ...product.stock, [clean]: 0 },
    });
  };

  const handleStockChange = (size, value) => {
    setProduct({
      ...product,
      stock: {
        ...product.stock,
        [size]: Number(value),
      },
    });
  };

  const addProduct = async () => {
    if (!token) return alert("Login required");

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("reel", formatReelUrl(product.reel));
    formData.append("sizes", JSON.stringify(product.sizes));
    formData.append("stock", JSON.stringify(product.stock));

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return alert("Error: " + text);
    }

    fetchProducts();
    resetForm();
    alert("Product added ✅");
  };

  const deleteProduct = async (id) => {
    const res = await fetch(
      `${API_URL}/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return alert("Delete failed: " + text);
    }

    fetchProducts();
  };

  const loadForEdit = (p) => {
    setProduct({
      name: p.name || "",
      price: p.price || "",
      description: p.description || "",
      reel: p.reel || "",
      sizes: p.sizes || [],
      stock: p.stock || {},
    });

    setEditingId(p._id);
  };

  const updateProduct = async () => {
    if (!editingId) return;

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("reel", product.reel);
    formData.append("sizes", JSON.stringify(product.sizes));
    formData.append("stock", JSON.stringify(product.stock));

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    const res = await fetch(
      `${API_URL}/products/${editingId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return alert("Update failed: " + text);
    }

    fetchProducts();
    resetForm();
    alert("Updated ✅");
  };

  const resetForm = () => {
    setProduct(EMPTY_PRODUCT);
    setImages([]);
    setEditingId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-card">

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Admin Dashboard</h2>
          <button className="admin-button-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        {/* ✅ ADD PRODUCT FORM */}
        <div className="admin-form" style={{ marginTop: "20px" }}>
          <input
            className="admin-input"
            placeholder="Name"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
          />

          <input
            className="admin-input"
            placeholder="Price"
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: e.target.value })
            }
          />

          <textarea
            className="admin-textarea"
            placeholder="Description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />

          <input
            className="admin-input"
            placeholder="Reel URL"
            value={product.reel}
            onChange={(e) =>
              setProduct({ ...product, reel: e.target.value })
            }
          />

          <h4>Sizes & Stock</h4>

          <div className="stock-grid">
            {product.sizes.map((size) => (
              <input
                key={size}
                className="admin-input"
                placeholder={`${size} stock`}
                type="number"
                value={product.stock[size] || 0}
                onChange={(e) =>
                  handleStockChange(size, e.target.value)
                }
              />
            ))}
          </div>

          <button className="admin-button-secondary" onClick={addSize}>
            + Add Size
          </button>

          <input
            className="admin-file-input"
            type="file"
            multiple
            onChange={handleImageChange}
          />

          <div className="admin-actions">
            {editingId ? (
              <button className="admin-button" onClick={updateProduct}>
                Update Product
              </button>
            ) : (
              <button className="admin-button" onClick={addProduct}>
                Add Product
              </button>
            )}

            <button
              className="admin-button-secondary"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        <h3 style={{ marginTop: "2rem" }}>Products</h3>

        <div className="admin-product-list">
          {products.map((p) => (
            <div key={p._id} className="admin-product">
              <div>
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
                <div className="admin-tag">
                  Sizes: {p.sizes?.join(", ")}
                </div>
              </div>

              <div className="admin-actions">
                <button onClick={() => loadForEdit(p)}>Edit</button>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        <h3 style={{ marginTop: "2rem" }}>Orders</h3>

        <div className="admin-actions">
          <button
            className={
              sortType === "latest"
                ? "admin-button"
                : "admin-button-secondary"
            }
            onClick={() => setSortType("latest")}
          >
            Latest
          </button>

          <button
            className={
              sortType === "oldest"
                ? "admin-button"
                : "admin-button-secondary"
            }
            onClick={() => setSortType("oldest")}
          >
            Oldest
          </button>
        </div>

        <div className="admin-product-list">
          {orders.map((order) => (
            <div key={order._id} className="admin-product">

              <div>
                <h4>Order ID: {order._id}</h4>

                <div className="admin-tag">
                  👤 {order.user?.name} | 📞 {order.user?.phone}
                </div>

                <div style={{ marginTop: "6px" }}>
                  📍 {order.user?.address}
                  <br />
                  📮 {order.user?.pincode}
                </div>

                <p>💰 ₹{order.totalAmount || 0}</p>

                <p>
                  🛒 Items:{" "}
                  {(order.items || []).reduce(
                    (acc, i) => acc + i.quantity,
                    0
                  )}
                </p>

                <p style={{ fontSize: "0.8rem" }}>
                  💳 {order.paymentId}
                </p>

                <p>
                  📅{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : ""}
                </p>

                <div className="admin-tag">
                  Status: {order.status}
                </div>
              </div>

              <div>
                {(order.items || []).map((item, i) => (
                  <p key={i}>
                    {item.name} ({item.size}) x {item.quantity}
                  </p>
                ))}

                <button
                  className="admin-button"
                  style={{ marginTop: "10px" }}
                  onClick={() => deleteOrder(order._id)}
                >
                  Delete Order
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;