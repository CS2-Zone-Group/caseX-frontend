# CaseX Frontend - Setup Guide

## Prerequisites

- Node.js 20+
- npm or yarn

## Installation

1. Clone repository:
```bash
git clone <your-frontend-repo-url>
cd caseX-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables allaqachon sozlangan `.env.local` faylida:
   - Backend API URL
   - Site URL

## Running

### Development
```bash
npm run dev
```

Open: http://localhost:3000

### Production
```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── marketplace/       # Marketplace page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── Header.tsx         # Header component
├── lib/                   # Utilities
│   └── api.ts            # Axios instance
└── store/                 # State management
    └── authStore.ts       # Auth state (Zustand)
```

## Features

- ✅ Steam OAuth login
- ✅ Marketplace with skins
- ✅ User profile
- ✅ O'zbek tili
- ✅ Responsive design (Tailwind CSS)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Axios
