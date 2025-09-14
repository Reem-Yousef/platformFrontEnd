import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // إعادة توجيه إذا كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // قراءة الرسالة من صفحة التسجيل
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // تعيين البريد الإلكتروني إذا كان متوفراً
      if (location.state.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location.state]);

  // مسح الأخطاء عند تغيير البيانات
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors({});
  }, [formData, clearError]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      // الخطأ سيتم عرضه من خلال context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={validationErrors.email}
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
            
            <Input
              label="كلمة المرور"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={validationErrors.password}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
