import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import ListCard from './ListCard';
import ListItem from './ListItem';
import QuickActions from './QuickActions';
import SimpleChart from './SimpleChart';
import Alerts from './Alerts';
import Timeline from './Timeline';
import CalendarCard from './CalendarCard';
import QuickReports from './QuickReports';
import AdvancedCharts from './AdvancedCharts';
import NotificationCard from './NotificationCard';

interface DashboardData {
  teacher: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    createdAt: string;
  };
  overview: {
    totalClasses: number;
    totalGroups: number;
    totalCourses: number;
    totalExams: number;
    totalStudents: number;
    totalResults: number;
    averageScore: number;
    passRate: number;
  };
  recentCourses: Array<{
    _id: string;
    name: string;
    year: string;
    classId: { name: string; year: string };
    groupIds: Array<{ name: string; maxStudents: number }>;
  }>;
  recentExams: Array<{
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
    courseId: { name: string };
    classId: { name: string };
  }>;
  recentResults: Array<{
    _id: string;
    score: number;
    submittedAt: string;
    studentId: { name: string; email: string };
    examId: { title: string };
    courseId: { name: string };
  }>;
  classes: Array<{
    _id: string;
    name: string;
    year: string;
    description: string;
    studentCount: number;
    courseCount: number;
    examCount: number;
  }>;
  groups: Array<{
    _id: string;
    name: string;
    maxStudents: number;
    description: string;
    studentCount: number;
    availableSlots: number;
    className: string;
  }>;
}

