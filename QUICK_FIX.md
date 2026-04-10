# 🚀 QUICK FIX - Authentication Not Working

## The Problem

Your `backend/.env` file likely has one of these issues:
1. ❌ **MongoDB URI is a placeholder** (not connected to real database)
2. ❌ **MongoDB is not running** (if using local)
3. ❌ **JWT_SECRET is placeholder** (though this usually doesn't cause login issues)

## 3-Step Fix

### Step 1: Update Backend Configuration

Edit file: **`backend/.env`**

Replace the entire content with ONE of these options:

**OPTION A: Local MongoDB** (Easiest if you have MongoDB installed)
```env
JWT_SECRET=demo-secret-key
PORT=5000
MONGODB_URI=mongodb://localhost:27017/renuka-enterprises
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

**OPTION B: MongoDB Atlas** (Free cloud database - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a cluster
4. In "Database Access" → Add user with username/password
5. In "Network Access" → Add IP 0.0.0.0/0
6. Click "Connect" → Choose "Drivers"
7. Copy connection string
8. Update `backend/.env`:
```env
JWT_SECRET=demo-secret-key
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/renuka-enterprises?retryWrites=true&w=majority
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

### Step 2: Create Admin User

In the backend folder, run:
```bash
npm run seed
```

**You should see:**
```
✅ Default admin user created: admin@gmail.com / 123456
Seeding completed
```

### Step 3: Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**Terminal 3 (Test):**
Open browser and go to: `http://localhost:5173/login/admin`

---

## Test Credentials After Fix

**Admin Login:**
- Email: `admin@gmail.com`
- Password: `123456`

**Register New Customer:**
- Use any email (not admin@gmail.com)
- Any 10-digit phone
- Password 6+ characters

---

## If Still Not Working

Run this diagnostic command in backend folder:
```bash
node diagnosis.js
```

This will tell you exactly what's wrong.

---

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in backend |
| "MongoDB connection refused" | Use MongoDB Atlas OR start local MongoDB |
| "Invalid credentials" | Run `npm run seed` to create admin user |
| "CORS error" | Check `CLIENT_URLS` in backend/.env includes `http://localhost:5173` |
| "Network Error" | Backend not running - run `npm run dev` in terminal |

---

## Verify Setup is Correct

```powershell
# Test 1: Is backend running?
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing

# Test 2: Can you login?
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@gmail.com","password":"123456","expectedRole":"admin"}'
```

If Test 1 shows `{"status":"ok"}` ✅ and Test 2 shows a `token` ✅ then everything is working!

---

Let me know which option (A or B) you're using and if you need more help! 🎯
