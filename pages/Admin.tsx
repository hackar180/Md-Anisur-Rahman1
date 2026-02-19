
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types.ts';
import { isConfigured, CONFIG_KEY } from '../firebaseConfig.ts';

interface AdminProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

const Admin: React.FC<AdminProps> = ({ products, onAdd, onUpdate, onDelete, onDeleteAll }) => {
  // লোকাল স্টোরেজ চেক করে লগইন অবস্থা নির্ধারণ করা হচ্ছে (পেজ ভিউ করার জন্য)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('mxn_admin_session') === 'true';
  });
  
  const [password, setPassword] = useState('');
  const [actionPassword, setActionPassword] = useState(''); // প্রতি একশনের জন্য পাসওয়ার্ড স্টেট
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(!isConfigured);
  const [configInput, setConfigInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const ADMIN_PASSWORD = 'kuyasa.com';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    mrp: '',
    dp: '',
    pv: '',
    image: '',
    category: 'General'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('mxn_admin_session', 'true');
    } else {
      alert('ভুল পাসওয়ার্ড!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mxn_admin_session');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfigSave = () => {
    try {
      let jsonStr = configInput;
      if (jsonStr.includes('=')) {
        jsonStr = jsonStr.substring(jsonStr.indexOf('=') + 1);
      }
      jsonStr = jsonStr.trim().replace(/;$/, '');
      
      const configObj = new Function(`return ${jsonStr}`)();

      if (!configObj.apiKey || !configObj.projectId) {
        throw new Error("Invalid Config");
      }

      localStorage.setItem(CONFIG_KEY, JSON.stringify(configObj));
      alert('কনফিগারেশন সেভ হয়েছে! পেজ রিলোড হচ্ছে...');
      window.location.reload();

    } catch (e) {
      alert('কোড সঠিক নয়। ফায়ারবেস কনসোল থেকে শুধু {...} ব্র্যাকেটের অংশটুকু বা পুরো কনফিগারেশন কপি করে দিন।');
    }
  };

  const handleRemoveConfig = () => {
    if(window.confirm('আপনি কি ডাটাবেস সংযোগ বিচ্ছিন্ন করতে চান?')) {
      localStorage.removeItem(CONFIG_KEY);
      window.location.reload();
    }
  };

  // ডিলিট করার সময় পাসওয়ার্ড চাওয়া হবে
  const handleDeleteCheck = (id: string) => {
    const userPass = prompt("পণ্যটি ডিলিট করতে অ্যাডমিন পাসওয়ার্ড দিন:");
    if (userPass === ADMIN_PASSWORD) {
      onDelete(id);
    } else if (userPass !== null) {
      alert("ভুল পাসওয়ার্ড! ডিলিট করা সম্ভব হয়নি।");
    }
  };

  // সব ডিলিট করার সময় পাসওয়ার্ড চাওয়া হবে
  const handleDeleteAllCheck = () => {
    const userPass = prompt("সব পণ্য ডিলিট করতে অ্যাডমিন পাসওয়ার্ড দিন:");
    if (userPass === ADMIN_PASSWORD) {
      onDeleteAll();
    } else if (userPass !== null) {
      alert("ভুল পাসওয়ার্ড!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ১. নাম চেক
    if (!formData.name.trim()) return alert('পণ্যের নাম দিন');

    // ২. অ্যাকশন পাসওয়ার্ড চেক (প্রতিবার সাবমিটের সময়)
    if (actionPassword !== ADMIN_PASSWORD) {
      alert('পাসওয়ার্ড ভুল! পণ্য সেভ বা আপডেট করতে সঠিক পাসওয়ার্ড দিন।');
      return;
    }

    const productData: Omit<Product, 'id'> = {
      ...formData,
      mrp: Number(formData.mrp) || 0,
      dp: Number(formData.dp) || 0,
      pv: Number(formData.pv) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=400'
    };

    if (editingId) {
      onUpdate({ ...productData, id: editingId });
      setEditingId(null);
    } else {
      onAdd(productData);
    }

    // ফর্ম রিসেট
    setFormData({ name: '', description: '', quantity: '', mrp: '', dp: '', pv: '', image: '', category: 'General' });
    setActionPassword(''); // পাসওয়ার্ড ফিল্ড ক্লিয়ার করা হলো
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (isConfigured) {
      alert('সফল! পণ্যটি ডাটাবেসে সেভ হয়েছে।');
    } else {
      alert('সেভ হয়েছে (লোকাল)।');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-green-50">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 className="text-2xl font-black mb-2 text-gray-800">অ্যাডমিন প্যানেল</h2>
          <p className="text-gray-500 text-sm mb-8 font-bold">লগইন করতে পাসওয়ার্ড দিন</p>
          
          <div className="relative mb-6">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন..."
              className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:bg-white p-4 pr-12 rounded-2xl outline-none font-bold transition-all placeholder-gray-400"
              autoFocus
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
            >
              {showPassword ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95">
            প্রবেশ করুন
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 px-2">
      <div className="lg:col-span-5">
        
        {/* ডাটাবেস স্ট্যাটাস এবং ইনপুট */}
        <div className={`rounded-2xl mb-6 shadow-sm border overflow-hidden ${isConfigured ? 'bg-green-100 border-green-200' : 'bg-white border-red-200'}`}>
          <div className="p-4 flex items-center justify-between cursor-pointer bg-white/50" onClick={() => setShowGuide(!showGuide)}>
            <div className="flex items-center">
               <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${isConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
               <div>
                 <h3 className={`font-bold text-sm ${isConfigured ? 'text-green-800' : 'text-red-600'}`}>
                   {isConfigured ? 'ডাটাবেস কানেক্টেড ✅' : 'ডাটাবেস সেটআপ বাকি ⚠️'}
                 </h3>
                 <p className="text-[10px] opacity-80 text-gray-600">
                   {isConfigured ? 'সবার জন্য আপডেট হচ্ছে' : 'সেটআপ করতে ক্লিক করুন'}
                 </p>
               </div>
            </div>
            <button className={`text-[10px] font-black px-3 py-1 rounded shadow-sm ${isConfigured ? 'bg-white text-red-500' : 'bg-red-600 text-white'}`}>
               {isConfigured ? 'সেটিংস' : 'সেটআপ'}
            </button>
          </div>
          
          {/* সেটিংস প্যানেল */}
          {(!isConfigured || showGuide) && (
            <div className="p-4 border-t border-gray-100 bg-white">
              {isConfigured ? (
                <div className="text-center">
                  <p className="text-sm text-green-700 font-bold mb-2">আপনার ডাটাবেস সফলভাবে চালু আছে।</p>
                  <button onClick={handleRemoveConfig} className="text-xs bg-red-50 text-red-600 px-4 py-2 rounded-lg font-black border border-red-100 hover:bg-red-100">
                    কনফিগারেশন মুছে ফেলুন
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                    <p className="font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">ফায়ারবেস কনসোল সেটআপ গাইড:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li><strong>MXN Shop</strong> প্রজেক্টে ক্লিক করুন।</li>
                      <li>স্ক্রিনের মাঝখানে থাকা <strong>Web (&lt;/&gt;)</strong> আইকনে ক্লিক করুন।</li>
                      <li>অ্যাপের নাম দিয়ে <strong>Register app</strong> করুন।</li>
                      <li>পাওয়া কোডটি <code>const firebaseConfig = ...</code> কপি করুন।</li>
                      <li>কোডটি নিচের বক্সে পেস্ট করুন।</li>
                      <li className="text-red-600 font-bold border-t pt-1 mt-1">
                         এরপর বাম মেনু থেকে "Build > Realtime Database"-এ গিয়ে "Create Database" এবং "Start in test mode" চালু করতে ভুলবেন না।
                      </li>
                    </ol>
                  </div>

                  <textarea 
                    value={configInput}
                    onChange={(e) => setConfigInput(e.target.value)}
                    placeholder={'const firebaseConfig = {\n  apiKey: "...",\n  authDomain: "...",\n  ...\n};'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] font-mono h-32 focus:outline-none focus:border-green-500"
                  />
                  <div className="flex justify-between items-center">
                    <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline font-bold">কনসোলে যান ↗</a>
                    <button 
                      onClick={handleConfigSave}
                      disabled={!configInput}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-100"
                    >
                      সেভ ও কানেক্ট করুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-green-50">
          <h2 className="text-xl font-black mb-6 text-gray-800">{editingId ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="পণ্যের নাম *" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" required />
            
            {/* ক্যাটাগরি এবং পরিমাণ সেকশন */}
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-green-600">ক্যাটাগরি সিলেক্ট করুন</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none font-bold cursor-pointer text-gray-800 focus:border-green-500 transition-colors">
                  <option value="General">General (সাধারণ)</option>
                  <option value="Medicine">Medicine (ঔষধ)</option>
                  <option value="Hair Care">Hair Care (চুলের যত্ন)</option>
                  <option value="Personal Care">Personal Care (ব্যক্তিগত যত্ন)</option>
                  <option value="Food & Nutrition">Food & Nutrition (খাবার ও পুষ্টি)</option>
                </select>
              </div>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="পরিমাণ (যেমন: ১০০ গ্রাম)" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" />
            </div>

            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="বিবরণ..." className="w-full bg-gray-50 p-4 rounded-2xl outline-none" rows={2} />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" name="mrp" value={formData.mrp} onChange={handleInputChange} placeholder="MRP" className="bg-gray-50 p-3 rounded-xl text-center font-bold" />
              <input type="number" name="dp" value={formData.dp} onChange={handleInputChange} placeholder="DP" className="bg-green-50 p-3 rounded-xl text-center font-bold" />
              <input type="number" name="pv" value={formData.pv} onChange={handleInputChange} placeholder="PV" className="bg-blue-50 p-3 rounded-xl text-center font-bold" />
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 p-4 rounded-2xl text-center cursor-pointer hover:bg-green-50 transition-colors">
              {formData.image ? <img src={formData.image} className="w-16 h-16 object-cover rounded-xl mx-auto" /> : <p className="text-xs font-bold text-gray-400 uppercase">ছবি যোগ করুন</p>}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            {/* পাসওয়ার্ড কনফার্মেশন ফিল্ড (প্রতিবার পণ্য অ্যাড/এডিট করার জন্য) */}
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
               <label className="block text-[10px] font-bold text-red-500 mb-1 ml-1 uppercase">নিরাপত্তার জন্য পাসওয়ার্ড দিন *</label>
               <input 
                 type="password" 
                 value={actionPassword} 
                 onChange={(e) => setActionPassword(e.target.value)} 
                 placeholder="অ্যাডমিন পাসওয়ার্ড..." 
                 className="w-full bg-white border border-red-200 p-3 rounded-xl outline-none font-bold text-red-600 focus:border-red-500" 
                 required
               />
            </div>

            <button type="submit" className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${editingId ? 'bg-orange-500' : 'bg-green-600 hover:bg-green-700'}`}>
              {editingId ? 'নিশ্চিত করুন ও আপডেট করুন' : 'নিশ্চিত করুন ও সেভ করুন'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({name: '', description: '', quantity: '', mrp: '', dp: '', pv: '', image: '', category: 'General'}); setActionPassword(''); }} className="w-full text-gray-500 font-bold py-2 text-xs">ক্যানসেল</button>
            )}
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 mt-8 lg:mt-0">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="font-black text-gray-800">পণ্য তালিকা</h2>
              <p className="text-xs text-gray-500 font-bold">মোট {products.length} টি পণ্য</p>
            </div>
            <div className="flex space-x-2">
               <button onClick={handleDeleteAllCheck} className="text-[10px] font-black bg-red-50 text-red-600 px-3 py-2 rounded-xl border border-red-100">সব মুছুন</button>
               <button onClick={handleLogout} className="text-[10px] font-black bg-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-300">লগ আউট</button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover mr-4 shadow-sm" />
                  <div>
                    <p className="font-black text-sm text-gray-800">{p.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">{p.category}</span>
                      <span className="text-[10px] font-bold text-gray-400 py-0.5">MRP: ৳{p.mrp} | PV: {p.pv}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditingId(p.id); setFormData({...p, mrp: p.mrp.toString(), dp: p.dp.toString(), pv: p.pv.toString()}); window.scrollTo(0,0); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5"/></svg></button>
                  <button onClick={() => handleDeleteCheck(p.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
