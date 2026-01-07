# 🚀 دليل استخدام GitHub Actions Extension في VS Code

## ✅ الفوائد الرئيسية

### 1. **تحرير Workflows بسهولة**
- ✅ **Syntax Highlighting** - تلوين الكود لملفات `.yml` و `.yaml`
- ✅ **IntelliSense** - اقتراحات تلقائية أثناء الكتابة
- ✅ **Validation** - فحص الأخطاء قبل الرفع
- ✅ **Auto-completion** - إكمال تلقائي للـ actions والـ steps

### 2. **عرض حالة Workflows**
- ✅ **Workflow Runs** - عرض جميع عمليات التشغيل
- ✅ **Status Icons** - أيقونات للحالة (نجح/فشل/قيد التشغيل)
- ✅ **Real-time Updates** - تحديثات فورية للحالة

### 3. **تشغيل Workflows**
- ✅ **Manual Trigger** - تشغيل workflow يدوياً من VS Code
- ✅ **Input Parameters** - إدخال المعاملات المطلوبة
- ✅ **Branch Selection** - اختيار الفرع للتشغيل

### 4. **عرض Logs**
- ✅ **View Logs** - عرض سجلات التنفيذ مباشرة في VS Code
- ✅ **Error Highlighting** - تمييز الأخطاء في السجلات
- ✅ **Step-by-step** - عرض كل step بشكل منفصل

### 5. **إدارة Secrets**
- ✅ **View Secrets** - عرض قائمة الـ secrets (بدون القيم)
- ✅ **Secret References** - التحقق من استخدام الـ secrets في workflows

---

## 🎯 كيفية الاستخدام

### 1. **فتح Workflow File**
```
1. افتح أي ملف .yml في .github/workflows/
2. Extension سيعمل تلقائياً
3. سترى أيقونات واقتراحات
```

### 2. **عرض Workflow Runs**
```
1. اضغط على أيقونة GitHub Actions في Sidebar
2. أو استخدم Command Palette: "GitHub Actions: View Workflow Runs"
3. اختر workflow من القائمة
4. شاهد جميع عمليات التشغيل
```

### 3. **تشغيل Workflow يدوياً**
```
1. افتح ملف workflow
2. اضغط على أيقونة "Run Workflow" في أعلى الملف
3. أو استخدم Command Palette: "GitHub Actions: Run Workflow"
4. أدخل المعاملات المطلوبة (profile, platform, etc.)
5. اضغط Run
```

### 4. **عرض Logs**
```
1. من قائمة Workflow Runs
2. اضغط على أي run
3. شاهد جميع الـ steps
4. اضغط على step لعرض logs
```

### 5. **التحقق من Syntax**
```
1. Extension يتحقق تلقائياً من الأخطاء
2. سترى خطوط حمراء تحت الأخطاء
3. Hover على الخطأ لرؤية التفاصيل
```

---

## 📋 الميزات المفيدة لمشروع RARE 4N

### ✅ للـ Workflows الموجودة:

#### 1. **build-ios.yml**
- ✅ **تشغيل يدوي:** اختر profile (development/preview/production)
- ✅ **عرض Logs:** تابع عملية البناء خطوة بخطوة
- ✅ **التحقق من Secrets:** تأكد من وجود جميع الـ secrets المطلوبة

#### 2. **build-android.yml**
- ✅ **تشغيل يدوي:** اختر profile
- ✅ **عرض Logs:** تابع عملية البناء
- ✅ **التحقق من Secrets:** تأكد من Google Play secrets

#### 3. **deploy-web.yml**
- ✅ **تشغيل يدوي:** نشر Client Portal
- ✅ **عرض Logs:** تابع عملية النشر
- ✅ **التحقق من Secrets:** تأكد من Cloudflare secrets

---

## 🔧 Command Palette Commands

افتح Command Palette (`Ctrl+Shift+P` أو `Cmd+Shift+P`) واكتب:

```
GitHub Actions: View Workflow Runs
GitHub Actions: Run Workflow
GitHub Actions: View Workflow Logs
GitHub Actions: Open Workflow in GitHub
GitHub Actions: Refresh
```

---

## 💡 نصائح للاستخدام

### 1. **Validation أثناء الكتابة**
- Extension يتحقق من الأخطاء فوراً
- استخدمه لتصحيح الأخطاء قبل الرفع

### 2. **عرض Logs للـ Debugging**
- إذا فشل workflow، افتح logs مباشرة
- ابحث عن الأخطاء في السجلات

### 3. **تشغيل Workflows للاختبار**
- استخدم manual trigger لاختبار workflows
- جرب مع profiles مختلفة

### 4. **التحقق من Secrets**
- Extension يعرض قائمة الـ secrets المستخدمة
- تأكد من إضافة جميع الـ secrets المطلوبة

---

## 🎯 مثال عملي

### تشغيل iOS Build:

1. **افتح** `.github/workflows/build-ios.yml`
2. **اضغط** على أيقونة "Run Workflow" (أعلى الملف)
3. **اختر** profile: `production`
4. **اضغط** Run
5. **تابع** Logs في VS Code
6. **تحقق** من النتيجة

---

## ⚠️ ملاحظات مهمة

1. **Authentication:** يجب تسجيل الدخول إلى GitHub من VS Code
2. **Permissions:** يحتاج permissions للـ repository
3. **Secrets:** Extension لا يعرض قيم الـ secrets (لأسباب أمنية)
4. **Rate Limits:** GitHub API له حدود، لا تفرط في الاستخدام

---

## 🔗 روابط مفيدة

- **Extension Page:** [GitHub Actions - VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)
- **Documentation:** [GitHub Actions Docs](https://docs.github.com/en/actions)
- **Workflow Syntax:** [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**التاريخ:** 2026-01-06  
**Extension:** GitHub Actions by GitHub  
**Downloads:** 430,000+  
**Rating:** ⭐⭐⭐ (3/4)

