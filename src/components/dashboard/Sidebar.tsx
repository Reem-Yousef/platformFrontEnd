import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  path: string;
  badge?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'courses',
      title: 'الكورسات',
      icon: '📚',
      path: '/courses',
      children: [
        { id: 'all-courses', title: 'جميع الكورسات', icon: '📖', path: '/courses' },
        { id: 'create-course', title: 'إنشاء كورس', icon: '➕', path: '/courses/create' },
        { id: 'course-categories', title: 'فئات الكورسات', icon: '🏷️', path: '/courses/categories' }
      ]
    },
    {
      id: 'exams',
      title: 'الامتحانات',
      icon: '📝',
      path: '/exams',
      children: [
        { id: 'all-exams', title: 'جميع الامتحانات', icon: '📋', path: '/exams' },
        { id: 'create-exam', title: 'إنشاء امتحان', icon: '➕', path: '/exams/create' },
        { id: 'exam-results', title: 'نتائج الامتحانات', icon: '📊', path: '/exams/results' }
      ]
    },
    {
      id: 'students',
      title: 'الطلاب',
      icon: '👨‍🎓',
      path: '/students',
      children: [
        { id: 'all-students', title: 'جميع الطلاب', icon: '👥', path: '/students' },
        { id: 'add-student', title: 'إضافة طالب', icon: '➕', path: '/students/add' },
        { id: 'student-groups', title: 'مجموعات الطلاب', icon: '👥', path: '/students/groups' }
      ]
    },
    {
      id: 'classes',
      title: 'الصفوف',
      icon: '🏫',
      path: '/classes',
      children: [
        { id: 'all-classes', title: 'جميع الصفوف', icon: '🏢', path: '/classes' },
        { id: 'create-class', title: 'إنشاء صف', icon: '➕', path: '/classes/create' },
        { id: 'class-schedule', title: 'جدول الصفوف', icon: '📅', path: '/classes/schedule' }
      ]
    },
    {
      id: 'reports',
      title: 'التقارير',
      icon: '📈',
      path: '/reports',
      children: [
        { id: 'academic-reports', title: 'التقارير الأكاديمية', icon: '📊', path: '/reports/academic' },
        { id: 'attendance-reports', title: 'تقارير الحضور', icon: '📋', path: '/reports/attendance' },
        { id: 'performance-reports', title: 'تقارير الأداء', icon: '📈', path: '/reports/performance' }
      ]
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      icon: '⚙️',
      path: '/settings',
      children: [
        { id: 'profile', title: 'الملف الشخصي', icon: '👤', path: '/settings/profile' },
        { id: 'account', title: 'إعدادات الحساب', icon: '🔐', path: '/settings/account' },
        { id: 'notifications', title: 'الإشعارات', icon: '🔔', path: '/settings/notifications' }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (item: SidebarItem) => {
    if (item.path === location.pathname) return true;
    if (item.children) {
      return item.children.some(child => child.path === location.pathname);
    }
    return false;
  };

  const isChildActive = (child: SidebarItem) => {
    return child.path === location.pathname;
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      navigate(item.path);
      if (window.innerWidth < 1024) {
        onToggle(); // إغلاق الشريط الجانبي على الشاشات الصغيرة
      }
    }
  };

  return (
    <>
      {/* Overlay للشاشات الصغيرة */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* الشريط الجانبي */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">نظام التعليم</h1>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isItemActive(item) 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.children && (
                    <span className={`transform transition-transform ${
                      expandedItems.includes(item.id) ? 'rotate-180' : ''
                    }`}>
                      ▼
                    </span>
                  )}
                </button>

                {/* Sub-items */}
                {item.children && expandedItems.includes(item.id) && (
                  <ul className="mt-1 mr-8 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => {
                            navigate(child.path);
                            if (window.innerWidth < 1024) {
                              onToggle();
                            }
                          }}
                          className={`
                            w-full flex items-center space-x-3 space-x-reverse px-3 py-2 text-sm rounded-lg transition-colors
                            ${isChildActive(child) 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'text-gray-600 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="text-sm">{child.icon}</span>
                          <span>{child.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
              <p className="text-xs text-gray-500">مدرس الرياضيات</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
