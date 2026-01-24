import { ArrowLeft, Calendar, Heart, MapPin, Share2, Shield, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 2,
    gender: "Male",
    health_status: "Vaccinated, healthy",
    previous_owner_status: "No",
    description:
      "Buddy is a loving and energetic dog who enjoys outdoor activities and playing fetch. Perfect for an active family.",
    behaviour:
      "Friendly, playful, good with children, social with other dogs.",
    image_url:
      "https://media.tegna-media.com/assets/WQAD/images/b9252759-f297-4959-9fc6-2da602565e83/b9252759-f297-4959-9fc6-2da602565e83_750x422.png",
    created_at: "2024-12-01",
    location: "Portland, OR"
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siamese Cat",
    age: 1,
    gender: "Female",
    health_status: "Needs regular checkups",
    previous_owner_status: "Yes",
    description:
      "Luna is a calm indoor cat who loves warm places and quiet environments.",
    behaviour:
      "Calm, affectionate, prefers quiet homes.",
    image_url:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    created_at: "2024-12-05",
    location: "Seattle, WA"
  },
];

const PetDetails = () => {
  const [currentPet, setCurrentPet] = useState(pets[0]);
  const [isFavorited, setIsFavorited] = useState(false);
  const pet = currentPet;
  const navigate =useNavigate()

  if (!pet) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <p className="text-gray-600 text-lg">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition">
            <ArrowLeft className="w-5 h-5" onClick={()=>navigate("/adopt")} />
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
                <div className="relative w-[400px] h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="w-full h-full object-contain bg-gray-50"
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
                  <p className="text-xl text-gray-600 mb-2">{pet.breed}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{pet.location}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600">{pet.age}</p>
                    <p className="text-sm text-gray-600 mt-1">Years Old</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <p className="text-3xl font-bold text-purple-600">{pet.gender === 'Male' ? '♂' : '♀'}</p>
                    <p className="text-sm text-gray-600 mt-1">{pet.gender}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                    <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600 mt-1">Vaccinated</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                    <Users className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600 mt-1">Family Ready</p>
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
                    <p className="text-gray-600">{pet.health_status}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Previous Owner</p>
                    <p className="text-gray-600">{pet.previous_owner_status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">About {pet.name}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {pet.description}
              </p>
            </div>

            {/* Personality */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">Personality & Behaviour</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {pet.behaviour}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {pet.behaviour.split(',').map((trait, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-purple-700 shadow-sm">
                    {trait.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Adoption Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-emerald-100">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Listed {new Date(pet.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Apply for Adoption
                </button>
                
                <button className="w-full border-2 border-emerald-600 text-emerald-600 py-4 rounded-xl hover:bg-emerald-50 transition font-semibold">
                  Schedule a Visit
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-medium">
                  Ask a Question
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
        </div>
      </div>
    </div>
  );
};

export default PetDetails;