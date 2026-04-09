# Deployment Guide

## Environment variables

### Frontend

- `VITE_API_BASE_URL`

### Backend

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URLS`

## Frontend on Vercel or Netlify

1. Import the root project.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_BASE_URL` to your deployed backend URL plus `/api`

## Backend on Render or Railway

1. Deploy the `backend` folder as a Node service.
2. Start command: `npm start`
3. Set `MONGODB_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URLS`
4. Set `CLIENT_URLS` to a comma-separated list of allowed frontend origins

## MongoDB Atlas

1. Create a cluster and database user.
2. Add your backend host IPs or temporarily allow all IPs during initial setup.
3. Copy the Atlas connection string into `MONGODB_URI`.
4. Run `node seed.js` inside `backend` if you want the demo admin and sample products.
