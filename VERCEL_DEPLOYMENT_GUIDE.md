# Vercel Deployment Guide for CSE310 Module 3

## 🚀 Deploy to Vercel

### Prerequisites
1. ✅ Project built successfully (`npm run build`)
2. ✅ Vercel CLI installed
3. ✅ Vercel project configured

### Environment Variables Setup

Before deploying, you need to set up environment variables on Vercel:

1. **Go to your Vercel Dashboard**: https://vercel.com/dashboard
2. **Navigate to your project**: `inventory-management-system`
3. **Go to Settings > Environment Variables**
4. **Add the following variables**:

```
VITE_SUPABASE_URL = https://xxgpfxkokhuqoooqakkd.supabase.co
VITE_SUPABASE_ANON_KEY = [your_supabase_anon_key_from_env_file]
```

### Deployment Commands

Option 1: **Web Dashboard Deploy**
```bash
# Connect your GitHub repository to Vercel
# Push to main/master branch for auto-deployment
git push origin master
```

Option 2: **CLI Deploy**
```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy to production
vercel --prod

# Or deploy with environment variables
vercel --prod --env VITE_SUPABASE_URL=https://xxgpfxkokhuqoooqakkd.supabase.co
```

Option 3: **Manual Deploy**
```bash
# Build the project
npm run build

# Deploy the dist folder
vercel dist --prod
```

### Project Configuration

Your `vercel.json` is already configured:
- ✅ Framework: Vite
- ✅ Output Directory: dist
- ✅ Environment Variables: Configured for secrets
- ✅ SPA Routing: Configured

### Post-Deployment

1. **Verify deployment** at your Vercel URL
2. **Test functionality** - database connections should work
3. **Check console** for any errors
4. **Update DNS** if using custom domain

### Troubleshooting

**Common Issues:**
- Environment variables not set → Set them in Vercel dashboard
- Build fails → Check `npm run build` locally first
- 404 errors → Verify SPA routing configuration
- Database connection issues → Check environment variables

### Your Project URLs
- **Vercel Dashboard**: https://vercel.com/team_xpdBlqNS0eh3OtsRoy6bUq24/inventory-management-system
- **Project ID**: prj_L0K5MznWIAw1gnkhVxozSDpMa63r

## Security Note 🔐

Never commit environment variables with real credentials to Git. The deployment uses environment variables from Vercel's secure storage.
