
export type TabType = 'announcements' | 'discover' | 'profile';
export type DiscoverMode = 'swipe' | 'suggestions';
export type Gender = 'Male' | 'Female' | 'Prefer not to say';

export interface UserProfile {
  id: string;
  firstName: string;
  age: number;
  gender: Gender;
  bio: string;
  location?: string;
  instagramUsername?: string;
  interests: string[];
  goals: string[];
  photoUrl?: string;
  normalizedBioKeywords?: string[];
  socials?: {
    instagram?: string;
    linkedin?: string;
  };
  mutualInterests?: number;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  description: string;
  postedBy: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  timing?: string;
  likes: number;
}

export interface AppState {
  isOnboarded: boolean;
  currentUser: UserProfile | null;
  activeTab: TabType;
  discoverMode: DiscoverMode;
}
