"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaUserShield,
  FaPhone,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import AdminLayout from "@/app/components/layouts/AdminLayout";
import { API_URL } from "@/app/lib/constants";
import Cookies from "js-cookie";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem("user");
      if (!user || !Cookies.get("token")) {
        router.push("/admin-login");
        return false;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.role !== "admin") {
          router.push("/admin-login");
          return false;
        }
        return true;
      } catch {
        router.push("/admin-login");
        return false;
      }
    };

    const fetchUsers = async () => {
      if (!checkAdminAuth()) return;

      try {
        const response = await fetch(`/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push("/admin-login");
            return;
          }
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.data);
        setFilteredUsers(data.data);
      } catch (error: ApiError | unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching users",
        );
        console.error("Users fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  useEffect(() => {
    // Filter and search users when criteria change
    let result = [...users];

    // Apply role filter
    if (filterRole !== "all") {
      result = result.filter((user) => user.role === filterRole);
    }

    // Apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm),
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, filterRole]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUserSelect = (user: User) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null); // Hide details if the same user is clicked
    } else {
      setSelectedUser(user); // Show details for the new user
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1C3F32]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 mb-4">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <div className="flex space-x-2 items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent text-gray-800"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent text-gray-800"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <>
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50 ${selectedUser?.id === user.id ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {user.profilePic ? (
                                  <Image
                                    src={`${API_URL}${user.profilePic}`}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <FaUser className="text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <FaEnvelope className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">
                                {user.email}
                              </span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center mt-1">
                                <FaPhone className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">
                                  {user.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUserShield className="text-gray-400 mr-2" />
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {user.createdAt
                                ? formatDate(user.createdAt)
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleUserSelect(user)}
                            className="text-[#1C3F32] hover:text-[#1C3F32]/80 flex items-center"
                          >
                            <FaInfoCircle className="mr-1" />
                            <span>
                              {selectedUser?.id === user.id
                                ? "Hide Details"
                                : "View Details"}
                            </span>
                          </button>
                        </td>
                      </tr>
                      {selectedUser?.id === user.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-blue-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                  Address
                                </h3>
                                <div className="flex items-start">
                                  <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                                  <span className="text-sm text-gray-700">
                                    {user.address || "No address provided"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                  Bio
                                </h3>
                                <div className="text-sm text-gray-700">
                                  {user.bio || "No bio provided"}
                                </div>
                              </div>
                              <div className="md:col-span-2 mt-2">
                                <h3 className="font-medium text-gray-900 mb-2">
                                  Additional Information
                                </h3>
                                <div className="text-sm text-gray-700">
                                  <p>User ID: {user.id}</p>
                                  <p>
                                    Account created on{" "}
                                    {user.createdAt
                                      ? formatDate(user.createdAt)
                                      : "N/A"}{" "}
                                    at{" "}
                                    {user.createdAt
                                      ? new Date(
                                          user.createdAt,
                                        ).toLocaleTimeString()
                                      : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
