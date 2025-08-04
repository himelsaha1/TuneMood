# Moodify - Complete Project Download

Here are all the files you need to run the Moodify application locally in VS Code:

## Essential Files to Copy

### 1. Root Configuration Files
- `package.json` (use the existing one in this project)
- `vite.config.ts`
- `tailwind.config.ts` 
- `tsconfig.json`
- `postcss.config.js`
- `components.json`
- `drizzle.config.ts`
- `README.md`
- `setup.js`

### 2. Server Directory (`server/`)
- `server/index.ts`
- `server/routes.ts`
- `server/storage.ts`
- `server/vite.ts`

### 3. Client Directory (`client/`)
- `client/index.html`
- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/index.css`

### 4. Client Components (`client/src/components/`)
- `client/src/components/camera-capture.tsx`
- `client/src/components/emotion-display.tsx`
- `client/src/components/music-recommendations.tsx`
- `client/src/components/music-player.tsx`

### 5. Client Hooks (`client/src/hooks/`)
- `client/src/hooks/use-camera.tsx`
- `client/src/hooks/use-emotion-detection.tsx`
- `client/src/hooks/use-mobile.tsx`
- `client/src/hooks/use-toast.ts`

### 6. Client Libraries (`client/src/lib/`)
- `client/src/lib/queryClient.ts`
- `client/src/lib/utils.ts`
- `client/src/lib/emotion-detection.ts`
- `client/src/lib/spotify.ts`

### 7. Client Pages (`client/src/pages/`)
- `client/src/pages/home.tsx`
- `client/src/pages/not-found.tsx`

### 8. Shared Types (`shared/`)
- `shared/schema.ts`

## Setup Instructions for Local Development

1. **Create a new folder** for your project (e.g. `moodify`)

2. **Copy all the files** listed above into the corresponding directories

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NODE_ENV=development
   ```

5. **Get Spotify API credentials**:
   - Go to https://developer.spotify.com/dashboard
   - Create a new app
   - Copy Client ID and Client Secret to your `.env` file

6. **Run the application**:
   ```bash
   npm run dev
   ```

7. **Open in browser**: http://localhost:5000

## VS Code Recommended Extensions

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Prettier - Code formatter

## Project Features

- Real-time webcam emotion detection
- Spotify music recommendations based on mood
- Modern dark UI with animations
- Music player with 30-second previews
- Responsive design for all devices

## Troubleshooting

- **Camera not working**: Check browser permissions and use HTTPS in production
- **No music recommendations**: Verify Spotify API credentials in .env file
- **Build errors**: Run `npm install` to ensure all dependencies are installed
- **TypeScript errors**: Run `npm run type-check` to see detailed error messages

The app will detect emotions (happy, sad, angry, fear, surprise, disgust, neutral) and recommend music accordingly using the Spotify Web API.