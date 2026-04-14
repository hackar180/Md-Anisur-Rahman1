
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  Award, 
  Clock, 
  CheckCircle2, 
  PlayCircle,
  Calendar,
  Settings,
  Bell
} from 'lucide-react';
import { UserProfile, Course } from '../types';
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [enrolledCourses, setEnrolledCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Profile Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(user.displayName);
  const [editPhone, setEditPhone] = React.useState(user.phoneNumber || '');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setEditName(user.displayName);
    setEditPhone(user.phoneNumber || '');
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: editName,
        phoneNumber: editPhone,
        uid: user.uid,
        email: user.email,
        role: user.role || 'student',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      setIsEditDialogOpen(false);
      // Note: App.tsx has onAuthStateChanged which will pick up the firestore change
      // but we might need a manual refresh or state update if it's slow
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user.enrolledCourses || user.enrolledCourses.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'courses'), where('__name__', 'in', user.enrolledCourses));
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setEnrolledCourses(coursesData);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user.enrolledCourses]);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">আসসালামু আলাইকুম, {user.displayName}!</h1>
            <p className="text-muted-foreground">আপনার ড্যাশবোর্ডে স্বাগতম। আপনার অগ্রগতি ট্র্যাক করুন।</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-emerald-100 text-emerald-900 bg-white">
              <Bell className="h-4 w-4 mr-2" />
              নোটিফিকেশন
            </Button>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger render={
                <Button className="bg-emerald-700 text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  প্রোফাইল এডিট
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleUpdateProfile}>
                  <DialogHeader>
                    <DialogTitle>প্রোফাইল এডিট করুন</DialogTitle>
                    <DialogDescription>
                      আপনার নাম এবং ফোন নম্বর পরিবর্তন করতে পারেন।
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">নাম</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">ফোন</Label>
                      <Input
                        id="phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="col-span-3"
                        placeholder="০১৭XXXXXXXX"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-emerald-700 text-white" disabled={isSaving}>
                      {isSaving ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-emerald-50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ভর্তি হওয়া কোর্স</CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{user.enrolledCourses?.length || 0}টি</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">সম্পন্ন করা ক্লাস</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">১২টি</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">অর্জিত সার্টিফিকেট</CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">০টি</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-8">
          <TabsList className="bg-white border border-emerald-100 p-1">
            <TabsTrigger value="courses" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">আমার কোর্সসমূহ</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">অ্যাসাইনমেন্ট</TabsTrigger>
            <TabsTrigger value="exams" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">পরীক্ষা</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-8">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map(i => <Card key={i} className="h-48 animate-pulse bg-emerald-50/50" />)}
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {enrolledCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden border-emerald-50 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-40 h-40 shrink-0">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 flex-grow space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-emerald-900">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>অগ্রগতি</span>
                            <span>{user.progress?.[course.id] || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-700 transition-all duration-500" 
                              style={{ width: `${user.progress?.[course.id] || 0}%` }}
                            />
                          </div>
                        </div>
                        <Button className="w-full bg-emerald-700 text-white" asChild>
                          <Link to={`/courses/${course.id}`}>ক্লাস শুরু করুন</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-emerald-200">
                <PlayCircle className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-900">আপনি এখনো কোনো কোর্সে ভর্তি হননি</h3>
                <p className="text-muted-foreground mb-6">নতুন কিছু শিখতে আমাদের কোর্সসমূহ দেখুন।</p>
                <Button className="bg-emerald-700 text-white" asChild>
                  <Link to="/courses">কোর্সসমূহ দেখুন</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments">
            <Card className="border-emerald-50">
              <CardHeader>
                <CardTitle>চলমান অ্যাসাইনমেন্ট</CardTitle>
                <CardDescription>আপনার কোর্সগুলোর জন্য নির্ধারিত কাজগুলো এখানে পাবেন।</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>বর্তমানে কোনো অ্যাসাইনমেন্ট নেই।</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams">
            <Card className="border-emerald-50">
              <CardHeader>
                <CardTitle>পরীক্ষার সময়সূচী</CardTitle>
                <CardDescription>আসন্ন পরীক্ষাগুলোর তালিকা এখানে দেখুন।</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>বর্তমানে কোনো পরীক্ষা নির্ধারিত নেই।</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
