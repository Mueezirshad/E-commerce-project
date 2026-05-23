"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // 1. Link component import kiya
import axios from "axios";



export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: ""
});

    useEffect(() => {
  axios
    .get("https://dummyjson.com/products?limit=0")
    .then((response) => {
      setProducts(response.data.products);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
}, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-600">
        Products Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-3xl font-black tracking-wider text-slate-800 cursor-pointer select-none">
            Bazaar
          </div>

          <div className="flex-1 max-w-2xl mx-2 md:mx-6">
            <div className="relative flex items-center border-2 border-slate-800 rounded-md bg-white overflow-hidden focus-within:border-cyan-500 transition-colors">
              <input
                type="text"
                placeholder="Find Cars, Mobile Phones and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-slate-800 text-white px-5 py-2.5 hover:bg-slate-700 transition-colors font-bold text-sm">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
         {user ? (
  <div className="flex items-center gap-2">
    
    {/* profile circle */}
    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold uppercase">
      {user.name?.charAt(0)}
    </div>

    <div className="text-xs leading-tight">
      <p className="font-bold">{user.name}</p>
      <p className="text-gray-500">{user.email}</p>
    </div>

  </div>
) : (
  <button
    onClick={() => setShowLogin(true)}
    className="text-slate-800 font-bold underline"
  >
    Login
  </button>
)}
            <button onClick={() => setShowLogin(true)} className="relative inline-flex items-center justify-center font-bold px-5 py-1.5 rounded-full bg-white text-slate-800 border-4 border-t-yellow-400 border-r-cyan-400 border-b-blue-600 border-l-emerald-400 shadow-sm hover:shadow-md transition-all active:scale-95 text-sm uppercase tracking-wide">
              <span className="mr-1 text-lg font-extrabold">+</span> Sell
            </button>
          </div>
        
        
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            {searchQuery ? `Search results for "${searchQuery}"` : "Fresh recommendations"}
          </h1>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-lg">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                // 2. Card ko Link ke andar wrap kiya aur product.id dynamic pass ki
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className="bg-white border border-red-300 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between">
                    <div className="w-full h-48 bg-red-50 flex items-center justify-center p-2 relative">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                      {product.rating > 4.5 && (
                        <span className="absolute top-2 left-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-sm uppercase">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-100 flex-grow flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-yellow-400 text-slate-9900 mb-1">${product.price}</h2>
                        <p className="text-sm text-gray-700 line-clamp-1 font-medium hover:text-cyan-700">{product.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
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
      

       {showLogin && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 text-black">
    
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
      
      {/* Close Button */}
      <button
        onClick={() => setShowLogin(false)}
        className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black"
      >
        ×
      </button>

      <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
        Welcome Back
      </h2>

      {/* Inputs */}
      <div className="space-y-4">
        <input
  type="text"
  placeholder="Full Name"
  value={form.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })}
  className="w-full border border-gray-300 text-black rounded-lg px-4 py-3"
/>

<input
  type="email"
  placeholder="Email"
  value={form.email}
  onChange={(e) => setForm({ ...form, email: e.target.value })}
  className="w-full border border-gray-300 text-black rounded-lg px-4 py-3"
/>

<input
  type="password"
  placeholder="Password"
  value={form.password}
  onChange={(e) => setForm({ ...form, password: e.target.value })}
  className="w-full border border-gray-300 text-black rounded-lg px-4 py-3"
/>

        <button
  onClick={() => {
    setUser({
      name: form.name,
      email: form.email
    });

    setShowLogin(false);
    setForm({ name: "", email: "", password: "" });
  }}
  className="w-full bg-black text-white py-3 rounded-lg"
>
  Login
</button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3">
        
        <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
          Continue with Google
        </button>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Continue with Facebook
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}