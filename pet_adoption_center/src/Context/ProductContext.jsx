import axios from "axios";
import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setProductLoading(false);
    }
  };

  const addToCart = async (product_id, quantity = 1, price) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        "/api/cart",
        { product_id, quantity, price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        productLoading,
        fetchProducts,
        addToCart,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
