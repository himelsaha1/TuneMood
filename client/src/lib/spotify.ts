// Spotify Web API utilities
export function getSpotifyEmbedUrl(trackUrl: string): string {
  // Extract track ID from Spotify URL
  const trackId = trackUrl.split('/').pop()?.split('?')[0];
  return `https://open.spotify.com/embed/track/${trackId}`;
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function openSpotifyTrack(url: string): void {
  window.open(url, '_blank');
}
