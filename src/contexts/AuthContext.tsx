import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authApi, Teacher, LoginData, RegisterData, Verify2FAData, PasswordResetData } from '../services/api/authApi';

// أنواع البيانات
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  teacher: Teacher | null;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<string>;
  verify2FA: (data: Verify2FAData) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: PasswordResetData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// أنواع الإجراءات
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { teacher: Teacher; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// الحالة الابتدائية
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  teacher: null,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        teacher: action.payload.teacher,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        teacher: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        teacher: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// إنشاء Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // التحقق من التوكن المحفوظ عند تحميل التطبيق
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('teacherToken');
      const teacherData = localStorage.getItem('teacherData');

      if (token && teacherData) {
        try {
          const teacher = JSON.parse(teacherData);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { teacher, token },
          });
        } catch (error) {
          // إذا كان هناك خطأ في تحليل البيانات، احذفها
          localStorage.removeItem('teacherToken');
          localStorage.removeItem('teacherData');
          dispatch({ type: 'AUTH_FAILURE', payload: 'خطأ في بيانات المصادقة' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // تسجيل الدخول
  const login = async (data: LoginData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authApi.login(data);
      
      // حفظ التوكن والبيانات في localStorage
      localStorage.setItem('teacherToken', response.token);
      localStorage.setItem('teacherData', JSON.stringify(response.teacher));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: response,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // التسجيل
  const register = async (data: RegisterData): Promise<string> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authApi.register(data);
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.teacherId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // التحقق من البريد الإلكتروني
  const verify2FA = async (data: Verify2FAData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authApi.verify2FA(data);
      
      // حفظ التوكن والبيانات في localStorage
      localStorage.setItem('teacherToken', response.token);
      localStorage.setItem('teacherData', JSON.stringify(response.teacher));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: response,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التحقق';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // إعادة إرسال رمز التحقق
  const resendVerificationCode = async (email: string): Promise<void> => {
    try {
      await authApi.resendVerificationCode(email);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إرسال رمز التحقق';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // طلب استعادة كلمة المرور
  const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      await authApi.requestPasswordReset(email);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء طلب استعادة كلمة المرور';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // إعادة تعيين كلمة المرور
  const resetPassword = async (data: PasswordResetData): Promise<void> => {
    try {
      await authApi.resetPassword(data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // تسجيل الخروج
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // حتى لو فشل الـ API، احذف البيانات محلياً
      dispatch({ type: 'LOGOUT' });
    }
  };

  // مسح الخطأ
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    verify2FA,
    resendVerificationCode,
    requestPasswordReset,
    resetPassword,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook لاستخدام Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
