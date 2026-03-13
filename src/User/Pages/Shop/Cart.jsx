import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../../../Context/CartContext";

const Cart = () => {
<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
  const { cartItems, cartLoading, totalAmount, updateQuantity, removeItem } = useContext(CartContext);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">Loading cart</p>
=======
  const {
    cartItems,
    cartLoading,
    totalAmount,
    updateQuantity,
    removeItem,
  } = useContext(CartContext);

  if (cartLoading) {
    return (
      <div className="min-h-screen min-w-[90vw] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-stone-200 mx-auto mb-5" />
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Your cart</p>
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Nothing here yet</h2>
          <p className="text-stone-400 text-sm">Add some items from the shop to get started.</p>
=======
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Add some items to get started!</p>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
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
=======
    <div className="min-h-screen min-w-full bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
                className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-stone-200 hover:shadow-md transition-all p-5"
              >
                <div className="flex gap-5">
                  {/* Image */}
=======
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
                  <div className="flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
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
=======
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">${item.price} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
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
=======
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="font-bold text-xl text-gray-900">
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
                        ${Number(item.total_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

<<<<<<< HEAD:src/User/Pages/Shop/Cart.jsx
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

=======
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${Number(totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Shop/Cart.jsx
        </div>
      </div>
    </div>
  );
};

export default Cart;