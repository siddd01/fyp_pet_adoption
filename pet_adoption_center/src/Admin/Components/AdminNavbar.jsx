import { Bell, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/charity/admin/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await api.put(`/charity/admin/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;


// close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(e.target)) {
      setNotificationOpen(false);
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
        <Link to="/admin/dashboard" className="text-xl font-bold text-teal-600">
          🐾 Pet Adoption Admin
        </Link>
      </div>

      {/* Center: Menu (Desktop)
      <ul className="hidden md:flex gap-6 font-medium text-gray-700">
        <li>
          <Link to="/admin/dashboard" className="hover:text-teal-600">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/admin/staff-add" className="hover:text-teal-600">
            Add Staff
          </Link>
        </li>

        <li>
          <Link to="/admin/staff-delete" className="hover:text-teal-600">
            Remove Staff
          </Link>
        </li>
      </ul> */}

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                      !notification.is_read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleMarkNotificationRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "like" ? "bg-rose-500" : "bg-emerald-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
   <div className="relative" ref={dropdownRef}>
  <User
    className="cursor-pointer text-gray-600 hover:text-teal-600"
    onClick={() => setProfileOpen((prev) => !prev)}
  />

  {profileOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
      <Link
        to="/admin/profile"
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
          <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link to="/admin/community/posts" onClick={() => setOpen(false)}>
            Post Management
          </Link>
          <Link to="/admin/staff/add" onClick={() => setOpen(false)}>
            Add Staff
          </Link>
          <Link to="/admin/staff/delete" onClick={() => setOpen(false)}>
            Remove Staff
          </Link>
        </ul>
      )}
    </nav>
  );
};

export default AdminNavbar;
