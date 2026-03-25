# Renuka Enterprises - Service Management System

A complete role-based web application for Renuka Enterprises, providing Aquaguard and Inverter sales, installation, servicing, and repair services in Nashik.

## Features

### Authentication System
- User registration and login with email/password
- JWT-based authentication
- Role-based access control (Admin/Customer)
- Protected routes

### Customer Features
- Register and login to account
- Book services (Aquaguard/Inverter)
- View booking history and status tracking
- View invoices for services/products
- Request product quotations

### Admin Features
- Dashboard with overview statistics
- Service management (view/update booking status)
- Product management (add/edit/delete products)
- Customer management
- Invoice generation with PDF download/print

### Billing & Invoice System
- Generate professional invoices
- Automatic total calculation
- Include business details, customer info, service/product details
- PDF download and print functionality

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18 with TypeScript
- Vite for build tool
- React Router for routing
- Axios for API calls
- Tailwind CSS + shadcn/ui for styling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/renuka-enterprises
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. Start MongoDB service (if using local MongoDB)

5. Seed initial data (optional):
   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the root directory (if not already there)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:8081

## Authentication System

The application features separate login flows for Admin and Customer roles:

### Login Flow
1. Visit `/login` to see the login type selection page
2. Choose "Login as Customer" or "Login as Admin"
3. Customer login allows registration; Admin login is restricted

### Default Admin Account
- Email: `admin@renuka.com`
- Password: `password`

### Routes
- `/login` - Select login type
- `/login/customer` - Customer login page
- `/login/admin` - Admin login page
- `/register` - Customer registration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer user
- `POST /api/auth/login` - Login user (accepts `expectedRole` parameter for role validation)
- `GET /api/auth/me` - Get current user info

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings` - Get all bookings (admin)
- `PUT /api/bookings/:id` - Update booking status (admin)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Invoices
- `GET /api/invoices/my` - Get user's invoices
- `GET /api/invoices` - Get all invoices (admin)
- `POST /api/invoices` - Create invoice (admin)
- `GET /api/invoices/:id` - Get single invoice

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Product.js
│   │   └── Invoice.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── products.js
│   │   └── invoices.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── CustomerDashboard.tsx
│   │   ├── AdminPage.tsx
│   │   ├── BookingPage.tsx
│   │   └── InvoicePage.tsx
│   ├── services/
│   │   └── api.js
│   └── App.tsx
└── package.json
```

## Usage

1. Start both backend and frontend servers
2. Register as a customer or login as admin
3. Customers can book services and view their history
4. Admin can manage bookings, products, and generate invoices
5. All data is stored in MongoDB

## Development

- Run `npm run dev` in frontend for hot reload
- Run `npm start` in backend (or `npm run dev` with nodemon)
- Use the admin account to test admin features
- Register customer accounts to test customer features

## License

This project is for educational/demonstration purposes.

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project uses Vite for building. To deploy:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, GitHub Pages, etc.)

## Can I connect a custom domain to my project?

Yes, you can connect a custom domain to your deployed application through your hosting provider's settings.
