
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, ViewState } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Admin from './pages/Admin.tsx';
import Cart from './pages/Cart.tsx';
import Checkout from './pages/Checkout.tsx';

// ডিফল্ট কিছু পণ্য
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'মাশরুম টুথপেস্ট',
    description: 'দাঁত উজ্জ্বল ও মজবুত করে, মাড়ি শক্তিশালী করে এবং নিঃশ্বাসের দুর্গন্ধ দূর করে।',
    quantity: '১৫০ গ্রাম',
    pv: 70,
    dp: 140,
    mrp: 180,
    image: 'https://images.unsplash.com/photo-1559591937-e68fb33054f4?auto=format&fit=crop&q=80&w=400',
    category: 'Personal Care'
  },
  {
    id: '2',
    name: 'মডার্ণ নিম সোপ',
    description: 'জীবাণুমুক্ত করে, শরীরকে দুর্গন্ধমুক্ত রাখে এবং ত্বককে মসৃণ ও কোমল করে।',
    quantity: '১০০ গ্রাম',
    pv: 40,
    dp: 120,
    mrp: 150,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=400',
    category: 'Personal Care'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('সকল পণ্য');
  
  const PRODUCTS_KEY = 'mxn_final_database_v6';
  const CART_KEY = 'mxn_final_cart_v6';

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const OWNER_PHONE = "01614997405";

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'সকল পণ্য' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    // সরাসরি কার্ট পেজে নিয়ে যাওয়া হবে
    setView('cart');
    window.scrollTo(0, 0);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, cartQuantity: quantity } : item
    ));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    if(window.confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setCart(prev => prev.filter(item => item.id !== id));
    }
  };

  const deleteAllProducts = () => {
    if(window.confirm('আপনি কি নিশ্চিত যে ডাটাবেস থেকে সব পণ্য মুছে ফেলবেন? এটি আর ফিরিয়ে আনা যাবে না!')) {
      setProducts([]);
      setCart([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.cartQuantity, 0)} 
        setView={setView}
        onSearch={setSearchQuery}
        phone={OWNER_PHONE}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'home' && (
          <Home 
            products={filteredProducts} 
            addToCart={addToCart} 
            isSearching={searchQuery.length > 0}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}
        {view === 'cart' && (
          <Cart 
            cart={cart} 
            updateQuantity={updateCartQuantity} 
            removeFromCart={removeFromCart} 
            onCheckout={() => setView('checkout')}
            onBack={() => setView('home')}
          />
        )}
        {view === 'checkout' && (
          <Checkout 
            cart={cart} 
            onSuccess={() => { setCart([]); setView('home'); alert('অর্ডার সফলভাবে সাবমিট হয়েছে!'); }} 
            onCancel={() => setView('cart')}
          />
        )}
        {view === 'admin' && (
          <Admin 
            products={products} 
            onAdd={addProduct} 
            onUpdate={updateProduct}
            onDelete={deleteProduct} 
            onDeleteAll={deleteAllProducts}
          />
        )}
      </main>
    </div>
  );
};

export default App;
