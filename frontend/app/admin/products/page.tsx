"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../../navigation-bar/page";
import Pagination from "../components/pagination/page";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/products/", {
        cache: "no-store",
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="ml-10 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-2">Manage your products here</p>
      </div>

      {/* Products Table */}
      <div className="ml-10 mr-10 bg-white rounded-lg shadow-md p-6">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Price</th>
              <th className="px-4 py-2 font-semibold text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 font-medium text-gray-600">
                  {product.price}
                </td>
                <td className="px-4 py-3 font-medium text-gray-500">
                  {product.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
