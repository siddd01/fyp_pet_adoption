import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import { getOptimizedImageUrl } from "../../../User/Services/imageService.jsx";

const fulfillmentStyles = {
  new: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delivering: "bg-sky-50 text-sky-700 border-sky-200",
  delivered: "bg-stone-100 text-stone-700 border-stone-200",
};

const paymentStyles = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  refunded: "bg-stone-100 text-stone-700 border-stone-200",
};

const formatCurrency = (value) =>
  `NPR ${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const formatDate = (value, options) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", options);
};

const StaffHandleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [actionOrderId, setActionOrderId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const fetchOrders = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await api.get("/staff/orders");
      setOrders(Array.isArray(res.data?.orders) ? res.data.orders : []);
      setFeedback((current) => (current.type === "error" ? { type: "", text: "" } : current));
    } catch (error) {
      console.error("Failed to fetch staff orders:", error);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Could not load store orders right now.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    setActionOrderId(orderId);
    setFeedback({ type: "", text: "" });

    try {
      const res = await api.put(`/staff/orders/${orderId}/accept`);
      const updatedOrder = res.data?.order;

      if (updatedOrder) {
        setOrders((current) =>
          current.map((order) => (order.order_id === updatedOrder.order_id ? updatedOrder : order))
        );
      } else {
        await fetchOrders({ silent: true });
      }

      setFeedback({
        type: res.data?.emailSent === false ? "warning" : "success",
        text: res.data?.message || "Order accepted successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to accept this order.",
      });
    } finally {
      setActionOrderId(null);
    }
  };

  const summary = useMemo(() => {
    const awaiting = orders.filter((order) => order.fulfillment_status === "new").length;
    const accepted = orders.filter((order) => order.fulfillment_status === "accepted").length;

    return {
      total: orders.length,
      awaiting,
      accepted,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((order) => order.fulfillment_status === activeFilter);
  }, [activeFilter, orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-stone-600">Loading store orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
                Staff Workspace
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight">
                Handle Orders
              </h1>
              <p className="mt-3 text-sm md:text-base text-stone-500 max-w-2xl">
                Review paid customer orders, check item lines and delivery details, and accept each order for dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-full lg:min-w-[430px]">
              <SummaryCard label="Paid Orders" value={summary.total} />
              <SummaryCard label="Awaiting Review" value={summary.awaiting} highlight={summary.awaiting > 0} />
              <SummaryCard label="Accepted" value={summary.accepted} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Orders" },
              { key: "new", label: "Awaiting Acceptance" },
              { key: "accepted", label: "Accepted" },
            ].map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
                  activeFilter === filter.key
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-600 hover:border-stone-500"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchOrders({ silent: true })}
            disabled={refreshing}
            className="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:bg-stone-100 transition disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>

        {feedback.text && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm flex items-center gap-2 ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : feedback.type === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {feedback.text}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-20 px-6 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <h2 className="text-2xl font-serif text-stone-900">No matching orders</h2>
            <p className="mt-3 text-sm text-stone-500 max-w-md mx-auto">
              Completed customer orders will appear here once payment is confirmed.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const fulfillmentClass =
                fulfillmentStyles[order.fulfillment_status] || "bg-stone-100 text-stone-700 border-stone-200";
              const paymentClass =
                paymentStyles[order.payment_status] || "bg-stone-100 text-stone-700 border-stone-200";

              return (
                <article
                  key={order.order_id}
                  className="rounded-3xl border border-stone-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                          Order #{order.order_id}
                        </p>
                        <h2 className="mt-2 text-2xl font-serif text-stone-900">
                          {order.user_name || order.full_name || "Customer"}
                        </h2>
                        <p className="mt-2 text-sm text-stone-500">
                          Placed on {formatDate(order.created_at, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${paymentClass}`}>
                          Payment {order.payment_status}
                        </span>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${fulfillmentClass}`}>
                          {order.fulfillment_status === "new" ? "Awaiting Acceptance" : order.fulfillment_status}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5 text-sm">
                      <InfoTile icon={<UserRound className="w-4 h-4" />} label="Customer" value={order.full_name || order.user_name || "Not available"} />
                      <InfoTile icon={<Mail className="w-4 h-4" />} label="Email" value={order.email || "Not provided"} />
                      <InfoTile icon={<Phone className="w-4 h-4" />} label="Phone" value={order.phone || "Not provided"} />
                      <InfoTile icon={<MapPin className="w-4 h-4" />} label="Delivery Address" value={order.shipping_address || "Not provided"} />
                      <InfoTile icon={<PackageCheck className="w-4 h-4" />} label="Handled By" value={order.staff_name || "Unassigned"} />
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4 md:p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                            Order Items
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {order.items.length} line item{order.items.length === 1 ? "" : "s"} in this order
                          </p>
                        </div>

                        <p className="text-lg font-semibold text-stone-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={`${order.order_id}-${item.product_id}`}
                            className="rounded-2xl border border-stone-200 bg-white px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center"
                          >
                            <div className="h-20 w-full md:w-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                              {item.image_url ? (
                                <img
                                  src={getOptimizedImageUrl(item.image_url, { width: 300, height: 300 })}
                                  alt={item.product_name || "Ordered item"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-stone-300">
                                  <Package className="w-8 h-8" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-stone-900">
                                {item.product_name || "Product unavailable"}
                              </h3>
                              <p className="text-sm text-stone-500 mt-1">
                                {item.category || "General"}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:w-[280px]">
                              <MiniTile label="Qty" value={item.quantity} />
                              <MiniTile label="Unit Price" value={formatCurrency(item.price_at_purchase)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 flex-1">
                        <InfoTile
                          icon={<Clock3 className="w-4 h-4" />}
                          label="Accepted At"
                          value={order.handled_at ? formatDate(order.handled_at, { month: "short", day: "numeric", year: "numeric" }) : "Pending"}
                        />
                        <InfoTile
                          icon={<CheckCircle2 className="w-4 h-4" />}
                          label="Estimated Delivery"
                          value={order.estimated_delivery_date ? formatDate(order.estimated_delivery_date, { month: "long", day: "numeric", year: "numeric" }) : "Within 3 days after acceptance"}
                        />
                        <InfoTile
                          icon={<PackageCheck className="w-4 h-4" />}
                          label="Charity Portion"
                          value={formatCurrency(order.charity_amount)}
                        />
                      </div>

                      <div className="lg:pl-4">
                        {order.fulfillment_status === "new" ? (
                          <button
                            type="button"
                            onClick={() => handleAcceptOrder(order.order_id)}
                            disabled={actionOrderId === order.order_id}
                            className="rounded-2xl bg-stone-900 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-stone-800 transition disabled:opacity-50"
                          >
                            {actionOrderId === order.order_id ? "Accepting..." : "Accept Order"}
                          </button>
                        ) : (
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                            Order already accepted{order.staff_name ? ` by ${order.staff_name}` : ""}.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value, highlight = false }) => (
  <div className={`rounded-2xl border px-5 py-4 ${highlight ? "border-amber-200 bg-amber-50" : "border-stone-200 bg-stone-50"}`}>
    <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-stone-900">{value}</p>
  </div>
);

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
    <p className="text-xs uppercase tracking-widest text-stone-400 font-bold flex items-center gap-2">
      {icon}
      {label}
    </p>
    <p className="mt-2 font-medium text-stone-800 text-sm leading-6">{value}</p>
  </div>
);

const MiniTile = ({ label, value }) => (
  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3">
    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{label}</p>
    <p className="mt-1 text-sm font-semibold text-stone-900">{value}</p>
  </div>
);

export default StaffHandleOrders;
