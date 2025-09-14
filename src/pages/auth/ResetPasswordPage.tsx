import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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
    
    if (!formData.code.trim()) {
      errors.code = 'رمز الاستعادة مطلوب';
    } else if (!/^\d{6}$/.test(formData.code)) {
      errors.code = 'رمز الاستعادة يجب أن يكون 6 أرقام';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'كلمة المرور يجب أن تكون على الأقل 8 أحرف';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.newPassword)) {
      errors.newPassword = 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
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
      await resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      });
      setIsSuccess(true);
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
              تم تغيير كلمة المرور بنجاح
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              تسجيل الدخول
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
            إعادة تعيين كلمة المرور
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أدخل رمز الاستعادة وكلمة المرور الجديدة
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
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={validationErrors.email}
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
            
            <Input
              label="رمز الاستعادة"
              value={formData.code}
              onChange={(value) => handleInputChange('code', value)}
              error={validationErrors.code}
              placeholder="أدخل رمز الاستعادة المكون من 6 أرقام"
              required
            />
            
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              value={formData.newPassword}
              onChange={(value) => handleInputChange('newPassword', value)}
              error={validationErrors.newPassword}
              placeholder="أدخل كلمة المرور الجديدة"
              required
            />
            
            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              error={validationErrors.confirmPassword}
              placeholder="أعد إدخال كلمة المرور الجديدة"
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
            إعادة تعيين كلمة المرور
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

export default ResetPasswordPage;
