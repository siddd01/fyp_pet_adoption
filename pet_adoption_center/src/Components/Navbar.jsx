import { ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="h-14 bg-[#40565E] px-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-10">
        <div onClick={() => navigate("/")} className="flex items-center gap-2">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
            alt="Logo"
            className="h-8 w-8 rounded"
          />
          <span className="font-semibold text-lg">Sano Ghar</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link className="hover:text-gray-300" to="/">Home</Link>
          <Link className="hover:text-gray-300" to="/adopt">Adopt Now</Link>
          <Link className="hover:text-gray-300" to="/shop">Shop Now</Link>
          <Link className="hover:text-gray-300" to="/about">About Us</Link>
          <Link className="hover:text-gray-300" to="/donate">Donate</Link>
        </div>
      </div>

      <div className="relative flex items-center gap-3">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          <ShoppingCart size={18} />
          Cart
        </button>

        <img
          src={user?.image || "/default-user.png"}
          alt="Profile"
          className="h-8 w-8 rounded-full border cursor-pointer"
          onClick={() => navigate("/profile")}
        />

        <FiMoreVertical
          className="cursor-pointer text-xl"
          onClick={logout}
        />
      </div>
    </nav>
  );
};

export default Navbar;
