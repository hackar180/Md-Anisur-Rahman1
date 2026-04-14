
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Lock, ChevronLeft, Video, User, Users } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course, UserProfile, Lesson } from '../types';
import { toast } from "sonner";

const CourseDetails: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
  const navigate = useNavigate();

  const isEnrolled = user?.enrolledCourses?.includes(id || '');

  React.useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'courses', id));
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Course;
          setCourse(data);
          if (data.lessons?.length > 0) setActiveLesson(data.lessons[0]);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { toast.error("ভর্তি হতে প্রথমে লগইন করুন।"); navigate('/login'); return; }
    if (!id) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { enrolledCourses: arrayUnion(id) });
      toast.success("সফলভাবে ভর্তি হয়েছেন!");
      window.location.reload();
    } catch (e) { toast.error("ভর্তি হতে সমস্যা হয়েছে।"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-700"></div></div>;
  if (!course) return <div className="text-center py-20"><h1>কোর্সটি পাওয়া যায়নি</h1><Button asChild className="mt-4"><Link to="/courses">কোর্সসমূহ</Link></Button></div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="flex items-center gap-2 text-emerald-200 mb-6"><ChevronLeft className="h-4 w-4" />কোর্সসমূহ</Link>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Badge className="bg-amber-500 text-emerald-950">{course.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold">{course.title}</h1>
              <p className="text-emerald-100/80 text-lg">{course.description}</p>
              <div className="flex gap-6 text-sm">
                <span className="flex items-center gap-2"><User className="h-4 w-4 text-amber-400" />{course.instructor}</span>
                <span className="flex items-center gap-2"><Video className="h-4 w-4 text-amber-400" />{course.lessons?.length || 0} ক্লাস</span>
              </div>
            </div>
            {!isEnrolled && (
              <Card className="bg-white text-emerald-900">
                <CardHeader><CardTitle>ফ্রি ভর্তি হোন</CardTitle></CardHeader>
                <CardContent><Button onClick={handleEnroll} className="w-full bg-emerald-700 text-white h-12">ভর্তি হোন</Button></CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {isEnrolled ? (
            <div className="space-y-6">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                {activeLesson ? <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen></iframe> : <div className="w-full h-full flex items-center justify-center text-white/50"><PlayCircle className="h-20 w-20" /></div>}
              </div>
              <div className="bg-white p-8 rounded-2xl border">
                <h2 className="text-2xl font-bold text-emerald-900">{activeLesson?.title || "ক্লাস সিলেক্ট করুন"}</h2>
                <p className="text-muted-foreground mt-4">এই ক্লাসে আমরা {course.title} এর গুরুত্বপূর্ণ বিষয়গুলো নিয়ে আলোচনা করব।</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-emerald-100">
              <Lock className="h-16 w-16 text-emerald-200 mx-auto mb-6" /><h2 className="text-2xl font-bold text-emerald-900">ভিডিও ক্লাসগুলো লক করা আছে</h2><Button onClick={handleEnroll} className="bg-emerald-700 text-white mt-8">এখনই ভর্তি হোন</Button>
            </div>
          )}
        </div>
        <Card className="border-emerald-50 h-fit sticky top-24">
          <CardHeader className="bg-emerald-50/50"><CardTitle className="text-lg">ক্লাস মডিউল</CardTitle></CardHeader>
          <CardContent className="p-0"><ScrollArea className="h-[400px]">
            {course.lessons?.sort((a, b) => a.order - b.order).map((lesson, i) => (
              <button key={lesson.id} disabled={!isEnrolled} onClick={() => setActiveLesson(lesson)} className={`w-full text-left p-4 flex items-start gap-4 border-b ${activeLesson?.id === lesson.id ? 'bg-emerald-50' : ''} ${!isEnrolled ? 'opacity-50' : ''}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${activeLesson?.id === lesson.id ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{i + 1}</div>
                <div className="flex-grow"><p className="font-medium text-sm">{lesson.title}</p><p className="text-xs text-muted-foreground">{lesson.duration}</p></div>
                {!isEnrolled && <Lock className="h-4 w-4 text-gray-400" />}
              </button>
            ))}
          </ScrollArea></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;
