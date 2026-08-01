# ScrapSaver MERN Platform

ScrapSaver is a MERN-based web platform for donating e-waste, requesting pickups, tracking environmental impact, and enabling recyclers to bid on collected materials via an auction system.

## Features

- Landing page with green/white theme and fluid cards animations
- JWT-based authentication (register/login) for donors and recyclers
- User dashboard with impact metrics (total kg, CO2 saved, resources conserved) and donation history
- Service request form for e-waste pickup with address, waste type, quantity, and preferred time
- Drop-off donation logging and scheduling overview
- Recycler auction system with bid placement and live updates
- EPR Certificate PDF generation for completed donations
- Admin analytics dashboard for system statistics
- Ready for zero-config Vercel full-stack deployment

## Prerequisites

- Node.js 18+
- MongoDB instance (MongoDB Atlas for production, or local MongoDB for dev)

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Configure Environment Variables**:
   Create `server/.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/scrapsaver
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. **Start Development Servers**:
   In separate terminals:
   ```bash
   # Terminal 1: Backend
   npm run server

   # Terminal 2: Frontend
   npm run client
   ```
   Frontend runs at `http://localhost:5173`.

---

## 🚀 How to Deploy on Vercel

This repository is pre-configured for full-stack deployment on **Vercel** with zero extra build steps.

### Step 1: Set up MongoDB Atlas (Database)
Since Vercel serverless functions cannot connect to `localhost`, you need a cloud-hosted MongoDB database:
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 Cluster and database user.
3. In Network Access, allow access from anywhere (`0.0.0.0/0`).
4. Copy your MongoDB Connection String (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/scrapsaver?retryWrites=true&w=majority`).

### Step 2: Push Your Code to GitHub / GitLab / Bitbucket
Ensure your repository is pushed to your Git provider.

### Step 3: Import Project into Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." -> "Project"**.
2. Select your `scrapsaver-miniproject` repository.
3. **Framework Preset**: Vercel will automatically detect `Vite` or select **Vite** / **Other**.
4. **Root Directory**: Leave as `./` (the root of the repo).
5. Expand **Environment Variables** and add:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure secret string for JWT signing
6. Click **Deploy**.

Vercel will automatically run `npm run build`, output the static React frontend from `client/dist`, and mount the Express serverless function at `/api/index.js`.
