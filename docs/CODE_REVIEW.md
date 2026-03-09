# CaseX Code Review

> Sana: 2026-03-09 | Tekshirilgan: marketplace, cart, inventory, favorites, sharing, auth, users, profile, i18n, theme

---

## CRITICAL (darhol tuzatish kerak)

### Backend

| # | Modul | Muammo | Fayl |
|---|-------|--------|------|
| 1 | Cart | **Unique constraint yo'q** — (userId, skinId) juftligiga DB darajasida cheklov yo'q, concurrent so'rovlar duplicate yaratadi | cart/entities/cart.entity.ts |
| 2 | Cart | **Race condition** — addToCart() da check-then-act atomik emas, 2 parallel so'rov bir vaqtda duplicate qo'shishi mumkin | cart/cart.service.ts:39-45 |
| 3 | Inventory | **N+1 query** — har bir Steam item uchun alohida HTTP so'rov (50 item = 50 API call), timeout xavfi | inventory/inventory.service.ts:37-59 |
| 4 | Skins | **Hardcoded max narx** — `Between(minPrice, 999999)` — 999999 dan qimmat skin topilmaydi | skins/skins.service.ts:57 |
| 5 | Auth | **OTP kodi `Math.random()`** — kriptografik xavfsiz emas, `crypto.randomInt()` kerak | auth/auth.service.ts:23-25 |
| 6 | Auth | **Expired tokenlar tozalanmaydi** — `cleanupExpiredTokens()` hech qachon chaqirilmaydi, DB to'lib ketishi mumkin | auth/auth.service.ts:400 |

### Frontend

| # | Modul | Muammo | Fayl |
|---|-------|--------|------|
| 7 | Profile | **Hardcoded developer email** — `diyorbekolimov2000@gmail.com` fallback sifatida ko'rinadi | profile/settings/page.tsx:14 |
| 8 | Checkout | **To'lov butunlay mock** — haqiqiy API chaqiruv yo'q, `setTimeout` bilan simulyatsiya, cart tozalanadi | checkout/page.tsx:34-52 |
| 9 | Security | **XSS xavfi** — `innerHTML` ishlatilgan (3 joyda), React component o'rniga | SkinDetailsModal:251, inventory:281, cart:151 |
| 10 | Inventory | **Store butunlay commented out** — inventoryStore.ts to'liq izohga olingan | store/inventoryStore.ts |

---

## HIGH (tez orada tuzatish kerak)

### Backend

| # | Modul | Muammo | Fayl |
|---|-------|--------|------|
| 11 | Skins | **Limit chegarasi yo'q** — `limit=999999` butun DB ni yuklab oladi | skins/skins.controller.ts:10-16 |
| 12 | Skins | **Page/limit validatsiya yo'q** — manfiy yoki 0 qiymat xato natija beradi | skins/skins.controller.ts |
| 13 | Cart | **Narx eskirishi** — cartdagi skin narxi o'zgarishi mumkin, lekin eski narx ko'rsatiladi | cart/cart.service.ts:21-23 |
| 14 | Cart | **Cascade delete yo'q** — user/skin o'chirilsa, yetim cart recordlar qoladi | cart/entities/cart.entity.ts |
| 15 | Inventory | **Listing narx validatsiyasi yo'q** — manfiy yoki $0 narxga qo'yish mumkin | inventory/inventory.controller.ts:19 |
| 16 | Inventory | **isListed race condition** — bir vaqtda list/unlist so'rovi bir-birini ustiga yozishi mumkin | inventory/inventory.service.ts:87-90 |
| 17 | Barcha | **DTO yo'q** — hech bir modulda input/output DTO mavjud emas, validatsiya ishlamaydi | skins/, cart/, inventory/ |
| 18 | Barcha | **Transaction yo'q** — moliyaviy operatsiyalar (list/unlist, cart) DB transaction ichida emas | Barcha service-lar |
| 19 | Favorites | **Route tartib xatosi** — `@Get()` `@Get('check/:skinId')` dan oldin, NestJS noto'g'ri route match qiladi | favorites/favorites.controller.ts |
| 20 | Favorites | **N+1 query** — `getFavoriteIds()` to'liq skin yuklaydi, faqat ID kerak | favorites/favorites.service.ts:80-87 |
| 21 | Auth | **JWT payload kamchiligi** — `role` va `username` JWT da yo'q, har safar DB dan o'qish kerak | auth/auth.service.ts:356-378 |
| 22 | Sharing | **userId column nomi xatosi** — QueryBuilder da `share.userId` noto'g'ri ishlashi mumkin | sharing/sharing.service.ts:228-232 |

### Frontend

| # | Modul | Muammo | Fayl |
|---|-------|--------|------|
| 23 | Marketplace | **Filter har safar reset** — sahifa ochilganda `resetFilters()` chaqiriladi, foydalanuvchi filtrlari yo'qoladi | marketplace/page.tsx:59-61 |
| 24 | Marketplace | **Xato holati ko'rsatilmaydi** — API xatosi faqat `console.error`, UI da xabar yo'q | marketplace/page.tsx:115-119 |
| 25 | Cart | **Xato jimgina yutiladi** — `removeFromCart` va `clearCart` xatolarni foydalanuvchiga ko'rsatmaydi | store/cartStore.ts:66-91 |
| 26 | Inventory | **Sell tugmasi ishlamaydi** — `handleSell = () => console.log(...)` | inventory/page.tsx:179 |
| 27 | Auth | **Token validatsiyasiz saqlanadi** — callback da token oldindan localStorage ga yoziladi | auth/callback/page.tsx:28 |
| 28 | Profile | **Sozlamalar saqlanmaydi** — settings sahifasida API chaqiruv yo'q | profile/settings/page.tsx |
| 29 | Profile | **Tarix sahifasi mock data** — haqiqiy ma'lumot yuklanmaydi, filter tugmalari ishlamaydi | profile/history/page.tsx |

