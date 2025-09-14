import React, { useState } from 'react';

interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    onClick: () => void;
    type: 'primary' | 'secondary' | 'danger';
  };
}

interface AlertsProps {
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
}

const Alerts: React.FC<AlertsProps> = ({
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss
}) => {
  const [showAll, setShowAll] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getActionButtonColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  const groupedAlerts = displayedAlerts.reduce((groups, alert) => {
    const date = new Date(alert.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'أمس';
    } else {
      dateKey = date.toLocaleDateString('ar-EG', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(alert);
    return groups;
  }, {} as Record<string, Alert[]>);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <h2 className="text-lg font-semibold text-gray-900">التنبيهات والإشعارات</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                تحديد الكل كمقروء
              </button>
            )}
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {showAll ? 'عرض أقل' : 'عرض الكل'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {alerts.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">
                  📅 {date}
                </h3>
                <div className="space-y-3">
                  {dateAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`relative p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                        !alert.isRead ? 'ring-2 ring-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">{getAlertIcon(alert.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {alert.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                {alert.message}
                              </p>
                              
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <span className="text-xs text-gray-500">
                                  🕐 {new Date(alert.timestamp).toLocaleTimeString('ar-EG', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                
                                {!alert.isRead && (
                                  <button
                                    onClick={() => onMarkAsRead(alert.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    تحديد كمقروء
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 space-x-reverse mr-4">
                              {alert.action && (
                                <button
                                  onClick={alert.action.onClick}
                                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${getActionButtonColor(alert.action.type)}`}
                                >
                                  {alert.action.label}
                                </button>
                              )}
                              
                              <button
                                onClick={() => onDismiss(alert.id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="إغلاق"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {!showAll && alerts.length > 5 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  عرض {alerts.length - 5} تنبيه إضافي
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تنبيهات</h3>
            <p className="text-gray-500">أنت محدث بجميع الأخبار والتحديثات</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
