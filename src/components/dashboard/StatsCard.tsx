import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            change.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.isPositive ? '+' : ''}{change.value}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
