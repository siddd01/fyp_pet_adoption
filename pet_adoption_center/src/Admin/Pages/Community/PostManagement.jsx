import { Edit2, Heart, Image as ImageIcon, IndianRupee, Layout, MessageCircle, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios.js";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    amount_spent: "", 
    image_url: ""
  });
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await api.get("/charity/admin/posts");
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
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
    fetchPosts();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post("/charity/posts", formData);
      setShowCreateForm(false);
      setFormData({ title: "", content: "", amount_spent: "", image_url: "" });
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      await api.put(`/charity/posts/${editingPost.id}`, formData);
      setEditingPost(null);
      setFormData({ title: "", content: "", amount_spent: "", image_url: "" });
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = await window.appConfirm({
      title: "Delete this post?",
      text: "This community update and its engagement history will be removed.",
      confirmButtonText: "Delete Post",
      cancelButtonText: "Keep Post",
    });
    if (!confirmed) return;
    try {
      await api.delete(`/charity/posts/${postId}`);
      fetchPosts();
    } catch (error) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="animate-pulse text-stone-400 font-medium tracking-widest uppercase text-xs">Loading Studio...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-[#fafaf9] min-h-screen">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-600">
            <Layout size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Administrative Studio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
            Post <span className="italic text-stone-500">Management</span>
          </h1>
          <p className="text-stone-400 text-sm italic">Curating community impact and transparency.</p>
        </div>

        <button
          onClick={() => navigate("/admin/charity/post")}
          className="group flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 active:scale-95"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">New Impact Post</span>
        </button>
      </div>

      {/* FORM MODAL (REFINED) */}
      {(showCreateForm || editingPost) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => { setEditingPost(null); setShowCreateForm(false); }} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-medium text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
                  {editingPost ? "Edit" : "Create"} <span className="italic text-stone-500">Entry</span>
                </h2>
                <button onClick={() => { setEditingPost(null); setShowCreateForm(false); }} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>
              
              <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block ml-1">Post Title</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
                      placeholder="e.g. Monthly Rescue Support"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block ml-1">Detailed Narrative</label>
                    <textarea
                      required value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 h-40 resize-none"
                      placeholder="Describe the impact..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block ml-1">Total Expenditure (NPR)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="number" required value={formData.amount_spent}
                        onChange={(e) => setFormData({ ...formData, amount_spent: e.target.value })}
                        className="w-full pl-12 pr-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block ml-1">Visual Asset URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="url" value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full pl-12 pr-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-stone-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-stone-200 hover:bg-stone-800 transition-all">
                    <Save size={16} />
                    {editingPost ? "Commit Changes" : "Publish Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* POSTS GRID */}
      <div className="max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-stone-100 shadow-sm">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-stone-400 font-medium italic">The archive is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="group bg-white rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                {/* Image Preview */}
                <div className="h-48 bg-stone-100 relative overflow-hidden">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">
                      NPR {Number(post.amount_spent || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-stone-900 leading-tight" style={{ fontFamily: "Georgia, serif" }}>{post.title}</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 mb-6 flex-1 italic">
                    "{post.content}"
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <Heart size={14} className="group-hover:text-red-400 transition-colors" />
                        <span className="text-[10px] font-bold">{post.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <MessageCircle size={14} className="group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-bold">{post.comment_count || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
