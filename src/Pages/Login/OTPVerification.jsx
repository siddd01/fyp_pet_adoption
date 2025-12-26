import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from signup page
  const email = location.state?.email;

  // -----------------------
  // Verify OTP
  // -----------------------
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  try {
    const res = await api.post("/auth/verify-otp", { email, otp });

    setMessage({ type: "success", text: res.data.message });

    // Redirect to dashboard on success
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

  } catch (error) {
    setMessage({
      type: "error",
      text: error.response?.data?.message || "OTP verification failed.",
    });
  } finally {
    setLoading(false);
  }
};

  // -----------------------
  // Resend OTP
  // -----------------------
  const handleResend = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Email not found. Please sign up again." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/auth/resend-otp", { email });
      setMessage({ type: "success", text: res.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to resend OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>

        {message && (
          <div
            className={`p-2 mb-4 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend OTP button */}
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
