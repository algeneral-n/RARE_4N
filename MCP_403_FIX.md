# 🔧 حل مشكلة 403 Forbidden في MCP Endpoint

## المشكلة
```
HTTP/1.1 403 Forbidden
Access Denied
```

## ✅ الحلول

### 1. التحقق من WAF Rule

في Cloudflare Dashboard → Security → WAF → Custom Rules:

تأكد من:
- Rule name: "Allow MCP Endpoint"
- Expression: `(http.request.uri.path eq "/api/mcp")`
- Action: `Skip` (all WAF rules)
- Status: `Active`

### 2. إضافة Rate Limiting Exception

في Cloudflare Dashboard → Security → WAF → Rate limiting rules:

أنشئ Rule جديد:
```
Rule name: Allow MCP SSE
Expression: (http.request.uri.path eq "/api/mcp")
Action: Skip rate limiting
```

### 3. التحقق من Firewall Rules

في Cloudflare Dashboard → Security → Firewall Rules:

تأكد من عدم وجود Rule يحجب `/api/mcp`

### 4. إضافة Transform Rule (لإضافة Headers)

في Cloudflare Dashboard → Rules → Transform Rules → Modify Response Header:

```
Rule name: MCP SSE Headers
When: (http.request.uri.path eq "/api/mcp")
Then:
- Set static: Access-Control-Allow-Origin = *
- Set static: Access-Control-Allow-Methods = GET, POST, OPTIONS
- Set static: Access-Control-Allow-Headers = Content-Type, Authorization, Cache-Control, Last-Event-ID
```

### 5. التحقق من Security Events

في Cloudflare Dashboard → Security → Events:

1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## 🔍 التحقق من Backend

### اختبار محلي:
```bash
curl http://localhost:5000/api/mcp
```

إذا عمل محلياً، المشكلة في Cloudflare.

---

## ⚠️ ملاحظات

1. **WAF Rule** يجب أن يكون في أولوية عالية
2. **Page Rule** يجب أن يكون active
3. **Rate Limiting** قد يحجب الطلبات المتكررة
4. **Firewall Rules** قد تحجب بعض IPs

---

**تاريخ الإنشاء:** 2025-01-XX  
**الحالة:** 🔧 قيد الإصلاح

