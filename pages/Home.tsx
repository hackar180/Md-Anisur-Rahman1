
import React from 'react';
import { Product } from '../types.ts';
import Slider from '../components/Slider.tsx';
import ProductCard from '../components/ProductCard.tsx';

interface HomeProps {
  products: Product[];
  addToCart: (product: Product) => void;
  isSearching: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

// আপডেট করা ক্যাটাগরি লিস্ট
const CATEGORIES = ['সকল পণ্য', 'Medicine', 'Hair Care', 'Personal Care', 'Food & Nutrition', 'General'];

const Home: React.FC<HomeProps> = ({ products, addToCart, isSearching, activeCategory, setActiveCategory }) => {
  return (
    <div>
      {!isSearching && <Slider />}
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 mt-8 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <span className="w-2 h-8 bg-green-600 rounded-full mr-4"></span>
            {isSearching 
              ? `অনুসন্ধানের ফলাফল (${products.length})` 
              : activeCategory === 'সকল পণ্য' 
                ? 'আমাদের ভেষজ পণ্যসমূহ' 
                : `${activeCategory} সেকশনের পণ্যসমূহ`}
          </h2>
          {!isSearching && <p className="text-gray-500 mt-2 ml-6 text-lg">আধুনিক প্রযুক্তিতে ভেষজ চিকিৎসা ও সুস্থ জীবন।</p>}
        </div>
        
        {!isSearching && (
          <div className="flex overflow-x-auto pb-2 lg:pb-0 scrollbar-hide space-x-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all whitespace-nowrap shadow-sm ${
                  activeCategory === cat 
                  ? 'bg-green-600 border-green-600 text-white shadow-green-100 scale-105' 
                  : 'bg-white border-gray-100 text-gray-600 hover:border-green-300 hover:text-green-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAdd={addToCart} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-gray-800">দুঃখিত, কোনো পণ্য পাওয়া যায়নি।</h3>
          <p className="text-gray-400 mt-2 font-medium">
            {activeCategory !== 'সকল পণ্য' 
              ? `বর্তমানে '${activeCategory}' ক্যাটাগরিতে কোনো পণ্য নেই।` 
              : "অনুগ্রহ করে অন্য কোনো নাম দিয়ে চেষ্টা করুন।"}
          </p>
          <button 
            onClick={() => { setActiveCategory('সকল পণ্য'); }} 
            className="mt-8 bg-green-50 text-green-700 px-8 py-3 rounded-2xl font-black hover:bg-green-100 transition-all border border-green-200"
          >
            সকল পণ্য দেখুন
          </button>
        </div>
      )}

      {!isSearching && (
        <>
          {/* Social Community Section */}
          <section className="mt-20 mb-10 relative rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl overflow-hidden group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
               <img 
                 src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=2000" 
                 alt="Background" 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-block backdrop-blur-md border border-white/10">আমাদের সাথে যুক্ত হোন</span>
              <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">আমাদের অফিসিয়াল কমিউনিটিতে যোগ দিন</h3>
              <p className="text-green-100 mb-12 text-base md:text-lg opacity-90 leading-relaxed font-medium">নতুন অফার, হেলথ টিপস এবং নতুন সব পণ্য সম্পর্কে সবার আগে জানতে আমাদের হোয়াটসঅ্যাপ এবং মেসেঞ্জার গ্রুপে জয়েন করুন।</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
                <a 
                  href="https://chat.whatsapp.com/LoXe8964UKSIiUJ6iPfmUy?mode=gi_c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-4 bg-[#25D366] hover:bg-[#1ebd57] text-white py-5 px-8 rounded-3xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl border border-white/20"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>হোয়াটসঅ্যাপ গ্রুপ</span>
                </a>

                <a 
                  href="https://m.me/j/AbY0-Vlqtv0pW5VP/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-4 bg-gradient-to-r from-[#0084FF] to-[#00C6FF] hover:from-[#0073e6] hover:to-[#00b2e6] text-white py-5 px-8 rounded-3xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl border border-white/20"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.289.474 3.513.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.674l-3.062-3.271-5.968 3.271 6.558-6.96 3.125 3.271 5.905-3.271-6.558 6.96z"/>
                  </svg>
                  <span>মেসেঞ্জার গ্রুপ</span>
                </a>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section - Updated Text, Removed Image */}
          <section className="mt-20 mb-16 relative overflow-hidden bg-white rounded-[3.5rem] p-10 md:p-16 shadow-xl border border-green-100">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-50 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-black mb-6 tracking-widest uppercase">কেন আমরাই সেরা?</span>
                <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-gray-900">প্রকৃতির ছোঁয়ায় <br/><span className="text-green-600">সুস্থ থাকুন প্রতিদিন।</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-3xl border border-green-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-bold text-xl mb-2 text-gray-800">১০০% প্রাকৃতিক</h4>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">কোনো প্রকার পার্শ্বপ্রতিক্রিয়া ছাড়াই সংগৃহীত ভেষজ উপাদান।</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-3xl border border-green-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h4 className="font-bold text-xl mb-2 text-gray-800">দ্রুত কার্যকারিতা</h4>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">আমাদের বিশেষজ্ঞ টিম দ্বারা বিশেষভাবে ফর্মুলেটেড পণ্য।</p>
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden h-full flex flex-col justify-center">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                 <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-300 opacity-20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                 
                 <div className="relative z-10">
                   <h4 className="text-2xl font-black mb-6 border-b border-green-400 pb-4 inline-block">MXN মডার্ণ হারবালের প্রতিশ্রুতি</h4>
                   
                   <p className="text-lg leading-relaxed mb-6 text-green-50 font-medium">
                     "আমরা বিশ্বাস করি সুস্বাস্থ্যই সকল সুখের মূল। MXN মডার্ণ হারবাল দীর্ঘ সময় ধরে বাংলাদেশের মানুষের স্বাস্থ্য সেবায় এক বিশ্বস্ত নাম। আমাদের প্রতিটি পণ্য গবেষণাগারে পরীক্ষিত এবং সম্পূর্ণ কেমিক্যালমুক্ত।"
                   </p>
                   
                   <ul className="space-y-4">
                     <li className="flex items-start">
                       <span className="bg-green-500 p-1 rounded-full mr-3 mt-1 text-white">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                       </span>
                       <span className="text-green-100">সরাসরি প্রকৃতি থেকে সংগৃহীত উপাদান</span>
                     </li>
                     <li className="flex items-start">
                       <span className="bg-green-500 p-1 rounded-full mr-3 mt-1 text-white">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                       </span>
                       <span className="text-green-100">ISO সার্টিফাইড উৎপাদন প্রক্রিয়া</span>
                     </li>
                     <li className="flex items-start">
                       <span className="bg-green-500 p-1 rounded-full mr-3 mt-1 text-white">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                       </span>
                       <span className="text-green-100">গ্রাহকদের সর্বোচ্চ সন্তুষ্টি নিশ্চিতকরণ</span>
                     </li>
                   </ul>
                 </div>
              </div>
            </div>
          </section>

          <div className="text-center pb-8 opacity-40">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2025 MXN Modern Herbal</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
