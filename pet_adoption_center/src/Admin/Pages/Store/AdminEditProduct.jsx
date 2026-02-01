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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setForm(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await api.put(`/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/admin/store/handle-product");

    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      {["name", "price", "stock", "quantity"].map((field) => (
        <input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={field}
          className="w-full mb-3 px-4 py-2 border rounded"
        />
      ))}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded"
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Accessories">Accessories</option>
      </select>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />

      <button
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        {loading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default AdminEditProduct;
