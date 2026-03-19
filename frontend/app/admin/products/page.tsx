"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "../../navigation-bar/page";
import Pagination from "../components/pagination/page";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }
    fetchProducts();
  }, [router]);

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

  const startEditing = (product: any) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedProduct(null);
    setError(null);
  };

  const onChange = (field: string, value: any) => {
    setEditedProduct((p: any) => ({ ...p, [field]: value }));
  };

  const saveProduct = async () => {
    if (!editedProduct || editingId === null) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedProduct.name,
          description: editedProduct.description,
          price: Number(editedProduct.price),
          image_url: editedProduct.image_url,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to update product");
      }

      const data = await res.json();
      // Update local list
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? data.product : p)),
      );
      cancelEditing();
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Delete failed");
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
        <div className="w-full overflow-hidden">
          <table className="w-full text-sm table-fixed">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold text-gray-700 w-1/4">
                  Name
                </th>
                <th className="px-3 py-2 font-semibold text-gray-700 w-24">
                  Price
                </th>
                <th className="px-3 py-2 font-semibold text-gray-700 w-1/3">
                  Description
                </th>
                <th className="px-3 py-2 font-semibold text-gray-700 w-1/4">
                  Image URL
                </th>
                <th className="px-3 py-2 font-semibold text-gray-700 w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td
                    className="px-3 py-2 font-medium text-gray-900 cursor-pointer max-w-[220px] truncate"
                    onClick={() => startEditing(product)}
                    title={product.name}
                  >
                    {editingId === product.id ? (
                      <input
                        value={editedProduct?.name ?? ""}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="w-full max-w-[220px] border border-gray-200 rounded px-2 py-1"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td
                    className="px-3 py-2 font-medium text-gray-600 cursor-pointer w-24"
                    onClick={() => startEditing(product)}
                    title={String(product.price)}
                  >
                    {editingId === product.id ? (
                      <input
                        // type="number"
                        value={editedProduct?.price ?? 0}
                        onChange={(e) => onChange("price", e.target.value)}
                        className="w-full max-w-[120px] border border-gray-200 rounded px-2 py-1"
                      />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td
                    className="px-3 py-2 font-medium text-gray-500 cursor-pointer max-w-[360px] truncate"
                    onClick={() => startEditing(product)}
                    title={product.description}
                  >
                    {editingId === product.id ? (
                      <input
                        value={editedProduct?.description ?? ""}
                        onChange={(e) =>
                          onChange("description", e.target.value)
                        }
                        className="w-full max-w-[360px] border border-gray-200 rounded px-2 py-1"
                      />
                    ) : (
                      product.description
                    )}
                  </td>
                  <td
                    className="px-3 py-2 font-medium text-gray-500 cursor-pointer max-w-[280px] truncate"
                    onClick={() => startEditing(product)}
                    title={product.image_url}
                  >
                    {editingId === product.id ? (
                      <input
                        value={editedProduct?.image_url ?? ""}
                        onChange={(e) => onChange("image_url", e.target.value)}
                        className="w-full max-w-[280px] border border-gray-200 rounded px-2 py-1"
                      />
                    ) : (
                      product.image_url
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveProduct}
                          disabled={saving}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={saving}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    {editingId === product.id && error && (
                      <div className="text-red-500 text-sm mt-1">{error}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
