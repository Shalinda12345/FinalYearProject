"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function ManageUsers() {
  const [adminUser, setAdminUser] = useState("");
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

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
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const saveUser = async (userId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: editUsername, email: editEmail }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, username: editUsername, email: editEmail } : u
          )
        );
        setEditingUserId(null);
        toast.success("User details updated");
      } else {
        const errorData = await res.json();
        toast.error(errorData.detail || "Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error("An error occurred while updating the user.");
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
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full font-normal"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {editingUserId === user.id ? (
                      <input
                        type="email"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingUserId === user.id ? (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => saveUser(user.id)}
                          className="text-emerald-500 hover:text-emerald-700 transition"
                          title="Save User"
                        >
                          <Check className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-gray-400 hover:text-gray-600 transition"
                          title="Cancel"
                        >
                          <X className="h-5 w-5 inline" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditUsername(user.username);
                            setEditEmail(user.email);
                          }}
                          className="text-indigo-500 hover:text-indigo-700 transition"
                          title="Edit User"
                        >
                          <Edit2 className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5 inline" />
                        </button>
                      </div>
                    )}
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
