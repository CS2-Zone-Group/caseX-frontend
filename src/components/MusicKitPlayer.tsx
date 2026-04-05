"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMusicPlayerStore } from "@/store/musicPlayerStore";

export default function MusicKitPlayer() {
  const { currentTrack, isPlaying, volume, togglePlay, stop, setVolume } =
    useMusicPlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);

  // Sync play/pause with store state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        useMusicPlayerStore.getState().togglePlay();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Load new track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
      audio.src = currentTrack.audioUrl;
      audio.volume = volume;
      setProgress(0);
      setDuration(0);
      if (isPlaying) {
        audio.play().catch(() => {
          useMusicPlayerStore.getState().togglePlay();
        });
      }
    } else {
      audio.pause();
      audio.src = "";
      setProgress(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }, []);

  const handleEnded = useCallback(() => {
    useMusicPlayerStore.getState().togglePlay();
    setProgress(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, ratio));
    if (audioRef.current && duration) {
      audioRef.current.currentTime = clamped * duration;
      setProgress(clamped);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        preload="metadata"
      />

      {/* Floating mini-player */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(480px,calc(100vw-2rem))]">
        <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/60 rounded-2xl shadow-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Album art */}
            <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                </svg>
              </div>
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate leading-tight">
                {currentTrack.name}
              </p>
              <p className="text-gray-400 text-[10px] mt-0.5">Music Kit</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 transition-colors flex items-center justify-center shadow"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {buffering ? (
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>

              {/* Stop */}
              <button
                onClick={stop}
                className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center"
                aria-label="Stop"
              >
                <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5 ml-1">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  {volume === 0 ? (
                    <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  ) : volume < 0.5 ? (
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  )}
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 accent-cyan-500 cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-7 text-right flex-shrink-0">
              {formatTime((progress * duration) || 0)}
            </span>
            <div
              className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-cyan-500 rounded-full relative transition-all"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 w-7 flex-shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
