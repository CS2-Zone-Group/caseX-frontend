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

### 5. Favorites System
- ✅ `POST /api/favorites/:skinId` - Skinni sevimlilar ro'yxatiga qo'shish
- ✅ `DELETE /api/favorites/:skinId` - Skinni sevimlilardan o'chirish
- ✅ `GET /api/favorites` - Foydalanuvchi sevimli skinlarini ko'rish
- ✅ `GET /api/favorites/check/:skinId` - Skin sevimli ekanligini tekshirish
- ✅ `GET /api/favorites/ids` - Sevimli skinlar ID larini olish
- ✅ `GET /api/favorites/count` - Sevimlilar sonini olish

### 6. Sharing System
- ✅ `POST /api/sharing` - Skinni ulashish uchun link yaratish
- ✅ `GET /api/sharing/shared/:shareId` - Ulashilgan skinni ko'rish
- ✅ `GET /api/sharing/my-shares` - Foydalanuvchi ulashgan skinlari
- ✅ `PUT /api/sharing/:shareId` - Ulashish ma'lumotlarini yangilash
- ✅ `DELETE /api/sharing/:shareId` - Ulashishni o'chirish
- ✅ `GET /api/sharing/stats` - Ulashish statistikasi
- ✅ `POST /api/sharing/generate-url` - Tez link yaratish

### 7. Database Schema Updates
- ✅ User entity: email, password fields qo'shildi
- ✅ Inventory entity: user skinlarini saqlash
- ✅ Cart entity: shopping cart items
- ✅ Skin entity: enhanced filtering uchun
- ✅ Favorites entity: user-skin favorites relationship
- ✅ SharedItems entity: skin sharing with analytics

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

### Favorites (Protected)
```
GET    /api/favorites
POST   /api/favorites/:skinId
DELETE /api/favorites/:skinId
GET    /api/favorites/check/:skinId
GET    /api/favorites/ids
GET    /api/favorites/count
```

### Sharing (Protected)
```
POST   /api/sharing
GET    /api/sharing/shared/:shareId
GET    /api/sharing/my-shares
PUT    /api/sharing/:shareId
DELETE /api/sharing/:shareId
GET    /api/sharing/stats
POST   /api/sharing/generate-url
```

## � Sharing A PI Tafsilotlari

### 1. Skinni ulashish uchun link yaratish
```http
POST /api/sharing
Authorization: Bearer <token>
Content-Type: application/json

{
  "skinId": "uuid",
  "title": "My awesome AK-47 Redline", // optional
  "description": "Check out this amazing skin!" // optional
}

Response (201):
{
  "message": "Share created successfully",
  "share": {
    "shareId": "abc123xyz0",
    "shareUrl": "http://localhost:3000/marketplace/shared/abc123xyz0",
    "title": "My awesome AK-47 Redline",
    "description": "Check out this amazing skin!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Ulashilgan skinni ko'rish (Public)
```http
GET /api/sharing/shared/:shareId

