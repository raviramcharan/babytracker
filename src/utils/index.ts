import { FeedingEntry } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function sortFeedingEntries(entries: FeedingEntry[]): FeedingEntry[] {
  return [...entries].sort((a, b) => {
    const aDateTime = new Date(`${a.date.toDateString()} ${a.time}`);
    const bDateTime = new Date(`${b.date.toDateString()} ${b.time}`);
    return bDateTime.getTime() - aDateTime.getTime();
  });
}