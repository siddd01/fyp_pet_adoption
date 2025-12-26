const Dashboard = () => {
  const isLoggedIn = false; // later connect with auth

  return (
    <div className="min-h-[calc(90vh-56px)] bg-[#F7FAFC] px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

        {/* LEFT SECTION */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Find Your <span className="text-[#40565E]">Perfect Pet</span> Today 🐾
          </h1>

          <p className="text-gray-600 text-lg">
            Adopt loving pets, shop essentials, and support charity —
            all in one trusted platform.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-[#40565E] text-white rounded-lg hover:bg-[#32444B]">
              Adopt Now
            </button>
            <button className="px-6 py-3 border border-[#40565E] text-[#40565E] rounded-lg hover:bg-gray-100">
              Shop Now
            </button>
          </div>

          {/* AUTH CTA */}
          {!isLoggedIn && (
            <div className="pt-4">
              <p className="text-gray-600 mb-2">
                New here?
              </p>
              <button className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create an Account
              </button>
            </div>
          )}

          {/* TRUST SECTION */}
          <div className="pt-6">
            <p className="text-sm text-gray-500 mb-2">
              Trusted by <span className="font-semibold">50,000+</span> happy customers
            </p>

            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i}`}
                  alt="user"
                  className="w-9 h-9 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
            alt="Pet"
            className="w-full max-w-md rounded-2xl shadow-lg object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
