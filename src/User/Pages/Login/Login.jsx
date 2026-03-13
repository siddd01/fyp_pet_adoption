import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AuthContext } from "../../../Context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, fetchUser } = useContext(AuthContext); // Get setUser and fetchUser from context

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });

    // 1️⃣ Save JWT only
    localStorage.setItem("token", res.data.token);

    // 2️⃣ Fetch full user profile
    await fetchUser();

    // 3️⃣ Go home
    navigate("/");
  } catch (error) {
    console.error("Login error:", error);
    alert(error.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Welcome Back 🐾
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            Sign up
          </span>
          <div>
               <div className="flex items-center justify-center gap-4 text-lg font-medium">
      <span
        onClick={() => navigate("/admin/login")}
        className="cursor-pointer text-blue-600 hover:underline"
      >
        Admin
      </span>

      <span className="text-gray-400">|</span>

      <span
        onClick={() => navigate("/staff/login")}
        className="cursor-pointer text-blue-600 hover:underline"
      >
        Staff
      </span>
    </div>
          </div>
        </p>
      </form>
    </div>
  );
};

export default Login;