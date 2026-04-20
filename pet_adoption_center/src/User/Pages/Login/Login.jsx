import { ArrowRight, Lock, Mail, PawPrint } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AuthContext } from "../../../Context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useContext(AuthContext);

  // Auto-fill email and show message if coming from OTP verification
  useEffect(() => {
    if (location.state?.email && location.state?.autoLogin) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      await fetchUser();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.08)] border border-stone-100">
        
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-stone-50 rounded-full mb-4">
            <PawPrint className="w-6 h-6 text-stone-800" />
          </div>
          <h2 className="text-4xl text-stone-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Welcome Back
          </h2>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Sano Ghar Portal
          </p>
          {location.state?.autoLogin && (
            <p className="text-emerald-600 text-xs mt-2 font-medium">
              Email verified! Please login to continue
            </p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">
                Password
              </label>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[10px] font-bold text-stone-400 hover:text-stone-900 cursor-pointer transition-colors uppercase tracking-tighter"
              >
                Forgot?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-stone-200"
          >
            {loading ? "Authenticating..." : "Login to Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-10 pt-8 border-t border-stone-50 text-center space-y-6">
          <p className="text-stone-400 text-xs tracking-tight">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-stone-900 cursor-pointer font-bold hover:underline"
            >
              Sign up
            </span>
          </p>

          <div className="flex items-center justify-center gap-6">
            <span
              onClick={() => navigate("/admin/login")}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 cursor-pointer transition-colors"
            >
              Admin
            </span>
            <div className="h-1 w-1 bg-stone-200 rounded-full"></div>
            <span
              onClick={() => navigate("/staff/login")}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 cursor-pointer transition-colors"
            >
              Staff
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
