const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    description:
      "High quality dog food made with natural ingredients for healthy growth",
    category: "Food",
    price: 25.99,
    stock: 12,
    image:
      "https://www.prodograw.com/wp-content/uploads/2024/06/Complete-Chicken-tub-angled-web.png",
  },
  {
    id: 2,
    name: "Cat Scratching Post",
    description:
      "Durable scratching post to keep cats active and protect furniture",
    category: "Accessories",
    price: 18.5,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91",
  },
];

const limitWords = (text, limit = 12) =>
  text.split(" ").slice(0, limit).join(" ") + "...";

const Shop = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Pet Store
        </h2>
        <p className="text-gray-600 mt-2">
          Every purchase supports animal welfare at Sano Ghar
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden
                       hover:shadow-xl transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover
                           group-hover:scale-110 transition duration-500"
              />

              {/* Category Badge */}
              <span className="absolute top-3 left-3 bg-blue-600
                               text-white text-xs px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2">
                {limitWords(product.description)}
              </p>

              <div className="flex justify-between items-center mt-2">
                <p className="text-lg font-bold text-emerald-600">
                  ${product.price}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full
                    ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-3">
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl
                           hover:bg-gray-300 transition text-sm font-medium"
              >
                Add to Cart
              </button>

              <button
                className="flex-1 bg-emerald-600 text-white py-2 rounded-xl
                           hover:bg-emerald-700 active:scale-95 transition text-sm font-medium"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
