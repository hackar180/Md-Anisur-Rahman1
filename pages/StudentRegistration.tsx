
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { toast } from "sonner";
import { BookOpen, User, Phone, MapPin, Calendar, Clock, Image as ImageIcon, Send } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const StudentRegistration: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    address: '',
    contact: '',
    age: '',
    photoUrl: '',
    preferredTime: '',
    preferredMonth: '',
    preferredYear: '২০২৪'
  });
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [regCount, setRegCount] = React.useState(0);

  const TELEGRAM_BOT_TOKEN = '8204047638:AAGd_6HXDMdcgAI9HaDK24xF4Hy__myIo2s';
  const TELEGRAM_CHAT_ID = '6188753813';

  React.useEffect(() => {
    const fetchCount = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'stats', 'registrations'));
        if (docSnap.exists()) {
          setRegCount(docSnap.data().count || 0);
        }
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };
    fetchCount();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Base64 encoding increases size by ~33%. 
      // Firestore limit is 1MB. 600KB * 1.33 = ~800KB (safe margin)
      if (file.size > 600 * 1024) { 
        toast.error("ছবির সাইজ ৬০০ কিলোবাইটের কম হতে হবে।");
        return;
      }
      setPhotoFile(file);
      
      // Convert to Base64 for Firestore storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToTelegram = async (data: any, file: File | null) => {
    const caption = `
🆕 নতুন স্টুডেন্ট রেজিস্ট্রেশন!
━━━━━━━━━━━━━━━━━━
👤 নাম: ${data.name}
📍 ঠিকানা: ${data.address}
📞 কন্টাক্ট: ${data.contact}
🎂 বয়স: ${data.age}
⏰ ক্লাসের সময়: ${data.preferredTime}
📅 মাস: ${data.preferredMonth}
🗓️ বছর: ${data.preferredYear}
━━━━━━━━━━━━━━━━━━
`;
    try {
      if (file) {
        const tgFormData = new FormData();
        tgFormData.append('chat_id', TELEGRAM_CHAT_ID);
        tgFormData.append('photo', file);
        tgFormData.append('caption', caption);
        tgFormData.append('parse_mode', 'HTML');

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: tgFormData
        });
      } else {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: caption,
            parse_mode: 'HTML'
          })
        });
      }
    } catch (error) {
      console.error("Telegram error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Save to Firestore
      try {
        await addDoc(collection(db, 'student_registrations'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'student_registrations');
      }

      // 2. Update Count
      try {
        const newCount = regCount + 1;
        await setDoc(doc(db, 'stats', 'registrations'), { count: newCount }, { merge: true });
        setRegCount(newCount);
      } catch (err) {
        // Non-critical if count fails, but we log it
        console.error("Stats update failed:", err);
      }

      // 3. Send to Telegram (Non-blocking for UI success)
      sendToTelegram(formData, photoFile).catch(err => console.error("Telegram error:", err));

      toast.success("রেজিস্ট্রেশন সফল হয়েছে! আমরা আপনার সাথে যোগাযোগ করব।");
      setFormData({
        name: '',
        address: '',
        contact: '',
        age: '',
        photoUrl: '',
        preferredTime: '',
        preferredMonth: '',
        preferredYear: '২০২৪'
      });
      setPhotoFile(null);
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error.includes('Missing or insufficient permissions')) {
            errorMessage = "ডাটাবেসে সেভ করার অনুমতি নেই। অ্যাডমিনকে জানান।";
          } else if (parsed.error.includes('too large')) {
            errorMessage = "ছবির সাইজ অনেক বড় হয়ে গেছে। ছোট ছবি ব্যবহার করুন।";
          }
        } catch (e) {
          // Not a JSON error
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900">স্টুডেন্ট রেজিস্ট্রেশন ফরম</h1>
          <p className="text-emerald-700 font-medium">
            বর্তমানে মোট <span className="text-amber-600 text-xl font-bold">{regCount}</span> জন শিক্ষার্থী রেজিস্ট্রেশন করেছেন
          </p>
        </div>

        <Card className="shadow-xl border-emerald-100">
          <CardHeader className="bg-emerald-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              আপনার তথ্য প্রদান করুন
            </CardTitle>
            <CardDescription className="text-emerald-100">সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন।</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><User className="h-4 w-4" /> নাম</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="আপনার পূর্ণ নাম" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> কন্টাক্ট নাম্বার</Label>
                  <Input 
                    value={formData.contact} 
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                    placeholder="০১৭XXXXXXXX" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> ঠিকানা</Label>
                <Input 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="গ্রাম, থানা, জেলা" 
                  required 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">বয়স</Label>
                  <Input 
                    type="number"
                    value={formData.age} 
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    placeholder="আপনার বয়স" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> আপনার ছবি আপলোড করুন</Label>
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer file:bg-emerald-50 file:text-emerald-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 hover:file:bg-emerald-100 transition-colors"
                  />
                  {photoFile && <p className="text-xs text-emerald-600">ছবি সিলেক্ট করা হয়েছে: {photoFile.name}</p>}
                </div>
              </div>

              <div className="border-t border-emerald-50 pt-6">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" /> ক্লাসের সময় ও তারিখ পছন্দ করুন
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>পছন্দের সময়</Label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.preferredTime}
                      onChange={e => setFormData({...formData, preferredTime: e.target.value})}
                      required
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="সকাল (৮:০০ - ১০:০০)">সকাল (৮:০০ - ১০:০০)</option>
                      <option value="দুপুর (২:০০ - ৪:০০)">দুপুর (২:০০ - ৪:০০)</option>
                      <option value="রাত (৮:০০ - ১০:০০)">রাত (৮:০০ - ১০:০০)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>মাস</Label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.preferredMonth}
                      onChange={e => setFormData({...formData, preferredMonth: e.target.value})}
                      required
                    >
                      <option value="">মাস</option>
                      {['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>বছর</Label>
                    <Input 
                      value={formData.preferredYear} 
                      onChange={e => setFormData({...formData, preferredYear: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg font-bold"
                disabled={loading}
              >
                {loading ? "প্রসেসিং..." : <><Send className="h-5 w-5 mr-2" /> রেজিস্ট্রেশন সম্পন্ন করুন</>}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistration;
