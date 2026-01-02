# Vercel Deployment Guide

This guide explains how to deploy the HRIS (Human Resource Information System) project on Vercel.

## Project Structure

This is a full-stack application with:
- Laravel backend (API and admin panel)
- React frontend
- Filament admin panel accessible at `/dash`

## Deployment Steps

### 1. Frontend Deployment

The React frontend is built using Vite and needs to be pre-built before deployment:

```bash
cd hris-frontend
npm install
npm run build
```

This creates a `dist` folder with the production-ready React application.

### 2. Backend Configuration

The Laravel backend handles:
- API routes under `/api/*`
- Filament admin panel under `/dash`
- Static file serving for the React frontend

### 3. Environment Variables

Add these environment variables in your Vercel project settings:

```
APP_NAME=HRIS
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://your-project-name.vercel.app

DB_CONNECTION=mysql
DB_HOST=your-database-host
DB_PORT=3306
DB_DATABASE=your-database-name
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password

# Add any other environment variables your application needs
```

### 4. Vercel Configuration

The `vercel.json` file is already configured to:
- Build the Laravel backend using PHP 8.3
- Serve the React frontend from the `hris-frontend/dist` directory
- Route API requests to Laravel
- Serve the React app for all other requests

### 5. Database Migration

After deployment, you'll need to run the database migrations:

1. Access your Vercel project's deployment
2. Run: `php artisan migrate`

### 6. Admin User

After deployment, you may need to create an admin user for the Filament panel:

```bash
php artisan make:filament-user
```

## Notes

- The React frontend is served at the root path `/`
- The Filament admin panel is accessible at `/dash`
- API endpoints are available under `/api/*`
- The Laravel application handles all routing and serves the React app for client-side routing

## Troubleshooting

If the React frontend routing doesn't work properly, make sure the fallback route is correctly configured to serve `index.html` for client-side routing.