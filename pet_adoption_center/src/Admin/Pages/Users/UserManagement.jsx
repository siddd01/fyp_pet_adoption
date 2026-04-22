import { Bell, Search, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { DEFAULT_PROFILE_IMAGE } from "../../../constants/defaultImages";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const getImageSrc = (value) => {
    if (!value) return DEFAULT_PROFILE_IMAGE;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `http://localhost:5000/uploads/${value}`;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user account permanently?")) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSending(true);
      await api.post(`/admin/users/${selectedUser.id}/notify`, {
        message: notificationMessage,
      });
      alert("Notification sent successfully");
      setSelectedUser(null);
      setNotificationMessage("");
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert(error.response?.data?.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-stone-500">Loading users...</div>;
  }

  return (
    <div className="p-8 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-stone-900 mb-2">User Management</h1>
          <p className="text-sm text-stone-500">Manage user accounts and send manual notifications</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-900">Users ({filteredUsers.length})</h2>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 flex items-center justify-between gap-4 hover:bg-stone-50">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageSrc(user.profile_image)}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-stone-500">{user.email}</p>
                    <p className="text-xs text-stone-400">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm hover:bg-stone-800"
                  >
                    <Bell size={16} />
                    Notify
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-stone-900">Send Notification</h3>
                  <p className="text-sm text-stone-500">
                    To {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4">
                <textarea
                  required
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Write the notification message..."
                  className="w-full min-h-32 border border-stone-200 rounded-xl p-4 bg-stone-50 focus:outline-none focus:border-stone-400"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 px-4 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send Notification"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
