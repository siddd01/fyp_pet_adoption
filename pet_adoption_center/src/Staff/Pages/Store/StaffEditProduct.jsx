import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

const StaffEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setForm(res.data);
      if (res.data.image_url) setImagePreview(res.data.image_url);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("staffToken");
      await api.put(`/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product updated successfully");
      navigate("/staff/store/products");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Header ── */}
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
                Edit <span className="italic text-stone-500">Product</span>
              </h1>
            </div>
            <div className="max-w-xs border-l border-stone-200 pl-6">
              <p className="text-stone-600 text-sm leading-relaxed font-light italic">
                Maintain the premium quality of Sano Ghar by ensuring all product details and stock levels are precise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-8 pb-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Product Details */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">01</div>
                <h2 className="text-stone-900 font-semibold text-lg tracking-tight">Core Details</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Product Designation</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name..."
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Collection / Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 appearance-none focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Food">Nutrition & Food</option>
                        <option value="Accessories">Daily Essentials</option>
                        <option value="Toys">Play & Training</option>
                        <option value="Grooming">Care & Grooming</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Retail Price (USD)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Product Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100">
               <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">02</div>
                <h2 className="text-stone-900 font-semibold text-lg tracking-tight">Inventory Logistics</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Stock Count</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Unit Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview & Media */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Image Preview Card */}
              <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                       <span className="text-6xl mb-4">🖼️</span>
                       <p className="text-[10px] uppercase tracking-widest font-bold">No Preview Available</p>
                    </div>
                  )}
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Live Shop Preview</p>
                    <h3 className="text-white font-medium text-2xl tracking-tight leading-tight italic">{form.name || "Untitled Product"}</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 ml-1">Update Media Asset</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-[10px] text-stone-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-stone-900 file:text-white hover:file:bg-stone-700 cursor-pointer transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-stone-200 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                >
                  {loading ? "Processing..." : "Commit Changes"}
                  <svg className="transform group-hover/btn:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/staff/store/products")}
                  className="w-full bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-900 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Discard Edits
                </button>
              </div>

              {/* Info Box */}
              <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">💡</span>
                  <p className="text-stone-900 text-[10px] font-bold uppercase tracking-widest">Note</p>
                </div>
                <p className="text-stone-500 text-xs font-light leading-relaxed">
                  Price and Stock adjustments are synchronized in real-time. Customers will see these changes upon their next refresh.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffEditProduct;