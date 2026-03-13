import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";
import { ProductContext } from "../../../Context/ProductContext";

const Shop = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const { products, productLoading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  const token = localStorage.getItem("token");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Sano Ghar
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight mb-2">
            Pet Store
          </h1>
          <p className="text-stone-500 text-sm">
            Every purchase supports animal welfare at Sano Ghar
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Search & Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-44 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Accessories">Accessories</option>
          </select>

          {!productLoading && (
            <span className="self-center text-xs text-stone-400 sm:ml-auto">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {productLoading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
            <p className="text-stone-400 text-xs tracking-widest uppercase">Loading products</p>
          </div>

        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🛍️</p>
            <p className="text-stone-400 text-sm">No products found matching your criteria</p>
          </div>

        ) : (
          /* ── Product Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-stone-200 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative h-44 overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => navigate(`/shop/${product.id}`)}
                >
                  <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent" />

                  {/* category badge */}
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-stone-800 mb-1 cursor-pointer hover:text-stone-600 transition text-sm"
                    onClick={() => navigate(`/shop/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3 flex-1">
                      {product.description}
                    </p>
                  )}

                  <p className="text-base font-bold text-stone-900 mb-4">
                    ${product.price}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product.id, 1, product.price)}
                      className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 py-2 rounded-xl text-xs font-medium transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => { addToCart(product.id, 1, product.price); navigate("/cart"); }}
                      className="flex-1 bg-stone-900 hover:bg-stone-700 text-white py-2 rounded-xl text-xs font-semibold tracking-wide transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;