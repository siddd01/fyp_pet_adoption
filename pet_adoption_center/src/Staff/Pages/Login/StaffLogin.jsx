import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffContext } from "../../../Context/StaffContext";

const StaffLogin = () => {
  const { staffLogin, setStaffLoginLoading,staffLoginLoading } = useContext(StaffContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStaffLoginLoading(true);

    try {
      await staffLogin(email, password);
      navigate("/staff/dashboard"); // Redirect to staff dashboard
    } catch (err) {
      setError(err);
    } finally {
      setStaffLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={staffLoginLoading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {staffLoginLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default StaffLogin;