---

## MEDIUM (rejalashtirilgan tartibda tuzatish)

### Backend

| # | Modul | Muammo |
|---|-------|--------|
| 30 | Barcha | **Index yo'q** — tez-tez filtrlangan ustunlarda (isAvailable, rarity, weaponType, email, steamId) index qo'yilmagan |
| 31 | Skins | **sortBy validatsiyasi yo'q** — dinamik kalit (`[sortBy]`) runtime da tekshirilmaydi |
| 32 | Skin entity | **sellerId FK yo'q** — User jadvaliga foreign key bog'lanmagan |
| 33 | Skin entity | **float diapazoni** — decimal(6,4) max 99.9999, lekin float 0-1 oralig'ida bo'lishi kerak |
| 34 | Inventory entity | **Unique constraint yo'q** — bir foydalanuvchi bir skinni ikki marta olishi mumkin |
| 35 | Inventory entity | **updatedAt yo'q** — list/unlist vaqtini kuzatib bo'lmaydi |
| 36 | Sharing | **Pagination limit yo'q** — `limit=999999` yuborib, barcha ma'lumotni olish mumkin |
| 37 | Auth | **Error logging yo'q** — OAuth callback xatolari log qilinmaydi |
| 38 | Barcha | **Data exposure** — entity to'liq qaytariladi (sellerId, steamPrice kabi ichki ma'lumotlar ham) |

### Frontend

| # | Modul | Muammo |
|---|-------|--------|
| 39 | i18n | **Inconsistent** — ba'zi sahifalar `useTranslations()`, ba'zilari hardcoded `T` object ishlatadi |
| 40 | i18n | **Language management duplicate** — LanguageContext va settingsStore ikkalasi ham til boshqaradi |
| 41 | Theme | **Ikki joyda init** — layout.tsx inline script + ClientLayout.tsx, flash mumkin |
| 42 | Theme | **ThemeToggle settingsStore ishlatmaydi** — to'g'ridan-to'g'ri localStorage bilan ishlaydi |
| 43 | Auth | **Parol validatsiyasi nomuvofiq** — register: 8 belgi, change-password: 6 belgi |
| 44 | Auth | **CSRF himoyasi yo'q** — OAuth callback da state parametr tekshirilmaydi |
| 45 | API | **401 xatosida `alert()` ishlatiladi** — blokirovka qiladi, tarjima qilinmagan inglizcha xabar |
| 46 | API | **Response formati nomuvofiq** — frontendda har xil format uchun defensive kod yozilgan |
| 47 | Checkout | **Hardcoded 5% soliq** — backend dan kelishi kerak |
| 48 | Favorites | **Duplikat filtrlash** — useEffect da ham, render da ham filter qilinadi |
| 49 | Favorites | **Skin details modal yo'q** — TODO comment, marketplace dagisi ishlatilmagan |

---

## LOW (vaqt topilganda)

| # | Muammo |
|---|--------|
| 50 | A11y: ko'p tugmalar `aria-label` siz |
| 51 | A11y: modalda focus management yo'q |
| 52 | Auth: email validatsiyasi juda oddiy (`includes('@')`) |
| 53 | Auth: telefon validatsiyasi juda keng (O'zbekiston formati tekshirilmaydi) |
| 54 | Cart: fetchCart() har bir o'zgarishdan keyin to'liq qayta yuklaydi (optimistic update yo'q) |
| 55 | Navbar: deposit tugmasi `console.log` |
| 56 | ProfileSidebar: 2FA tugmasi ishlamaydi |
| 57 | Magic strings: `"admin"`, `"uz"`, `"ru"` konstantalarga chiqarilmagan |
| 58 | Password field `select: false` — implitsit, DTO bilan mustahkamlash kerak |

---

## Tuzatish rejasi (tavsiya etilgan tartib)

### 1-bosqich: Critical xavfsizlik va bug fixlar
```
- Cart unique constraint + race condition fix (DB migration)
- Hardcoded email olib tashlash (frontend)
- innerHTML → React component (3 joyda)
- OTP kodi crypto.randomInt() ga o'zgartirish
- Skins limit chegaralash (max 100)
- Skins narx filtrida MoreThan/LessThan ishlatish
```

### 2-bosqich: Validatsiya va DTO
```
- Barcha controller larga DTO qo'shish (class-validator)
- Input validatsiya: UUID, narx diapazoni, pagination limit
- Response DTO: sensitive field larni yashirish
- Favorites route tartibini tuzatish
```

### 3-bosqich: Ma'lumotlar yaxlitligi
```
- DB indekslar qo'shish (isAvailable, rarity, weaponType, email, steamId)
- Foreign key constraintlar (sellerId → User, cascade delete)
- Inventory unique constraint
- updatedAt qo'shish
- DB transaction lar (list/unlist, moliyaviy operatsiyalar)
```

### 4-bosqich: Frontend sifat
```
- API xato handling yaxshilash (alert → toast notification)
- Marketplace filter reset muammosini tuzatish
- i18n birxillashtirish (barcha sahifalar messages/*.json)
- Theme va Language management birlashtirish
- Parol validatsiyasini birxillashtirish (8 belgi)
- inventoryStore ni qayta yoqish
```

### 5-bosqich: Performance va cleanup
```
- N+1 querylarni tuzatish (favorites, inventory)
- Expired token cleanup cron job
- JWT payload ga role/username qo'shish
- API response formatini standartlashtirish
```
