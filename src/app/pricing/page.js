"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function PricingPage() {
    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState(null);

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    const plans = [
        {
            name: "Silver",
            price: 500,
            features: ["5 Featured Ads", "Basic Support", "7 Days Validity"],
            color: "from-gray-400 to-zinc-600",
            shadow: "shadow-zinc-500/20"
        },
        {
            name: "Gold",
            price: 1200,
            features: ["15 Featured Ads", "Priority Support", "15 Days Validity"],
            color: "from-amber-400 to-yellow-600",
            shadow: "shadow-yellow-500/20",
            popular: true
        },
        {
            name: "Platinum",
            price: 2500,
            features: ["Unlimited Ads", "24/7 Support", "30 Days Validity"],
            color: "from-purple-500 to-indigo-600",
            shadow: "shadow-purple-500/20"
        }
    ];

    const handlePlanSelection = async (planName) => {
        try {
            const token = localStorage.getItem("token");
            const boostProductId = localStorage.getItem("boost_product_id"); // Jo pichle page se save ki thi

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: "Please login first to buy a plan!",
                    background: "#1e1e1e",
                    color: "#fff",
                    confirmButtonColor: "#7c3aed"
                });
                router.push("/");
                return;
            }

            Swal.fire({
                title: "Processing...",
                text: "Connecting with our secure payment gateway",
                allowOutsideClick: false,
                background: "#1e1e1e",
                color: "#fff",
                didOpen: () => Swal.showLoading()
            });

            // Backend API call jahan Stripe checkout session banta hai
            const response = await axios.post(
                "https://backend-my-api-ten.vercel.app/api/payment/create-checkout-session",
                {
                    planName: planName.toLowerCase(), // e.g., "silver", "gold", "platinum"
                    productId: boostProductId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.url) {
                setRedirectUrl(response.data.url); // Stripe checkout par redirect (handled in effect)
            } else {
                Swal.fire("Error", "Session create nahi ho saka.", "error");
            }

        } catch (error) {
            console.error("Payment Error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Something went wrong",
                background: "#1e1e1e",
                color: "#fff",
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white py-16 px-4">
            {/* Header Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
                    🚀 UPGRADE TO PREMIUM
                </h1>
                <p className="text-zinc-400 mt-2 max-w-md mx-auto text-sm">
                    Apne ad ko boost karne ke liye behtareen plan select karein aur zyada customers tak pahuchein.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative border rounded-2xl p-8 bg-[#1e1e1e] transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between h-96
              ${plan.popular ? 'border-yellow-500 scale-105 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-zinc-800 hover:border-zinc-700'}
              ${plan.shadow}`}
                    >
                        {/* Most Popular Tag */}
                        {plan.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
                                Most Popular
                            </span>
                        )}

                        <div>
                            {/* Plan Name & Price */}
                            <h3 className={`text-2xl font-black text-transparent bg-clip-text bg-linear-to-r ${plan.color}`}>
                                {plan.name} Plan
                            </h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-black tracking-tight">Rs {plan.price}</span>
                                <span className="text-zinc-500 ml-1 text-sm font-medium">/one-time</span>
                            </div>

                            {/* Features List */}
                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-zinc-300">
                                        <svg className="h-5 w-5 text-purple-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dynamic Action Button */}
                        <button
                            onClick={() => handlePlanSelection(plan.name)}
                            className={`w-full mt-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all duration-300 cursor-pointer shadow-md transform active:scale-95 bg-linear-to-r ${plan.color} hover:brightness-110`}
                        >
                            ⚡ Choose {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}