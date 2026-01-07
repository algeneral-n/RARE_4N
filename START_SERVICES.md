# تشغيل الخدمات - RARE 4N
## دليل تشغيل Backend, Cloudflare, PM2

---

## 🚀 الطريقة السريعة

### تشغيل كل شيء مع PM2:
```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# أو تشغيل كل خدمة على حدة:
pm2 start ecosystem.config.js --only rare4n-backend
pm2 start ecosystem.config.js --only CF-MAESTRO
```

---

## 📋 الطرق المختلفة

### 1. تشغيل Backend فقط:

#### أ. مع PM2:
```bash
cd C:\abo-zien
pm2 start apps/backend/src/server.js --name rare4n-backend
```

#### ب. مباشرة:
```bash
cd C:\abo-zien\apps\backend\src
node server.js
```

#### ج. مع npm (إذا كان package.json موجود):
```bash
cd C:\abo-zien\apps\backend
npm start
```

---

### 2. تشغيل Cloudflare Tunnel:

#### أ. مع PM2:
```bash
pm2 start ecosystem.config.js --only CF-MAESTRO
```

#### ب. مباشرة:
```bash
cloudflared tunnel --config ./cloudflare/config.yml run
```

---

### 3. تشغيل كل شيء مع PM2:

```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## ✅ أوامر PM2 المفيدة

### عرض الحالة:
```bash
pm2 status
```

### إعادة التشغيل:
```bash
pm2 restart all
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### إيقاف:
```bash
pm2 stop all
pm2 stop rare4n-backend
pm2 stop CF-MAESTRO
```

### حذف:
```bash
pm2 delete all
pm2 delete rare4n-backend
pm2 delete CF-MAESTRO
```

### Logs:
```bash
pm2 logs
pm2 logs rare4n-backend --lines 50
pm2 logs CF-MAESTRO --lines 50
```

### Monitor:
```bash
pm2 monit
```

### حفظ القائمة:
```bash
pm2 save
```

### إعادة التشغيل التلقائي عند إعادة تشغيل النظام:
```bash
pm2 startup
pm2 save
```

---

## 🔧 إعدادات PM2

### ملف: `ecosystem.config.js`

```javascript
{
  name: 'rare4n-backend',
  script: './apps/backend/src/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 5000
  }
}
```

---

## 📊 التحقق من الخدمات

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```

### 2. Cloudflare:
```bash
# تحقق من Logs
pm2 logs CF-MAESTRO
```

### 3. PM2:
```bash
pm2 status
```

---

## ⚠️ ملاحظات

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج ملف config في `./cloudflare/config.yml`
3. **PM2** يجب تثبيته: `npm install -g pm2`

---

## 🔗 الروابط

- **Backend:** http://localhost:5000
- **API:** https://api.zien-ai.app
- **PM2 Docs:** https://pm2.keymetrics.io

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تشغيل Backend, Cloudflare, PM2

---

## 🚀 الطريقة السريعة

### تشغيل كل شيء مع PM2:
```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# أو تشغيل كل خدمة على حدة:
pm2 start ecosystem.config.js --only rare4n-backend
pm2 start ecosystem.config.js --only CF-MAESTRO
```

---

## 📋 الطرق المختلفة

### 1. تشغيل Backend فقط:

#### أ. مع PM2:
```bash
cd C:\abo-zien
pm2 start apps/backend/src/server.js --name rare4n-backend
```

#### ب. مباشرة:
```bash
cd C:\abo-zien\apps\backend\src
node server.js
```

#### ج. مع npm (إذا كان package.json موجود):
```bash
cd C:\abo-zien\apps\backend
npm start
```

---

### 2. تشغيل Cloudflare Tunnel:

#### أ. مع PM2:
```bash
pm2 start ecosystem.config.js --only CF-MAESTRO
```

#### ب. مباشرة:
```bash
cloudflared tunnel --config ./cloudflare/config.yml run
```

---

### 3. تشغيل كل شيء مع PM2:

```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## ✅ أوامر PM2 المفيدة

### عرض الحالة:
```bash
pm2 status
```

