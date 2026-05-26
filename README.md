# 🐝 JobHive - Full Stack Job Board

A complete job board platform with Auth, CRUD, APIs, Dashboard, and Admin Panel.

## ⚡ Quick Start in VS Code

### 1. Prerequisites
Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **VS Code** → https://code.visualstudio.com

### 2. Open in VS Code
```bash
# 1. Extract the zip file
# 2. Open VS Code
# 3. File → Open Folder → select the "jobhive" folder
```

### 3. Install dependencies
Open the **Terminal** in VS Code (`Ctrl + `` ` ```) and run:
```bash
npm install
```
⏳ Wait ~2 minutes for all packages to install.

### 4. Start the app
```bash
npm start
```
✅ Browser opens automatically at **http://localhost:3000**

---

## 🗂️ Project Structure

```
jobhive/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/         # Button, Input, Modal, Badge, Spinner...
│   │   ├── jobs/           # JobCard component
│   │   └── layout/         # Navbar, Footer, Sidebar
│   ├── context/
│   │   └── AuthContext.jsx # User auth state management
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── JobsPage.jsx         # Job listings + filters
│   │   ├── JobDetailPage.jsx    # Job detail + apply modal
│   │   ├── AuthPages.jsx        # Login + Register
│   │   ├── SeekerDashboard.jsx  # Job seeker dashboard
│   │   ├── EmployerDashboard.jsx# Employer dashboard
│   │   ├── AdminDashboard.jsx   # Admin panel
│   │   └── PostJobPage.jsx      # Post a job (employer)
│   ├── utils/
│   │   ├── api.js          # Axios API calls (all endpoints)
│   │   └── helpers.js      # Utility functions
│   ├── styles/
│   │   └── globals.css     # CSS variables & base styles
│   ├── App.jsx             # Router + route guards
│   └── index.js            # React entry point
├── package.json
└── README.md
```

---

## 🔗 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/jobs` | Job Listings | Public |
| `/jobs/:id` | Job Detail | Public |
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |
| `/dashboard` | Seeker Dashboard | Seeker |
| `/employer/dashboard` | Employer Dashboard | Employer |
| `/employer/post-job` | Post a Job | Employer |
| `/admin/dashboard` | Admin Panel | Admin |

---

## 🧪 Demo Login (once backend is connected)

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | seeker@demo.com | demo123 |
| Employer | employer@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

> **Note:** The frontend currently uses mock data. Connect to the backend API by setting `REACT_APP_API_URL` in a `.env` file.

---

## 🔧 Connect to Backend

Create a `.env` file in the root of the project:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Then restart the dev server (`npm start`).

---

## 🚀 Build for Production

```bash
npm run build
```
Outputs to the `/build` folder — ready for Vercel, Netlify, or any static host.

### Deploy to Vercel (Free):
```bash
npm install -g vercel
vercel
```

---

## 🛠️ VS Code Extensions (Recommended)

Install these from the Extensions panel (`Ctrl+Shift+X`):
- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **Prettier** — Code formatter
- **ESLint** — Code linting
- **Auto Rename Tag** — HTML/JSX tag renaming
- **GitLens** — Git blame & history

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Charts | Recharts |
| Notifications | React Hot Toast |
| Fonts | Syne + DM Sans (Google Fonts) |
| Styling | CSS-in-JS (inline styles + CSS variables) |

---

## 🔜 Next Steps

1. **Backend** — Build Node.js + Express + MongoDB API
2. **Authentication** — JWT tokens + Google OAuth
3. **File Upload** — Resume upload with Multer + Cloudinary
4. **Email** — Nodemailer for notifications
5. **Deployment** — Frontend on Vercel, Backend on Railway

---

Made with ❤️ for JobHive
