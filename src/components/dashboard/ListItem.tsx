import React from 'react';

interface ListItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
  actions?: Array<{
    icon: string;
    onClick: () => void;
    tooltip?: string;
    color?: string;
  }>;
  onClick?: () => void;
  className?: string;
}

const ListItem: React.FC<ListItemProps> = ({
  icon,
  title,
  subtitle,
  stats,
  actions,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        {stats && stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className={`text-sm font-medium ${stat.color || 'text-gray-900'}`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
        
        {actions && (
          <div className="flex items-center space-x-2 space-x-reverse">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={`p-2 text-gray-400 hover:text-gray-600 transition-colors ${
                  action.color ? `hover:${action.color}` : ''
                }`}
                title={action.tooltip}
              >
                <span className="text-lg">{action.icon}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
