import { useState } from "react";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const presetAmounts = [20, 50, 100];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg grid md:grid-cols-2 overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex items-center justify-center bg-emerald-600 p-8">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Support Sano Ghar</h2>
            <p className="opacity-90 leading-relaxed">
              Your donation helps rescue, treat, and rehome abandoned animals.
              Every contribution creates a safer and kinder future for them.
            </p>
           <div className="  flex justify-center">
             <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZDJY9CiA7ms1qX4NLlMJ7eJ5xpt6zOF0cKg&s"
              alt="Donate for pets"
              className="mt-6 rounded-xl shadow-md"
            />
           </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold mb-6">
            Make a Donation 🐾
          </h3>

          {/* Choose Amount */}
          <p className="mb-3 font-medium text-gray-700">
            Choose an amount
          </p>

          <div className="flex gap-4 mb-6">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`px-6 py-3 rounded-xl border text-lg font-medium transition
                  ${
                    amount === amt
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-gray-300 hover:border-emerald-500"
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
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <textarea
              rows="4"
              placeholder="Write us a message (optional)"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          {/* Next Button */}
          <button
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold
                       hover:bg-emerald-700 transition"
          >
            Proceed to Donate
          </button>

          {/* Trust Note */}
          <p className="text-sm text-gray-500 text-center mt-4">
            100% secure donation • Supports animal welfare
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donate;
