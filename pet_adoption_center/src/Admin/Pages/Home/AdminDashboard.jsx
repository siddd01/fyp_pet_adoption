import {
  AlertTriangle,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/axios";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import { DEFAULT_PROFILE_IMAGE } from "../../../constants/defaultImages";

const AdminDashboard = () => {
  const { admin } = useContext(AdminAuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    staffCount: 0,
    petCount: 0,
    revenue: 0,
    pendingApplications: 0,
  });
  const location = useLocation();

  const groups = [
    {
      section: "Human Resources",
      items: [
        { title: "Staff Management", icon: <Users size={20} />, link: "/admin/staff-manage" },
        { title: "User Management", icon: <Users size={20} />, link: "/admin/users" },
      ],
    },
    {
      section: "Animal Welfare",
      items: [
        { title: "Pet Inventory", icon: <PawPrint size={20} />, link: "/admin/pets" },
        { title: "Adoption Requests", icon: <ClipboardList size={20} />, link: "/admin/pet/handle-adoptions" },
      ],
    },
    {
      section: "Commerce & Insights",
      items: [
        { title: "Store Products", icon: <ShoppingBag size={20} />, link: "/admin/store/products" },
        { title: "Sales Analytics", icon: <LayoutDashboard size={20} />, link: "/admin/store/analytics" },
      ],
    },
    {
      section: "Impact",
      items: [
        { title: "Charity Analytics", icon: <TrendingUp size={20} />, link: "/admin/charity/stats" },
        { title: "Proof of Impact", icon: <HeartHandshake size={20} />, link: "/admin/charity/post" },
      ],
    },
    {
      section: "Reports",
      items: [
        { title: "Handle Reports", icon: <AlertTriangle size={20} />, link: "/admin/reports" },
        { title: "Post Management", icon: <TrendingUp size={20} />, link: "/admin/community/posts" },
      ],
    },
  ];
    const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const getImageSrc = (value) => {
    if (!value) return DEFAULT_PROFILE_IMAGE;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `http://localhost:5000/uploads/${value}`;
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        const [staffRes, petsRes, storeRes, adoptionRes] = await Promise.all([
          api.get("/staff/get-staff", {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          api.get("/pets"),
          api.get("/admin/store-analysis", {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          api.get("/adoptions", {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        ]);

        const applications = adoptionRes.data?.applications || [];

        setDashboardStats({
          staffCount: staffRes.data?.length || 0,
          petCount: petsRes.data?.length || 0,
          revenue: Number(storeRes.data?.total_sales || 0),
          pendingApplications: applications.filter((app) => app.status === "pending").length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Staff", value: dashboardStats.staffCount, color: "text-blue-600" },
      { label: "Pets", value: dashboardStats.petCount, color: "text-emerald-600" },
      {
        label: "Revenue",
        value: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(dashboardStats.revenue),
        color: "text-indigo-600",
      },
    ],
    [dashboardStats]
  );

  return (
    <div className="flex min-h-screen bg-[#fbfaf8]">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 px-2">
            <h1 className="text-3xl font-serif text-stone-900">Workspace</h1>
            <p className="mt-1 text-xs font-bold tracking-widest text-emerald-600">ADMIN PORTAL</p>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-8 overflow-y-auto">
            {groups.map((group) => (
              <div key={group.section}>
                <h2 className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  {group.section}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.link;
                    return (
                      <Link
                        key={item.title}
                        to={item.link}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? "bg-stone-900 text-white shadow-md shadow-stone-200"
                            : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                        }`}
                      >
                        <span className={isActive ? "text-white" : "text-stone-400 group-hover:text-stone-900"}>{item.icon}</span>
                        <span className="text-sm font-semibold">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto border-t border-stone-100 pt-6">
            <div className="mb-4 flex items-center gap-3 px-2">
              <img
                src={getImageSrc(admin?.profile_image)}
                alt={admin?.full_name || "Admin"}
                className="h-10 w-10 rounded-full border border-stone-200 object-cover bg-stone-100"
              />
              <div>
                <p className="text-sm font-bold text-stone-800">{admin?.full_name || "Admin User"}</p>
                <p className="text-xs text-stone-400">{admin?.email || "admin@sanoghar.com"}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white/80 px-6 backdrop-blur-md lg:h-20 lg:px-10">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 lg:hidden">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden gap-8 md:flex">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">{stat.label}</span>
                <span className={`text-xl font-serif ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-[10px] font-bold text-stone-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE SYSTEM
          </div>
        </header>

        <div className="overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl">
            <header className="mb-10">
              <h2 className="mb-2 text-4xl font-serif text-stone-900">Dashboard Overview</h2>
              <p className="italic text-stone-500">Quick actions and system status for today.</p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link to="/admin/pets" className="group rounded-4xl border border-stone-200 bg-white p-8 transition-all hover:border-emerald-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                  <PawPrint />
                </div>
                <h3 className="mb-1 text-xl font-bold text-stone-800">Manage Animals</h3>
                <p className="text-sm text-stone-400">Update inventory and adoption status.</p>
              </Link>

              <Link
                to="/admin/pet/handle-adoptions"
                className="group rounded-4xl border border-stone-200 bg-white p-8 transition-all hover:border-amber-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
                  <ClipboardList />
                </div>
                <h3 className="mb-1 text-xl font-bold text-stone-800">Adoption Queue</h3>
                <p className="text-sm text-stone-400">
                  {dashboardStats.pendingApplications} pending application{dashboardStats.pendingApplications === 1 ? "" : "s"} waiting for review.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
