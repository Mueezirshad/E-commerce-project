"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

export default function SellProductModal({ showSellModal, setShowSellModal, darkMode, setProducts }) {
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    phone: "",
    file: null,
    previewUrl: null
  });
  const [uploading, setUploading] = useState(false);

  if (!showSellModal) return null;

  const handleProductFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm({
        ...productForm,
        file: file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const { title, description, price, category, phone, file } = productForm;

    if (!title.trim() || !description.trim() || !price || !category.trim() || !phone.trim() || !file) {
      return Swal.fire({
        title: "⚠️ Fields Required!",
        text: "Please make sure to fill in all the required details, including the image",
        icon: "warning",
        background: "#1e293b", color: "#fff", confirmButtonColor: "#eab308"
      });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire({
        title: "🔒 Login Required!",
        text: "Please sign in to add a product.",
        icon: "warning",
        background: "#1e293b", color: "#fff", confirmButtonColor: "#eab308"
      });
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", String(price));
    formData.append("category", category.trim());
    formData.append("phoneNumber", phone.trim());
    formData.append("thumbnail", file);

    try {
      const response = await axios.post("https://backend-my-api-ten.vercel.app/api/products/add", formData, {
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });

      if (response.data) {
        Swal.fire({
          title: "🎉 Succes!",
          text: "Product added successfully",
          icon: "success",
          background: "#1e293b", color: "#fff", confirmButtonColor: "#22c55e"
        });
        
        if (response.data.product) {
          setProducts((prev) => [response.data.product, ...prev]);
        }
        
        setShowSellModal(false);
        setProductForm({ title: "", description: "", price: "", category: "", phone: "", file: null, previewUrl: null });
      }
    } catch (err) {
      console.error("Full Error:", err);
      
      const errorMessage = err.response?.data?.message || err.message || "Timeout Issue!";
      
      Swal.fire({
        title: "❌ Exact Backend Error!",
        text: errorMessage, 
        icon: "error",
        background: "#1e293b", color: "#fff", confirmButtonColor: "#ef4444"
      });
      
    } finally {
      setUploading(false);
    }
  };

  return (
<div className="fixed inset-0 z-50 flex  items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto p-4">
 <div
 className={`relative w-full max-w-lg mx-auto my-6 sm:my-10 rounded-2xl border shadow-2xl
max-h-[95dvh] overflow-y-auto p-4 sm:p-6 transition-all
${
  darkMode
    ? "bg-slate-800 text-white border-slate-700"
    : "bg-white text-black border-purple-100"
}`}

  >
    {/* Close Button */}
    <button
      onClick={() => setShowSellModal(false)}
      className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full text-2xl transition ${
        darkMode
          ? "text-gray-300 hover:bg-slate-700 hover:text-white"
          : "text-gray-400 hover:bg-gray-100 hover:text-black"
      }`}
    >
      ×
    </button>

    {/* Heading */}
    <h2 className="text-xl sm:text-2xl font-black text-center mb-1 tracking-tight">
      Sell Your Item 🚀
    </h2>

    <p className="text-center text-xs sm:text-sm text-gray-400 mb-5">
      Enter product details
    </p>

    <form onSubmit={handleCreateProduct} className="space-y-4">
      {/* Image Picker */}
      <div className="flex flex-col items-center">
        <div className="relative w-full h-32 sm:h-40 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden bg-gray-50/5 border-gray-500 cursor-pointer">
          {productForm.previewUrl ? (
            <Image
              src={productForm.previewUrl}
              alt="product preview"
              fill
              className="object-contain p-2"
              unoptimized
            />
          ) : (
            <div className="text-center text-gray-400 text-xs sm:text-sm">
              <span className="text-2xl block font-bold">+</span>
              Upload Product Image
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleProductFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Product Title */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">
          Product Title
        </label>

        <input
          type="text"
          placeholder="iPhone 14 Pro Max"
          value={productForm.title}
          onChange={(e) =>
            setProductForm({ ...productForm, title: e.target.value })
          }
          className={`w-full border rounded-xl px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white"
              : "bg-gray-50 border-gray-300"
          }`}
        />
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">
            Price (Rs.)
          </label>

          <input
            type="number"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) =>
              setProductForm({ ...productForm, price: e.target.value })
            }
            className={`w-full border rounded-xl px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-50 border-gray-300"
            }`}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">
            Category
          </label>

          <input
            type="text"
            placeholder="Mobiles, Cars"
            value={productForm.category}
            onChange={(e) =>
              setProductForm({ ...productForm, category: e.target.value })
            }
            className={`w-full border rounded-xl px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-50 border-gray-300"
            }`}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">
          Phone Number
        </label>

        <input
          type="text"
          placeholder="03XXXXXXXXX"
          value={productForm.phone}
          onChange={(e) =>
            setProductForm({ ...productForm, phone: e.target.value })
          }
          className={`w-full border rounded-xl px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white"
              : "bg-gray-50 border-gray-300"
          }`}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">
          Description
        </label>

        <textarea
          rows={4}
          placeholder="Describe what you are selling..."
          value={productForm.description}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              description: e.target.value,
            })
          }
          className={`w-full border rounded-xl px-3 py-2.5 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white"
              : "bg-gray-50 border-gray-300"
          }`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={uploading}
        className={`w-full py-3 rounded-xl text-sm sm:text-base font-bold text-white transition-all shadow-md hover:opacity-90 flex items-center justify-center gap-2 ${
          darkMode ? "bg-purple-600" : "bg-purple-900"
        } ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {uploading ? "Uploading..." : "Submit Product 🚀"}
      </button>
    </form>
  </div>
</div>

  );
}