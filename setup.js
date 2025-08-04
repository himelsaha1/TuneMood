#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎵 Moodify Setup Script');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envTemplate = `# Spotify API Credentials
# Get these from: https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Optional: Set to 'production' for production builds
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created! Please add your Spotify API credentials.');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Dependencies not installed yet');
  console.log('Run: npm install');
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n🚀 Next Steps:');
console.log('1. Get Spotify API credentials from: https://developer.spotify.com/dashboard');
console.log('2. Update the .env file with your credentials');
console.log('3. Run: npm install (if not already done)');
console.log('4. Run: npm run dev');
console.log('5. Open: http://localhost:5000');

console.log('\n🎯 Features to try:');
console.log('• Click "Enable Camera" to start emotion detection');
console.log('• Capture your emotion to get personalized music recommendations');
console.log('• Play music previews and explore different moods');
console.log('• Click on track cards to preview music');

console.log('\n📚 For more info, check the README.md file');