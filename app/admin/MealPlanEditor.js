'use client';

import { useState, useEffect } from 'react';
import { generateDefaultMealPlan } from '@/backend/services/mealPlanService';

export default function MealPlanEditor({ onClose }) {
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [alternatives, setAlternatives] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    const plan = generateDefaultMealPlan(isVegetarian ? 'Vegetarian' : 'Non-Vegetarian');
    setCurrentPlan(plan);
  }, [isVegetarian]);

  const handleToggle = () => {
    setIsVegetarian(!isVegetarian);
  };

  const handleCellClick = async (day, meal, food, itemIndex) => {
    console.log('Cell clicked:', { day, meal, food, itemIndex });
    
    // Clear previous selection if clicking the same item
    if (selectedCell?.day === day && 
        selectedCell?.meal === meal && 
        selectedCell?.itemIndex === itemIndex) {
      console.log('Clearing previous selection');
      setSelectedCell(null);
      setAlternatives({});
      return;
    }

    setSelectedCell({ day, meal, itemIndex, food });
    
    try {
      let foodType;
      if (meal === 'snack') {
        foodType = 'carb';
      } else {
        foodType = itemIndex === 0 ? 'carb' : itemIndex === 1 ? 'protein' : 'fat';
      }

      console.log('Fetching alternatives with:', { foodType, food, preference: isVegetarian ? 'Vegetarian' : 'Non-Vegetarian' });

      const response = await fetch(
        `/api/mealplan/alternatives?` + 
        `foodType=${foodType}&` +
        `currentFood=${encodeURIComponent(food)}&` +
        `preference=${isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch alternatives');
      }
      
      const data = await response.json();
      console.log('Received alternatives:', data);

      setAlternatives(prev => {
        const newState = {
          ...prev,
          [`${day}-${meal}-${itemIndex}`]: data
        };
        console.log('Updated alternatives state:', newState);
        return newState;
      });
    } catch (error) {
      console.error('Failed to fetch alternatives:', error);
    }
  };

  const handleAlternativeSelect = (day, meal, newFood, itemIndex) => {
    const updatedPlan = { ...currentPlan };
    const foods = updatedPlan[day][meal].split(', ');
    foods[itemIndex] = newFood;
    updatedPlan[day][meal] = foods.join(', ');
    setCurrentPlan(updatedPlan);
    setSelectedCell(null);
    setAlternatives({});
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/mealplan/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: currentPlan,
          preference: isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save meal plan');
      }
  
      setHasChanges(false);
      // Dispatch event to notify users of the update
      window.dispatchEvent(new Event('mealPlanUpdated'));
      alert('Meal plan saved successfully!');
    } catch (error) {
      console.error('Failed to save meal plan:', error);
      alert('Failed to save meal plan. Please try again.');
    }
  };

  if (!currentPlan) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">View Meal Plan</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!isVegetarian}
                onChange={handleToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </label>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              {meals.map(meal => (
                <th
                  key={meal}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {days.map((day, idx) => (
              <tr key={day} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                  {day}
                </td>
                {meals.map(meal => (
                  <td 
                    key={`${day}-${meal}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative"
                  >
                    <div className="flex flex-col space-y-2">
                      {currentPlan[day][meal].split(', ').map((food, idx) => (
                        <div key={idx} className="relative group">
                          <div
                            className={`p-2 border rounded-md cursor-pointer transition-colors
                              ${selectedCell?.day === day && 
                                selectedCell?.meal === meal && 
                                selectedCell?.itemIndex === idx
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            onClick={() => handleCellClick(day, meal, food, idx)}
                          >
                            {food}
                          </div>
                          {selectedCell?.day === day && 
                           selectedCell?.meal === meal && 
                           selectedCell?.itemIndex === idx && 
                           alternatives[`${day}-${meal}-${idx}`]?.length > 0 && (
                            <div className="absolute z-50 left-full ml-2 top-0 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                              {alternatives[`${day}-${meal}-${idx}`].map(alt => (
                                <button
                                  key={alt.food}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                                  onClick={() => handleAlternativeSelect(day, meal, alt.food, idx)}
                                >
                                  {alt.food} ({alt.calories} cal)
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}