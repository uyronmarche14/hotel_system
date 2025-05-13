'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers, deleteUser, updateUser, User } from '@/app/lib/adminService';
import { 
  FaUser, 
  FaEnvelope, 
  FaTrash, 
  FaPencilAlt, 
  FaCheck, 
  FaSearch, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendar,
  FaUserTag
} from 'react-icons/fa';
import Image from 'next/image';
import SafeImage from '@/app/components/ui/SafeImage';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipLevel: '',
    isActive: true
  });
  
  const router = useRouter();

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
        setError('');
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = users.filter(
      user => 
        user.name.toLowerCase().includes(lowercaseSearch) ||
        user.email.toLowerCase().includes(lowercaseSearch) ||
        (user.phone && user.phone.toLowerCase().includes(lowercaseSearch))
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
    setIsEditing(false);
  };

  const startEditing = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      membershipLevel: user.membershipLevel || 'Standard',
      isActive: user.isActive
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setEditForm({
        ...editForm,
        [name]: target.checked
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const saveChanges = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const updatedUser = await updateUser(selectedUser._id, editForm);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === selectedUser._id ? updatedUser : user
      ));
      
      setShowModal(false);
      setIsEditing(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setConfirmDelete(userId);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      
      // Update local state
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <FaExclamationTriangle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FaInfoCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm ? 'Try adjusting your search query' : 'There are no users to display'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr 
                  key={user._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openUserDetails(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                        {user.profilePic ? (
                          <SafeImage
                            src={user.profilePic}
                            alt={user.name}
                            className="h-10 w-10 object-cover"
                            width={40}
                            height={40}
                            imageType="profile"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-[#1C3F32] text-white">
                            <FaUser className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.membershipLevel || 'Standard'} Member
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(user);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaPencilAlt className="w-4 h-4" />
                    </button>
                    {confirmDelete === user._id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteUser(user._id);
                        }}
                        className="text-gray-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* User Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => {
                setShowModal(false);
                setSelectedUser(null);
                setIsEditing(false);
              }}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {isEditing ? (
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Edit User
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Membership Level
                        </label>
                        <select
                          name="membershipLevel"
                          value={editForm.membershipLevel}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Gold">Gold</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Diamond">Diamond</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={editForm.isActive}
                          onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                          className="h-4 w-4 text-[#1C3F32] focus:ring-[#1C3F32] border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Active Account
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      User Details
                    </h3>
                    <div className="mb-6 flex justify-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                        {selectedUser.profilePic ? (
                          <SafeImage
                            src={selectedUser.profilePic}
                            alt={selectedUser.name}
                            className="h-24 w-24 object-cover"
                            width={96}
                            height={96}
                            imageType="profile"
                          />
                        ) : (
                          <div className="h-24 w-24 flex items-center justify-center bg-[#1C3F32] text-white">
                            <FaUser className="h-10 w-10" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaUser className="w-5 h-5 text-[#1C3F32] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Name</div>
                          <div className="text-gray-900">{selectedUser.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="w-5 h-5 text-[#1C3F32] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Email</div>
                          <div className="text-gray-900">{selectedUser.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="w-5 h-5 text-[#1C3F32] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Phone</div>
                          <div className="text-gray-900">{selectedUser.phone || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="w-5 h-5 text-[#1C3F32] mr-3 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Address</div>
                          <div className="text-gray-900">{selectedUser.address || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaUserTag className="w-5 h-5 text-[#1C3F32] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Membership Level</div>
                          <div className="text-gray-900">{selectedUser.membershipLevel || 'Standard'}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaIdCard className="w-5 h-5 text-[#1C3F32] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Status</div>
                          <div>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                selectedUser.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {selectedUser.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="w-5 h-5 text-[#1C3F32] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Member Since</div>
                          <div className="text-gray-900">
                            {formatDate(selectedUser.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1C3F32] text-base font-medium text-white hover:bg-[#15332a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={saveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedUser(null);
                        setShowModal(false);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1C3F32] text-base font-medium text-white hover:bg-[#15332a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setIsEditing(true);
                        startEditing(selectedUser);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedUser(null);
                      }}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 