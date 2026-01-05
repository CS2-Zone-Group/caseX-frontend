# CaseX Frontend Environment Setup

This guide helps you configure the frontend to work with either the local backend or the deployed server backend.

## 🚀 Quick Start

### For Team Members (Using Server Backend)
```bash
npm run env:server
npm run dev
```

### For Developers (Using Local Backend)
```bash
npm run env:local
npm run dev
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run env:server` | Switch to server backend (https://api.casex.uz) |
| `npm run env:local` | Switch to local backend (http://localhost:4000) |
| `npm run env:status` | Check current configuration |

## 🔧 Manual Configuration

If you prefer to configure manually, edit `.env.local`:

### Server Backend (Team Collaboration)
```env
NEXT_PUBLIC_API_URL=https://api.casex.uz/api
NEXT_PUBLIC_SITE_URL=https://casex.uz
```

### Local Backend (Development)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🌐 Backend Status

### Production Server
- **URL**: https://api.casex.uz
- **Status**: ✅ Running
- **Use Case**: Team collaboration, testing, demo

### Local Development
- **URL**: http://localhost:4000
- **Status**: Depends on your local setup
- **Use Case**: Development, debugging, new features

## 🔄 Switching Between Environments

### Method 1: Using NPM Scripts (Recommended)
```bash
# Switch to server backend
npm run env:server

# Switch to local backend  
npm run env:local

# Check current status
npm run env:status
```

### Method 2: Manual Editing
1. Open `.env.local`
2. Comment/uncomment the appropriate lines
3. Restart your dev server

## 🚨 Important Notes

1. **Always restart your dev server** after switching environments:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Local Backend Requirements**:
   - Backend must be running on `http://localhost:4000`
   - Database must be connected
   - All environment variables must be set

3. **Server Backend**:
   - No local setup required
   - Always up-to-date with latest features
   - Shared database with team

## 🐛 Troubleshooting

### "Network Error" or "Connection Refused"
- **Local**: Make sure backend is running on port 4000
- **Server**: Check internet connection

### "401 Unauthorized" Errors
- Clear browser localStorage
- Login again
- Check if token is expired

### Environment Not Switching
1. Check `.env.local` file content
2. Restart dev server completely
3. Clear browser cache
4. Run `npm run env:status` to verify

## 📁 File Structure

```
caseX-frontend/
├── .env.local          # Your current environment config
├── .env.example        # Template with examples
├── scripts/
│   └── switch-env.js   # Environment switching script
└── ENVIRONMENT_SETUP.md # This guide
```

## 🤝 Team Workflow

### For New Team Members
1. Clone the repository
2. Run `npm install`
3. Run `npm run env:server` (use server backend)
4. Run `npm run dev`
5. Start working!

### For Developers
1. Use `npm run env:local` when developing new features
2. Use `npm run env:server` when testing with team
3. Always test with server backend before pushing changes

## 📞 Support

If you have issues with environment setup:
1. Check this guide first
2. Run `npm run env:status` to diagnose
3. Ask team members for help
4. Check backend server status at https://api.casex.uz/api/health