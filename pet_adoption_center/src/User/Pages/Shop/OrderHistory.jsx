import { AlertCircle, Package, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { getOptimizedImageUrl } from "../../Services/imageService.jsx";

const PAGE_SIZE = 5;

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  refunded: "bg-slate-100 text-slate-700 border-slate-200",
};

const OrderHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const fetchHistory = async (offset = 0, append = false) => {
    try {
      const res = await api.get("/user/history", {
        params: {
          limit: PAGE_SIZE,
          offset,
        },
      });

      const items = Array.isArray(res.data?.items) ? res.data.items : [];

      setHistory((current) => (append ? [...current, ...items] : items));
      setHasMore(Boolean(res.data?.hasMore));
      setTotalItems(Number(res.data?.total || 0));
      setError("");
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError("Could not load your purchase history right now.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSeeMore = async () => {
    setLoadingMore(true);
    await fetchHistory(history.length, true);
  };

  const summary = useMemo(() => {
    return {
      items: totalItems,
      showing: history.length,
    };
  }, [history.length, totalItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-stone-600">Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
            Account
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight">
                Purchase History
              </h1>
              <p className="mt-3 text-sm md:text-base text-stone-500 max-w-2xl">
                Review every item you bought, along with the order status, date, and delivery details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-full lg:min-w-[420px]">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Loaded</p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">{history.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Items</p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">{summary.items}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Showing</p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">
                  {summary.showing}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!error && history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-20 px-6 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <h2 className="text-2xl font-serif text-stone-900">No purchases yet</h2>
            <p className="mt-3 text-sm text-stone-500 max-w-md mx-auto">
              Once you complete a shop order, your bought items will appear here.
            </p>
            <Link
              to="/shop"
              className="inline-flex mt-6 items-center justify-center rounded-2xl bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-stone-800 transition"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((item) => {
              const itemTotal =
                Number(item.price_at_purchase || 0) * Number(item.quantity || 0);
              const orderDate = item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "Unknown date";
              const statusClass =
                statusStyles[item.status] || "bg-stone-100 text-stone-700 border-stone-200";

              return (
                <article
                  key={`${item.order_id}-${item.product_id}-${item.created_at}`}
                  className="rounded-3xl border border-stone-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    <div className="w-full lg:w-36 h-40 lg:h-36 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                      {item.image_url ? (
                        <img
                          src={getOptimizedImageUrl(item.image_url, { width: 500, height: 500 })}
                          alt={item.product_name || "Purchased product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Package className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                            Order #{item.order_id}
                          </p>
                          <h2 className="mt-2 text-2xl font-serif text-stone-900">
                            {item.product_name || "Product unavailable"}
                          </h2>
                          <p className="mt-2 text-sm text-stone-500">
                            {item.category || "General"} • Bought on {orderDate}
                          </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${statusClass}`}>
                            {item.status}
                          </span>
                          <p className="text-xl font-semibold text-stone-900">
                            NPR {itemTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 text-sm">
                        <div className="rounded-2xl bg-stone-50 px-4 py-3 border border-stone-200">
                          <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Quantity</p>
                          <p className="mt-1 font-medium text-stone-800">{item.quantity}</p>
                        </div>
                        <div className="rounded-2xl bg-stone-50 px-4 py-3 border border-stone-200">
                          <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Unit Price</p>
                          <p className="mt-1 font-medium text-stone-800">
                            NPR {Number(item.price_at_purchase || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-stone-50 px-4 py-3 border border-stone-200">
                          <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Payment</p>
                          <p className="mt-1 font-medium text-stone-800">
                            {item.transaction_id || "Not available"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-stone-50 px-4 py-3 border border-stone-200">
                          <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Delivery</p>
                          <p className="mt-1 font-medium text-stone-800 line-clamp-2">
                            {item.shipping_address || "No address saved"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {hasMore && !error && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleSeeMore}
                  disabled={loadingMore}
                  className="rounded-2xl border border-stone-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-800 hover:bg-stone-100 transition disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "See More"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderHistory;
