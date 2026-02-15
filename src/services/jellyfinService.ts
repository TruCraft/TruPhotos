import { JellyfinServer, Photo, Album, JellyfinAlbum, JellyfinLibrary } from '../types';

export interface JellyfinPhotoItem {
  Id: string;
  Name: string;
  Type: string;
  ImageTags?: {
    Primary?: string;
  };
  PremiereDate?: string;
  DateCreated?: string;
  UserData?: {
    Rating?: number;
    IsFavorite?: boolean;
    PlaybackPositionTicks?: number;
  };
  Width?: number;
  Height?: number;
  MediaType?: string;
  RunTimeTicks?: number;
  Path?: string;
  MediaSources?: Array<{
    Path: string;
    Size?: number;
  }>;
}

// Fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Build Jellyfin API headers
function getJellyfinHeaders(authToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Emby-Authorization': `MediaBrowser Client="TruPhotos", Device="Mobile", DeviceId="truphotos-mobile", Version="1.0.0"`,
  };
  
  if (authToken) {
    headers['X-Emby-Token'] = authToken;
  }
  
  return headers;
}

// Test if a Jellyfin server is accessible
export async function testServerConnection(
  server: JellyfinServer,
  timeoutMs: number = 5000
): Promise<boolean> {
  try {
    const url = `${server.address}/System/Info/Public`;
    const response = await fetchWithTimeout(url, {
      headers: getJellyfinHeaders(),
    }, timeoutMs);

    return response.ok;
  } catch (error) {
    return false;
  }
}

// Fetch photo libraries from a Jellyfin server
export async function getPhotoLibraries(
  server: JellyfinServer,
  userId: string,
  token: string
): Promise<JellyfinLibrary[]> {
  try {
    const url = `${server.address}/Users/${userId}/Views`;
    console.log('[Jellyfin] Fetching libraries from:', url);
    const response = await fetchWithTimeout(url, {
      headers: getJellyfinHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch libraries: ${response.status}`);
    }

    const data = await response.json();
    const items = data.Items || [];

    console.log('[Jellyfin] Received libraries count:', items.length);
    console.log('[Jellyfin] All libraries:', items.map((i: any) => ({
      Name: i.Name,
      CollectionType: i.CollectionType,
      Id: i.Id
    })));

    // Filter to only photo/image libraries
    // In Jellyfin, photo libraries typically have CollectionType 'homevideos'
    // We need to further check the content type by looking at the library name
    // or by checking what types of items it contains
    const photoLibraries = items
      .filter((item: any) => {
        const collectionType = item.CollectionType?.toLowerCase();
        const name = item.Name?.toLowerCase();

        // Jellyfin uses 'homevideos' for both photos and home videos
        // We'll include all 'homevideos' libraries and let users choose
        if (collectionType === 'homevideos') {
          console.log('[Jellyfin] Found homevideos library:', item.Name);
          return true;
        }

        // Also check for explicit 'photos' type (in case some servers use it)
        if (collectionType === 'photos' || collectionType === 'photo') {
          console.log('[Jellyfin] Found photos library:', item.Name);
          return true;
        }

        // If no collection type is set, check if the name suggests it's a photo library
        if (!collectionType && (name?.includes('photo') || name?.includes('picture') || name?.includes('image'))) {
          console.log('[Jellyfin] Found potential photo library by name:', item.Name);
          return true;
        }

        return false;
      })
      .map((item: any) => ({
        Id: item.Id,
        Name: item.Name,
        CollectionType: item.CollectionType || 'photos',
        ItemId: item.Id,
      }));

    console.log('[Jellyfin] Filtered photo libraries count:', photoLibraries.length);
    console.log('[Jellyfin] Photo libraries:', photoLibraries);
    return photoLibraries;
  } catch (error) {
    console.error('[Jellyfin] Error fetching photo libraries:', error);
    throw error;
  }
}

// Result type for paginated photo fetching
export interface PhotosResult {
  photos: JellyfinPhotoItem[];
  totalSize: number;
  hasMore: boolean;
}

// Fetch photos from a specific library with pagination
export async function getPhotosFromLibrary(
  server: JellyfinServer,
  userId: string,
  token: string,
  libraryId: string,
  start: number = 0,
  limit: number = 1000
): Promise<PhotosResult> {
  try {
    const params = new URLSearchParams({
      ParentId: libraryId,
      IncludeItemTypes: 'Photo',
      Recursive: 'true',
      Fields: 'Path,MediaSources,DateCreated,PremiereDate',
      StartIndex: start.toString(),
      Limit: limit.toString(),
      SortBy: 'DateCreated,PremiereDate',
      SortOrder: 'Descending',
    });

    const url = `${server.address}/Users/${userId}/Items?${params.toString()}`;
    const response = await fetchWithTimeout(url, {
      headers: getJellyfinHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch photos: ${response.status}`);
    }

    const data = await response.json();
    const items = data.Items || [];
    const totalRecordCount = data.TotalRecordCount || 0;

    return {
      photos: items,
      totalSize: totalRecordCount,
      hasMore: start + items.length < totalRecordCount,
    };
  } catch (error) {
    console.error('Error fetching photos from library:', error);
    throw error;
  }
}

