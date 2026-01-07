/**
 * RARE 4N - Command Validator
 * ✅ SECURITY: Validates terminal commands before execution
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

// Dangerous commands that should be blocked
const DANGEROUS_COMMANDS = [
  'rm -rf',
  'rm -r',
  'del /f',
  'format',
  'shutdown',
  'reboot',
  'sudo',
  'su ',
  'chmod 777',
  'chown',
  'dd if=',
  'mkfs',
  'fdisk',
];

// Allowed commands whitelist (optional - can be used for strict mode)
const ALLOWED_COMMANDS = [
  'eas build',
  'eas build:list',
  'eas build:configure',
  'npm',
  'npm install',
  'npm run',
  'npm start',
  'git',
  'git push',
  'git pull',
  'git status',
  'git add',
  'git commit',
  'expo',
  'expo start',
  'expo publish',
  'analyze',
  'clear',
  'github',
  'build',
  'ls',
  'cd',
  'pwd',
  'cat',
  'echo',
];

/**
 * Validate command
 */
export function validateCommand(command: string, strictMode: boolean = false): ValidationResult {
  if (!command || !command.trim()) {
    return { valid: false, error: 'Command cannot be empty' };
  }

  const trimmed = command.trim();
  const lowerCommand = trimmed.toLowerCase();

  // Check for dangerous commands
  for (const dangerous of DANGEROUS_COMMANDS) {
    if (lowerCommand.includes(dangerous.toLowerCase())) {
      return {
        valid: false,
        error: `Dangerous command detected: ${dangerous}. This command is blocked for security reasons.`,
      };
    }
  }

  // Strict mode: only allow whitelisted commands
  if (strictMode) {
    const isAllowed = ALLOWED_COMMANDS.some(allowed => {
      const lowerAllowed = allowed.toLowerCase();
      return lowerCommand.startsWith(lowerAllowed) || lowerCommand === lowerAllowed;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Command not allowed in strict mode: ${trimmed}. Use 'help' to see allowed commands.`,
      };
    }
  }

  // Check for suspicious patterns
  if (lowerCommand.includes('&&') && lowerCommand.split('&&').length > 3) {
    return {
      valid: false,
      error: 'Too many chained commands. Maximum 3 commands allowed.',
    };
  }

  // Check for command injection attempts
  const suspiciousPatterns = [
    /;\s*(rm|del|format|shutdown)/i,
    /\|\s*(rm|del|format|shutdown)/i,
    /`.*(rm|del|format|shutdown).*`/i,
    /\$\(.*(rm|del|format|shutdown).*\)/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        error: 'Suspicious command pattern detected. Command blocked.',
      };
    }
  }

  // Sanitize command (remove extra spaces, trim)
  const sanitized = trimmed.replace(/\s+/g, ' ').trim();

  return { valid: true, sanitized };
}

/**
 * Get help message for allowed commands
 */
export function getCommandHelp(): string {
  return `
Available Commands:
- eas build [--platform ios|android|all] [--profile production|development]
- eas build:list
- eas build:configure
- npm install [package]
- npm run [script]
- git push|pull|status|add|commit
- expo start|publish
- analyze "project description"
- github push|pull|status
- build [options]
- clear
- help
`;
}

























