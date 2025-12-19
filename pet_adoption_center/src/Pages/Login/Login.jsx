import { PawPrint } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const [accountExist, setAccountExist] = useState(true); // true = Login, false = Signup
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // reset form state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");

  // Placeholder handlers - replace with real API integration
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: call your /auth/login API
      console.log("Logging in", { email, password });
      // simulate success
      await new Promise((r) => setTimeout(r, 700));
      // redirect or update auth state
    } catch (err) {
      setError("Failed to login. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // TODO: call your /auth/signup API
      console.log("Signing up", { email, password });
      await new Promise((r) => setTimeout(r, 900));
      // after signup, you may auto-login or switch to login view
      setAccountExist(true);
    } catch (err) {
      setError("Failed to signup. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async (e) => {
    e?.preventDefault();
    setError("");
    setResetSent(false);
    if (!resetEmail) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      // TODO: call your /auth/password-reset endpoint (send email or OTP)
      console.log("Request password reset for", resetEmail);
      await new Promise((r) => setTimeout(r, 900));
      setResetSent(true);
    } catch (err) {
      setError("Failed to send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <PawPrint className="w-12 h-12 text-pink-600" />
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            {accountExist ? "Welcome Back!" : "Create an Account"}
          </h1>
          <p className="text-gray-500 text-sm text-center">
            {accountExist
              ? "Login to continue your adoption journey 🐾"
              : "Signup to adopt your new best friend 🐶"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={accountExist ? handleLogin : handleSignup} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
              placeholder="you@example.com"
              aria-label="Email address"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
              placeholder="••••••••"
              aria-label="Password"
            />
          </div>

          {/* Confirm Password only for signup */}
          {!accountExist && (
            <div>
              <label className="block font-medium mb-1 text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                placeholder="Confirm password"
                aria-label="Confirm password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-all disabled:opacity-60"
          >
            {loading ? "Please wait..." : accountExist ? "Login" : "Signup"}
          </button>

          {/* Forgot password + Toggle */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="hover:underline focus:outline-none"
              aria-haspopup="dialog"
            >
              Forgot password?
            </button>

            <div>
              {accountExist ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setAccountExist(!accountExist);
                  setError("");
                }}
                className="text-pink-600 font-semibold hover:underline ml-1"
              >
                {accountExist ? "Signup" : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setShowResetModal(false);
              setResetSent(false);
              setResetEmail("");
              setError("");
            }}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 z-10">
            <h2 className="text-lg font-semibold mb-2">Reset your password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email and we'll send a password reset link (or OTP) to your inbox.
            </p>

            {resetSent ? (
              <div className="bg-green-50 text-green-800 p-3 rounded mb-4 text-sm">
                A password reset link has been sent to <strong>{resetEmail}</strong>. Check your
                inbox (and spam).
              </div>
            ) : null}

            <form onSubmit={handleSendReset} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="resetEmail">
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetSent(false);
                    setResetEmail("");
                    setError("");
                  }}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
