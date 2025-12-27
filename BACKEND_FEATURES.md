# CaseX Backend - Yangi Funksiyalar

## ✅ Qo'shilgan Funksiyalar

### 1. Username/Password Authentication
- ✅ `POST /api/auth/register` - Ro'yxatdan o'tish
- ✅ `POST /api/auth/login` - Login qilish
- ✅ Email va password validatsiya
- ✅ Password hashing (bcrypt)
- ✅ JWT token generation

### 2. User Inventory Management
- ✅ `GET /api/inventory` - Foydalanuvchi inventorini ko'rish
- ✅ `POST /api/inventory/:id/list` - Skinni sotuvga qo'yish
- ✅ `PATCH /api/inventory/:id/unlist` - Skinni sotuvdan olib tashlash
- ✅ Inventory items bilan skin relations

### 3. Shopping Cart
- ✅ `GET /api/cart` - Cartni ko'rish (total price bilan)
- ✅ `POST /api/cart` - Cartga qo'shish
- ✅ `DELETE /api/cart/:id` - Cartdan o'chirish
- ✅ `DELETE /api/cart` - Cartni tozalash

### 4. Enhanced Skin Filtering & Sorting
- ✅ Search by name
- ✅ Filter by rarity
- ✅ Filter by weapon type
- ✅ Filter by price range (min/max)
- ✅ Sort by: price, createdAt, name
- ✅ Sort order: ASC, DESC
- ✅ Pagination

### 5. Database Schema Updates
- ✅ User entity: email, password fields qo'shildi
- ✅ Inventory entity: user skinlarini saqlash
- ✅ Cart entity: shopping cart items
- ✅ Skin entity: enhanced filtering uchun

## 📊 API Endpoints Summary

### Authentication (Public)
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/steam
GET  /api/auth/steam/callback
```

### Users (Protected)
```
GET  /api/users/profile
```

### Skins (Public)
```
GET  /api/skins
GET  /api/skins/:id
```

### Inventory (Protected)
```
GET   /api/inventory
POST  /api/inventory/:id/list
PATCH /api/inventory/:id/unlist
```

### Cart (Protected)
```
GET    /api/cart
POST   /api/cart
DELETE /api/cart/:id
DELETE /api/cart
```

## 🧪 Test Qilish

### 1. Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get Skins (with filters)
```bash
curl "http://localhost:4000/api/skins?page=1&limit=10&sortBy=price&sortOrder=ASC"
```

### 4. Get Cart (Protected)
```bash
curl http://localhost:4000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 Keyingi Qadamlar

1. **Transaction System** - Xarid/sotish funksiyasi
2. **Payment Integration** - Click, Payme
3. **Admin Panel APIs** - Skin management, user management
4. **Notifications** - Real-time updates
5. **Search Optimization** - Full-text search

## 📝 Notes

- Barcha protected endpoints JWT token talab qiladi
- Password minimum 6 ta belgi
- Username 3-20 ta belgi orasida
- Email validatsiya mavjud
- Database auto-sync yoqilgan (development)
