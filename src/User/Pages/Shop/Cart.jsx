import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../../../Context/CartContext";

const Cart = () => {
  const { cartItems, cartLoading, totalAmount, updateQuantity, removeItem } = useContext(CartContext);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">Loading cart</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-stone-200 mx-auto mb-5" />
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Your cart</p>
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Nothing here yet</h2>
          <p className="text-stone-400 text-sm">Add some items from the shop to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Sano Ghar
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight mb-2">
            Shopping Cart
          </h1>
          <p className="text-stone-500 text-sm">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-stone-200 hover:shadow-md transition-all p-5"
              >
                <div className="flex gap-5">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-stone-100"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-stone-800 text-sm">{item.name}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">${item.price} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-300 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-stone-50 border border-stone-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
                        >
                          <Minus className="w-3 h-3 text-stone-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center transition"
                        >
                          <Plus className="w-3 h-3 text-stone-600" />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="font-bold text-stone-900 text-base">
                        ${Number(item.total_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-2xl overflow-hidden shadow-xl border border-stone-200">

              {/* Summary header */}
              <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />
              <div className="bg-stone-900 px-6 py-5">
                <p className="text-stone-400 text-xs tracking-widest uppercase mb-1">Your order</p>
                <p className="text-white text-lg font-semibold">Order Summary</p>
              </div>

              {/* Summary body */}
              <div className="bg-white p-6">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Subtotal</span>
                    <span>${Number(totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Shipping</span>
                    <span className="text-teal-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-stone-100 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-stone-700">Total</span>
                      <span className="text-xl font-bold text-stone-900">
                        ${Number(totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-stone-900 hover:bg-stone-700 text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition hover:-translate-y-0.5 hover:shadow-md">
                  Proceed to Checkout
                </button>

                <p className="text-xs text-stone-400 text-center mt-4">
                  Taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;