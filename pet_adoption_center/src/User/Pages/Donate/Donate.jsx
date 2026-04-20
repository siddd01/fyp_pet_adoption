import {
  CheckCircle,
  ChevronRight,
  Heart,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";
import ScrollReveal from "../../Components/ScrollReveal";

const donateImages = [
  "https://images.unsplash.com/photo-1599421112316-5384af3f39d5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
];

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

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
      const { data } = await api.post(
        "/charity/donate",
        {
          amount: Number(amount),
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      <div className="bg-white border-b border-stone-100">
        <ScrollReveal className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <p className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" />
            Impact Driven
          </p>
          <h1 className="text-5xl font-serif text-stone-900 tracking-tight mb-3">
            Support Our Mission
          </h1>
          <p className="text-stone-400 text-sm font-medium">
            A cleaner giving flow, with one simple contribution form and a calmer donation experience.
          </p>
        </ScrollReveal>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <ScrollReveal className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100/50 grid md:grid-cols-12 overflow-hidden">
          <div className="md:col-span-5 relative bg-stone-950 p-12 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img
                src={donateImages[imageIndex]}
                alt="Rescued animals supported by donations"
                className="w-full h-full object-cover scale-110"
                onError={() =>
                  setImageIndex((currentIndex) =>
                    currentIndex < donateImages.length - 1
                      ? currentIndex + 1
                      : currentIndex
                  )
                }
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent" />

            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-emerald-400 mb-8" />
              <h2 className="text-3xl font-serif text-white leading-snug tracking-tight mb-4">
                You are part of their second chance.
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed mb-10 max-w-sm">
                Every donation helps keep rescue, treatment, and shelter work moving. The flow is now focused on one thing: letting people give without distraction.
              </p>
            </div>

            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-3">
                Your support reaches:
              </p>
              <p className="text-white text-sm font-medium flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                Food, shelter, and recovery care
              </p>
              <p className="text-white/80 text-sm font-medium flex items-center gap-3 mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                Ongoing rescue and rehabilitation work
              </p>
            </div>
          </div>

          <div className="md:col-span-7 p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-[10px] font-black tracking-[0.28em] text-emerald-600 uppercase mb-4">
                Secure Giving
              </p>
              <h3 className="text-3xl font-serif text-stone-900 mb-4 tracking-tight">
                Make a donation to Sano Ghar
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                The preset rescue and vaccination cards have been removed. This page now focuses on a single custom donation form with a cleaner layout.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                  Simple
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  One clear amount field
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                  Direct
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Supports active animal care
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                  Safe
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Protected via Khalti
                </p>
              </div>
            </div>

            <section className="mb-8 rounded-[2rem] border border-emerald-100 bg-emerald-50/60 p-6">
              <label className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-bold mb-4 block">
                Enter your contribution
              </label>
              <div className="relative group mb-3">
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
              <p className="text-xs text-emerald-800/80">
                Enter any amount above NPR 1. You stay in control of the contribution.
              </p>
            </section>

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
              <p className="text-right text-[11px] text-stone-300 mt-1">
                {message.length}/300
              </p>
            </section>

            {error && (
              <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              onClick={handleDonation}
              disabled={loading || !amount || Number(amount) <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-base font-bold transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to Khalti...
                </>
              ) : (
                <>
                  Support Sano Ghar
                  <ChevronRight className="w-5 h-5 text-emerald-200" />
                </>
              )}
            </button>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-400 font-medium">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Protected donation flow
              </span>
              <span className="hidden sm:inline-block text-stone-200">|</span>
              <span className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-yellow-300" />
                Secured via Khalti
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Donate;
