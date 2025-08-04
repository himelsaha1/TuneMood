# Overview

This is a React-based emotion detection and music recommendation application called "Moodify". The application captures user photos through a webcam, analyzes the detected emotions using basic image processing, and provides personalized music recommendations from Spotify based on the user's emotional state. It features a modern dark theme interface built with shadcn/ui components and offers real-time music playback capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming, including Spotify-inspired color schemes
- **State Management**: React Query (@tanstack/react-query) for server state management and local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Dark theme with custom color palette including Spotify green, mood-specific colors (coral, cyan, blue)

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL as the target database
- **Session Storage**: In-memory storage with plans for PostgreSQL migration
- **API Design**: RESTful endpoints with structured error handling and request logging middleware

## Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Drizzle but currently using in-memory storage)
- **ORM**: Drizzle ORM with schema-first approach
- **Connection**: Neon Database serverless PostgreSQL driver
- **Schema Structure**:
  - Users table (id, username, Spotify integration fields)
  - Emotion sessions table (detected emotions, confidence scores, timestamps)
  - Music recommendations table (track details, audio features, Spotify URLs)

## Authentication and Authorization
- **Current State**: Basic user identification without full authentication
- **Spotify Integration**: OAuth-ready structure with client credentials flow for public music data
- **Session Management**: Prepared for connect-pg-simple session store integration

## Core Application Logic
- **Emotion Detection**: Client-side image processing using basic heuristics (brightness, contrast, color variance analysis)
- **Music Matching**: Server-side algorithm that maps emotions to Spotify audio features (valence, energy, danceability, tempo)
- **Real-time Features**: Camera capture, live emotion analysis, and immediate music recommendations

# External Dependencies

## Third-Party Services
- **Spotify Web API**: Music catalog access, track recommendations, and audio features analysis
- **Spotify Client Credentials**: Server-to-server authentication for public music data

## Key Libraries
- **UI Framework**: React, Radix UI primitives, shadcn/ui components
- **Database**: Drizzle ORM, Neon Database serverless driver, connect-pg-simple
- **Media Processing**: Web APIs for camera access and image capture
- **State Management**: TanStack React Query for server state synchronization
- **Build Tools**: Vite with TypeScript, PostCSS, Tailwind CSS
- **Development**: Replit-specific plugins for development environment integration

## Browser APIs
- **MediaDevices API**: Camera access and video streaming
- **Canvas API**: Image capture and basic image processing
- **Web Audio API**: Potential for audio preview functionality

## Development Dependencies
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Styling**: Tailwind CSS with custom design tokens, PostCSS for processing
- **Development Server**: Vite dev server with HMR, Express middleware integration