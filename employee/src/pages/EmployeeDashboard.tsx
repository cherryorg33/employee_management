import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { config } from '../config';

const EmployeeDashboard = () => {
  const [manager, setManager] = useState<any>(null);
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/employee/my-manager`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setManager(response.data);
      } catch (error) {
        console.error('Error fetching manager details:', error);
      }
    };

    fetchManager();
  }, [token]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Manager Card */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Your Manager</h2>
        {manager ? (
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {manager.name}</p>
            <p><strong>Email:</strong> {manager.email}</p>
            {manager.department && (
              <p><strong>Department:</strong> {manager.department}</p>
            )}
          </div>
        ) : (
          <p>Loading manager details...</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
