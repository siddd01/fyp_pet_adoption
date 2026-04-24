import {
  ClipboardList,
  LogOut,
  PawPrint,
  ShoppingBag,
  SquareUserRound
} from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StaffContext } from "../../../Context/StaffContext";
import { getProfileImageSrc } from "../../../utils/imageHelpers";

const StaffDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { staff, staffLogout, fetchStaffProfile } = useContext(StaffContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffProfile().catch((error) => {
      console.error("Failed to load staff profile for sidebar", error);
    });
  }, [fetchStaffProfile]);

  const displayName = useMemo(() => {
    const fullName = [staff?.first_name, staff?.last_name].filter(Boolean).join(" ").trim();
    return fullName || staff?.email || "Staff Member";
  }, [staff]);

  const handleLogout = () => {
    staffLogout();
    navigate("/staff/login");
  };

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
        { title: "Profile", icon: <SquareUserRound size={20} />, link: "/staff/profile" },
      ],
    },
  ];

  return (
    <div className="flex min-h-[94vh] bg-[#fbfaf8]">
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
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400">Staff Portal</p>
          </div>

          <nav className="flex-1 space-y-8 overflow-y-auto">
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
                        onClick={() => setIsMobileMenuOpen(false)}
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
              <div className="h-10 w-10 overflow-hidden rounded-full border border-stone-200 bg-stone-100">
                <img
                  src={getProfileImageSrc(staff?.profile_image)}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">{displayName}</p>
                <p className="text-xs font-medium tracking-wide text-stone-400">Operations Staff</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white/80 px-6 backdrop-blur-md lg:h-20 lg:px-10">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 lg:hidden">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-stone-600">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-stone-200 bg-white">
              <img
                src={getProfileImageSrc(staff?.profile_image)}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-stone-800">{displayName}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Operations Staff</p>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              OPERATIONAL
            </div>
          </div>
        </header> */}

        <div className="overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl">
            <header className="mb-10">
              <h2 className="mb-2 text-4xl font-serif text-stone-900">Staff Overview</h2>
              <p className="italic text-stone-500">Shelter operations and task management hub.</p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link
                to="/staff/pets"
                className="group rounded-4xl border border-stone-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                  <PawPrint />
                </div>
                <h3 className="mb-1 text-xl font-bold text-stone-800">Pet Registry</h3>
                <p className="text-sm text-stone-400">Update inventory and listing details.</p>
              </Link>

              <Link
                to="/staff/adoptions"
                className="group rounded-4xl border border-stone-200 bg-white p-8 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
                  <ClipboardList />
                </div>
                <h3 className="mb-1 text-xl font-bold text-stone-800">Adoption Hub</h3>
                <p className="text-sm text-stone-400">Review applications and pending statuses.</p>
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

export default StaffDashboard;
