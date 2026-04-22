import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, ClipboardList, Clock3, Phone, User2, X, XCircle } from "lucide-react";
import { DEFAULT_PET_IMAGE } from "../constants/defaultImages";

const STATUS_STYLES = {
  pending: {
    card: "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-amber-100/60",
    badge: "border border-amber-300 bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    icon: Clock3,
    iconWrap: "bg-amber-100 text-amber-700",
    label: "Pending Decision",
  },
  approved: {
    card: "border-emerald-200 bg-white",
    badge: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    iconWrap: "bg-emerald-100 text-emerald-700",
    label: "Approved",
  },
  rejected: {
    card: "border-rose-200 bg-white",
    badge: "border border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    icon: XCircle,
    iconWrap: "bg-rose-100 text-rose-700",
    label: "Rejected",
  },
};

const FALLBACK_STATUS = {
  card: "border-stone-200 bg-white",
  badge: "border border-stone-200 bg-stone-100 text-stone-700",
  dot: "bg-stone-400",
  icon: ClipboardList,
  iconWrap: "bg-stone-100 text-stone-700",
  label: "Unknown",
};

const SUMMARY_STYLES = {
  pending: {
    iconWrap: "bg-amber-100 text-amber-700",
    value: "text-amber-700",
  },
  approved: {
    iconWrap: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
  },
  rejected: {
    iconWrap: "bg-rose-100 text-rose-700",
    value: "text-rose-700",
  },
  all: {
    iconWrap: "bg-blue-100 text-blue-700",
    value: "text-blue-700",
  },
};

const PAGE_SIZE = 5;

const formatDate = (value) => {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleDateString();
};

const getStatusStyle = (status) => STATUS_STYLES[status] || FALLBACK_STATUS;

const SummaryCard = ({ label, count, statusKey }) => {
  const summaryStyle = SUMMARY_STYLES[statusKey] || SUMMARY_STYLES.all;
  const iconMap = {
    pending: Clock3,
    approved: CheckCircle2,
    rejected: XCircle,
    all: ClipboardList,
  };
  const Icon = iconMap[statusKey] || ClipboardList;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${summaryStyle.iconWrap}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">{label}</p>
          <p className={`text-2xl font-bold ${summaryStyle.value}`}>{count}</p>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ filter }) => (
  <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
    <p className="text-lg font-semibold text-stone-800">No applications found</p>
    <p className="mt-2 text-sm text-stone-500">
      {filter === "all" ? "There are no adoption applications yet." : `There are no ${filter} applications right now.`}
    </p>
  </div>
);

const DetailsModal = ({ application, onClose, onStatusUpdate }) => {
  const statusStyle = getStatusStyle(application.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-stone-50 px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone-400">Application Review</p>
            <h2 className="text-2xl font-serif font-bold text-stone-900">{application.full_name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 transition hover:bg-stone-200 hover:text-stone-900">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto p-6">
          <div className="flex flex-col gap-5 rounded-3xl bg-stone-900 p-5 text-white sm:flex-row sm:items-center">
            <img src={application.pet_image || DEFAULT_PET_IMAGE} alt={application.pet_name} className="h-24 w-24 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-400">Pet Requested</p>
              <h3 className="mt-1 text-2xl font-serif">{application.pet_name}</h3>
              <p className="mt-2 text-sm text-stone-300">
                {[application.species, application.breed].filter(Boolean).join(" • ") || "Pet details unavailable"}
              </p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}>
              <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
              {statusStyle.label}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Applicant Info</h4>
              <div className="space-y-3 text-sm text-stone-700">
                <p><strong>Name:</strong> {application.full_name}</p>
                <p><strong>Age:</strong> {application.age}</p>
                <p><strong>Phone:</strong> {application.phone}</p>
                <p><strong>Occupation:</strong> {application.job}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Timeline</h4>
              <div className="space-y-3 text-sm text-stone-700">
                <p><strong>Applied on:</strong> {formatDate(application.created_at)}</p>
                <p><strong>Status:</strong> {statusStyle.label}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Previous Experience</h4>
              <p className="text-sm leading-7 text-stone-700">{application.experience_with_pets}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Reason for Adoption</h4>
              <p className="text-sm leading-7 text-stone-700">{application.reason_for_adoption}</p>
            </div>
          </div>
        </div>

        {application.status === "pending" && (
          <div className="flex flex-col gap-3 border-t bg-white p-6 sm:flex-row">
            <button
              onClick={() => onStatusUpdate(application.id, "approved")}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Approve Application
            </button>
            <button
              onClick={() => onStatusUpdate(application.id, "rejected")}
              className="flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-bold text-rose-700 transition hover:bg-rose-100"
            >
              Reject Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdoptionApplicationsBoard = ({
  panelLabel,
  description,
  applications,
  loading,
  filter,
  setFilter,
  selectedApp,
  setSelectedApp,
  onStatusUpdate,
}) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filterConfig = {
    all: { label: "All", count: applications.length },
    pending: { label: "Pending", count: applications.filter((app) => app.status === "pending").length },
    approved: { label: "Approved", count: applications.filter((app) => app.status === "approved").length },
    rejected: { label: "Rejected", count: applications.filter((app) => app.status === "rejected").length },
  };

  const filteredApplications = applications.filter((app) => filter === "all" || app.status === filter);
  const visibleApplications = filteredApplications.slice(0, visibleCount);
  const hasMoreApplications = visibleCount < filteredApplications.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, applications.length]);

  return (
    <div className="min-h-screen bg-stone-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">{panelLabel}</p>
            <h1 className="text-4xl font-serif leading-tight text-stone-900">Adoption Applications</h1>
            <p className="mt-2 text-sm text-stone-500">{description}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {Object.entries(filterConfig).map(([key, { label, count }]) => (
            <SummaryCard key={key} label={label} count={count} statusKey={key} />
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(filterConfig).map(([key, { label, count }]) => {
            const isActive = filter === key;
            const activeClasses =
              key === "pending"
                ? "border-amber-300 bg-amber-100 text-amber-900"
                : "border-stone-900 bg-stone-900 text-white";

            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive ? activeClasses : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                }`}
              >
                {label} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-14 text-center text-stone-400">
            Loading applications...
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="grid gap-5">
            {visibleApplications.map((app) => {
              const statusStyle = getStatusStyle(app.status);
              const StatusIcon = statusStyle.icon;

              return (
                <article
                  key={app.id}
                  className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusStyle.card}`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <img
                        src={app.pet_image || DEFAULT_PET_IMAGE}
                        alt={app.pet_name}
                        className="h-20 w-20 rounded-2xl border border-stone-200 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold text-stone-900">{app.pet_name}</h2>
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                            #{app.id}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-stone-500">
                          {[app.species, app.breed].filter(Boolean).join(" • ") || "Pet details unavailable"}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <div className="flex items-center gap-2 text-sm text-stone-700">
                            <User2 size={16} className="text-stone-400" />
                            <span className="truncate">{app.full_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-700">
                            <Phone size={16} className="text-stone-400" />
                            <span>{app.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-700">
                            <CalendarDays size={16} className="text-stone-400" />
                            <span>{formatDate(app.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
                      <span className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}>
                        <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </span>

                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statusStyle.iconWrap}`}>
                        <StatusIcon size={18} />
                      </div>

                      <button
                        onClick={() => setSelectedApp(app)}
                        className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:text-stone-900"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {hasMoreApplications && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedApp && (
        <DetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdoptionApplicationsBoard;
