import {
  normalizeDate,
  formatDate,
  groupPhotosByDate,
  formatDuration,
  formatFileSize,
} from '../../src/utils/photoUtils';
import { Photo } from '../../src/types';

describe('photoUtils', () => {
  describe('normalizeDate', () => {
    it('should normalize a date to midnight', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45);
      const normalized = normalizeDate(date);

      expect(normalized.getHours()).toBe(0);
      expect(normalized.getMinutes()).toBe(0);
      expect(normalized.getSeconds()).toBe(0);
      expect(normalized.getMilliseconds()).toBe(0);
    });

    it('should preserve the year, month, and day', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45);
      const normalized = normalizeDate(date);

      expect(normalized.getFullYear()).toBe(2024);
      expect(normalized.getMonth()).toBe(5);
      expect(normalized.getDate()).toBe(15);
    });

    it('should return a new Date object', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45);
      const normalized = normalizeDate(date);

      expect(normalized).not.toBe(date);
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "Today" for today\'s date', () => {
      const now = new Date(2024, 5, 15, 12, 0, 0);
      jest.setSystemTime(now);

      const today = new Date(2024, 5, 15, 8, 30, 0);
      expect(formatDate(today)).toBe('Today');
    });

    it('should return "Yesterday" for yesterday\'s date', () => {
      const now = new Date(2024, 5, 15, 12, 0, 0);
      jest.setSystemTime(now);

      const yesterday = new Date(2024, 5, 14, 8, 30, 0);
      expect(formatDate(yesterday)).toBe('Yesterday');
    });

    it('should return formatted date for same year', () => {
      const now = new Date(2024, 5, 15, 12, 0, 0);
      jest.setSystemTime(now);

      const date = new Date(2024, 2, 10, 8, 30, 0);
      expect(formatDate(date)).toBe('March 10');
    });

    it('should include year for different year', () => {
      const now = new Date(2024, 5, 15, 12, 0, 0);
      jest.setSystemTime(now);

      const date = new Date(2023, 2, 10, 8, 30, 0);
      expect(formatDate(date)).toBe('March 10, 2023');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(5)).toBe('0:05');
      expect(formatDuration(59)).toBe('0:59');
    });

    it('should format minutes and seconds correctly', () => {
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(125)).toBe('2:05');
    });

    it('should handle large durations', () => {
      expect(formatDuration(3600)).toBe('60:00');
      expect(formatDuration(3661)).toBe('61:01');
    });

    it('should handle decimal seconds', () => {
      expect(formatDuration(65.7)).toBe('1:05');
    });
  });

  describe('formatFileSize', () => {
    it('should return "0 Bytes" for zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });

    it('should format gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('groupPhotosByDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 5, 15, 12, 0, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const createPhoto = (id: string, createdAt: Date): Photo => ({
      id,
      uri: `https://example.com/${id}.jpg`,
      filename: `${id}.jpg`,
      width: 1920,
      height: 1080,
      createdAt,
      mediaType: 'photo',
    });

    it('should return empty array for empty input', () => {
      expect(groupPhotosByDate([])).toEqual([]);
    });

    it('should group photos by date', () => {
      const photos = [
        createPhoto('1', new Date(2024, 5, 15, 10, 0, 0)),
        createPhoto('2', new Date(2024, 5, 15, 14, 0, 0)),
        createPhoto('3', new Date(2024, 5, 14, 10, 0, 0)),
      ];

      const groups = groupPhotosByDate(photos);

      expect(groups).toHaveLength(2);
      expect(groups[0].title).toBe('Today');
      expect(groups[0].photos).toHaveLength(2);
      expect(groups[1].title).toBe('Yesterday');
      expect(groups[1].photos).toHaveLength(1);
    });
  });
});

