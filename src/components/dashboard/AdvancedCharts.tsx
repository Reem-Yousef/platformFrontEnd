import React from 'react';
import SimpleChart from './SimpleChart';

interface AdvancedChartsProps {
  performanceData: Array<{
    month: string;
    students: number;
    courses: number;
    exams: number;
    averageScore: number;
  }>;
  subjectPerformance: Array<{
    subject: string;
    averageScore: number;
    totalStudents: number;
    passRate: number;
  }>;
  attendanceData: Array<{
    month: string;
    present: number;
    absent: number;
    late: number;
  }>;
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  performanceData,
  subjectPerformance,
  attendanceData
}) => {
  const performanceChartData = performanceData.map(item => ({
    label: item.month,
    value: item.averageScore,
    color: '#3B82F6'
  }));

  const subjectChartData = subjectPerformance.map(item => ({
    label: item.subject,
    value: item.averageScore,
    color: item.averageScore >= 80 ? '#10B981' : 
           item.averageScore >= 70 ? '#F59E0B' : '#EF4444'
  }));

  const attendanceChartData = attendanceData.map(item => ({
    label: item.month,
    value: item.present,
    color: '#10B981'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* أداء الطلاب الشهري */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء الطلاب الشهري</h3>
        <SimpleChart 
          data={performanceChartData} 
          type="line" 
          height={200}
        />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(performanceData.reduce((sum, item) => sum + item.averageScore, 0) / performanceData.length)}%
            </p>
            <p className="text-sm text-gray-500">متوسط الأداء</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {performanceData.length}
            </p>
            <p className="text-sm text-gray-500">عدد الأشهر</p>
          </div>
        </div>
      </div>

      {/* أداء المواد الدراسية */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء المواد الدراسية</h3>
        <SimpleChart 
          data={subjectChartData} 
          type="bar" 
          height={200}
        />
        <div className="mt-4 space-y-2">
          {subjectPerformance.slice(0, 3).map((subject, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{subject.subject}</span>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className={`text-sm font-medium ${
                  subject.averageScore >= 80 ? 'text-green-600' :
                  subject.averageScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {subject.averageScore}%
                </span>
                <span className="text-xs text-gray-500">({subject.totalStudents} طالب)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نسبة الحضور */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">نسبة الحضور</h3>
        <SimpleChart 
          data={attendanceChartData} 
          type="pie" 
          height={200}
        />
        <div className="mt-4 space-y-3">
          {attendanceData.slice(0, 3).map((item, index) => {
            const total = item.present + item.absent + item.late;
            const presentRate = Math.round((item.present / total) * 100);
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <span className="text-sm font-medium text-gray-900">{presentRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${presentRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-sm font-medium text-gray-900">إجمالي الكورسات</p>
                <p className="text-xs text-gray-500">هذا الفصل الدراسي</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {performanceData.reduce((sum, item) => sum + item.courses, 0)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-2xl">👨‍🎓</span>
              <div>
                <p className="text-sm font-medium text-gray-900">إجمالي الطلاب</p>
                <p className="text-xs text-gray-500">مسجلين حالياً</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {performanceData.reduce((sum, item) => sum + item.students, 0)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-2xl">📝</span>
              <div>
                <p className="text-sm font-medium text-gray-900">إجمالي الامتحانات</p>
                <p className="text-xs text-gray-500">تم إجراؤها</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {performanceData.reduce((sum, item) => sum + item.exams, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* توزيع الدرجات */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الدرجات</h3>
        <div className="space-y-4">
          {[
            { range: '90-100', color: 'bg-green-500', percentage: 25 },
            { range: '80-89', color: 'bg-blue-500', percentage: 35 },
            { range: '70-79', color: 'bg-yellow-500', percentage: 25 },
            { range: '60-69', color: 'bg-orange-500', percentage: 10 },
            { range: 'أقل من 60', color: 'bg-red-500', percentage: 5 }
          ].map((grade, index) => (
            <div key={index} className="flex items-center space-x-3 space-x-reverse">
              <div className="w-16 text-sm text-gray-600">{grade.range}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${grade.color}`}
                  style={{ width: `${grade.percentage}%` }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-900 text-left">
                {grade.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مؤشرات الأداء */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">مؤشرات الأداء</h3>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <div className="text-3xl font-bold mb-2">85%</div>
            <div className="text-sm opacity-90">معدل النجاح العام</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600 mb-1">92%</div>
              <div className="text-xs text-green-600">معدل الحضور</div>
            </div>
            
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600 mb-1">78%</div>
              <div className="text-xs text-yellow-600">رضا الطلاب</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
