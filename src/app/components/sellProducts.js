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
    formData.append("productImage", file);

    try {
      const response = await axios.post("https://backend-my-api-ten.vercel.app/api/products/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
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
      console.error(err);
      Swal.fire({
        title: "❌ Failed to Add!",
        text: err.response?.data?.message || "Something went wrong while uploading to Cloudinary!",
        icon: "error",
        background: "#1e293b", color: "#fff", confirmButtonColor: "#ef4444"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border max-h-[90vh] overflow-y-auto transition-all ${darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-black border-purple-100"}`}>
        
        <button
          onClick={() => setShowSellModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ×
        </button>

        <h2 className="text-2xl font-black text-center mb-1 tracking-tight">Sell Your Item 🚀</h2>
        <p className="text-center text-xs text-gray-400 mb-4">Enter product details to upload on MongoDB Database.</p>

        <form onSubmit={handleCreateProduct} className="space-y-3.5">
          {/* Image Picker */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden bg-gray-50/5 border-gray-500 cursor-pointer">
              {productForm.previewUrl ? (
                <Image src={productForm.previewUrl} alt="product preview" fill className="object-contain p-2" unoptimized />
              ) : (
                <div className="text-center text-gray-400 text-xs">
                  <span className="text-xl block font-bold">+</span> Upload Product Image
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleProductFile} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">Product Title</label>
            <input
              type="text" placeholder=" iPhone 14 Pro Max"
              value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">Price (Rs.)</label>
              <input
                type="number" placeholder="Price"
                value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">Category</label>
              <input
                type="text" placeholder="Mobiles, Cars"
                value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">Phone Number</label>
            <input
              type="text" placeholder="e.g., 03XXXXXXXXX"
              value={productForm.phone} onChange={(e) => setProductForm({ ...productForm, phone: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-400">Description</label>
            <textarea
              rows="3" placeholder="Describe what you are selling..."
              value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
          </div>

          <button
            type="submit" disabled={uploading}
            className={`w-full text-white py-3 rounded-xl font-bold transition-all text-sm mt-1 shadow-md hover:opacity-90 flex justify-center items-center gap-2 ${darkMode ? "bg-purple-600" : "bg-purple-900"} ${uploading && "opacity-60 cursor-not-allowed"}`}
          >
            {uploading ? "Uploading...." : "Submit Product 🚀"}
          </button>
        </form>

      </div>
    </div>
  );
}