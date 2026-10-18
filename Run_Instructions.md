# Team Task Tracker - Run Instructions

## 🌐 Active Live URL (Firebase Hosting)
- **Primary Live URL**: https://task-teamtracker.web.app
- **Alternate Live URL**: https://task-teamtracker.firebaseapp.com
- **Firebase Project ID**: `task-teamtracker`

---

## Project Overview
**Team Task Tracker** is a high-performance, collaborative team task and project management web application built with **React 19**, **Vite**, **Lucide Icons**, and responsive CSS. It includes live kanban task states, sprint tracking, activity feeds, task filters, and metrics visualization.

---

## Prerequisites
- **Node.js**: v18+ (tested on Node v26.x)
- **npm**: v9+

---

## Local Run Instructions

### Method 1: Development Mode (with Hot Module Replacement)
1. Open your terminal and navigate to the project directory:
   ```bash
   cd /home/purushothaman/Videos/Projects/team-task-tracker
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the displayed URL (typically `http://localhost:5173`).

---

### Method 2: Production Build & Preview
1. Build the production assets:
   ```bash
   npm run build
   ```
2. Preview the built application locally:
   ```bash
   npm run preview
   ```
3. Open the URL shown in your terminal (typically `http://localhost:4173`).

---

### Method 3: Static Serving with Python
Once built (`npm run build`), you can serve the `dist/` folder directly:
```bash
python3 -m http.server 3000 --directory dist
```
Navigate to `http://localhost:3000`.

---

### Method 4: Firebase Hosting Deployment
```bash
npm run build
firebase deploy
```
