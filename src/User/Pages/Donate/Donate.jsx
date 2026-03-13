import { useState } from "react";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const presetAmounts = [20, 50, 100];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden grid md:grid-cols-2">

        {/* ── LEFT SIDE ── */}
        <div className="hidden md:flex flex-col justify-between bg-stone-900 p-10 relative overflow-hidden">
          {/* yellow accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

          {/* subtle texture */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,white 39px,white 40px)' }} />

          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">Make a difference</p>
            <h2 className="text-3xl font-serif text-white mb-4 leading-snug">
              Support<br />Sano Ghar
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Your donation helps rescue, treat, and rehome abandoned animals.
              Every contribution creates a safer and kinder future for them.
            </p>
          </div>

          <div className="relative mt-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZDJY9CiA7ms1qX4NLlMJ7eJ5xpt6zOF0cKg&s"
              alt="Donate for pets"
              className="w-full rounded-xl object-cover shadow-lg opacity-90"
            />
          </div>

          {/* impact stats */}
          <div className="relative grid grid-cols-3 gap-3 mt-8">
            {[
              { value: "500+", label: "Pets rescued" },
              { value: "20%",  label: "Store profits donated" },
              { value: "100%", label: "Secure" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-stone-800 rounded-xl p-3 text-center border border-stone-700">
                <p className="text-white font-bold text-sm">{value}</p>
                <p className="text-stone-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="p-8 flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            One-time gift
          </p>
          <h3 className="text-3xl font-serif text-stone-900 mb-8">
            Make a Donation 🐾
          </h3>

          {/* Preset amounts */}
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">
            Choose an amount
          </p>
          <div className="flex gap-3 mb-5">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition
                  ${amount === amt
                    ? "bg-stone-900 text-white border-stone-900 shadow-md"
                    : "border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50"
                  }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mb-5">
            <input
              type="number"
              placeholder="$ Custom amount"
              value={typeof amount === "number" ? amount : ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <textarea
              rows="4"
              placeholder="Write us a message (optional)"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition resize-none"
            />
          </div>

          {/* CTA */}
          <button className="w-full bg-stone-900 hover:bg-stone-700 text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition hover:-translate-y-0.5 hover:shadow-md">
            Proceed to Donate
          </button>

          <p className="text-xs text-stone-400 text-center mt-4">
            🔒 100% secure donation · Supports animal welfare
          </p>
        </div>

      </div>
    </div>
  );
};

export default Donate;