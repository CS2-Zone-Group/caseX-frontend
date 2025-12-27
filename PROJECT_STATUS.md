# CaseX - CS2 Skins Marketplace

O'zbekiston uchun CS2 skinlari marketplace platformasi

## 📊 Loyiha Arxitekturasi

### Tech Stack
**Backend:**
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL (NeonDB cloud)
- TypeORM (ORM)
- Passport (Steam OAuth + JWT)
- bcrypt (Password hashing)

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State management)
- Axios (HTTP client)

**Database Schema:**
```
users
├── id (uuid, PK)
├── steamId (unique, nullable)
├── username (unique)
├── email (unique, nullable)
├── password (hashed, nullable)
├── avatar
├── balance (decimal)
└── role (default: 'user')

skins
├── id (uuid, PK)
├── name
├── weaponType
├── rarity
├── exterior
├── price (decimal)
├── imageUrl
├── isAvailable
├── sellerId
├── marketHashName (Steam market hash name)
├── steamIconUrl (Steam icon URL)
├── steamPrice (Steam price)
├── steamVolume (Steam trade volume)
├── steamDataUpdatedAt (Steam data update time)
└── collection (Skin collection)

inventory
├── id (uuid, PK)
├── userId (FK -> users)
├── skinId (FK -> skins)
├── isListed (boolean)
├── listPrice (decimal, nullable)
└── acquiredAt

cart
├── id (uuid, PK)
├── userId (FK -> users)
├── skinId (FK -> skins)
├── quantity
└── addedAt
```

## ✅ Bajarilgan Funksiyalar

### Backend API (NestJS)

#### 1. Authentication
- ✅ `POST /api/auth/register` - Username/Email/Password bilan ro'yxatdan o'tish
- ✅ `POST /api/auth/login` - Email/Password bilan kirish
- ✅ `GET /api/auth/steam` - Steam OAuth login
- ✅ `GET /api/auth/steam/callback` - Steam callback
- ✅ JWT token generation va validation
- ✅ Password hashing (bcrypt)
- ✅ Email va username uniqueness check

#### 2. Users
- ✅ `GET /api/users/profile` - Foydalanuvchi profili (protected)
- ✅ User balance tracking
- ✅ User roles (user, admin)

#### 3. Skins (Marketplace)
- ✅ `GET /api/skins` - Barcha skinlar (pagination, filters, sorting)
  - Query params: page, limit, search, rarity, weaponType, minPrice, maxPrice, sortBy, sortOrder
- ✅ `GET /api/skins/:id` - Bitta skin ma'lumoti
- ✅ `POST /api/skins/:id/update-steam-data` - Skinni Steam ma'lumotlari bilan yangilash
- ✅ `POST /api/skins/update-all-steam-data` - Barcha skinlarni Steam bilan yangilash
- ✅ `GET /api/skins/needing-steam-update` - Steam yangilanishi kerak bo'lgan skinlar
- ✅ `GET /api/skins/:id/image-url` - Skin rasm URL'ini olish (Steam CDN bilan)
- ✅ Advanced filtering:
  - Search by name
  - Filter by rarity (consumer, industrial, mil-spec, restricted, classified, covert)
  - Filter by weapon type
  - Filter by price range
  - Sort by: price, createdAt, name
  - Sort order: ASC, DESC

#### 4. Steam Integration (NEW)
- ✅ `GET /api/steam/skin/:marketHashName` - Steam'dan bitta skin ma'lumoti
- ✅ `POST /api/steam/skins/batch` - Steam'dan bir nechta skin ma'lumoti
- ✅ `GET /api/steam/search` - Steam Market'da qidirish
- ✅ `GET /api/steam/popular` - Mashhur CS:GO skinlari
- ✅ `GET /api/steam/image-url/:marketHashName` - Steam rasm URL generatsiya
- ✅ `GET /api/steam/cdn-image/:iconUrl` - Steam CDN rasm URL
- ✅ `POST /api/steam/cache/clear` - Steam cache tozalash
- ✅ `GET /api/steam/cache/stats` - Steam cache statistikasi
- ✅ `POST /api/steam/parse-skin` - Steam item ma'lumotlarini parse qilish
- ✅ Steam Market API integration
- ✅ Cache tizimi (1 soat TTL)
- ✅ Rate limiting himoyasi
- ✅ Batch processing

