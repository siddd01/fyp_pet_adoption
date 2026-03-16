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
    <nav className="h-14 bg-white border-b border-stone-100 px-6 flex items-center justify-between text-stone-800">
      <div className="flex items-center gap-10">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
            alt="Logo"
            className="h-8 w-8 rounded"
          />
          <span className="font-semibold text-lg text-stone-900">Sano Ghar</span>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-stone-900">Home</Link>
          <Link to="/adopt" className="hover:text-stone-900">Adopt Now</Link>
          <Link to="/shop" className="hover:text-stone-900">Shop Now</Link>
          <Link to="/about" className="hover:text-stone-900">About Us</Link>
          <Link to="/donate" className="hover:text-stone-900">Donate</Link>
        </div>
      </div>

      <div className="relative flex items-center gap-3">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-sm"
        >
          <ShoppingCart size={18} />
          Cart
        </button>

        {/* SHOW ONLY IF LOGGED IN */}
        {user && (
          <>
            <img
              src={user.image || "/default-user.png"}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-stone-200 cursor-pointer"
              onClick={() => navigate("/profile")}
            />

            {/* 3 DOT MENU */}
            <div className="relative">
              <FiMoreVertical
                className="cursor-pointer text-xl text-stone-600"
                onClick={() => setOpenMenu(!openMenu)}
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-stone-800 rounded-xl border border-stone-100 shadow-sm overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-sm hover:bg-stone-50 text-left"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm hover:bg-stone-50 text-left text-red-600"
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