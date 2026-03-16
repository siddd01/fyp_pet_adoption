import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setCartLoading(true);
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (product_id, quantity = 1, price) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await api.post(
        "/cart",
        { product_id, quantity, price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      fetchCart(); // Refresh cart after adding
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    const token = localStorage.getItem("token");

    try {
      await api.put(
        `/cart/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const removeItem = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        totalAmount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
