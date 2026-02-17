import {
  photoToSerializable,
  serializableToPhoto,
  Photo,
  SerializablePhoto,
} from '../../src/types';

describe('types helpers', () => {
  describe('photoToSerializable', () => {
    const createPhoto = (overrides: Partial<Photo> = {}): Photo => ({
      id: 'test-id',
      uri: 'https://example.com/photo.jpg',
      filename: 'photo.jpg',
      width: 1920,
      height: 1080,
      createdAt: new Date('2024-06-15T10:30:00.000Z'),
      mediaType: 'photo',
      ...overrides,
    });

    it('should convert Photo to SerializablePhoto', () => {
      const photo = createPhoto();
      const serializable = photoToSerializable(photo);

      expect(serializable.id).toBe(photo.id);
      expect(serializable.uri).toBe(photo.uri);
      expect(serializable.filename).toBe(photo.filename);
      expect(serializable.createdAt).toBe('2024-06-15T10:30:00.000Z');
      expect(typeof serializable.createdAt).toBe('string');
    });

    it('should convert modifiedAt to ISO string', () => {
      const photo = createPhoto({
        modifiedAt: new Date('2024-06-16T14:00:00.000Z'),
      });
      const serializable = photoToSerializable(photo);

      expect(serializable.modifiedAt).toBe('2024-06-16T14:00:00.000Z');
    });

    it('should handle undefined modifiedAt', () => {
      const photo = createPhoto();
      const serializable = photoToSerializable(photo);

      expect(serializable.modifiedAt).toBeUndefined();
    });

    it('should handle invalid createdAt date with fallback', () => {
      const photo = createPhoto({
        createdAt: new Date('invalid'),
      });
      const serializable = photoToSerializable(photo);

      // Should fallback to current date (a valid ISO string)
      expect(serializable.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should handle invalid modifiedAt date', () => {
      const photo = createPhoto({
        modifiedAt: new Date('invalid'),
      });
      const serializable = photoToSerializable(photo);

      expect(serializable.modifiedAt).toBeUndefined();
    });

    it('should preserve all other properties', () => {
      const photo = createPhoto({
        fullUri: 'https://example.com/full.jpg',
        filePath: '/path/to/photo.jpg',
        duration: 120,
        albumId: 'album-1',
        rating: 8,
        title: 'My Photo',
        fileSize: 1024000,
        format: 'jpeg',
        aspectRatio: 1.78,
      });
      const serializable = photoToSerializable(photo);

      expect(serializable.fullUri).toBe(photo.fullUri);
      expect(serializable.filePath).toBe(photo.filePath);
      expect(serializable.duration).toBe(photo.duration);
      expect(serializable.albumId).toBe(photo.albumId);
      expect(serializable.rating).toBe(photo.rating);
      expect(serializable.title).toBe(photo.title);
      expect(serializable.fileSize).toBe(photo.fileSize);
      expect(serializable.format).toBe(photo.format);
      expect(serializable.aspectRatio).toBe(photo.aspectRatio);
    });
  });

  describe('serializableToPhoto', () => {
    const createSerializablePhoto = (
      overrides: Partial<SerializablePhoto> = {}
    ): SerializablePhoto => ({
      id: 'test-id',
      uri: 'https://example.com/photo.jpg',
      filename: 'photo.jpg',
      width: 1920,
      height: 1080,
      createdAt: '2024-06-15T10:30:00.000Z',
      mediaType: 'photo',
      ...overrides,
    });

    it('should convert SerializablePhoto to Photo', () => {
      const serializable = createSerializablePhoto();
      const photo = serializableToPhoto(serializable);

      expect(photo.id).toBe(serializable.id);
      expect(photo.uri).toBe(serializable.uri);
      expect(photo.createdAt).toBeInstanceOf(Date);
      expect(photo.createdAt.toISOString()).toBe('2024-06-15T10:30:00.000Z');
    });

    it('should convert modifiedAt to Date', () => {
      const serializable = createSerializablePhoto({
        modifiedAt: '2024-06-16T14:00:00.000Z',
      });
      const photo = serializableToPhoto(serializable);

      expect(photo.modifiedAt).toBeInstanceOf(Date);
      expect(photo.modifiedAt?.toISOString()).toBe('2024-06-16T14:00:00.000Z');
    });

    it('should handle undefined modifiedAt', () => {
      const serializable = createSerializablePhoto();
      const photo = serializableToPhoto(serializable);

      expect(photo.modifiedAt).toBeUndefined();
    });

    it('should be reversible with photoToSerializable', () => {
      const original: Photo = {
        id: 'test-id',
        uri: 'https://example.com/photo.jpg',
        filename: 'photo.jpg',
        width: 1920,
        height: 1080,
        createdAt: new Date('2024-06-15T10:30:00.000Z'),
        modifiedAt: new Date('2024-06-16T14:00:00.000Z'),
        mediaType: 'video',
        duration: 120,
      };

      const serializable = photoToSerializable(original);
      const restored = serializableToPhoto(serializable);

      expect(restored.id).toBe(original.id);
      expect(restored.createdAt.getTime()).toBe(original.createdAt.getTime());
      expect(restored.modifiedAt?.getTime()).toBe(original.modifiedAt?.getTime());
      expect(restored.mediaType).toBe(original.mediaType);
      expect(restored.duration).toBe(original.duration);
    });
  });
});

