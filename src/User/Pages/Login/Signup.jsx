import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
u
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(3); // default → customer
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success or error

  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  try {
    await api.post("/auth/signup", {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role_id: roleId,
      date_of_birth: dob,
      gender,
    });

    setMessage({
      type: "success",
      text: "Account created successfully! OTP sent to your email.",
    });

    setTimeout(() => {
      navigate("/otp-verification", { state: { email } });
    }, 1500);

  } catch (error) {
    setMessage({
      type: "error",
      text:
        error.response?.data?.message || "Signup failed. Try again.",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Create Account 🐶
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join our pet adoption community
        </p>

        {/* Alerts */}
        {message && (
          <div
            className={`p-3 mb-4 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="Siddhant"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Shrestha"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@user.com"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
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

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Gender
          </label>
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value={3}>Customer</option>
            <option value={2}>Staff</option>
            <option value={1}>Admin</option>
          </select>
        </div>

        {/* Signup Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
