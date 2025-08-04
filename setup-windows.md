# Windows Setup Guide for Moodify

## Quick Fix for the ENOTSUP Error

The error you got was due to Windows network compatibility. I've fixed the server code to detect Windows and use the right network settings.

## Steps to Run Locally on Windows:

### 1. Pull the Latest Changes
```bash
git pull origin main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the root directory:
```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NODE_ENV=development
PORT=5000
```

### 4. Get Spotify API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in:
   - App name: "Moodify"
   - App description: "Emotion-based music recommendations"
   - Redirect URI: `http://localhost:5000/callback` (not needed for this app but required)
5. Copy the Client ID and Client Secret to your `.env` file

### 5. Run the App
```bash
npm run dev
```

The app should now start on http://localhost:5000

## What the Fix Does:

- Detects if you're on Windows
- Uses `127.0.0.1` instead of `0.0.0.0` on Windows
- Removes the `reusePort` option on Windows (not supported)
- Keeps the original settings for Linux/Mac (like Replit)

## If You Still Get Errors:

Try a different port:
```bash
PORT=3000 npm run dev
```

Or check if something is using port 5000:
```bash
netstat -ano | findstr :5000
```

The app should work perfectly now on Windows!