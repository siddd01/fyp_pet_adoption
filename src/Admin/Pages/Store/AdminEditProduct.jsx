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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setForm(res.data);
      if (res.data.image_url) setPreview(res.data.image_url);
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(`/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/store/handle-product");
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition";
  const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
            Admin Panel
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">
            Edit Product
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* ── Section: Product Info ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                  Product Information
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Premium Dog Food"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Price ($)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Stock</label>
                  <input
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Available stock"
                    type="number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Quantity</label>
                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Unit quantity"
                    type="number"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product..."
                    rows="4"
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-xs text-stone-300 mt-1.5 text-right">
                    {form.description?.length || 0} chars
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section: Image ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                  Product Image
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="flex gap-5 items-start">
                {/* Preview */}
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🛍️</span>
                  )}
                </div>

                <div className="flex-1">
                  <label className={labelClass}>Upload New Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white outline-none focus:border-stone-400 transition
                      file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                      file:bg-stone-100 file:text-stone-700 file:text-xs file:font-medium
                      hover:file:bg-stone-200 file:cursor-pointer text-stone-400"
                  />
                  <p className="text-xs text-stone-400 mt-1.5">
                    Leave empty to keep existing image
                  </p>
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => navigate("/admin/store/handle-product")}
                className="px-5 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 rounded-xl transition"
              >
                ← Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Product →"
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminEditProduct;