import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PhotoGrid, ProfileButton, LibraryDropdown, LoadingState } from '../components';
import { colors, spacing, commonStyles } from '../theme';
import { Photo, RootStackParamList, photoToSerializable } from '../types';
import { groupPhotosByDate } from '../utils/photoUtils';
import { useAuth } from '../context/AuthContext';
import { getPhotosFromLibrary, convertJellyfinPhotosToPhotos, PhotosResult } from '../services/jellyfinService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PAGE_SIZE = 1000;

export const PhotosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedServer, selectedLibrary, user, authToken } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPhotos = useCallback(async (isRefresh: boolean = false) => {
    if (!selectedServer) {
      setLoading(false);
      setError('No server selected');
      return;
    }

    if (!selectedLibrary) {
      setLoading(false);
      setError('No library selected');
      return;
    }

    if (!user || !authToken) {
      setLoading(false);
      setError('Not authenticated');
      return;
    }

    try {
      setError(null);
      const result = await getPhotosFromLibrary(selectedServer, user.Id, authToken, selectedLibrary.Id, 0, PAGE_SIZE);
      const fetchedPhotos = convertJellyfinPhotosToPhotos(result.photos, selectedServer, authToken);

      setPhotos(fetchedPhotos);
      setHasMore(result.hasMore);
      setTotalCount(result.totalSize);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedServer, selectedLibrary, user, authToken]);

  const loadMorePhotos = useCallback(async () => {
    if (!hasMore || loadingMore || !selectedServer || !selectedLibrary || !user || !authToken) return;

    setLoadingMore(true);
    try {
      const start = photos.length;
      const result = await getPhotosFromLibrary(selectedServer, user.Id, authToken, selectedLibrary.Id, start, PAGE_SIZE);
      const newPhotos = convertJellyfinPhotosToPhotos(result.photos, selectedServer, authToken);
      setPhotos(prev => [...prev, ...newPhotos]);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Failed to load more photos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, photos.length, selectedServer, selectedLibrary, user, authToken]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Memoize photoGroups to prevent unnecessary recalculations
  // This helps maintain scroll position when loading more photos
  const photoGroups = useMemo(() => {
    return groupPhotosByDate(photos);
  }, [photos]);

  const handlePhotoPress = useCallback(
    (photo: Photo, allPhotos: Photo[], index: number) => {
      navigation.navigate('PhotoViewer', {
        photo: photoToSerializable(photo),
        photos: allPhotos.map(photoToSerializable),
        initialIndex: index,
      });
    },
    [navigation]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchPhotos(true);
  }, [fetchPhotos]);

  const handleEndReached = useCallback(() => {
    loadMorePhotos();
  }, [loadMorePhotos]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <LibraryDropdown />
        <ProfileButton />
      </View>
    </View>
  );

  if (loading || error) {
    return (
      <LoadingState
        loading={loading}
        error={error}
        loadingText="Loading photos..."
        header={renderHeader()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleContainer}>
            <LibraryDropdown />
            <Text style={styles.photoCount}>{photos.length}{totalCount > photos.length ? ` of ${totalCount}` : ''} photos</Text>
          </View>
          <ProfileButton />
        </View>
      </View>
      {photos.length === 0 ? (
        <LoadingState
          empty={true}
          emptyText="No photos found"
          emptyHint="This library doesn't have any photos"
        />
      ) : (
        <PhotoGrid
          photoGroups={photoGroups}
          onPhotoPress={handlePhotoPress}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleEndReached}
          loadingMore={loadingMore}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: commonStyles.container,
  header: commonStyles.header,
  headerRow: commonStyles.headerRow,
  headerTitleContainer: commonStyles.headerTitleContainer,
  photoCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