const ModernDashboard: React.FC = () => {
  const { teacher, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
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
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/teacher/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الداش بورد');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: '1',
      title: 'إنشاء كورس جديد',
      description: 'أضف كورس جديد للطلاب',
      icon: '📚',
      color: 'blue',
      onClick: () => navigate('/courses/create')
    },
    {
      id: '2',
      title: 'إنشاء امتحان',
      description: 'إنشاء امتحان جديد',
      icon: '📝',
      color: 'green',
      onClick: () => navigate('/exams/create')
    },
    {
      id: '3',
      title: 'إضافة طالب',
      description: 'تسجيل طالب جديد',
      icon: '👨‍🎓',
      color: 'purple',
      onClick: () => navigate('/students/add')
    },
    {
      id: '4',
      title: 'عرض التقارير',
      description: 'تقارير مفصلة',
      icon: '📊',
      color: 'indigo',
      onClick: () => navigate('/reports')
    }
  ];

  const mockReports = [
    {
      id: '1',
      title: 'تقرير الأداء الشهري',
      description: 'تقرير شامل عن أداء الطلاب الشهري',
      type: 'performance' as const,
      icon: '📈',
      color: 'bg-blue-100',
      lastGenerated: new Date().toISOString(),
      status: 'ready' as const
    },
    {
      id: '2',
      title: 'تقرير الحضور',
      description: 'تقرير تفصيلي عن حضور الطلاب',
      type: 'attendance' as const,
      icon: '📋',
      color: 'bg-green-100',
      lastGenerated: new Date(Date.now() - 86400000).toISOString(),
      status: 'ready' as const
    }
  ];

  const mockAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'موعد امتحان قريب',
      message: 'امتحان الرياضيات مجدول بعد يومين',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'تحديث النظام',
      message: 'سيتم تحديث النظام غداً من 2:00 إلى 4:00 صباحاً',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    }
  ];

  const mockTimelineEvents = [
    {
      id: '1',
      title: 'امتحان الرياضيات',
      description: 'امتحان الوحدة الأولى للصف الثالث',
      type: 'exam' as const,
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      time: '10:00 ص',
      status: 'upcoming' as const,
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'محاضرة الفيزياء',
      description: 'درس الكهرباء والمغناطيسية',
      type: 'course' as const,
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '9:00 ص',
      status: 'upcoming' as const,
      priority: 'medium' as const
    }
  ];

  const mockCalendarEvents = [
    {
      id: '1',
      title: 'امتحان الرياضيات',
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      type: 'exam' as const
    },
    {
      id: '2',
      title: 'محاضرة الفيزياء',
      date: new Date(Date.now() + 86400000).toISOString(),
      type: 'course' as const
    }
  ];

  const mockPerformanceData = [
    { month: 'يناير', students: 120, courses: 8, exams: 15, averageScore: 85 },
    { month: 'فبراير', students: 125, courses: 9, exams: 18, averageScore: 87 },
    { month: 'مارس', students: 130, courses: 10, exams: 20, averageScore: 82 },
    { month: 'أبريل', students: 128, courses: 11, exams: 22, averageScore: 88 }
  ];

  const mockSubjectPerformance = [
    { subject: 'الرياضيات', averageScore: 85, totalStudents: 120, passRate: 92 },
    { subject: 'الفيزياء', averageScore: 78, totalStudents: 115, passRate: 85 },
    { subject: 'الكيمياء', averageScore: 82, totalStudents: 110, passRate: 88 }
  ];

  const mockAttendanceData = [
    { month: 'يناير', present: 110, absent: 8, late: 2 },
    { month: 'فبراير', present: 118, absent: 5, late: 2 },
    { month: 'مارس', present: 125, absent: 3, late: 2 }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-bold text-gray-900">حدث خطأ</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مرحباً، {dashboardData.teacher.name}</h1>
          <p className="text-gray-600">إليك نظرة عامة على نشاطك اليوم</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي الطلاب"
          value={dashboardData.overview.totalStudents}
          icon="👥"
          color="blue"
          change={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="إجمالي الكورسات"
          value={dashboardData.overview.totalCourses}
          icon="📚"
          color="green"
          change={{ value: 2, isPositive: true }}
        />
        <StatsCard
          title="إجمالي الامتحانات"
          value={dashboardData.overview.totalExams}
          icon="📝"
          color="purple"
          change={{ value: 1, isPositive: false }}
        />
        <StatsCard
          title="متوسط الدرجات"
          value={`${dashboardData.overview.averageScore}%`}
          icon="📊"
          color="yellow"
          change={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Classes and Groups */}
        <div className="lg:col-span-2 space-y-6">
          {/* Classes */}
          <ListCard
            title="الصفوف الدراسية"
            actionButton={{
              text: 'إضافة صف',
              onClick: () => navigate('/classes/create'),
              color: 'blue'
            }}
          >
            {dashboardData.classes.map((cls) => (
              <ListItem
                key={cls._id}
                icon="👥"
                title={cls.name}
                subtitle={cls.year}
                stats={[
                  { label: 'طالب', value: cls.studentCount },
                  { label: 'كورس', value: cls.courseCount },
                  { label: 'امتحان', value: cls.examCount }
                ]}
                actions={[
                  { icon: '👁️', onClick: () => console.log('View class'), tooltip: 'عرض' },
                  { icon: '✏️', onClick: () => console.log('Edit class'), tooltip: 'تعديل' }
                ]}
                onClick={() => navigate(`/classes/${cls._id}`)}
              />
            ))}
          </ListCard>

          {/* Groups */}
          <ListCard
            title="المجموعات"
            actionButton={{
              text: 'إضافة مجموعة',
              onClick: () => navigate('/groups/create'),
              color: 'green'
            }}
          >
            {dashboardData.groups.map((group) => (
              <ListItem
                key={group._id}
                icon="👥"
                title={group.name}
                subtitle={group.className}
                stats={[
                  { label: 'طالب', value: group.studentCount },
                  { label: 'متاح', value: group.availableSlots, color: 'text-green-600' }
                ]}
                actions={[
                  { icon: '👁️', onClick: () => console.log('View group'), tooltip: 'عرض' },
                  { icon: '✏️', onClick: () => console.log('Edit group'), tooltip: 'تعديل' }
                ]}
                onClick={() => navigate(`/groups/${group._id}`)}
              />
            ))}
          </ListCard>

          {/* Advanced Charts */}
          <AdvancedCharts
            performanceData={mockPerformanceData}
            subjectPerformance={mockSubjectPerformance}
            attendanceData={mockAttendanceData}
          />
        </div>

        {/* Right Column - Activities and Notifications */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <ListCard title="أحدث الكورسات">
            {dashboardData.recentCourses.map((course) => (
              <ListItem
                key={course._id}
                icon="📚"
                title={course.name}
                subtitle={`${course.year} - ${course.classId.name}`}
                onClick={() => navigate(`/courses/${course._id}`)}
              />
            ))}
          </ListCard>

          {/* Recent Exams */}
          <ListCard title="أحدث الامتحانات">
            {dashboardData.recentExams.map((exam) => (
              <ListItem
                key={exam._id}
                icon="📝"
                title={exam.title}
                subtitle={`${exam.courseId.name} - ${new Date(exam.startTime).toLocaleDateString('ar-EG')}`}
                onClick={() => navigate(`/exams/${exam._id}`)}
              />
            ))}
          </ListCard>

          {/* Recent Results */}
          <ListCard title="أحدث النتائج">
            {dashboardData.recentResults.map((result) => (
              <ListItem
                key={result._id}
                icon="📊"
                title={result.studentId.name}
                subtitle={result.examId.title}
                stats={[
                  { 
                    label: 'الدرجة', 
                    value: `${result.score}%`,
                    color: result.score >= 90 ? 'text-green-600' :
                           result.score >= 80 ? 'text-blue-600' :
                           result.score >= 70 ? 'text-yellow-600' :
                           result.score >= 60 ? 'text-orange-600' :
                           'text-red-600'
                  }
                ]}
                onClick={() => navigate(`/results/${result._id}`)}
              />
            ))}
          </ListCard>

          {/* Notifications */}
          <NotificationCard
            notifications={notifications}
            onMarkAsRead={(id) => {
              setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, isRead: true } : n
              ));
            }}
            onMarkAllAsRead={() => {
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <CalendarCard
          events={mockCalendarEvents}
          onEventClick={(event) => console.log('Event clicked:', event)}
        />

        {/* Timeline */}
        <Timeline
          events={mockTimelineEvents}
          onEventClick={(event) => console.log('Timeline event clicked:', event)}
        />
      </div>

      {/* Reports Section */}
      <QuickReports
        reports={mockReports}
        onGenerateReport={(id) => console.log('Generate report:', id)}
        onDownloadReport={(id) => console.log('Download report:', id)}
      />

      {/* Alerts */}
      <Alerts
        alerts={mockAlerts}
        onMarkAsRead={(id) => console.log('Mark as read:', id)}
        onMarkAllAsRead={() => console.log('Mark all as read')}
        onDismiss={(id) => console.log('Dismiss alert:', id)}
      />
    </div>
  );
};

export default ModernDashboard;
