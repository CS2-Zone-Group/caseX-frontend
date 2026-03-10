# CaseX — Loyiha Holati va Reja

> Oxirgi yangilanish: 2026-03-09

## Loyiha haqida

CaseX — O'zbekiston bozori uchun CS2 skinlar marketplace platformasi.
NestJS backend + Next.js frontend + PostgreSQL (NeonDB).

---

## Arxitektura

```
caseX-backend/   — NestJS (TypeScript), TypeORM, PostgreSQL
caseX-frontend/  — Next.js 14 (TypeScript), Zustand, Tailwind CSS
```

**Deploy:** PM2, API: api.casex.uz, Frontend: casex.uz
**DB:** NeonDB PostgreSQL (cloud, SSL)
**Logging:** Grafana Loki + Winston

---

## Bajarilgan ishlar

### Backend (12 modul)

| Modul | Endpoint-lar | Holat |
|-------|-------------|-------|
| **Auth** | register, login, verify-email-code, resend, steam, google, phone OTP | ✅ To'liq |
| **Users** | profile, balance, change-password | ✅ To'liq |
| **Skins** | GET /skins (filter, search, pagination), GET /skins/:id | ✅ To'liq |
| **Steam** | skin data, batch, inventory, search, popular, cache | ✅ To'liq |
| **Steam Bot** | status, inventory, send-trade, user-inventory | ✅ To'liq |
| **Inventory** | GET inventory, list/unlist items | ✅ To'liq |
| **Cart** | get, add, remove, clear | ✅ To'liq |
| **Favorites** | add, remove, list, check, ids, count | ✅ To'liq |
| **Email** | SMTP, verification code template | ✅ To'liq |
| **Telegram** | Gateway API, OTP sending/verifying | ✅ To'liq |
| **Health** | full check, simple status | ✅ To'liq |
| **Logging** | Loki, Winston, action/error tracking | ✅ To'liq |

### Frontend (16+ sahifa)

| Sahifa/Funksiya | Holat |
|----------------|-------|
| Home page (featured skins) | ✅ |
| Marketplace (filter, search, sort) | ✅ |
| Cart (real-time total) | ✅ |
| Inventory (DB + Steam merged) | ✅ |
| Favorites | ✅ |
| Profile dashboard | ✅ |
| Auth: Login, Register, Steam OAuth | ✅ |
| Auth: Google OAuth | ✅ |
| Auth: Phone OTP (Telegram Gateway) | ✅ |
| Auth: Email verification (6-digit) | ✅ |
| Settings modal | ✅ |
| Password change | ✅ |
| i18n (uz/ru/en) | ✅ |
| Theme toggle (dark/light) | ✅ |
| Admin page (asosiy) | 🔄 Minimal |
| Admin: Steam import | ✅ |
| Checkout | 🔄 Stub |
| Transaction history | 🔄 Stub |
| Chat support | 🔄 Stub |

### DB Entitylar (7 ta)

| Entity | Jadval | Asosiy maydonlar |
|--------|--------|-----------------|
| User | users | id, steamId, username, email, password, balance, role, phoneNumber, googleId, locale |
| Skin | skins | id, name, weaponType, rarity, exterior, price, imageUrl, marketHashName, steamIconUrl, float |
| Inventory | inventory | id, userId, skinId, isListed, listPrice, acquiredAt |
| Cart | cart | id, userId, skinId, quantity, addedAt |
| Favorite | favorites | id, userId, skinId, createdAt |
| EmailVerification | email_verifications | id, userId, code, expiresAt, attempts |
| OtpVerification | otp_verifications | id, phoneNumber, code, requestId, attempts, expiresAt |

---

## Mavjud muammolar

### 1. Skin rasmlari ishlamayapti
- Seed datadagi `imageUrl` lar soxta/eskirgan Steam CDN hash-lar
- `steamcommunity.com` API rate limit qilyapti
- **Yechim:** `qwkdev/csapi` GitHub reposidan real icon URL-larni olish yoki `node-cs2-cdn` paketi orqali

### 2. Backend devDependencies muammosi
- `.npmrc` da `production=true` turadi — `npm install` devDependencies o'rnatmaydi
- Lokal dev uchun `npm install --include=dev` kerak

---

## Bajarilmagan ishlar (Reja)

### Yuqori ustuvorlik (Critical)

