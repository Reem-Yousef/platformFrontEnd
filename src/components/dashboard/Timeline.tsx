import React from 'react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  type: 'exam' | 'course' | 'meeting' | 'deadline' | 'holiday';
  date: string;
  time?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onEventClick }) => {
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'course':
        return '📚';
      case 'meeting':
        return '🤝';
      case 'deadline':
        return '⏰';
      case 'holiday':
        return '🎉';
      default:
        return '📅';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'course':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deadline':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'holiday':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'قادم';
      case 'ongoing':
        return 'جاري';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'منخفض';
      case 'medium':
        return 'متوسط';
      case 'high':
        return 'عالي';
      case 'urgent':
        return 'عاجل';
      default:
        return 'غير محدد';
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = new Date(event.date);
    const dateKey = date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">الجدول الزمني</h2>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
            📅 عرض التقويم
          </button>
          <button className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
            ➕ إضافة حدث
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="relative">
            {/* Date header */}
            <div className="sticky top-0 z-10 bg-white py-2 mb-4">
              <h3 className="text-md font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                📅 {date}
              </h3>
            </div>

            {/* Events for this date */}
            <div className="space-y-4 mr-6">
              {dateEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="relative cursor-pointer group"
                >
                  {/* Timeline line */}
                  <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline dot */}
                  <div className="absolute right-4 top-6 w-3 h-3 bg-white border-2 border-gray-300 rounded-full transform translate-x-1/2 group-hover:border-blue-500 transition-colors"></div>

                  {/* Event card */}
                  <div className="relative bg-white border border-gray-200 rounded-lg p-4 mr-8 hover:shadow-md transition-shadow group-hover:border-blue-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                          <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          
                          <div className="flex items-center space-x-3 space-x-reverse text-xs">
                            {event.time && (
                              <span className="text-gray-500">🕐 {event.time}</span>
                            )}
                            <span className={`px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                              {getStatusLabel(event.status)}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}>
                              {getPriorityLabel(event.priority)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          ✏️
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          👁️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أحداث مجدولة</h3>
          <p className="text-gray-500 mb-4">ابدأ بإضافة أحداث جديدة لجدولك الزمني</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ➕ إضافة حدث جديد
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
