
import React from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Video, 
  Users, 
  BookOpen, 
  Trash2, 
  Edit, 
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course, Lesson } from '../types';
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [isAuthorized, setIsAuthorized] = React.useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [logoUrl, setLogoUrl] = React.useState('');
  const [savingSettings, setSavingSettings] = React.useState(false);
  const navigate = useNavigate();

  const ADMIN_PASSWORD = 'rahima.com';

  React.useEffect(() => {
    if (isAuthorized) {
      fetchCourses();
      fetchSettings();
    }
  }, [isAuthorized]);

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'general'));
      if (docSnap.exists()) {
        setLogoUrl(docSnap.data().logoUrl || '');
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateDoc(doc(db, 'settings', 'general'), { logoUrl });
      toast.success("সেটিংস সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      // If document doesn't exist, create it
      try {
        await setDoc(doc(db, 'settings', 'general'), { logoUrl });
        toast.success("সেটিংস সফলভাবে আপডেট হয়েছে!");
      } catch (innerError) {
        toast.error("সেটিংস আপডেট করতে সমস্যা হয়েছে।");
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("কোর্স লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      localStorage.setItem('admin_auth', 'true');
      toast.success("অ্যাডমিন হিসেবে প্রবেশ করেছেন।");
    } else {
      toast.error("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthorized(false);
    localStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      toast.success("কোর্সটি মুছে ফেলা হয়েছে।");
      fetchCourses();
    } catch (error) {
      toast.error("মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <Card className="w-full max-w-md shadow-xl border-emerald-100">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-emerald-700 p-3 rounded-xl">
                <Settings className="h-8 w-8 text-amber-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-900">অ্যাডমিন লগইন</CardTitle>
            <p className="text-sm text-muted-foreground">কোর্স ম্যানেজ করতে পাসওয়ার্ড দিন</p>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-pass">পাসওয়ার্ড</Label>
                <Input 
                  id="admin-pass"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                প্রবেশ করুন
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white hidden md:block">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">অ্যাডমিন প্যানেল</h2>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-800 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span>ড্যাশবোর্ড</span>
          </Link>
          <Link to="/admin/courses/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-800 transition-colors text-amber-400 font-bold">
            <Plus className="h-5 w-5" />
            <span>নতুন কোর্স যোগ করুন</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-800 transition-colors">
            <Settings className="h-5 w-5" />
            <span>সেটিংস (লোগো)</span>
          </Link>
          <button 
            onClick={handleLogoutAdmin}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-800 transition-colors text-red-200 mt-8"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>অ্যাডমিন লগ আউট</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div>
                  <h1 className="text-2xl font-bold text-emerald-900">কোর্স ওভারভিউ</h1>
                  <p className="text-sm text-muted-foreground">আপনার মাদ্রাসার সকল কোর্স এখান থেকে নিয়ন্ত্রণ করুন</p>
                </div>
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white h-12 px-8 text-lg font-bold shadow-lg shadow-emerald-200" asChild>
                  <Link to="/admin/courses/new"><Plus className="h-5 w-5 mr-2" /> নতুন কোর্স যোগ করুন</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">মোট কোর্স</CardTitle>
                    <BookOpen className="h-4 w-4 text-emerald-700" />
                  </CardHeader>
                  <CardContent><div className="text-2xl font-bold">{courses.length}</div></CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>সবগুলো কোর্স</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-center py-4">লোড হচ্ছে...</p>
                    ) : courses.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">কোনো কোর্স নেই।</p>
                    ) : (
                      courses.map(course => (
                        <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <img src={course.thumbnail} className="h-16 w-16 rounded-lg object-cover border" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-emerald-900">{course.title}</p>
                              <p className="text-xs text-muted-foreground">{course.category} • {course.instructor}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link to={`/admin/courses/edit/${course.id}`}><Edit className="h-4 w-4" /></Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteCourse(course.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          } />
          <Route path="courses/new" element={<CourseForm onSave={fetchCourses} />} />
          <Route path="courses/edit/:id" element={<CourseForm onSave={fetchCourses} isEdit />} />
          <Route path="settings" element={
            <div className="max-w-2xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-emerald-900">ওয়েবসাইট সেটিংস</h1>
              <Card>
                <form onSubmit={handleSaveSettings}>
                  <CardHeader><CardTitle>লোগো সেটিংস</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>লোগো ইমেজ ইউআরএল (Logo URL)</Label>
                      <Input 
                        value={logoUrl} 
                        onChange={e => setLogoUrl(e.target.value)} 
                        placeholder="https://example.com/logo.png" 
                        required 
                      />
                      <p className="text-xs text-muted-foreground">আপনার মাদ্রাসার লোগোর সরাসরি লিঙ্ক এখানে দিন।</p>
                    </div>
                    {logoUrl && (
                      <div className="h-20 w-40 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img src={logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="bg-emerald-700 text-white" disabled={savingSettings}>
                      {savingSettings ? 'সেভ হচ্ছে...' : 'লোগো আপডেট করুন'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

const CourseForm: React.FC<{ onSave: () => void; isEdit?: boolean }> = ({ onSave, isEdit }) => {
  const { id } = useParams();
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [category, setCategory] = React.useState('Quran Learning');
  const [thumbnail, setThumbnail] = React.useState('');
  const [instructor, setInstructor] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isEdit && id) {
      fetchCourse();
    }
  }, [isEdit, id]);

  const fetchCourse = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'courses', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Course;
        setTitle(data.title);
        setDesc(data.description);
        setCategory(data.category);
        setThumbnail(data.thumbnail);
        setInstructor(data.instructor);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("কোর্স ডাটা লোড করতে সমস্যা হয়েছে।");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const courseData = {
        title,
        description: desc,
        category,
        thumbnail,
        instructor,
        updatedAt: new Date().toISOString()
      };

      if (isEdit && id) {
        await updateDoc(doc(db, 'courses', id), courseData);
        toast.success("কোর্সটি সফলভাবে আপডেট হয়েছে!");
      } else {
        await addDoc(collection(db, 'courses'), {
          ...courseData,
          lessons: [],
          createdAt: new Date().toISOString()
        });
        toast.success("কোর্সটি সফলভাবে তৈরি হয়েছে!");
      }
      onSave();
      navigate('/admin');
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin')}>ফিরে যান</Button>
        <h1 className="text-2xl font-bold text-emerald-900">{isEdit ? 'কোর্স এডিট করুন' : 'নতুন কোর্স যোগ করুন'}</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>কোর্সের নাম</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="যেমন: সহীহ কুরআন তিলাওয়াত" required />
            </div>
            <div className="space-y-2">
              <Label>বিবরণ</Label>
              <textarea 
                className="w-full min-h-[100px] p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={desc} 
                onChange={e => setDesc(e.target.value)} 
                placeholder="কোর্স সম্পর্কে বিস্তারিত লিখুন"
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ক্যাটাগরি</Label>
                <select 
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="Quran Learning">Quran Learning</option>
                  <option value="Dua">Dua</option>
                  <option value="Namaz">Namaz</option>
                  <option value="Hadith">Hadith</option>
                  <option value="Basic Islam">Basic Islam</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>শিক্ষিকার নাম</Label>
                <Input value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="যেমন: হাফেজা রহিমা আক্তার" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>থাম্বনেইল ইমেজ ইউআরএল (Direct Image Link)</Label>
              <Input value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://example.com/image.jpg" required />
              <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                <strong>টিপস:</strong> ইমেজের সরাসরি লিঙ্ক ব্যবহার করুন (লিঙ্কের শেষে .jpg বা .png থাকতে হবে)। 
                Postimg ব্যবহার করলে "Direct Link" কপি করে এখানে দিন।
              </p>
              {thumbnail && (
                <div className="mt-2 border rounded-lg overflow-hidden h-32 w-full max-w-[200px]">
                  <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 border-t pt-6">
            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white" disabled={loading}>
              {loading ? 'সেভ হচ্ছে...' : (isEdit ? 'আপডেট করুন' : 'তৈরি করুন')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>বাতিল</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminDashboard;
