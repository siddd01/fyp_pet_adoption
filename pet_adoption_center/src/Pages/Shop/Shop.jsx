import { useState } from "react";

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
    <div className="w-full min-h-screen bg-gray-100 px-2 py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-gray-600">
          Every purchase supports animal welfare at Sano Ghar
        </p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-xl border
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 rounded-xl border
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-[350px] h-[300px] bg-white rounded-2xl shadow-md
                         hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="h-[140px] w-full overflow-hidden rounded-t-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover
                             hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex-1 px-4 py-3 text-sm space-y-1">
                <h3 className="text-base font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-lg font-bold text-emerald-600 mt-1">
                  ${product.price}
                </p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-3">
                <button
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl
                             hover:bg-gray-300 transition text-sm font-medium"
                >
                  Add to Cart
                </button>

                <button
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-xl
                             hover:bg-emerald-700 active:scale-95 transition text-sm font-medium"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
