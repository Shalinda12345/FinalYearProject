"use client";
import { useEffect, useState } from "react";
import NavigationBar from "../navigation-bar/page";

// Define what a Product looks like in TypeScript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Python Backend
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/products");
        if (res.ok) {
          const data = await res.json();
          console.log("Products fetched:", data);
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Connection error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="p-10 text-center text-xl">Loading products...</div>;

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Products
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                {product.image_url && product.image_url.length > 0 ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load image:", product.image_url);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description || "No description available."}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No Products found in the database.
          </p>
        )}
      </div>
    </>
  );
}
