# GitHub Repository Setup

Har bir loyihani alohida GitHub repository'ga joylashtirish uchun quyidagi qadamlarni bajaring:

## 1. Backend Repository

```bash
cd caseX-backend

# Git init
git init
git add .
git commit -m "Initial commit: CaseX Backend with NestJS, TypeORM, Steam OAuth"

# GitHub'da yangi repo yarating: caseX-backend
# Keyin quyidagi buyruqlarni bajaring:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/caseX-backend.git
git push -u origin main
```

## 2. Frontend Repository

```bash
cd ../caseX-frontend

# Git init
git init
git add .
git commit -m "Initial commit: CaseX Frontend with Next.js, TypeScript, Tailwind"

# GitHub'da yangi repo yarating: caseX-frontend
# Keyin quyidagi buyruqlarni bajaring:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/caseX-frontend.git
git push -u origin main
```

## 3. Environment Variables (GitHub Secrets)

### Backend Secrets
GitHub repository Settings > Secrets and variables > Actions:

```
DATABASE_URL=postgresql://...
JWT_SECRET=casex-secret-key-2024-change-in-production
STEAM_API_KEY=D1F69A0550E0B0446A74FF3E41DB128C
```

### Frontend Secrets
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 4. Deployment

### Backend (Railway, Render, yoki Vercel)
1. GitHub repo'ni ulang
2. Environment variables qo'shing
3. Deploy qiling

### Frontend (Vercel)
1. GitHub repo'ni ulang
2. Environment variables qo'shing
3. Deploy qiling

## Repository Structure

```
GitHub:
├── YOUR_USERNAME/caseX-backend     (Backend repo)
├── YOUR_USERNAME/caseX-frontend    (Frontend repo)
└── YOUR_USERNAME/caseX-admin       (Keyinchalik)
```

## Important Notes

- `.env` va `.env.local` fayllar `.gitignore`da
- Har bir repo'da `.env.example` mavjud
- CI/CD GitHub Actions bilan sozlangan
- Production uchun environment variables'ni o'zgartiring
