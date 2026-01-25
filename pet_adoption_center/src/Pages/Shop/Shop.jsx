import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { ProductContext } from "../../Context/ProductContext";

const Shop = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const { products, productLoading } = useContext(ProductContext);
  const {  addToCart } = useContext(CartContext);
  if (productLoading) return <p>Loading products...</p>;
  const token = localStorage.getItem("token");

  // Fetch products from database
 
 

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Pet Store</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Every purchase supports animal welfare at Sano Ghar
        </p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto flex gap-3 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 px-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-emerald-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-44 px-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productLoading ? (
          <p className="text-center text-gray-500 col-span-full">Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/shop/${product.id}`)}
              >
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                  className="h-36 w-full object-cover hover:scale-105 transition"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-bold text-emerald-600">
                  ${product.price}
                </p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                   onClick={() => addToCart(product.id, 1, product.price)}
                  className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded-lg text-xs hover:bg-gray-300"
                >
                  Add to Cart
                </button>

                <button
                  className="flex-1 bg-emerald-600 text-white py-1.5 rounded-lg text-xs hover:bg-emerald-700"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
