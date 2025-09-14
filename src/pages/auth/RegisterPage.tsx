import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // إعادة توجيه إذا كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // مسح الأخطاء عند تغيير البيانات
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors({});
  }, [formData, clearError]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'الاسم يجب أن يكون على الأقل حرفين';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      errors.password = 'كلمة المرور يجب أن تكون على الأقل 8 أحرف';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      errors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }
    
    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح';
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
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      // توجيه المستخدم مباشرة إلى صفحة تسجيل الدخول
      navigate('/login', { 
        state: { 
          message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.',
          email: formData.email
        } 
      });
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
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              تسجيل الدخول إلى حسابك
            </Link>
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
              label="الاسم الكامل"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={validationErrors.name}
              placeholder="أدخل اسمك الكامل"
              required
            />
            
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
            
            <Input
              label="تأكيد كلمة المرور"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              error={validationErrors.confirmPassword}
              placeholder="أعد إدخال كلمة المرور"
              required
            />
            
            <Input
              label="رقم الهاتف (اختياري)"
              type="tel"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={validationErrors.phone}
              placeholder="أدخل رقم هاتفك"
            />
            
            <Input
              label="التخصص (اختياري)"
              value={formData.specialization}
              onChange={(value) => handleInputChange('specialization', value)}
              placeholder="أدخل تخصصك"
            />
          </div>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            إنشاء الحساب
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