#### 1. To'lov tizimi (Payment Integration)
**Holat:** ❌ Hech narsa yo'q
**Kerak:**
- `payments` modul (backend)
- `Transaction` entity: id, userId, type (deposit/withdraw/purchase/sell), amount, status, provider, providerTxId, createdAt
- Payme/Click/Paynet integratsiya
- Deposit endpoint-lari (to'lov yaratish, callback)
- Balance yangilash logikasi (atomik operatsiyalar)
- Frontend: checkout sahifasini to'liq qilish, to'lov oynasi

#### 2. Checkout/Xarid logikasi
**Holat:** 🔄 Cart bor, lekin xarid qilish yo'q
**Kerak:**
- `POST /api/cart/checkout` — balansdan yechish, inventory ga qo'shish
- Atomik tranzaksiya (TypeORM transaction)
- Yetarli balans tekshiruvi
- Skin availability tekshiruvi (ikki kishi bir vaqtda sotib olmasligi)
- Xarid tarixini saqlash
- Frontend: checkout flow, success/error sahifalari

#### 3. Skin rasmlarini tuzatish
**Holat:** 🔄 Ko'p rasmlar singan
**Kerak:**
- Real Steam CDN URL-larni olish (csapi yoki Steam API)
- Seed data yangilash
- DB dagi mavjud ma'lumotlarni yangilash skripti

### O'rta ustuvorlik (Important)

#### 4. Pul yechish (Withdrawal) tizimi
**Holat:** ❌ Hech narsa yo'q
**Kerak:**
- `WithdrawalRequest` entity: id, userId, amount, status (pending/approved/rejected), method, adminNote
- Foydalanuvchi: yechish so'rovi yaratish
- Admin: tasdiqlash/rad etish
- Balansni muzlatish (freeze) mexanizmi
- Withdrawal cooldown (anti-fraud)

#### 5. Admin panel (Backend + Frontend)
**Holat:** 🔄 Juda minimal
**Kerak:**
- Admin guard/middleware
- `GET /api/admin/users` — barcha foydalanuvchilar ro'yxati
- `PATCH /api/admin/users/:id` — foydalanuvchi tahrirlash/bloklash
- `GET /api/admin/transactions` — tranzaksiyalar ro'yxati
- `GET /api/admin/withdrawals` — yechish so'rovlari
- `PATCH /api/admin/withdrawals/:id` — tasdiqlash/rad etish
- `GET /api/admin/stats` — statistika (foydalanuvchilar, sotuvlar, daromad)
- Frontend: to'liq admin dashboard

#### 6. Tranzaksiya tarixi
**Holat:** ❌ Entity yo'q, sahifa stub
**Kerak:**
- `Transaction` entity (to'lov tizimi bilan birgalikda)
- `GET /api/transactions` — foydalanuvchi tranzaksiyalari
- Frontend: `/profile/history` sahifasini to'liq qilish

#### 7. Sell (sotish) logikasi
**Holat:** 🔄 List/unlist bor, lekin haqiqiy sotish yo'q
**Kerak:**
- Boshqa foydalanuvchi listed itemni sotib olganda:
  - Sotuvchi balansiga pul qo'shilsin
  - Xaridor balansidan pul yechilsin
  - Inventory o'zgarsin
- Komisiya hisoblash (platform fee)

### Past ustuvorlik (Nice to have)

#### 8. Case ochish tizimi
**Holat:** ❌ Hech narsa yo'q (hujjatlarda bor)
**Kerak:**
- `Case` entity: id, name, price, imageUrl, items (ManyToMany Skin)
- `CaseOpening` entity: id, userId, caseId, wonSkinId, createdAt
- Provably fair algoritm
- Frontend: case ochish animatsiyasi

#### 9. Anti-fraud tizimi
**Holat:** 🔄 Faqat OTP rate limit
**Kerak:**
- Global rate limiting (throttler)
- IP tracking
- Suspicious activity detection
- Withdrawal cooldown (yangi hisob uchun)
- Duplicate transaction protection

#### 10. Real-time xususiyatlar
**Holat:** ❌ Yo'q
**Kerak:**
- WebSocket (Socket.io) integratsiya
- Narx yangilanishlari (real-time)
- Chat support (hozir stub)
- Trade notification-lar

#### 11. Steam narx sinxronizatsiyasi
**Holat:** 🔄 Manual (API bor, lekin avtomatik emas)
**Kerak:**
- Cron job: har 1-6 soatda barcha skinlar narxini yangilash
- Steam Market API dan narx olish
- `steamPrice` maydonini avtomatik yangilash

---

## Texnik qarz (Technical Debt)

| Muammo | Tafsilot |
|--------|----------|
| Soxta Steam icon URL-lar | Seed data va steam.service.ts dagi hardcoded URL-lar noto'g'ri |
| `.npmrc` production=true | Dev muhitda devDependencies o'rnatilmaydi |
| Email yuborish | Haqiqiy SMTP sozlanmagan (console.log) |
| Test-lar yo'q | Jest sozlangan, lekin hech qanday test yozilmagan |
| Swagger to'liq emas | Swagger mavjud, lekin DTO-lar to'liq dokumentatsiya qilinmagan |
| Error handling | Ba'zi joylarda generic catch, aniq xato xabarlari kam |

---

## Navbatdagi qadamlar (Tavsiya etilgan tartib)

```
1. ✏️  Skin rasmlarini tuzatish (csapi dan real URL olish)
2. 🛒 Checkout logikasini qilish (cart → purchase → inventory)
3. 💰 Transaction entity va tarix
4. 💳 To'lov tizimi (Payme/Click integratsiya)
5. 💸 Withdrawal tizimi
6. 🛡️ Admin panel (backend + frontend)
7. 📊 Statistika va analytics
8. 🔒 Anti-fraud va rate limiting
9. 🎰 Case ochish (agar kerak bo'lsa)
10. ⚡ WebSocket real-time xususiyatlar
```

---

## Muhit o'zgaruvchilari

**Backend (.env):**
```
DATABASE_URL, JWT_SECRET, JWT_EXPIRATION
STEAM_API_KEY, STEAM_RETURN_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
TELEGRAM_GATEWAY_TOKEN
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
LOKI_URL, LOKI_USERNAME, LOKI_PASSWORD
STEAM_BOT_COUNT, STEAM_BOT_*
PORT, NODE_ENV, FRONTEND_URL
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SITE_URL
```

---

## Test foydalanuvchilar (Seed)

| Rol | Email | Parol |
|-----|-------|-------|
| User | user@casex.uz | password123 |
| Admin | admin@casex.uz | password123 |
| Steam | steam@casex.uz | password123 |
