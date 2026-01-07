/**
 * RARE 4N - App Templates Library (v2)
 * هدف الملف: مكتبة Templates منظمة وقابلة للبحث/الفلترة + جاهزة للربط مع الـ Builder والـ Portal.
 *
 * ملاحظات:
 * - لا تضع أي Secrets هنا. دي مكتبة Metadata فقط.
 * - حافظنا على توافق للخلف: APP_TEMPLATES_LIBRARY / APP_TEMPLATES
 */

export const LIBRARY_SCHEMA_VERSION = '2.0.0';

export const APP_TEMPLATE_CATEGORIES = Object.freeze({
  portal: {
    label: 'Portals',
    labelAr: 'بوابات',
    icon: 'apps',
    description: 'Client/Partner/Admin portals with RBAC and workflows.'
  },
  saas: {
    label: 'SaaS',
    labelAr: 'خدمات سحابية',
    icon: 'cloud',
    description: 'Subscription products, multi-tenant apps, self-serve onboarding.'
  },
  fintech: {
    label: 'FinTech',
    labelAr: 'فينتك',
    icon: 'account_balance',
    description: 'Payments, invoicing, wallets, reconciliation, compliance.'
  },
  crm: {
    label: 'CRM & Sales',
    labelAr: 'مبيعات وCRM',
    icon: 'support_agent',
    description: 'Leads, deals, pipelines, support, customer success.'
  },
  erp: {
    label: 'ERP & Ops',
    labelAr: 'تشغيل وERP',
    icon: 'factory',
    description: 'Operations, inventory, procurement, approvals, HR.'
  },
  ecommerce: {
    label: 'Commerce',
    labelAr: 'تجارة',
    icon: 'shopping_bag',
    description: 'Stores, catalogs, orders, fulfillment.'
  },
  healthcare: {
    label: 'Healthcare',
    labelAr: 'صحة',
    icon: 'medical_services',
    description: 'Clinics, appointments, patients, prescriptions.'
  },
  education: {
    label: 'Education',
    labelAr: 'تعليم',
    icon: 'school',
    description: 'LMS, courses, quizzes, cohorts, certificates.'
  },
  logistics: {
    label: 'Logistics',
    labelAr: 'لوجستيات',
    icon: 'local_shipping',
    description: 'Delivery, fleets, tracking, warehouses.'
  },
  realestate: {
    label: 'Real Estate',
    labelAr: 'عقارات',
    icon: 'home_work',
    description: 'Listings, brokers, visits, contracts.'
  },
  media: {
    label: 'Media',
    labelAr: 'ميديا',
    icon: 'movie',
    description: 'Content, streaming, creators, subscriptions.'
  },
  ai: {
    label: 'AI',
    labelAr: 'ذكاء اصطناعي',
    icon: 'psychology',
    description: 'Agentic apps, knowledge bases, copilots.'
  },
  developer: {
    label: 'Developer Tools',
    labelAr: 'أدوات مطورين',
    icon: 'terminal',
    description: 'CI/CD, SDKs, dashboards, observability.'
  },
  experimental: {
    label: 'Experimental',
    labelAr: 'تجريبي',
    icon: 'science',
    description: 'Concept templates (hidden by default in UI).' 
  }
});

/**
 * معايير موحدة لأي Template
 * @typedef {Object} AppTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} [nameEn]
 * @property {keyof typeof APP_TEMPLATE_CATEGORIES} category
 * @property {string} description
 * @property {'core'|'premium'|'experimental'} tier
 * @property {'stable'|'beta'|'concept'} status
 * @property {string[]} tags
 * @property {string} icon  // material-symbols name or sf-symbol (for iOS mapping)
 * @property {{auth?: boolean, payments?: boolean, realtime?: boolean, files?: boolean, notifications?: boolean, analytics?: boolean, aiAgent?: boolean}} capabilities
 * @property {{systems?: string[], routes?: string[]}} wiring // ربط مقترح مع Systems/Routes
 * @property {{minDays: number, maxDays: number, complexity: 1|2|3|4|5}} estimation
 */

const T = (t) => t; // micro helper for readability

