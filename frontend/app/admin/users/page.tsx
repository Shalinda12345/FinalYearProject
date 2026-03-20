"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import { Trash2 } from "lucide-react";

export default function ManageUsers() {
  const [adminUser, setAdminUser] = useState("");
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  type User = {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (!storedUser) {
      router.push("/admin/login");
    } else {
      setAdminUser(storedUser);
      fetchUsers();
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        cache: "no-store",
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? All their orders and data will be removed.")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="ml-10 mb-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600 mt-2">
          View and manage registered customers.
        </p>
      </div>

      <div className="ml-10 mr-10 bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Username</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Registration Date</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete User"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
