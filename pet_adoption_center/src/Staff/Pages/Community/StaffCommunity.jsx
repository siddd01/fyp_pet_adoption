import { Calendar, Heart, Maximize2, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

const StaffCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [selectedImg, setSelectedImg] = useState(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("staffToken");
      const res = await api.get("/charity/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem("staffToken");
      const res = await api.get(`/charity/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentsByPost((prev) => ({ ...prev, [postId]: res.data.comments || [] }));
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleToggleComments = async (postId) => {
    const isOpen = openComments[postId];
    setOpenComments((prev) => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !commentsByPost[postId]) await fetchComments(postId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Image Lightbox */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform">
            <X size={32} />
          </button>
          <img 
            src={selectedImg} 
            className="max-w-full max-h-[90vh] rounded shadow-2xl object-contain" 
            alt="Post visual"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Community Posts</h1>
            <Link 
              to="/staff/dashboard" 
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              &larr; Back to Dashboard
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading community posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No community posts found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                  {/* Post Header */}
                  <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{post.admin_name || 'Sano Ghar Office'}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={10} />
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                    
                    {post.image_url && (
                      <div 
                        className="relative group cursor-pointer rounded-lg overflow-hidden mb-4"
                        onClick={() => setSelectedImg(post.image_url)}
                      >
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/20 transition-all flex items-center justify-center">
                          <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                        </div>
                      </div>
                    )}
                    
                    {post.amount_spent > 0 && (
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-100 text-xs font-bold uppercase">
                        NPR {Number(post.amount_spent).toLocaleString()} Utilized
                      </div>
                    )}
                  </div>

                  {/* Engagement Stats (Visual Only) */}
                  <div className="px-6 py-3 bg-gray-50 flex justify-between border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase">
                      <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
                        <Heart size={10} className="text-white fill-current" />
                      </div>
                      {post.like_count || 0} Likes
                    </div>
                    <button 
                      onClick={() => handleToggleComments(post.id)}
                      className="text-teal-600 text-xs font-bold uppercase hover:underline transition-colors"
                    >
                      {post.comment_count || 0} Comments {openComments[post.id] ? '(Hide)' : '(View)'}
                    </button>
                  </div>

                  {/* Comments Section (Read Only) */}
                  {openComments[post.id] && (
                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {(commentsByPost[post.id] || []).length === 0 ? (
                          <p className="text-xs text-gray-400 italic text-center py-4">No comments on this post.</p>
                        ) : (
                          (commentsByPost[post.id] || []).map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-gray-400">
                                <User size={14} />
                              </div>
                              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm max-w-[85%]">
                                <p className="text-xs font-bold text-gray-900 uppercase">{comment.first_name} {comment.last_name}</p>
                                <p className="text-sm text-gray-700 mt-1">{comment.comment_text}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                        Commenting is disabled for staff
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCommunity;