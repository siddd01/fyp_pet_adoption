import { Bell, ShoppingCart } from "lucide-react";
import { useContext, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 to detect active page
  const { user, logout } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Adopt Now", path: "/adopt" },
    { name: "Shop Now", path: "/shop" },
    { name: "Community", path: "/community" },
    { name: "About Us", path: "/about" },
    { name: "Donate", path: "/donate" },
  ];

  return (
    <nav className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between shadow-sm">
      
      {/* LEFT - LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
          alt="Logo"
          className="h-9 w-9 rounded-lg"
        />
        <span className="font-bold text-xl text-stone-900 tracking-wide">
          Sano Ghar
        </span>
      </div>

      {/* CENTER - NAV LINKS */}
      <div className="hidden md:flex gap-10 text-base font-bold absolute left-1/2 transform -translate-x-1/2">

        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative transition-all duration-200 ${
                isActive
                  ? "text-stone-900 font-semibold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {link.name}

              {/* underline animation */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-stone-900 transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* RIGHT - ICONS + USER */}
      <div className="relative flex items-center gap-3">
        
        {/* Notification */}
        <button
          onClick={() => navigate("/notifications")}
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition shadow-sm"
        >
          <Bell size={18} className="text-stone-700" />
        </button>

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="p-2 rounded-xl bg-stone-600 hover:bg-stone-700 transition shadow-md"
        >
          <ShoppingCart size={18} className="text-white" />
        </button>

        {/* USER */}
        {user && (
          <>
            <img
              src={user.image || "/default-user.png"}
              alt="Profile"
              className="h-9 w-9 rounded-full border-2 border-stone-200 cursor-pointer hover:scale-105 transition"
              onClick={() => navigate("/profile")}
            />

            {/* 3 DOT MENU */}
            <div className="relative">
              <FiMoreVertical
                className="cursor-pointer text-xl text-stone-600 hover:text-black transition"
                onClick={() => setOpenMenu(!openMenu)}
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white text-stone-800 rounded-xl border border-stone-200 shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-sm hover:bg-stone-100 text-left"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm hover:bg-red-50 text-left text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;