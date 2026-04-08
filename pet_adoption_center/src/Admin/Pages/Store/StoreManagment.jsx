import { useContext, useState } from "react";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const StoreManagement = () => {
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
    quantity: "",
  };
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- Functions ---
  const handleEditClick = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      quantity: product.quantity,
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

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this item from inventory?")) return;
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("staffToken");
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("staffToken");
      const url = editingId ? `/products/${editingId}` : "/products";
      const method = editingId ? "put" : "post";

      await api[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`✅ Product ${editingId ? "updated" : "added"} successfully`);
      fetchProducts();
      setView("list");
    } catch (err) {
      alert(err.response?.data?.error || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🔐</span>
          <p className="text-stone-800 font-medium">Accessing Master Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ── Header ── */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-24 pb-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">Inventory Control</p>
              </div>
              <h1 className="text-stone-900 text-5xl md:text-7xl font-medium tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                {view === "list" ? "Global " : editingId ? "Modify " : "New " }
                <span className="italic text-stone-500">{view === "list" ? "Inventory" : "Entry"}</span>
              </h1>
            </div>

            <div className="bg-stone-900 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-6">
              <div>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Database</p>
                <p className="text-2xl font-medium tracking-tight">{products.length} Items</p>
              </div>
              <div className="h-8 w-[1px] bg-stone-700"></div>
              <button 
                onClick={view === "list" ? handleAddNew : () => setView("list")} 
                className="text-[10px] font-bold uppercase tracking-widest hover:text-stone-300 transition-colors"
              >
                {view === "list" ? "+ New Entry" : "← Back to List"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {view === "list" ? (
          /* ── GRID VIEW ── */
          products.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-stone-200 rounded-[3rem]">
              <p className="text-stone-400 text-sm font-light italic">Database is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img src={product.image_url || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200/50">
                      <p className="text-[8px] font-black uppercase tracking-widest text-stone-800">{product.category}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <h3 className="text-stone-900 font-medium text-xl tracking-tight leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-medium text-stone-900">${product.price}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stock: {product.stock}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleEditClick(product)} className="bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-100 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ── FORM VIEW (Add/Edit) ── */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-16">
            <div className="lg:col-span-7 space-y-10">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">01</div>
                  <h2 className="text-stone-900 font-semibold text-lg tracking-tight">Core Metadata</h2>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Official Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Classification</label>
                      <select name="category" value={form.category} onChange={handleChange} required className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all cursor-pointer">
                        <option value="">Select Category</option>
                        <option value="Food">Nutrition</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Health">Health Care</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Price Point ($)</label>
                      <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Editorial Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="5" className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 p-12 text-center uppercase tracking-widest text-[10px] font-bold">
                         <span className="text-5xl mb-6 grayscale opacity-30">🖼️</span>
                         No Asset Loaded
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 ml-1">Product Imagery</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-[10px] text-stone-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-stone-900 file:text-white hover:file:bg-stone-700 cursor-pointer" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-stone-900 hover:bg-stone-800 text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-3 group">
                  {loading ? "Synchronizing..." : editingId ? "Save Modifications" : "Complete Registry"}
                  <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;