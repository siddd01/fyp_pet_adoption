<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
import { ArrowLeft, Calendar, Heart, Share2, Shield, Sparkles } from 'lucide-react';
=======
import { ArrowLeft, Calendar, Heart, Share2, Shield, Sparkles, Users } from 'lucide-react';
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PetContext } from '../../../Context/PetContext';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, petLoading } = useContext(PetContext);
  const [isFavorited, setIsFavorited] = useState(false);

<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
=======
  // Find the pet from context based on URL parameter
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
  const pet = pets.find(p => p.id === parseInt(id));

  if (petLoading) {
    return (
<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
          <p className="text-slate-400 text-xs tracking-widest uppercase">Loading</p>
        </div>
=======
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <p className="text-gray-600 text-lg">Loading pet details...</p>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
      </div>
    );
  }

  if (!pet) {
    return (
<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-6">Pet not found</p>
          <button
            onClick={() => navigate('/adopt')}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium border-b border-slate-400 pb-0.5 transition"
=======
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Pet not found</p>
          <button 
            onClick={() => navigate("/adopt")}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
          >
            ← Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
    <div className="min-h-screen bg-slate-50">

      {/* ── Navbar ── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/adopt')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            All Pets
          </button>
          <span className="text-xs tracking-[0.3em] uppercase text-slate-500 font-light">Pet Profile</span>
          <div className="flex gap-1">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2.5 rounded-full hover:bg-rose-50 transition"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-400 text-rose-400' : 'text-slate-500'}`} />
            </button>
            <button className="p-2.5 rounded-full hover:bg-slate-500 transition">
              <Share2 className="w-5 h-5 text-slate-500 hover:text-slate-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image + Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">

              {/* Image */}
              <div className="sm:col-span-3 relative">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 blur-md opacity-70" />
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={pet.image_url || '/placeholder-pet.jpg'}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white text-2xl font-bold">{pet.name}</p>
                    <p className="text-white/70 text-sm">{pet.breed || 'Mixed breed'}</p>
                  </div>
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow hover:scale-105 transition"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="sm:col-span-2 flex flex-col gap-3">
                {[
                  { label: 'Species',  value: pet.species,                                            bg: 'bg-slate-100',   text: 'text-slate-700',   dot: 'bg-slate-400' },
                  { label: 'Age',      value: pet.age ? `${pet.age} years` : 'N/A',                   bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-400' },
                  { label: 'Gender',   value: pet.gender === 'Male' ? '♂ Male' : '♀ Female',          bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-400' },
                  { label: 'Health',   value: pet.health_status || 'Good',                            bg: 'bg-teal-50',     text: 'text-teal-700',    dot: 'bg-teal-400' },
                  { label: 'History',  value: pet.previous_owner_status === 'Yes' ? 'Had Owner' : 'First Home', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
                ].map(({ label, value, bg, text, dot }) => (
                  <div key={label} className={`flex-1 ${bg} rounded-xl px-4 py-3 flex items-center gap-3`}>
                    <div className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className={`text-sm font-semibold ${text} truncate`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <Sparkles className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex-1 h-px bg-slate-200" />
=======
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/adopt")}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Pets</span>
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 rounded-full hover:bg-rose-50 transition"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-50 transition">
              <Share2 className="w-6 h-6 text-gray-400 hover:text-blue-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image and Quick Stats Side by Side */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Pet Image */}
              <div className="flex-shrink-0">
                <div className="relative w-full sm:w-[400px] h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={pet.image_url || '/placeholder-pet.jpg'}
                    alt={pet.name}
                    className="w-full h-full object-cover bg-gray-50"
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition"
                    >
                      <Heart className={`w-6 h-6 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-gray-800">{pet.name}</h1>
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="text-xl text-gray-600 mb-2">{pet.breed || 'Mixed breed'}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {pet.species}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600">{pet.age || 'N/A'}</p>
                    <p className="text-sm text-gray-600 mt-1">Years Old</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <p className="text-3xl font-bold text-purple-600">{pet.gender === 'Male' ? '♂' : '♀'}</p>
                    <p className="text-sm text-gray-600 mt-1">{pet.gender}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                    <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600 mt-1">Health Care</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                    <Users className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600 mt-1">
                      {pet.previous_owner_status === 'Yes' ? 'Had Owner' : 'First Time'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-emerald-600" />
                Health & Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Health Status</p>
                    <p className="text-gray-600">{pet.health_status || 'Good health'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Previous Owner</p>
                    <p className="text-gray-600">{pet.previous_owner_status || 'No'}</p>
                  </div>
                </div>
              </div>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
            </div>

            {/* About */}
            {pet.description && (
<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-4">About {pet.name}</p>
                <p className="text-slate-600 leading-8 text-base">{pet.description}</p>
=======
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">About {pet.name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {pet.description}
                </p>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
              </div>
            )}

            {/* Personality */}
            {pet.behaviour && (
<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-50 to-transparent rounded-bl-full" />
                <p className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-3 relative">Personality & Behaviour</p>
                <p className="text-slate-600 leading-8 text-base mb-5 relative">{pet.behaviour}</p>
                <div className="flex flex-wrap gap-2 relative">
                  {pet.behaviour.split(',').map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition rounded-full text-xs font-medium text-slate-600"
                    >
=======
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Personality & Behaviour</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {pet.behaviour}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {pet.behaviour.split(',').map((trait, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-purple-700 shadow-sm">
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx

            {/* Health Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-4 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Health & Background
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <p className="text-xs text-teal-500 uppercase tracking-wide mb-1">Health Status</p>
                  <p className="text-slate-700 font-medium">{pet.health_status || 'Good health'}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-500 uppercase tracking-wide mb-1">Previous Owner</p>
                  <p className="text-slate-700 font-medium">{pet.previous_owner_status || 'None'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Adoption Card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl overflow-hidden shadow-xl border border-slate-200">

              {/* Card Header */}
              <div className="bg-slate-800 px-6 py-6">
                <p className="text-slate-400 text-xs tracking-widest uppercase mb-2">Ready to adopt</p>
                <p className="text-white text-xl font-semibold">{pet.name} is waiting </p>
                <p className="text-slate-400 text-sm mt-1">Find your forever companion 🐾</p>
              </div>

              {/* Card Body */}
              <div className="bg-white p-6 space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs pb-4 border-b border-slate-100">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Listed {new Date(pet.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/adopt-form/${pet.id}`)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all hover:-translate-y-0.5 shadow hover:shadow-md"
=======
          </div>

          {/* Right Column - Adoption Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-emerald-100">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  Listed {new Date(pet.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/adopt-form/${pet.id}`)}
                  className="
                    w-full
                    bg-gradient-to-r from-emerald-600 to-emerald-500
                    text-white py-4 rounded-xl
                    hover:from-emerald-700 hover:to-emerald-600
                    transition font-semibold text-lg
                    shadow-lg hover:shadow-xl
                    transform hover:-translate-y-0.5
                  "
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
                >
                  Apply for Adoption
                </button>

<<<<<<< HEAD:src/User/Pages/Details/PetDetails.jsx
                <button className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-3 rounded-xl text-sm font-medium transition flex flex-col items-center gap-0.5">
                  <span>Call Us</span>
                  <span className="text-xs text-slate-400 font-normal">981928371</span>
                </button>

                <button className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-3 rounded-xl text-sm font-medium transition flex flex-col items-center gap-0.5">
                  <span>Email a Question</span>
                  <span className="text-xs text-slate-400 font-normal">adoptpet@gmail.com</span>
                </button>

                <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    💛 By applying you agree to our adoption process & screening requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

=======
                <button className="w-full border-2 border-emerald-600 text-emerald-600 py-4 rounded-xl hover:bg-emerald-50 transition font-semibold">
                  contact us
                  981928371
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-medium">
                  Ask a Question
                  adoptpet@gmail.com
                </button>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  💛 {pet.name} is looking for a loving forever home!
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By applying, you agree to our adoption process and screening requirements.
                </p>
              </div>
            </div>
          </div>
>>>>>>> a778c015cee701f7c6f96e6a1499157a1fb2da33:pet_adoption_center/src/User/Pages/Details/PetDetails.jsx
        </div>
      </div>
    </div>
  );
};

export default PetDetails;