### إعادة التشغيل:
```bash
pm2 restart all
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### إيقاف:
```bash
pm2 stop all
pm2 stop rare4n-backend
pm2 stop CF-MAESTRO
```

### حذف:
```bash
pm2 delete all
pm2 delete rare4n-backend
pm2 delete CF-MAESTRO
```

### Logs:
```bash
pm2 logs
pm2 logs rare4n-backend --lines 50
pm2 logs CF-MAESTRO --lines 50
```

### Monitor:
```bash
pm2 monit
```

### حفظ القائمة:
```bash
pm2 save
```

### إعادة التشغيل التلقائي عند إعادة تشغيل النظام:
```bash
pm2 startup
pm2 save
```

---

## 🔧 إعدادات PM2

### ملف: `ecosystem.config.js`

```javascript
{
  name: 'rare4n-backend',
  script: './apps/backend/src/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 5000
  }
}
```

---

## 📊 التحقق من الخدمات

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```

### 2. Cloudflare:
```bash
# تحقق من Logs
pm2 logs CF-MAESTRO
```

### 3. PM2:
```bash
pm2 status
```

---

## ⚠️ ملاحظات

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج ملف config في `./cloudflare/config.yml`
3. **PM2** يجب تثبيته: `npm install -g pm2`

---

## 🔗 الروابط

- **Backend:** http://localhost:5000
- **API:** https://api.zien-ai.app
- **PM2 Docs:** https://pm2.keymetrics.io

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تشغيل Backend, Cloudflare, PM2

---

## 🚀 الطريقة السريعة

### تشغيل كل شيء مع PM2:
```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# أو تشغيل كل خدمة على حدة:
pm2 start ecosystem.config.js --only rare4n-backend
pm2 start ecosystem.config.js --only CF-MAESTRO
```

---

## 📋 الطرق المختلفة

### 1. تشغيل Backend فقط:

#### أ. مع PM2:
```bash
cd C:\abo-zien
pm2 start apps/backend/src/server.js --name rare4n-backend
```

#### ب. مباشرة:
```bash
cd C:\abo-zien\apps\backend\src
node server.js
```

#### ج. مع npm (إذا كان package.json موجود):
```bash
cd C:\abo-zien\apps\backend
npm start
```

---

### 2. تشغيل Cloudflare Tunnel:

#### أ. مع PM2:
```bash
pm2 start ecosystem.config.js --only CF-MAESTRO
```

#### ب. مباشرة:
```bash
cloudflared tunnel --config ./cloudflare/config.yml run
```

---

### 3. تشغيل كل شيء مع PM2:

```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## ✅ أوامر PM2 المفيدة

### عرض الحالة:
```bash
pm2 status
```

### إعادة التشغيل:
```bash
pm2 restart all
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### إيقاف:
```bash
pm2 stop all
pm2 stop rare4n-backend
pm2 stop CF-MAESTRO
```

### حذف:
```bash
pm2 delete all
pm2 delete rare4n-backend
pm2 delete CF-MAESTRO
```

### Logs:
```bash
pm2 logs
pm2 logs rare4n-backend --lines 50
pm2 logs CF-MAESTRO --lines 50
```

### Monitor:
```bash
pm2 monit
```

### حفظ القائمة:
```bash
pm2 save
```

### إعادة التشغيل التلقائي عند إعادة تشغيل النظام:
```bash
pm2 startup
pm2 save
```

---

## 🔧 إعدادات PM2

### ملف: `ecosystem.config.js`

```javascript
{
  name: 'rare4n-backend',
  script: './apps/backend/src/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 5000
  }
}
```

---

