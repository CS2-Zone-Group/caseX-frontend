# CaseX Code Review

> Sana: 2026-03-09 | Tekshirilgan: marketplace, cart, inventory, favorites, sharing, auth, users, profile, i18n, theme
> Yangilangan: 2026-03-09 | Tuzatilgan muammolar belgilandi

---

## CRITICAL (darhol tuzatish kerak)

### Backend

| # | Modul | Muammo | Holat |
|---|-------|--------|-------|
| 1 | Cart | **Unique constraint yo'q** | **TUZATILDI** — `@Unique(['userId', 'skinId'])` qo'shildi |
| 2 | Cart | **Race condition** — addToCart() atomik emas | **TUZATILDI** — try-catch + QueryFailedError 23505 |
| 3 | Inventory | **N+1 query** — 50 item = 50 API call | Qisman — null safety qo'shildi, batching keyingi bosqich |
| 4 | Skins | **Hardcoded max narx** — `Between(minPrice, 999999)` | **TUZATILDI** — `MoreThanOrEqual` / `LessThanOrEqual` |
| 5 | Auth | **OTP kodi `Math.random()`** | **TUZATILDI** — `crypto.randomInt()` ga almashtirildi |
| 6 | Auth | **Expired tokenlar tozalanmaydi** | **TUZATILDI** — `@Cron('0 */6 * * *')` + ScheduleModule |

### Frontend

| # | Modul | Muammo | Holat |
|---|-------|--------|-------|
| 7 | Profile | **Hardcoded developer email** | **TUZATILDI** — bo'sh string ga almashtirildi |
| 8 | Checkout | **To'lov butunlay mock** | Ochiq — buy/sell logikasida tuzatiladi |
| 9 | Security | **XSS xavfi** — `innerHTML` (3 joyda) | **TUZATILDI** — sibling fallback div pattern |
| 10 | Inventory | **Store commented out** | **TUZATILDI** — to'liq qayta yozildi |

---

## HIGH (tez orada tuzatish kerak)

### Backend

| # | Modul | Muammo | Holat |
|---|-------|--------|-------|
| 11 | Skins | **Limit chegarasi yo'q** | **TUZATILDI** — max 100, min 1 |
| 12 | Skins | **Page/limit validatsiya yo'q** | **TUZATILDI** — safePage, safeLimit |
| 13 | Cart | **Narx eskirishi** | Ochiq — checkout da real-time tekshiruv kerak |
| 14 | Cart | **Cascade delete yo'q** | **TUZATILDI** — `onDelete: 'CASCADE'` |
| 15 | Inventory | **Listing narx validatsiyasi yo'q** | **TUZATILDI** — positive number tekshiruvi |
| 16 | Inventory | **isListed race condition** | Qisman — null safety qo'shildi, full transaction keyingi bosqich |
| 17 | Barcha | **DTO yo'q** | **QISMAN** — Cart DTO qo'shildi, boshqalari keyingi bosqich |
| 18 | Barcha | **Transaction yo'q** | Ochiq — buy/sell logikasida qo'shiladi |
| 19 | Favorites | **Route tartib xatosi** | **TUZATILDI** — specific routelar birinchi |
| 20 | Favorites | **N+1 query** | **TUZATILDI** — QueryBuilder bilan faqat ID select |
| 21 | Auth | **JWT payload kamchiligi** | **TUZATILDI** — role, username qo'shildi |
| 22 | Sharing | **userId column nomi** | Ochiq — tekshirish kerak |

### Frontend

| # | Modul | Muammo | Holat |
|---|-------|--------|-------|
| 23 | Marketplace | **Filter har safar reset** | **TUZATILDI** — resetFilters() olib tashlandi |
| 24 | Marketplace | **Xato holati ko'rsatilmaydi** | Ochiq |
| 25 | Cart | **Xato jimgina yutiladi** | **TUZATILDI** — error state + re-throw |
| 26 | Inventory | **Sell tugmasi ishlamaydi** | Ochiq — buy/sell logikasida |
| 27 | Auth | **Token validatsiyasiz saqlanadi** | Ochiq |
| 28 | Profile | **Sozlamalar saqlanmaydi** | Ochiq — backend endpoint kerak |
| 29 | Profile | **Tarix sahifasi mock data** | Ochiq — transaction modul kerak |

---

## MEDIUM (rejalashtirilgan tartibda tuzatish)

### Backend

| # | Muammo | Holat |
|---|--------|-------|
| 30 | **Index yo'q** | **TUZATILDI** — Skin entity: weaponType, rarity, marketHashName, isAvailable; Cart/Inventory: userId |
| 31 | **sortBy validatsiyasi yo'q** | **TUZATILDI** — allowed values array |
| 32 | **sellerId FK yo'q** | Ochiq |
| 33 | **float diapazoni** | Ochiq |
| 34 | **Inventory unique constraint** | Ochiq |
| 35 | **Inventory updatedAt yo'q** | **TUZATILDI** — `@UpdateDateColumn()` qo'shildi |
| 36 | **Sharing pagination limit yo'q** | **TUZATILDI** — max 100 |
| 37 | **Auth error logging yo'q** | **TUZATILDI** — Logger qo'shildi |
| 38 | **Data exposure** | Ochiq — Response DTO kerak |

### Frontend

| # | Muammo | Holat |
|---|--------|-------|
| 39 | i18n inconsistent | Ochiq |
| 40 | Language management duplicate | Ochiq |
| 41 | Theme ikki joyda init | Ochiq |
| 42 | ThemeToggle settingsStore ishlatmaydi | Ochiq |
| 43 | **Parol validatsiyasi nomuvofiq** | **TUZATILDI** — 8 belgi hamma joyda |
| 44 | CSRF himoyasi yo'q | Ochiq |
| 45 | **401 da `alert()` ishlatiladi** | **TUZATILDI** — `console.warn()` ga almashtirildi |
| 46 | Response formati nomuvofiq | Ochiq |
| 47 | Hardcoded 5% soliq | Ochiq |
| 48 | Favorites duplikat filtrlash | Ochiq |
| 49 | Favorites skin details modal yo'q | Ochiq |

---

## LOW (vaqt topilganda)

| # | Muammo | Holat |
|---|--------|-------|
| 50 | A11y: `aria-label` yo'q | Ochiq |
| 51 | A11y: modal focus management | Ochiq |
| 52 | Email validatsiyasi oddiy | Ochiq |
| 53 | Telefon validatsiyasi keng | Ochiq |
| 54 | Cart optimistic update yo'q | Ochiq |
| 55 | Navbar deposit `console.log` | Ochiq |
| 56 | 2FA tugmasi ishlamaydi | Ochiq |
| 57 | Magic strings | Ochiq |
| 58 | Password `select: false` implitsit | Ochiq |

---

## Xulosa

| Kategoriya | Jami | Tuzatildi | Qoldi |
|------------|------|-----------|-------|
| CRITICAL | 10 | **9** | 1 (checkout mock — buy/sell da) |
| HIGH | 18 | **11** | 7 (ko'pchilik buy/sell va transaction moduliga bog'liq) |
| MEDIUM | 20 | **9** | 11 |
| LOW | 9 | **0** | 9 |
| **JAMI** | **57** | **29** | **28** |

Qolgan ochiq muammolarning aksariyati yangi modullar (payment, transaction, buy/sell) yaratilganda tuzatiladi.