/**
 * قائمة Core Templates (جاهزة للبيع والتسليم)
 * تقدر تزود براحتك هنا.
 */
export const APP_TEMPLATES = Object.freeze([
  {
    id: 'client-portal-pro',
    name: 'Client Portal Pro',
    nameEn: 'Client Portal Pro',
    category: 'portal',
    description: T('بوابة عميل كاملة: Projects, Builds, Invoices, Downloads, Agent chat, Settings + صلاحيات (RBAC).'),
    tier: 'core',
    status: 'stable',
    tags: ['portal', 'rbac', 'projects', 'builder', 'payments', 'agent'],
    icon: 'dashboard',
    capabilities: { auth: true, payments: true, realtime: true, files: true, notifications: true, analytics: true, aiAgent: true },
    wiring: {
      systems: ['auth-rbac', 'billing-stripe', 'build-orchestrator', 'github-integration', 'expo-eas-build', 'delivery-vault', 'notifications-twilio', 'agent-hub', 'audit-logs'],
      routes: ['/api/auth/*', '/api/client-portal/*', '/api/payment/*', '/api/auto-builder/*', '/api/agent/*']
    },
    estimation: { minDays: 5, maxDays: 14, complexity: 4 }
  },
  {
    id: 'app-library-neumorphic',
    name: 'App Library (Neumorphic)',
    nameEn: 'App Library (Neumorphic)',
    category: 'portal',
    description: T('مكتبة خدمات/تطبيقات بنفس ستايل الصور (Cards/Glass/Neumorphism) مع Search/Filters وTiles. (Web + Mobile responsive UI).'),
    tier: 'core',
    status: 'stable',
    tags: ['ui', 'library', 'tiles', 'search', 'responsive'],
    icon: 'grid_view',
    capabilities: { auth: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'ui-theme-engine', 'content-registry'], routes: ['/api/libraries/*', '/api/client-portal/*'] },
    estimation: { minDays: 3, maxDays: 7, complexity: 3 }
  },
  {
    id: 'invoicing-suite',
    name: 'Invoices & Quotations Suite',
    nameEn: 'Invoices & Quotations Suite',
    category: 'fintech',
    description: T('فواتير + عروض أسعار + PDF + حالات + إرسال بريد + دفع أونلاين + تحصيل جزئي.'),
    tier: 'core',
    status: 'stable',
    tags: ['invoices', 'quotations', 'pdf', 'stripe', 'accounting'],
    icon: 'request_quote',
    capabilities: { auth: true, payments: true, files: true, notifications: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'billing-stripe', 'pdf-renderer', 'email-notifier', 'audit-logs'], routes: ['/api/payment/*', '/api/financial/*'] },
    estimation: { minDays: 4, maxDays: 10, complexity: 4 }
  },
  {
    id: 'subscriptions-saas',
    name: 'SaaS Subscriptions',
    nameEn: 'SaaS Subscriptions',
    category: 'saas',
    description: T('اشتراكات (plans, trials, upgrades, proration) + إدارة صلاحيات + فواتير تلقائية.'),
    tier: 'core',
    status: 'stable',
    tags: ['saas', 'subscriptions', 'stripe', 'plans'],
    icon: 'workspace_premium',
    capabilities: { auth: true, payments: true, notifications: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'billing-stripe', 'entitlements', 'email-notifier', 'audit-logs'], routes: ['/api/payments/*', '/api/payment/*'] },
    estimation: { minDays: 6, maxDays: 14, complexity: 5 }
  },
  {
    id: 'support-helpdesk',
    name: 'Helpdesk & Tickets',
    nameEn: 'Helpdesk & Tickets',
    category: 'crm',
    description: T('تذاكر دعم + SLA + Assignments + Macros + Knowledge base + تكامل واتساب/SMS.'),
    tier: 'core',
    status: 'stable',
    tags: ['helpdesk', 'tickets', 'sla', 'twilio', 'kb'],
    icon: 'support',
    capabilities: { auth: true, realtime: true, notifications: true, aiAgent: true },
    wiring: { systems: ['auth-rbac', 'notifications-twilio', 'kb-search', 'agent-hub', 'audit-logs'], routes: ['/api/twilio/*', '/api/communication/*', '/api/ai/*'] },
    estimation: { minDays: 5, maxDays: 12, complexity: 4 }
  },
  {
    id: 'crm-pipeline',
    name: 'CRM Pipeline',
    nameEn: 'CRM Pipeline',
    category: 'crm',
    description: T('Leads → Deals → Won/Lost مع Tasks وReminders وتقارير.'),
    tier: 'core',
    status: 'stable',
    tags: ['crm', 'pipeline', 'leads', 'reports'],
    icon: 'trending_up',
    capabilities: { auth: true, analytics: true, notifications: true },
    wiring: { systems: ['auth-rbac', 'workflow-engine', 'analytics-suite'], routes: ['/api/reports/*', '/api/loyalty/*'] },
    estimation: { minDays: 4, maxDays: 9, complexity: 3 }
  },
  {
    id: 'inventory-ops',
    name: 'Inventory & Procurement',
    nameEn: 'Inventory & Procurement',
    category: 'erp',
    description: T('مخزون + مشتريات + أوامر توريد + موافقات + تنبيهات نقص.'),
    tier: 'core',
    status: 'stable',
    tags: ['inventory', 'procurement', 'approvals', 'erp'],
    icon: 'inventory_2',
    capabilities: { auth: true, notifications: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'workflow-engine', 'audit-logs'], routes: ['/api/settings/*'] },
    estimation: { minDays: 6, maxDays: 14, complexity: 4 }
  },
  {
    id: 'clinic-appointments',
    name: 'Clinic Appointments',
    nameEn: 'Clinic Appointments',
    category: 'healthcare',
    description: T('حجوزات عيادة + ملفات مرضى + تذكير SMS + وصفات (بدون بيانات حساسة افتراضياً).'),
    tier: 'premium',
    status: 'beta',
    tags: ['health', 'appointments', 'patients', 'sms'],
    icon: 'event_available',
    capabilities: { auth: true, notifications: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'notifications-twilio', 'audit-logs'], routes: ['/api/twilio/*'] },
    estimation: { minDays: 7, maxDays: 16, complexity: 5 }
  },
  {
    id: 'lms-lite',
    name: 'LMS Lite',
    nameEn: 'LMS Lite',
    category: 'education',
    description: T('كورسات + فيديو + اختبارات + شهادات + لوحة مدرس/طالب.'),
    tier: 'core',
    status: 'stable',
    tags: ['lms', 'courses', 'quizzes', 'certificates'],
    icon: 'school',
    capabilities: { auth: true, payments: true, files: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'billing-stripe', 'file-storage', 'content-registry'], routes: ['/api/files/*', '/api/payment/*'] },
    estimation: { minDays: 8, maxDays: 20, complexity: 5 }
  },
  {
    id: 'fleet-tracking',
    name: 'Fleet & Delivery Tracking',
    nameEn: 'Fleet & Delivery Tracking',
    category: 'logistics',
    description: T('إدارة سائقين + تتبع + مهام تسليم + خرائط + إثبات تسليم.'),
    tier: 'premium',
    status: 'beta',
    tags: ['fleet', 'delivery', 'maps', 'tracking'],
    icon: 'local_shipping',
    capabilities: { auth: true, realtime: true, notifications: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'maps-engine', 'realtime-events', 'notifications-twilio'], routes: ['/api/maps/*', '/api/communication/*'] },
    estimation: { minDays: 10, maxDays: 24, complexity: 5 }
  },
  {
    id: 'realestate-listings',
    name: 'Real Estate Listings',
    nameEn: 'Real Estate Listings',
    category: 'realestate',
    description: T('عقارات + وسطاء + زيارات + CRM بسيط + حجز معاينة.'),
    tier: 'core',
    status: 'stable',
    tags: ['realestate', 'listings', 'booking'],
    icon: 'home_work',
    capabilities: { auth: true, payments: false, files: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'file-storage', 'content-registry'], routes: ['/api/files/*'] },
    estimation: { minDays: 6, maxDays: 14, complexity: 4 }
  },
  {
    id: 'creator-membership',
    name: 'Creator Membership',
    nameEn: 'Creator Membership',
    category: 'media',
    description: T('منصة عضويات للمحتوى (Posts/Video) + Paywall + مجتمع بسيط.'),
    tier: 'premium',
    status: 'beta',
    tags: ['creators', 'membership', 'stripe', 'content'],
    icon: 'subscriptions',
    capabilities: { auth: true, payments: true, files: true, realtime: true, analytics: true },
    wiring: { systems: ['auth-rbac', 'billing-stripe', 'file-storage', 'realtime-events'], routes: ['/api/payments/*', '/api/files/*'] },
    estimation: { minDays: 9, maxDays: 22, complexity: 5 }
  },
  {
    id: 'agentic-copilot',
    name: 'Agentic Copilot Workspace',
    nameEn: 'Agentic Copilot Workspace',
    category: 'ai',
    description: T('Workspace للـ Agent: أدوات + محادثة + ذاكرة + مهام + ربط بالمشاريع + صلاحيات.'),
    tier: 'core',
    status: 'stable',
    tags: ['agent', 'tools', 'kb', 'tasks'],
    icon: 'smart_toy',
    capabilities: { auth: true, realtime: true, analytics: true, aiAgent: true },
    wiring: { systems: ['auth-rbac', 'agent-hub', 'kb-search', 'tool-registry', 'audit-logs'], routes: ['/api/agent/*', '/api/agent-tools/*', '/api/ai/*'] },
    estimation: { minDays: 6, maxDays: 16, complexity: 4 }
  },

  // =========================
  // Experimental / Concept (مخفي افتراضياً في UI)
  // =========================
  {
    id: 'quantum-enterprise-os',
    name: 'Quantum Enterprise OS',
    nameEn: 'Quantum Enterprise OS',
    category: 'experimental',
    description: T('Concept: نظام تشغيل مؤسسي “كمومي” — للاستخدام الدعائي/العرض فقط.'),
    tier: 'experimental',
    status: 'concept',
    tags: ['concept', 'sci-fi'],
    icon: 'science',
    capabilities: { auth: true, aiAgent: true },
    wiring: { systems: ['auth-rbac', 'agent-hub'], routes: [] },
    estimation: { minDays: 0, maxDays: 0, complexity: 5 }
  }
]);

