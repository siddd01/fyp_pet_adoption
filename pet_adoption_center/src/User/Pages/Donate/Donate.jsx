import { useState } from "react";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const presetAmounts = [20, 50, 100];

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Sano Ghar
          </p>
          <h1 className="text-4xl font-serif text-stone-900 mb-2">
            Support Our Mission
          </h1>
          <p className="text-stone-500 text-sm">
            Every donation helps rescue and care for animals
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm grid md:grid-cols-2 overflow-hidden">

          {/* LEFT SIDE */}
          <div className="hidden md:flex items-center justify-center bg-stone-900 p-8">
            <div className="text-white text-center">
              <h2 className="text-3xl font-semibold mb-4">
                Support Sano Ghar
              </h2>
              <p className="opacity-80 leading-relaxed text-sm">
                Your donation helps rescue, treat, and rehome abandoned animals.
                Every contribution creates a safer and kinder future for them.
              </p>

              <div className="flex justify-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZDJY9CiA7ms1qX4NLlMJ7eJ5xpt6zOF0cKg&s"
                  alt="Donate for pets"
                  className="mt-6 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-stone-900 mb-6">
              Make a Donation 🐾
            </h3>

            {/* Choose Amount */}
            <p className="mb-3 font-medium text-stone-600 text-sm">
              Choose an amount
            </p>

            <div className="flex gap-3 mb-6">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition
                    ${
                      amount === amt
                        ? "bg-stone-900 text-white border-stone-900"
                        : "border-stone-200 text-stone-700 hover:border-stone-400"
                    }
                  `}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <input
                type="number"
                placeholder="$ Custom amount"
                value={typeof amount === "number" ? amount : ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white"
              />
            </div>

            {/* Comment */}
            <div className="mb-6">
              <textarea
                rows="4"
                placeholder="Write us a message (optional)"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white"
              ></textarea>
            </div>

            {/* Button */}
            <button
              className="w-full bg-stone-900 text-white py-2.5 rounded-xl text-sm font-medium"
            >
              Proceed to Donate
            </button>

            {/* Note */}
            <p className="text-xs text-stone-400 text-center mt-4">
              100% secure donation • Supports animal welfare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;