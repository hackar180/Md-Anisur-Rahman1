
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  User, 
  PlayCircle,
  Video
} from 'lucide-react';
import { collection, query, getDocs, where, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course, CourseCategory } from '../types';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Courses: React.FC = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  const categories: string[] = ['All', 'Quran Learning', 'Dua', 'Namaz', 'Hadith', 'Basic Islam'];

  const initialMockCourses: Course[] = [
    {
      id: 'quran-1',
      title: 'সহীহ কুরআন তিলাওয়াত (বেসিক)',
      description: 'নূরানী পদ্ধতিতে তাজভীদ সহ সহীহ কোরআন শিক্ষার প্রাথমিক কোর্স।',
      category: 'Quran Learning',
      instructor: 'হাফেজা রহিমা আক্তার',
      thumbnail: 'https://images.unsplash.com/photo-1584551270911-65561192dfc2?auto=format&fit=crop&q=80&w=600',
      lessons: [
        { id: 'l1', title: 'হরফ পরিচয়', videoUrl: '', duration: '১০ মিনিট', order: 1 },
        { id: 'l2', title: 'মাখরাজ শিক্ষা', videoUrl: '', duration: '১৫ মিনিট', order: 2 }
      ],
      isLive: true
    },
    {
      id: 'dua-1',
      title: 'দৈনন্দিন মাসনুন দোয়া',
      description: 'সকাল-সন্ধ্যা ও দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও জিকির।',
      category: 'Dua',
      instructor: 'উস্তাজা ফাতেমা জোহরা',
      thumbnail: 'https://images.unsplash.com/photo-1590073844006-3a44279d6df7?auto=format&fit=crop&q=80&w=600',
      lessons: [
        { id: 'l1', title: 'ঘুম থেকে ওঠার দোয়া', videoUrl: '', duration: '৫ মিনিট', order: 1 }
      ],
      isLive: false
    },
    {
      id: 'namaz-1',
      title: 'নামাজ শিক্ষা ও মাসয়ালা',
      description: 'শুদ্ধভাবে নামাজ পড়ার নিয়ম ও প্রয়োজনীয় মাসয়ালা শিক্ষা।',
      category: 'Namaz',
      instructor: 'হাফেজা রহিমা আক্তার',
      thumbnail: 'https://images.unsplash.com/photo-1584551270911-65561192dfc2?auto=format&fit=crop&q=80&w=600',
      lessons: [
        { id: 'l1', title: 'অজুর নিয়ম', videoUrl: '', duration: '১২ মিনিট', order: 1 }
      ],
      isLive: false
    }
  ];

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        
        if (coursesData.length === 0) {
          setCourses(initialMockCourses);
        } else {
          setCourses(coursesData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(initialMockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const seedData = async () => {
    setLoading(true);
    try {
      for (const course of initialMockCourses) {
        const { id, ...data } = course;
        await setDoc(doc(db, 'courses', id), data);
      }
      toast.success("কোর্স ডেটা সফলভাবে যোগ করা হয়েছে!");
      // Refresh
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesData);
    } catch (error) {
      toast.error("ডেটা যোগ করতে সমস্যা হয়েছে।");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-emerald-900">আমাদের কোর্সসমূহ</h1>
            <p className="text-muted-foreground">আপনার পছন্দের কোর্সটি বেছে নিন এবং আজই শুরু করুন।</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="কোর্স খুঁজুন..." 
                className="pl-10 w-full sm:w-[300px] bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className={activeCategory === cat ? "bg-emerald-700 text-white" : "text-emerald-900 border-emerald-100 bg-white"}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? 'সবগুলো' : cat}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all border-emerald-50 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1584551270911-65561192dfc2?auto=format&fit=crop&q=80&w=600"} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-emerald-700 text-white">
                    {course.category}
                  </Badge>
                  {course.isLive && (
                    <Badge className="absolute top-4 right-4 bg-red-600 text-white animate-pulse">
                      Live
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-900 line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>{course.lessons?.length || 0} ক্লাস</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white" asChild>
                    <Link to={`/courses/${course.id}`}>বিস্তারিত দেখুন</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-emerald-200">
            <BookOpen className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-emerald-900">কোনো কোর্স পাওয়া যায়নি</h3>
            <p className="text-muted-foreground mb-6">অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা সার্চ ট্রাই করুন।</p>
            <Button 
              onClick={seedData} 
              variant="outline" 
              className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            >
              প্রাথমিক কোর্স ডেটা যোগ করুন
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
