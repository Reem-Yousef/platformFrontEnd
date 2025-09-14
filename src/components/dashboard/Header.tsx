import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QuickSearch from './QuickSearch';

interface HeaderProps {
  onSidebarToggle: () => void;
  onSearchResult: (result: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, onSearchResult }) => {
  const { teacher, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const mockNotifications = [
    {
      id: '1',
      title: 'امتحان جديد',
      message: 'تم إنشاء امتحان الرياضيات للوحدة الأولى',
      type: 'info' as const,
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      title: 'نتيجة امتحان',
      message: 'تم تصحيح امتحان الفيزياء للصف الثالث',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false
    },
    {
      id: '3',
      title: 'تذكير',
      message: 'موعد اجتماع المدرسين غداً الساعة 10 صباحاً',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Sidebar toggle and search */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>
          
          <div className="hidden md:block w-80">
            <QuickSearch onResultClick={onSearchResult} />
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      تحديد الكل كمقروء
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 last:border-b-0 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">
                            {notification.type === 'success' ? '✅' :
                             notification.type === 'warning' ? '⚠️' :
                             notification.type === 'info' ? 'ℹ️' : 'ℹ️'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleDateString('ar-EG', {
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
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                    عرض جميع الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 space-x-reverse p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {teacher?.name?.charAt(0) || '👤'}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {teacher?.name || 'المستخدم'}
                </p>
                <p className="text-xs text-gray-500">
                  {teacher?.email || 'user@example.com'}
                </p>
              </div>
              <span className="hidden md:block text-gray-400">▼</span>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <button className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    👤 الملف الشخصي
                  </button>
                  <button className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    ⚙️ الإعدادات
                  </button>
                  <button className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🆘 المساعدة
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🚪 تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <QuickSearch onResultClick={onSearchResult} />
      </div>
    </header>
  );
};

export default Header;
