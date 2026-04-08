import {
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  PawPrint,
  ShoppingBag,
  TrendingUp,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const groups = [
    {
      section: "Human Resources",
      items: [
        {
          title: "Staff Management",
          desc: "Directory of all staff. Add, edit, or revoke access in one place.",
          icon: <Users size={22} />,
          link: "/admin/staff-manage",
          bg: "bg-blue-50",
          iconColor: "bg-blue-100 text-blue-600",
          badge: "Team",
          badgeColor: "bg-blue-100 text-blue-600",
        },
      ],
    },
    {
      section: "Animal Welfare",
      items: [
        {
          title: "Pet Inventory",
          desc: "Manage adoption listings, register new pets, and track deletions.",
          icon: <PawPrint size={22} />,
          link: "/admin/pets",
          bg: "bg-emerald-50",
          iconColor: "bg-emerald-100 text-emerald-600",
          badge: "Live",
          badgeColor: "bg-emerald-100 text-emerald-700",
        },
        {
          title: "Adoption Requests",
          desc: "Review and approve or reject pending applications.",
          icon: <ClipboardList size={22} />,
          link: "/admin/pet/handle-adoptions",
          bg: "bg-amber-50",
          iconColor: "bg-amber-100 text-amber-600",
          badge: "Pending",
          badgeColor: "bg-amber-100 text-amber-700",
        },
      ],
    },
    {
      section: "Commerce & Insights",
      items: [
        {
          title: "Store Products",
          desc: "Add new inventory or restock existing store items.",
          icon: <ShoppingBag size={22} />,
          link: "/admin/store/products",
          bg: "bg-violet-50",
          iconColor: "bg-violet-100 text-violet-600",
          badge: "Stock",
          badgeColor: "bg-violet-100 text-violet-700",
        },
        {
          title: "Sales Analytics",
          desc: "View visual charts of store performance and revenue.",
          icon: <LayoutDashboard size={22} />,
          link: "/admin/store/analytics",
          bg: "bg-indigo-50",
          iconColor: "bg-indigo-100 text-indigo-600",
          badge: "Data",
          badgeColor: "bg-indigo-100 text-indigo-700",
        },
      ],
    },
    {
      section: "Impact",
      items: [
        {
          title: "Charity Analytics",
          desc: "Monitor live collections from donations and sales.",
          icon: <TrendingUp size={22} />,
          link: "/admin/charity/stats",
          bg: "bg-emerald-50",
          iconColor: "bg-emerald-100 text-emerald-600",
          badge: "Finance",
          badgeColor: "bg-emerald-100 text-emerald-700",
        },
        {
          title: "Proof of Impact",
          desc: "Log spending and upload impact posts for the community.",
          icon: <HeartHandshake size={22} />,
          link: "/admin/charity/post",
          bg: "bg-rose-50",
          iconColor: "bg-rose-100 text-rose-600",
          badge: "Action",
          badgeColor: "bg-rose-100 text-rose-700",
        },
      ],
    },
  ];

  const stats = [
    { label: "Active Staff", value: "12", color: "text-blue-600" },
    { label: "Pets Listed", value: "48", color: "text-emerald-600" },
    { label: "Monthly Revenue", value: "$4.2k", color: "text-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf8] px-10 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-5xl font-serif text-stone-900 mb-2">Workspace</h1>
            <p className="text-stone-500 font-medium italic">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2 text-xs font-bold text-stone-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SERVER ONLINE
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">{label}</p>
              <p className={`text-4xl font-serif ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Unified Sections */}
        <div className="space-y-12">
          {groups.map(({ section, items }) => (
            <div key={section}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xs font-bold tracking-[0.3em] text-stone-400 uppercase">
                  {section}
                </h2>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {items.map((card, i) => (
                  <Link
                    key={i}
                    to={card.link}
                    className="group flex items-center bg-white rounded-4xl border border-stone-200 p-6 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mr-6 transition-transform group-hover:scale-110 ${card.iconColor}`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-stone-800 tracking-tight">
                          {card.title}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-sm text-stone-400 leading-snug max-w-62.5">
                        {card.desc}
                      </p>
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