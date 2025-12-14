# Environment Configuration Guide

## Development vs Production Setup

Your application is configured to work in different environments. Here's how to handle each scenario:

## 1. Docker Development (Current Setup)

**Backend Environment Variables** (set in `docker-compose.yml`):
- `PORT`: 3001
- `MONGODB_URI`: `mongodb://root:password@database:27017/hobby-farm?authSource=admin`
  - Uses service name `database` (Docker internal networking)
- `JWT_SECRET`: Your secret key
- `FRONTEND_URL`: `http://localhost:3000` (for CORS)

**Frontend Environment Variables** (`.env`):
- `VITE_API_BASE_URL`: `http://localhost:3001/api`
- `VITE_USE_MOCK_DATA`: `false`

## 2. Local Development (Without Docker)

Create `code/backend/.env.local`:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hobby-farm
JWT_SECRET="tL6!vN7)jE0*vN0?pO7%uL4>lH8.tS6;"
FRONTEND_URL=http://localhost:3000
```

**Key Difference**: 
- MongoDB host is `localhost` instead of `database`
- No authentication needed if running MongoDB locally without auth

**Run locally**:
```bash
# Start MongoDB locally (if not using Docker)
brew services start mongodb-community

# Backend
cd code/backend
npm run start:dev

# Frontend
cd code/frontend
npm run dev
```

## 3. Production Deployment

### Backend (.env.production)

```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://<username>:<password>@<mongo-host>:<port>/<database>?authSource=admin
JWT_SECRET=<generate-strong-secret-in-production>
FRONTEND_URL=https://yourdomain.com
```

**Important for Production**:
1. **MongoDB URI**: Use your cloud MongoDB connection string (MongoDB Atlas, AWS DocumentDB, etc.)
2. **JWT_SECRET**: Generate a strong random secret (use `openssl rand -base64 32`)
3. **FRONTEND_URL**: Your production frontend domain
4. **Environment Variables**: Set these in your hosting platform (Heroku, AWS, Vercel, etc.), NOT in committed files

### Frontend (.env.production)

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_USE_MOCK_DATA=false
```

## 4. Common Deployment Platforms

### Vercel (Frontend) + Railway/Render (Backend)

**Vercel Frontend**:
- Environment Variables:
  - `VITE_API_BASE_URL`: `https://your-backend.railway.app/api`
  - `VITE_USE_MOCK_DATA`: `false`

**Railway/Render Backend**:
- Environment Variables:
  - `PORT`: (Usually auto-set by platform)
  - `MONGODB_URI`: Your MongoDB Atlas connection string
  - `JWT_SECRET`: Your production secret
  - `FRONTEND_URL`: `https://your-app.vercel.app`

### AWS/DigitalOcean

Use the same environment variable pattern, but:
- Store secrets in AWS Secrets Manager or similar
- Use environment-specific .env files
- Never commit production secrets to git

## 5. Environment Variable Priority

NestJS loads environment variables in this order:
1. System environment variables (highest priority)
2. `.env.local` (if exists)
3. `.env`

**Best Practice**:
- `.env` - Default/development values (committed to git)
- `.env.local` - Local overrides (gitignored)
- `.env.production` - Production template (gitignored, values set in hosting platform)

## 6. Gitignore Configuration

Add to `.gitignore`:
```
.env.local
.env.production
.env.*.local
```

Keep in git:
```
.env.example  # Template with placeholder values
.env          # Development defaults (no real secrets)
```

## 7. Health Check Endpoint

Consider adding a health check endpoint for production monitoring:

**Backend** (`src/app.controller.ts`):
```typescript
@Get('health')
healthCheck() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

## 8. Migration Checklist

When deploying outside Docker:

- [ ] Update `MONGODB_URI` to point to correct MongoDB instance
- [ ] Change `JWT_SECRET` to production value
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Verify CORS settings allow production frontend
- [ ] Test authentication flow in production
- [ ] Set up SSL/HTTPS (required for production)
- [ ] Configure production MongoDB with proper auth
- [ ] Set up monitoring and error tracking

## 9. Quick Reference

| Environment | MongoDB Host | Frontend URL | Backend URL |
|-------------|--------------|--------------|-------------|
| Docker Dev  | `database` (container name) | http://localhost:3000 | http://localhost:3001 |
| Local Dev   | `localhost` | http://localhost:3000 | http://localhost:3001 |
| Production  | Cloud MongoDB URI | https://yourdomain.com | https://api.yourdomain.com |

---

**Bottom Line**: Your current setup works for Docker. When deploying elsewhere, you just need to update the environment variables to match your deployment environment. The code itself doesn't need to change!
