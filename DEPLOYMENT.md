# Deploying Traveloop to Render

## Prerequisites
- GitHub repository with your Traveloop code
- Render account (free tier available)
- MongoDB Atlas account (for database)
- Cloudinary account (for image uploads, optional)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Update render.json:**
   - Replace `yourusername` in the repo URLs with your actual GitHub username
   - Update service names if desired

## Step 2: Set Up Environment Variables

### For the Server Service:
Go to your Render dashboard → your server service → Environment and add:
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URI`: Your MongoDB connection string
- `CLIENT_URL`: `https://your-client-name.onrender.com` (update after client deployment)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `JWT_SECRET`: A secure random string

### For the Client Service:
- `VITE_API_URL`: `https://your-server-name.onrender.com`

## Step 3: Deploy to Render

### Option A: Using Render Dashboard (Recommended)
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. **For Server:**
   - Name: `traveloop-server`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
5. **For Client:**
   - Name: `traveloop-client`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Instance Type: Free

### Option B: Using render.json
1. Push the render.json file to your repository
2. Connect your GitHub repo to Render
3. Render will automatically detect and create the services

## Step 4: Post-Deployment Configuration

1. **Get your URLs:**
   - Server: `https://traveloop-server.onrender.com`
   - Client: `https://traveloop-client.onrender.com`

2. **Update CORS settings:**
   - Go to your server service environment variables
   - Update `CLIENT_URL` to your client's Render URL

3. **Test the deployment:**
   - Visit your client URL
   - Check server health: `https://your-server.onrender.com/health`

## Step 5: Database Setup

1. **MongoDB Atlas:**
   - Create a free cluster
   - Add your Render server IP to IP whitelist (0.0.0.0/0 for any IP)
   - Get connection string and add to environment variables

2. **Seed data (optional):**
   ```bash
   # Connect to your server via Render shell or run locally
   npm run seed:cities
   npm run seed:activities
   ```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure `CLIENT_URL` matches your client's exact URL
2. **Database connection**: Verify MongoDB URI and IP whitelist
3. **Build failures**: Check logs in Render dashboard
4. **Environment variables**: Ensure all required variables are set

### Useful Commands:
- Check server logs: Render Dashboard → Service → Logs
- Redeploy: Push new commit or use "Manual Deploy" in Render
- Health check: `https://your-server.onrender.com/health`

## Cost Optimization
- Free tier includes:
  - 750 hours/month of web service time
  - 100GB bandwidth
  - 50GB storage
- Consider upgrading if you exceed these limits

## Next Steps
1. Set up a custom domain (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and alerts
4. Consider CI/CD pipeline for automated deployments
