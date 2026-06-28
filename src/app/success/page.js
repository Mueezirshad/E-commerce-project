"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: "Your Vanish Mart account has been upgraded successfully.",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#4BB543",
      confirmButtonText: "Awesome!"
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff", background: "#121212", padding: "20px" }}>
      <h1 style={{ color: "#4BB543", fontSize: "2.5rem", marginBottom: "15px" }}>🎉 Congratulations!</h1>
      <p style={{ color: "#aaa", marginBottom: "30px", fontSize: "1.1rem" }}>Thank you for your purchase. Your plan is now active.</p>
      <button 
        onClick={() => router.push("/")} 
        style={{ color: "#fff", background: "#0070f3", border: "none", padding: "12px 25px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
      >
        Go to Home
      </button>
    </div>
  );
}