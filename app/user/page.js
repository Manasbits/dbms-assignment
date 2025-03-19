'use client';

import { useState, useEffect } from 'react';
import Profile from './Profile';
import MealPlanTable from './MealPlanTable';
import { generateDefaultMealPlan } from '@/backend/services/mealPlanService';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  const fetchMealPlan = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      const plan = generateDefaultMealPlan(user.preference);
      setMealPlan(plan);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
      fetchMealPlan();
    }

    // Add event listener for meal plan updates
    window.addEventListener('mealPlanUpdated', fetchMealPlan);

    return () => {
      window.removeEventListener('mealPlanUpdated', fetchMealPlan);
    };
  }, []);

  if (!userData || !mealPlan) {
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userData.name}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {showProfile ? 'Hide Profile' : 'View Profile'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {showProfile && (
          <Profile 
            user={userData} 
            onClose={() => setShowProfile(false)} 
          />
        )}

        <div className="mt-6">
          <MealPlanTable preference={mealPlan} />
        </div>
      </div>
    </div>
  );
}