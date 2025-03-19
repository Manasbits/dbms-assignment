'use client';

export default function Profile({ user, onClose }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{user.name}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Height</p>
            <p className="font-medium text-gray-900">{user.height} cm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium text-gray-900">{user.weight} kg</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Target Calorie</p>
            <p className="font-medium text-gray-900">{user.targetCalorie} kcal</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Exercise Frequency</p>
            <p className="font-medium text-gray-900">{user.exerciseFrequency}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Dietary Preference</p>
            <p className="font-medium text-gray-900">{user.preference}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 