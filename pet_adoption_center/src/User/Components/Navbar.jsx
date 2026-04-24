import { Bell, ShoppingCart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../Context/AuthContext";
import { DEFAULT_PROFILE_IMAGE } from "../../constants/defaultImages";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadNotifications(0);
      return undefined;
    }

    const fetchUnreadNotifications = async () => {
      try {
        const res = await api.get("/reports/user/notifications");
        const notifications = res.data?.notifications || [];
        setUnreadNotifications(notifications.filter((notification) => !notification.is_read).length);
      } catch (error) {
        console.error("Failed to fetch user notifications:", error);
      }
    };

    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

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
    <nav className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-10 flex items-center justify-between shadow-sm">
      <div
        onClick={() => navigate("/")}
        className="flex shrink-0 items-center gap-2 cursor-pointer"
      >
        <img
          src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
          alt="Logo"
          className="h-8 w-8 rounded-lg sm:h-9 sm:w-9"
        />
        <span className="font-bold text-lg sm:text-xl text-stone-900 tracking-wide">
          Sano Ghar
        </span>
      </div>

      <div className="hidden md:flex gap-6 lg:gap-10 text-sm lg:text-base font-bold absolute left-1/2 transform -translate-x-1/2">
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
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-stone-900 transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          );
        })}
      </div>

      <div className="relative flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition shadow-sm"
        >
          <Bell size={17} className="text-stone-700 sm:w-[18px] sm:h-[18px]" />
          {unreadNotifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unreadNotifications}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="p-2 rounded-xl bg-stone-600 hover:bg-stone-700 transition shadow-md"
        >
          <ShoppingCart size={17} className="text-white sm:w-[18px] sm:h-[18px]" />
        </button>

        {user && (
          <>
            <img
              src={user.image || DEFAULT_PROFILE_IMAGE}
              alt="Profile"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-stone-200 cursor-pointer hover:scale-105 transition"
              onClick={() => navigate("/profile")}
            />

            <div className="relative">
              <FiMoreVertical
                className="cursor-pointer text-lg sm:text-xl text-stone-600 hover:text-black transition"
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
                    onClick={() => {
                      navigate("/history");
                      setOpenMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-sm hover:bg-stone-100 text-left"
                  >
                    History
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
