# Production Deployment Guide

This guide will help you deploy the Aura Event System to Vercel (frontend) and Render (backend).

## Prerequisites

- MongoDB Atlas account with connection string
- SendGrid account with API key (for email notifications)
- Vercel account
- Render account
- Git repository

## Backend Deployment (Render)

### Step 1: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `aura-event-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or choose paid plan)

### Step 2: Set Environment Variables in Render

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb+srv://nickwestwood41_db_user:VQzBs2Hxo5L45cU9@cluster0.wjbetmd.mongodb.net/?appName=Cluster0
JWT_SECRET=<generate-a-strong-random-string>
FRONTEND_URL=https://your-vercel-app.vercel.app
ADMIN_EMAIL=admin@auraevents.com
ADMIN_PASSWORD=maxyTech@143
SENDGRID_API_KEY=<your-sendgrid-api-key>
SENDGRID_FROM=no-reply@auraevents.com
```

**Important**: 
- Generate a strong random string for `JWT_SECRET` (you can use: `openssl rand -base64 32`)
- Update `FRONTEND_URL` after deploying frontend to Vercel
- Get your SendGrid API key from [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys)
- Update `SENDGRID_FROM` with your verified sender email address in SendGrid

### Step 3: Create Admin User

After the backend is deployed, run the admin creation script:

1. SSH into your Render instance or use Render's shell
2. Run: `cd backend && npm run create-admin`

Or use the API endpoint (if ADMIN_SETUP_TOKEN is set):
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auraevents.com",
    "password": "maxyTech@143",
    "setupToken": "your-admin-setup-token"
  }'
```

## Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables in Vercel

Add this environment variable:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

Replace `your-backend.onrender.com` with your actual Render backend URL.

### Step 3: Update Backend CORS

After deploying frontend, update the `FRONTEND_URL` environment variable in Render to match your Vercel URL.

## Local Environment Setup

### Backend (.env file)

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://nickwestwood41_db_user:VQzBs2Hxo5L45cU9@cluster0.wjbetmd.mongodb.net/?appName=Cluster0
PORT=4000
NODE_ENV=development
JWT_SECRET=your-local-jwt-secret-key
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@auraevents.com
ADMIN_PASSWORD=maxyTech@143
SENDGRID_API_KEY=your-sendgrid-api-key-here
SENDGRID_FROM=no-reply@auraevents.com
```

### Frontend (.env file)

Create `.env` in root:

```env
VITE_API_URL=http://localhost:4000/api
```

## Admin Credentials

- **Email**: admin@auraevents.com
- **Password**: maxyTech@143

**Important**: Change the admin password after first login in production!

## SendGrid Email Setup

### Step 1: Create SendGrid Account

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your account (check email)

### Step 2: Create API Key

1. Go to [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click "Create API Key"
3. Name it (e.g., "Aura Events Production")
4. Select "Full Access" or "Restricted Access" with Mail Send permissions
5. Copy the API key (you won't see it again!)

### Step 3: Verify Sender Email

1. Go to [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Verify a Single Sender or Domain
3. Use the verified email address for `SENDGRID_FROM`

### Step 4: Set Environment Variables

Add to Render environment variables:
- `SENDGRID_API_KEY`: Your SendGrid API key
- `SENDGRID_FROM`: Your verified sender email (e.g., `no-reply@auraevents.com`)

**Note**: Without SendGrid configured, QR code emails will not be sent, but registration will still work.

## Post-Deployment Checklist

- [ ] Backend deployed and running on Render
- [ ] Frontend deployed and running on Vercel
- [ ] Environment variables set correctly
- [ ] SendGrid API key configured
- [ ] SendGrid sender email verified
- [ ] Admin user created
- [ ] CORS configured correctly
- [ ] Test admin login
- [ ] Test API endpoints
- [ ] Test guest registration and QR code email
- [ ] Update admin password
- [ ] Set up proper JWT_SECRET (not default)

## Troubleshooting

### Backend Issues

- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- Check that JWT_SECRET is set and not default

### Frontend Issues

- Verify VITE_API_URL points to correct backend URL
- Check browser console for CORS errors
- Ensure backend CORS allows your Vercel domain

### CORS Errors

If you see CORS errors:
1. Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
2. Check that backend is allowing credentials
3. Ensure frontend is using correct API URL

## Security Notes

1. **Never commit .env files** - They are in .gitignore
2. **Change default JWT_SECRET** - Use a strong random string
3. **Change admin password** - After first login
4. **Use HTTPS** - Both Vercel and Render provide HTTPS by default
5. **Set ADMIN_SETUP_TOKEN** - For additional security when creating admins

