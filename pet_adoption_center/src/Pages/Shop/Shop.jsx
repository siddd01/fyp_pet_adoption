import { useState } from "react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    description:
      "High quality dog food made with natural ingredients for healthy growth",
    category: "Food",
    price: 25.99,
    stock: 12,
    image:
      "https://www.prodograw.com/wp-content/uploads/2024/06/Complete-Chicken-tub-angled-web.png",
  },
  {
    id: 2,
    name: "Cat Scratching Post",
    description:
      "Durable scratching post to keep cats active and protect furniture",
    category: "Accessories",
    price: 18.5,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91",
  },
];

const Shop = () => {
  const navigate =useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen min-w-full bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Pet Store
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Every purchase supports animal welfare at Sano Ghar
        </p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-lg border text-sm
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-44 px-4 py-2 rounded-lg border text-sm
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Product Cards */}
      <div  className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
            onClick={()=>navigate(`/shop/${product.id}`)}
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden
                         hover:shadow-md transition duration-300"
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover
                             hover:scale-105 transition duration-500"
                />

                {/* Category Badge */}
                <span className="absolute top-2 left-2 bg-emerald-600
                                 text-white text-xs px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-1">
                <h3 className="text-base font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-sm font-bold text-emerald-600 mt-1">
                  ${product.price}
                </p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded-lg
                             hover:bg-gray-300 transition text-xs font-medium"
                >
                  Add to Cart
                </button>

                <button
                  className="flex-1 bg-emerald-600 text-white py-1.5 rounded-lg
                             hover:bg-emerald-700 active:scale-95 transition
                             text-xs font-medium"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-sm">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