## 📊 التحقق من الخدمات

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```

### 2. Cloudflare:
```bash
# تحقق من Logs
pm2 logs CF-MAESTRO
```

### 3. PM2:
```bash
pm2 status
```

---

## ⚠️ ملاحظات

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج ملف config في `./cloudflare/config.yml`
3. **PM2** يجب تثبيته: `npm install -g pm2`

---

## 🔗 الروابط

- **Backend:** http://localhost:5000
- **API:** https://api.zien-ai.app
- **PM2 Docs:** https://pm2.keymetrics.io

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تشغيل Backend, Cloudflare, PM2

---

## 🚀 الطريقة السريعة

### تشغيل كل شيء مع PM2:
```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# أو تشغيل كل خدمة على حدة:
pm2 start ecosystem.config.js --only rare4n-backend
pm2 start ecosystem.config.js --only CF-MAESTRO
```

---

## 📋 الطرق المختلفة

### 1. تشغيل Backend فقط:

#### أ. مع PM2:
```bash
cd C:\abo-zien
pm2 start apps/backend/src/server.js --name rare4n-backend
```

#### ب. مباشرة:
```bash
cd C:\abo-zien\apps\backend\src
node server.js
```

#### ج. مع npm (إذا كان package.json موجود):
```bash
cd C:\abo-zien\apps\backend
npm start
```

---

### 2. تشغيل Cloudflare Tunnel:

#### أ. مع PM2:
```bash
pm2 start ecosystem.config.js --only CF-MAESTRO
```

#### ب. مباشرة:
```bash
cloudflared tunnel --config ./cloudflare/config.yml run
```

---

### 3. تشغيل كل شيء مع PM2:

```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## ✅ أوامر PM2 المفيدة

### عرض الحالة:
```bash
pm2 status
```

### إعادة التشغيل:
```bash
pm2 restart all
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### إيقاف:
```bash
pm2 stop all
pm2 stop rare4n-backend
pm2 stop CF-MAESTRO
```

### حذف:
```bash
pm2 delete all
pm2 delete rare4n-backend
pm2 delete CF-MAESTRO
```

### Logs:
```bash
pm2 logs
pm2 logs rare4n-backend --lines 50
pm2 logs CF-MAESTRO --lines 50
```

### Monitor:
```bash
pm2 monit
```

### حفظ القائمة:
```bash
pm2 save
```

### إعادة التشغيل التلقائي عند إعادة تشغيل النظام:
```bash
pm2 startup
pm2 save
```

---

## 🔧 إعدادات PM2

### ملف: `ecosystem.config.js`

```javascript
{
  name: 'rare4n-backend',
  script: './apps/backend/src/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 5000
  }
}
```

---

## 📊 التحقق من الخدمات

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```

### 2. Cloudflare:
```bash
# تحقق من Logs
pm2 logs CF-MAESTRO
```

### 3. PM2:
```bash
pm2 status
```

---

## ⚠️ ملاحظات

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج ملف config في `./cloudflare/config.yml`
3. **PM2** يجب تثبيته: `npm install -g pm2`

---

## 🔗 الروابط

- **Backend:** http://localhost:5000
- **API:** https://api.zien-ai.app
- **PM2 Docs:** https://pm2.keymetrics.io

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تشغيل Backend, Cloudflare, PM2

---

## 🚀 الطريقة السريعة

### تشغيل كل شيء مع PM2:
```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# أو تشغيل كل خدمة على حدة:
pm2 start ecosystem.config.js --only rare4n-backend
pm2 start ecosystem.config.js --only CF-MAESTRO
```

---

## 📋 الطرق المختلفة

### 1. تشغيل Backend فقط:

#### أ. مع PM2:
```bash
cd C:\abo-zien
pm2 start apps/backend/src/server.js --name rare4n-backend
```

#### ب. مباشرة:
```bash
cd C:\abo-zien\apps\backend\src
node server.js
```

#### ج. مع npm (إذا كان package.json موجود):
```bash
cd C:\abo-zien\apps\backend
npm start
```

---

### 2. تشغيل Cloudflare Tunnel:

#### أ. مع PM2:
```bash
pm2 start ecosystem.config.js --only CF-MAESTRO
```

#### ب. مباشرة:
```bash
cloudflared tunnel --config ./cloudflare/config.yml run
```

---

### 3. تشغيل كل شيء مع PM2:

```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## ✅ أوامر PM2 المفيدة

### عرض الحالة:
```bash
pm2 status
```

### إعادة التشغيل:
```bash
pm2 restart all
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### إيقاف:
```bash
pm2 stop all
pm2 stop rare4n-backend
pm2 stop CF-MAESTRO
```

