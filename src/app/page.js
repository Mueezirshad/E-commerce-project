"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import Image from 'next/image';
import Swal from 'sweetalert2';

import SellProductModal from "./components/sellProducts";
import LoginRegisterModal from "./components/loginRegister";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setisSignup] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [user, setUser] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode");
      return savedTheme !== null ? savedTheme === "true" : true;
    }
    return true; 
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    file: null,
  });

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("darkMode", String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 🍃 Live MongoDB Backend Se Fresh Products Fetching
  useEffect(() => {
    axios
      .get("https://backend-my-api-ten.vercel.app/api/products")
      .then((response) => {
        setProducts(response.data.products || []);
        setLoading(false);
        console.log(`🚀 Data loaded from database via Express: ${response.data.source || 'MongoDB'}`);
      })
      .catch((err) => {
        console.error("Error fetching database products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      queueMicrotask(() => {
        setUser(JSON.parse(savedUser));
      });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sell") === "1" && user) {
      setShowSellModal(true);
      window.history.replaceState({}, "", "/");
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setUser(null);
    setShowProfileMenu(false);
    Swal.fire({
      title: '🚪 Logged Out!',
      text: 'You Are Successfully logged out!',
      icon: 'success',
      background: '#1e293b', color: '#fff', showConfirmButton: false, timer: 1500, timerProgressBar: true
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen text-xl font-semibold transition-colors duration-300 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600"}`}>
        Products Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-slate-800"}`}>

      {/* NAVBAR HEADER */}
      <header className={`border-b sticky top-0 z-50 shadow-sm px-4 py-3 transition-colors duration-300 ${darkMode ? "bg-slate-900/90 border-slate-800 backdrop-blur" : "bg-purple-50/95 border-purple-200 backdrop-blur"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          <div className="flex items-center shrink-0 z-10 pointer-events-none">
            <div className="relative h-14 w-60 md:h-20 md:w-72 -my-3 -ml-2 md:-ml-20 overflow-visible">
              <Image src="/logo.svg" alt="VanishMart Logo" fill priority className="object-contain object-left scale-[5.9] origin-left cursor-default" />
            </div>
          </div>

          <div className="flex-1 max-w-2xl pl-6 md:pl-12 my-4 mx-2 md:mx-6 z-20 relative">
            <div className={`relative flex items-center border-2 rounded-xl overflow-hidden transition-all ${darkMode ? "border-slate-700 bg-slate-800 focus-within:border-purple-500 shadow-inner" : "border-purple-200 bg-white focus-within:border-purple-600"}`}>
              <input
                type="text" placeholder="Find Cars, Mobile Phones and more..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-5 py-3.5 text-sm focus:outline-none bg-transparent transition-colors ${darkMode ? "text-white placeholder-slate-400" : "text-gray-800 placeholder-gray-400"}`}
              />
              <button className={`px-5 py-3.5 font-bold text-sm transition-colors shrink-0 ${darkMode ? "bg-purple-600 text-white hover:bg-purple-500" : "bg-purple-900 text-white hover:bg-purple-800"}`}>
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 z-20 relative">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all text-lg border ${darkMode ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-purple-100 border-purple-200 text-purple-900 hover:bg-purple-200"}`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-full transition-all select-none ${darkMode ? "hover:bg-slate-800" : "hover:bg-purple-100"}`}
                >
                  {user.profilePic ? (
                    <Image src={user.profilePic || "/default-avatar.png"} alt="profile" width={36} height={36} unoptimized className="rounded-full object-cover border-2 border-purple-500" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold uppercase">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold hidden sm:inline-block max-w-[80px] truncate">{user.name}</span>
                </div>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-3 w-64 rounded-xl shadow-xl border py-3 z-50 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-purple-100 text-slate-800"}`}>
                    <div className="px-4 py-3 border-b border-gray-100/10 flex flex-col items-center text-center">
                      {user.profilePic ? (
                        <Image src={user.profilePic || "/default-avatar.png"} alt="profile" width={64} height={64} unoptimized className="rounded-full object-cover mb-2 border-2 border-purple-500" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-2xl uppercase mb-2">
                          {user.name?.charAt(0)}
                        </div>
                      )}
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate w-full">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold hover:bg-red-50/50 rounded-lg flex items-center gap-2">
                        🚪 Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className={`font-bold text-sm underline ${darkMode ? "text-purple-300" : "text-purple-900"}`}>
                Login
              </button>
            )}

            <button
              onClick={() => {
                if (!user) {
                  Swal.fire({
                    title: '⚠️ Authentication Required!',
                    text: 'Bhai, naya item bechne se pehle Login karna lazmi hai!',
                    icon: 'warning',
                    background: '#1e293b', color: '#fff', confirmButtonColor: '#eab308'
                  }).then(() => {
                    setShowLogin(true);
                  });
                } else {
                  setShowSellModal(true);
                }
              }}
              className="relative inline-flex items-center justify-center font-extrabold px-6 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-md text-xs uppercase tracking-wider group transform active:scale-95 transition-all"
            >
              <span className="mr-1.5 text-base font-black transform group-hover:rotate-90 transition-transform duration-200">+</span>
              Sell
            </button>
          </div>
        </div>
      </header>

      {/* MAIN PRODUCTS SECTIONS */}
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            {searchQuery ? `Search results for "${searchQuery}"` : "Fresh recommendations"}
          </h1>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-lg">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product._id}`} key={product._id}>
                  <div className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-between ${darkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-gray-200"}`}>
                    <div className={`w-full h-48 flex items-center justify-center p-2 relative ${darkMode ? "bg-slate-700/50" : "bg-purple-50/30"}`}>
                      <div className="relative w-full h-full min-h-[150px]">
                        {/* 🌟 Database dynamic image rendering */}
                        <Image
                          src={product.thumbnail || "/logo.svg"}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="p-3 flex-grow flex flex-col justify-between">
                      <div>
                        <h2 className={`text-xl font-bold mb-1 ${darkMode ? "text-purple-300" : "text-slate-900"}`}>Rs. {product.price}</h2>
                        <p className={`text-sm line-clamp-1 font-medium ${darkMode ? "text-slate-200 hover:text-purple-400" : "text-gray-700 hover:text-purple-700"}`}>{product.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{product.description}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-100/10 flex justify-between items-center text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                        <span>{product.category}</span>
                        {(product.phoneNumber || product.phone) && (
                          <span className="text-purple-400 font-bold">📞 {product.phoneNumber || product.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 👑 CALLING EXTERNAL DB MODALS PROPERLY */}
      <LoginRegisterModal 
        showLogin={showLogin} setShowLogin={setShowLogin} 
        isSignup={isSignup} setisSignup={setisSignup} 
        darkMode={darkMode} form={form} setForm={setForm} setUser={setUser} 
      />

      <SellProductModal 
        showSellModal={showSellModal} setShowSellModal={setShowSellModal} 
        darkMode={darkMode} setProducts={setProducts} 
      />

    </div>
  );
}