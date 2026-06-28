"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "Payment Canceled",
      text: "Your transaction was canceled. No money was charged.",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#ff3333"
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff", background: "#121212", padding: "20px" }}>
      <h1 style={{ color: "#ff3333", fontSize: "2.5rem", marginBottom: "15px" }}>❌ Transaction Canceled</h1>
      <p style={{ color: "#aaa", marginBottom: "30px", fontSize: "1.1rem" }}>You can try purchasing again whenever you are ready.</p>
      <button 
        onClick={() => router.push("/pricing")} 
        style={{ color: "#fff", background: "#333", border: "1px solid #444", padding: "12px 25px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
      >
        Back to Pricing Plans
      </button>
    </div>
  );
}