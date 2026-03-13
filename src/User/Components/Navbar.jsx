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
    <nav className="h-14 bg-[#40565E] px-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-10">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
            alt="Logo"
            className="h-8 w-8 rounded"
          />
          <span className="font-semibold text-lg">Sano Ghar</span>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/adopt">Adopt Now</Link>
          <Link to="/shop">Shop Now</Link>
          <Link to="/about">About Us</Link>
          <Link to="/donate">Donate</Link>
        </div>
      </div>

      <div className="relative flex items-center gap-3">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700"
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
              className="h-8 w-8 rounded-full border cursor-pointer"
              onClick={() => navigate("/profile")}
            />

            {/* 3 DOT MENU */}
            <div className="relative">
              <FiMoreVertical
                className="cursor-pointer text-xl"
                onClick={() => setOpenMenu(!openMenu)}
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left text-red-600"
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
