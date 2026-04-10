# 🌐 MongoDB Atlas Setup (Free) - 5 Minute Guide

## Why MongoDB Atlas?
- ✅ Free tier (512MB storage - enough for testing)
- ✅ No installation needed
- ✅ No local MongoDB required
- ✅ Works from any computer

---

## Step-by-Step Setup

### Step 1: Create Free Account
1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click "Sign Up"
3. Enter email, name, password
4. Click "Create Account"
5. Verify email (click link in inbox)

### Step 2: Create Cluster
1. After login, click "Create" (or "Create a New Deployment")
2. Choose **"FREE"** tier ✓
3. Select cloud provider (AWS recommended) and region (closest to you)
4. Click "Create Cluster"
5. **Wait 5-10 minutes** for cluster to be ready

### Step 3: Create Database User
1. Go to **"Security"** → **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `admin` (or any name)
4. Password: `123456789` (or any password - write it down!)
5. Role: **"Built-in Role: Atlas Admin"**
6. Click "Add User"

### Step 4: Allow Network Access
1. Go to **"Security"** → **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (add 0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to **"Deployment"** → **"Databases"** (left sidebar)
2. Find your cluster, click **"Connect"**
3. Choose **"Drivers"** → **"Node.js"**
4. Copy the connection string
5. It looks like: `mongodb+srv://admin:123456789@cluster0.xxxxx.mongodb.net/test?retryWrites=true&w=majority`

### Step 6: Update Backend .env
Edit `backend/.env` and replace MongoDB URI line:

```env
MONGODB_URI=mongodb+srv://admin:123456789@cluster0.xxxxx.mongodb.net/renuka-enterprises?retryWrites=true&w=majority
```

Replace:
- `admin` → your username from Step 3
- `123456789` → your password from Step 3  
- `cluster0.xxxxx.mongodb.net` → your connection string from Step 5
- Keep `/renuka-enterprises?retryWrites=true&w=majority` at the end

---

## Quick Connection String Builder

If your String looks like:
```
mongodb+srv://admin:123456789@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

Change it to:
```
mongodb+srv://admin:123456789@cluster0.abc123.mongodb.net/renuka-enterprises?retryWrites=true&w=majority
```

(Add `/renuka-enterprises` before the `?`)

---

## Test Connection

After updating backend `.env`, run in backend folder:
```bash
npm run seed
```

Should see:
```
✅ Default admin user created: admin@gmail.com / 123456
Product created: Aquaguard Compact
Seeding completed
```

If you see this, **everything is working!** ✅

---

## Troubleshooting

### "Invalid credentials"
- Check username and password in connection string match what you set in Step 3

### "authentication failed"
- Go to "Network Access" and confirm 0.0.0.0/0 is added

### "User not authenticated to perform this operation"
-Change user role to "Atlas Admin" (Step 3)

### Still having issues?
Run in backend folder:
```bash
npm install
npm run seed
```

---

## Free Tier Limits (More than enough for testing)
- 512 MB storage
- 100 connections
- No credit card required (but can add one for more resources later)

---

**MongoDB Atlas is ready!** 🎉
