# Production URLs

## Deployed Services

- **Frontend (Vercel)**: https://auraeventsystem.vercel.app/
- **Backend (Render)**: https://aura-event-api.onrender.com

## Environment Variables Configuration

### Vercel (Frontend)

Set the following environment variable in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://aura-event-api.onrender.com/api
```

**Important**: Make sure this is set for **Production**, **Preview**, and **Development** environments.

### Render (Backend)

Set the following environment variable in Render Dashboard → Your Service → Environment:

```
FRONTEND_URL=https://auraeventsystem.vercel.app
```

**Note**: The `FRONTEND_URL` is used for CORS configuration to allow requests from your frontend.

## API Endpoints

All API endpoints are available at:
- Base URL: `https://aura-event-api.onrender.com/api`
- Example: `https://aura-event-api.onrender.com/api/auth/login`

## Testing

1. **Frontend**: Visit https://auraeventsystem.vercel.app/
2. **Backend Health**: Check if backend is running by visiting `https://aura-event-api.onrender.com/api` (should return API info or 404, not connection error)

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in Render matches exactly: `https://auraeventsystem.vercel.app`
- No trailing slash in `FRONTEND_URL`

### API Connection Errors
- Verify `VITE_API_URL` in Vercel is set to: `https://aura-event-api.onrender.com/api`
- Check that backend is running on Render
- Check browser console for specific error messages

