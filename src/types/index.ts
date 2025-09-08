export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: Date;
  parentIds: string[];
  createdAt: Date;
}

export interface FeedingEntry {
  id: string;
  childId: string;
  userId: string;
  date: Date;
  time: string;
  feedingType: 'bottle' | 'breast';
  // Bottle feeding fields
  amountMl?: number;
  // Breast feeding fields
  leftBreastMinutes?: number;
  rightBreastMinutes?: number;
  // Optional fields
  notes?: string;
  spitUp: boolean;
  peed: boolean;
  pooped: boolean;
  createdAt: Date;
}

export interface AppState {
  currentUser: User | null;
  children: Child[];
  feedingEntries: FeedingEntry[];
  selectedChild: Child | null;
}