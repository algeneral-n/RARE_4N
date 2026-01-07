/**
 * RARE 4N - Systems Library (v2)
 *
 * System = قطعة جاهزة (Backend/Frontend/Infra) يمكن للـ Builder يحقنها داخل أي مشروع.
 * أمثلة: Auth, RBAC, Billing, Realtime, Notifications, GitHub Integration, EAS Builds.
 *
 * ملاحظات:
 * - لا تضع أي أسرار هنا.
 * - endpoints هنا "نِماذج"... التنفيذ الفعلي يكون في services/routes.
 */

export const LIBRARY_SCHEMA_VERSION = '2.0.0';

export const SYSTEM_CATEGORIES = Object.freeze({
  security: { label: 'Security & Identity', icon: 'shield' },
  payments: { label: 'Payments & Billing', icon: 'credit_card' },
  communication: { label: 'Messaging & Notifications', icon: 'sms' },
  data: { label: 'Data & Storage', icon: 'database' },
  realtime: { label: 'Realtime & Sockets', icon: 'bolt' },
  ai: { label: 'AI & Agents', icon: 'smart_toy' },
  devops: { label: 'DevOps & Delivery', icon: 'deployed_code' },
  product: { label: 'Product Features', icon: 'dashboard' },
});

/**
 * @typedef {Object} SystemSpec
 * @property {string} id
 * @property {string} name
 * @property {string} nameEn
 * @property {keyof typeof SYSTEM_CATEGORIES} category
 * @property {'core'|'premium'|'experimental'} tier
 * @property {'stable'|'beta'|'concept'} status
 * @property {string} description
 * @property {string[]} tags
 * @property {string} icon
 * @property {{method:'GET'|'POST'|'PUT'|'PATCH'|'DELETE', path:string, note?:string}[]} api
 * @property {string[]} requiredEnv  // أسماء متغيرات البيئة المطلوبة (بدون قيم)
 * @property {string[]} dependsOn     // systems IDs
 */

