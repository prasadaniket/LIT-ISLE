# 🚀 LIT ISLE Server Setup Guide

## ✅ **SOLUTION TO CONNECTION ERROR**

The error `POST http://localhost:4000/api/users/register net::ERR_CONNECTION_REFUSED` occurs because the backend server is not running. Here's how to fix it:

## 🔧 **Step 1: Environment Setup**

Create a `.env` file in the `server` directory with the following content:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://talesofreaders:Readerunknown@clusterlivo.ycvogj0.mongodb.net/LIT-ISLE

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_12345

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dgqtsaags
CLOUDINARY_API_KEY=116825138282291
CLOUDINARY_API_SECRET=IELTHB1v_nBalSLeUOPsCQsxR1Q
```

## 🚀 **Step 2: Start the Server**

Open a terminal in the `server` directory and run:

```bash
cd LIT-ISLE/server
npm install  # Install dependencies if not already done
npm start    # Start the server
```

You should see:
```
✅ MongoDB Connected Successfully
Server is running on http://localhost:4000
DB Connected
```

## 🧪 **Step 3: Test the Server**

Test the server endpoints:

### Test 1: Health Check
```bash
curl http://localhost:4000/
```

Expected response:
```json
{
  "success": true,
  "message": "LIT ISLE Digital Library API is running!",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 2: User Registration
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

## 🔍 **Troubleshooting**

### Issue 1: Port Already in Use
If you get "Port 4000 is already in use":
```bash
# Kill process on port 4000
npx kill-port 4000
# Or change port in .env file
PORT=4001
```

### Issue 2: Database Connection Failed
Check your MongoDB connection string in the `.env` file.

### Issue 3: CORS Errors
The server already has CORS configured for `http://localhost:5173`.

### Issue 4: Dependencies Missing
```bash
cd LIT-ISLE/server
npm install
```

## 📋 **Available API Endpoints**

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Profile Management
- `GET /api/user/profile` - Get detailed profile (protected)
- `PUT /api/user/profile` - Update profile (protected)
- `POST /api/user/profile/upload-image` - Upload images (protected)
- `GET /api/user/profile/completion` - Get completion status (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books/create` - Create book (protected)

### Shelf Management
- `GET /api/shelf` - Get user shelf (protected)
- `POST /api/shelf/add` - Add book to shelf (protected)
- `DELETE /api/shelf/remove/:id` - Remove book from shelf (protected)

### Reviews
- `GET /api/reviews/book/:id` - Get book reviews
- `POST /api/reviews` - Add review (protected)

## 🎯 **Quick Start Commands**

```bash
# Terminal 1: Start Backend
cd LIT-ISLE/server
npm start

# Terminal 2: Start Frontend
cd LIT-ISLE/client
npm run dev
```

## ✅ **Verification Checklist**

- [ ] Server starts without errors
- [ ] Database connects successfully
- [ ] Health check endpoint responds
- [ ] Registration endpoint works
- [ ] Frontend can connect to backend
- [ ] CORS is properly configured

## 🆘 **Still Having Issues?**

1. Check if Node.js is installed: `node --version`
2. Check if npm is installed: `npm --version`
3. Verify MongoDB connection string
4. Check firewall settings
5. Try a different port if 4000 is blocked

The server should now be running and accessible at `http://localhost:4000`!
