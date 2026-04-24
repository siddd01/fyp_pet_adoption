import { AlertCircle, ArrowRight, CheckCircle2, Clock3, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { formatDuration, getBlockTimeLeft, MAX_OTP_TRIES, normalizeOtpResponse } from "../../../utils/otpSecurity";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
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
        <div className="w-full max-w-sm rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h2 className="mb-2 text-2xl text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
            Verification Missing
          </h2>
          <p className="mb-6 text-sm text-stone-500">Please sign up again to receive a fresh OTP.</p>
          <button
            onClick={() => navigate("/signup")}
            className="w-full rounded-xl bg-stone-900 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white"
          >
            Back to Signup
          </button>
        </div>
      </div>
    );
  }

  const applyServerState = (data, fallbackMessage) => {
    const normalized = normalizeOtpResponse(data);

    setRemainingTries(normalized.remainingTries);
    setBlockedUntil(normalized.blockedUntil);
    setMessage({
      type: normalized.otpBlocked || normalized.otpExpired ? "error" : "success",
      text: normalized.message || fallbackMessage,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setRemainingTries(MAX_OTP_TRIES);
      setBlockedUntil(null);
      setMessage({ type: "success", text: res.data.message || "OTP verified successfully" });

      setTimeout(() => {
        navigate("/login", { state: { email, autoLogin: true } });
      }, 1500);
    } catch (error) {
      applyServerState(error.response?.data, "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isBlocked) return;

    setResending(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/auth/resend-otp", { email });
      setRemainingTries(MAX_OTP_TRIES);
      setBlockedUntil(null);
      setOtp("");
      setMessage({ type: "success", text: res.data.message || "New OTP sent to your email." });
    } catch (error) {
      applyServerState(error.response?.data, "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff1f2,_#fafaf9_45%,_#f5f5f4_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_90px_-35px_rgba(28,25,23,0.35)]">
          <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#7f1d1d_100%)] px-8 py-9 text-white">
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 p-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-rose-100/80">Secure OTP Check</p>
            <h2 className="mt-3 text-4xl leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Verify your code
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              We sent a 6-digit OTP to <span className="font-semibold text-white">{email}</span>.
            </p>
          </div>

          <div className="space-y-6 p-8">
            {message.text && (
              <div
                className={`rounded-[1.4rem] border px-4 py-4 text-sm ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-[linear-gradient(135deg,#fff1f2_0%,#fee2e2_100%)] text-red-700 shadow-[0_16px_40px_-28px_rgba(239,68,68,0.9)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <AlertCircle className="mt-0.5 h-4 w-4" />}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-500">Enter OTP</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-[1.4rem] border border-stone-200 bg-stone-50 px-6 py-5 text-center text-2xl font-black tracking-[0.45em] text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
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
                type="submit"
                disabled={loading || isBlocked}
                className="flex w-full items-center justify-center gap-2 rounded-[1.4rem] bg-stone-900 py-4 text-[11px] font-bold uppercase tracking-[0.26em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending || isBlocked}
                className="flex w-full items-center justify-center gap-2 rounded-[1.4rem] border border-stone-200 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-600 transition hover:border-stone-300 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
