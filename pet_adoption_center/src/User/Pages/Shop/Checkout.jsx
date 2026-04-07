import { ChevronLeft, Lock } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";
import { usePayment } from "../../../Context/PaymentContext";

export const Checkout = () => {
  const { cartItems, totalAmount } = useContext(CartContext);
  const { initiateKhaltiPayment, loading } = usePayment();

  // 1. Added Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    // 2. Simple Validation
if (!formData.address || !formData.phone || !formData.email) {
      alert("Please fill in all shipping details");
      return;
    }

    const orderId = `SG-${Date.now()}`;
    
    // 3. Khalti expects Paisa (Amount * 100)
    // Ensure totalAmount is handled as a number
    const amountInPaisa = totalAmount;

    // Pass formData if your initiateKhaltiPayment function supports it
    initiateKhaltiPayment(totalAmount, cartItems, formData)
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Mini Header - Same as yours */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors text-xs font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Back
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
          
          {/* Left: Shipping */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-xs uppercase tracking-[0.25em] text-stone-400 font-bold mb-8">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  name="firstName"
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="First Name" 
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" 
                />
                <input 
                  name="lastName"
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" 
                />
                <input 
                  name="phone"
                  onChange={handleInputChange}
                  type="tel" 
                  placeholder="Contact Number" 
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" 
                />
                <input 
                  name="email"
                  onChange={handleInputChange}
                  type="email" 
                  placeholder="Email Address" 
                  className="col-span-2 w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" 
                />
                <input 
                  name="address"
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Shipping Address" 
                  className="col-span-2 w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-stone-400 outline-none transition-all" 
                />
              </div>
            </section>

            {/* Payment Method Section remains the same */}
            <section>
               <h2 className="text-xs uppercase tracking-[0.25em] text-stone-400 font-bold mb-6">Payment Method</h2>
               <div className="relative bg-white border-2 border-stone-900 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                       <span className="text-white font-black text-xl italic">K</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">Khalti Payment Gateway</p>
                      <p className="text-xs text-stone-400">Wallet, eBanking, or ConnectIPS</p>
                    </div>
                  </div>
               </div>
            </section>
          </div>

          {/* Right Summary - Same as yours with minor cleanup */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm sticky top-28">
              {/* ... Summary Content ... */}
              <button 
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? "Connecting..." : `Pay $${Number(totalAmount).toFixed(2)} with Khalti`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;