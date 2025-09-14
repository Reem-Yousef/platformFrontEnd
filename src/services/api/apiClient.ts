import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// إنشاء instance من axios
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor لإضافة التوكن
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('teacherToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor للتعامل مع الأخطاء
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    // إذا كان التوكن منتهي الصلاحية أو غير صحيح
    if (error.response?.status === 401) {
      localStorage.removeItem('teacherToken');
      localStorage.removeItem('teacherData');
      // إعادة توجيه إلى صفحة تسجيل الدخول
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
