import React from 'react';

interface ListCardProps {
  title: string;
  children: React.ReactNode;
  actionButton?: {
    text: string;
    onClick: () => void;
    color?: string;
  };
  emptyMessage?: string;
}

const ListCard: React.FC<ListCardProps> = ({ 
  title, 
  children, 
  actionButton, 
  emptyMessage = "لا توجد عناصر لعرضها" 
}) => {
  const getButtonColor = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
      case 'green':
        return 'text-green-600 bg-green-50 hover:bg-green-100';
      case 'purple':
        return 'text-purple-600 bg-purple-50 hover:bg-purple-100';
      case 'red':
        return 'text-red-600 bg-red-50 hover:bg-red-100';
      default:
        return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${getButtonColor(actionButton.color)}`}
            >
              <span className="ml-2">+</span>
              {actionButton.text}
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {React.Children.count(children) > 0 ? (
          <div className="space-y-4">
            {children}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📭</div>
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCard;
