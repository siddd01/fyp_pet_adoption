import axios from 'axios';
import { Camera, Send } from 'lucide-react';
import { useState } from 'react';

const AdminCharityAction = () => {
  const [form, setForm] = useState({ title: '', amount: '', content: '', image: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    
    await axios.post('/api/admin/charity/spend', formData);
    alert("Impact Post Published!");
  };

  return (
    <div className="max-w-2xl bg-white border border-stone-100 rounded-4xl p-10 shadow-sm">
      <h2 className="text-2xl font-serif mb-6 text-stone-900">Log New Expenditure</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input 
          type="text" placeholder="Title (e.g. 20kg Pedigree for Shelter)" 
          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-stone-400 transition-all"
          onChange={e => setForm({...form, title: e.target.value})}
        />
        <div className="relative">
          <input 
            type="number" placeholder="Amount Spent (NPR)" 
            className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-stone-400 transition-all"
            onChange={e => setForm({...form, amount: e.target.value})}
          />
        </div>
        <textarea 
          placeholder="Describe the impact (e.g. This food will feed 15 dogs for 2 weeks)"
          rows="4"
          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-stone-400 transition-all"
          onChange={e => setForm({...form, content: e.target.value})}
        ></textarea>
        <label className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-100 rounded-2xl cursor-pointer hover:bg-stone-50 transition-all">
          <Camera className="text-stone-400" />
          <span className="text-sm text-stone-500 font-medium">Upload Receipt or Proof Photo</span>
          <input type="file" className="hidden" onChange={e => setForm({...form, image: e.target.files[0]})} />
        </label>
        <button className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-stone-200 flex items-center justify-center gap-2">
          Publish & Deduct Fund <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AdminCharityAction;