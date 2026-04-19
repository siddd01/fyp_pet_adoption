import {
  ArrowLeft,
  Heart,
  Package,
  Share2,
  Shield,
  Star,
  ChevronRight,
} from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ProductContext } from "../../../Context/ProductContext";
import { CartContext } from "../../../Context/CartContext";
import { getOptimizedImageUrl } from "../../Services/imageService.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, productLoading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  const [isFavorited, setIsFavorited] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);

  const product = products.find((p) => Number(p.id) === Number(id));
  const availableStock = Math.max(
    0,
    Number(product?.stock ?? product?.quantity ?? 0)
  );

  const decreaseQuantity = () => {
    setCartQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setCartQuantity((currentQuantity) =>
      Math.min(availableStock || 1, currentQuantity + 1)
    );
  };

  const handleAddToCart = async (goToCart = false) => {
    if (availableStock < 1) {
      alert("This product is out of stock.");
      return;
    }

    const added = await addToCart(product.id, cartQuantity, product.price);

    if (added && goToCart) {
      navigate("/cart");
    }
  };

  if (productLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#faf9f6]">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-4" />
        <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Curating Detail...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf9f6]">
        <p className="text-stone-500 font-serif text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 pb-20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </button>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsFavorited(!isFavorited)} className="text-stone-400 hover:text-rose-500 transition-colors">
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <button className="text-stone-400 hover:text-stone-900 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 mb-8 font-bold">
          <Link to="/" className="hover:text-stone-900">Sano Ghar</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-stone-900">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-stone-900">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 group">
              <img
                src={getOptimizedImageUrl(product.image_url, {
                  width: 1400,
                  height: 1400,
                  crop: "fill",
                })}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm border border-stone-100">
                    Rare Find - {product.stock} Left
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-8 pt-8 border-t border-stone-200">
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">The Story</h3>
                <p className="text-xl font-serif text-stone-700 leading-relaxed italic">
                  "{product.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-8">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">Quality & Ethics</h3>
                  <ul className="space-y-3 text-sm text-stone-600">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Premium pet-grade materials
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sustainably sourced ingredients
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">Shipping</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Thoughtfully packaged in plastic-free materials. Delivered within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <header className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold text-stone-400 tracking-tighter">4.8 / 5.0</span>
                  </div>
                </div>
                <h1 className="text-5xl font-serif text-stone-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-light text-stone-900 tracking-tight">
                  NPR {Number(product.price).toLocaleString()}
                </p>
              </header>

              <div className="h-px bg-stone-200" />

              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Quantity</label>
                  <div className="flex items-center w-fit bg-white border border-stone-200 rounded-2xl p-1">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={availableStock < 1}
                      className="w-10 h-10 rounded-xl hover:bg-stone-50 transition flex items-center justify-center font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-sm">{cartQuantity}</span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={availableStock < 1 || cartQuantity >= availableStock}
                      className="w-10 h-10 rounded-xl hover:bg-stone-50 transition flex items-center justify-center font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-stone-500">
                    {availableStock > 0
                      ? `${availableStock} item${availableStock === 1 ? "" : "s"} available`
                      : "Out of stock"}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={availableStock < 1}
                    className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-all transform active:scale-[0.98] shadow-lg shadow-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={availableStock < 1}
                    className="w-full border-2 border-stone-900 text-stone-900 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add to Collection
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="p-4 bg-white rounded-2xl border border-stone-100 flex flex-col items-center text-center space-y-2">
                  <Shield size={18} className="text-stone-400" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-stone-500">Secure Payment</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-stone-100 flex flex-col items-center text-center space-y-2">
                  <Package size={18} className="text-stone-400" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-stone-500">Swift Delivery</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <Heart size={14} className="text-emerald-600 fill-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Impact</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  2% of this purchase goes directly to the Sano Ghar Charity Fund to provide medical care for rescued stray animals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
