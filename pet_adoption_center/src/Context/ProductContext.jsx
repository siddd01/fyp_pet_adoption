import { createContext, useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setProductLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setProductLoading(false);
    }
  }, []);



  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const refreshProducts = () => {
      if (document.visibilityState === "visible") {
        fetchProducts();
      }
    };

    window.addEventListener("focus", refreshProducts);
    document.addEventListener("visibilitychange", refreshProducts);

    return () => {
      window.removeEventListener("focus", refreshProducts);
      document.removeEventListener("visibilitychange", refreshProducts);
    };
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        productLoading,
        fetchProducts,

      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
