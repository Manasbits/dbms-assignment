'use client';

import { useState, useEffect } from 'react';
import Users from './Users';
import MealPlanEditor from './MealPlanEditor';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [showUsers, setShowUsers] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('userData'));
    if (admin) {
      setAdminData(admin);
    }
  }, []);

  if (!adminData) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowUsers(!showUsers);
                setShowMealPlan(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {showUsers ? 'Hide Users' : 'View Users'}
            </button>
            <button
              onClick={() => {
                setShowMealPlan(!showMealPlan);
                setShowUsers(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              {showMealPlan ? 'Hide Meal Plan' : 'Edit Meal Plan'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {showUsers && (
          <Users onClose={() => setShowUsers(false)} />
        )}

        {showMealPlan && (
          <MealPlanEditor onClose={() => setShowMealPlan(false)} />
        )}

        {!showUsers && !showMealPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900">Welcome, Admin</h2>
            <p className="mt-2 text-gray-600">Use the buttons above to manage users and meal plans.</p>
          </div>
        )}
      </div>
    </div>
  );
}