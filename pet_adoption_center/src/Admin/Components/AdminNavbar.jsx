import { Bell, Menu, User, Clock } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { AdminAuthContext } from "../../Context/AdminAuthContext";
import { DEFAULT_PROFILE_IMAGE } from "../../constants/defaultImages";

const AdminNavbar = () => {
  const { admin } = useContext(AdminAuthContext);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const getImageSrc = (value) => {
    if (!value) return DEFAULT_PROFILE_IMAGE;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `http://localhost:5000/uploads/${value}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

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
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await api.put(`/charity/admin/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: 1 } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/charity/admin/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (error) {
      try {
        const unreadNotifications = notifications.filter((n) => !n.is_read);
        await Promise.all(
          unreadNotifications.map((notification) =>
            api.put(`/charity/admin/notifications/${notification.id}/read`)
          )
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      } catch (fallbackError) {
        console.error("Failed to mark all notifications as read:", fallbackError);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotificationOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between sticky top-0 z-100">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-stone-600" onClick={() => setOpen(!open)}>
          <Menu size={22} />
        </button>
        <Link to="/admin/dashboard" className="text-xl font-serif font-black text-stone-900 tracking-tight">
          SanoGhar <span className="text-emerald-600 italic">Admin</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className={`relative p-2.5 rounded-full transition-all duration-200 ${
              notificationOpen ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center border-2 border-white px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-3 w-90 bg-white rounded-2xl shadow-2xl border border-stone-200 z-110 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0">
                <h3 className="text-lg font-black text-stone-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 transition hover:text-emerald-900"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-105 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-stone-400">
                    <Bell size={40} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">No updates yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkNotificationRead(n.id)}
                      className={`group p-4 flex gap-4 border-b border-stone-50 cursor-pointer transition-colors relative ${
                        !n.is_read ? "bg-emerald-50/40 hover:bg-emerald-50" : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                            n.type === "like"
                              ? "bg-rose-50 border-rose-100 text-rose-500"
                              : "bg-emerald-50 border-emerald-100 text-emerald-600"
                          }`}
                        >
                          <User size={20} />
                        </div>
                        {!n.is_read && (
                          <div className="absolute -right-0.5 bottom-1 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className={`text-[13px] leading-snug ${!n.is_read ? "font-bold text-stone-900" : "text-stone-600"}`}>
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-stone-400 uppercase tracking-tight">
                          <Clock size={10} />
                          {new Date(n.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors overflow-hidden"
          >
            <img
              src={getImageSrc(admin?.profile_image)}
              alt={admin?.full_name || "Admin"}
              className="h-full w-full object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white shadow-2xl rounded-xl border border-stone-200 py-2 z-110 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
                onClick={() => setProfileOpen(false)}
              >
                Profile Settings
              </Link>
              <div className="h-px bg-stone-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
