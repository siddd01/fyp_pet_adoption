import { ArrowLeft, Calendar, Heart, Share2, Shield, Sparkles } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PetContext } from '../../../Context/PetContext';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, petLoading } = useContext(PetContext);
  const [isFavorited, setIsFavorited] = useState(false);

  const pet = pets.find(p => p.id === parseInt(id));

  if (petLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
          <p className="text-slate-400 text-xs tracking-widest uppercase">Loading</p>
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
            onClick={() => navigate('/adopt')}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium border-b border-slate-400 pb-0.5 transition"
          >
            ← Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
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
            </div>

            {/* About */}
            {pet.description && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-4">About {pet.name}</p>
                <p className="text-slate-600 leading-8 text-base">{pet.description}</p>
              </div>
            )}

            {/* Personality */}
            {pet.behaviour && (
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
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                >
                  Apply for Adoption
                </button>

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

        </div>
      </div>
    </div>
  );
};

export default PetDetails;