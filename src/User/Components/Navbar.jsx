import { ShoppingCart } from "lucide-react";
import { useContext, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-50">
      {/* yellow accent line — same as AdoptionForm / AboutUs */}
      <div className="h-0.5 bg-gradient-to-r from-yellow-700 to-yellow-500" />

      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* ── Left: Logo + Links ── */}
        <div className="flex items-center gap-10">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
              alt="Logo"
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="font-semibold text-stone-900 text-base tracking-tight group-hover:text-stone-600 transition">
              Sano Ghar
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Home",     to: "/" },
              { label: "Adopt",    to: "/adopt" },
              { label: "Shop",     to: "/shop" },
              { label: "About",    to: "/about" },
              { label: "Donate",   to: "/donate" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Right: Cart + User ── */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ShoppingCart size={15} />
            Cart
          </button>

          {/* User section */}
          {user && (
            <div className="flex items-center gap-1">

              {/* Avatar */}
              <button
                onClick={() => navigate("/profile")}
                className="rounded-full ring-2 ring-stone-200 hover:ring-stone-400 transition"
              >
                <img
                  src={user.image || "/default-user.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>

              {/* 3-dot menu */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition text-stone-400 hover:text-stone-700"
                >
                  <FiMoreVertical className="text-lg" />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-stone-100 rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => { navigate("/profile"); setOpenMenu(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition text-left"
                    >
                      Profile
                    </button>
                    <div className="h-px bg-stone-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;