"use client";
import Image from 'next/image';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function LoginRegisterModal({ 
  showLogin, 
  setShowLogin, 
  isSignup, 
  setisSignup, 
  darkMode, 
  form, 
  setForm, 
  setUser 
}) {
  if (!showLogin) return null;

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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return Swal.fire({
        title: '⚠️ Fields Required!',
        text: 'Bhai, saari fields bharna zaroori hai!',
        icon: 'warning',
        background: '#1e293b', color: '#fff', confirmButtonColor: '#eab308' 
      });
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.file) formData.append("profilePic", form.file);

    try {
      const response = await axios.post("https://backend-my-api-ten.vercel.app/api/auth/register", formData);

      if (response.data) {
        Swal.fire({
          title: '🎉 Account Created!',
          text: 'Account ban gaya! Ab apna email aur password se login karein.',
          icon: 'success',
          background: '#1e293b', color: '#fff', confirmButtonColor: '#9333ea',
          timer: 3000, timerProgressBar: true
        });

        setisSignup(false);
        setForm({ name: "", email: form.email, password: "", profilePic: null, file: null });
      }
    } catch (err) {
      Swal.fire({
        title: '⚠️ Registration Failed!',
        text: err.response?.data?.message || "Something went wrong!",
        icon: 'error',
        background: '#1e293b', color: '#fff', confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) return;
    try {
      const response = await axios.post("https://backend-my-api-ten.vercel.app/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (response.data.token || response.data.success) {
        const loggedInUser = response.data.user;
        if(response.data.token) localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        
        setUser(loggedInUser);
        setShowLogin(false);
        setForm({ name: "", email: "", password: "", profilePic: null, file: null });
        
        Swal.fire({
          title: '🔓 Logged In!',
          text: `Welcome back, ${loggedInUser.name || 'User'}!`,
          icon: 'success',
          background: '#1e293b', color: '#fff', confirmButtonColor: '#22c55e', 
          timer: 2500, timerProgressBar: true
        });
      }
    } catch (err) {
      Swal.fire({
        title: '❌ Login Failed!',
        text: err.response?.data?.message || "Invalid credentials",
        icon: 'error',
        background: '#1e293b', color: '#fff', confirmButtonColor: '#ef4444' 
      });
    }
  };

  return (
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
          {isSignup ? "Join VanishMart today to start trading." : "Sign in to access your dashboard."}
        </p>

        <div className="space-y-4">
          {isSignup && (
            <div className="flex flex-col items-center gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Profile Picture</label>
              <div className="relative group cursor-pointer">
                <div className="relative w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all bg-gray-50/5 border-gray-300">
                  {form.profilePic ? (
                    <Image src={form.profilePic} alt="preview" fill unoptimized className="object-cover" />
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
              type="email"
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
  );
}