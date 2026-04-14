
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-900 text-emerald-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-emerald-700" />
              </div>
              <span className="text-xl font-bold text-white">আল হেরা মাদ্রাসা</span>
            </Link>
            <p className="text-emerald-100/80 leading-relaxed">
              মহিলা ও বালিকাদের জন্য নিরাপদ ও ঘরোয়া পরিবেশে অনলাইনে বিশুদ্ধ কুরআন ও দ্বীনি শিক্ষা প্রদানের একটি নির্ভরযোগ্য প্রতিষ্ঠান।
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">প্রয়োজনীয় লিংক</h3>
            <ul className="space-y-4">
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">সকল কোর্স</Link></li>
              <li><Link to="/#about" className="hover:text-amber-400 transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/#faq" className="hover:text-amber-400 transition-colors">জিজ্ঞাসিত প্রশ্নাবলী</Link></li>
              <li><Link to="/#contact" className="hover:text-amber-400 transition-colors">যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">জনপ্রিয় কোর্স</h3>
            <ul className="space-y-4">
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">সহজ কুরআন শিক্ষা</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">নামাজ ও দোয়া শিক্ষা</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">হাদিস ও মাসয়ালা</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">বেসিক ইসলাম শিক্ষা</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">যোগাযোগ করুন</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
                <span>অনলাইন ভিত্তিক শিক্ষা প্রতিষ্ঠান (ঢাকা, বাংলাদেশ)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400 shrink-0" />
                <span>+৮৮০ ১৭০০-০০০০০০</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                <span>info@alhera-madrasa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-100/60">
          <p>© ২০২৪ আল হেরা রহিমা আক্তার ইসলামিক অনলাইন মহিলা মাদ্রাসা। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">গোপনীয়তা নীতি</a>
            <a href="#" className="hover:text-white">শর্তাবলী</a>
            <Link to="/admin" className="hover:text-white font-medium">অ্যাডমিন লগইন</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
