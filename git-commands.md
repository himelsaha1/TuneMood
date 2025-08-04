# Git Commands to Push Moodify to GitHub

## Step 1: Create GitHub Repository First
1. Go to https://github.com/new
2. Name it "moodify" 
3. Keep it public
4. Don't initialize with README
5. Click "Create repository"

## Step 2: Run These Commands in Replit Shell

```bash
# Add all files to git
git add .

# Commit with message
git commit -m "Initial commit: Moodify emotion-based music recommendation app"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/moodify.git

# Push to GitHub
git push -u origin main
```

## If you get an error about main vs master branch:
```bash
git branch -M main
git push -u origin main
```

## Replace YOUR_USERNAME
Make sure to replace `YOUR_USERNAME` in the commands above with your actual GitHub username!

Example:
If your GitHub username is "johnsmith", use:
```bash
git remote add origin https://github.com/johnsmith/moodify.git
```

## After Pushing Successfully:
You can then clone it anywhere with:
```bash
git clone https://github.com/YOUR_USERNAME/moodify.git
cd moodify
npm install
```

## Environment Setup for Local Development:
Create `.env` file:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NODE_ENV=development
```

Get Spotify credentials from: https://developer.spotify.com/dashboard