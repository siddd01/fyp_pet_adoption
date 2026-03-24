import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  const features = [
    { emoji: "🐾", label: "Adopt a Pet", sub: "Find your companion", to: "/adopt" },
    { emoji: "🛍️", label: "Pet Shop", sub: "Quality essentials", to: "/shop" },
    { emoji: "❤️", label: "Charity", sub: "Support animals in need", to: "/donate" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">

            {isLoggedIn && user ? (
              <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-sm text-stone-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Welcome back,{" "}
                <span className="font-semibold text-stone-900">
                  {user.first_name}
                </span>{" "}
                👋
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-sm text-stone-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Trusted by 50,000+ pet lovers
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs tracking-[0.25em] uppercase text-stone-400">
                Sano Ghar
              </p>

              <h1 className="text-5xl font-serif text-stone-900 leading-tight">
                Find Your{" "}
                <span className="italic text-stone-500">Perfect Pet</span>{" "}
                Today
              </h1>

              <p className="text-stone-500 text-base leading-relaxed max-w-md">
                Adopt loving pets, shop essentials, and support charity — all
                in one trusted platform.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/adopt")}
                className="px-7 py-3 bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Adopt Now 🐾
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="px-7 py-3 bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-sm font-semibold rounded-xl transition"
              >
                Shop Now →
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-3 border border-stone-200 hover:border-stone-400 bg-white text-stone-700 text-sm font-semibold rounded-xl transition"
                >
                  Join Free
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="user"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold text-stone-800">
                  50,000+ happy customers
                </p>
                <p className="text-xs text-stone-400">
                  Trusted by pet lovers worldwide
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 rounded-3xl blur-2xl opacity-60" />

            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
              alt="Happy pets"
              className="relative w-full rounded-3xl shadow-2xl object-cover aspect-square"
            />

            <div className="absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-xl border border-stone-100 px-5 py-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl">
                🐶
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">
                  Pets adopted
                </p>
                <p className="text-lg font-bold text-stone-900">
                  12,400+
                </p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-stone-100 px-4 py-3 flex items-center gap-2">
              <span className="text-yellow-400 text-sm">★★★★★</span>
              <span className="text-sm font-bold text-stone-800">
                4.9
              </span>
              <span className="text-xs text-stone-400">
                rating
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-stone-200" />
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400">
            What we offer
          </p>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map(({ emoji, label, sub, to }) => (
            <div
              key={label}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="w-11 h-11 bg-stone-100 rounded-xl flex items-center justify-center text-2xl">
                {emoji}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">
                  {label}
                </p>
                <p className="text-xs text-stone-400">{sub}</p>
              </div>

              <svg
                className="w-4 h-4 text-stone-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;