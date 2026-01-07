/**
 * PM2 Ecosystem Configuration - RARE 4N
 * Process Manager Configuration for Backend and Cloudflare
 */

module.exports = {
  apps: [
    {
      name: 'rare4n-backend',
      script: './apps/backend/src/server.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env_file: './apps/backend/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-backend-error.log',
      out_file: './logs/pm2-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    },
    {
      name: 'CF-MAESTRO',
      script: './cloudflared.exe',
      args: 'tunnel run',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        TUNNEL_TOKEN: process.env.CLOUDFLARE_TUNNEL_TOKEN || ''
      },
      error_file: './logs/pm2-cloudflare-error.log',
      out_file: './logs/pm2-cloudflare-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    }
  ]
};






