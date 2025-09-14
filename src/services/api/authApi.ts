import apiClient from './apiClient';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialization?: string;
}

export interface Verify2FAData {
  email: string;
  code: string;
}

export interface PasswordResetData {
  email: string;
  code: string;
  newPassword: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  phone?: string;
  specialization?: string;
}

export interface AuthResponse {
  token: string;
  teacher: Teacher;
}

export const authApi = {
  // تسجيل الدخول
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/teacher/auth/login', data);
    return response.data.data;
  },

  // تسجيل حساب جديد
  register: async (data: RegisterData): Promise<{ teacherId: string }> => {
    const response = await apiClient.post('/teacher/auth/register', data);
    return response.data.data;
  },

  // التحقق من البريد الإلكتروني (2FA)
  verify2FA: async (data: Verify2FAData): Promise<AuthResponse> => {
    const response = await apiClient.post('/teacher/auth/verify-2fa', data);
    return response.data.data;
  },

  // إعادة إرسال رمز التحقق
  resendVerificationCode: async (email: string): Promise<void> => {
    await apiClient.post('/teacher/auth/resend-verification', { email });
  },

  // طلب استعادة كلمة المرور
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/teacher/auth/request-password-reset', { email });
  },

  // إعادة تعيين كلمة المرور
  resetPassword: async (data: PasswordResetData): Promise<void> => {
    await apiClient.post('/teacher/auth/reset-password', data);
  },

  // الحصول على الملف الشخصي
  getProfile: async (): Promise<Teacher> => {
    const response = await apiClient.get('/teacher/profile');
    return response.data.data;
  },

  // تحديث الملف الشخصي
  updateProfile: async (data: Partial<Teacher>): Promise<Teacher> => {
    const response = await apiClient.put('/teacher/profile', data);
    return response.data.data;
  },

  // تسجيل الخروج
  logout: async (): Promise<void> => {
    // في الباك إند الحالي لا يوجد endpoint للوجوت، فقط نحذف التوكن محلياً
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherData');
  },
};
