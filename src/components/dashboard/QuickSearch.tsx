import React, { useState, useRef, useEffect } from 'react';

interface SearchResult {
  id: string;
  type: 'course' | 'exam' | 'student' | 'class' | 'group';
  title: string;
  subtitle: string;
  icon: string;
  url: string;
}

interface QuickSearchProps {
  onResultClick: (result: SearchResult) => void;
}

const QuickSearch: React.FC<QuickSearchProps> = ({ onResultClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // بيانات تجريبية للبحث
  const mockData: SearchResult[] = [
    {
      id: '1',
      type: 'course',
      title: 'الرياضيات المتقدمة',
      subtitle: 'كورس الرياضيات للصف الثالث',
      icon: '📚',
      url: '/courses/1'
    },
    {
      id: '2',
      type: 'exam',
      title: 'امتحان الوحدة الأولى',
      subtitle: 'امتحان الرياضيات - 15 مارس',
      icon: '📝',
      url: '/exams/1'
    },
    {
      id: '3',
      type: 'student',
      title: 'أحمد محمد',
      subtitle: 'الصف الثالث - المجموعة أ',
      icon: '👨‍🎓',
      url: '/students/1'
    },
    {
      id: '4',
      type: 'class',
      title: 'الصف الثالث أ',
      subtitle: '25 طالب - 3 كورسات',
      icon: '👥',
      url: '/classes/1'
    },
    {
      id: '5',
      type: 'group',
      title: 'المجموعة أ',
      subtitle: 'الصف الثالث - 12 طالب',
      icon: '👥',
      url: '/groups/1'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    
    // محاكاة البحث
    setTimeout(() => {
      const filteredResults = mockData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsOpen(true);
      setSelectedIndex(-1);
      setLoading(false);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'class':
        return 'bg-purple-100 text-purple-800';
      case 'group':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course':
        return 'كورس';
      case 'exam':
        return 'امتحان';
      case 'student':
        return 'طالب';
      case 'class':
        return 'صف';
      case 'group':
        return 'مجموعة';
      default:
        return 'عنصر';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* شريط البحث */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="البحث السريع..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* نتائج البحث */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">جاري البحث...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{result.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-gray-400">
                      ↵
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>لا توجد نتائج لـ "{query}"</p>
              <p className="text-sm mt-1">جرب البحث بكلمات مختلفة</p>
            </div>
          ) : null}
        </div>
      )}

      {/* اختصارات لوحة المفاتيح */}
      {!isOpen && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="flex items-center space-x-1 space-x-reverse">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
              Ctrl
            </kbd>
            <span className="text-xs text-gray-400">+</span>
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
              K
            </kbd>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSearch;
