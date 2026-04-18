import { AlertCircle, ArrowLeft, ArrowRight, Key, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      // Navigating with state so the next page knows the email
      navigate("/otp-verification-reset", { state: { email } });
    } catch (error) {
      setError(error.response?.data?.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.08)] border border-stone-100">
        
        {/* Navigation Back */}
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Login</span>
        </button>

        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-stone-50 rounded-full mb-4">
            <Key className="w-6 h-6 text-stone-800" />
          </div>
          <h2 className="text-4xl text-stone-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Recovery
          </h2>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Reset your password
          </p>
        </header>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs flex items-center gap-3 italic animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-stone-200"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-center text-stone-400 text-[10px] leading-relaxed px-4">
              We will send a unique 6-digit verification code to your email to verify your identity.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;