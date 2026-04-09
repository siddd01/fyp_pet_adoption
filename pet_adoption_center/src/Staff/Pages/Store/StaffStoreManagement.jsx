import { useContext, useState } from "react";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const StaffStoreManagement = () => {
  const { products, productLoading, fetchProducts } = useContext(ProductContext);

  // --- UI State Management ---
  const [view, setView] = useState("list"); // "list" or "form"
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Form State ---
  const initialForm = {
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  };
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- Logic Functions ---
  const handleEditClick = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setImagePreview(product.image_url);
    setEditingId(product.id);
    setView("form");
  };

  const handleAddNew = () => {
    setForm(initialForm);
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    setView("form");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // Staff usually has delete permissions for inventory maintenance
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item from the store?")) return;
    try {
      const token = localStorage.getItem("staffToken") || localStorage.getItem("adminToken");
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Inventory update failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("staffToken") || localStorage.getItem("adminToken");
      const url = editingId ? `/products/${editingId}` : "/products";
      const method = editingId ? "put" : "post";
      
      await api[method](url, data, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      fetchProducts();
      setView("list");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update inventory.");
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Store Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Header ── */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-20 pb-8 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-stone-400"></span>
                <p className="text-stone-500 text-[9px] font-bold tracking-[0.3em] uppercase">Staff Operations</p>
              </div>
              <h1 className="text-stone-900 text-4xl md:text-5xl font-medium tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                Inventory <span className="italic text-stone-500">Log</span>
              </h1>
            </div>

            <button 
              onClick={view === "list" ? handleAddNew : () => setView("list")} 
              className="bg-stone-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-stone-800 transition-all"
            >
              {view === "list" ? "+ New Item" : "← Back to Inventory"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {view === "list" ? (
          /* ── GRID VIEW (Compact Cards) ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img src={product.image_url || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-stone-800 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">{product.category}</span>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-white font-semibold text-lg tracking-tight leading-tight">{product.name}</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-1 rounded-md font-bold">${product.price}</span>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Stock: {product.stock}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleEditClick(product)} className="bg-stone-900 text-white text-[9px] font-bold uppercase tracking-widest py-2.5 rounded-lg hover:bg-stone-700 transition-all">Update</button>
                    <button onClick={() => handleDelete(product.id)} className="bg-stone-50 text-stone-400 border border-stone-100 text-[9px] font-bold uppercase tracking-widest py-2.5 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── FORM VIEW (Refined Inputs) ── */
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
              <h2 className="text-stone-900 font-bold text-sm uppercase tracking-widest mb-4">Stock Specifications</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Item Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-stone-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Type</label>
                    <select name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none">
                      <option value="">Select Category</option>
                      <option value="Food">Nutrition</option>
                      <option value="Accessories">Essentials</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Price Point ($)</label>
                    <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Quantity in Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none resize-none" />
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
                <div className="aspect-square bg-stone-50 rounded-2xl overflow-hidden mb-4 border border-stone-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-3xl mb-2">📸</span> No Image
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-[9px] text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-stone-900 file:text-white file:text-[9px] cursor-pointer" />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-stone-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : editingId ? "Update Item" : "Add to Inventory"}
                {!loading && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffStoreManagement;