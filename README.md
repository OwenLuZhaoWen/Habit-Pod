# HabitPod Dashboard

HabitPod Dashboard is a full-stack web application designed to manage HabitPod hardware cores, track personal health data, and utilize AI for real-time nutritional scanning. The project is tailored to run on the **Cloudflare Ecosystem** (Pages + Functions + D1 Database) for ultra-fast, serverless edge performance.

## ✨ Key Features

- **User Authentication**: Secure JWT-based registration and login system. Each user has a private repository of scanned items and health metrics.
- **Hardware Dashboard**: Monitor active HabitPod devices in real-time, including battery levels, WiFi connectivity, and system alerts.
- **AI-Powered Nutrition Scanner**: Integrates with the **Google Gemini API** to analyze uploaded food images or camera captures, automatically parsing out item names, calories, and a calculated health score.
- **Edge Architecture**: 
  - API routes are built using **Hono.js** and run beautifully on Cloudflare Pages Functions.
  - Relational data is stored in **Cloudflare D1** (Serverless SQLite).
- **Responsive UI**: A highly polished, modern interface built with React, Tailwind CSS, and Lucide Icons.

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, TypeScript, React Router, Tailwind CSS, Lucide React
- **Backend (Serverless):** Hono.js (Cloudflare Pages Functions)
- **Database:** Cloudflare D1 (SQLite Edge Database)
- **AI & ML:** Google Gemini API (`@google/genai`)
- **Authentication:** Custom JWT (JSON Web Tokens) Implementation

## 📂 Project Structure

- `/src/pages` - Main React views (Dashboard, Login, Register, HealthStats, etc.)
- `/src/components` - Reusable UI components (e.g., `AIScanner`, `Sidebar`)
- `/src/lib` - Utility functions and contexts (Auth Provider context)
- `/functions/api` - Cloudflare Pages Functions entry point handling backend requests.
- `/server` - Backend configuration, logic, and Hono.js API routes (`/server/index.ts`).
- `schema.sql` - Cloudflare D1 database schema definitions (Users, Scanned Items).
- `wrangler.json` - Cloudflare configuration file linking the D1 Database binding (`DB`).

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Rename `.env.example` to `.env` (or create one) and configure your variables:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the development server:**
   The project uses Vite with the `@hono/vite-dev-server` plugin to seamlessly emulate the Cloudflare Workers backend.
   ```bash
   npm run dev
   ```

## ☁️ Cloudflare Deployment

This project handles automatic deployments via **Cloudflare Pages** linked to GitHub. 

**Database Setup (Cloudflare D1):**
1. Create a D1 database via the Cloudflare dashboard or Wrangler CLI.
2. Link your `database_id` inside `wrangler.json`:
   ```json
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "habitpod",
       "database_id": "your-d1-database-id"
     }
   ]
   ```
3. Initialize the production database by running your migrations/schema on your D1 database.
   ```bash
   npm run db:migrate
   ```

**GitHub CI/CD:**
Once connected to Cloudflare Pages, simply push to the main branch. Cloudflare will automatically execute the `npm run build` command and deploy the updated static output `/dist` folder alongside the Serverless API routes.
