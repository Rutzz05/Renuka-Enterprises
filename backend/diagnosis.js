#!/usr/bin/env node

/**
 * Authentication Diagnostics Script
 * Run: node diagnosis.js
 * 
 * This script checks all components needed for authentication to work
 */

const http = require('http');

console.log('\n🔍 RENUKA ENTERPRISES - AUTHENTICATION DIAGNOSIS\n');
console.log('='.repeat(60));

// Check 1: Frontend .env
console.log('\n✓ Checking Frontend Configuration...');
try {
  const fs = require('fs');
  const envPath = './.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    if (envContent.includes('VITE_API_BASE_URL')) {
      console.log('  ✅ Frontend .env exists');
      console.log('     API URL:', envContent.match(/VITE_API_BASE_URL=(.+)/)?.[1] || 'NOT FOUND');
    } else {
      console.log('  ❌ Frontend .env missing VITE_API_BASE_URL');
    }
  } else {
    console.log('  ❌ Frontend .env NOT FOUND');
  }
} catch (e) {
  console.log('  ⚠️  Error reading frontend .env:', e.message);
}

// Check 2: Backend .env
console.log('\n✓ Checking Backend Configuration...');
try {
  const fs = require('fs');
  const envPath = './backend/.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const mongoMatch = envContent.match(/MONGODB_URI=(.+)/)?.[1];
    const jwtMatch = envContent.match(/JWT_SECRET=(.+)/)?.[1];
    
    console.log('  ✅ Backend .env exists');
    if (mongoMatch) {
      const isPlaceholder = mongoMatch.includes('<username>') || mongoMatch.includes('<password>');
      console.log('     MongoDB URI:', isPlaceholder ? '❌ PLACEHOLDER (needs setup)' : '✅ ' + mongoMatch.substring(0, 50) + '...');
    } else {
      console.log('     MongoDB URI: ❌ NOT FOUND');
    }
    if (jwtMatch && jwtMatch !== 'replace-with-a-long-random-secret') {
      console.log('     JWT Secret: ✅ Configured');
    } else {
      console.log('     JWT Secret: ⚠️  Using default/placeholder');
    }
  } else {
    console.log('  ❌ Backend .env NOT FOUND');
  }
} catch (e) {
  console.log('  ⚠️  Error reading backend .env:', e.message);
}

// Check 3: Backend Server Running
console.log('\n✓ Checking Backend Server (http://localhost:5000/api/health)...');
const req = http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.status === 'ok') {
        console.log('  ✅ Backend Server is RUNNING and responding');
      } else {
        console.log('  ⚠️  Backend responded but unexpected format');
      }
    } catch (e) {
      console.log('  ❌ Backend not responding properly');
    }
    checkMongoDB();
  });
}).on('error', (err) => {
  console.log('  ❌ Backend Server is NOT RUNNING');
  console.log('     Start with: npm run dev (in backend directory)');
  checkMongoDB();
});

// Check 4: MongoDB Connection (by checking if admin user exists)
function checkMongoDB() {
  console.log('\n✓ Checking MongoDB Connection...');
  console.log('  (This check requires backend to be running with valid MongoDB URI)');
  
  // Make a test request to auth endpoint
  const postData = JSON.stringify({
    email: 'admin@gmail.com',
    password: '123456',
    expectedRole: 'admin'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const authReq = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.token) {
          console.log('  ✅ MongoDB Connected - Admin user found and authenticated');
        } else if (json.message === 'Invalid credentials') {
          console.log('  ⚠️  MongoDB Connected - Admin user NOT created yet');
          console.log('     Run: npm run seed (in backend directory)');
        } else if (json.message && json.message.includes('Cannot find module')) {
          console.log('  ❌ MongoDB Connection Error - Missing dependencies');
          console.log('     Run: npm install (in backend directory)');
        } else {
          console.log('  ⚠️  MongoDB Response:', json.message);
        }
      } catch (e) {
        console.log('  ❌ MongoDB Connection Error');
        console.log('     Error:', e.message);
      }
      printSummary();
    });
  });

  authReq.on('error', (err) => {
    console.log('  ❌ Cannot reach backend to test MongoDB');
    printSummary();
  });

  authReq.write(postData);
  authReq.end();
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 NEXT STEPS:\n');
  console.log('1️⃣  If Backend Not Running:');
  console.log('   cd backend');
  console.log('   npm install');
  console.log('   npm run dev\n');

  console.log('2️⃣  If MongoDB URI is Placeholder:');
  console.log('   Edit backend/.env');
  console.log('   Option A: Use local MongoDB');
  console.log('     MONGODB_URI=mongodb://localhost:27017/renuka-enterprises');
  console.log('   Option B: Use MongoDB Atlas (free cloud)');
  console.log('     1. Sign up at mongodb.com/cloud/atlas');
  console.log('     2. Create cluster and get connection string');
  console.log('     3. Add credentials to MONGODB_URI\n');

  console.log('3️⃣  If Admin User Not Created:');
  console.log('   npm run seed (in backend directory)\n');

  console.log('4️⃣  Start Frontend:');
  console.log('   npm run dev (in root directory)\n');

  console.log('5️⃣  Test:');
  console.log('   Open http://localhost:5173/login/admin');
  console.log('   Email: admin@gmail.com');
  console.log('   Password: 123456\n');

  console.log('='.repeat(60) + '\n');
}
