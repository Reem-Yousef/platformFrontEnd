# منصة الكورسات - الفرونت إند

هذا هو الفرونت إند لمنصة الكورسات المخصصة للمعلمين.

## الميزات

- ✅ نظام مصادقة كامل للمعلمين
- ✅ تسجيل الدخول والتسجيل
- ✅ التحقق من البريد الإلكتروني
- ✅ استعادة كلمة المرور
- ✅ حماية الصفحات
- ✅ واجهة مستخدم عربية جميلة
- ✅ تصميم متجاوب

## التقنيات المستخدمة

- React 19
- TypeScript
- React Router DOM
- Axios
- Tailwind CSS
- Context API

## التثبيت والتشغيل

### 1. تثبيت التبعيات

```bash
cd frontend
npm install
```

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env` في مجلد `frontend`:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

### 3. تشغيل المشروع

```bash
npm start
```

سيتم فتح التطبيق في المتصفح على العنوان: `http://localhost:3000`

## البنية

```
src/
├── components/          # المكونات المشتركة
│   ├── auth/           # مكونات المصادقة
│   └── common/         # مكونات عامة
├── contexts/           # React Contexts
├── pages/              # صفحات التطبيق
│   ├── auth/          # صفحات المصادقة
│   └── DashboardPage.tsx
├── services/           # خدمات API
│   └── api/
└── App.tsx            # الملف الرئيسي
```

## الصفحات المتاحة

- `/` - الصفحة الرئيسية (إعادة توجيه)
- `/login` - تسجيل الدخول
- `/register` - إنشاء حساب جديد
- `/verify-email` - التحقق من البريد الإلكتروني
- `/forgot-password` - نسيان كلمة المرور
- `/reset-password` - إعادة تعيين كلمة المرور
- `/dashboard` - لوحة التحكم (محمية)

## API Endpoints

جميع طلبات API ترسل إلى الباك إند على العنوان:
- `POST /teacher/auth/register` - تسجيل حساب جديد
- `POST /teacher/auth/login` - تسجيل الدخول
- `POST /teacher/auth/verify-2fa` - التحقق من البريد الإلكتروني
- `POST /teacher/auth/resend-verification` - إعادة إرسال رمز التحقق
- `POST /teacher/auth/request-password-reset` - طلب استعادة كلمة المرور
- `POST /teacher/auth/reset-password` - إعادة تعيين كلمة المرور

## الحماية

- جميع الصفحات محمية باستخدام `ProtectedRoute`
- التوكن محفوظ في `localStorage`
- إعادة توجيه تلقائية عند انتهاء صلاحية التوكن

## التطوير

### إضافة صفحة جديدة

1. أنشئ المكون في مجلد `pages`
2. أضف المسار في `App.tsx`
3. استخدم `ProtectedRoute` إذا كانت الصفحة تحتاج مصادقة

### إضافة خدمة API جديدة

1. أضف الدالة في `services/api/authApi.ts`
2. استخدم `apiClient` للطلبات
3. أضف الأنواع في نفس الملف

## البناء للإنتاج

```bash
npm run build
```

سيتم إنشاء مجلد `build` يحتوي على الملفات المُحسّنة للإنتاج.