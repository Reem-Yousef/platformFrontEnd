import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'course' | 'meeting' | 'deadline';
  description?: string;
}

interface CalendarCardProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // إضافة أيام الشهر السابق
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // إضافة أيام الشهر الحالي
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // إضافة أيام الشهر التالي
    const remainingDays = 42 - days.length; // 6 أسطر × 7 أيام
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

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
      default:
        return '📅';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'course':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'deadline':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">التقويم</h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              ←
            </button>
            <span className="text-sm font-medium text-gray-700">
              {getMonthName(currentDate)}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* أيام الأسبوع */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* أيام الشهر */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[60px] p-1 border border-gray-100 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-xs text-right mb-1 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'font-bold' : ''}`}>
                  {day.date.getDate()}
                </div>
                
                {/* الأحداث */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`text-xs px-1 py-0.5 rounded cursor-pointer ${getEventTypeColor(event.type)}`}
                      title={event.title}
                    >
                      <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                      {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 2} أكثر
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* قائمة الأحداث القادمة */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">الأحداث القادمة</h3>
          <div className="space-y-2">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="flex items-center space-x-2 space-x-reverse p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
