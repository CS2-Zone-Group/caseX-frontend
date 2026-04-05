import { create } from 'zustand';

export interface MusicTrack {
  id: string;
  name: string;
  audioUrl: string;
  imageUrl: string;
}

interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  setTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export const useMusicPlayerStore = create<MusicPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,

  setTrack: (track) => {
    const { currentTrack } = get();
    if (currentTrack?.id === track.id) {
      // Same track — toggle play/pause
      set((s) => ({ isPlaying: !s.isPlaying }));
    } else {
      set({ currentTrack: track, isPlaying: true });
    }
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  stop: () => set({ isPlaying: false, currentTrack: null }),

  setVolume: (volume) => set({ volume }),
}));
