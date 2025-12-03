# Production Readiness Checklist

## ✅ Completed Setup

### Backend Configuration
- [x] Added missing dependencies (`bcryptjs`, `jsonwebtoken`) to `backend/package.json`
- [x] Updated CORS configuration for production (supports environment-based origins)
- [x] Updated MongoDB connection with production-ready options
- [x] Created admin user creation script (`backend/scripts/createAdmin.js`)
- [x] Updated JWT_SECRET handling with warnings for default values
- [x] Created `.env` file in `backend/` directory with:
  - MongoDB connection string
  - Admin credentials (admin@auraevents.com / maxyTech@143)
  - JWT_SECRET placeholder
  - Frontend URL placeholder

### Frontend Configuration
- [x] Created `.env` file in root with `VITE_API_URL` placeholder
- [x] Frontend already configured to use environment variables

### Deployment Files
- [x] Created `render.yaml` for Render backend deployment
- [x] Created `vercel.json` for Vercel frontend deployment
- [x] Updated `.gitignore` to exclude `.env` files
- [x] Created `DEPLOYMENT.md` with detailed deployment instructions

## 📋 Pre-Deployment Steps

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (from root)
npm install
```

### 2. Create Admin User Locally (Optional)
```bash
cd backend
npm run create-admin
```

This will create the admin user with:
- Email: admin@auraevents.com
- Password: maxyTech@143

### 3. Test Locally
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🚀 Deployment Steps

### Backend (Render)

1. **Deploy to Render**:
   - Use the `render.yaml` file or manually configure:
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`

2. **Set Environment Variables in Render Dashboard**:
   ```
   MONGO_URI=mongodb+srv://nickwestwood41_db_user:VQzBs2Hxo5L45cU9@cluster0.wjbetmd.mongodb.net/?appName=Cluster0
   PORT=4000
   NODE_ENV=production
   JWT_SECRET=<generate-strong-random-string>
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ADMIN_EMAIL=admin@auraevents.com
   ADMIN_PASSWORD=maxyTech@143
   ```

3. **Create Admin User**:
   - After deployment, run: `npm run create-admin` via Render shell
   - Or use the API endpoint with ADMIN_SETUP_TOKEN

### Frontend (Vercel)

1. **Deploy to Vercel**:
   - Connect your Git repository
   - Vercel will auto-detect Vite configuration

2. **Set Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
   Replace `your-backend.onrender.com` with your actual Render URL

3. **Update Backend CORS**:
   - Update `FRONTEND_URL` in Render to match your Vercel URL

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` from default value (generate strong random string)
- [ ] Change admin password after first login
- [ ] Set `ADMIN_SETUP_TOKEN` for additional security
- [ ] Verify `.env` files are in `.gitignore` (already done)
- [ ] Use HTTPS (automatic with Vercel/Render)

## 🧪 Post-Deployment Testing

- [ ] Backend health check (visit Render URL)
- [ ] Admin login works
- [ ] API endpoints respond correctly
- [ ] CORS allows frontend requests
- [ ] Frontend can connect to backend
- [ ] All features work as expected

## 📝 Environment Variables Summary

### Backend (.env)
```
MONGO_URI=mongodb+srv://nickwestwood41_db_user:VQzBs2Hxo5L45cU9@cluster0.wjbetmd.mongodb.net/?appName=Cluster0
PORT=4000
NODE_ENV=production
JWT_SECRET=<change-this>
FRONTEND_URL=<your-vercel-url>
ADMIN_EMAIL=admin@auraevents.com
ADMIN_PASSWORD=maxyTech@143
```

### Frontend (.env)
```
VITE_API_URL=<your-render-backend-url>/api
```

## 🆘 Troubleshooting

### If backend won't start:
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs for errors

### If frontend can't connect:
- Verify `VITE_API_URL` is correct
- Check backend CORS settings
- Ensure `FRONTEND_URL` in backend matches Vercel URL

### If admin login fails:
- Run `npm run create-admin` script
- Check database connection
- Verify admin credentials

## 📞 Admin Credentials

**Default Admin Account:**
- Email: `admin@auraevents.com`
- Password: `maxyTech@143`

**⚠️ IMPORTANT**: Change this password immediately after first login!

