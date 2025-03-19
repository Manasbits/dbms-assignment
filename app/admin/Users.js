'use client';

import { users } from '@/utils/mocks';

export default function Users({ onClose }) {
  // Filter out admin users, only show regular users
  const regularUsers = users.filter(user => user.role === 'user');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">User Information</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height (cm)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Calories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preference</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {regularUsers.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.height}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.weight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.targetCalorie}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.exerciseFrequency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.preference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 