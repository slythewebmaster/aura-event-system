# Admin User Credentials

## Default Admin Login

**Email:** `admin@auraevents.com`  
**Password:** `maxyTech@143`

## Login URL

- **Production:** https://auraeventsystem.vercel.app/admin/login
- **Local:** http://localhost:5173/admin/login

## Creating/Updating Admin User

### Option 1: Using Render Shell (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service (`aura-event-backend`)
3. Click on **Shell** tab
4. Run:
   ```bash
   cd backend
   npm run create-admin
   ```

This will:
- Create the admin user if it doesn't exist
- Update the password if the admin already exists

### Option 2: Using API Endpoint

If `ADMIN_SETUP_TOKEN` is **NOT** set in Render environment variables, you can create the admin via API:

```bash
curl -X POST https://aura-event-api.onrender.com/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auraevents.com",
    "password": "maxyTech@143"
  }'
```

**Note:** If `ADMIN_SETUP_TOKEN` is set, you must include it:
```bash
curl -X POST https://aura-event-api.onrender.com/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auraevents.com",
    "password": "maxyTech@143",
    "setupToken": "your-admin-setup-token"
  }'
```

### Option 3: Using Local Script (if you have MongoDB access)

If you have the MongoDB connection string, you can run locally:

```bash
cd backend
node scripts/createAdmin.js
```

Make sure to set environment variables:
- `MONGO_URI` - Your MongoDB connection string
- `ADMIN_EMAIL` - (optional, defaults to admin@auraevents.com)
- `ADMIN_PASSWORD` - (optional, defaults to maxyTech@143)

## Testing Admin Login

Test if the admin user exists by trying to log in at:
https://auraeventsystem.vercel.app/admin/login

Or test via API:
```bash
curl -X POST https://aura-event-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@auraevents.com",
    "password": "maxyTech@143"
  }'
```

## Security Recommendations

1. **Change the default password** after first login
2. **Set ADMIN_SETUP_TOKEN** in Render to restrict admin creation
3. **Use a strong password** in production
4. **Don't commit credentials** to version control

## Current Configuration

Based on `render.yaml`, the admin credentials are:
- Email: `admin@auraevents.com` (from `ADMIN_EMAIL` env var)
- Password: `maxyTech@143` (from `ADMIN_PASSWORD` env var)

These can be changed in Render Dashboard → Environment Variables.

