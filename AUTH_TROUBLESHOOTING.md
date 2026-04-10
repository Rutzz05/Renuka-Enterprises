# 🔧 Authentication Troubleshooting Guide

## ❌ Common Issues & Solutions

### **Issue 1: MongoDB URI Not Configured (MOST COMMON)**

**Problem**: Backend `.env` file has placeholder MongoDB URI
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/renuka-enterprises
```

**Solution A: Use Local MongoDB** (Easiest for testing)
```bash
# Step 1: Update backend/.env
MONGODB_URI=mongodb://localhost:27017/renuka-enterprises
JWT_SECRET=your-test-secret-key-12345
PORT=5000
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

**Solution B: Use MongoDB Atlas** (Cloud - Free tier)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Go to Database Access → Add User (username/password)
5. Go to Network Access → Add IP (0.0.0.0/0 for testing)
6. Get connection string (click Connect → Drivers)
7. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/renuka-enterprises?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5000
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

---

## ✅ Complete Setup Steps

### Step 1: Configure Backend Environment
Edit `backend/.env`:
```env
PORT=5000
JWT_SECRET=renuka-enterprises-secret-key-2024
MONGODB_URI=mongodb://localhost:27017/renuka-enterprises
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

### Step 2: Start Backend
```bash
cd backend
npm install   # If needed
npm run seed  # Creates admin user
npm run dev   # Starts server
```

**Expected Output**:
```
MongoDB connected
✅ Default admin user created: admin@gmail.com / 123456
✓ 4 products already seeded
Seeding completed
Server running on port 5000
```

### Step 3: Start Frontend
```bash
npm install   # If needed
npm run dev   # Starts frontend
```

**Expected Output**:
```
Local: http://localhost:5173
```

### Step 4: Test Authentication

**Test Admin Login**:
1. Open http://localhost:5173/login
2. Click "Admin Login"
3. Email: `admin@gmail.com`
4. Password: `123456`
5. Should redirect to `/admin`

**Test Customer Registration**:
1. Click "Register"
2. Fill in: Name, Email, Phone, Password (6+ chars)
3. Submit
4. Should redirect to `/dashboard`

---

## 🐛 Debugging Guide

### Check 1: Is Backend Running?
```bash
# In PowerShell
(Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing).Content

# Should return: {"status":"ok"}
```

### Check 2: Is MongoDB Connected?
Look at backend server output. Should see:
```
MongoDB connected
```

If you see error like:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Then MongoDB is not running locally. Either:
- Start MongoDB locally, OR
- Update MONGODB_URI to use Atlas

### Check 3: Is Frontend Getting API Responses?
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login/register
4. Check Network tab for:
   - `POST http://localhost:5000/api/auth/register`
   - `POST http://localhost:5000/api/auth/login`
5. Click on request → Response tab
6. Should see `token` and `user` in response

### Check 4: CORS Issues?
If you see error:
```
Access to XMLHttpRequest blocked by CORS
```

Make sure `CLIENT_URLS` in `backend/.env` includes your frontend URL:
```env
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

---

## 🔍 Backend Error Logs

### Error: "Invalid credentials" on login
- Admin user might not exist in database
- Run: `npm run seed` again in backend

### Error: "Name, email, phone, and password are required"
- Form fields not being sent properly
- Check browser DevTools → Network → Request Body

### Error: "An account with this email already exists"
- User already registered with that email
- Use different email for new registration

### Error: "Unable to register user" (500 error)
- See backend console for actual error
- Common causes:
  - Database connection failed
  - Validation error
  - Schema issue

---

## 📋 Quick Checklist

- [ ] Backend `.env` has valid `MONGODB_URI` (not placeholder)
- [ ] JWT_SECRET is set to something (any string)
- [ ] Backend server running on port 5000
- [ ] MongoDB is running (if using local)
- [ ] Frontend `.env` has `VITE_API_BASE_URL=http://localhost:5000/api`
- [ ] Frontend running on port 5173
- [ ] Can access `http://localhost:5000/api/health` → returns `{"status":"ok"}`
- [ ] Can see "MongoDB connected" in backend console
- [ ] Can see "✅ Default admin user created" in backend console
- [ ] Admin login works with `admin@gmail.com` / `123456`

---

## 🎯 If Still Not Working

**Option 1: Reset Everything**
```bash
# Terminal 1
cd backend
npm install
rm -r node_modules  # (delete node_modules folder manually on Windows)
npm install
# Update .env with valid MongoDB URI
npm run seed
npm run dev

# Terminal 2
npm install
rm -r node_modules
npm install
npm run dev
```

**Option 2: Test API Directly**
```powershell
# Test registration
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test","email":"test@example.com","phone":"9876543210","password":"123456"}'

# Test login
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@gmail.com","password":"123456","expectedRole":"admin"}'
```

**Option 3: Check Database Directly**
If using MongoDB Atlas:
1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Click "Collections"
4. Check `users` collection for `admin@gmail.com`

If using Local MongoDB:
```bash
mongosh
use renuka-enterprises
db.users.findOne({email: "admin@gmail.com"})
```

---

## 📞 Need Help?

Check these files for clues:
- Backend logs in terminal where `npm run dev` is running
- Frontend console: Press F12 → Console tab
- Backend `.env` - verify all values
- Frontend `.env` - verify `VITE_API_BASE_URL`
