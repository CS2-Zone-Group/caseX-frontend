# CaseX - Email Verification & Enhanced Login

## ✅ Qo'shilgan Funksiyalar

### 1. Login with Username or Email
- ✅ Email bilan kirish
- ✅ Username bilan kirish
- ✅ Avtomatik aniqlash (@ belgisi bo'yicha)
- ✅ Backend validation
- ✅ Frontend UI yangilandi

### 2. Email Verification System
- ✅ Ro'yxatdan o'tganda verification token yaratiladi
- ✅ Email verification page
- ✅ Token validation
- ✅ Auto-login after verification
- ✅ Success/Error messages
- ✅ Resend verification endpoint

### 3. Database Schema Updates
```sql
users table:
├── emailVerified (boolean, default: false)
├── verificationToken (string, nullable)
```

## 📊 API Endpoints

### Authentication

#### Register (with email verification)
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Ro'yxatdan o'tdingiz! Email manzilingizga tasdiqlash havolasi yuborildi.",
  "user": {
    "id": "uuid",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Login (with username or email)
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "testuser",  // yoki "test@example.com"
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "testuser",
    "email": "test@example.com",
    "balance": 0
  }
}
```

#### Verify Email
```http
GET /api/auth/verify-email/:token
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": { ... }
}
```

#### Resend Verification
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "test@example.com"
}
```

Response:
```json
{
  "message": "Tasdiqlash havolasi qayta yuborildi"
}
```

## 🔄 User Flow

### Registration Flow
```
1. User -> /auth/register
2. Fill form (username, email, password)
3. Submit
4. Backend creates user with emailVerified: false
5. Backend generates verification token
6. Success message shown
7. Email sent (TODO: implement email service)
8. User clicks verification link in email
9. Redirected to /auth/verify-email/:token
10. Token validated
11. emailVerified set to true
12. Auto-login
13. Redirect to /marketplace
```

### Login Flow
```
1. User -> /auth/login
2. Enter username OR email
3. Enter password
4. Backend checks if @ exists:
   - Yes: findByEmail()
   - No: findByUsername()
5. Password validation
6. JWT token generated
7. Redirect to /marketplace
```

## 🎨 Frontend Pages

### Login Page
- Input: "Email yoki Username"
- Accepts both formats
- Auto-detects input type

### Register Page
- Shows success message after registration
- Instructs user to check email
- Link to login page

### Email Verification Page
- `/auth/verify-email/:token`
- Loading state
- Success state (auto-redirect)
- Error state (with retry link)

## 🔧 Backend Implementation

### Auth Service
```typescript
async validateUser(identifier: string, password: string) {
  const isEmail = identifier.includes('@');
  const user = isEmail 
    ? await this.usersService.findByEmail(identifier)
    : await this.usersService.findByUsername(identifier);
  
  // Password validation
  // Return user
}

async register(username, email, password) {
  // Create user
  // Generate verification token
  // TODO: Send email
  // Return success message
}

async verifyEmail(token: string) {
  // Find user by token
  // Set emailVerified = true
  // Clear token
  // Auto-login
}
```

### User Entity
```typescript
@Entity('users')
export class User {
  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;
}
```

## 📧 Email Service (TODO)

### Integration Options
1. **Nodemailer** - SMTP
2. **SendGrid** - API
3. **AWS SES** - Amazon
4. **Mailgun** - API
5. **Resend** - Modern API

### Email Template
```html
Subject: CaseX - Email Tasdiqla

Assalomu alaykum!

CaseX platformasiga xush kelibsiz!

Email manzilingizni tasdiqlash uchun quyidagi havolani bosing:

http://localhost:3000/auth/verify-email/TOKEN_HERE

Agar siz ro'yxatdan o'tmagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.

CaseX jamoasi
```

### Implementation Example
```typescript
import * as nodemailer from 'nodemailer';

async sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: 'noreply@casex.uz',
    to: email,
    subject: 'CaseX - Email Tasdiqla',
    html: `
      <h1>Email Tasdiqla</h1>
      <p>Quyidagi havolani bosing:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}
```

## 🧪 Test Qilish

### 1. Register with Email Verification
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

Expected: Success message, no token

### 2. Login with Username
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "test123"
  }'
```

### 3. Login with Email
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@casex.uz",
    "password": "test123"
  }'
```

### 4. Verify Email (Manual Test)
1. Get verification token from database
2. Visit: http://localhost:3000/auth/verify-email/TOKEN
3. Should auto-login and redirect

## 📝 Notes

- Email service hali implement qilinmagan (TODO)
- Verification token 30 ta random character
- Token database'da saqlanadi
- Email verified bo'lmagan userlar ham login qilishi mumkin
- Production'da email service qo'shish kerak
- Token expiration qo'shish kerak (24 soat)

## 🔄 Keyingi Qadamlar

- [ ] Email service integration (Nodemailer/SendGrid)
- [ ] Email templates (HTML)
- [ ] Token expiration (24 hours)
- [ ] Rate limiting (resend verification)
- [ ] Email change functionality
- [ ] Password reset via email
- [ ] Welcome email after verification
- [ ] Email preferences
