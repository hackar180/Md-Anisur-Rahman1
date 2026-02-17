
import React, { useState } from 'react';
import { CartItem } from '../types.ts';

interface CheckoutProps {
  cart: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'Cash on Delivery'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + (item.mrp * item.cartQuantity), 0);
  const totalPV = cart.reduce((acc, item) => acc + (item.pv * item.cartQuantity), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendToTelegram = async () => {
    const BOT_TOKEN = '7914227549:AAHYmV6JQ1H8n05kI0f6g1a3PEFeBy6OBvw';
    const CHAT_ID = '7868741210';
    
    const itemsList = cart.map((item, index) => 
      `${index + 1}. ${item.name}\n   Qty: ${item.cartQuantity} | Price: ৳${item.mrp * item.cartQuantity} | PV: ${item.pv * item.cartQuantity}`
    ).join('\n\n');

    const message = `
🌟 NEW ORDER RECEIVED!
--------------------------
👤 Customer: ${formData.name}
📞 Phone: ${formData.phone}
📍 Address: ${formData.address}
💳 Payment: ${formData.payment}
--------------------------
🛒 ITEMS:
${itemsList}

--------------------------
💰 Subtotal: ৳${totalPrice}
🚚 Delivery: ৳50
💎 TOTAL: ৳${totalPrice + 50}
✨ TOTAL PV: ${totalPV}
--------------------------
📅 Time: ${new Date().toLocaleString('bn-BD')}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      });

      const data = await response.json();
      return response.ok && data.ok;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('দয়া করে আপনার নাম, ফোন নম্বর এবং ঠিকানা সঠিকভাবে লিখুন।');
      return;
    }

    setIsSubmitting(true);
    const sent = await sendToTelegram();
    setIsSubmitting(false);
    
    if (sent) {
      onSuccess();
    } else {
      alert('অর্ডার পাঠাতে সমস্যা হয়েছে। আপনার ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-1">
          <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-green-600 rounded-full mr-3"></span>
            অর্ডার তথ্য দিন
          </h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-green-50 space-y-5">
            <div>
              <label htmlFor="name" className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">আপনার নাম *</label>
              <input 
                id="name"
                name="name"
                type="text" 
                required
                placeholder="নাম লিখুন"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-gray-800" 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ফোন নাম্বার *</label>
              <input 
                id="phone"
                name="phone"
                type="tel" 
                required
                placeholder="০১XXXXXXXXX"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-gray-800" 
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ডেলিভারি ঠিকানা *</label>
              <textarea 
                id="address"
                name="address"
                required
                placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white p-4 rounded-2xl outline-none font-medium text-gray-800" 
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="payment" className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">পেমেন্ট মেথড</label>
              <select 
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 rounded-2xl outline-none font-bold text-gray-800 cursor-pointer"
              >
                <option value="Cash on Delivery">ক্যাশ অন ডেলিভারি (COD)</option>
                <option value="Bkash">বিকাশ (Bkash)</option>
                <option value="Nagad">নগদ (Nagad)</option>
              </select>
            </div>
            
            <div className="pt-4 flex items-center space-x-4">
               <button 
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 text-gray-400 font-black hover:text-red-500 transition-colors uppercase tracking-widest text-xs"
              >
                পিছনে যান
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex-2 px-8 py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg active:scale-95 flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-70' : 'hover:bg-green-700'}`}
              >
                {isSubmitting ? 'প্রসেসিং...' : 'অর্ডার নিশ্চিত করুন'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-2">
          <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
            অর্ডার সামারি
          </h2>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-blue-50">
            <ul className="divide-y divide-gray-100 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.image} className="w-12 h-12 rounded-xl object-cover mr-4" alt="" />
                    <div>
                      <p className="font-black text-gray-800 text-sm">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">পরিমাণ: {item.cartQuantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">৳{item.mrp * item.cartQuantity}</span>
                </li>
              ))}
            </ul>
            
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span>উপ-মোট</span>
                <span>৳{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span>ডেলিভারি চার্জ</span>
                <span>৳৫০</span>
              </div>
              <div className="flex justify-between text-sm text-blue-500 font-bold">
                <span>মোট পিভি (PV)</span>
                <span>{totalPV}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-black text-gray-800">সর্বমোট</span>
                <span className="text-2xl font-black text-green-700">৳{totalPrice + 50}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
