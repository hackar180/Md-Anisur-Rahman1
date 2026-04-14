
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from "sonner";
import { BookOpen, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("সফলভাবে লগইন হয়েছে!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("গুগল লগইন ব্যর্থ হয়েছে।");
      console.error(error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("সফলভাবে লগইন হয়েছে!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error Details:", error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error("ইমেইল/পাসওয়ার্ড লগইন এখনো সক্রিয় হয়নি। দয়া করে গুগল দিয়ে লগইন করুন অথবা কনসোল চেক করুন।");
      } else {
        toast.error("লগইন করতে সমস্যা হয়েছে। ইমেইল বা পাসওয়ার্ড চেক করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-emerald-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-emerald-100">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-emerald-700 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-900">লগইন করুন</CardTitle>
          <CardDescription>আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Link to="/forgot-password" size="sm" className="text-xs text-emerald-700 hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              {loading ? "প্রসেসিং..." : "লগইন"}
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
              গুগল দিয়ে লগইন করুন (সুপারিশকৃত)
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              অ্যাকাউন্ট নেই?{" "}
              <Link to="/register" className="text-emerald-700 font-bold hover:underline">
                রেজিস্ট্রেশন করুন
              </Link>
            </p>

            {/* Debug Info for User */}
            <div className="mt-8 pt-4 border-t border-emerald-100">
              <p className="text-[10px] text-center text-emerald-600/50 font-mono">
                Domain: {window.location.hostname}
              </p>
              <p className="text-[10px] text-center text-emerald-600/50 font-mono">
                Firebase Project ID: {auth.app.options.projectId}
              </p>
              <p className="text-[9px] text-center text-emerald-600/30 mt-1">
                (নিশ্চিত হোন যে ফায়ারবেস কনসোলে এই ডোমেইনটি 'Authorized domains' লিস্টে যোগ করা আছে)
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
