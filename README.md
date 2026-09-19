# Kyle Hub

مكتبة مجتمعية لمطوّري روبلوكس لمشاركة واجهات UI جاهزة، وأكواد مساعدة، وسكربتات ألعاب مفتوحة المصدر.

- ثيم داكن (أحمر/أسود) وفاتح (أحمر/أبيض)
- عربي / English مع دعم كامل لـ RTL
- Firebase Auth (Google + Email/Password) وFirestore
- رفع الصور عبر ImgBB
- صلاحيات رفع يمنحها المشرف فقط

## هيكل المشروع

```
kyle-hub/
├── index.html              الهيكل الأساسي فقط
├── 404.html                صفحة الخطأ
├── manifest.webmanifest    إعدادات التثبيت كتطبيق (PWA)
├── firebase.json           إعدادات الاستضافة والقواعد
├── .firebaserc             ربط المشروع (v-scans)
├── firestore.rules         قواعد الأمان — انشرها!
├── assets/                 الأيقونات
├── css/
│   ├── variables.css       الألوان والخطوط (داكن/فاتح)
│   ├── base.css            التصفير + الشعار + إمكانية الوصول
│   ├── layout.css          الهيدر، القائمة الجانبية، الواجهة الرئيسية
│   ├── components.css      الأزرار، البطاقات، النماذج، النوافذ، التنبيهات
│   └── views.css           تنسيقات لوحة الإدارة
└── js/
    ├── main.js             نقطة البداية وربط الأحداث
    ├── config.js           كل الإعدادات والمفاتيح
    ├── firebase.js         تهيئة Firebase
    ├── state.js            الحالة العامة
    ├── router.js           التنقل بين الصفحات (#/home ...)
    ├── actions.js          نسخ / عرض / حذف السكربتات
    ├── utils.js            دوال مساعدة (تهريب HTML، تواريخ ...)
    ├── icons.js            الأيقونات
    ├── i18n/               en.js · ar.js · index.js
    ├── ui/                 toast · modal · prefs (ثيم + لغة)
    ├── services/           auth · data (Firestore) · imgbb
    ├── components/         header · sidebar · scriptCard · results · authModal · detailModal · common
    └── views/              home · categories · recent · upload · profile · admin
```

## التشغيل

1. **انشر القواعد:** Firebase Console ← Firestore ← Rules، والصق محتوى `firestore.rules`.
2. **فعّل تسجيل الدخول:** Authentication ← Sign-in method ← Google + Email/Password.
3. **أضف نطاق موقعك:** Authentication ← Settings ← Authorized domains.
4. **شغّل محليًا** (لا يعمل بفتح الملف مباشرة لأنه يستخدم ES Modules):
   ```bash
   npx serve .
   # أو
   python3 -m http.server 8000
   ```
   `localhost` مسموح افتراضيًا في Firebase.
5. **انشر:**
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase deploy
   ```
6. سجّل الدخول بحساب **anwarbah96@gmail.com عبر Google**، ثم أنشئ الفئات من لوحة الإدارة.

## نموذج البيانات (Firestore)

| المجموعة | المعرّف | الاستخدام |
|---|---|---|
| `scripts` | تلقائي | المنشورات (عنوان، كود، صورة، فئة، ناشر، تاريخ) |
| `categories` | تلقائي | الفئات بالإنجليزية والعربية |
| `uploaders` | البريد بحروف صغيرة | من لديهم إذن الرفع |
| `users` | uid | ملفات المستخدمين (تظهر للمشرف) |

## ملاحظات أمنية

- الصلاحيات تُفرض في `firestore.rules` وليس في المتصفح فقط.
- الحساب المشرف والناشرون يُعتمدون فقط إذا كان بريدهم **موثّقًا** (Google موثّق تلقائيًا).
- مفتاح ImgBB ظاهر في كود المتصفح بطبيعة التطبيقات بلا خادم. بدّله إذا أسيء استخدامه (في `js/config.js`).
- كل محتوى المستخدمين يُهرَّب قبل عرضه لمنع XSS.
