# CaseX Backend API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response (201): Verification code sent to email
```json
{
  "message": "Verification code sent to email",
  "userId": "uuid"
}
```

### Verify Email Code
```http
POST /auth/verify-email-code
Content-Type: application/json

{
  "userId": "uuid",
  "code": "123456"
}
```

### Resend Verification Code
```http
POST /auth/resend-verification
Content-Type: application/json

{
  "userId": "uuid"
}
```
Note: 60 second cooldown between resends. Max 5 attempts.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "balance": 0
  }
}
```

### Steam OAuth
```http
GET /auth/steam
```
Redirects to Steam login page.

```http
GET /auth/steam/callback
```
Steam callback — redirects to `{FRONTEND_URL}/auth/callback?token={jwt}`.

### Google OAuth
```http
GET /auth/google
```
Redirects to Google login page.

```http
GET /auth/google/callback
```
Google callback — redirects to `{FRONTEND_URL}/auth/callback?token={jwt}`.

### Phone OTP (Telegram Gateway)
```http
POST /auth/phone/request-otp
Content-Type: application/json

{
  "phoneNumber": "+998901234567"
}
```

```http
POST /auth/phone/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+998901234567",
  "code": "123456"
}
```

```http
POST /auth/phone/set-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### JWT Payload
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "steamId": "76561199...",
  "username": "john_doe",
  "role": "user",
  "locale": "uz"
}
```
Token expiry: 7 days.

---

## Users (Protected)

### Get Profile
```http
GET /users/profile
Authorization: Bearer {token}
```

### Get Balance
```http
GET /users/balance
Authorization: Bearer {token}
```

### Change Password
```http
PUT /users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

## Skins

### Get All Skins (with filters)
```http
GET /skins?page=1&limit=20&search=ak47&rarity=covert&weaponType=Rifle&minPrice=100&maxPrice=5000&sortBy=price&sortOrder=ASC
```

Query Parameters:
| Param | Default | Validation | Description |
|-------|---------|------------|-------------|
| `page` | 1 | min: 1 | Sahifa raqami |
| `limit` | 20 | min: 1, max: 100 | Har sahifada nechta |
| `search` | — | string | Skin nomi bo'yicha qidirish |
| `rarity` | — | string | consumer, industrial, mil-spec, restricted, classified, covert |
| `weaponType` | — | string | Rifle, Pistol, Knife, Sniper Rifle, etc. |
| `minPrice` | — | number | Minimal narx |
| `maxPrice` | — | number | Maksimal narx |
| `sortBy` | price | price, name, createdAt | Saralash maydoni |
| `sortOrder` | ASC | ASC, DESC | Saralash tartibi |

Response:
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### Get Single Skin
```http
GET /skins/:id
```
`:id` — UUID format required.

---

## Inventory (Protected)

### Get My Inventory
```http
GET /inventory
Authorization: Bearer {token}
```
Returns merged DB + Steam inventory items.

### List Skin for Sale
```http
POST /inventory/:id/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 1500
}
```
`:id` — UUID. `price` — must be positive number.

### Unlist Skin
```http
PATCH /inventory/:id/unlist
Authorization: Bearer {token}
```
`:id` — UUID.

---

## Cart (Protected)

### Get Cart
```http
GET /cart
Authorization: Bearer {token}
```

Response:
```json
{
  "items": [...],
  "total": 5000,
  "itemCount": 3
}
```

### Add to Cart
```http
POST /cart
Authorization: Bearer {token}
Content-Type: application/json

{
  "skinId": "uuid"
}
```
`skinId` — UUID, required. Duplicate (userId, skinId) pair returns 400.

### Remove from Cart
```http
DELETE /cart/:id
Authorization: Bearer {token}
```
`:id` — UUID of cart item.

### Clear Cart
```http
DELETE /cart
Authorization: Bearer {token}
```

---

## Favorites (Protected)

### Add to Favorites
```http
POST /favorites/:skinId
Authorization: Bearer {token}
```

### Remove from Favorites
```http
DELETE /favorites/:skinId
Authorization: Bearer {token}
```

### Get Favorites (Paginated)
```http
GET /favorites?page=1&limit=20
Authorization: Bearer {token}
```
`limit` max: 100.

### Check if Favorite
```http
GET /favorites/check/:skinId
Authorization: Bearer {token}
```

### Get Favorite IDs
```http
GET /favorites/ids
Authorization: Bearer {token}
```

### Get Favorites Count
```http
GET /favorites/count
Authorization: Bearer {token}
```

---

## Sharing

### Create Share (Protected)
```http
POST /sharing
Authorization: Bearer {token}
Content-Type: application/json

{
  "skinId": "uuid",
  "title": "My skin",
  "description": "Check this out"
}
```

### Get Shared Item (Public)
```http
GET /sharing/shared/:shareId
```

### Get My Shares (Protected)
```http
GET /sharing/my-shares?page=1&limit=20
Authorization: Bearer {token}
```

### Update Share (Protected)
```http
PUT /sharing/:shareId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated desc"
}
```

### Delete Share (Protected)
```http
DELETE /sharing/:shareId
Authorization: Bearer {token}
```

### Get Share Statistics (Protected)
```http
GET /sharing/stats
Authorization: Bearer {token}
```

### Generate Share URL (Protected)
```http
POST /sharing/generate-url
Authorization: Bearer {token}
Content-Type: application/json

{
  "skinId": "uuid"
}
```

---

## Steam

### Get Skin Data
```http
GET /steam/skin/:marketHashName
```

### Batch Skin Data
```http
POST /steam/skins/batch
Content-Type: application/json

{
  "names": ["AK-47 | Redline (Field-Tested)", "..."]
}
```

### Get Steam Inventory
```http
GET /steam/inventory/:steamId
```

### Search Skins
```http
GET /steam/search?query=AK-47&start=0&count=10
```

### Get Popular Skins
```http
GET /steam/popular?count=50
```

### Clear Cache
```http
POST /steam/cache/clear
```

### Cache Stats
```http
GET /steam/cache/stats
```

---

## Health

### Full Health Check
```http
GET /health
```

### Simple Status
```http
GET /health/simple
```

---

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Validation Error (DTO)
```json
{
  "statusCode": 400,
  "message": ["skinId must be a UUID", "skinId should not be empty"],
  "error": "Bad Request"
}
```

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error, duplicate, etc.)
- 401: Unauthorized (missing/invalid token)
- 404: Not Found
- 500: Internal Server Error
