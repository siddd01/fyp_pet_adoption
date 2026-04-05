import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

const AdminEditProduct = () => {
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
  
  // Append all text fields
  data.append("name", form.name);
  data.append("description", form.description);
  data.append("category", form.category);
  data.append("price", form.price);
  data.append("stock", form.stock);
  data.append("quantity", form.quantity);

  // CRITICAL: Only append image if it's a File object (a new selection)
  if (image) {
    data.append("image", image);
  }

  try {
    // Make sure you use the correct token key (adminToken vs staffToken)
    const token = localStorage.getItem("adminToken"); 
    
    await api.put(`/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type manually, Axios/Browser will do it for FormData
      },
    });

    alert("✅ Product updated successfully");
    navigate("/admin/store/handle-product");
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
                  Administrator Console
                </p>
              </div>
              <h1 
                className="text-stone-900 text-5xl md:text-6xl font-medium tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Modify <span className="italic text-stone-500">Listing</span>
              </h1>
            </div>
            <div className="max-w-xs border-l border-stone-200 pl-6 text-stone-600 text-sm leading-relaxed font-light italic">
              You are editing a live product. Please ensure all technical specifications and pricing are accurate before committing changes.
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Form ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-8 pb-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Product Configuration */}
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
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Classification</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 appearance-none focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        <option value="Food">Nutrition</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Price Point ($)</label>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Editorial Description</label>
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
                <h2 className="text-stone-900 font-semibold text-lg tracking-tight">Stock & Units</h2>
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
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-1">Weight / Quantity</label>
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

          {/* RIGHT: Visual Assets & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Image Preview Box */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 uppercase tracking-widest text-[10px] font-bold">
                       <span className="text-5xl mb-4">🖼️</span>
                       No Asset Found
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-70">Catalog Preview</p>
                    <h3 className="text-2xl font-medium italic">{form.name || "Untitled"}</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 ml-1">Replace Media</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full text-[10px] text-stone-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-stone-900 file:text-white hover:file:bg-stone-700 cursor-pointer transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-stone-200 transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  {loading ? "Synchronizing..." : "Update Master Record"}
                  <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/store/handle-product")}
                  className="w-full bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-900 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Discard Changes
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;