import { Camera, Loader2, Send, X, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import api from '../../../api/axios';

const AdminCharityAction = ({ onPostSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', content: '', image: null });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('amount', form.amount);
      formData.append('content', form.content);
      if (form.image) formData.append('image', form.image);

      await api.post('/charity/spend', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        }
      });

      alert("Expenditure logged successfully!");
      setForm({ title: '', amount: '', content: '', image: null });
      setPreview(null);
      if (onPostSuccess) onPostSuccess();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    // Centers the component in the middle of the screen
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white border border-stone-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 transition-all">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-900 text-white rounded-2xl mb-4 shadow-lg">
            <FileText size={24} />
          </div>
          <h2 className="text-3xl font-serif text-stone-900 leading-tight">Log Expenditure</h2>
          <p className="text-stone-500 text-sm mt-2 font-medium">Update the community on how funds are used.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-stone-400 ml-1">Expenditure Title</label>
            <input 
              type="text" 
              required
              value={form.title} 
              placeholder="e.g. 50kg Organic Kibble for Sanctuary" 
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all text-stone-800 placeholder:text-stone-300"
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-stone-400 ml-1">Amount (NPR)</label>
            <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 font-bold">Rs.</span>
                <input 
                type="number" 
                required
                value={form.amount} 
                className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all text-stone-800"
                onChange={e => setForm({...form, amount: e.target.value})}
                />
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-stone-400 ml-1">Impact Description</label>
            <textarea 
              placeholder="Briefly explain how this helps the animals..." 
              required
              value={form.content} 
              rows="4"
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all text-stone-800 placeholder:text-stone-300 resize-none"
              onChange={e => setForm({...form, content: e.target.value})}
            ></textarea>
          </div>
          
          {/* Image Upload Area */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-stone-400 ml-1">Evidence (Receipt/Photo)</label>
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-video">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-stone-900 shadow-md hover:bg-rose-500 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:bg-stone-50 hover:border-stone-400 transition-all group">
                <div className="p-3 bg-stone-100 rounded-full text-stone-400 group-hover:text-stone-900 transition-colors">
                  <Camera size={24} />
                </div>
                <div className="text-center">
                  <span className="text-sm text-stone-800 font-bold block">Upload Proof</span>
                  <span className="text-xs text-stone-400 font-medium">JPG, PNG up to 5MB</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleImageChange} 
                  accept="image/*"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-stone-900/20 hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Publish Expenditure <Send size={16} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCharityAction;