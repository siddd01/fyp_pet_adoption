import { useEffect, useState } from "react";
import api from "../../api/axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data);
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  // Load cart data when component mounts
  useEffect(() => {
    fetchCart();
  }, []);


  const updateQuantity = async (id, quantity) => {
  if (quantity < 1) return;

  const token = localStorage.getItem("token");

  await api.put(
    `/api/cart/${id}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  fetchCart();
};
const removeItem = async (id) => {
  const token = localStorage.getItem("token");

  await api.delete(`/api/cart/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchCart();
};


  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Cart is empty</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  ${item.price} × {item.quantity}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-emerald-600">
                  ${item.total_price}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right font-bold text-lg">
            Total: ${totalAmount.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