// Backward compatibility
export const APP_TEMPLATES_LIBRARY = APP_TEMPLATES;

// ---------- Indexes & helpers ----------
const byId = new Map(APP_TEMPLATES.map(t => [t.id, t]));

export function getAppTemplateById(id) {
  return byId.get(id) || null;
}

export function listAppTemplates({
  category,
  tier,
  status,
  q,
  includeExperimental = false
} = {}) {
  const needle = (q || '').trim().toLowerCase();

  return APP_TEMPLATES.filter(t => {
    if (!includeExperimental && (t.category === 'experimental' || t.tier === 'experimental' || t.status === 'concept')) return false;
    if (category && t.category !== category) return false;
    if (tier && t.tier !== tier) return false;
    if (status && t.status !== status) return false;
    if (!needle) return true;

    const hay = [t.id, t.name, t.nameEn, t.description, ...(t.tags || [])].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(needle);
  });
}

export function validateAppTemplatesLibrary() {
  const seen = new Set();
  const problems = [];

  for (const t of APP_TEMPLATES) {
    if (!t.id) problems.push({ type: 'missing_id', template: t });
    if (seen.has(t.id)) problems.push({ type: 'duplicate_id', id: t.id });
    seen.add(t.id);

    if (!APP_TEMPLATE_CATEGORIES[t.category]) problems.push({ type: 'unknown_category', id: t.id, category: t.category });
    if (!t.name || !t.description) problems.push({ type: 'missing_fields', id: t.id });

    if (!t.estimation || typeof t.estimation.minDays !== 'number' || typeof t.estimation.maxDays !== 'number') {
      problems.push({ type: 'bad_estimation', id: t.id });
    }
  }

  return {
    ok: problems.length === 0,
    version: LIBRARY_SCHEMA_VERSION,
    count: APP_TEMPLATES.length,
    problems
  };
}
