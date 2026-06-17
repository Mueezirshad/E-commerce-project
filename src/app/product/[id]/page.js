"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("loggedInUser");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  }); 

  const [darkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode");
      return savedTheme !== null ? savedTheme === "true" : true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!params?.id) return;

    axios
      .get("https://backend-my-api-ten.vercel.app/api/products")
      .then((response) => {
        const foundProduct = (response.data.products || []).find(
          (p) => p._id === params.id
        );
        setProduct(foundProduct || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [params?.id]);

  const formatWhatsAppNumber = (phone) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("92")) return digits;
    if (digits.startsWith("0")) return `92${digits.slice(1)}`;
    return digits;
  };

  const handleWhatsAppClick = () => {
    if (!user) {
    Swal.fire({
      title: '⚠️ Access Denied!',
      text: 'Please Login or Register first to contact the seller!',
      icon: 'warning',
      background: '#1e293b', // Dark background (Tailwind slate-800)
      color: '#fff',
      confirmButtonColor: '#9333ea', // VanishMart Purple Theme
    });
    return;
    }

    const phoneNumber = formatWhatsAppNumber(product?.phoneNumber || product?.phone);
    if (!phoneNumber) {
      Swal.fire({
        title: "⚠️ No Contact Number!",
        text: "This seller has not provided a phone number.",
        icon: "warning",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    const message = `Salam, I am interested in buying your product: *${product?.title}* listed for *Rs. ${product?.price}*. Is it still available?`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleActionClick = (actionType) => {
    if (!user) {
    Swal.fire({
      title: '🔒 Feature Locked!',
      text: `You must be logged in to ${actionType.toLowerCase()} this item!`,
      icon: 'error',
      background: '#1e293b',
      color: '#fff',
      confirmButtonColor: '#ef4444', // Red button for error
    });
    return;
  }

  Swal.fire({
    title: '🎉 Success!',
    text: `Proceeding to ${actionType.toLowerCase()} flow for "${product?.title}".`,
    icon: 'success',
    background: '#1e293b',
    color: '#fff',
    confirmButtonColor: '#22c55e', // Green button for success
    timer: 2500, // 2.5 seconds baad khud gayab ho jayega
    timerProgressBar: true
  });
};

  // Loading state
  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen text-xl font-semibold ${darkMode ? "bg-slate-900 text-white" : "bg-purple-50 text-purple-900"}`}>
        Loading Product Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen text-lg ${darkMode ? "bg-slate-900 text-white" : "bg-purple-50 text-purple-900"}`}>
        <p>Product not found!</p>
        <button onClick={() => router.push("/")} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm">Go Back Home</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-purple-50/30 text-slate-800"}`}>

      {/* MINI PREMIUM HEADER */}
      <nav className={`border-b px-6 py-4 flex justify-between items-center transition-colors duration-300 ${darkMode ? "bg-slate-900/90 border-slate-800 backdrop-blur" : "bg-purple-50/95 border-purple-200 backdrop-blur"}`}>
        <div className="flex justify-between items-center gap-10">
          
          {/* ⬅️ Back Arrow */}
          <div 
            onClick={() => router.push("/")} 
            className={`text-2xl font-black tracking-wider cursor-pointer z-40 relative px-2 py-1 select-none ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-900 hover:text-purple-700"}`}
          >
            ←
          </div>

          {/* 🏷️ Logo Container */}
          <div className="relative h-14 w-60 md:h-20 md:w-72 -my-3 -ml-2 md:-ml-20 overflow-visible pointer-events-none">
            <Image
              src="/logo.svg"
              alt="VanishMart Logo"
              fill
              priority
              className="object-contain object-left scale-[3.9] origin-left cursor-default"
            />
          </div>

        </div>

        <div className="text-xs font-semibold opacity-60">
          {user ? `Logged in as: ${user.name}` : "🔴 Viewing as Guest"}
        </div>
      </nav>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        <div className={`border rounded-2xl p-6 flex items-center justify-center h-[400px] shadow-sm relative overflow-hidden transition-colors duration-300 ${darkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-purple-200/50"}`}>
          <Image
            src={product.thumbnail || "/logo.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={true}
            className="p-4 object-contain rounded-xl transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className={`border rounded-2xl p-6 shadow-md transition-colors duration-300 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-purple-100"}`}>

          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {product.category}
            </span>
            {product.rating != null && (
              <span className="text-amber-500 font-bold text-sm">★ {product.rating}</span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{product.title}</h1>
          <p className={`text-3xl font-black mb-6 ${darkMode ? "text-purple-300" : "text-purple-900"}`}>
            Rs. {product.price}
          </p>

          <hr className={`my-4 opacity-10 ${darkMode ? "bg-white" : "bg-black"}`} />

          <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Description</h3>
          <p className="text-sm leading-relaxed mb-6 opacity-80">{product.description}</p>

          <div className="space-y-3.5">

            <button
              onClick={() => handleActionClick("Purchase")}
              className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition-all text-sm shadow-md ${user
                  ? "bg-purple-600 hover:bg-purple-500 text-white active:scale-[0.99]"
                  : "bg-slate-700/40 text-gray-500 cursor-not-allowed border border-dashed border-slate-600"
                }`}
            >
              {user ? "🛒 Proceed to Purchase" : "🔒 Login to Purchase"}
            </button>

            <button
              onClick={() => {
                if (!user) {
                  handleActionClick("Sell");
                  return;
                }
                router.push("/?sell=1");
              }}
              className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition-all text-sm border ${user
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 active:scale-[0.99]"
                  : "border-slate-700 text-gray-600 cursor-not-allowed"
                }`}
            >
              {user ? "➕ Sell Your Custom Item" : "🔒 Login to Sell"}
            </button>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-700/30"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Or Contact Instantly</span>
              <div className="flex-1 h-px bg-gray-700/30"></div>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className={`w-full bg-[#25D366] text-white py-3.5 rounded-xl font-extrabold tracking-wide transition-all text-sm shadow-md shadow-[#25D366]/10 flex items-center justify-center gap-2 ${user ? "hover:bg-[#20ba5a] active:scale-[0.99]" : "opacity-50 cursor-not-allowed"
                }`}
            >
              <span>💬</span> {user ? "Chat with Seller on WhatsApp" : "🔒 Login to Chat on WhatsApp"}
            </button>

            {!user && (
              <p className="text-[11px] text-center text-rose-400 font-semibold mt-2 animate-pulse">
                * Features are locked. Please return to the homepage to log in or register.
              </p>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}