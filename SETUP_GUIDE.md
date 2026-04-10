# 🚀 Renuka Enterprises - Project Setup & Testing Guide

## Prerequisites
- Node.js v16+ and npm
- MongoDB account (Atlas or local instance)
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create/update `.env` file in the `backend/` directory with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/renuka-enterprises
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URLS=http://localhost:5173,http://localhost:8081
```

### 3. Seed Default Admin User & Products
```bash
npm run seed
```

This creates:
- **Admin User**: email: `admin@gmail.com` password: `123456`
- **Sample Products**: Aquaguard and Inverter products

### 4. Start Backend Server
```bash
npm run dev
```

Expected: "Server running on port 5000" ✅

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` file in the root directory with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Expected: "Local: http://localhost:5173" ✅

---

## ✅ Testing Checklist

### 1. **Authentication**
- [ ] Go to http://localhost:5173/login
- [ ] Try admin login: `admin@gmail.com` / `123456`
- [ ] Verify redirect to `/admin`
- [ ] Try customer registration with new account
- [ ] Verify redirect to `/dashboard`

### 2. **Products Page**
- [ ] Navigate to `/products`
- [ ] Verify products load from database
- [ ] Check product details (name, price, category, description)
- [ ] Click "Enquire Now" button

### 3. **Admin Dashboard** (/admin)
- [ ] View booking statistics
- [ ] Switch between "bookings", "products", "invoices" tabs
- [ ] **Bookings Tab**:
  - [ ] View all bookings
  - [ ] Change booking status (pending → in-progress → completed)
  - [ ] Delete a booking
- [ ] **Products Tab**:
  - [ ] Add new product
  - [ ] Edit product
  - [ ] Delete product
- [ ] **Invoices Tab**:
  - [ ] Create invoice for a customer
  - [ ] Add invoice items
  - [ ] View invoice total calculation
  - [ ] Change invoice status

### 4. **Customer Dashboard** (/dashboard)
- [ ] Login as customer
- [ ] View booking history
- [ ] View invoices
- [ ] Check booking status

### 5. **Service Booking** (/booking)
- [ ] Fill booking form:
  - [ ] Select service type (Aquaguard/Inverter)
  - [ ] Select issue type
  - [ ] Pick date and time
  - [ ] Submit booking
- [ ] Verify confirmation message
- [ ] Admin should see new booking in /admin

### 6. **Invoice PDF Download**
- [ ] Go to `/dashboard` as customer
- [ ] Click on an invoice
- [ ] Click "PDF" button
- [ ] Verify PDF downloads with correct:
  - [ ] Invoice ID
  - [ ] Customer name
  - [ ] Items list
  - [ ] Total amount
  - [ ] Business name (Renuka Enterprises)

### 7. **Contact Page**
- [ ] Navigate to `/contact`
- [ ] Fill booking form
- [ ] Verify form submission works
- [ ] Check WhatsApp button links correctly

### 8. **Error Handling**
- [ ] Disconnect API and verify error messages
- [ ] Test form validation errors
- [ ] Verify loading states appear/disappear

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'html2pdf.js'"
**Solution**: 
```bash
npm install html2pdf.js
```

### Issue: MongoDB connection error
**Solution**: 
- Verify MONGODB_URI in backend/.env
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
- Ensure username/password are URL-encoded

### Issue: CORS errors
**Solution**: 
- Verify CLIENT_URLS in backend/.env includes frontend URL
- Check browser console for actual error

### Issue: White screen on /admin
**Solution**: 
- Check browser console for TypeScript/JS errors
- Verify you're logged in as admin
- Check network tab for API errors

### Issue: "Token is not valid"
**Solution**: 
- Clear localStorage: `localStorage.clear()`
- Log out and log back in
- Check JWT_SECRET matches between backend and env

---

## 📝 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Bookings
- `POST /api/bookings` - Create booking (optionalAuth)
- `GET /api/bookings/my` - Get my bookings (auth)
- `GET /api/bookings` - Get all bookings (admin only)
- `PUT /api/bookings/:id` - Update booking status (admin)
- `DELETE /api/bookings/:id` - Delete booking (admin)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Invoices
- `POST /api/invoices` - Create invoice (admin)
- `GET /api/invoices/my` - Get my invoices (auth)
- `GET /api/invoices` - Get all invoices (admin)
- `GET /api/invoices/:id` - Get single invoice (auth)
- `PATCH /api/invoices/:id/status` - Update status (admin)

---

## 🎯 Features Implemented

✅ User authentication (JWT)
✅ Role-based access control (admin/customer)
✅ Service bookings
✅ Product management
✅ Invoice generation
✅ PDF download
✅ Responsive UI
✅ Loading states
✅ Error handling
✅ Toast notifications

---

## 📦 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS + shadcn/ui
- Axios
- html2pdf.js

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- CORS

---

## 🚀 Deployment (Next Steps)

1. Replace MongoDB URI with production database
2. Update JWT_SECRET with strong random key
3. Set NODE_ENV=production
4. Build frontend: `npm run build`
5. Deploy to Vercel/Netlify (frontend) + Railway/Render (backend)

---

## 📞 Support

For issues or questions, check:
- Browser console for errors (F12)
- Network tab for API failures
- Backend logs in terminal
- Check .env files are properly configured