// Convert Jellyfin photo items to Photo objects
export function convertJellyfinPhotosToPhotos(
  items: JellyfinPhotoItem[],
  server: JellyfinServer,
  token: string
): Photo[] {
  return items.map(item => {
    const width = item.Width || 1920;
    const height = item.Height || 1080;
    const imageTag = item.ImageTags?.Primary;

    // Build image URL
    const thumbUri = imageTag
      ? `${server.address}/Items/${item.Id}/Images/Primary?maxWidth=800&tag=${imageTag}&api_key=${token}`
      : '';

    const fullUri = imageTag
      ? `${server.address}/Items/${item.Id}/Images/Primary?tag=${imageTag}&api_key=${token}`
      : '';

    // Parse date
    const dateStr = item.PremiereDate || item.DateCreated;
    const createdAt = dateStr ? new Date(dateStr) : new Date();

    return {
      id: item.Id,
      uri: thumbUri,
      fullUri: fullUri,
      filename: item.Name,
      filePath: item.Path,
      width,
      height,
      createdAt,
      mediaType: 'photo',
      rating: item.UserData?.IsFavorite ? 10 : item.UserData?.Rating,
      title: item.Name,
      fileSize: item.MediaSources?.[0]?.Size,
    };
  });
}

// Fetch albums/folders from a specific library
export async function getAlbumsFromLibrary(
  server: JellyfinServer,
  userId: string,
  token: string,
  libraryId: string
): Promise<JellyfinAlbum[]> {
  try {
    console.log('[Jellyfin] Fetching albums from library:', libraryId);

    // Try a simpler query first - just get items without filtering by type
    const params = new URLSearchParams({
      ParentId: libraryId,
      Recursive: 'false',
      StartIndex: '0',
      Limit: '50',
    });

    const url = `${server.address}/Users/${userId}/Items?${params.toString()}`;
    console.log('[Jellyfin] Albums URL:', url);

    const response = await fetchWithTimeout(url, {
      headers: getJellyfinHeaders(token),
    }, 30000); // Increase timeout to 30 seconds

    console.log('[Jellyfin] Albums response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Jellyfin] Albums fetch failed:', response.status, errorText);
      throw new Error(`Failed to fetch albums: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Jellyfin] Albums data received, count:', data.Items?.length || 0);
    console.log('[Jellyfin] Total items available:', data.TotalRecordCount || 0);
    console.log('[Jellyfin] First few items:', data.Items?.slice(0, 3).map((i: any) => ({
      Name: i.Name,
      Type: i.Type,
      IsFolder: i.IsFolder,
      Id: i.Id
    })));

    // Filter to only folders
    const folders = (data.Items || []).filter((item: any) => item.IsFolder === true);
    console.log('[Jellyfin] Filtered folders count:', folders.length);

    return folders;
  } catch (error) {
    console.error('[Jellyfin] Error fetching albums from library:', error);
    throw error;
  }
}

// Convert Jellyfin albums to Album objects
export function convertJellyfinAlbumsToAlbums(
  items: JellyfinAlbum[],
  server: JellyfinServer,
  token: string
): Album[] {
  return items.map(item => ({
    id: item.Id,
    title: item.Name,
    photoCount: item.ChildCount || 0,
    createdAt: item.DateCreated ? new Date(item.DateCreated) : new Date(),
    sortName: item.SortName,
  }));
}

// Mark photo as favorite
export async function markPhotoAsFavorite(
  server: JellyfinServer,
  userId: string,
  token: string,
  itemId: string,
  isFavorite: boolean
): Promise<boolean> {
  try {
    const url = `${server.address}/Users/${userId}/FavoriteItems/${itemId}`;
    const response = await fetchWithTimeout(url, {
      method: isFavorite ? 'POST' : 'DELETE',
      headers: getJellyfinHeaders(token),
    });

    return response.ok;
  } catch (error) {
    console.error('Error marking photo as favorite:', error);
    return false;
  }
}

// Result type for folder contents
export interface FolderContents {
  folders: JellyfinAlbum[];
  photos: JellyfinPhotoItem[];
}

// Fetch contents of a specific folder (returns both subfolders and photos)
export async function getFolderContents(
  server: JellyfinServer,
  userId: string,
  token: string,
  folderId: string
): Promise<FolderContents> {
  try {
    // Fetch subfolders
    const foldersParams = new URLSearchParams({
      ParentId: folderId,
      IncludeItemTypes: 'Folder,PhotoAlbum',
      Recursive: 'false',
      Fields: 'DateCreated,ChildCount',
      SortBy: 'SortName',
      SortOrder: 'Ascending',
    });

    const foldersUrl = `${server.address}/Users/${userId}/Items?${foldersParams.toString()}`;
    const foldersResponse = await fetchWithTimeout(foldersUrl, {
      headers: getJellyfinHeaders(token),
    });

    if (!foldersResponse.ok) {
      throw new Error(`Failed to fetch folders: ${foldersResponse.status}`);
    }

    const foldersData = await foldersResponse.json();
    const folders = foldersData.Items || [];

    // Fetch photos
    const photosParams = new URLSearchParams({
      ParentId: folderId,
      IncludeItemTypes: 'Photo',
      Recursive: 'false',
      Fields: 'Path,MediaSources,DateCreated,PremiereDate',
      SortBy: 'DateCreated,PremiereDate',
      SortOrder: 'Descending',
    });

    const photosUrl = `${server.address}/Users/${userId}/Items?${photosParams.toString()}`;
    const photosResponse = await fetchWithTimeout(photosUrl, {
      headers: getJellyfinHeaders(token),
    });

    if (!photosResponse.ok) {
      throw new Error(`Failed to fetch photos: ${photosResponse.status}`);
    }

    const photosData = await photosResponse.json();
    const photos = photosData.Items || [];

    return { folders, photos };
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw error;
  }
}

// Fetch all photos from all photo libraries
export async function getAllPhotos(
  server: JellyfinServer,
  userId: string,
  token: string
): Promise<Photo[]> {
  const libraries = await getPhotoLibraries(server, userId, token);
  const allPhotos: Photo[] = [];

  for (const library of libraries) {
    const result = await getPhotosFromLibrary(server, userId, token, library.Id);
    const photos = convertJellyfinPhotosToPhotos(result.photos, server, token);
    allPhotos.push(...photos);
  }

  // Sort by date, newest first
  allPhotos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return allPhotos;
}


