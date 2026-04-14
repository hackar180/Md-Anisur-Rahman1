
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Phone,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface NavbarProps {
  user: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState('');

  React.useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          setLogoUrl(docSnap.data().logoUrl || '');
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'রেজিস্ট্রেশন', path: '/registration' },
    { name: 'আমাদের সম্পর্কে', path: '/#about' },
    { name: 'যোগাযোগ', path: '/#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="bg-emerald-700 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-amber-400" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-bold text-emerald-900 leading-tight">আল হেরা রহিমা আক্তার</span>
            <span className="text-xs font-medium text-emerald-700">ইসলামিক অনলাইন মহিলা মাদ্রাসা</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-sm font-medium text-emerald-900 hover:text-emerald-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="tel:01721003234" 
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium text-sm"
          >
            <Phone className="h-5 w-5" />
            <span>কল করুন</span>
          </a>
          <a 
            href="https://wa.me/8801721003234" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium text-sm"
          >
            <MessageCircle className="h-5 w-5" />
            <span>হোয়াটসঅ্যাপ</span>
          </a>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger 
                render={
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-emerald-100">
                      <AvatarImage src="" alt={user.displayName} />
                      <AvatarFallback className="bg-emerald-700 text-white">
                        {user.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">ড্যাশবোর্ড</Link>
                </DropdownMenuItem>
                {user?.email === 'bangladesasenabahini435@gmail.com' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">অ্যাডমিন প্যানেল</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>লগ আউট</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="text-emerald-900">
                <Link to="/login">লগইন</Link>
              </Button>
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-white" asChild>
                <Link to="/register">রেজিস্ট্রেশন</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          {user && (
            <Link to="/dashboard">
              <Avatar className="h-8 w-8 border border-emerald-100">
                <AvatarFallback className="bg-emerald-700 text-white text-xs">
                  {user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger 
              render={
                <Button variant="ghost" size="icon" className="text-emerald-900">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-12 items-center text-center">
                <div className="flex flex-col gap-4 w-full">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-semibold text-emerald-900 hover:text-emerald-700 py-3 border-b border-emerald-50"
                    >
                      {link.name}
                    </Link>
                  ))}
                  {user?.email === 'bangladesasenabahini435@gmail.com' && (
                    <Link 
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-bold text-amber-600 hover:text-amber-700 py-3 border-b border-emerald-50 bg-amber-50 rounded-lg"
                    >
                      অ্যাডমিন প্যানেল (কোর্স এড করুন)
                    </Link>
                  )}
                </div>
                {!user ? (
                  <div className="flex flex-col gap-4 w-full pt-4">
                    <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="h-12 text-lg border-emerald-700 text-emerald-700">
                      <Link to="/login">লগইন</Link>
                    </Button>
                    <Button className="bg-emerald-700 text-white h-12 text-lg" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/register">রেজিস্ট্রেশন</Link>
                    </Button>
                  </div>
                ) : (
                  <Button variant="destructive" onClick={handleLogout} className="w-full h-12 text-lg mt-4">
                    লগ আউট
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
