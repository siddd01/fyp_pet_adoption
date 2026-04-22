import { AlertCircle, ArrowRight, CheckCircle2, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-sm border border-stone-100 max-w-sm font-serif">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Access Denied</h2>
          <p className="text-stone-500 text-sm mb-6 font-sans">Please request a reset code first.</p>
          <button
            onClick={() => navigate("/admin/forgot-password")}
            className="w-full bg-stone-900 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleResendOTP = async () => {
    setResending(true);
    setError("");
    setSuccessMsg("");

    try {
      await api.post("/admin/auth/forgot-password", { email });
      setSuccessMsg("A new code has been sent to your admin email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await api.post("/admin/auth/verify-reset-otp", { email, otp });
      setIsOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetStep = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/auth/reset-password", {
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });
      setSuccessMsg("Admin password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/admin/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.08)] border border-stone-100">
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-stone-50 rounded-full mb-4">
            {isOtpVerified ? <Lock className="w-6 h-6 text-stone-800" /> : <ShieldCheck className="w-6 h-6 text-stone-800" />}
          </div>
          <h2 className="text-4xl text-stone-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            {isOtpVerified ? "New Password" : "Verify Code"}
          </h2>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Admin Security
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs flex items-center gap-3 italic">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl text-xs flex items-center gap-3 italic">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {!isOtpVerified ? (
          <form onSubmit={handleVerifyStep} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">6-Digit Code</label>
              <input
                type="text"
                placeholder="000000"
                className="w-full px-6 py-5 bg-stone-50 border-none rounded-2xl text-stone-900 text-center text-2xl tracking-[0.4em] font-bold focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-stone-900 text-[10px] font-bold uppercase tracking-[0.2em] transition-all pt-2"
            >
              <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetStep} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Re-type Password</label>
              <input
                type="password"
                placeholder="Re-type new password"
                className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Updating..." : "Reset Password"}
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminResetPassword;
