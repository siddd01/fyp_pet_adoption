import { Bell, Menu, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const StaffNavbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staff");
    window.location.href = "/staff/login";
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu size={22} />
        </button>
        <Link to="/staff/dashboard" className="text-xl font-bold text-teal-600">
          🐾 Pet Adoption Staff
        </Link>
      </div>

      {/* Center: Menu (Desktop) */}
      <ul className="hidden md:flex gap-6 font-medium text-gray-700">
        <li>
          <Link to="/staff/dashboard" className="hover:text-teal-600">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/staff/pets/add" className="hover:text-teal-600">
            Add Pets
          </Link>
        </li>
        <li>
          <Link to="/staff/pets/view" className="hover:text-teal-600">
            View Pets
          </Link>
        </li>
        <li>
          <Link to="/staff/adoptions" className="hover:text-teal-600">
            Adoptions
          </Link>
        </li>
        <li>
          <Link to="/staff/store/products" className="hover:text-teal-600">
            Store
          </Link>
        </li>
      </ul>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer text-gray-600 hover:text-teal-600" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <User
            className="cursor-pointer text-gray-600 hover:text-teal-600"
            onClick={() => setProfileOpen((prev) => !prev)}
          />

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
              <Link
                to="/staff/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-3 p-4 md:hidden z-50">
          <Link to="/staff/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link to="/staff/pets/add" onClick={() => setOpen(false)}>
            Add Pets
          </Link>
          <Link to="/staff/pets/view" onClick={() => setOpen(false)}>
            View Pets
          </Link>
          <Link to="/staff/adoptions" onClick={() => setOpen(false)}>
            Adoptions
          </Link>
          <Link to="/staff/store/products" onClick={() => setOpen(false)}>
            Store
          </Link>
        </ul>
      )}
    </nav>
  );
};

export default StaffNavbar;