#### 5. Inventory (Protected)
- ✅ `GET /api/inventory` - Foydalanuvchi inventori
- ✅ `POST /api/inventory/:id/list` - Skinni sotuvga qo'yish
- ✅ `PATCH /api/inventory/:id/unlist` - Skinni sotuvdan olib tashlash
- ✅ Inventory items bilan skin relations

#### 6. Shopping Cart (Protected)
- ✅ `GET /api/cart` - Savat ko'rish (total price bilan)
- ✅ `POST /api/cart` - Cartga qo'shish
- ✅ `DELETE /api/cart/:id` - Cartdan o'chirish
- ✅ `DELETE /api/cart` - Cartni tozalash
- ✅ Real-time total calculation

### Frontend (Next.js)

#### 1. Authentication Pages
- ✅ `/auth/register` - Ro'yxatdan o'tish (username, email, password)
- ✅ `/auth/login` - Kirish (email, password yoki Steam)
- ✅ `/auth/callback` - Steam OAuth callback handler
- ✅ Form validation
- ✅ Error handling
- ✅ Auto-redirect after login

#### 2. Marketplace
- ✅ `/marketplace` - Skinlar ro'yxati
- ✅ Steam integration:
  - Steam CDN rasm URL'lari
  - Steam narxlari ko'rsatish
  - Fallback image'lar
- ✅ Advanced filters:
  - Search input
  - Rarity dropdown
  - Price range (min/max)
  - Sort options (yangi, arzon, qimmat, nom)
- ✅ "Cartga qo'shish" funksiyasi
- ✅ Real-time filtering
- ✅ Responsive grid layout

#### 3. Inventory
- ✅ `/inventory` - Foydalanuvchi inventori
- ✅ Steam integration:
  - Steam CDN rasm URL'lari
  - Steam narxlari ko'rsatish
- ✅ Skinlarni ko'rish
- ✅ Sotuvga qo'yish (narx belgilash)
- ✅ Sotuvdan olib tashlash
- ✅ Status indicators (sotuvda/sotuvda emas)

#### 4. Shopping Cart
- ✅ `/cart` - Savat sahifasi
- ✅ Cart items ro'yxati
- ✅ Total price calculation
- ✅ O'chirish funksiyasi
- ✅ Hammasini tozalash
- ✅ Checkout button (keyinchalik payment integration)

