# CaseX - CS2 Skins Marketplace

O'zbekiston uchun CS2 skinlari marketplace platformasi

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

## Boshlash

### Backend

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
cp .env.example .env.local
# .env.local faylini sozlang
npm run dev
```

Frontend: http://localhost:3000

## Kerakli Sozlamalar

### Database

NeonDB (PostgreSQL cloud) ishlatilmoqda - sozlash kerak emas, allaqachon sozlangan.

### Environment Variables

Backend `.env` (allaqachon sozlangan):
```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=casex-secret-key-2024-change-in-production
STEAM_API_KEY=D1F69A0550E0B0446A74FF3E41DB128C
STEAM_RETURN_URL=http://localhost:4000/api/auth/steam/callback
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