/** @type {SystemSpec[]} */
const RAW_SYSTEMS = [
  {
    id: 'auth.core',
    name: 'تسجيل الدخول (Email/Password + OAuth)',
    nameEn: 'Auth (Email/Password + OAuth)',
    category: 'security',
    tier: 'core',
    status: 'stable',
    icon: 'lock',
    description:
      'تسجيل دخول موحد للبورتال + التطبيقات: Email/Password + Google + Apple. يدعم Sessions + Refresh Tokens + حماية CSRF للويب.',
    tags: ['auth', 'oauth', 'apple', 'google', 'sessions'],
    api: [
      { method: 'POST', path: '/api/auth/login', note: 'Email/Password' },
      { method: 'POST', path: '/api/auth/logout' },
      { method: 'GET', path: '/api/auth/me' },
      { method: 'GET', path: '/api/auth/oauth/google/start' },
      { method: 'GET', path: '/api/auth/oauth/apple/start' },
      { method: 'GET', path: '/api/auth/oauth/callback' },
    ],
    requiredEnv: ['JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'APPLE_SERVICE_ID', 'APPLE_TEAM_ID'],
    dependsOn: [],
  },
  {
    id: 'rbac.core',
    name: 'صلاحيات وأدوار (RBAC) + عزل العملاء',
    nameEn: 'RBAC + Tenant Isolation',
    category: 'security',
    tier: 'core',
    status: 'stable',
    icon: 'verified_user',
    description:
      'Role Based Access Control + Tenant isolation. يمنع أي عميل من رؤية بيانات عميل آخر. مناسب للبورتال والباك اند.',
    tags: ['rbac', 'security', 'multi-tenant'],
    api: [
      { method: 'GET', path: '/api/user-settings/roles' },
      { method: 'POST', path: '/api/user-settings/roles' },
      { method: 'GET', path: '/api/user-projects', note: 'يُفلتر حسب tenantId' },
    ],
    requiredEnv: [],
    dependsOn: ['auth.core'],
  },
  {
    id: 'rateLimit.core',
    name: 'Rate Limiting + حماية من الإسراف',
    nameEn: 'Rate Limiting + Abuse Protection',
    category: 'security',
    tier: 'core',
    status: 'stable',
    icon: 'speed',
    description:
      'Rate limiter + Burst control + IP/User limits. مهم جداً لمنع 429/DoS خصوصاً مع الصوت والـ streaming.',
    tags: ['security', 'ratelimit', '429'],
    api: [{ method: 'GET', path: '/health', note: 'يُستثنى غالباً' }],
    requiredEnv: ['RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX'],
    dependsOn: [],
  },
  {
    id: 'payments.stripe',
    name: 'Stripe Payments + Subscriptions',
    nameEn: 'Stripe Payments + Subscriptions',
    category: 'payments',
    tier: 'core',
    status: 'stable',
    icon: 'payments',
    description:
      'Intent/Checkout + Webhooks + اشتراكات. يفضل فصل السرّيات في الباك اند وعدم كشفها للفرونت.',
    tags: ['stripe', 'billing', 'subscriptions', 'webhooks'],
    api: [
      { method: 'POST', path: '/api/payment/create-intent' },
      { method: 'POST', path: '/api/payment/checkout' },
      { method: 'POST', path: '/api/payment/webhook', note: 'Stripe webhook endpoint' },
      { method: 'GET', path: '/api/payments/methods' },
    ],
    requiredEnv: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PUBLISHABLE_KEY'],
    dependsOn: ['auth.core'],
  },
  {
    id: 'delivery.builds',
    name: 'تسليم ملفات البيلد + بوابة تحميل',
    nameEn: 'Build Delivery + Download Portal',
    category: 'devops',
    tier: 'core',
    status: 'stable',
    icon: 'download',
    description:
      'تخزين مخرجات البناء (ipa/aab/apk/web) وربطها بالعميل حسب حالة الدفع. يدعم Signed URLs.',
    tags: ['delivery', 'downloads', 'signed-urls'],
    api: [
      { method: 'POST', path: '/api/builds/create' },
      { method: 'GET', path: '/api/builds/:id' },
      { method: 'POST', path: '/api/builds/:id/deliver' },
    ],
    requiredEnv: ['UPLOADS_DIR', 'SIGNED_URL_SECRET'],
    dependsOn: ['payments.stripe'],
  },
  {
    id: 'github.integration',
    name: 'GitHub Integration (Repos/Branches/Commits)',
    nameEn: 'GitHub Integration (Repos/Branches/Commits)',
    category: 'devops',
    tier: 'core',
    status: 'stable',
    icon: 'code',
    description:
      'إنشاء Repo لكل عميل/مشروع + Push تلقائي + فتح PRs. الأفضل استخدام GitHub App أو Fine-grained PAT.',
    tags: ['github', 'repo', 'automation'],
    api: [
      { method: 'POST', path: '/api/github/create-repo' },
      { method: 'POST', path: '/api/github/push' },
      { method: 'POST', path: '/api/github/open-pr' },
    ],
    requiredEnv: ['GITHUB_APP_ID', 'GITHUB_APP_PRIVATE_KEY', 'GITHUB_INSTALLATION_ID'],
    dependsOn: [],
  },
  {
    id: 'eas.build',
    name: 'Expo EAS Build Pipeline',
    nameEn: 'Expo EAS Build Pipeline',
    category: 'devops',
    tier: 'core',
    status: 'stable',
    icon: 'build',
    description:
      'تشغيل builds لـ iOS/Android من GitHub Actions باستخدام EAS. يدعم Manual build (Owner) أو Auto after payment.',
    tags: ['expo', 'eas', 'ci', 'github-actions'],
    api: [
      { method: 'POST', path: '/api/auto-builder/build', note: 'trigger pipeline' },
      { method: 'GET', path: '/api/auto-builder/build/:id/status' },
    ],
    requiredEnv: ['EXPO_TOKEN', 'EXPO_PROJECT_ID', 'EAS_BUILD_PROFILE'],
    dependsOn: ['github.integration'],
  },
  {
    id: 'twilio.notify',
    name: 'Twilio SMS/WhatsApp + Verification',
    nameEn: 'Twilio SMS/WhatsApp + Verification',
    category: 'communication',
    tier: 'core',
    status: 'stable',
    icon: 'sms',
    description:
      'إشعارات الدفع/البناء + OTP verification للموبايل/الويب.',
    tags: ['twilio', 'sms', 'whatsapp', 'otp'],
    api: [
      { method: 'POST', path: '/api/twilio/send' },
      { method: 'POST', path: '/api/twilio/verify/start' },
      { method: 'POST', path: '/api/twilio/verify/check' },
    ],
    requiredEnv: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_VERIFY_SERVICE_SID'],
    dependsOn: ['auth.core'],
  },
  {
    id: 'realtime.socketio',
    name: 'Realtime (Socket.IO Namespaces)',
    nameEn: 'Realtime (Socket.IO Namespaces)',
    category: 'realtime',
    tier: 'core',
    status: 'stable',
    icon: 'bolt',
    description:
      'Namespaces للبورتال: client-portal, auto-builder, voice-realtime, gpt-stream. مفيد للـ live preview والـ logs.',
    tags: ['socket.io', 'realtime', 'logs', 'preview'],
    api: [{ method: 'GET', path: '/api/client-portal/socket', note: 'namespace' }],
    requiredEnv: ['SOCKET_IO_CORS_ORIGINS'],
    dependsOn: [],
  },
  {
    id: 'agent.widget',
    name: 'Agent Widget (Portal Embedded)',
    nameEn: 'Agent Widget (Portal Embedded)',
    category: 'ai',
    tier: 'core',
    status: 'stable',
    icon: 'smart_toy',
    description:
      'Widget يظهر داخل البورتال: دردشة + صوت (لو مسموح) + أدوات (agent-tools).',
    tags: ['agent', 'convai', 'assistant', 'tools'],
    api: [
      { method: 'POST', path: '/api/agent/message' },
      { method: 'POST', path: '/api/agent-tools/run' },
      { method: 'GET', path: '/api/voice-realtime/token' },
    ],
    requiredEnv: ['ELEVENLABS_API_KEY', 'ELEVENLABS_CONVAI_AGENT_ID'],
    dependsOn: ['realtime.socketio'],
  },

  // --- Optional / Premium ---
  {
    id: 'analytics.core',
    name: 'Analytics + Audit Logs',
    nameEn: 'Analytics + Audit Logs',
    category: 'product',
    tier: 'premium',
    status: 'beta',
    icon: 'analytics',
    description:
      'Events + KPIs + Audit trail (من قام بماذا ومتى). مفيد للـ enterprise.',
    tags: ['analytics', 'audit', 'events'],
    api: [
      { method: 'POST', path: '/api/analytics/event' },
      { method: 'GET', path: '/api/analytics/dashboard' },
    ],
    requiredEnv: ['ANALYTICS_WRITE_KEY'],
    dependsOn: ['rbac.core'],
  },

  // --- Concept systems (تظل موجودة للعرض/التسويق لكن لا تُبنى افتراضياً) ---
  {
    id: 'concept.metaverse',
    name: 'نظام ميتافيرس (Concept)',
    nameEn: 'Metaverse System (Concept)',
    category: 'ai',
    tier: 'experimental',
    status: 'concept',
    icon: 'public',
    description:
      'Concept فقط: دمج تجارب ثلاثية الأبعاد/VR. يحتاج تخطيط منفصل ولا يُستخدم في build العادي.',
    tags: ['concept', 'metaverse', 'vr'],
    api: [],
    requiredEnv: [],
    dependsOn: [],
  },
];

function normalize(s) {
  return String(s || '').trim();
}

function ensureArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v.filter(Boolean) : [v].filter(Boolean);
}

