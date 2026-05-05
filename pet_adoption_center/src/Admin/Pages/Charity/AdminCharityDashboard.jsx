import {
  BarChart3,
  Heart,
  Loader2,
  Package,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import { getProfileImageSrc } from "../../../utils/imageHelpers";
import AnalyticsCharts from "../../Components/AnalyticsCharts.jsx";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const formatCurrency = (value) =>
  `NPR ${currencyFormatter.format(Number(value || 0))}`;

const formatDate = (value) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const formatShortDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SectionShell = ({ title, subtitle, icon, children, action }) => (
  <section className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
    <div className="border-b border-stone-100 px-6 py-5 sm:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl bg-stone-100 p-3 text-stone-700">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-serif text-stone-900">{title}</h2>
          {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-6 sm:p-8">{children}</div>
  </section>
);

const StatCard = ({ title, value, helper, icon, tone = "stone" }) => {
  const tones = {
    stone: "bg-stone-50 border-stone-200 text-stone-900",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-800",
    blue: "bg-blue-50 border-blue-100 text-blue-800",
    rose: "bg-rose-50 border-rose-100 text-rose-800",
    amber: "bg-amber-50 border-amber-100 text-amber-800",
  };

  return (
    <div className={`rounded-[1.75rem] border p-5 ${tones[tone] || tones.stone}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70">
          {title}
        </p>
        <div className="opacity-75">{icon}</div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {helper && <p className="text-sm opacity-75 mt-2">{helper}</p>}
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="rounded-[1.75rem] border border-dashed border-stone-200 bg-stone-50 px-6 py-14 text-center text-sm text-stone-500">
    {message}
  </div>
);

const AdminCharityDashboard = () => {
  const [inflowStats, setInflowStats] = useState({
    total: 0,
    fromStore: 0,
    fromDirect: 0,
    chart: [],
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [storeAnalysis, setStoreAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const pendingDonation = Number(storeAnalysis?.pending_donation || 0);

  const fetchDashboardData = async () => {
    const [statsRes, donationsRes, storeRes] = await Promise.all([
      api.get("/admin/inflow-stats"),
      api.get("/admin/recent-donations"),
      api.get("/admin/store-analysis"),
    ]);

    setInflowStats(statsRes.data || {});
    setRecentDonations(donationsRes.data || []);
    setStoreAnalysis(storeRes.data || null);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);

      try {
        await fetchDashboardData();
      } catch (error) {
        console.error("Failed to fetch charity dashboard data:", error);
        if (active) {
          setInflowStats({ total: 0, fromStore: 0, fromDirect: 0, chart: [] });
          setRecentDonations([]);
          setStoreAnalysis(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const handleDonateStoreCharity = async () => {
    if (pendingDonation <= 0) return;

    try {
      setDonating(true);
      setStatusMessage("");
      const res = await api.post("/admin/donate-store-charity");
      setStatusMessage(
        res.data?.message ||
          "Pending donation amount has been shifted to charity from the store."
      );
      const refreshedStoreRes = await api.get("/admin/store-analysis");
      setStoreAnalysis(refreshedStoreRes.data || null);
    } catch (error) {
      console.error("Failed to shift store charity:", error);
      setStatusMessage(
        error.response?.data?.message || "Failed to shift the pending donation amount."
      );
    } finally {
      setDonating(false);
    }
  };

  const summaryCards = useMemo(
    () => [
      {
        title: "Pending Store Donation",
        value: formatCurrency(storeAnalysis?.pending_donation || 0),
        helper: `${Number(storeAnalysis?.total_orders || 0).toLocaleString()} completed store orders tracked`,
        icon: <Heart className="w-5 h-5" />,
        tone: "emerald",
      },
      {
        title: "Already Shifted",
        value: formatCurrency(storeAnalysis?.donated_amount || 0),
        helper: "Moved from store contributions to charity",
        icon: <Wallet className="w-5 h-5" />,
        tone: "blue",
      },
      {
        title: "Store Contribution Total",
        value: formatCurrency(storeAnalysis?.total_store_charity || 0),
        helper: "All 2% store charity collected so far",
        icon: <ShoppingBag className="w-5 h-5" />,
        tone: "stone",
      },
      {
        title: "Direct Donations",
        value: formatCurrency(inflowStats?.fromDirect || 0),
        helper: "Direct public giving through the donation page",
        icon: <Heart className="w-5 h-5" />,
        tone: "rose",
      },
      {
        title: "Total Charity Funds",
        value: formatCurrency(storeAnalysis?.total_donations || 0),
        helper: "Store charity plus direct donations",
        icon: <BarChart3 className="w-5 h-5" />,
        tone: "amber",
      },
    ],
    [inflowStats?.fromDirect, storeAnalysis]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading charity stats...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10 space-y-8">
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700">
          Charity Control Room
        </p>
        <h1 className="text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight">
          Store Charity <span className="italic text-stone-500">Insights</span>
        </h1>
        <p className="max-w-3xl text-sm text-stone-500">
          Review the live 2% store contribution, shift the pending donation amount to charity,
          and track recent purchase and transfer history from real store data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <SectionShell
        title="Shift Pending Store Charity"
        subtitle="Only completed store orders that have not yet been shifted are included here."
        icon={<Heart className="w-5 h-5" />}
        action={
          <button
            type="button"
            onClick={handleDonateStoreCharity}
            disabled={donating || pendingDonation <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {donating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
            {donating ? "Shifting..." : "Donate Now"}
          </button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3">
              Pending Donation Amount
            </p>
            <p className="text-4xl font-semibold text-emerald-900 tracking-tight">
              {formatCurrency(pendingDonation)}
            </p>
            <p className="text-sm text-emerald-800/80 mt-3 max-w-xl">
              This is the real 2% charity amount currently waiting to be shifted from completed
              store orders into charity funds.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">
              Current Status
            </p>
            <p className="text-lg font-semibold text-stone-900">
              {pendingDonation > 0
                ? `${formatCurrency(pendingDonation)} is ready to shift to charity.`
                : "No pending donation amount is waiting right now."}
            </p>
            <p className="text-sm text-stone-500 mt-3">
              When this button runs, the completed order contributions are marked as shifted and
              added to the store charity transfer history below.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-700">
            {statusMessage}
          </div>
        )}
      </SectionShell>

      {storeAnalysis && (
        <SectionShell
          title="Analytics"
          subtitle="Visual breakdown of sales, order activity, and charity flow."
          icon={<BarChart3 className="w-5 h-5" />}
        >
          <AnalyticsCharts storeAnalysis={storeAnalysis} />
        </SectionShell>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SectionShell
          title="Recent Order History"
          subtitle="Latest completed store purchases contributing to the 2% charity pool."
          icon={<Package className="w-5 h-5" />}
        >
          {!storeAnalysis?.recent_orders?.length ? (
            <EmptyState message="No completed store orders found yet." />
          ) : (
            <div className="space-y-4">
              {storeAnalysis.recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-stone-500 mt-1">
                        {order.customer_name || "Customer"} - {Number(order.item_count || 0)} item
                        {Number(order.item_count || 0) === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-semibold text-stone-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        2% charity: {formatCurrency(order.charity_amount)}
                      </p>
                      <p className="text-xs text-stone-400 mt-2 uppercase tracking-wider">
                        {order.fulfillment_status || order.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="2% Charity Transfer History"
          subtitle="Recent times the pending store donation amount was shifted to charity."
          icon={<ShoppingBag className="w-5 h-5" />}
        >
          {!storeAnalysis?.charity_transfer_history?.length ? (
            <EmptyState message="No store charity transfers have been recorded yet." />
          ) : (
            <div className="space-y-4">
              {storeAnalysis.charity_transfer_history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {formatCurrency(entry.amount)} shifted to charity
                      </p>
                      <p className="text-sm text-stone-500 mt-1">
                        {Number(entry.orders_count || 0)} completed order
                        {Number(entry.orders_count || 0) === 1 ? "" : "s"} included
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        {entry.admin_name || "Admin"} - {formatDate(entry.created_at)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                        Transfer Logged
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        {formatShortDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionShell>
      </div>

      <SectionShell
        title="Recent Donation History"
        subtitle="Latest direct donations made through the public donation page."
        icon={<User className="w-5 h-5" />}
      >
        {!recentDonations.length ? (
          <EmptyState message="No direct donations have been completed yet." />
        ) : (
          <div className="space-y-4">
            {recentDonations.slice(0, 10).map((donation) => (
              <div
                key={donation.id}
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={getProfileImageSrc(donation.profile_image)}
                      alt={donation.donor_name || "Donor"}
                      className="h-12 w-12 rounded-full border border-stone-200 object-cover bg-white"
                    />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {donation.donor_name || "Anonymous Donor"}
                      </p>
                      <p className="text-sm text-stone-500">
                        {donation.donor_email || "No email provided"}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {formatDate(donation.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      {donation.message ? `"${donation.message}"` : "No message left"}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mt-2">
                      {donation.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
};

export default AdminCharityDashboard;
