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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: "All", label: "All Items", icon: "✨" },
    { value: "Food", label: "Nutrition", icon: "🦴" },
    { value: "Accessories", label: "Essentials", icon: "🧸" },
  ];

  if (productLoading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🛍️</span>
          <div className="space-y-2 text-center">
            <p className="text-stone-800 font-medium tracking-tight">Stocking the shelves</p>
            <div className="w-12 h-1 bg-stone-200 mx-auto rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-stone-800 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero & Search Section ── */}
      <div className="bg-gradient-to-b from-stone-100 to-white pt-24 pb-4 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">
                  Sano Ghar Official
                </p>
              </div>
              <h1
                className="text-stone-900 text-5xl md:text-7xl font-medium tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Pet Store
              </h1>
            </div>
            
            <div className="max-w-xs border-l border-stone-200 pl-6">
              <p className="text-stone-600 text-sm leading-relaxed font-light">
                Premium essentials for your companions. Every purchase directly supports animal welfare at Sano Ghar.
              </p>
            </div>
          </div>

          {/* Floating Search & Filter Bar */}
          <div className="bg-white p-3 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-stone-200/60">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-grow">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400"
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                />
              </div>

              <div className="flex bg-stone-100/80 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCategory(opt.value)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                      category === opt.value
                        ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
                        : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-40 bg-stone-50/50 rounded-[3rem] border border-dashed border-stone-200">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-stone-400 text-sm font-light">No items found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 hover:border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Image Section */}
                <div 
                  className="relative overflow-hidden bg-stone-100 aspect-square cursor-pointer"
                  onClick={() => navigate(`/shop/${product.id}`)}
                >
                  <img
                    src={product.image_url || product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle Top Overlay for category tag */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-stone-800 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {product.category}
                  </span>

                  <div className="absolute bottom-4 right-4 bg-stone-900 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    ${product.price}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col gap-3">
                  <h3 
                    className="text-stone-900 font-semibold text-lg tracking-tight leading-tight cursor-pointer hover:text-stone-600 transition-colors"
                    onClick={() => navigate(`/shop/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-light flex-1">
                      {product.description}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => addToCart(product.id, 1, product.price)}
                      className="flex-1 bg-stone-50 hover:bg-stone-100 text-stone-700 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-stone-200 transition-all active:scale-95"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product.id, 1, product.price);
                        navigate("/cart");
                      }}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
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