import { Heart, MessageCircle, Send, User, Calendar, Info, X, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  
  // UI Enhancement States
  const [selectedImg, setSelectedImg] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await api.get("/charity/posts");
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const res = await api.get(`/charity/posts/${postId}/comments`);
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

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/charity/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, liked_by_me: res.data.liked ? 1 : 0, like_count: res.data.like_count }
            : post
        )
      );
    } catch (error) {
        console.error("Like failed", error);
    }
  };

  const handleAddComment = async (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    try {
      await api.post(`/charity/posts/${postId}/comments`, { comment_text: text });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      await fetchComments(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, comment_count: Number(post.comment_count || 0) + 1 } : post
        )
      );
    } catch (error) {
        console.error("Comment failed", error);
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-4" />
        <p className="font-serif italic text-stone-400">Curating Sano Ghar Stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-6">
      
      {/* 🖼️ Image Lightbox (Full Screen) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-stone-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform">
            <X size={32} />
          </button>
          <img 
            src={selectedImg} 
            className="max-w-full max-h-[90vh] rounded shadow-2xl object-contain animate-in zoom-in-95 duration-300" 
            alt="Post visual"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 border-l-4 border-stone-900 pl-6">
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">Sano Ghar Journal</h1>
          <p className="text-stone-500 mt-2 font-medium">Tracking our collective impact across the sanctuary.</p>
        </header>

        <div className="space-y-8">
          {posts.map((post) => {
            const isLong = post.content.length > 200;
            const isExpanded = expandedDescriptions[post.id];

            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                
                {/* User Header */}
                <div className="p-4 flex items-center gap-3 border-b border-stone-50 bg-white">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 italic">Sano Ghar Office</h3>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      <Calendar size={10} />
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Main Post Layout */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
                  {/* Left Column: Text */}
                  <div className={`${post.image_url ? 'md:col-span-3' : 'md:col-span-5'} space-y-4`}>
                    <h2 className="text-2xl font-serif text-stone-900 leading-tight">
                      {post.title}
                    </h2>
                    
                    <div className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {isExpanded ? post.content : `${post.content.substring(0, 200)}${isLong ? '...' : ''}`}
                      {isLong && (
                        <button 
                          onClick={() => toggleDescription(post.id)}
                          className="ml-2 text-stone-900 font-black hover:underline underline-offset-4 decoration-2"
                        >
                          {isExpanded ? 'Show Less' : 'Read Full Story'}
                        </button>
                      )}
                    </div>
                    
                    {post.amount_spent > 0 && (
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100 text-[11px] font-black uppercase tracking-tight">
                        <Info size={14} />
                        NPR {Number(post.amount_spent).toLocaleString()} Utilized
                      </div>
                    )}
                  </div>

                  {/* Right Column: Image */}
                  {post.image_url && (
                    <div 
                      className="md:col-span-2 relative group cursor-pointer"
                      onClick={() => setSelectedImg(post.image_url)}
                    >
                      <div className="rounded-xl overflow-hidden border border-stone-100 bg-stone-50 aspect-square flex items-center justify-center">
                        <img 
                          src={post.image_url} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-all flex items-center justify-center">
                          <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Engagement Stats */}
                <div className="px-6 py-3 bg-stone-50/50 flex justify-between border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-black uppercase tracking-widest">
                    <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                      <Heart size={10} className="text-white fill-current" />
                    </div>
                    {post.like_count || 0}
                  </div>
                  <button 
                    onClick={() => handleToggleComments(post.id)}
                    className="text-stone-400 text-[11px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors"
                  >
                    {post.comment_count || 0} Comments
                  </button>
                </div>

                {/* Interaction Buttons */}
                <div className="flex border-t border-stone-100 text-sm font-bold">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all ${post.liked_by_me ? 'text-rose-600 bg-rose-50/50' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <Heart size={18} className={post.liked_by_me ? "fill-current" : ""} />
                    {post.liked_by_me ? 'Liked' : 'Appreciate'}
                  </button>
                  <button 
                    onClick={() => handleToggleComments(post.id)}
                    className="flex-1 py-4 flex items-center justify-center gap-2 text-stone-600 hover:bg-stone-50 border-l border-stone-100 transition-all"
                  >
                    <MessageCircle size={18} />
                    Comment
                  </button>
                </div>

                {/* Comments Section */}
                {openComments[post.id] && (
                  <div className="bg-stone-50 p-6 border-t border-stone-100 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                      {(commentsByPost[post.id] || []).length === 0 && (
                        <p className="text-xs text-stone-400 italic text-center py-4">No comments yet. Start the conversation.</p>
                      )}
                      {(commentsByPost[post.id] || []).map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0 flex items-center justify-center text-stone-400">
                            <User size={14} />
                          </div>
                          <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2 shadow-sm max-w-[85%]">
                            <p className="text-[11px] font-black text-stone-900 uppercase">{comment.first_name} {comment.last_name}</p>
                            <p className="text-[13px] text-stone-700 mt-0.5 leading-snug">{comment.comment_text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New Comment Input */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                        <User size={14} />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Share your thoughts..."
                          className="w-full bg-white border border-stone-200 rounded-full px-5 py-2.5 text-sm focus:ring-1 focus:ring-stone-400 outline-none transition-all shadow-sm font-medium"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button 
                          onClick={() => handleAddComment(post.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityPosts;