/**
 * RARE 4N - Terminal Sandbox Security Service
 * ✅ حماية شاملة لمنع تنفيذ أوامر خطيرة
 * ✅ التحقق من جميع الأوامر قبل التنفيذ
 * ✅ تحديد الموارد والحدود الزمنية
 * ✅ تنظيف المخرجات لمنع تسريب المعلومات الحساسة
 */

// ✅ قائمة الأوامر المسموحة (Whitelist Approach)
const ALLOWED_COMMANDS = [
  // Git commands
  'git status', 'git add', 'git commit', 'git push', 'git pull', 'git branch', 'git checkout',
  'git log', 'git diff', 'git clone', 'git init', 'git remote',
  
  // NPM/Yarn commands
  'npm install', 'npm run', 'npm start', 'npm build', 'npm test', 'npm ci',
  'yarn install', 'yarn add', 'yarn remove', 'yarn start', 'yarn build',
  
  // Expo commands
  'npx expo', 'expo start', 'expo build', 'eas build', 'eas update',
  
  // File operations (safe only)
  'ls', 'dir', 'cat', 'type', 'echo', 'mkdir', 'cd', 'pwd',
  
  // Build tools
  'node', 'npm', 'yarn', 'npx',
  
  // System info (safe)
  'whoami', 'date', 'time',
];

// ✅ قائمة الأوامر المحظورة (Blacklist - Defense in Depth)
const DANGEROUS_PATTERNS = [
  // File deletion
  'rm -rf', 'rm -r', 'del /f', 'del /s', 'rd /s', 'format',
  
  // System commands
  'shutdown', 'reboot', 'restart', 'killall', 'taskkill',
  
  // Network attacks
  'curl', 'wget', // Only allow in specific contexts
  'nc ', 'netcat', 'telnet',
  
  // Code injection
  'eval', 'exec', 'system', 'shell_exec',
  
  // Path traversal
  '../', '..\\', '/etc/', 'C:\\Windows',
  
  // Sensitive data access
  'cat /etc/passwd', 'cat /etc/shadow', 'type C:\\Windows\\System32',
  
  // Process manipulation
  'kill -9', 'killall', 'pkill',
  
  // Network scanning
  'nmap', 'ping -t', 'traceroute',
  
  // Privilege escalation
  'sudo', 'su ', 'runas',
];

// ✅ قائمة الأنماط المسموحة (للأوامر الديناميكية)
const ALLOWED_PATTERNS = [
  /^git\s+(status|add|commit|push|pull|branch|checkout|log|diff|clone|init|remote)/i,
  /^npm\s+(install|run|start|build|test|ci|add|remove)/i,
  /^yarn\s+(install|add|remove|start|build)/i,
  /^npx\s+(expo|create-)/i,
  /^expo\s+(start|build|init)/i,
  /^eas\s+(build|update|submit)/i,
  /^(ls|dir|cat|type|echo|mkdir|cd|pwd)(\s|$)/i,
  /^node\s+/i,
];

// ✅ حدود الموارد
const RESOURCE_LIMITS = {
  maxExecutionTime: 300000, // 5 minutes
  maxOutputSize: 10 * 1024 * 1024, // 10MB
  maxCommandLength: 1000, // characters
  maxConcurrentCommands: 3,
};

// ✅ معلومات حساسة يجب إخفاؤها من المخرجات
const SENSITIVE_PATTERNS = [
  /(api[_-]?key|apikey)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})/gi,
  /(password|passwd|pwd|secret)\s*[:=]\s*['"]?([^\s'"]+)/gi,
  /(token|bearer)\s+([a-zA-Z0-9_-]{20,})/gi,
  /(mongodb|postgres|mysql):\/\/([^:]+):([^@]+)@/gi,
  /(sk-|pk-|AIza|ghp_|xoxb-)[a-zA-Z0-9_-]{20,}/gi,
];

class TerminalSandbox {
  constructor() {
    this.activeCommands = new Map(); // Track active commands
    this.commandHistory = []; // Keep last 100 commands
    this.maxHistorySize = 100;
  }

  /**
   * ✅ التحقق من الأمر قبل التنفيذ
   */
  validateCommand(command) {
    if (!command || typeof command !== 'string') {
      return {
        allowed: false,
        message: 'Invalid command: Command must be a non-empty string',
        reason: 'INVALID_INPUT',
      };
    }

    // ✅ Check command length
    if (command.length > RESOURCE_LIMITS.maxCommandLength) {
      return {
        allowed: false,
        message: `Command too long. Maximum length: ${RESOURCE_LIMITS.maxCommandLength} characters`,
        reason: 'COMMAND_TOO_LONG',
      };
    }

    // ✅ Trim and normalize
    const normalizedCommand = command.trim();
    const lowerCommand = normalizedCommand.toLowerCase();

    // ✅ Check for dangerous patterns (Blacklist)
    for (const pattern of DANGEROUS_PATTERNS) {
      if (lowerCommand.includes(pattern.toLowerCase())) {
        return {
          allowed: false,
          message: `Dangerous command detected: ${pattern}`,
          reason: 'DANGEROUS_PATTERN',
          pattern,
        };
      }
    }

    // ✅ Check for allowed patterns (Whitelist)
    let isAllowed = false;
    
    // Check exact matches first
    if (ALLOWED_COMMANDS.some(cmd => lowerCommand.startsWith(cmd.toLowerCase()))) {
      isAllowed = true;
    }
    
    // Check pattern matches
    if (!isAllowed) {
      isAllowed = ALLOWED_PATTERNS.some(pattern => pattern.test(normalizedCommand));
    }

    if (!isAllowed) {
      return {
        allowed: false,
        message: 'Command not in allowed list. Only safe build and development commands are permitted.',
        reason: 'NOT_WHITELISTED',
        suggestion: 'Use git, npm, yarn, expo, or eas commands only.',
      };
    }

    // ✅ Check for path traversal attempts
    if (normalizedCommand.includes('../') || normalizedCommand.includes('..\\')) {
      return {
        allowed: false,
        message: 'Path traversal detected. Commands must stay within project directory.',
        reason: 'PATH_TRAVERSAL',
      };
    }

    // ✅ Check for concurrent command limit
    if (this.activeCommands.size >= RESOURCE_LIMITS.maxConcurrentCommands) {
      return {
        allowed: false,
        message: `Too many concurrent commands. Maximum: ${RESOURCE_LIMITS.maxConcurrentCommands}`,
        reason: 'RATE_LIMIT',
      };
    }

    // ✅ Command is safe
    return {
      allowed: true,
      command: normalizedCommand,
      sanitized: this.sanitizeCommand(normalizedCommand),
    };
  }

  /**
   * ✅ تنظيف الأمر من أي محاولات حقن
   */
  sanitizeCommand(command) {
    let sanitized = command;
    
    // Remove any attempt to chain commands
    sanitized = sanitized.split(';')[0].split('&&')[0].split('||')[0].split('|')[0];
    
    // Remove redirection attempts
    sanitized = sanitized.split('>')[0].split('<')[0].split('>>')[0];
    
    // Trim again
    sanitized = sanitized.trim();
    
    return sanitized;
  }

  /**
   * ✅ تنظيف المخرجات من المعلومات الحساسة
   */
  sanitizeOutput(output) {
    if (!output || typeof output !== 'string') {
      return '';
    }

    let sanitized = output;

    // ✅ Remove sensitive information
    for (const pattern of SENSITIVE_PATTERNS) {
      sanitized = sanitized.replace(pattern, (match, key, value) => {
        if (value && value.length > 10) {
          return `${key}=[REDACTED]`;
        }
        return match;
      });
    }

    // ✅ Limit output size
    if (sanitized.length > RESOURCE_LIMITS.maxOutputSize) {
      sanitized = sanitized.substring(0, RESOURCE_LIMITS.maxOutputSize) + '\n...[Output truncated due to size limit]';
    }

    return sanitized;
  }

  /**
   * ✅ الحصول على حدود الموارد
   */
  getResourceLimits() {
    return { ...RESOURCE_LIMITS };
  }

  /**
   * ✅ تسجيل الأمر النشط
   */
  registerActiveCommand(commandId, command) {
    this.activeCommands.set(commandId, {
      command,
      startTime: Date.now(),
    });

    // Add to history
    this.commandHistory.push({
      command,
      timestamp: Date.now(),
    });

    // Keep history size limited
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
  }

  /**
   * ✅ إلغاء تسجيل الأمر النشط
   */
  unregisterActiveCommand(commandId) {
    this.activeCommands.delete(commandId);
  }

  /**
   * ✅ التحقق من انتهاء الوقت المحدد
   */
  checkTimeout(commandId) {
    const activeCommand = this.activeCommands.get(commandId);
    if (!activeCommand) {
      return false;
    }

    const elapsed = Date.now() - activeCommand.startTime;
    return elapsed > RESOURCE_LIMITS.maxExecutionTime;
  }

  /**
   * ✅ الحصول على تاريخ الأوامر
   */
  getCommandHistory(limit = 20) {
    return this.commandHistory.slice(-limit);
  }

  /**
   * ✅ إحصائيات الأمان
   */
  getSecurityStats() {
    return {
      activeCommands: this.activeCommands.size,
      totalHistory: this.commandHistory.length,
      resourceLimits: RESOURCE_LIMITS,
    };
  }
}

// ✅ Singleton instance
let sandboxInstance = null;

/**
 * ✅ الحصول على Terminal Sandbox instance
 */
export function getTerminalSandbox() {
  if (!sandboxInstance) {
    sandboxInstance = new TerminalSandbox();
  }
  return sandboxInstance;
}

export default {
  getTerminalSandbox,
  TerminalSandbox,
  RESOURCE_LIMITS,
  ALLOWED_COMMANDS,
  DANGEROUS_PATTERNS,
};






