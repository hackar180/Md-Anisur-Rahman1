
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from "sonner";
import { BookOpen, User, Mail, Lock, Phone } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user profile in Firestore if new
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: '',
          role: 'student',
          createdAt: new Date().toISOString(),
          enrolledCourses: [],
          progress: {}
        });
      }

      toast.success("সফলভাবে লগইন হয়েছে!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("গুগল লগইন ব্যর্থ হয়েছে।");
      console.error(error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName: name,
        phoneNumber: phone,
        role: 'student',
        createdAt: new Date().toISOString(),
        enrolledCourses: [],
        progress: {}
      });

      toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Register Error Details:", error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error("ইমেইল/পাসওয়ার্ড রেজিস্ট্রেশন এখনো সক্রিয় হয়নি। দয়া করে গুগল দিয়ে চেষ্টা করুন।");
      } else {
        toast.error("রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-emerald-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-emerald-100">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-emerald-700 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-900">রেজিস্ট্রেশন করুন</CardTitle>
          <CardDescription>নতুন অ্যাকাউন্ট তৈরি করতে নিচের তথ্যগুলো দিন</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">সম্পূর্ণ নাম</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="আপনার নাম" 
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  placeholder="017XXXXXXXX" 
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="কমপক্ষে ৬ অক্ষরের"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              disabled={loading}
            >
              {loading ? "প্রসেসিং..." : "রেজিস্ট্রেশন করুন"}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">অথবা</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              className="w-full h-12 border-emerald-600 text-emerald-900 hover:bg-emerald-50 font-bold text-lg shadow-sm"
              onClick={handleGoogleLogin}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="mr-3 h-6 w-6" />
              গুগল দিয়ে রেজিস্ট্রেশন করুন (সহজ পদ্ধতি)
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ইতিমধ্যেই অ্যাকাউন্ট আছে?{" "}
              <Link to="/login" className="text-emerald-700 font-bold hover:underline">
                লগইন করুন
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