#### 5. Admin Panel (NEW)
- ✅ `/admin` - Admin dashboard
- ✅ `/admin/steam-import` - Steam'dan skinlarni import qilish
- ✅ Admin layout va navigation
- ✅ Steam import funksiyalari:
  - Steam Market'da qidirish
  - Mashhur skinlarni yuklash
  - Batch import (ko'p skinlarni bir vaqtda)
  - Import progress tracking
  - Skin ma'lumotlarini parse qilish
- ✅ Dashboard statistikasi (mock data)
- ✅ Quick actions menu

#### 6. Steam Integration Library
- ✅ Steam API client (`/lib/steam.ts`)
- ✅ Steam skin data fetching
- ✅ Batch skin data processing
- ✅ Steam image URL generation
- ✅ Steam cache management
- ✅ Skin import funksiyalari
- ✅ Market hash name validation
- ✅ Fallback image handling

#### 7. Components
- ✅ Header - Navigation, cart badge, balance display
- ✅ Auth state management (Zustand)
- ✅ Cart state management (Zustand)
- ✅ API client (Axios with interceptors)
- ✅ SSR-safe localStorage handling
- ✅ Admin layout component
- ✅ Steam import interface

### Database
- ✅ NeonDB (PostgreSQL cloud) ulangan
- ✅ 4 ta table: users, skins, inventory, cart
- ✅ Steam integration fields:
  - `skins.marketHashName` - Steam market hash name
  - `skins.steamIconUrl` - Steam icon URL
  - `skins.steamPrice` - Steam narxi
  - `skins.steamVolume` - Steam savdo hajmi
  - `skins.steamDataUpdatedAt` - Steam ma'lumotlari yangilangan vaqt
  - `skins.collection` - Skin kolleksiyasi
- ✅ Foreign key relationships
- ✅ Auto-sync yoqilgan (development)
- ✅ SSL connection

### GitHub Repositories
- ✅ Backend: https://github.com/diyorbek0309/caseX-backend
- ✅ Frontend: https://github.com/diyorbek0309/caseX-frontend

## 🚀 Ishga Tushirish (Local Development)

### 1. Backend
```bash
cd caseX-backend
npm install
npm run start:dev
```
Server: http://localhost:4000

**Environment Variables (.env):**
```env
DATABASE_URL=postgresql://neondb_owner:npg_biBRfLK2S3kO@ep-young-haze-agn4xats-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=casex-secret-key-2024-change-in-production
STEAM_API_KEY=D1F69A0550E0B0446A74FF3E41DB128C
STEAM_RETURN_URL=http://localhost:4000/api/auth/steam/callback
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend
```bash
cd caseX-frontend
npm install
npm run dev
```
Site: http://localhost:3000

**Environment Variables (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Seeding
```bash
cd caseX-backend
npm run seed:new
```
This will create sample users, skins, and inventory data.

### 4. Test Qilish

#### Register yangi user:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get skins with filters:
```bash
curl "http://localhost:4000/api/skins?page=1&limit=10&sortBy=price&sortOrder=ASC&rarity=covert"
```

## 📱 Foydalanish Oqimi (User Flow)

### 1. Ro'yxatdan o'tish / Kirish
```
User -> /auth/register yoki /auth/login
     -> Email/Password yoki Steam OAuth
     -> JWT token olish
     -> /marketplace ga redirect
```

### 2. Marketplace'da Skin Qidirish
```
User -> /marketplace
     -> Filters ishlatish (search, rarity, price, sort)
     -> Skin tanlash
     -> "Cartga qo'shish" tugmasi
     -> Cart badge yangilanadi
```

### 3. Cart va Checkout
```
User -> /cart
     -> Cart items ko'rish
     -> Total price ko'rish
     -> Items o'chirish/tozalash
     -> "To'lovga o'tish" (keyinchalik payment)
```

### 4. Inventory Management
```
User -> /inventory
     -> O'z skinlarini ko'rish
     -> Skinni sotuvga qo'yish (narx belgilash)
     -> Sotuvdan olib tashlash
```

## 🔄 API Request/Response Flow

### Authentication Flow
```
1. POST /api/auth/register
   Request: { username, email, password }
   Response: { access_token, user: { id, username, email, balance } }

2. POST /api/auth/login
   Request: { email, password }
   Response: { access_token, user: { id, username, email, balance } }

3. Protected endpoints:
   Headers: { Authorization: "Bearer <token>" }
```

### Marketplace Flow
```
1. GET /api/skins?page=1&limit=20&rarity=covert&sortBy=price&sortOrder=ASC
   Response: {
     items: [...],
     total: 100,
     page: 1,
     totalPages: 5
   }

2. POST /api/cart (Protected)
   Request: { skinId: "uuid" }
   Response: { id, userId, skinId, quantity, addedAt }

3. GET /api/cart (Protected)
   Response: {
     items: [...],
     total: 5000,
     itemCount: 3
   }
```

### Inventory Flow
```
1. GET /api/inventory (Protected)
   Response: [
     {
       id, userId, skinId, isListed, listPrice,
       skin: { id, name, imageUrl, rarity, exterior }
     }
   ]

2. POST /api/inventory/:id/list (Protected)
   Request: { price: 1500 }
   Response: { id, isListed: true, listPrice: 1500 }

3. PATCH /api/inventory/:id/unlist (Protected)
   Response: { id, isListed: false, listPrice: null }
```

## 🔑 Test Credentials

### Database Users
- **Regular User**: 
  - Email: `user@casex.uz`
  - Password: `password123`
  - Balance: $5,000.00
  - Role: user

- **Admin User**: 
  - Email: `admin@casex.uz`
  - Password: `password123`
  - Balance: $10,000.00
  - Role: admin

- **Steam User**: 
  - Email: `steam@casex.uz`
  - Password: `password123`
  - Balance: $7,500.00
  - Role: user
  - Steam ID: 76561199361654502
  - Steam Avatar: Available

### Sample Data Created
- **Users**: 3 (1 regular, 1 admin, 1 steam user)
- **Skins**: 8 premium CS2 skins with Steam integration
- **Inventory Items**: 8 items distributed across users
- **Collections**: Various CS2 collections (Phoenix, Cobblestone, Huntsman, etc.)

### Available Skins in Database
1. AK-47 | Redline (Field-Tested) - $45.99
2. AWP | Dragon Lore (Factory New) - $8,500.00
3. M4A4 | Howl (Minimal Wear) - $3,200.00
4. Glock-18 | Fade (Factory New) - $285.50
5. Karambit | Doppler (Factory New) - $1,850.00
6. USP-S | Kill Confirmed (Field-Tested) - $125.75
7. AK-47 | Fire Serpent (Well-Worn) - $1,250.00
8. M4A1-S | Hot Rod (Factory New) - $89.99

## 📋 Keyingi Qadamlar

### 1. Transaction System (Priority: High)
- [ ] Transactions table yaratish
- [ ] Xarid qilish funksiyasi (cart checkout)
- [ ] Balance deduction
- [ ] Inventory'ga skin qo'shish
- [ ] Transaction history API
- [ ] Transaction status tracking

### 2. Payment Integration (Priority: High)
- [ ] Click.uz integration
- [ ] Payme integration
- [ ] Uzcard integration
- [ ] Payment callback handling
- [ ] Balance top-up funksiyasi
- [ ] To'lov tarixi

### 3. Admin Panel Enhancement (Priority: Medium)
- ✅ Admin dashboard yaratildi
- ✅ Steam import sahifasi yaratildi
- [ ] Admin authentication (role-based access)
- [ ] User management (view, edit, ban)
- [ ] Skin management (CRUD operations)
- [ ] Transaction monitoring
- [ ] Analytics dashboard (real data)
- [ ] Revenue tracking
- [ ] Admin skin editing interface
- [ ] Bulk skin operations

### 4. Steam Integration Enhancement (Priority: Medium)
- ✅ Steam Market API integration
- ✅ Bulk import skins
- ✅ Steam image URL generation
- ✅ Cache system
- [ ] Real Steam API key setup (production)
- [ ] Steam inventory API integration
- [ ] Steam trade offers
- [ ] Steam price tracking (scheduled jobs)
- [ ] Steam market trends
- [ ] Auto-update skin prices

### 5. User Features (Priority: Medium)
- [ ] User profile page
- [ ] Trade history page
- [ ] Wishlist funksiyasi
- [ ] Notifications system
- [ ] Email verification
- [ ] Password reset

### 6. Advanced Features (Priority: Low)
- [ ] Real-time notifications (WebSocket)
- [ ] Live chat support
- [ ] Referral system
- [ ] Promo codes
- [ ] Email notifications
- [ ] SMS notifications (Eskiz.uz)

### 7. Optimization (Priority: Low)
- [ ] Redis caching
- [ ] Image optimization (Next.js Image)
- [ ] SEO optimization
- [ ] Performance monitoring (Sentry)
- [ ] Database indexing
- [ ] API rate limiting

### 8. Deployment
- [ ] Backend: Railway yoki Render
- [ ] Frontend: Vercel
- [ ] Domain: casex.uz
- [ ] SSL certificate
- [ ] Environment variables setup
- [ ] CI/CD pipeline

## 🔧 Texnik Tafsilotlar

### Backend Architecture
```
src/
├── auth/
│   ├── dto/
│   │   └── auth.dto.ts (RegisterDto, LoginDto)
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── steam.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── skins/
│   ├── entities/
│   │   └── skin.entity.ts (Steam fields qo'shildi)
│   ├── skins.controller.ts (Steam endpoints)
│   ├── skins.service.ts (Steam integration)
│   └── skins.module.ts
├── steam/ (NEW)
│   ├── steam.controller.ts (Steam API endpoints)
│   ├── steam.service.ts (Steam Market integration)
│   └── steam.module.ts (HttpModule bilan)
├── inventory/
│   ├── entities/
│   │   └── inventory.entity.ts
│   ├── inventory.controller.ts
│   ├── inventory.service.ts
│   └── inventory.module.ts
├── cart/
│   ├── entities/
│   │   └── cart.entity.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── cart.module.ts
├── app.module.ts
└── main.ts
```

### Frontend Architecture
```
src/
├── app/
│   ├── auth/
│   │   ├── register/page.tsx
│   │   ├── login/page.tsx
│   │   └── callback/page.tsx
│   ├── admin/ (NEW)
│   │   ├── steam-import/page.tsx (Steam import interface)
│   │   ├── layout.tsx (Admin layout)
│   │   └── page.tsx (Admin dashboard)
│   ├── marketplace/page.tsx (Steam integration)
│   ├── inventory/page.tsx (Steam integration)
│   ├── cart/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── Header.tsx
├── lib/
│   ├── api.ts (Axios instance)
│   └── steam.ts (NEW - Steam API client)
├── store/
│   ├── authStore.ts (Zustand)
│   └── cartStore.ts (Zustand)
└── public/
    └── images/
        └── default-skin.svg (Fallback image)
```

## 📝 Notes

- Barcha protected endpoints JWT token talab qiladi
- Password minimum 6 ta belgi
- Username 3-20 ta belgi orasida
- Email validatsiya mavjud
- Database auto-sync yoqilgan (development)
- Production'da synchronize: false qilish kerak
- Steam API key production'da o'zgartirilishi kerak
- JWT secret production'da kuchli qilinishi kerak

## 🐛 Known Issues

- ✅ Balance display type error - Fixed
- ✅ useSearchParams Suspense boundary - Fixed
- ✅ SSR localStorage issues - Fixed
- ✅ Steam API integration - Implemented
- [ ] Steam API rate limiting (production'da real API key kerak)
- [ ] No real skins data yet (Steam import orqali qo'shish mumkin)
- [ ] No payment integration yet
- [ ] No transaction system yet
- [ ] Admin authentication (hozircha ochiq)

## 🎯 Steam Integration Features

### ✅ Implemented
- Steam Market API integration
- Steam CDN image URLs
- Batch skin data processing
- Cache system (1 hour TTL)
- Rate limiting protection
- Admin Steam import interface
- Steam price display
- Fallback images
- Market hash name validation
- Skin information parsing

### 🔄 Steam API Endpoints
```
GET  /api/steam/skin/:marketHashName     - Single skin data
POST /api/steam/skins/batch              - Batch skin data
GET  /api/steam/search                   - Search Steam Market
GET  /api/steam/popular                  - Popular CS:GO skins
GET  /api/steam/image-url/:marketHashName - Generate image URL
GET  /api/steam/cdn-image/:iconUrl       - Steam CDN image URL
POST /api/steam/cache/clear              - Clear cache
GET  /api/steam/cache/stats              - Cache statistics
POST /api/steam/parse-skin               - Parse skin info
```

### 🎨 Steam Image Integration
- Steam CDN URLs: `https://community.cloudflare.steamstatic.com/economy/image/{iconUrl}/{size}`
- Size options: small (64x48), medium (330x192), large (512x384)
- Fallback to default SVG image
- Error handling with automatic fallback

## 📚 Documentation

- Backend API: `caseX-backend/API.md`
- Backend Setup: `caseX-backend/SETUP.md`
- Frontend Setup: `caseX-frontend/SETUP.md`
- Backend Features: `BACKEND_FEATURES.md`
- Git Setup: `GIT_SETUP.md`