Response (200):
{
  "shareId": "abc123xyz0",
  "title": "My awesome AK-47 Redline",
  "description": "Check out this amazing skin!",
  "viewCount": 15,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "skin": {
    "id": "uuid",
    "name": "AK-47 | Redline",
    "weaponType": "rifle",
    "rarity": "classified",
    "exterior": "Field-Tested",
    "price": 125.75,
    "imageUrl": "https://...",
    "marketHashName": "AK-47 | Redline (Field-Tested)"
  },
  "sharedBy": {
    "id": "uuid",
    "username": "player123",
    "avatar": "https://..."
  }
}
```

### 3. Foydalanuvchi ulashgan skinlari
```http
GET /api/sharing/my-shares?page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "shares": [
    {
      "shareId": "abc123xyz0",
      "shareUrl": "http://localhost:3000/marketplace/shared/abc123xyz0",
      "title": "My awesome AK-47 Redline",
      "description": "Check out this amazing skin!",
      "viewCount": 15,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "skin": {
        "id": "uuid",
        "name": "AK-47 | Redline",
        "imageUrl": "https://...",
        "price": 125.75
      }
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 4. Ulashish ma'lumotlarini yangilash
```http
PUT /api/sharing/:shareId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}

Response (200):
{
  "message": "Share updated successfully",
  "share": {
    "shareId": "abc123xyz0",
    "shareUrl": "http://localhost:3000/marketplace/shared/abc123xyz0",
    "title": "Updated title",
    "description": "Updated description",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### 5. Ulashishni o'chirish
```http
DELETE /api/sharing/:shareId
Authorization: Bearer <token>

Response (204):
{
  "message": "Share deleted successfully"
}
```

### 6. Ulashish statistikasi
```http
GET /api/sharing/stats
Authorization: Bearer <token>

Response (200):
{
  "totalShares": 10,
  "totalViews": 150,
  "mostViewedShare": {
    "shareId": "abc123xyz0",
    "shareUrl": "http://localhost:3000/marketplace/shared/abc123xyz0",
    "title": "My awesome AK-47 Redline",
    "viewCount": 45,
    "skinName": "AK-47 | Redline"
  }
}
```

### 7. Tez link yaratish
```http
POST /api/sharing/generate-url
Authorization: Bearer <token>
Content-Type: application/json

{
  "skinId": "uuid"
}

Response (201):
{
  "shareUrl": "http://localhost:3000/marketplace/shared/abc123xyz0",
  "shareId": "abc123xyz0"
}
```

## 🔥 Favorites API Tafsilotlari

### 1. Sevimlilar ro'yxatiga qo'shish
```http
POST /api/favorites/:skinId
Authorization: Bearer <token>

Response (201):
{
  "message": "Skin added to favorites successfully",
  "favorite": {
    "id": "uuid",
    "skinId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}

Error (409):
{
  "message": "Skin is already in favorites"
}

Error (404):
{
  "message": "Skin not found"
}
```

### 2. Sevimlilardan o'chirish
```http
DELETE /api/favorites/:skinId
Authorization: Bearer <token>

Response (204):
{
  "message": "Skin removed from favorites successfully"
}

Error (404):
{
  "message": "Favorite not found"
}
```

### 3. Sevimlilar ro'yxatini olish
```http
GET /api/favorites?page=1&limit=20
Authorization: Bearer <token>

Response (200):
{
  "favorites": [
    {
      "id": "uuid",
      "name": "AK-47 | Redline",
      "weaponType": "rifle",
      "rarity": "classified",
      "exterior": "Field-Tested",
      "price": 125.75,
      "imageUrl": "https://...",
      "marketHashName": "AK-47 | Redline (Field-Tested)"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### 4. Skin sevimli ekanligini tekshirish
```http
GET /api/favorites/check/:skinId
Authorization: Bearer <token>

Response (200):
{
  "skinId": "uuid",
  "isFavorite": true
}
```

### 5. Sevimli skinlar ID larini olish
```http
GET /api/favorites/ids
Authorization: Bearer <token>

Response (200):
{
  "favoriteIds": ["uuid1", "uuid2", "uuid3"]
}
```

### 6. Sevimlilar sonini olish
```http
GET /api/favorites/count
Authorization: Bearer <token>

Response (200):
{
  "count": 15
}
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

### 5. Add to Favorites
```bash
curl -X POST http://localhost:4000/api/favorites/SKIN_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Get Favorites
```bash
curl http://localhost:4000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Create Share
```bash
curl -X POST http://localhost:4000/api/sharing \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skinId": "SKIN_ID",
    "title": "My awesome skin",
    "description": "Check this out!"
  }'
```

### 8. Get Shared Item
```bash
curl http://localhost:4000/api/sharing/shared/SHARE_ID
```

### 9. Get My Shares
```bash
curl http://localhost:4000/api/sharing/my-shares \
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
- Favorites system user-skin unique constraint bilan himoyalangan
- Favorites pagination qo'llab-quvvatlanadi
- Sharing system DMarket kabi short URL generation ishlatadi
- Sharing links view count va analytics bilan ta'minlangan
- Shared items soft delete (isActive flag) ishlatadi
- Share URLs format: `/marketplace/shared/{shareId}`
