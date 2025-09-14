import React from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

interface NotificationCardProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const getTypeIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">الإشعارات</h2>
          <div className="flex items-center space-x-3 space-x-reverse">
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {unreadCount}
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getTypeColor(notification.type)} ${
                  !notification.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        {notification.isRead ? 'تم القراءة' : 'تحديد كمقروء'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.timestamp).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length > 5 && (
              <div className="text-center pt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  عرض جميع الإشعارات ({notifications.length})
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🔔</div>
            <p className="text-gray-500">لا توجد إشعارات جديدة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
