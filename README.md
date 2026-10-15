# ADDOMA TRADING SERVICES (ATS)

موقع تعريفي ثنائي اللغة (English / العربية) لشركة ADDOMA TRADING SERVICES، مبني كواجهة ثابتة سريعة ومهيأة للنشر على Cloudflare Pages.

## التشغيل المحلي

```bash
npm start
```

ثم افتح `http://localhost:3000`.

## بناء نسخة النشر

```bash
npm run build
```

الناتج الجاهز للنشر يوجد داخل مجلد `dist`.

## النشر على Cloudflare Pages

1. ارفع هذا المشروع إلى مستودع GitHub.
2. افتح Cloudflare Dashboard ثم **Workers & Pages → Create application → Pages → Connect to Git**.
3. اختر مستودع المشروع.
4. استخدم الإعدادات التالية:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Production branch:** `main`
5. اضغط **Save and Deploy**.

الموقع حاليًا يستخدم نموذج مراسلة ثابتًا يفتح برنامج البريد عبر `mailto:`. قبل الإطلاق العام، استبدل البريد ورقم الهاتف في `index.html`، وأضف روابط الفيديو والصور الفعلية للشركة.
