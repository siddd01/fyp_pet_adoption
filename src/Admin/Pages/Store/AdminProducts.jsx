import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, productLoading, fetchProducts } = useContext(ProductContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">Loading products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
              Admin Panel
            </p>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">
              Products
            </h1>
          </div>
          <span className="text-xs text-stone-400 mb-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Empty State ── */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🛍️</p>
            <p className="text-stone-400 text-sm">No products found</p>
          </div>
        ) : (

          /* ── Product Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-stone-200 transition-all duration-200 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent" />
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-stone-800 mb-0.5 truncate">{product.name}</h3>
                  <p className="text-xs text-stone-400 mb-3 flex-1">
                    {product.description
                      ? product.description.slice(0, 60) + (product.description.length > 60 ? "…" : "")
                      : "No description"}
                  </p>
                  <p className="text-base font-bold text-stone-900 mb-4">${product.price}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-400 py-2 rounded-xl text-xs font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 py-2 rounded-xl text-xs font-medium transition"
                    >
                      Delete
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

export default AdminProducts;