import { CheckCircle, ChevronRight, Heart, Loader2, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";

const presetAmounts = [
  { value: 20,  desc: "Feed a rescue for a week" },
  { value: 50,  desc: "Vaccinations for one puppy" },
  { value: 100, desc: "Emergency medical checkup" },
];

const Donate = () => {
  const [amount,  setAmount]  = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handlePreset = (val) => {
    setAmount(val);
    setError("");
  };

  const handleCustom = (e) => {
    setAmount(e.target.value);
    setError("");
  };

  const handleDonation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first to make a donation.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/charity/donate", {
        amount: Number(amount),
        message: message.trim(),
      },{
        headers: {
          Authorization: `Bearer ${token}` // Add this!
        }
      }
    );

      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setError(data?.message || "Could not start payment. Please try again.");
      }
    } catch (err) {
      console.error("Donation error:", err);
      setError(
        err.response?.data?.message ?? "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">

      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <p className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" />
            Impact Driven
          </p>
          <h1 className="text-5xl font-serif text-stone-900 tracking-tight mb-3">
            Support Our Mission
          </h1>
          <p className="text-stone-400 text-sm font-medium">
            Your generosity provides rescue, rehabilitation, and a second chance at life.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100/50 grid md:grid-cols-12 overflow-hidden">

          {/* ── LEFT: Emotional panel ── */}
          <div className="md:col-span-5 relative bg-stone-950 p-12 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1599421112316-5384af3f39d5?q=80&w=800&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent" />

            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-emerald-400 mb-8" />
              <h2 className="text-3xl font-serif text-white leading-snug tracking-tight mb-4">
                You are their <span className="italic text-emerald-300">hero</span>.
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed mb-10 max-w-sm">
                100% of your donation goes directly towards food, shelter, and medical care.
                Every rupee creates a ripple of hope.
              </p>
            </div>

            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-3">
                Your Impact Today:
              </p>
              <p className="text-white text-sm font-medium flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                Emergency Rescue Operations
              </p>
              <p className="text-white/80 text-sm font-medium flex items-center gap-3 mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                Rehabilitation &amp; Socialization
              </p>
            </div>
          </div>

          {/* ── RIGHT: Donation form ── */}
          <div className="md:col-span-7 p-12 lg:p-16 flex flex-col justify-center">
            <h3 className="text-2xl font-serif text-stone-900 mb-10 tracking-tight">
              Make a Donation to Sano Ghar
            </h3>

            {/* Preset amounts */}
            <section className="mb-8">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-5 block">
                Choose an amount (NPR)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt.value}
                    onClick={() => handlePreset(amt.value)}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col text-left
                      ${amount === amt.value
                        ? "bg-stone-900 border-stone-900 shadow-lg shadow-stone-200"
                        : "bg-white border-stone-100 hover:border-stone-300 hover:shadow-sm"
                      }`}
                  >
                    <span className={`text-2xl font-black mb-1.5 ${amount === amt.value ? "text-white" : "text-stone-950"}`}>
                      NPR {amt.value}
                    </span>
                    <span className={`text-[11px] font-medium leading-relaxed ${amount === amt.value ? "text-emerald-300" : "text-stone-400"}`}>
                      {amt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Custom amount */}
            <section className="mb-8">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-4 block">
                Or enter a custom amount
              </label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="e.g. 250"
                  value={amount}
                  onChange={handleCustom}
                  min="1"
                  className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 pr-16 text-sm focus:border-emerald-300 outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm opacity-50 group-focus-within:opacity-100 transition-opacity">
                  NPR
                </span>
              </div>
            </section>

            {/* Optional message */}
            <section className="mb-10">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-4 block">
                Leave a message (optional)
              </label>
              <textarea
                placeholder="A kind word for the rescues..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 text-sm focus:border-emerald-300 outline-none transition-all resize-none"
              />
              <p className="text-right text-[11px] text-stone-300 mt-1">{message.length}/300</p>
            </section>

            {/* Error */}
            {error && (
              <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>
            )}

            {/* CTA */}
            <button
              onClick={handleDonation}
              disabled={loading || !amount || Number(amount) <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-base font-bold transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to Khalti…
                </>
              ) : (
                <>
                  Support Sano Ghar
                  <ChevronRight className="w-5 h-5 text-emerald-200" />
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-400 font-medium">
              <span className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-emerald-300" /> 100% Tax Deductible
              </span>
              <span className="hidden sm:inline-block text-stone-200">|</span>
              <span className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-yellow-300" /> Secured via Khalti
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Donate;