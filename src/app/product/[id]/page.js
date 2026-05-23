"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products/${params.id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log("Error fetching product:", error);
      });
  }, [params.id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        
        <Link href="/" className="text-blue-600 underline mb-4 inline-block">
          ← Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="max-h-[350px] object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ${product.price}
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>

              <p>
                <span className="font-semibold">Brand:</span>{" "}
                {product.brand}
              </p>

              <p>
                <span className="font-semibold">Rating:</span>{" "}
                ⭐ {product.rating}
              </p>

              <p>
                <span className="font-semibold">Stock:</span>{" "}
                {product.stock}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}