# ScrapSaver MERN Platform

ScrapSaver is a MERN-based web platform for donating e-waste, requesting pickups, tracking environmental impact, and enabling recyclers to bid on collected materials via an auction system.

## Features

- Landing page with green/white theme and fluid cards animations
- JWT-based authentication (register/login) for donors and recyclers
- User dashboard with impact metrics (total kg, CO2 saved, resources conserved) and donation history
- Service request form for e-waste pickup with address, waste type, quantity, and preferred time
- Drop-off donation logging and scheduling overview
- Recycler auction system with real-time bid updates through Socket.IO
- Nearby e-waste centers listing (ready to be wired to a real maps SDK)
- About page describing mission and CSR initiatives

## Prerequisites

- Node.js 18+
- MongoDB instance (local or hosted)

Create a `.env` file in `server/` with at least:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/scrapsaver
JWT_SECRET=replace_me
PORT=5000
```

## Install

```powershell
cd "c:\Users\vikrant\Desktop\scrapsaver-miniproject"
npm install
cd server
npm install
cd ..\client
npm install
```

## Run

In two separate terminals:

```powershell
cd "c:\Users\vikrant\Desktop\scrapsaver-miniproject\server"
npm run dev
```

```powershell
cd "c:\Users\vikrant\Desktop\scrapsaver-miniproject\client"
npm run dev
```

The frontend is served at `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

## Notes

- Map page currently renders a list of centers from `/api/centers`; plug in a real map provider to visualize markers and directions.
- Seed `Center` and `Donation` data as needed for demos (e.g., via Mongo shell or a simple seed script).
