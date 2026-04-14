
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Video, 
  Users, 
  User,
  Award, 
  ChevronRight, 
  Play,
  CheckCircle2,
  Star,
  MessageCircle,
  ShieldCheck,
  HelpCircle,
  Phone,
  Clock,
  Calendar
} from 'lucide-react';

// Raw SVG for Facebook icon to avoid lucide-react version issues
const FacebookIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course } from '../types';

const Home: React.FC = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), limit(3));
        const querySnapshot = await getDocs(q);
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    { label: 'সক্রিয় শিক্ষার্থী', value: '৫০০+', icon: Users },
    { label: 'অনলাইন কোর্স', value: '২০+', icon: BookOpen },
    { label: 'ভিডিও ক্লাস', value: '১০০০+', icon: Video },
    { label: 'সার্টিফিকেট প্রাপ্ত', value: '৩০০+', icon: Award },
  ];

  const faqs = [
    { q: 'ভর্তি হতে কি কি লাগবে?', a: 'ভর্তি হতে শুধুমাত্র আপনার নাম, ইমেইল এবং ফোন নম্বর দিয়ে রেজিস্ট্রেশন করলেই হবে।' },
    { q: 'ক্লাসগুলো কি লাইভ হবে নাকি রেকর্ডেড?', a: 'আমাদের এখানে রেকর্ডেড ভিডিও ক্লাসের পাশাপাশি সাপ্তাহিক লাইভ সেশন ও প্রশ্নোত্তর পর্ব থাকে।' },
    { q: 'কোর্স শেষে কি সার্টিফিকেট দেওয়া হয়?', a: 'হ্যাঁ, প্রতিটি কোর্স সফলভাবে সম্পন্ন করার পর আমরা অনলাইন সার্টিফিকেট প্রদান করি।' },
    { q: 'পেমেন্ট কিভাবে করতে হয়?', a: 'বর্তমানে আমাদের বেশিরভাগ কোর্স ফ্রি। পেইড কোর্সের ক্ষেত্রে বিকাশ বা নগদের মাধ্যমে পেমেন্ট করা যাবে।' },
  ];

  const categories = [
    { title: 'কুরআন শিক্ষা', desc: 'সহজ পদ্ধতিতে সহীহ কুরআন তিলাওয়াত শিক্ষা।', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700' },
    { title: 'নামাজ ও দোয়া', desc: 'নামাজের মাসয়ালা ও প্রয়োজনীয় দোয়া শিক্ষা।', icon: CheckCircle2, color: 'bg-amber-100 text-amber-700' },
    { title: 'হাদিস শিক্ষা', desc: 'দৈনন্দিন জীবনের প্রয়োজনীয় হাদিস ও সুন্নাহ।', icon: Star, color: 'bg-blue-100 text-blue-700' },
    { title: 'বেসিক ইসলাম', desc: 'ইসলামের মৌলিক জ্ঞান ও আকিদা শিক্ষা।', icon: ShieldCheck, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700 px-4 py-2 rounded-full text-amber-400 font-medium text-sm">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>অনলাইন দ্বীনি শিক্ষা প্রতিষ্ঠান</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                ঘরে বসেই শিখুন <span className="text-amber-400">সহীহ কুরআন</span> ও দ্বীনি শিক্ষা
              </h1>
              <p className="text-lg text-emerald-100/80 max-w-xl leading-relaxed">
                মহিলা ও বালিকাদের জন্য সম্পূর্ণ পর্দা ও ঘরোয়া পরিবেশে অনলাইনে অভিজ্ঞ শিক্ষিকা দ্বারা কুরআন, হাদিস ও প্রয়োজনীয় মাসয়ালা শিক্ষার নির্ভরযোগ্য প্রতিষ্ঠান।
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-8" asChild>
                  <Link to="/registration">ভর্তি হতে রেজিস্ট্রেশন করুন</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8" asChild>
                  <Link to="/courses">কোর্সসমূহ দেখুন</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-8 border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1584551270911-65561192dfc2?auto=format&fit=crop&q=80&w=800" 
                  alt="Madrasa Education" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent flex items-center justify-center">
                  <button className="bg-white/20 backdrop-blur-md p-6 rounded-full hover:scale-110 transition-transform group">
                    <Play className="h-12 w-12 text-white fill-white group-hover:text-amber-400 group-hover:fill-amber-400" />
                  </button>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">সার্টিফিকেট কোর্স</p>
                    <p className="font-bold text-emerald-900">কোর্স শেষে সনদপত্র</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-700 mb-2">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-emerald-900">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Message Section */}
      <section className="py-20 bg-emerald-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-emerald-900 leading-relaxed">
                কোরআন কি আপনার ঘরের শোকেসে রাখা একটি বই— <br />
                নাকি আপনার জীবনের পথচলার নূর? ✨
              </h2>
              <p className="text-xl text-emerald-800 font-medium">
                আজই সুযোগ— আল্লাহর কিতাবকে শুধু পড়া নয়, শুদ্ধভাবে পড়া শেখার 🌙
              </p>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 text-left space-y-6">
                <div className="flex items-center gap-3 text-emerald-800 font-bold text-lg border-b pb-4">
                  <BookOpen className="h-6 w-6" />
                  <span>আলহেরা রাহিমা আক্তার অনলাইন মাদ্রাসা–র পক্ষ থেকে</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                      <Star className="h-5 w-5 text-emerald-700" />
                    </div>
                    <p className="font-medium text-emerald-900">নূরানী পদ্ধতিতে তাজভীদ সহ সহীহ কোরআন শিক্ষা</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                      <ShieldCheck className="h-5 w-5 text-emerald-700" />
                    </div>
                    <p className="font-medium text-emerald-900">বিশেষ তত্ত্বাবধানে হিফজ বিভাগ চালু রয়েছে</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    আমাদের ক্লাস কেন আলাদা?
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      'অফলাইন মাদ্রাসার মতো ধাপে ধাপে, মমতাময় পাঠদান',
                      'হরফ পরিচয় থেকে শুদ্ধ তিলাওয়াত—একই কোর্সে',
                      'তাজভীদের নিয়ম সহজ করে, হাতে–কলমে অনুশীলন',
                      'হিফজ শিক্ষার্থীদের জন্য আলাদা রুটিন, নিয়মিত রিভিশন',
                      'ক্লাস মানেই ইমান, আদব ও আন্তরিক পরিবেশ',
                      'একদম নতুন ও ব্যস্ত আপুদের জন্যও সহজ সময়সূচি'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-emerald-800">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-center text-amber-400">🎁 আজকের বিশেষ সুযোগ:</h4>
                  <p className="text-center font-bold text-lg">✨ আগ্রহী আপুদের জন্য ৭ দিনের সম্পূর্ণ ফ্রি ক্লাস ✨</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold">
                      অংশ নিতে যোগাযোগ করুন
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      শেয়ার করুন
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <p className="text-emerald-900 font-medium italic">
                  "একবার ভাবুন… আপনার কণ্ঠে শুদ্ধ তিলাওয়াত, আপনার ঘরে কোরআনের নূর, আর প্রতিটি আয়াত হয়ে উঠছে আপনার জান্নাতের সঞ্চয় 🌸"
                </p>
                <p className="text-sm text-emerald-700">
                  🌙 কোরআনের সাথে বন্ধন গড়ুন—নিজে শিখুন, অন্যকেও শিখতে সহায়তা করুন 🌙
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Course Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-emerald-900 rounded-[2rem] overflow-hidden shadow-2xl relative">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
            </div>

            <div className="relative z-10 grid lg:grid-cols-2">
              {/* Left Side: Image & Title */}
              <div className="p-8 lg:p-16 flex flex-col justify-center space-y-8 bg-emerald-800/30">
                <div className="space-y-4">
                  <Badge className="bg-amber-500 text-emerald-950 hover:bg-amber-400 font-bold px-4 py-1">নতুন ব্যাচ</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                    কুরআন শিক্ষা কোর্স <br />
                    <span className="text-amber-400">[শুধুমাত্র মেয়েদের জন্য]</span>
                  </h2>
                  <p className="text-emerald-100/80 text-lg leading-relaxed">
                    জিরো থেকে তাজবীদসহ বিশুদ্ধ উচ্চারণে কায়দা, কুরআন তেলাওয়াত, নামাজের প্রয়োজনীয় সকল নিয়ম-কানুন ও মাসনূন দুআ শিখুন।
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                    <Star className="h-6 w-6 fill-amber-400" />
                    কোর্সে কী শিখবেন?
                  </h3>
                  <div className="grid sm:grid-cols-1 gap-4">
                    {[
                      'জিরো থেকে বিশুদ্ধ উচ্চারণে কুরআন তেলায়াত',
                      'কায়দা, তাজবীদ ও সিফাতসহ বিশুদ্ধ উচ্চারণ',
                      'নামাজের প্রয়োজনীয় মাসায়েল',
                      'প্রয়োজনীয় মাসনুন দুআ',
                      'কুরআনের ১০টি সূরা মাশ্ক ও মুখস্ত',
                      'নাযেরা ব্যাচে সম্পূর্ণ ৩০ নং পারা বিশুদ্ধ তেলাওয়াত ও মাশক',
                      'পুরো ৩০ পারা কোরআন হিফজ',
                      'প্রাইভেট গ্রুপ ও সরাসরি শিক্ষিকার সাথে যোগাযোগ'
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-emerald-50">
                        <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Schedule & Instructors */}
              <div className="p-8 lg:p-16 space-y-12">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-3xl space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                      <Clock className="h-6 w-6" />
                      সময়সূচি ও তথ্য
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                        <Calendar className="h-6 w-6 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-emerald-200 text-sm">জিরো থেকে কুরআন শিক্ষা</p>
                          <p className="text-white font-bold">শনি, সোম ও বুধবার</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                        <Calendar className="h-6 w-6 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-emerald-200 text-sm">নাযেরা ব্যাচ</p>
                          <p className="text-white font-bold">রবি, মঙ্গল ও বৃহস্পতিবার</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl">
                          <p className="text-emerald-200 text-sm">মাধ্যম</p>
                          <p className="text-white font-bold">Google Meet</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl">
                          <p className="text-emerald-200 text-sm">মোট ক্লাস</p>
                          <p className="text-white font-bold">৩০+</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-emerald-200 text-sm">সময়কাল</p>
                        <p className="text-white font-bold">২ থেকে ২.৫ মাস (কুরআন পড়তে পারবেন)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      ক্লাস নিবেন (মুয়াল্লিমা)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {['মুয়াল্লিমা রাহিমা আক্তার', 'মুয়াল্লিমা ফাবিয়া মল্লিক', 'হাফেজা রাশেদা'].map((teacher, i) => (
                        <span key={i} className="bg-emerald-800 text-emerald-50 px-4 py-2 rounded-full text-sm font-medium border border-emerald-700">
                          {teacher}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold h-14 text-lg shadow-xl shadow-amber-500/20" asChild>
                    <Link to="/registration">
                      ভর্তি হতে রেজিস্ট্রেশন করুন
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 bg-white" id="popular-courses">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">আমাদের জনপ্রিয় কোর্সসমূহ</h2>
              <p className="text-muted-foreground max-w-xl">সবচেয়ে জনপ্রিয় কোর্সগুলো দিয়ে আপনার দ্বীনি শিক্ষার যাত্রা শুরু করুন।</p>
            </div>
            <Button variant="outline" className="border-emerald-700 text-emerald-700" asChild>
              <Link to="/courses">সবগুলো কোর্স দেখুন <ChevronRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>

          {loadingCourses ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <motion.div 
                  key={course.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-50 group hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-700 text-white">{course.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-emerald-900 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-4 w-4" /> {course.instructor}</span>
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> {course.lessons?.length || 0} ক্লাস</span>
                    </div>
                    <Button className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors" asChild>
                      <Link to={`/courses/${course.id}`}>বিস্তারিত দেখুন</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#f8fafc]" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">আমাদের কোর্স ক্যাটাগরি</h2>
            <p className="text-muted-foreground">আপনার প্রয়োজন অনুযায়ী সঠিক কোর্সটি বেছে নিন এবং আজই আপনার দ্বীনি যাত্রা শুরু করুন।</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${cat.color}`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-3">{cat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{cat.desc}</p>
                <Link to="/courses" className="text-emerald-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  বিস্তারিত দেখুন <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white" id="about">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1590073844006-3a44279d6df7?auto=format&fit=crop&q=80&w=800" 
                alt="Learning" 
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">কেন আমাদের মাদ্রাসায় ভর্তি হবেন?</h2>
              <div className="space-y-6">
                {[
                  { title: 'সম্পূর্ণ পর্দা ও ঘরোয়া পরিবেশ', desc: 'মহিলা ও বালিকাদের জন্য নিরাপদ ও ঘরোয়া পরিবেশে অনলাইনে শিক্ষা প্রদান।' },
                  { title: 'অভিজ্ঞ শিক্ষিকা মণ্ডলী', desc: 'দেশের স্বনামধন্য মাদ্রাসা থেকে ফারেগ হওয়া অভিজ্ঞ শিক্ষিকাদের মাধ্যমে পাঠদান।' },
                  { title: 'আধুনিক ভিডিও স্ট্রিমিং', desc: 'সহজ ও সাবলীল ভিডিও স্ট্রিমিং সিস্টেম যা যেকোনো ডিভাইসে কাজ করে।' },
                  { title: 'লাইভ ক্লাস ও সাপোর্ট', desc: 'সরাসরি জুম বা গুগল মিটের মাধ্যমে লাইভ ক্লাস ও প্রশ্নোত্তরের সুযোগ।' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white" asChild>
                <Link to="/register">আজই ভর্তি হোন</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#f8fafc]" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">জিজ্ঞাসিত প্রশ্নাবলী</h2>
            <p className="text-muted-foreground">আপনার মনে থাকা সাধারণ কিছু প্রশ্নের উত্তর এখানে পেতে পারেন।</p>
          </div>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-emerald-50">
                  <AccordionTrigger className="text-emerald-900 font-bold hover:text-emerald-700">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {/* Call Button */}
        <a 
          href="tel:01721003234" 
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="কল করুন"
        >
          <Phone className="h-6 w-6" />
        </a>

        {/* Facebook Button */}
        <a 
          href="https://www.facebook.com/profile.php?id=61569740871872" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#1877F2] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="ফেসবুক পেজ"
        >
          <FacebookIcon />
        </a>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/8801721003234" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="হোয়াটসঅ্যাপ"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default Home;
