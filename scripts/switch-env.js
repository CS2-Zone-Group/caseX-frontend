#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

const localConfig = `# CaseX Frontend Environment Configuration
# Currently configured for: LOCAL DEVELOPMENT

# ===========================================
# LOCAL DEVELOPMENT (for developers)
# ===========================================
# Using local backend - for development
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ===========================================
# PRODUCTION SERVER (for team collaboration)
# ===========================================
# Uncomment these lines if you want to use server backend
# NEXT_PUBLIC_API_URL=https://api.casex.uz/api
# NEXT_PUBLIC_SITE_URL=https://casex.uz

# ===========================================
# QUICK SWITCH GUIDE
# ===========================================
# To switch to SERVER backend: npm run env:server
# To switch to LOCAL backend: npm run env:local
# To check current config: npm run env:status`;

const serverConfig = `# CaseX Frontend Environment Configuration
# Currently configured for: PRODUCTION SERVER (Team Collaboration)

# ===========================================
# PRODUCTION SERVER (for team collaboration)
# ===========================================
# Using deployed backend server - ready for team use
NEXT_PUBLIC_API_URL=https://api.casex.uz/api
NEXT_PUBLIC_SITE_URL=https://casex.uz

# ===========================================
# LOCAL DEVELOPMENT (for developers)
# ===========================================
# Uncomment these lines if you want to use local backend
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ===========================================
# QUICK SWITCH GUIDE
# ===========================================
# To switch to LOCAL backend: npm run env:local
# To switch to SERVER backend: npm run env:server
# To check current config: npm run env:status`;

function getCurrentConfig() {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('NEXT_PUBLIC_API_URL=http://localhost:4000/api') && 
        !content.includes('# NEXT_PUBLIC_API_URL=http://localhost:4000/api')) {
      return 'local';
    } else if (content.includes('NEXT_PUBLIC_API_URL=https://api.casex.uz/api') && 
               !content.includes('# NEXT_PUBLIC_API_URL=https://api.casex.uz/api')) {
      return 'server';
    }
    return 'unknown';
  } catch (error) {
    return 'not-found';
  }
}

function showStatus() {
  const current = getCurrentConfig();
  console.log('\n🔧 CaseX Frontend Environment Status');
  console.log('=====================================');
  
  switch (current) {
    case 'local':
      console.log('✅ Currently using: LOCAL BACKEND (http://localhost:4000)');
      console.log('💡 Switch to server: npm run env:server');
      break;
    case 'server':
      console.log('✅ Currently using: SERVER BACKEND (https://api.casex.uz)');
      console.log('💡 Switch to local: npm run env:local');
      break;
    case 'unknown':
      console.log('⚠️  Configuration unclear - please check .env.local manually');
      break;
    case 'not-found':
      console.log('❌ .env.local file not found');
      console.log('💡 Run: npm run env:server or npm run env:local to create it');
      break;
  }
  console.log('');
}

const command = process.argv[2];

switch (command) {
  case 'local':
    fs.writeFileSync(envPath, localConfig);
    console.log('\n✅ Switched to LOCAL BACKEND');
    console.log('🔗 API URL: http://localhost:4000/api');
    console.log('⚠️  Make sure your local backend is running on port 4000');
    console.log('🚀 Restart your dev server: npm run dev\n');
    break;
    
  case 'server':
    fs.writeFileSync(envPath, serverConfig);
    console.log('\n✅ Switched to SERVER BACKEND');
    console.log('🔗 API URL: https://api.casex.uz/api');
    console.log('🌐 Ready for team collaboration');
    console.log('🚀 Restart your dev server: npm run dev\n');
    break;
    
  case 'status':
    showStatus();
    break;
    
  default:
    console.log('\n🔧 CaseX Environment Switcher');
    console.log('=============================');
    console.log('Usage:');
    console.log('  npm run env:local   - Switch to local backend (localhost:4000)');
    console.log('  npm run env:server  - Switch to server backend (api.casex.uz)');
    console.log('  npm run env:status  - Show current configuration');
    console.log('');
    showStatus();
    break;
}