### حذف:
```bash
pm2 delete all
pm2 delete rare4n-backend
pm2 delete CF-MAESTRO
```

### Logs:
```bash
pm2 logs
pm2 logs rare4n-backend --lines 50
pm2 logs CF-MAESTRO --lines 50
```

### Monitor:
```bash
pm2 monit
```

### حفظ القائمة:
```bash
pm2 save
```

### إعادة التشغيل التلقائي عند إعادة تشغيل النظام:
```bash
pm2 startup
pm2 save
```

---

## 🔧 إعدادات PM2

### ملف: `ecosystem.config.js`

```javascript
{
  name: 'rare4n-backend',
  script: './apps/backend/src/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 5000
  }
}
```

---

## 📊 التحقق من الخدمات

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```

### 2. Cloudflare:
```bash
# تحقق من Logs
pm2 logs CF-MAESTRO
```

### 3. PM2:
```bash
pm2 status
```

---

## ⚠️ ملاحظات

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج ملف config في `./cloudflare/config.yml`
3. **PM2** يجب تثبيته: `npm install -g pm2`

---

## 🔗 الروابط

- **Backend:** http://localhost:5000
- **API:** https://api.zien-ai.app
- **PM2 Docs:** https://pm2.keymetrics.io

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تشغيل Backend, Cloudflare, PM2

---

## 🚀 الطريقة السريعة

### تشغيل كل شيء مع PM2:
```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# أو تشغيل كل خدمة على حدة:
pm2 start ecosystem.config.js --only rare4n-backend
pm2 start ecosystem.config.js --only CF-MAESTRO
```

---

## 📋 الطرق المختلفة

### 1. تشغيل Backend فقط:

#### أ. مع PM2:
```bash
cd C:\abo-zien
pm2 start apps/backend/src/server.js --name rare4n-backend
```

#### ب. مباشرة:
```bash
cd C:\abo-zien\apps\backend\src
node server.js
```

#### ج. مع npm (إذا كان package.json موجود):
```bash
cd C:\abo-zien\apps\backend
npm start
```

---

### 2. تشغيل Cloudflare Tunnel:

#### أ. مع PM2:
```bash
pm2 start ecosystem.config.js --only CF-MAESTRO
```

#### ب. مباشرة:
```bash
cloudflared tunnel --config ./cloudflare/config.yml run
```

---

### 3. تشغيل كل شيء مع PM2:

```bash
# تشغيل جميع الخدمات
pm2 start ecosystem.config.js

# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## ✅ أوامر PM2 المفيدة

### عرض الحالة:
```bash
pm2 status
```

### إعادة التشغيل:
```bash
pm2 restart all
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### إيقاف:
```bash
pm2 stop all
pm2 stop rare4n-backend
pm2 stop CF-MAESTRO
```

### حذف:
```bash
pm2 delete all
pm2 delete rare4n-backend
pm2 delete CF-MAESTRO
```

### Logs:
```bash
pm2 logs
pm2 logs rare4n-backend --lines 50
pm2 logs CF-MAESTRO --lines 50
```

### Monitor:
```bash
pm2 monit
```

### حفظ القائمة:
```bash
pm2 save
```

### إعادة التشغيل التلقائي عند إعادة تشغيل النظام:
```bash
pm2 startup
pm2 save
```

---

## 🔧 إعدادات PM2

### ملف: `ecosystem.config.js`

```javascript
{
  name: 'rare4n-backend',
  script: './apps/backend/src/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 5000
  }
}
```

---

## 📊 التحقق من الخدمات

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```

### 2. Cloudflare:
```bash
# تحقق من Logs
pm2 logs CF-MAESTRO
```

### 3. PM2:
```bash
pm2 status
```

---

## ⚠️ ملاحظات

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج ملف config في `./cloudflare/config.yml`
3. **PM2** يجب تثبيته: `npm install -g pm2`

---

## 🔗 الروابط

- **Backend:** http://localhost:5000
- **API:** https://api.zien-ai.app
- **PM2 Docs:** https://pm2.keymetrics.io

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

