import { Camera, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import api from '../../../api/axios';

const AdminCharityAction = ({ onPostSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', content: '', image: null });

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submit button clicked!"); // DEBUG 1
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('amount', form.amount);
    formData.append('content', form.content);
    if(form.image) formData.append('image', form.image);

    console.log("Sending request to /charity/spend..."); // DEBUG 2

const response = await api.post('/charity/spend', formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  }
});
    
    console.log("Response received:", response.data); // DEBUG 3
    alert("Success!");
  } catch (err) {
    console.error("FULL ERROR OBJECT:", err); // DEBUG 4
    alert("Error: " + err.message);
  } finally {
    console.log("Setting loading to false"); // DEBUG 5
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl bg-white border border-stone-100 rounded-4xl p-10 shadow-sm">
      <h2 className="text-2xl font-serif mb-6 text-stone-900">Log New Expenditure</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input 
          type="text" 
          value={form.title} 
          placeholder="Title (e.g. 20kg Pedigree for Shelter)" 
          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-stone-400 transition-all"
          onChange={e => setForm({...form, title: e.target.value})}
        />
        <input 
          type="number" 
          value={form.amount} 
          placeholder="Amount Spent (NPR)" 
          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-stone-400 transition-all"
          onChange={e => setForm({...form, amount: e.target.value})}
        />
        <textarea 
          placeholder="Describe the impact..." 
          value={form.content} 
          rows="4"
          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-stone-400 transition-all"
          onChange={e => setForm({...form, content: e.target.value})}
        ></textarea>
        
        <label className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-100 rounded-2xl cursor-pointer hover:bg-stone-50 transition-all">
          <Camera className={form.image ? "text-green-500" : "text-stone-400"} />
          <span className="text-sm text-stone-500 font-medium truncate max-w-xs">
            {form.image ? form.image.name : "Upload Receipt or Proof Photo"}
          </span>
          <input 
            type="file" 
            className="hidden" 
            onChange={e => setForm({...form, image: e.target.files[0]})} 
            accept="image/*"
          />
        </label>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>Publish & Deduct Fund <Send size={16} /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminCharityAction;