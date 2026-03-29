# CaseX - Test Credentials

## Test User Account

**Email:** test@casex.uz  
**Password:** test123  
**Username:** testuser

## Login Qilish

### 1. Email/Password bilan:
```
http://localhost:3000/auth/login

Email: test@casex.uz
Password: test123
```

### 2. Steam OAuth bilan:
```
http://localhost:3000/auth/login
"Steam orqali kirish" tugmasini bosing
```

## API Test

### Register yangi user:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@casex.uz",
    "password": "test123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "testuser",
    "email": "test@casex.uz",
    "avatar": null,
    "balance": "0.00"
  }
}
```

## Tuzatilgan Muammolar

### ✅ Steam Login Issue
- JWT payload'ga `steamId` qo'shildi
- Steam user'lar uchun email nullable qilindi
- JWT strategy yangilandi

### ✅ Refresh Logout Issue
- Zustand persist `skipHydration: true` qo'shildi
- Layout'da `rehydrate()` qo'shildi
- SSR-safe localStorage handling

### ✅ Balance Display Error
- Type checking qo'shildi: `typeof user.balance === 'number'`
- User interface'da balance optional qilindi

## Keyingi Test Qadamlari

1. ✅ Register yangi user
2. ✅ Login qilish (email/password)
3. ✅ Steam login
4. ✅ Refresh qilganda session saqlanishi
5. [ ] Marketplace'da skinlar ko'rish
6. [ ] Cartga qo'shish
7. [ ] Inventory ko'rish
8. [ ] Skinni sotuvga qo'yish

## Notes

- Test user balance: 0.00 so'm
- Inventory bo'sh (skinlar yo'q)
- Database'da hali skinlar yo'q (seed qilish kerak)
