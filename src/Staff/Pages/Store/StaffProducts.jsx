import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ProductContext } from "../../../Context/ProductContext";

const StaffProducts = () => {
  const navigate = useNavigate();
  const { products, productLoading, fetchProducts } = useContext(ProductContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("staffToken");
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts(); // refresh list
      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.error || "Failed to delete product");
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Store Management
          </h1>
          <p className="text-gray-600">Manage and restock products</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛍️</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🛍️</span>
            </div>
            <p className="text-gray-600 font-medium text-lg">No products found</p>
            <p className="text-gray-500 text-sm mt-1">Add your first product to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🛍️</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <p className="font-bold text-emerald-600 text-xl mb-3">${product.price}</p>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    {product.stock !== null && (
                      <p>
                        <span className="font-medium">Stock:</span> {product.stock}
                      </p>
                    )}
                    {product.quantity !== null && (
                      <p>
                        <span className="font-medium">Quantity:</span> {product.quantity}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/staff/store/products/edit/${product.id}`)}
                      className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
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

export default StaffProducts;
