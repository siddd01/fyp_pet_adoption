import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, productLoading, fetchProducts } =
    useContext(ProductContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts(); // refresh list
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (productLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow p-4">
          <img
            src={product.image_url}
            className="h-32 w-full object-cover rounded"
          />

          <h3 className="font-semibold mt-2">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="font-bold text-emerald-600">${product.price}</p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() =>
                navigate(`/admin/products/edit/${product.id}`)
              }
              className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(product.id)}
              className="flex-1 bg-red-600 text-white text-xs py-1.5 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
