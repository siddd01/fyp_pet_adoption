import { useState } from "react";
import api from "../../../api/axios";

const StaffAddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    quantity: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      const token = localStorage.getItem("staffToken");
      await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Product added to store catalog");

      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        quantity: "",
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Editorial Header ── */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-24 pb-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">
                  Inventory Management
                </p>
              </div>
              <h1 
                className="text-stone-900 text-5xl md:text-6xl font-medium tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Staff <span className="italic text-stone-500">Registry</span>
              </h1>
            </div>
            <div className="max-w-xs border-l border-stone-200 pl-6 text-stone-600 text-sm leading-relaxed font-light italic">
              Register new boutique items into the live catalog. Precise metadata ensures our collection remains organized and accessible.
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Form ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-8 pb-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Product Metadata */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">01</div>
                <h2 className="text-stone-900 font-semibold text-lg tracking-tight">Core Metadata</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Official Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Product Name"
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all placeholder:text-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Classification</label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="Category"
                      className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all placeholder:text-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Price Point ($)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe the product details..."
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all resize-none placeholder:text-stone-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">02</div>
                <h2 className="text-stone-900 font-semibold text-lg tracking-tight">Stock Logistics</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Total Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Available Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Assets & Submit */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Image Preview Box */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 uppercase tracking-widest text-[10px] font-bold p-12 text-center">
                       <span className="text-5xl mb-6 grayscale opacity-30">🖼️</span>
                       Asset Preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-70">Catalog Entry</p>
                    <h3 className="text-2xl font-medium italic leading-tight">{formData.name || "Product Title"}</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 ml-1">Product Imagery</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="w-full text-[10px] text-stone-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-stone-900 file:text-white hover:file:bg-stone-700 cursor-pointer transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-stone-200 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                {loading ? "Registering..." : "Complete Registry"}
                <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAddProduct;