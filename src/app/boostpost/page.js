"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Swal from "sweetalert2";

export default function BoostPostPage() {
    const router = useRouter();
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyProducts = async () => {
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

                // 3. Backend se saari products get karna
                const response = await axios.get("https://backend-my-api-ten.vercel.app/api/products", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const allProducts = response.data.products || response.data;

                // 4. Token se nikli hui MongoDB ID aur product ki userId match karke filter karna
                if (currentUserId) {
                    const filtered = allProducts.filter(prod => prod.userId === currentUserId);
                    setMyProducts(filtered);
                } else {
                    setMyProducts([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching ads:", error);
                setLoading(false);
            }
        };

        fetchMyProducts();
    }, [router]);

    const handleSelectPost = (productId) => {
        localStorage.setItem("boost_product_id", productId);
        router.push("/pricing");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white font-bold text-lg">
                Loading your ads...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
                        🚀 SELECT AN AD TO BOOST
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Apni un posts ko select karein jise aap premium banana chahte hain.</p>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold uppercase transition-all"
                >
                    ⬅ Back to Home
                </button>
            </div>

            {myProducts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-[#1e1e1e]/50">
                    <p className="text-zinc-500 text-lg">Aapne abhi tak koi ad post nahi kiya hai!</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-5 py-2 bg-purple-600 rounded-lg font-bold text-sm hover:bg-purple-700"
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
                            className="group relative border border-zinc-800 bg-[#1e1e1e] rounded-xl overflow-hidden cursor-pointer hover:border-purple-500 shadow-md hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="h-44 w-full relative bg-zinc-900">
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
                                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">
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