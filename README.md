# StudentHub 🎓

> **Your All-in-One Student Productivity & Calculator Platform**

A production-ready full-stack web application built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **MongoDB Atlas**, and **NextAuth.js v5**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### Public SEO Pages (No Login Required)

| Page                  | Route                    | Description                                       |
| --------------------- | ------------------------ | ------------------------------------------------- |
| Attendance Calculator | `/attendance-calculator` | Calculate attendance % + classes to miss/attend    |
| GPA Calculator        | `/gpa-calculator`        | Multi-subject GPA with 4.0 scale                  |
| CGPA Calculator       | `/cgpa-calculator`       | Cumulative GPA across semesters                    |
| Percentage Calculator | `/percentage-calculator` | Marks to percentage conversion with letter grade   |

### Authenticated Dashboard

| Feature            | Route                   | Description                                  |
| ------------------ | ----------------------- | -------------------------------------------- |
| Overview           | `/dashboard`            | Stats summary: attendance, exams, tasks, etc |
| Attendance Tracker | `/dashboard/attendance` | Subject-wise attendance with full CRUD       |
| Study Planner      | `/dashboard/tasks`      | Tasks with priority, due dates, and filters  |
| Exam Countdown     | `/dashboard/exams`      | Countdown cards for upcoming exams           |
| Pomodoro Timer     | `/dashboard/focus`      | 25/5 focus timer with session tracking       |

### Blog System

- MDX-powered blog at `/blog` and `/blog/[slug]`
- Pre-written study-tip articles included

### Additional Highlights

- 🌙 **Dark mode** with `next-themes`
- 🔒 **Route protection** via NextAuth.js middleware
- 📱 **Fully responsive** mobile-first design
- 🔍 **SEO optimized** with dynamic metadata per page
- 💰 **AdSense ready** — toggle monetization with a single flag

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- A free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- (Optional) [Google Cloud Console](https://console.cloud.google.com) project for OAuth

### 1. Clone and Install

```bash
git clone https://github.com/sarjeetshekhawat/StudentHub.git
cd StudentHub
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your values — see the template for documentation on each variable.

### 3. Set Up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create a free cluster
2. Create a database user with read/write access
3. Get the connection string and paste into `MONGODB_URI` in `.env.local`
4. Add `0.0.0.0/0` to IP Access List (or your specific server IP)

### 4. Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → APIs & Services → Credentials
3. Create an **OAuth 2.0 Client ID** (Web Application)
4. Add to **Authorized Redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret into `.env.local`

### 5. Generate NextAuth Secret

```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Paste the output into `NEXTAUTH_SECRET` in `.env.local`.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
studenthub/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   └── register/route.ts         # User registration
│   │   ├── attendance/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   └── [id]/route.ts             # PUT, DELETE
│   │   ├── tasks/                        # CRUD for tasks
│   │   ├── exams/                        # CRUD for exams
│   │   └── pomodoro/                     # Session logging
│   ├── attendance-calculator/            # Public calculator page
│   ├── gpa-calculator/
│   ├── cgpa-calculator/
│   ├── percentage-calculator/
│   ├── blog/
│   │   ├── page.tsx                      # Blog listing
│   │   └── [slug]/page.tsx               # Individual post
│   ├── dashboard/
│   │   ├── layout.tsx                    # Sidebar layout
│   │   ├── page.tsx                      # Overview
│   │   ├── attendance/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── exams/page.tsx
│   │   └── focus/page.tsx                # Pomodoro timer
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── icon.png                          # Favicon (auto-served)
│   ├── apple-icon.png                    # Apple touch icon
│   ├── layout.tsx                        # Root layout
│   └── globals.css                       # Design tokens & utilities
├── components/
│   ├── ads/AdBanner.tsx                  # AdSense placeholder
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── DashboardSidebar.tsx
│   └── Providers.tsx                     # Theme + session providers
├── content/blog/                         # MDX blog articles
├── lib/
│   ├── auth.ts                           # NextAuth config & providers
│   ├── db.ts                             # MongoDB connection (cached)
│   ├── seo.ts                            # SEO metadata utilities
│   └── validations.ts                    # Zod schemas
├── models/
│   ├── User.ts
│   ├── Subject.ts
│   ├── Task.ts
│   ├── Exam.ts
│   └── PomodoroSession.ts
├── types/
│   └── next-auth.d.ts                    # NextAuth type augmentation
├── public/
│   └── logo.png                          # Brand logo
├── proxy.ts                              # NextAuth middleware (route protection)
├── .env.local.example                    # Environment variables template
├── next.config.ts                        # Next.js + MDX configuration
└── package.json
```

---

## 🛠️ Tech Stack

| Technology     | Version    | Purpose                |
| -------------- | ---------- | ---------------------- |
| Next.js        | 16         | Framework (App Router) |
| React          | 19         | UI library             |
| TypeScript     | 5          | Type safety            |
| Tailwind CSS   | 4          | Styling                |
| MongoDB Atlas  | –          | Database               |
| Mongoose       | 9          | ODM                    |
| NextAuth.js    | 5 (beta)   | Authentication         |
| Zod            | 4          | Validation             |
| next-mdx-remote| 6          | MDX blog rendering     |
| next-themes    | 0.4        | Dark mode toggle       |

---

## 🌐 Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Repository
3. Add all environment variables from `.env.local`
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g., `https://studenthub.vercel.app`)
5. Add your Vercel domain to Google OAuth authorized redirect URIs
6. Deploy!

---

## 💰 Adding Google AdSense

1. Apply at [adsense.google.com](https://adsense.google.com)
2. Once approved, add your credentials to `.env.local`:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT=XXXXXXXXXX
   ```
3. In `components/ads/AdBanner.tsx`, set `ADSENSE_ACTIVE = true`
4. Replace the placeholder with your actual `<ins>` tag

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📜 License

MIT License — free to use, modify, and deploy.
