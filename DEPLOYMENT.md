# 🚀 Deployment Guide

## Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (free tier available)
3. ✅ Google Gemini API key

## Step-by-Step Deployment to Vercel

### Step 1: Prepare Your Code

```bash
# Make sure all your changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Web Interface (Recommended for First-Time Users)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login" with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `visheshsanghvi112/ravi-portfolio`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     Name: VITE_GEMINI_API_KEY
     Value: your_actual_gemini_api_key_here
     ```
   - Select all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment to complete
   - Click "Visit" to see your live site!

#### Option B: Vercel CLI (For Advanced Users)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. Go to your project on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Wait for SSL certificate to be issued (automatic)

## Environment Variables Setup

### Required Variables

| Variable Name | Description | Where to Get |
|--------------|-------------|--------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | [ai.google.dev](https://ai.google.dev/) |

### Adding Environment Variables on Vercel

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Click "Add"
4. Enter variable name and value
5. Select environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy for changes to take effect

## Continuous Deployment

Vercel automatically deploys your site when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or pull requests

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# Vercel will automatically build and deploy! 🎉
```

## Troubleshooting

### Build Fails

**Check:**
- Build logs in Vercel dashboard
- All dependencies are in `package.json`
- Environment variables are set correctly

**Fix:**
```bash
# Test build locally first
npm run build

# If successful, push to GitHub
git push origin main
```

### Environment Variables Not Working

**Solution:**
1. Make sure variable names start with `VITE_`
2. Redeploy after adding variables
3. Clear build cache: Settings → General → Reset Build Cache

### Images/Favicons Not Loading

**Check:**
- Files are in `public` folder
- Paths start with `/` (e.g., `/icon-512x512.png`)
- No typos in file names

### API Errors

**Verify:**
- Gemini API key is valid
- API key has proper permissions
- API quota not exceeded

## Performance Optimization

Your site is already optimized with:

- ✅ Minified JavaScript and CSS
- ✅ Code splitting
- ✅ Image optimization
- ✅ Caching headers
- ✅ Gzip compression (automatic on Vercel)

## Monitoring

### View Analytics (Free on Vercel)

1. Go to project dashboard
2. Click "Analytics"
3. View page views, visitors, and performance metrics

### Check Deployment Status

```bash
# List all deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

## Rollback

If something goes wrong:

1. Go to "Deployments" in Vercel dashboard
2. Find the last working deployment
3. Click "..." → "Promote to Production"

## Update Your Site

```bash
# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Update site content"
git push origin main

# Vercel automatically deploys! ✨
```

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **Issues**: Open an issue on GitHub

---

**Deployment Time**: ~2 minutes  
**Build Time**: ~30-60 seconds  
**Global CDN**: Automatic  
**SSL Certificate**: Automatic  
**Cost**: $0 (Free tier)

🎉 **Your site is now live and accessible worldwide!**
