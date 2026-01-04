
import { Announcement, UserProfile } from './types';
import { normalizeAndTokenize } from './services/matchingService';

export const CATEGORIES = [
  "Study Group",
  "Project",
  "Volunteering",
  "Hackathon",
  "Sports",
  "Hobbies"
];

export const INTERESTS = [
  "Coding", "Robotics", "Design", "Math", "Science",
  "Music", "Gaming", "Art", "Writing", "Entrepreneurship",
  "Photography", "Debate", "Chess", "Basketball", "Swimming"
];

export const GOALS = [
  "Find study buddies",
  "Build a project",
  "Sports friends",
  "Volunteering",
  "Mentorship",
  "Just chat"
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Looking for a UI/UX Designer',
    category: 'Project',
    description: 'Building a simple task tracker for high school students. Need someone who loves Figma and clean designs!',
    postedBy: { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/100/100' },
    timestamp: '2h ago',
    likes: 12
  },
  {
    id: '2',
    title: 'SAT Prep Study Group',
    category: 'Study Group',
    description: 'Starting a weekly study session for the upcoming SATs. We focus mostly on the Math section.',
    postedBy: { name: 'Sarah', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    timestamp: '4h ago',
    likes: 8
  },
  {
    id: '3',
    title: 'Local Park Cleanup Crew',
    category: 'Volunteering',
    description: 'Join us this Saturday for a neighborhood cleanup! Great for community service hours.',
    postedBy: { name: 'Marcus', avatar: 'https://picsum.photos/seed/marcus/100/100' },
    timestamp: '6h ago',
    likes: 24
  }
];

export const GENDERS = ['Male', 'Female', 'Prefer not to say'] as const;

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    firstName: 'Taylor',
    age: 18,
    gender: 'Female',
    location: 'Portland, OR',
    instagramUsername: 'taylor_eco',
    bio: 'Passionate about climate action & sustainability 🌍 Building a startup for green energy.',
    interests: ['Environment', 'Volunteering', 'Science', 'Politics'],
    goals: ['Volunteering', 'Start a club', 'Event planning'],
    photoUrl: 'https://picsum.photos/seed/taylor/400/600',
    normalizedBioKeywords: normalizeAndTokenize('Passionate about climate action & sustainability 🌍 Building a startup for green energy.'),
    mutualInterests: 3
  },
  {
    id: 'u2',
    firstName: 'Leo',
    age: 17,
    gender: 'Male',
    location: 'Seattle, WA',
    instagramUsername: 'leo_builds',
    bio: 'Avid coder and robotics fan. Looking for teammates for the upcoming local hackathon. I love building apps.',
    interests: ['Coding', 'Robotics', 'Gaming'],
    goals: ['Build a project', 'Find study buddies'],
    photoUrl: 'https://picsum.photos/seed/leo/400/600',
    normalizedBioKeywords: normalizeAndTokenize('Avid coder and robotics fan. Looking for teammates for the upcoming local hackathon. I love building apps.'),
    mutualInterests: 3
  },
  {
    id: 'u3',
    firstName: 'Maya',
    age: 16,
    gender: 'Female',
    location: 'San Francisco, CA',
    bio: 'Art and design enthusiast. I love exploring new mediums and digital painting. Working on UI/UX for a coding app.',
    interests: ['Art', 'Design', 'Photography'],
    goals: ['Just chat', 'Find study buddies'],
    photoUrl: 'https://picsum.photos/seed/maya/400/600',
    normalizedBioKeywords: normalizeAndTokenize('Art and design enthusiast. I love exploring new mediums and digital painting. Working on UI/UX for a coding app.'),
    mutualInterests: 2
  },
  {
    id: 'u4',
    firstName: 'Chloe',
    age: 15,
    gender: 'Female',
    location: 'Austin, TX',
    instagramUsername: 'chloe_maths',
    bio: 'Math is my favorite subject. Looking for a study partner for advanced calculus and programming.',
    interests: ['Math', 'Science', 'Chess'],
    goals: ['Find study buddies'],
    photoUrl: 'https://picsum.photos/seed/chloe/400/600',
    normalizedBioKeywords: normalizeAndTokenize('Math is my favorite subject. Looking for a study partner for advanced calculus and programming.'),
    mutualInterests: 2
  }
];
