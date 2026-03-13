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
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  const features = [
    { emoji: "🐾", label: "Adopt a Pet", sub: "Find your companion" },
    { emoji: "🛍️", label: "Pet Shop", sub: "Quality essentials" },
    { emoji: "❤️", label: "Charity", sub: "Support animals in need" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-10 py-16">
        <div className="grid grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Welcome pill */}
            {isLoggedIn && user ? (
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Welcome back, <span className="font-semibold text-stone-800">{user.first_name}</span> 👋
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Trusted by 50,000+ pet lovers
              </div>
            )}

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl font-serif text-stone-900 leading-tight">
                Find Your{" "}
                <span className="italic text-amber-700">Perfect Pet</span>{" "}
                Today
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                Adopt loving pets, shop essentials, and support charity — all in one trusted platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/adopt")}
                className="px-7 py-3 bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Adopt Now 🐾
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="px-7 py-3 bg-white border border-gray-200 hover:border-stone-400 text-stone-700 text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Shop Now →
              </button>
              {!isLoggedIn && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Join Free
                </button>
              )}
            </div>

            {/* Social proof */}
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
                <p className="text-sm font-semibold text-stone-800">50,000+ happy customers</p>
                <p className="text-xs text-gray-400">Trusted by pet lovers worldwide</p>
              </div>
            </div>

          </div>

          {/* RIGHT — Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-amber-100/50 rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
              alt="Happy pets"
              className="relative w-full rounded-3xl shadow-2xl object-cover aspect-square"
            />

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                🐶
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Pets adopted</p>
                <p className="text-lg font-bold text-stone-900">12,400+</p>
              </div>
            </div>

            {/* Floating rating card */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2">
              <span className="text-yellow-400 text-base">★★★★★</span>
              <span className="text-sm font-bold text-stone-800">4.9</span>
              <span className="text-xs text-gray-400">rating</span>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Strip */}
      <div className="max-w-7xl mx-auto px-10 pb-16">
        <div className="grid grid-cols-3 gap-5">
          {features.map(({ emoji, label, sub }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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