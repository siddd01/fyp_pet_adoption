import {
  ClipboardList,
  LogOut,
  Menu,
  PawPrint,
  ShoppingBag,
  UserCircle,
  X
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StaffContext } from "../../../Context/StaffContext";

const StaffDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { staff } = useContext(StaffContext);
  const location = useLocation();

  const groups = [
    {
      section: "Management Hubs",
      items: [
        { title: "Pet Registry", icon: <PawPrint size={20} />, link: "/staff/pets" },
        { title: "Store Inventory", icon: <ShoppingBag size={20} />, link: "/staff/store" },
      ],
    },
    {
      section: "Administration",
      items: [
        { title: "Adoption Requests", icon: <ClipboardList size={20} />, link: "/staff/adoptions" },
        { title: "My Profile", icon: <UserCircle size={20} />, link: "/staff/profile" },
      ],
    },
  ];

  const stats = [
    { label: "Capacity", value: "85%", color: "text-emerald-600" },
    { label: "Inventory", value: "24", color: "text-violet-600" },
    { label: "Queue", value: "3", color: "text-amber-600" },
  ];

  return (
    <div className="flex min-h-screen bg-[#fbfaf8]">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Area */}
          <div className="mb-10 px-2">
            <h1 className="text-3xl font-serif text-stone-900">Workspace</h1>
            <p className="text-xs font-bold text-stone-400 tracking-widest mt-1 uppercase">Staff Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-8 overflow-y-auto">
            {groups.map((group) => (
              <div key={group.section}>
                <h2 className="px-2 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-3">
                  {group.section}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.link;
                    return (
                      <Link
                        key={item.title}
                        to={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? "bg-stone-900 text-white shadow-md shadow-stone-200" 
                            : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                        }`}
                      >
                        <span className={`${isActive ? "text-white" : "text-stone-400 group-hover:text-stone-900"}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-semibold">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="mt-auto pt-6 border-t border-stone-100">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 font-serif">
                {staff?.first_name?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">{staff?.first_name} {staff?.last_name}</p>
                <p className="text-xs text-stone-400 font-medium tracking-wide">Operations Staff</p>
              </div>
            </div>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden md:flex gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{stat.label}</span>
                <span className={`text-xl font-serif ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full px-3 py-1.5 text-[10px] font-bold text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            OPERATIONAL
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-5xl">
            <header className="mb-10">
              <h2 className="text-4xl font-serif text-stone-900 mb-2">Staff Overview</h2>
              <p className="text-stone-500 italic">Shelter operations and task management hub.</p>
            </header>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/staff/pets" className="group bg-white p-8 rounded-[2rem] border border-stone-200 hover:border-emerald-200 transition-all shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PawPrint />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-1">Pet Registry</h3>
                <p className="text-stone-400 text-sm">Update inventory and listing details.</p>
              </Link>

              <Link to="/staff/adoptions" className="group bg-white p-8 rounded-[2rem] border border-stone-200 hover:border-amber-200 transition-all shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-1">Adoption Hub</h3>
                <p className="text-stone-400 text-sm">Review applications and pending statuses.</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default StaffDashboard;