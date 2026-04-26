import { AlertCircle, ArrowRight, CheckCircle2, Clock3, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { formatDuration, getBlockTimeLeft, MAX_OTP_TRIES, normalizeOtpResponse } from "../../../utils/otpSecurity";
import { PASSWORD_REQUIREMENTS, validatePassword } from "../../../utils/passwordPolicy";

const OTPVerificationReset = () => {
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
  const [remainingTries, setRemainingTries] = useState(MAX_OTP_TRIES);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const nextTime = getBlockTimeLeft(blockedUntil);
    setTimeLeft(nextTime);

    if (!nextTime) return undefined;

    const interval = setInterval(() => {
      const updated = getBlockTimeLeft(blockedUntil);
      setTimeLeft(updated);
      if (!updated) {
        setBlockedUntil(null);
        setRemainingTries(MAX_OTP_TRIES);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const isBlocked = timeLeft > 0;
  const timerText = useMemo(() => formatDuration(timeLeft), [timeLeft]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-sm border border-stone-100 max-w-sm font-serif">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Access Denied</h2>
          <p className="text-stone-500 text-sm mb-6 font-sans">Please request a reset link first.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-stone-900 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const applyServerState = (data, fallbackMessage) => {
    const normalized = normalizeOtpResponse(data);
    setRemainingTries(normalized.remainingTries);
    setBlockedUntil(normalized.blockedUntil);
    setError(normalized.message || fallbackMessage);
  };

  const handleResendOTP = async () => {
    if (isBlocked) return;

    setResending(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setRemainingTries(MAX_OTP_TRIES);
      setBlockedUntil(null);
      setOtp("");
      setSuccessMsg(res.data?.message || "A new code has been sent to your email.");
    } catch (err) {
      applyServerState(err.response?.data, "Failed to resend code. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyStep = async (e) => {
    e.preventDefault();
    if (isBlocked) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await api.post("/auth/verify-reset-otp", { email, otp });
      setRemainingTries(MAX_OTP_TRIES);
      setBlockedUntil(null);
      setIsOtpVerified(true);
      setSuccessMsg("OTP verified. You can create a new password now.");
    } catch (err) {
      applyServerState(err.response?.data, "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetStep = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      setSuccessMsg("Password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      applyServerState(err.response?.data, "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef2f2,_#fafaf9_45%,_#f5f5f4_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full rounded-[3rem] border border-stone-200 bg-white shadow-[0_30px_90px_-35px_rgba(28,25,23,0.35)] overflow-hidden">
          <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#7c2d12_100%)] px-8 py-9 text-white">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 p-4 mb-4">
              {isOtpVerified ? <Lock className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-100/80">Sano Ghar Security</p>
            <h2 className="mt-3 text-4xl leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              {isOtpVerified ? "Set new password" : "Verify reset code"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              {isOtpVerified ? "Your OTP is confirmed. Choose a strong new password." : `We sent a 6-digit code to ${email}.`}
            </p>
          </div>

          <div className="space-y-6 p-8">
            {error && (
              <div className="rounded-[1.4rem] border border-red-200 bg-[linear-gradient(135deg,#fff1f2_0%,#fee2e2_100%)] px-4 py-4 text-sm text-red-700 shadow-[0_16px_40px_-28px_rgba(239,68,68,0.9)]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <span>{successMsg}</span>
                </div>
              </div>
            )}

            {!isOtpVerified && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 px-4 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Remaining Tries</p>
                  <p className={`mt-2 text-3xl font-black ${remainingTries === 0 ? "text-red-600" : "text-stone-900"}`}>{remainingTries}</p>
                </div>
                <div className={`rounded-[1.4rem] border px-4 py-4 ${isBlocked ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Block Timer</p>
                  <p className={`mt-2 text-2xl font-black ${isBlocked ? "text-red-600" : "text-stone-500"}`}>
                    {isBlocked ? timerText : "Ready"}
                  </p>
                </div>
              </div>
            )}

            {!isOtpVerified ? (
              <form onSubmit={handleVerifyStep} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">6-Digit Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-center text-2xl tracking-[0.4em] font-bold focus:border-stone-400 focus:bg-white outline-none transition-all placeholder:text-stone-300"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    disabled={loading || isBlocked}
                    required
                  />
                </div>

                {isBlocked && (
                  <div className="rounded-[1.4rem] border border-red-200 bg-[linear-gradient(135deg,#fef2f2_0%,#ffe4e6_100%)] px-4 py-4 text-sm text-red-700">
                    <div className="flex items-center gap-3">
                      <Clock3 className="h-4 w-4" />
                      <span>Too many attempts. OTP verification is blocked for {timerText}.</span>
                    </div>
                  </div>
                )}

                <button
                  disabled={loading || isBlocked}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending || isBlocked}
                  className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-stone-900 text-[10px] font-bold uppercase tracking-[0.2em] transition-all pt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetStep} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:border-stone-400 focus:bg-white outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <p className="px-2 text-[11px] leading-5 text-stone-400">{PASSWORD_REQUIREMENTS}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:border-stone-400 focus:bg-white outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Reset Password"}
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationReset;
