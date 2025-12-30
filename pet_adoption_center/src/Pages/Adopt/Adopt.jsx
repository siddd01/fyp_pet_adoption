const pets = [
  {
    id: 1,
    name: "Buddy",
    age: "2 years",
    breed: "Golden Retriever",
    gender: "Male",
    species: "Dog",
    description: "Friendly, playful, and great with kids.",
    image:
      "https://media.tegna-media.com/assets/WQAD/images/b9252759-f297-4959-9fc6-2da602565e83/b9252759-f297-4959-9fc6-2da602565e83_750x422.png",
  },
  {
    id: 2,
    name: "Luna",
    age: "1.5 years",
    breed: "Siamese Cat",
    gender: "Female",
    species: "Cat",
    description: "Calm, affectionate, and loves cozy spots.",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
  },
];

const Adopt = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(90vh-56px)] bg-gray-100">
      {/* Main Scroll Container */}
      <div
        className="w-[95vw] h-[90vh] bg-white rounded-2xl shadow-lg p-6 overflow-y-auto"
      >
        {/* Cards */}
        <div className="flex gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="w-[300px] h-[300px] bg-white rounded-2xl shadow-md 
                         flex flex-col hover:shadow-xl hover:-translate-y-1 
                         transition-all duration-300"
            >
              {/* Image */}
              <div className="p-2">
                <div className="relative h-[120px] w-full rounded-xl overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  <h3 className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                    {pet.name}
                  </h3>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 px-3 text-xs space-y-1">
                <p>Age: <b>{pet.age}</b></p>
                <p>Breed: <b>{pet.breed}</b></p>
                <p>Gender: <b>{pet.gender}</b></p>
                <p className="text-gray-600 line-clamp-2">
                  {pet.description}
                </p>
              </div>

              {/* Button */}
              <div className="p-3 pt-0">
                <button
                  className="w-full bg-green-600 text-white py-1.5 rounded-lg 
                             hover:bg-green-700 active:scale-95 transition 
                             text-xs font-medium"
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Adopt;
