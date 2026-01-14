import { create } from 'zustand';
import { Story } from '@/types/story';

interface StoryStore {
  stories: Story[];
  selectedStory: Story | null;
  isLoading: boolean;
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, story: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  setSelectedStory: (story: Story | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStoryStore = create<StoryStore>((set) => ({
  stories: [],
  selectedStory: null,
  isLoading: false,
  setStories: (stories) => set({ stories }),
  addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),
  updateStory: (id, updatedStory) =>
    set((state) => ({
      stories: state.stories.map((s) => (s.id === id ? { ...s, ...updatedStory } : s)),
    })),
  deleteStory: (id) => set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),
  setSelectedStory: (story) => set({ selectedStory: story }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
