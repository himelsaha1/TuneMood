# Moodify - Emotion-Based Music Recommendation App

A full-stack React application that detects user emotions through webcam and generates personalized Spotify music recommendations.

## Features

- Real-time emotion detection using webcam
- AI-powered emotion analysis (happy, sad, angry, fear, surprise, disgust, neutral)
- Spotify API integration for music recommendations
- Modern dark UI with Spotify-inspired design
- Music player with preview functionality
- Responsive design with animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- TanStack React Query for state management
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM (configured for PostgreSQL but using in-memory storage)
- Spotify Web API integration

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Spotify Developer Account (for API credentials)

## Installation & Setup

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Spotify API credentials**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Get your Client ID and Client Secret
   - Create a `.env` file in the root directory:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5000`
   - Allow camera access when prompted
   - Click "Capture Emotion" to detect your mood and get music recommendations

## Project Structure

```
moodify/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Entry point
│   └── index.html
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared TypeScript types
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## How It Works

1. **Camera Capture**: Users enable their webcam and capture a photo
2. **Emotion Detection**: Basic image analysis detects the dominant emotion
3. **Music Matching**: Server queries Spotify API based on emotion-to-music mapping
4. **Recommendations**: Users get 8 personalized song recommendations
5. **Music Player**: Built-in player for previewing tracks (30-second previews)

## API Endpoints

- `POST /api/emotion-session` - Create emotion session and get recommendations
- `GET /api/session/:sessionId/recommendations` - Get recommendations for a session
- `POST /api/fresh-recommendations` - Get fresh recommendations for an emotion

## Customization

- **Emotion Detection**: Currently uses basic image analysis. Can be enhanced with ML libraries like face-api.js
- **Music Mapping**: Emotion-to-music parameters can be adjusted in `server/routes.ts`
- **UI Themes**: Colors and styling can be customized in `client/src/index.css`

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: Camera access requires HTTPS in production environments.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## License

MIT License - feel free to use this project for learning and development purposes.