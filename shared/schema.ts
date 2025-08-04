import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  spotifyId: text("spotify_id"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emotionSessions = pgTable("emotion_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  detectedEmotion: text("detected_emotion").notNull(),
  emotionScores: json("emotion_scores").$type<Record<string, number>>(),
  confidence: real("confidence"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const musicRecommendations = pgTable("music_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => emotionSessions.id),
  trackId: text("track_id").notNull(),
  trackName: text("track_name").notNull(),
  artist: text("artist").notNull(),
  albumCover: text("album_cover"),
  previewUrl: text("preview_url"),
  spotifyUrl: text("spotify_url").notNull(),
  audioFeatures: json("audio_features").$type<{
    danceability: number;
    energy: number;
    tempo: number;
    valence: number;
  }>(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
});

export const insertEmotionSessionSchema = createInsertSchema(emotionSessions).pick({
  detectedEmotion: true,
  emotionScores: true,
  confidence: true,
});

export const insertMusicRecommendationSchema = createInsertSchema(musicRecommendations).pick({
  sessionId: true,
  trackId: true,
  trackName: true,
  artist: true,
  albumCover: true,
  previewUrl: true,
  spotifyUrl: true,
  audioFeatures: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type EmotionSession = typeof emotionSessions.$inferSelect;
export type InsertEmotionSession = z.infer<typeof insertEmotionSessionSchema>;
export type MusicRecommendation = typeof musicRecommendations.$inferSelect;
export type InsertMusicRecommendation = z.infer<typeof insertMusicRecommendationSchema>;

export type EmotionType = 'happy' | 'sad' | 'angry' | 'fear' | 'surprise' | 'disgust' | 'neutral';
