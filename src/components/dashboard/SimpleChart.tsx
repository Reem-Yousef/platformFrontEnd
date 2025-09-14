import React from 'react';

interface SimpleChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  type?: 'bar' | 'pie' | 'line';
  height?: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  type = 'bar', 
  height = 200 
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  const getBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3 space-x-reverse">
          <div className="w-20 text-sm text-gray-600 text-left">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                item.color || 'bg-blue-500'
              }`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-12 text-sm font-medium text-gray-900 text-left">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const getPieChart = () => (
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          {data.map((item, index) => {
            const total = data.reduce((sum, d) => sum + d.value, 0);
            const percentage = (item.value / total) * 100;
            const previousPercentages = data
              .slice(0, index)
              .reduce((sum, d) => sum + (d.value / total) * 100, 0);
            
            const startAngle = (previousPercentages / 100) * 360;
            const endAngle = ((previousPercentages + percentage) / 100) * 360;
            
            const x1 = 64 + 56 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 64 + 56 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 64 + 56 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 64 + 56 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M 64 64 L ${x1} ${y1} A 56 56 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color || '#3B82F6'}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <div className="text-sm text-gray-500">إجمالي</div>
          </div>
        </div>
      </div>
    </div>
  );

  const getLineChart = () => (
    <div className="relative" style={{ height }}>
      <svg className="w-full h-full">
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={data.map((item, index) => 
            `${(index / (data.length - 1)) * 100},${100 - (item.value / maxValue) * 100}`
          ).join(' ')}
        />
        {data.map((item, index) => (
          <circle
            key={index}
            cx={`${(index / (data.length - 1)) * 100}%`}
            cy={`${100 - (item.value / maxValue) * 100}%`}
            r="4"
            fill="#3B82F6"
          />
        ))}
      </svg>
    </div>
  );

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return getPieChart();
      case 'line':
        return getLineChart();
      default:
        return getBarChart();
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
      {type === 'pie' && (
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 space-x-reverse">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || '#3B82F6' }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900 mr-auto">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleChart;
