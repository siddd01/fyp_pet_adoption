import { ClipboardList, Menu, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const StaffNavbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate=useNavigate();
  
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



      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <ClipboardList onClick={()=>navigate("/staff/adoptions")} className="cursor-pointer text-gray-600 hover:text-teal-600" />
        
        {/* Community Section */}
        <Link to="/staff/community" className="cursor-pointer text-gray-600 hover:text-teal-600">
          Community
        </Link>
        

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

      
    </nav>
  );
};

export default StaffNavbar;
