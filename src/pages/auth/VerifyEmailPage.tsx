import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA, resendVerificationCode, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const email = location.state?.email;
  const teacherId = location.state?.teacherId;

  // إعادة توجيه إذا لم تكن هناك بيانات أو كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    if (!email || !teacherId) {
      navigate('/register');
    }
  }, [isAuthenticated, email, teacherId, navigate]);

  // مسح الأخطاء عند تغيير البيانات
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors({});
  }, [verificationCode, clearError]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!verificationCode.trim()) {
      errors.code = 'رمز التحقق مطلوب';
    } else if (!/^\d{6}$/.test(verificationCode)) {
      errors.code = 'رمز التحقق يجب أن يكون 6 أرقام';
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
      await verify2FA({
        email: email!,
        code: verificationCode,
      });
      navigate('/dashboard');
    } catch (error) {
      // الخطأ سيتم عرضه من خلال context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      await resendVerificationCode(email);
      setResendMessage('تم إرسال رمز التحقق الجديد إلى بريدك الإلكتروني');
    } catch (error) {
      setResendMessage('حدث خطأ أثناء إرسال رمز التحقق');
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!email || !teacherId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            التحقق من البريد الإلكتروني
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            تم إرسال رمز التحقق إلى{' '}
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {resendMessage && (
            <div className={`px-4 py-3 rounded-md ${
              resendMessage.includes('تم إرسال') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {resendMessage}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="رمز التحقق"
              value={verificationCode}
              onChange={setVerificationCode}
              error={validationErrors.code}
              placeholder="أدخل رمز التحقق المكون من 6 أرقام"
              required
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              لم تستلم الرمز؟{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
              </button>
            </p>
          </div>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            التحقق من الرمز
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

export default VerifyEmailPage;
