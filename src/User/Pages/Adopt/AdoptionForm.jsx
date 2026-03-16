import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import api from "../../../api/axios.js";

const AdoptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    phone: "",
    job: "",
    experience_with_pets: "",
    reason_for_adoption: "",
  });

  const [loading, setLoading] = useState(false);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: `${user.first_name} ${user.last_name}`,
        age: calculateAge(user.date_of_birth),
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!id) {
      alert("Pet ID missing");
      setLoading(false);
      return;
    }
    try {
      await api.post(
        "/adoptions/apply",
        { ...formData, pet_id: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Application submitted successfully 🐾");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit application: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🐾</div>
          <p className="text-base text-gray-500 font-medium">Please login to apply for adoption.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-10 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-9">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
            Pet Adoption
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">
            Adoption Application
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-3 gap-7 items-start">

          {/* LEFT — Form (takes 2 of 3 columns) */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Amber accent bar */}
            <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

            <div className="p-9">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section: Personal Information */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap">
                      Personal Information
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        name="full_name"
                        value={formData.full_name}
                        readOnly
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-500 cursor-default outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Age
                      </label>
                      <input
                        name="age"
                        value={formData.age}
                        readOnly
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-500 cursor-default outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 placeholder-gray-300 outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/10 transition"
                        onChange={handleChange}
                        value={formData.phone}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Occupation
                      </label>
                      <input
                        name="job"
                        placeholder="e.g. Software Engineer"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 placeholder-gray-300 outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/10 transition"
                        onChange={handleChange}
                        value={formData.job}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section: About You */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap">
                      About You
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Experience with Pets
                      </label>
                      <textarea
                        name="experience_with_pets"
                        placeholder="Describe your experience caring for pets..."
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 placeholder-gray-300 outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/10 transition resize-none"
                        style={{ height: 148 }}
                        onChange={handleChange}
                        value={formData.experience_with_pets}
                        required
                      />
                      <p className="text-xs text-gray-300 mt-1.5 text-right">
                        {formData.experience_with_pets.length} chars
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Why do you want to adopt?
                      </label>
                      <textarea
                        name="reason_for_adoption"
                        placeholder="Explain your reason for adoption..."
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 placeholder-gray-300 outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/10 transition resize-none"
                        style={{ height: 148 }}
                        onChange={handleChange}
                        value={formData.reason_for_adoption}
                        required
                      />
                      <p className="text-xs text-gray-300 mt-1.5 text-right">
                        {formData.reason_for_adoption.length} chars
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Row */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-stone-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin"
                          width="14" height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application →"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Intro Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />
              <div className="p-6">
                <div className="text-3xl mb-3">🐾</div>
                <h3 className="font-serif text-xl text-stone-900 mb-2">
                  Finding the right home
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We review every application carefully to ensure our pets are placed in loving, responsible homes.
                </p>
              </div>
            </div>

            {/* Pre-filled notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-4">
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1.5">
                ℹ️ Pre-filled Fields
              </p>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Your <strong>name</strong> and <strong>age</strong> are automatically filled from your account profile.
              </p>
            </div>

            {/* What happens next */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                What happens next?
              </p>
              <div className="space-y-5">
                {[
                  { step: "01", title: "Application Review", desc: "Our team reviews your submission within 2–3 business days." },
                  { step: "02", title: "Follow-up", desc: "We may contact you for additional information." },
                  { step: "03", title: "Decision", desc: "You'll be notified of approval or rejection via email." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center text-xs font-bold text-yellow-700 shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800 mb-0.5">{title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          By submitting, you agree to our adoption terms and conditions.
        </p>

      </div>
    </div>
  );
};

export default AdoptionForm;