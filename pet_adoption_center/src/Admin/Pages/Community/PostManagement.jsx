import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Eye, Heart, MessageCircle, Bell, X, Save } from "lucide-react";
import api from "../../../api/axios.js";
import { useNavigate } from "react-router-dom";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    amount_spent: "",
    image_url: ""
  });
  const navigate=useNavigate()

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("/charity/posts");
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert(error.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/charity/posts", formData);
      alert(res.data.message || "Post created successfully");
      setShowCreateForm(false);
      setFormData({ title: "", content: "", amount_spent: "", image_url: "" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    
    try {
      const res = await api.put(`/charity/posts/${editingPost.id}`, formData);
      alert(res.data.message || "Post updated successfully");
      setEditingPost(null);
      setFormData({ title: "", content: "", amount_spent: "", image_url: "" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
      alert(error.response?.data?.message || "Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const res = await api.delete(`/charity/posts/${postId}`);
      alert(res.data.message || "Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      amount_spent: post.amount_spent,
      image_url: post.image_url || ""
    });
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await api.put(`/admin/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return <div className="p-8 text-center text-stone-500">Loading posts...</div>;
  }

  return (
    <div className="p-8 bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Post Management</h1>
          <p className="text-sm text-stone-500 mt-1">Manage community impact posts</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-stone-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-stone-200 shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-stone-100">
                  <h3 className="font-semibold text-stone-900">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-stone-500">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-stone-50 hover:bg-stone-50 cursor-pointer ${
                        !notification.is_read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleMarkNotificationRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "like" ? "bg-rose-500" : "bg-emerald-500"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-stone-700">{notification.message}</p>
                          <p className="text-xs text-stone-400 mt-1">
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
          
          {/* Create Post Button */}
          <button
            onClick={() => navigate("/admin/charity/post")}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {/* Create/Edit Post Form */}
      {(showCreateForm || editingPost) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-stone-900">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPost(null);
                  setFormData({ title: "", content: "", amount_spent: "", image_url: "" });
                }}
                className="p-1 hover:bg-stone-100 rounded-lg"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            
            <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
                  placeholder="Enter post title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 h-32 resize-none"
                  placeholder="Enter post content"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Amount Spent (NPR)</label>
                <input
                  type="number"
                  required
                  value={formData.amount_spent}
                  onChange={(e) => setFormData({ ...formData, amount_spent: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
                  placeholder="Enter amount spent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
                  placeholder="Enter image URL"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingPost ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingPost(null);
                    setFormData({ title: "", content: "", amount_spent: "", image_url: "" });
                  }}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">All Posts ({posts.length})</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            No posts found. Create your first post to get started.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {posts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-stone-900">{post.title}</h3>
                    <p className="text-sm text-stone-500 mt-1">
                      By {post.admin_name || "Admin"} · {new Date(post.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2 text-stone-700 line-clamp-2">{post.content}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">
                      Amount: NPR {Number(post.amount_spent || 0).toLocaleString()}
                    </p>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-stone-500">
                        <Heart className="w-4 h-4" />
                        {post.like_count || 0} likes
                      </div>
                      <div className="flex items-center gap-1 text-sm text-stone-500">
                        <MessageCircle className="w-4 h-4" />
                        {post.comment_count || 0} comments
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Edit post"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManagement;
