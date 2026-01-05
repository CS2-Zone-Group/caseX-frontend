# CaseX - CS2 Skins Marketplace

O'zbekiston uchun CS2 skinlari marketplace platformasi

## 🚀 Quick Start

### For Team Members (Using Server Backend)
```bash
git clone <repository>
cd caseX-frontend
npm install
npm run env:server  # Connect to deployed backend
npm run dev
```

### For Developers (Using Local Backend)
```bash
git clone <repository>
cd caseX-frontend
npm install
npm run env:local   # Connect to local backend
npm run dev
```

**📖 Need help with environment setup? See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**

## Loyiha Strukturasi

```
caseX/
├── caseX-frontend/     # Next.js + TypeScript + Tailwind CSS
├── caseX-backend/      # NestJS + TypeScript + PostgreSQL
└── caseX-admin/        # (keyinchalik qo'shiladi)
```

## Texnologiyalar

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT + Steam OAuth
- Passport

## 🌐 Backend Environments

### Production Server (Team Use)
- **URL**: https://api.casex.uz
- **Status**: ✅ Running
- **Use**: Team collaboration, testing, demo

### Local Development
- **URL**: http://localhost:4000
- **Status**: Depends on your setup
- **Use**: Development, debugging, new features

## Environment Commands

| Command | Description |
|---------|-------------|
| `npm run env:server` | Use server backend (https://api.casex.uz) |
| `npm run env:local` | Use local backend (http://localhost:4000) |
| `npm run env:status` | Check current configuration |

## Boshlash

### Backend (Faqat developerlar uchun)

```bash
cd caseX-backend
npm install
cp .env.example .env
# .env faylini sozlang
npm run start:dev
```

Backend: http://localhost:4000

### Frontend

```bash
cd caseX-frontend
npm install

# Team members (server backend)
npm run env:server
npm run dev

# Developers (local backend)
npm run env:local
npm run dev
```

Frontend: http://localhost:3000

## Kerakli Sozlamalar

### Database

NeonDB (PostgreSQL cloud) ishlatilmoqda - sozlash kerak emas, allaqachon sozlangan.

### Environment Variables

**Automatic Setup (Recommended):**
```bash
npm run env:server  # For server backend
npm run env:local   # For local backend
```

**Manual Setup:**
Backend `.env` (faqat local development uchun):
```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=casex-secret-key-2024-change-in-production
STEAM_API_KEY=D1F69A0550E0B0446A74FF3E41DB128C
STEAM_RETURN_URL=http://localhost:4000/api/auth/steam/callback
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Frontend `.env.local` (automatic via npm scripts):
```env
# Server backend (team use)
NEXT_PUBLIC_API_URL=https://api.casex.uz/api
NEXT_PUBLIC_SITE_URL=https://casex.uz

# Local backend (development)
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Asosiy Funksiyalar

- ✅ Steam OAuth authentication
- ✅ JWT token-based authorization
- ✅ User profile management
- ✅ Skin marketplace
- ✅ O'zbek tili support
- 🔄 Payment integration (Click, Payme) - keyinchalik
- 🔄 Admin panel - keyinchalik
- 🔄 Transaction history
- 🔄 User inventory

## API Endpoints

### Authentication
- `GET /api/auth/steam` - Steam login
- `GET /api/auth/steam/callback` - Steam callback

### Users
- `GET /api/users/profile` - User profile (protected)

### Skins
- `GET /api/skins` - Barcha skinlar

## Development

Har bir loyiha alohida GitHub repo'da:
- Frontend: `caseX-frontend`
- Backend: `caseX-backend`
- Admin: `caseX-admin` (keyinchalik)

## License

MIT
