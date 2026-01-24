import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate()
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLoggedIn = true; // later replace with auth state
  const profileImage =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <nav className="h-14 bg-[#40565E] px-6 flex items-center justify-between text-white">
      
      {/* Left Section */}
      <div className="flex items-center gap-10">
        {/* Logo */}
        <div onClick={()=>navigate("/")} className="flex items-center gap-2">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/096/209/non_2x/adopt-animal-care-and-rescue-logo-for-organization-medical-pet-or-brand-vector.jpg"
            alt="Logo"
            className="h-8 w-8 rounded"
          />
          <span className="font-semibold text-lg">Sano Ghar</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link className="hover:text-gray-300" to="/">Home</Link>
          <Link className="hover:text-gray-300" to="/adopt">Adopt Now</Link>
          <Link className="hover:text-gray-300" to="/shop">Shop Now</Link>
          <Link className="hover:text-gray-300" to="/about">About Us</Link>
          <Link className="hover:text-gray-300" to="/donate">Donate</Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center gap-3" ref={menuRef}>
        <img
          src={isLoggedIn ? profileImage : "/default-user.png"}
          alt="Profile"
          className="h-8 w-8 rounded-full border cursor-pointer"
        />

        {/* Kebab Menu */}
        <FiMoreVertical
          className="cursor-pointer text-xl"
          onClick={() => setOpen(!open)}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-36 bg-white text-black rounded shadow-md">
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </Link>
            <button onClick={()=>navigate('/login')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
