import {
  ClipboardList,
  HeartHandshake,
  PawPrint,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const groups = [
    {
      section: "Staff",
      items: [
        {
          title: "Add Staff",
          desc: "Onboard new staff members to the platform",
          icon: <Users size={22} />,
          link: "/admin/staff-add",
          bg: "bg-blue-50",
          iconColor: "bg-blue-100 text-blue-600",
          badge: "Staff",
          badgeColor: "bg-blue-100 text-blue-600",
        },
        {
          title: "Remove Staff",
          desc: "Revoke access and remove existing staff",
          icon: <Users size={22} />,
          link: "/admin/staff-delete",
          bg: "bg-blue-50",
          iconColor: "bg-blue-100 text-blue-600",
          badge: "Staff",
          badgeColor: "bg-blue-100 text-blue-600",
        },
      ],
    },
    {
      section: "Pets",
      items: [
        {
          title: "Add Pet",
          desc: "Register a new pet to the adoption listings",
          icon: <PawPrint size={22} />,
          link: "/admin/pet/add-pets",
          bg: "bg-emerald-50",
          iconColor: "bg-emerald-100 text-emerald-600",
          badge: "Pets",
          badgeColor: "bg-emerald-100 text-emerald-700",
        },
        {
          title: "Delete Pet",
          desc: "Remove a pet from the adoption listings",
          icon: <PawPrint size={22} />,
          link: "/admin/pet/delete-pets",
          bg: "bg-emerald-50",
          iconColor: "bg-emerald-100 text-emerald-600",
          badge: "Pets",
          badgeColor: "bg-emerald-100 text-emerald-700",
        },
        {
          title: "Adoption Requests",
          desc: "Review and approve or reject adoption applications",
          icon: <ClipboardList size={22} />,
          link: "/admin/pet/handle-adoptions",
          bg: "bg-amber-50",
          iconColor: "bg-amber-100 text-amber-600",
          badge: "Adoptions",
          badgeColor: "bg-amber-100 text-amber-700",
        },
      ],
    },
    {
      section: "Store",
      items: [
        {
          title: "Add Product",
          desc: "List a new product in the store",
          icon: <ShoppingBag size={22} />,
          link: "store/add-product",
          bg: "bg-violet-50",
          iconColor: "bg-violet-100 text-violet-600",
          badge: "Store",
          badgeColor: "bg-violet-100 text-violet-700",
        },
        {
          title: "Restock Products",
          desc: "Update inventory and manage existing products",
          icon: <ShoppingBag size={22} />,
          link: "store/handle-product",
          bg: "bg-violet-50",
          iconColor: "bg-violet-100 text-violet-600",
          badge: "Store",
          badgeColor: "bg-violet-100 text-violet-700",
        },
      ],
    },
    {
      section: "Community",
      items: [
        {
          title: "Charity & Donations",
          desc: "Track campaigns and post charity updates",
          icon: <HeartHandshake size={22} />,
          link: "/admin/charity",
          bg: "bg-rose-50",
          iconColor: "bg-rose-100 text-rose-600",
          badge: "Charity",
          badgeColor: "bg-rose-100 text-rose-700",
        },
      ],
    },
  ];

  const allCards = groups.flatMap((g) => g.items);

  const stats = [
    { label: "Total Modules", value: allCards.length, color: "text-stone-800" },
    { label: "Staff Actions", value: 2, color: "text-blue-600" },
    { label: "Pet Actions", value: 3, color: "text-emerald-600" },
    { label: "Store Actions", value: 2, color: "text-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 px-10 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
              Control Center
            </p>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Active
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Grouped Sections */}
        <div className="space-y-10">
          {groups.map(({ section, items }) => (
            <div key={section}>
              {/* Section Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  {section}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((card, i) => (
                  <Link
                    key={i}
                    to={card.link}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                  >
                    {/* Top accent strip */}
                    <div className={`h-1 w-full ${card.iconColor.split(" ")[0].replace("bg-", "bg-").replace("100", "400")}`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.iconColor}`}>
                          {card.icon}
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      </div>
                      <h2 className="text-sm font-semibold text-stone-800 mb-1 group-hover:text-stone-900">
                        {card.title}
                      </h2>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {card.desc}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-stone-700 transition-colors">
                        Open
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;