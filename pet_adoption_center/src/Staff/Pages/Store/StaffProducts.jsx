import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const StaffProducts = () => {
  const navigate = useNavigate();
  const { products, productLoading, fetchProducts } = useContext(ProductContext);

  const handleDelete = async (id) => {
    const confirmed = await window.appConfirm({
      title: "Delete this product?",
      text: "This product will be removed from the staff catalog.",
      confirmButtonText: "Delete Product",
      cancelButtonText: "Keep Product",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("staffToken");
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
      alert("✅ Product removed successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.error || "Failed to delete product");
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🛍️</span>
          <div className="space-y-2 text-center">
            <p className="text-stone-800 font-medium tracking-tight">Syncing inventory...</p>
            <div className="w-12 h-1 bg-stone-200 mx-auto rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-stone-800 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header Section ── */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-24 pb-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">
                  Staff Dashboard
                </p>
              </div>
              <h1 
                className="text-stone-900 text-5xl md:text-7xl font-medium tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Store <span className="italic text-stone-500">Catalog</span>
              </h1>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
               {/* Stats Chip */}
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
                <div className="text-left">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">Total Inventory</p>
                    <p className="text-2xl font-medium text-stone-900">{products.length} <span className="text-sm text-stone-400 font-light">Items</span></p>
                </div>
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-lg">📦</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inventory Grid ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {products.length === 0 ? (
          <div className="text-center py-40 bg-stone-50/50 border border-dashed border-stone-200 rounded-[3rem]">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-stone-400 text-sm font-light">The catalog is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden bg-stone-100 aspect-square">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200 text-4xl">🛍️</div>
                  )}

                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Stock Badge */}
                  <span className={`absolute top-4 right-4 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${
                    product.stock <= 5 ? "bg-red-500/90 text-white" : "bg-white/90 text-stone-800"
                  }`}>
                    {product.stock <= 5 ? `Low Stock: ${product.stock}` : `In Stock: ${product.stock}`}
                  </span>

                  {/* Floating Identity */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-white font-medium text-lg tracking-tight leading-tight">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-medium text-stone-900">${product.price}</span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">ID: #{product.id.toString().padStart(3, '0')}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => navigate(`/staff/store/products/edit/${product.id}`)}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Edit
                      <svg className="transform group-hover/btn:translate-x-1 transition-transform" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-4 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-100 hover:border-red-100 rounded-xl transition-all duration-300"
                      title="Delete Product"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
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

export default StaffProducts;
