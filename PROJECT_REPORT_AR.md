# تقرير شامل عن مشروع RARE 4N
## RARE 4N - Complete Project Documentation Report

---

## 📋 جدول المحتويات (Table of Contents)

1. [نظرة عامة على المشروع](#نظرة-عامة-على-المشروع)
2. [المعمارية العامة](#المعمارية-العامة)
3. [مكونات المشروع](#مكونات-المشروع)
4. [نظام iOS](#نظام-ios)
5. [قواعد البيانات](#قواعد-البيانات)
6. [الخدمات (Services)](#الخدمات-services)
7. [المحركات (Engines)](#المحركات-engines)
8. [الكور (Core Systems)](#الكور-core-systems)
9. [العملاء (Agents)](#العملاء-agents)
10. [الشاشات (Screens)](#الشاشات-screens)
11. [Cloudflare Configuration](#cloudflare-configuration)
12. [المفاتيح والبيانات الحساسة](#المفاتيح-والبيانات-الحساسة)
13. [البنية التحتية](#البنية-التحتية)

---

## 🎯 نظرة عامة على المشروع

### اسم المشروع
**RARE 4N** - نظام ذكاء اصطناعي متقدم ومتكامل

### نوع المشروع
- **نظام iOS حصري** - مصمم خصيصاً لتطبيقات iOS فقط
- **نظام لمستخدم واحد** - Single User System
- **نظام متكامل** - Integrated AI System

### الموقع المحلي
```
C:\abo-zien
```

### الموقع على GitHub
```
https://github.com/algeneral-n/abo-zien
```

### الوصف
RARE 4N هو نظام ذكاء اصطناعي متقدم يتكون من:
- **Mobile App (iOS)** - تطبيق iOS الأصلي
- **Backend API** - واجهة برمجة التطبيقات الخلفية
- **Client Portal** - بوابة العميل على الويب
- **Core Systems** - الأنظمة الأساسية
- **Engines** - المحركات الذكية
- **Agents** - العملاء الذكيون

---

## 🏗️ المعمارية العامة

### هيكل المشروع
```
C:\abo-zien\
├── apps\
│   ├── backend\              # Backend API Server
│   │   └── src\
│   │       ├── server.js     # Main Server
│   │       ├── routes\       # API Routes (47 route files)
│   │       ├── services\     # Backend Services (30+ services)
│   │       ├── middleware\   # Middleware (13 files)
│   │       ├── database\     # Database Connections
│   │       ├── core\         # Core Systems
│   │       └── utils\        # Utilities
│   │
│   └── client-portal\        # Web Client Portal
│       ├── app-new.js        # Main Application
│       ├── index.html        # Entry Point
│       ├── pages\            # Portal Pages
│       ├── services\         # Portal Services
│       ├── components\       # UI Components
│       ├── themes\           # Theme System
│       └── i18n\            # Internationalization
│
├── mobile\                   # iOS Mobile App
│   ├── app\                  # App Screens (18 screens)
│   ├── core\                 # Core Systems
│   │   ├── RAREKernel.ts    # Main Kernel
│   │   ├── RAREEngine.ts    # Base Engine
│   │   ├── agents\          # AI Agents (13 agents)
│   │   ├── engines\         # Engines (3 engines)
│   │   ├── protocols\       # Security Protocols
│   │   └── services\        # Core Services
│   ├── components\           # React Native Components
│   ├── services\            # App Services
│   └── utils\               # Utilities
│
└── packages\                 # Shared Packages (if any)
```

### المعمارية التقنية

#### 1. Mobile App (iOS)
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Architecture**: Kernel → Engines → Agents → Services
- **State Management**: Context API + Custom Stores
- **Navigation**: Expo Router

#### 2. Backend API
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Architecture**: RESTful API + WebSocket (Socket.IO)
- **Process Manager**: PM2
- **Port**: 5000 (default)

#### 3. Client Portal
- **Framework**: Vanilla JavaScript (ES6 Modules)
- **Architecture**: Single Page Application (SPA)
- **Styling**: CSS3 with CSS Variables
- **Real-time**: Socket.IO Client

---

## 📦 مكونات المشروع

### 1. Mobile App (iOS) - `mobile/`

#### الملفات الرئيسية
- `app/_layout.tsx` - Layout Configuration
- `app/index.tsx` - Entry Point (redirects to splash)
- `app/splash.tsx` - Splash Screen
- `app/login.tsx` - Login Screen
- `app/home.tsx` - Home Screen (Main Dashboard)
- `app/boot.tsx` - Boot/Initialization Screen

#### الشاشات الرئيسية (18 شاشة)
1. **Splash** (`splash.tsx`) - شاشة البداية
2. **Login** (`login.tsx`) - تسجيل الدخول
3. **Home** (`home.tsx`) - الشاشة الرئيسية
4. **Boot** (`boot.tsx`) - شاشة التهيئة
5. **App Builder** (`app-builder.tsx`) - بناء التطبيقات
6. **Generator** (`generator.tsx`) - مولد الملفات
7. **RARE Vault** (`rarevault.tsx`) - القبو الآمن
8. **Council** (`council.tsx`) - المجلس الذكي
9. **CarPlay** (`carplayscreen.tsx`) - وضع القيادة
10. **Maps** (`maps.tsx`) - الخرائط
11. **Ultimate Assistant** (`ultimate assisstant.tsx`) - المساعد المتقدم
12. **Control Room** (`control-room.tsx`) - غرفة التحكم
13. **Code Generator** (`code-generator.tsx`) - مولد الأكواد
14. **Settings** (`settings.tsx`) - الإعدادات
15. **SOS** (`sos.tsx`) - طوارئ
16. **App Builder Service Control** (`app-builder-service-control.tsx`) - تحكم خدمات البناء

### 2. Backend API - `apps/backend/`

#### الملف الرئيسي
- `src/server.js` - Main Server File

#### Routes (47 Route Files)
```
agent-tools.js          - Agent Tools API
agent.js                - Agent Management
ai.js                   - AI Services
auth.js                 - Authentication
auto-builder.js         - Auto Builder
boot.js                 - Boot/Init
builder.js              - Builder Service
carplay.js              - CarPlay Integration
client-portal.js        - Client Portal API
codegen.js              - Code Generation
cognitive.js            - Cognitive Services
communication.js        - Communication
control-room.js         - Control Room
council.js              - Council Service
elevenlabs.js           - ElevenLabs Integration
emotion.js              - Emotion Engine
file-generator.js       - File Generation
files.js                - File Management
financial.js            - Financial Services
gpt-stream.js           - GPT Streaming
guardian.js             - Guardian Protocol
health.js               - Health Check
kill-switch.js          - Kill Switch
libraries.js            - Libraries Management
loyalty.js              - Loyalty Program
maps.js                 - Maps Service
ocr.js                  - OCR Service
payment.js              - Payment Processing
payments.js             - Payments Management
personality.js          - Personality Engine
security.js             - Security Services
service-control.js      - Service Control
settings.js             - Settings Management
sos.js                  - SOS Emergency
twilio.js               - Twilio Integration
user-projects.js        - User Projects
user-settings.js        - User Settings
vault.js                - Vault Service
vision-ai.js            - Vision AI
vision.js               - Vision Service
voice-consciousness.js  - Voice Consciousness
voice-realtime.js       - Real-time Voice
voice.js                - Voice Services
weather.js              - Weather Service
```

#### Services (30+ Services)
```
agentTools.js              - Agent Tools Service
agentToolsWebhook.js       - Agent Tools Webhook
apiKeyValidator.js         - API Key Validation
apiService.js              - API Service
appleMapsService.js        - Apple Maps Integration
autoBuilderService.js      - Auto Builder Service
buildService.js            - Build Service
cacheService.js            - Cache Service
clientPortalService.js     - Client Portal Service
communicationservice.js    - Communication Service
costManager.js             - Cost Management
elevenLabsAgentService.js - ElevenLabs Agent
elevenlabsService.js       - ElevenLabs Service
emailService.js            - Email Service
expoService.js             - Expo Service
fileConverterService.js    - File Converter
fileGeneratorService.js    - File Generator
githubService.js           - GitHub Integration
ocrService.js              - OCR Service
paymentMethodsService.js   - Payment Methods
paymentservice.js          - Payment Service
projectGeneratorService.js - Project Generator
terminalSandbox.js         - Terminal Sandbox
twilioService.js           - Twilio Service
visionService.js           - Vision Service
weatherKitService.js       - Weather Kit Service
whisperService.js          - Whisper Service
```

#### Autobuilder Services (TypeScript)
```
autobuilder/
├── AutoBuilderKernel.ts   - Auto Builder Kernel
├── AutoBuilderMemory.ts   - Memory Management
├── BlueprintArchitect.ts  - Blueprint Architecture
├── BuildPipeline.ts       - Build Pipeline
├── DeliveryEngine.ts      - Delivery Engine
├── FeatureInjector.ts     - Feature Injection
├── TemplateEngine.ts      - Template Engine
├── VoiceUnderstanding.ts  - Voice Understanding
├── index.ts              - Main Export
└── types.ts              - Type Definitions
```

#### Middleware (13 Files)
```
adminAuth.js              - Admin Authentication
cacheMiddleware.js        - Caching
errorHandler.js           - Error Handling
inputValidator.js         - Input Validation
outputSanitization.js     - Output Sanitization
rateLimiter.js            - Rate Limiting
userIsolation.js          - User Isolation
validation.js             - Validation
```

#### Core Systems
```
CognitiveDebugger.js      - Cognitive Debugging
ServiceManager.js         - Service Management (PM2)
```

### 3. Client Portal - `apps/client-portal/`

#### الملفات الرئيسية
- `app-new.js` - Main Application
- `index.html` - Entry Point
- `styles.css` - Styles

#### Pages
- `pages/AuthPage.js` - Authentication Page
- `pages/DashboardPage.js` - Dashboard
- `pages/LibrariesPage.js` - Libraries
- `pages/PreviewPage.js` - Preview
- `pages/PaymentsPage.js` - Payments

#### Services
- `services/VoiceAgentService.js` - Voice Agent
- `services/BuilderIntegrationService.js` - Builder Integration
- `services/PortalAgent.js` - Portal Agent
- `services/SmartPortalAgent.js` - Smart Portal Agent
- `services/ClientPortalAgent.js` - Client Portal Agent

#### Components
- `components/RARECharacter.js` - RARE Character Component

#### Themes & i18n
- `themes/themes.js` - Theme Manager
- `i18n/languages.js` - Language Manager

---

## 📱 نظام iOS

### معلومات iOS الأساسية

#### Bundle Identifier
```
com.rare4n.app
```
**ملاحظة**: قد يكون مختلفاً في ملفات التكوين الفعلية. يجب التحقق من:
- `mobile/app.config.js` (إن وجد)
- `mobile/eas.json` (إن وجد)
- ملفات Xcode Project

#### Team ID
```
[يجب التحقق من ملفات iOS الفعلية]
```
**ملاحظة**: Team ID موجود عادة في:
- Apple Developer Account
- Xcode Project Settings
- Provisioning Profiles

#### Platform
- **iOS Only** - نظام iOS حصري
- **Single User** - لمستخدم واحد فقط
- **Native iOS App** - تطبيق iOS أصلي

#### Build System
- **Expo** - Expo Framework
- **EAS Build** - Expo Application Services
- **React Native** - React Native Core

### متطلبات iOS
- **Minimum iOS Version**: iOS 13.0+
- **Target iOS Version**: iOS 17.0+
- **Architecture**: arm64 (Apple Silicon & Intel)

---

## 🗄️ قواعد البيانات

### 1. MongoDB (Primary Database)

#### Connection Details
```javascript
MONGODB_URI: mongodb+srv://algeneralns_db_user:XWeCOl0X8fd9IVjc@cluster0.u5c1uim.mongodb.net/?appName=Cluster0
Database Name: rare4n
```

#### Location
- **File**: `apps/backend/src/database/mongodb.js`
- **Type**: Cloud MongoDB (MongoDB Atlas)
- **Purpose**: Main data storage

#### Features
- Connection Pooling (maxPoolSize: 10, minPoolSize: 2)
- Retry Logic (3 retries with 5s delay)
- Health Check
- Auto-reconnection

### 2. Supabase (Real-time Database)

#### Connection Details
```javascript
SUPABASE_URL: https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_KEY: sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
```

#### Location
- **File**: `apps/backend/src/database/supabase.js`
- **Type**: Supabase Cloud Database
- **Purpose**: Real-time features, sync

#### Features
- Real-time subscriptions
- Auto token refresh
- Session persistence
- Schema: `public`

### 3. SQLite (Local Database)

#### Connection Details
```javascript
DB_PATH: apps/backend/data/abo-zien.db
```

#### Location
- **File**: `apps/backend/src/database/localDB.js`
- **Type**: SQLite (better-sqlite3)
- **Purpose**: Local/offline storage

#### Features
- Local file-based database
- Foreign keys enabled
- Offline support
- Tables: users, sessions, projects, etc.

### Hybrid Database Strategy
المشروع يستخدم استراتيجية هجينة:
- **MongoDB**: Main storage (cloud)
- **Supabase**: Real-time sync
- **SQLite**: Local/offline backup

---

## 🔧 الخدمات (Services)

### Backend Services (30+ Services)

#### 1. AI & ML Services
- **elevenlabsService.js** - ElevenLabs Voice AI
- **elevenLabsAgentService.js** - ElevenLabs Agent
- **visionService.js** - Vision AI
- **whisperService.js** - Whisper Speech-to-Text
- **ocrService.js** - OCR (Optical Character Recognition)

#### 2. Communication Services
- **twilioService.js** - Twilio SMS/Voice
- **communicationservice.js** - Communication Hub
- **emailService.js** - Email Service

#### 3. Build & Development Services
- **autoBuilderService.js** - Auto Builder
- **buildService.js** - Build Service
- **projectGeneratorService.js** - Project Generator
- **fileGeneratorService.js** - File Generator
- **fileConverterService.js** - File Converter
- **githubService.js** - GitHub Integration
- **expoService.js** - Expo/EAS Integration
- **terminalSandbox.js** - Terminal Sandbox

#### 4. Payment Services
- **paymentservice.js** - Payment Processing
- **paymentMethodsService.js** - Payment Methods
- **costManager.js** - Cost Management

#### 5. Maps & Location Services
- **appleMapsService.js** - Apple Maps Integration
- **weatherKitService.js** - Weather Kit Service

#### 6. Infrastructure Services
- **cacheService.js** - Caching
- **apiService.js** - API Service
- **apiKeyValidator.js** - API Key Validation
- **clientPortalService.js** - Client Portal Service

#### 7. Agent Services
- **agentTools.js** - Agent Tools
- **agentToolsWebhook.js** - Agent Tools Webhook

### Mobile App Services

#### Core Services
- `services/apiKeys.ts` - API Keys Management
- `services/config.ts` - Configuration
- `services/fileManager.ts` - File Management
- `services/translationService.ts` - Translation

### Client Portal Services

#### Portal Services
- `services/VoiceAgentService.js` - Voice Agent
- `services/BuilderIntegrationService.js` - Builder Integration
- `services/PortalAgent.js` - Portal Agent
- `services/SmartPortalAgent.js` - Smart Portal Agent
- `services/ClientPortalAgent.js` - Client Portal Agent

---

## ⚙️ المحركات (Engines)

### Mobile App Engines

#### 1. RAREPersonalityEngine
- **Location**: `mobile/core/engines/RAREPersonalityEngine.ts`
- **Purpose**: Personality traits and behavior
- **Features**: Personality modeling, trait analysis

#### 2. RAREEmotionEngine
- **Location**: `mobile/core/engines/RAREEmotionEngine.ts`
- **Purpose**: Emotion recognition and processing
- **Features**: Emotion detection, sentiment analysis

#### 3. RAREDialectEngine
- **Location**: `mobile/core/engines/RAREDialectEngine.ts`
- **Purpose**: Language dialect and style
- **Features**: Dialect processing, language style

### Backend Engines

#### Auto Builder Engines
- **AutoBuilderKernel** - Core builder logic
- **BlueprintArchitect** - Architecture design
- **BuildPipeline** - Build process
- **DeliveryEngine** - Delivery system
- **FeatureInjector** - Feature injection
- **TemplateEngine** - Template processing
- **VoiceUnderstanding** - Voice processing

---

## 🧠 الكور (Core Systems)

### Mobile App Core

#### 1. RAREKernel
- **Location**: `mobile/core/RAREKernel.ts`
- **Purpose**: Central orchestration engine
- **Architecture**: Kernel → Engines → Agents → Services
- **Features**:
  - Agent management
  - Engine coordination
  - Event bus
  - Context store
  - Policy engine
  - Memory engine
  - Awareness system

#### 2. RAREEngine
- **Location**: `mobile/core/RAREEngine.ts`
- **Purpose**: Base engine interface
- **Features**: Lifecycle management, kernel communication

#### 3. ContextStore
- **Location**: `mobile/core/ContextStore.ts`
- **Purpose**: Context management
- **Features**: State storage, context sharing

#### 4. EventBus
- **Location**: `mobile/core/EventBus.ts`
- **Purpose**: Event system
- **Features**: Pub/sub, event routing

#### 5. PolicyEngine
- **Location**: `mobile/core/PolicyEngine.ts`
- **Purpose**: Policy management
- **Features**: Rule enforcement, policy validation

#### 6. MemoryEngine
- **Location**: `mobile/core/MemoryEngine.ts`
- **Purpose**: Memory management
- **Features**: Memory storage, retrieval

#### 7. AwarenessSystem
- **Location**: `mobile/core/AwarenessSystem.ts`
- **Purpose**: System awareness
- **Features**: Context awareness, state monitoring

#### 8. CognitiveLoop
- **Location**: `mobile/core/CognitiveLoop.ts`
- **Purpose**: Cognitive processing loop
- **Features**: Continuous processing, learning

#### 9. ConsciousnessEngine
- **Location**: `mobile/core/ConsciousnessEngine.ts`
- **Purpose**: Consciousness simulation
- **Features**: Self-awareness, decision making

#### 10. RAREKernel (Main)
- **Location**: `mobile/core/RAREKernel.ts`
- **Purpose**: Main kernel orchestrator

### Backend Core

#### 1. CognitiveDebugger
- **Location**: `apps/backend/src/core/CognitiveDebugger.js`
- **Purpose**: Cognitive debugging
- **Features**: Debug tracking, analysis

#### 2. ServiceManager
- **Location**: `apps/backend/src/core/ServiceManager.js`
- **Purpose**: Service management (PM2)
- **Features**:
  - Backend service control
  - Cloudflare tunnel control
  - Service status monitoring
  - PM2 integration

---

## 🤖 العملاء (Agents)

### Mobile App Agents (13 Agents)

#### 1. BaseAgent
- **Location**: `mobile/core/agents/BaseAgent.ts`
- **Purpose**: Base agent class
- **Features**: Common agent functionality

#### 2. BuilderAgent
- **Location**: `mobile/core/agents/BuilderAgent.ts`
- **Purpose**: App building agent
- **Features**: App generation, build management

#### 3. VoiceAgent
- **Location**: `mobile/core/agents/VoiceAgent.ts`
- **Purpose**: Voice interaction agent
- **Features**: Voice commands, speech processing

#### 4. VaultAgent
- **Location**: `mobile/core/agents/VaultAgent.ts`
- **Purpose**: Vault management agent
- **Features**: Secure storage, encryption

#### 5. MapsAgent
- **Location**: `mobile/core/agents/MapsAgent.ts`
- **Purpose**: Maps and navigation agent
- **Features**: Navigation, location services

#### 6. CommunicationAgent
- **Location**: `mobile/core/agents/CommunicationAgent.ts`
- **Purpose**: Communication agent
- **Features**: Messaging, calls

#### 7. CouncilAgent
- **Location**: `mobile/core/agents/CouncilAgent.ts`
- **Purpose**: Council decision-making agent
- **Features**: Multi-agent coordination

#### 8. CarPlayAgent
- **Location**: `mobile/core/agents/CarPlayAgent.ts`
- **Purpose**: CarPlay integration agent
- **Features**: CarPlay support, drive mode

#### 9. UltimateAssistant
- **Location**: `mobile/core/agents/UltimateAssistant.ts`
- **Purpose**: Ultimate AI assistant
- **Features**: Advanced AI capabilities

#### 10. PortalAgent
- **Location**: `mobile/core/agents/PortalAgent.ts`
- **Purpose**: Portal integration agent
- **Features**: Portal communication

#### 11. ServiceAgent
- **Location**: `mobile/core/agents/ServiceAgent.ts`
- **Purpose**: Service management agent
- **Features**: Service control, monitoring

#### 12. LoyaltyAgent
- **Location**: `mobile/core/agents/LoyaltyAgent.ts`
- **Purpose**: Loyalty program agent
- **Features**: Loyalty management

#### 13. FilingAgent
- **Location**: `mobile/core/agents/FilingAgent.ts`
- **Purpose**: File management agent
- **Features**: File operations, organization

### Client Portal Agents

#### 1. PortalAgent
- **Location**: `apps/client-portal/services/PortalAgent.js`
- **Purpose**: Portal agent

#### 2. SmartPortalAgent
- **Location**: `apps/client-portal/services/SmartPortalAgent.js`
- **Purpose**: Smart portal agent

#### 3. ClientPortalAgent
- **Location**: `apps/client-portal/services/ClientPortalAgent.js`
- **Purpose**: Client portal agent

---

## 📺 الشاشات (Screens)

### Mobile App Screens (18 Screens)

#### 1. Splash Screen (`splash.tsx`)
- **Purpose**: Initial loading screen
- **Features**: Authentication check, initialization

#### 2. Login Screen (`login.tsx`)
- **Purpose**: User authentication
- **Features**: Login, registration

#### 3. Home Screen (`home.tsx`)
- **Purpose**: Main dashboard
- **Features**: 
  - App sections (Systems & Intelligence, Control & Environment)
  - Quick access to all features
  - Voice control

#### 4. Boot Screen (`boot.tsx`)
- **Purpose**: System initialization
- **Features**: Boot process, system check

#### 5. App Builder (`app-builder.tsx`)
- **Purpose**: Application building
- **Features**:
  - Build services (iOS, Android, Expo, Web)
  - Quick commands
  - Terminal integration
  - Libraries management
  - Portal requests

#### 6. Generator (`generator.tsx`)
- **Purpose**: File/content generation
- **Features**:
  - DALL-E 3 (Image generation)
  - ElevenLabs (Audio generation)
  - Vision AI (Image analysis)
  - Video AI
  - Document generation
  - Dev Ops (Code generation)

#### 7. RARE Vault (`rarevault.tsx`)
- **Purpose**: Secure storage
- **Features**: Encrypted storage, secure files

#### 8. Council (`council.tsx`)
- **Purpose**: Multi-agent council
- **Features**: Agent coordination, decision making

#### 9. CarPlay (`carplayscreen.tsx`)
- **Purpose**: CarPlay integration
- **Features**: Drive mode, car controls

#### 10. Maps (`maps.tsx`)
- **Purpose**: Maps and navigation
- **Features**: Navigation, location services

#### 11. Ultimate Assistant (`ultimate assisstant.tsx`)
- **Purpose**: Advanced AI assistant
- **Features**: Advanced AI capabilities

#### 12. Control Room (`control-room.tsx`)
- **Purpose**: System control
- **Features**: System monitoring, control

#### 13. Code Generator (`code-generator.tsx`)
- **Purpose**: Code generation
- **Features**: Code generation, templates

#### 14. Settings (`settings.tsx`)
- **Purpose**: App settings
- **Features**:
  - Theme selection
  - Language selection
  - Font selection
  - Voice library
  - Password management
  - Dialect settings
  - List layout
  - Customization

#### 15. SOS (`sos.tsx`)
- **Purpose**: Emergency services
- **Features**: Emergency contacts, SOS

#### 16. App Builder Service Control (`app-builder-service-control.tsx`)
- **Purpose**: Service control for app builder
- **Features**: Service management

### Client Portal Pages

#### 1. Auth Page (`AuthPage.js`)
- **Purpose**: Authentication
- **Features**: Login, registration

#### 2. Dashboard Page (`DashboardPage.js`)
- **Purpose**: Main dashboard
- **Features**: Overview, statistics

#### 3. Libraries Page (`LibrariesPage.js`)
- **Purpose**: Libraries management
- **Features**: Library browsing, management

#### 4. Preview Page (`PreviewPage.js`)
- **Purpose**: Preview functionality
- **Features**: Preview features

#### 5. Payments Page (`PaymentsPage.js`)
- **Purpose**: Payment management
- **Features**: Payment processing, history

---

## ☁️ Cloudflare Configuration

### Cloudflare Tunnel

#### Tunnel ID
```
8280d872-79cc-4b82-9de8-a86ab4bf9540
```

#### Configuration
- **Service Name**: `CF-MAESTRO` (in PM2)
- **Process Manager**: PM2
- **Command**: `cloudflared tunnel run 8280d872-79cc-4b82-9de8-a86ab4bf9540`

#### Domains
- **API Domain**: `api.zien-ai.app`
- **Portal Domain**: `portal.zien-ai.app` (if configured)

#### Routing
- `api.zien-ai.app` → `http://localhost:5000` (Backend API)

#### Location
- **Config File**: `apps/backend/config.yml` (if exists)
- **Service Manager**: `apps/backend/src/core/ServiceManager.js`

### PM2 Configuration

#### Services Managed by PM2
1. **rare4n-backend**
   - **File**: `apps/backend/src/server.js`
   - **Port**: 5000
   - **Status**: Managed by PM2

2. **cloudflare-tunnel** (CF-MAESTRO)
   - **Command**: `cloudflared tunnel run [TUNNEL_ID]`
   - **Status**: Managed by PM2

#### PM2 Config File
- **Location**: `ecosystem.config.js` (if exists)
- **Purpose**: PM2 process configuration

---

## 🔐 المفاتيح والبيانات الحساسة

### Database Credentials

#### MongoDB
```
URI: mongodb+srv://algeneralns_db_user:XWeCOl0X8fd9IVjc@cluster0.u5c1uim.mongodb.net/?appName=Cluster0
Username: algeneralns_db_user
Password: XWeCOl0X8fd9IVjc
Database: rare4n
```
**Location**: `apps/backend/src/database/mongodb.js`

#### Supabase
```
URL: https://fgvrilruqzajstprioqj.supabase.co
Key: sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
```
**Location**: `apps/backend/src/database/supabase.js`

### API Keys (Locations)

#### Environment Variables
- **Location**: `apps/backend/.env` (if exists)
- **Note**: يجب التحقق من ملفات `.env` للبحث عن المفاتيح

#### Common API Keys to Check
1. **OpenAI API Key** - GPT services
2. **ElevenLabs API Key** - Voice services
3. **Twilio Credentials** - SMS/Voice
4. **Apple Maps API Key** - Maps service
5. **Weather Kit Key** - Weather service
6. **GitHub Token** - GitHub integration
7. **Sentry DSN** - Error tracking

### iOS Certificates & Keys

#### Bundle Identifier
```
com.rare4n.app (estimated)
```

#### Team ID
```
[يجب التحقق من Apple Developer Account]
```

#### Provisioning Profiles
- **Location**: `mobile/ios/` (if exists)
- **Note**: قد تكون في Xcode Project

#### Certificates
- **Location**: Apple Developer Portal
- **Note**: يجب التحقق من Apple Developer Account

### Cloudflare Tunnel

#### Tunnel ID
```
8280d872-79cc-4b82-9de8-a86ab4bf9540
```

#### Tunnel Token
- **Location**: Cloudflare Dashboard
- **Note**: قد يكون في ملفات التكوين

---

## 🏛️ البنية التحتية

### Server Configuration

#### Backend Server
- **Port**: 5000 (default)
- **Framework**: Express.js
- **WebSocket**: Socket.IO
- **Process Manager**: PM2
- **Environment**: Production/Development

#### CORS Configuration
```javascript
Allowed Origins:
- https://api.zien-ai.app
- https://portal.zien-ai.app
- http://localhost:5000
- exp://localhost:8081
- http://localhost:19006
```

### Monitoring & Logging

#### Sentry
- **Purpose**: Error tracking
- **Location**: `apps/backend/src/utils/sentry.js`
- **Integration**: Automatic error reporting

#### Logger
- **Purpose**: Logging
- **Location**: `apps/backend/src/utils/logger.js`
- **Features**: Structured logging

### Security

#### Middleware
- **Rate Limiting**: `rateLimiter.js`
- **Input Validation**: `inputValidator.js`
- **Output Sanitization**: `outputSanitization.js`
- **Admin Auth**: `adminAuth.js`
- **User Isolation**: `userIsolation.js`

#### Protocols
- **Absolute Loyalty Protocol**: `mobile/core/protocols/absolute-loyalty-protocol.ts`
- **Guardian Protocol**: `mobile/core/protocols/guardian-protocol.ts`

### Health & Metrics

#### Health Check
- **Endpoint**: `/api/health`
- **Location**: `apps/backend/src/routes/health.js`
- **Features**: System status, database checks, metrics

---

## 📊 إحصائيات المشروع

### الملفات
- **Total Files**: ~500+ files
- **Routes**: 47 route files
- **Services**: 30+ service files
- **Screens**: 18 iOS screens
- **Agents**: 13 mobile agents
- **Engines**: 3 mobile engines
- **Core Systems**: 10+ core systems

### الكود
- **Backend**: ~38,371+ lines (from last commit)
- **Mobile**: Extensive TypeScript/React Native code
- **Client Portal**: Vanilla JavaScript SPA

### قواعد البيانات
- **MongoDB**: Cloud (MongoDB Atlas)
- **Supabase**: Cloud (Real-time)
- **SQLite**: Local file

---

## 🔄 التحديثات والتطوير

### آخر تحديث
- **Date**: 2025-01-XX
- **Commit**: Clean version without secrets
- **Status**: All files uploaded to GitHub

### التطوير المستقبلي
- iOS App Store submission
- Enhanced AI capabilities
- Additional services integration
- Performance optimization

---

## 📝 ملاحظات مهمة

### الأمان
- ⚠️ **جميع المفاتيح والبيانات الحساسة يجب أن تكون في ملفات `.env`**
- ⚠️ **لا ترفع ملفات `.env` إلى GitHub**
- ⚠️ **استخدم Git secrets scanning**

### النظام
- ✅ **نظام iOS حصري** - لا يدعم Android
- ✅ **نظام لمستخدم واحد** - Single User System
- ✅ **نظام متكامل** - جميع المكونات مترابطة

### التطوير
- 🔧 **Backend**: Node.js + Express
- 🔧 **Mobile**: React Native + Expo
- 🔧 **Portal**: Vanilla JavaScript
- 🔧 **Database**: MongoDB + Supabase + SQLite

---

## 📞 الدعم والمساعدة

### الموقع
- **GitHub**: https://github.com/algeneral-n/abo-zien
- **Local**: C:\abo-zien

### الوثائق
- هذا التقرير الشامل
- ملفات README في كل مجلد
- تعليقات الكود

---

**تم إنشاء هذا التقرير في**: 2025-01-XX
**الإصدار**: 1.0.0
**الحالة**: Complete Project Documentation

---

*تم إنشاء هذا التقرير الشامل بناءً على تحليل كامل للمشروع*

