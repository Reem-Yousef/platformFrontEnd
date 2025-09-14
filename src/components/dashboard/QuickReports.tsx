import React, { useState } from 'react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'attendance' | 'performance' | 'financial';
  icon: string;
  color: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
  downloadUrl?: string;
}

interface QuickReportsProps {
  reports: Report[];
  onGenerateReport: (reportId: string) => void;
  onDownloadReport: (reportId: string) => void;
}

const QuickReports: React.FC<QuickReportsProps> = ({
  reports,
  onGenerateReport,
  onDownloadReport
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const reportTypes = [
    { id: 'all', label: 'الكل', icon: '📊' },
    { id: 'academic', label: 'أكاديمي', icon: '📚' },
    { id: 'attendance', label: 'حضور', icon: '📋' },
    { id: 'performance', label: 'أداء', icon: '📈' },
    { id: 'financial', label: 'مالي', icon: '💰' }
  ];

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedType);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return '✅';
      case 'generating':
        return '⏳';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'generating':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready':
        return 'جاهز';
      case 'generating':
        return 'جاري التوليد';
      case 'error':
        return 'خطأ';
      default:
        return 'غير محدد';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'academic':
        return 'أكاديمي';
      case 'attendance':
        return 'حضور';
      case 'performance':
        return 'أداء';
      case 'financial':
        return 'مالي';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">التقارير السريعة</h2>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            📊 إنشاء تقرير مخصص
          </button>
        </div>

        {/* Type filters */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedType === type.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <span className="text-2xl">{report.icon}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)} {getStatusLabel(report.status)}
                  </span>
                </div>

                <h3 className="font-medium text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>📅 {getTypeLabel(report.type)}</span>
                  <span>🕐 {new Date(report.lastGenerated).toLocaleDateString('ar-EG')}</span>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  {report.status === 'ready' ? (
                    <button
                      onClick={() => onDownloadReport(report.id)}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📥 تحميل
                    </button>
                  ) : report.status === 'generating' ? (
                    <button
                      disabled
                      className="flex-1 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg cursor-not-allowed"
                    >
                      ⏳ جاري التوليد...
                    </button>
                  ) : (
                    <button
                      onClick={() => onGenerateReport(report.id)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔄 إعادة المحاولة
                    </button>
                  )}

                  <button
                    onClick={() => onGenerateReport(report.id)}
                    className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير</h3>
            <p className="text-gray-500 mb-4">لا توجد تقارير متاحة لهذا النوع</p>
            <button
              onClick={() => setSelectedType('all')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              عرض جميع التقارير
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3">📊</span>
              <div className="text-right">
                <p className="font-medium">تقرير الأداء الشهري</p>
                <p className="text-sm opacity-75">توليد تلقائي</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">📋</span>
              <div className="text-right">
                <p className="font-medium">تقرير الحضور</p>
                <p className="text-sm opacity-75">أسبوعي</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl mr-3">📈</span>
              <div className="text-right">
                <p className="font-medium">تقرير التقدم</p>
                <p className="text-sm opacity-75">فصلي</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReports;
