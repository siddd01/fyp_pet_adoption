import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, productLoading, fetchProducts } = useContext(ProductContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this product from the database?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // refresh list
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error: Could not remove product.");
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🔐</span>
          <p className="text-stone-800 font-medium tracking-tight">Accessing Secure Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Admin Header ── */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-24 pb-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">
                  Master Control
                </p>
              </div>
              <h1 
                className="text-stone-900 text-5xl md:text-7xl font-medium tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Global <span className="italic text-stone-500">Inventory</span>
              </h1>
            </div>

            {/* Total Items Counter */}
            <div className="bg-stone-900 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-6">
              <div>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Live Database</p>
                <p className="text-2xl font-medium tracking-tight">{products.length} Products</p>
              </div>
              <div className="h-8 w-[1px] bg-stone-700"></div>
              <button 
                onClick={() => navigate("/admin/products/add")} 
                className="text-[10px] font-bold uppercase tracking-widest hover:text-stone-300 transition-colors"
              >
                + New Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {products.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-stone-200 rounded-[3rem]">
            <p className="text-stone-400 text-sm font-light italic">Database is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col"
              >
                {/* Visual Asset Container */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-80" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200/50">
                    <p className="text-[8px] font-black uppercase tracking-widest text-stone-800">{product.category}</p>
                  </div>

                  {/* Name Overlay */}
                  <div className="absolute bottom-5 left-6 right-6">
                    <h3 className="text-white font-medium text-xl tracking-tight leading-tight group-hover:italic transition-all">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Management Controls */}
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-medium text-stone-900">${product.price}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-100 hover:border-red-100 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-300"
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