import {
  ArrowRight,
  Calendar,
  Lock,
  Mail,
  PawPrint,
  ShieldCheck,
  User,
  UserCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { PASSWORD_REQUIREMENTS, validatePassword } from "../../../utils/passwordPolicy";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setMessage({
        type: "error",
        text: passwordValidation.message,
      });
      return;
    }

    setLoading(true);

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
        text: "Account created! Checking your details...",
      });

      setTimeout(() => {
        navigate("/otp-verification", { state: { email } });
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Signup failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6 py-12">
      <div className="w-full max-w-xl bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.08)] border border-stone-100">
        
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-stone-50 rounded-full mb-4">
            <PawPrint className="w-6 h-6 text-stone-800" />
          </div>
          <h2 className="text-4xl text-stone-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Join the Family
          </h2>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Sano Ghar Residency
          </p>
        </header>

        {/* Alert Message */}
        {message && (
          <div className={`mb-8 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-center ${
            message.type === "success" 
            ? "bg-emerald-50 text-emerald-600" 
            : "bg-rose-50 text-rose-600"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">First Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input
                  type="text"
                  placeholder="Siddhant"
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Last Name</label>
              <input
                type="text"
                placeholder="Shrestha"
                className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200 text-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-200 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <p className="px-2 text-[11px] leading-5 text-stone-400">{PASSWORD_REQUIREMENTS}</p>
          </div>

          {/* DOB & Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input
                  type="date"
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all text-sm appearance-none"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Gender</label>
              <div className="relative">
                <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <select
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all text-sm appearance-none"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-2">Account Type</label>
            <div className="relative">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <select
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 focus:ring-2 focus:ring-stone-200 transition-all text-sm appearance-none font-medium"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value={3}>Customer / Adopter</option>
              
              </select>
            </div>
          </div>

          {/* Signup Button */}
          <button
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-stone-200 mt-4"
          >
            {loading ? "Creating Profile..." : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-8 border-t border-stone-50 text-center">
          <p className="text-stone-400 text-xs tracking-tight">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-stone-900 cursor-pointer font-bold hover:underline ml-1"
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
