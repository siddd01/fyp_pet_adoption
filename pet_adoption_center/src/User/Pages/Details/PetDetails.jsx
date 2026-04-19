import { ArrowLeft, Calendar, Heart, Share2 } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PetContext } from "../../../Context/PetContext";
import { getOptimizedImageUrl } from "../../Services/imageService.jsx";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, petLoading } = useContext(PetContext);
  const [isFavorited, setIsFavorited] = useState(false);

  // Find the pet
  const pet = pets.find((p) => p.id === parseInt(id));

  if (petLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
          <p className="text-slate-400 text-xs tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-6">Pet not found</p>
          <button
            onClick={() => navigate("/adopt")}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            ← Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/adopt")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            All Pets
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 rounded-full hover:bg-rose-50"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-500"
                }`}
              />
            </button>

            <button className="p-2 rounded-full hover:bg-slate-100">
              <Share2 className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Page */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={
                getOptimizedImageUrl(pet.image_url, {
                  width: 1400,
                  height: 1100,
                  crop: "fill",
                }) || "/placeholder-pet.jpg"
              }
              alt={pet.name}
              className="w-full h-100 object-cover"
            />
          </div>

          {/* Name */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{pet.name}</h1>
            <p className="text-slate-500">{pet.breed || "Mixed breed"}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 rounded-xl">
              <p className="text-xs text-slate-400">Species</p>
              <p className="font-semibold">{pet.species}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-slate-400">Age</p>
              <p className="font-semibold">{pet.age} years</p>
            </div>

            <div className="p-4 bg-violet-50 rounded-xl">
              <p className="text-xs text-slate-400">Gender</p>
              <p className="font-semibold">{pet.gender}</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl">
              <p className="text-xs text-slate-400">Health</p>
              <p className="font-semibold">{pet.health_status || "Good"}</p>
            </div>
          </div>

          {/* Description */}
          {pet.description && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">
                About {pet.name}
              </h2>
              <p className="text-slate-600">{pet.description}</p>
            </div>
          )}

          {/* Behaviour */}
          {pet.behaviour && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">
                Personality
              </h2>
              <div className="flex flex-wrap gap-2">
                {pet.behaviour.split(",").map((trait, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 rounded-full text-sm"
                  >
                    {trait.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CARD */}
        <div className="sticky top-24 h-fit bg-white p-6 rounded-2xl shadow-lg border">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Calendar className="w-4 h-4" />
            Listed{" "}
            {new Date(pet.created_at).toLocaleDateString("en-US")}
          </div>

          <button
            onClick={() => navigate(`/adopt-form/${pet.id}`)}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700"
          >
            Apply for Adoption
          </button>

          <div className="mt-4 space-y-2">
            <button className="w-full border py-2 rounded-lg">
              Call Us: 981928371
            </button>

            <button className="w-full border py-2 rounded-lg">
              Email: adoptpet@gmail.com
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            By applying you agree to our adoption process.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PetDetails;
