import React from 'react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  badge?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, columns = 4 }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200';
      case 'red':
        return 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200';
      case 'pink':
        return 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200';
    }
  };

  const getGridCols = (cols: number) => {
    switch (cols) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
      case 6:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h2>
      <div className={`grid ${getGridCols(columns)} gap-4`}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`relative p-4 rounded-lg border transition-all duration-200 ${
              action.disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' 
                : getColorClasses(action.color)
            } ${!action.disabled ? 'hover:scale-105 hover:shadow-md' : ''}`}
          >
            {action.badge && (
              <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                {action.badge}
              </span>
            )}
            
            <div className="text-center">
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="font-medium text-sm mb-1">{action.title}</h3>
              <p className="text-xs opacity-75">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
