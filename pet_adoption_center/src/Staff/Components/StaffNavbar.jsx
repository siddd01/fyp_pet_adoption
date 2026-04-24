import { ClipboardList, Menu } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StaffContext } from "../../Context/StaffContext";
import { getProfileImageSrc } from "../../utils/imageHelpers";

const StaffNavbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { staff, fetchStaffProfile, staffLogout } = useContext(StaffContext);

  useEffect(() => {
    if (!staff) {
      fetchStaffProfile().catch((error) => {
        console.error("Failed to load staff profile for navbar", error);
      });
    }
  }, [fetchStaffProfile, staff]);

  const handleLogout = () => {
    staffLogout();
    window.location.href = "/staff/login";
  };

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
      <div className="flex items-center gap-2">
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu size={22} />
        </button>
        <Link to="/staff/dashboard" className="text-xl font-bold text-teal-600">
          Pet Adoption Staff
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ClipboardList onClick={() => navigate("/staff/adoptions")} className="cursor-pointer text-gray-600 hover:text-teal-600" />

        <Link to="/staff/community" className="cursor-pointer text-gray-600 hover:text-teal-600">
          Community
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="h-10 w-10 overflow-hidden rounded-full border border-stone-200 bg-stone-100 shadow-sm transition hover:border-teal-200"
          >
            <img
              src={getProfileImageSrc(staff?.profile_image)}
              alt={staff?.first_name || "Staff"}
              className="h-full w-full object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md border border-stone-100 overflow-hidden">
              <Link
                to="/staff/profile"
                className="block px-4 py-2.5 hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-red-500"
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
