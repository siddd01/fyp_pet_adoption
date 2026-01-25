import {
  ArrowLeft,
  Calendar,
  Heart,
  Package,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Tag,
} from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../Context/ProductContext";

import { CartContext } from "../../Context/CartContext";



const ProductDetails = () => {
  const { id } = useParams();               // 👈 product id from URL
  const navigate = useNavigate();
  const { products, productLoading } = useContext(ProductContext);
  const {  addToCart } = useContext(CartContext);

  const [isFavorited, setIsFavorited] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);

  // 🔍 Find product by id
  const product = products.find(
    (p) => Number(p.id) === Number(id)
  );

  if (productLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Shop</span>
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 rounded-full hover:bg-rose-50 transition"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-50 transition">
              <Share2 className="w-6 h-6 text-gray-400 hover:text-blue-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image and Quick Info Side by Side */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="relative w-[400px] h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain bg-white"
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition"
                    >
                      <Heart className={`w-6 h-6 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">
                        Only {product.stock} left!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-3">
                    {product.category}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">(4.8 rating)</span>
                  </div>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    ${product.price}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Listed {new Date(product.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                    <Package className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600 mt-1">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600">{product.quantity}</p>
                    <p className="text-sm text-gray-600 mt-1">Available</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl col-span-2">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600 mt-1">Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Features/Benefits */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-emerald-900">Key Features</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">Premium quality materials and ingredients</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">Safe for daily use and pet-friendly</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">Fast shipping and easy returns</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6 text-emerald-600" />
                Product Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-800 mb-1">Category</p>
                  <p className="text-gray-600">{product.category}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-800 mb-1">Stock Status</p>
                  <p className="text-gray-600">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                  <p className="font-semibold text-gray-800 mb-1">Available Quantity</p>
                  <p className="text-gray-600">{product.quantity} units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-emerald-100">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Price</p>
                <p className="text-4xl font-bold text-emerald-600">${product.price}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600 font-bold transition"
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    value={cartQuantity}
                    onChange={(e) => setCartQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
                  />
                  <button 
                    onClick={() => setCartQuantity(Math.min(product.quantity, cartQuantity + 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </button>
                
              <button
        className="w-full border-2 border-emerald-600 text-emerald-600 py-4 rounded-xl hover:bg-emerald-50 transition font-semibold flex items-center justify-center gap-2"
        onClick={() => addToCart(product.id, 1, product.price)}
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>

              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  🚚 Free shipping on orders over $50
                </p>
              </div>

              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  ⚡ {product.stock} units available - Order soon!
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Secure packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;