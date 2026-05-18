"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import { Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactInquiriesPage() {
  const [user, setUser] = useState("");
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  type Inquiry = {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (!storedUser) {
      router.push("/admin/login");
    } else {
      setUser(storedUser);
    }
    fetchInquiries();
  }, [router]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/contact/inquiries", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <div className="ml-10 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
        <p className="text-gray-600 mt-2">
          Manage and review customer contact inquiries
        </p>
      </div>

      <div className="ml-10 mr-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Inquiries</p>
                <p className="text-gray-900 text-2xl font-bold">{inquiries.length}</p>
              </div>
              <Mail className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Latest This Week</p>
                <p className="text-gray-900 text-2xl font-bold">
                  {inquiries.filter(
                    (inq) =>
                      new Date(inq.created_at).getTime() >
                      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </div>
              <MessageCircle className="text-green-500" size={32} />
            </div>
          </div>

        </div>
      </div>

      <div className="ml-10 mr-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Inquiries</h2>
          <button
            onClick={fetchInquiries}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Loading inquiries...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">No inquiries yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry.id}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {inquiry.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {inquiry.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {inquiry.message}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(inquiry.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