function validateSystem(sys) {
  const errors = [];
  if (!sys.id) errors.push('id missing');
  if (!sys.name) errors.push('name missing');
  if (!sys.category || !(sys.category in SYSTEM_CATEGORIES)) errors.push('invalid category');
  if (!sys.tier) errors.push('tier missing');
  if (!sys.status) errors.push('status missing');
  return errors;
}

function buildSystems(raw) {
  const seen = new Set();
  const built = raw.map((s) => {
    const id = normalize(s.id);
    if (seen.has(id)) {
      throw new Error(`Duplicate system id: ${id}`);
    }
    seen.add(id);

    const sys = {
      ...s,
      id,
      name: normalize(s.name),
      nameEn: normalize(s.nameEn || s.name),
      icon: normalize(s.icon || SYSTEM_CATEGORIES[s.category]?.icon || 'widgets'),
      tags: ensureArray(s.tags),
      requiredEnv: ensureArray(s.requiredEnv),
      dependsOn: ensureArray(s.dependsOn),
      api: ensureArray(s.api),
    };

    const errs = validateSystem(sys);
    if (errs.length) {
      throw new Error(`Invalid system [${id}]: ${errs.join(', ')}`);
    }

    return Object.freeze(sys);
  });

  return Object.freeze(built);
}

export const SYSTEMS = buildSystems(RAW_SYSTEMS);
export const SYSTEMS_LIBRARY = SYSTEMS; // backward/alias

// --------- Convenience helpers ---------
export function getSystemById(id) {
  const key = normalize(id);
  return SYSTEMS.find((s) => s.id === key) || null;
}

export function listSystems({
  tier,
  status,
  category,
  q,
} = {}) {
  let items = [...SYSTEMS];
  if (tier) items = items.filter((s) => s.tier === tier);
  if (status) items = items.filter((s) => s.status === status);
  if (category) items = items.filter((s) => s.category === category);

  if (q) {
    const query = normalize(q).toLowerCase();
    items = items.filter((s) => {
      return (
        s.name.toLowerCase().includes(query) ||
        s.nameEn.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }

  return items;
}

export function resolveDependencies(systemIds = []) {
  const out = new Set();
  const stack = [...systemIds];

  while (stack.length) {
    const id = normalize(stack.pop());
    if (!id || out.has(id)) continue;

    const sys = getSystemById(id);
    if (!sys) continue;

    out.add(id);
    for (const dep of sys.dependsOn) stack.push(dep);
  }

  return [...out];
}
