import { ChevronLeft, Lock, ShieldCheck, ShoppingBag } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";

export const Checkout = () => {
    const loading =false;
  const { cartItems, totalAmount } = useContext(CartContext);
//   const { initiateKhaltiPayment, loading } = usePayment();

  const handlePayment = () => {
    // We pass the totalAmount and a unique ID (could be Date.now() for testing)
    const orderId = `SG-${Date.now()}`;
    // initiateKhaltiPayment(totalAmount, orderId);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Mini Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors text-xs font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="font-serif text-xl text-stone-900 tracking-tight">Sano Ghar</h1>
          <div className="flex items-center gap-2 text-stone-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left: Shipping & Method (7 Cols) */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-xs uppercase tracking-[0.25em] text-stone-400 font-bold mb-8">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" />
                <input type="text" placeholder="Last Name" className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" />
                <input type="email" placeholder="Email Address" className="col-span-2 w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" />
                <input type="text" placeholder="Shipping Address" className="col-span-2 w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" />
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-[0.25em] text-stone-400 font-bold mb-6">Payment Method</h2>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-stone-900 rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white border-2 border-stone-900 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                       <span className="text-white font-black text-xl italic leading-none">K</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">Khalti Payment Gateway</p>
                      <p className="text-xs text-stone-400">Wallet, eBanking, or ConnectIPS</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-4 border-stone-900 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-900"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Summary (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="w-5 h-5 text-stone-900" />
                <h3 className="font-serif text-xl text-stone-900">Order Summary</h3>
              </div>
              
              <div className="space-y-5 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-2xl border border-stone-50" />
                      <div className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-4 ring-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-800 truncate">{item.name}</p>
                      <p className="text-xs text-stone-400 uppercase tracking-wider">${item.price}</p>
                    </div>
                    <p className="text-sm font-black text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-stone-50 pt-8 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 font-medium">Subtotal</span>
                  <span className="text-stone-900 font-bold">${Number(totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 font-medium">Shipping</span>
                  <span className="text-emerald-600 font-bold tracking-tight">Complementary</span>
                </div>
                <div className="flex justify-between text-xl font-black text-stone-900 pt-4 border-t border-dashed border-stone-100">
                  <span>Total</span>
                  <span>${Number(totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-stone-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                    Connecting...
                  </>
                ) : (
                  `Pay with Khalti`
                )}
              </button>

              <div className="mt-8 pt-6 border-t border-stone-50 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-stone-300" />
                  <span className="text-[9px] uppercase tracking-tighter font-bold text-stone-400">Secure</span>
                </div>
                <div className="h-4 w-px bg-stone-100"></div>
                <p className="text-[10px] text-stone-400 text-center leading-relaxed font-medium">
                  By clicking, you agree to our terms of <br/> service and adoption policies.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;