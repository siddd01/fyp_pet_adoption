import { AlertCircle, ArrowLeft, ArrowRight, Briefcase, Lock, Mail } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffContext } from "../../../Context/StaffContext";

const StaffLogin = () => {
  const { staffLogin, setStaffLoginLoading, staffLoginLoading } = useContext(StaffContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStaffLoginLoading(true);

    try {
      await staffLogin(email, password);
      navigate("/staff/dashboard");
    } catch (err) {
      // Handling object or string errors from context
      setError(typeof err === 'string' ? err : err.response?.data?.message || "Access denied.");
    } finally {
      setStaffLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.08)] border border-stone-100">
        
        {/* Back to Home */}
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">User Login</span>
        </button>

        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-stone-50 rounded-full mb-4">
            <Briefcase className="w-6 h-6 text-stone-800" />
          </div>
          <h2 className="text-4xl text-stone-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Staff Portal
          </h2>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Internal Access Only
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs flex items-center gap-3 italic">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="email"
                placeholder="name@sanoghar.com"
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">
                Secret Key
              </label>
              <span
                onClick={() => navigate("/staff/forgot-password")}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={staffLoginLoading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-stone-200"
          >
            {staffLoginLoading ? "Verifying..." : "Enter Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <footer className="mt-10 text-center">
          <p className="text-stone-400 text-[9px] uppercase tracking-widest leading-relaxed">
            By logging in, you agree to the <br /> 
            <span className="text-stone-600">Sano Ghar Privacy Protocols</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StaffLogin;
