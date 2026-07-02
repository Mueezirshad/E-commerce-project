"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Swal from "sweetalert2";

export default function BoostPostPage() {
    const router = useRouter();
    const [myProducts, setMyProducts] = useState([]);
    
    const [loading, setLoading] = useState(true); 
    const [darkMode, setDarkMode] = useState(true);

    const fetchMyProducts = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: "Please login first to boost your ads!",
                    background: "#1e1e1e",
                    color: "#fff",
                    confirmButtonColor: "#7c3aed"
                });
                router.push("/");
                return;
            }

            let currentUserId = null;
            try {
                const base64Url = token.split(".")[1]; 
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );

                const decoded = JSON.parse(jsonPayload);
                currentUserId = decoded.id || decoded._id || decoded.userId;
            } catch (err) {
                console.error("Token decode karne mein error:", err);
            }

            const response = await axios.get("https://backend-my-api-ten.vercel.app/api/products", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const allProducts = response.data.products || response.data;

            if (currentUserId) {
                const filtered = allProducts.filter(prod => prod.userId === currentUserId);
                setMyProducts(filtered);
            } else {
                setMyProducts([]);
            }

        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    // ⚡ FIX 2: ESLint compliance ke liye async self-invoking function use kiya call ke liye
    useEffect(() => {
        const syncTheme = () => {
            const savedTheme = localStorage.getItem("darkMode");
            const isDark = savedTheme !== null ? savedTheme === "true" : true;
            setDarkMode(isDark);
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        syncTheme();

        const loadData = async () => {
            await fetchMyProducts();
        };
        
        loadData();

        const handlePageShow = async (e) => {
            if (e.persisted) {
                setLoading(true);
                await fetchMyProducts();
            }
            syncTheme();
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [fetchMyProducts]);

    const handleSelectPost = (productId) => {
        localStorage.setItem("boost_product_id", productId);
        router.push("/pricing");
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-bold text-lg transition-colors duration-300 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-800"}`}>
                <div className="flex flex-col items-center gap-2">
                    <span className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"></span>
                    Loading your ads...
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-slate-800"} p-4 md:p-8`}>
            <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b pb-4 ${darkMode ? "border-slate-800" : "border-purple-200"}`}>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
                        🚀 SELECT AN AD TO BOOST
                    </h1>
                    <p className={`text-xs md:text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>Apni un posts ko select karein jise aap premium banana chahte hain.</p>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className={`w-full sm:w-auto text-center px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-purple-100 hover:bg-purple-200 text-purple-900"}`}
                >
                    ⬅ Back to Home
                </button>
            </div>

            {myProducts.length === 0 ? (
                <div className={`text-center py-20 border border-dashed rounded-2xl ${darkMode ? "border-slate-800 bg-slate-800/50" : "border-purple-200 bg-white"}`}>
                    <p className={`text-lg ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>Aapne abhi tak koi ad post nahi kiya hai!</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-5 py-2 bg-purple-600 rounded-lg font-bold text-sm hover:bg-purple-700 text-white"
                    >
                        Post an Item Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myProducts.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => handleSelectPost(product._id)}
                            className={`group relative border rounded-xl overflow-hidden cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-1 ${darkMode ? "border-slate-800 bg-slate-800 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]" : "border-purple-200 bg-white hover:border-purple-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]"}`}
                        >
                            <div className={`h-44 w-full relative ${darkMode ? "bg-slate-900" : "bg-purple-50/30"}`}>
                                <Image
                                    src={product.thumbnail || product.imageUrl}
                                    alt={product.title || "Product Image"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    width={400} 
                                    height={176}
                                    unoptimized
                                />
                                <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-purple-400 text-[10px] font-black uppercase px-2 py-1 rounded">
                                    Your Ad
                                </span>
                            </div>

                            <div className="p-4">
                                <h3 className={`font-bold text-sm line-clamp-1 transition-colors ${darkMode ? "text-slate-100 group-hover:text-purple-400" : "text-slate-800 group-hover:text-purple-700"}`}>
                                    {product.title}
                                </h3>
                                <p className="text-purple-500 font-black text-base mt-1">
                                    Rs {product.price}
                                </p>
                                <div className="mt-4 w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white text-center py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                                    ⚡ Click to Boost
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}