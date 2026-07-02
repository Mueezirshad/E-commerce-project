"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan");

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "4rem", marginBottom: "10px" }}>❌</div>
      <h1 style={{ color: "#ef4444", fontWeight: "900", transform: "uppercase" }}>Payment Cancelled!</h1>
      <p style={{ fontSize: "1.1rem", marginTop: "10px", color: "#a1a1aa", maxWidth: "400px" }}>
        You have canceled your <strong style={{ color: "#f43f5e", textTransform: "uppercase" }}>{plan || "Premium"}</strong> plan payment. No charges have been made.

      </p>
      
      <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
        <button 
          onClick={() => router.push("/pricing")}
          style={{ padding: "12px 24px", backgroundColor: "#3f3f46", color: "#fff", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#52525b"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#3f3f46"}
        >
          🔄 Try Again
        </button>
        
        <button 
          onClick={() => router.push("/boostpost")}
          style={{ padding: "12px 24px", backgroundColor: "#7c3aed", color: "#fff", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#6d28d9"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#7c3aed"}
        >
          📋 My Ads
        </button>
      </div>
    </div>
  );
}