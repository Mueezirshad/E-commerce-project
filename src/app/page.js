"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setisSignup] = useState(false);
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
    file: null, // default safe state
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
    axios
      .get("https://backend-my-api-ten.vercel.app/products")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
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
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        file: file, 
        profilePic: URL.createObjectURL(file) 
      });
    }
  };

  const handleSignup = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return Swal.fire({
        title: '⚠️ Fields Required!',
        text: 'Bhai, saari fields bharna zaroori hai. Koi bhi jagah khali mat choro!',
        icon: 'warning',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#eab308' 
      });
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);

    if (form.file) {
      formData.append("profilePic", form.file);
    }

    try {
      const response = await axios.post("https://backend-my-api-ten.vercel.app/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        Swal.fire({
          title: '🎉 Registration Successful!',
          text: `Congratulations! Account created Successfully, Now you can login your Account.`,
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#9333ea', 
          timer: 3000,
          timerProgressBar: true
        });
        setisSignup(false);
        setForm({ name: "", email: form.email, password: "", profilePic: null, file: null });
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      wal.fire({
        title: '⚠️ Registration Failed!',
        text: err.response?.data?.message || "Something went wrong, Please check all fields!",
        icon: 'error',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Login handler
  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim())
      return
    try {
      const response = await axios.post("https://backend-my-api-ten.vercel.app/login", {
        email: form.email,
        password: form.password,
      });

      if (response.data.success) {
        const loggedInUser = response.data.user;

        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setShowLogin(false);
        setForm({ name: "", email: "", password: "", profilePic: null, file: null });
        Swal.fire({
          title: '🔓 Logged In!',
          text: `Welcome back, ${loggedInUser.name || 'User'}! Now can Purchase any thing.`,
          icon: 'success',
          background: '#1e293b', 
          color: '#fff',
          confirmButtonColor: '#22c55e', 
          timer: 2500,
          timerProgressBar: true
        });
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      Swal.fire({
        title: '❌ Login Failed!',
        text: err.response?.data?.message || "Invalid credentials",
        icon: 'error',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444' 
            });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setShowProfileMenu(false);
    Swal.fire({
      title: '🚪 Logged Out!',
      text: 'You Are Successfully logged out!',
      icon: 'success',
      background: '#1e293b', 
      color: '#fff',
      showConfirmButton: false,
      timer: 1500,       timerProgressBar: true
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

      <header className={`border-b sticky top-0 z-50 shadow-sm px-4 py-3 transition-colors duration-300 ${darkMode ? "bg-slate-900/90 border-slate-800 backdrop-blur" : "bg-purple-50/95 border-purple-200 backdrop-blur"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          <div className="flex items-center shrink-0 z-10 pointer-events-none">
            <div className="relative h-14 w-60 md:h-20 md:w-72 -my-3 -ml-2 md:-ml-20 overflow-visible">
              <Image
                src="/logo.svg"
                alt="VanishMart Logo"
                fill
                priority
                className="object-contain object-left scale-[5.9] origin-left cursor-default"
              />
            </div>
          </div>

          <div className="flex-1 max-w-2xl pl-6 md:pl-12 my-4 mx-2 md:mx-6 z-20 relative">
            <div className={`relative flex items-center border-2 rounded-xl overflow-hidden transition-all ${darkMode
              ? "border-slate-700 bg-slate-800 focus-within:border-purple-500 shadow-inner"
              : "border-purple-200 bg-white focus-within:border-purple-600"
              }`}>
              <input
                type="text"
                placeholder="Find Cars, Mobile Phones and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-5 py-3.5 text-sm focus:outline-none bg-transparent transition-colors ${darkMode ? "text-white placeholder-slate-400" : "text-gray-800 placeholder-gray-400"
                  }`}
              />
              <button className={`px-5 py-3.5 font-bold text-sm transition-colors shrink-0 ${darkMode ? "bg-purple-600 text-white hover:bg-purple-500" : "bg-purple-900 text-white hover:bg-purple-800"
                }`}>
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 z-20 relative">

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all text-lg border ${darkMode ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-purple-100 border-purple-200 text-purple-900 hover:bg-purple-200"}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              /* Profile Menu Dropdown */
              <div className="relative" ref={profileMenuRef}>
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-full transition-all select-none ${darkMode ? "hover:bg-slate-800" : "hover:bg-purple-100"}`}
                >
                  {user.profilePic ? (
                    <Image
                      src={user.profilePic || "/default-avatar.png"} 
                      alt="profile"
                      width={36} 
                      height={36} 
                      unoptimized={true}
                      className="rounded-full object-cover border-2 border-purple-500"
                    />

                  ) : (
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold uppercase">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold hidden sm:inline-block max-w-[80px] truncate">{user.name}</span>
                </div>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-3 w-64 rounded-xl shadow-xl border py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-purple-100 text-slate-800"}`}>
                    <div className="px-4 py-3 border-b border-gray-100/10 flex flex-col items-center text-center">
                      {user.profilePic ? (
                        <Image
                          src={user.profilePic || "/default-avatar.png"} 
                          alt="profile"
                          width={64} 
                          height={64} 
                          unoptimized={true} 
                          className="rounded-full object-cover mb-2 border-2 border-purple-500"
                        />

                      ) : (
                        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-2xl uppercase mb-2">
                          {user.name?.charAt(0)}
                        </div>
                      )}
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate w-full">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold hover:bg-red-50/50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        🚪 Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className={`font-bold text-sm underline ${darkMode ? "text-purple-300" : "text-purple-900"}`}
              >
                Login
              </button>
            )}

            <button
              onClick={() => {
                if (!user) {
                  setShowLogin(true);
                } else {
                  Swal.fire({
                    title: '🚀 Ready to Sell!',
                    text: 'Bhai, apna custom item add karne ke liye flow open ho raha hai!',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#9333ea', 
                    timer: 2000,
                    timerProgressBar: true
                  });
                }
              }}
              className="relative inline-flex items-center justify-center font-extrabold px-6 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-md hover:shadow-purple-500/20 transition-all transform active:scale-95 text-xs uppercase tracking-wider group"
            >
              <span className="mr-1.5 text-base font-black transform group-hover:rotate-90 transition-transform duration-200">+</span>
              Sell
            </button>
          </div>
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            {searchQuery ? `Search results for "${searchQuery}"` : "Fresh recommendations"}
          </h1>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-lg">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-between ${darkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-gray-200"}`}>
                    <div className={`w-full h-48 flex items-center justify-center p-2 relative ${darkMode ? "bg-slate-700/50" : "bg-purple-50/30"}`}>

                      <div className="relative w-full h-full min-h-[150px]"> {/* Image ko sahi space dene ke liye wrapper div zaroori hai */}
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized={true} 
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="p-3 border-t border-transparent flex-grow flex flex-col justify-between">
                      <div>
                        <h2 className={`text-xl font-bold mb-1 ${darkMode ? "text-purple-300" : "text-slate-900"}`}>${product.price}</h2>
                        <p className={`text-sm line-clamp-1 font-medium ${darkMode ? "text-slate-200 hover:text-purple-400" : "text-gray-700 hover:text-purple-700"}`}>{product.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{product.description}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-100/10 flex justify-between items-center text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                        <span>{product.category}</span>
                        <span className="text-amber-500 font-bold">★ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 relative border max-h-[90vh] overflow-y-auto transition-all ${darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-black border-purple-100"}`}>

            <button
              onClick={() => {
                setShowLogin(false);
                setisSignup(false);
                setForm({ name: "", email: "", password: "", profilePic: null, file: null });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>

            <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-center text-sm text-gray-400 mb-6">
              {isSignup ? "Join VanishMart today to start trading." : "Sign in to access your personal dashboard."}
            </p>

            <div className="space-y-4">

              {isSignup && (
                <div className="flex flex-col items-center gap-2 mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Profile Picture (Preview)</label>
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all bg-gray-50/5 border-gray-300">
                      {form.profilePic ? (
                        <Image
                          src={form.profilePic}
                          alt="preview"
                          fill
                          unoptimized={true} 
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-gray-400">+</span>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              )}

              {isSignup && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Email Address</label>
                <input
                  type="type"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
                />
              </div>

              <button
                onClick={isSignup ? handleSignup : handleLogin}
                className={`w-full text-white py-3.5 rounded-xl font-bold tracking-wide transition-all text-sm mt-2 shadow-md hover:opacity-90 ${darkMode ? "bg-purple-600" : "bg-purple-900"}`}
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </div>

            <div className="text-center mt-6 text-sm text-gray-400">
              {isSignup ? (
                <p>Already have an account? <button onClick={() => setisSignup(false)} className={`font-bold hover:underline ml-1 ${darkMode ? "text-purple-400" : "text-purple-900"}`}>Log In</button></p>
              ) : (
                <p>New to VanishMart? <button onClick={() => setisSignup(true)} className={`font-bold hover:underline ml-1 ${darkMode ? "text-purple-400" : "text-purple-900"}`}>Create account</button></p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}