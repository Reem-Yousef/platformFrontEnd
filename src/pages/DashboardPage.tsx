import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

const DashboardPage: React.FC = () => {
  const { teacher, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدرس</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{dashboardData.teacher.name}</p>
                <p className="text-xs text-gray-500">{dashboardData.teacher.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="h-6 w-6 text-blue-600">👥</div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="h-6 w-6 text-green-600">📚</div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الكورسات</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="h-6 w-6 text-purple-600">📝</div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الامتحانات</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="h-6 w-6 text-yellow-600">📊</div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">متوسط الدرجات</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Classes and Groups */}
          <div className="lg:col-span-2 space-y-8">
            {/* Classes Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">الصفوف الدراسية</h2>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    <span className="ml-2">+</span>
                    إضافة صف
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.classes.map((cls) => (
                    <div key={cls._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <div className="h-5 w-5 text-blue-600">👥</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{cls.name}</h3>
                          <p className="text-sm text-gray-500">{cls.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{cls.studentCount}</p>
                          <p className="text-xs text-gray-500">طالب</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{cls.courseCount}</p>
                          <p className="text-xs text-gray-500">كورس</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{cls.examCount}</p>
                          <p className="text-xs text-gray-500">امتحان</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          👁️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Groups Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">المجموعات</h2>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                    <span className="ml-2">+</span>
                    إضافة مجموعة
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.groups.map((group) => (
                    <div key={group._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <div className="h-5 w-5 text-green-600">👥</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.className}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{group.studentCount}</p>
                          <p className="text-xs text-gray-500">طالب</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{group.availableSlots}</p>
                          <p className="text-xs text-gray-500">مقعد متاح</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          👁️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activities */}
          <div className="space-y-8">
            {/* Recent Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">أحدث الكورسات</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentCourses.map((course) => (
                    <div key={course._id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.year}</p>
                      <p className="text-sm text-gray-500">{course.classId.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Exams */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">أحدث الامتحانات</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentExams.map((exam) => (
                    <div key={exam._id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900">{exam.title}</h3>
                      <p className="text-sm text-gray-500">{exam.courseId.name}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        📅 {new Date(exam.startTime).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">أحدث النتائج</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentResults.map((result) => (
                    <div key={result._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{result.studentId.name}</h3>
                          <p className="text-sm text-gray-500">{result.examId.title}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          result.score >= 90 ? 'text-green-600 bg-green-100' :
                          result.score >= 80 ? 'text-blue-600 bg-blue-100' :
                          result.score >= 70 ? 'text-yellow-600 bg-yellow-100' :
                          result.score >= 60 ? 'text-orange-600 bg-orange-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {result.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="ml-2">+</span>
              إنشاء كورس جديد
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <span className="ml-2">+</span>
              إنشاء امتحان جديد
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="ml-2">+</span>
              إضافة طالب
            </button>
            <button className="flex items-center justify-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              📊
              عرض التقارير
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
