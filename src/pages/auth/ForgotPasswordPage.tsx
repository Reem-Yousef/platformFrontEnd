import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // مسح الأخطاء عند تغيير البيانات
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors({});
  }, [email, clearError]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
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
      await requestPasswordReset(email);
      setIsSuccess(true);
    } catch (error) {
      // الخطأ سيتم عرضه من خلال context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              تم إرسال رمز الاستعادة
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              تم إرسال رمز استعادة كلمة المرور إلى{' '}
              <span className="font-medium text-blue-600">{email}</span>
            </p>
            <p className="mt-4 text-center text-sm text-gray-600">
              يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لإعادة تعيين كلمة المرور.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              to="/reset-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              إعادة تعيين كلمة المرور
            </Link>
          </div>
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            نسيان كلمة المرور
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رمز استعادة كلمة المرور
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={setEmail}
              error={validationErrors.email}
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            إرسال رمز الاستعادة
          </Button>
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
