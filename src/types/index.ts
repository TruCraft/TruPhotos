export interface Photo {
  id: string;
  uri: string;
  fullUri?: string; // Full resolution URL for downloading
  filename: string;
  filePath?: string; // Full file path on the server
  width: number;
  height: number;
  createdAt: Date;
  modifiedAt?: Date;
  mediaType: 'photo' | 'video';
  duration?: number;
  albumId?: string;
  rating?: number; // User rating from 0-10 (10 = favorite)
  title?: string; // Photo title from Jellyfin
  // File metadata from Jellyfin
  fileSize?: number; // File size in bytes
  format?: string; // File format (e.g., "jpeg", "png", "mp4")
  aspectRatio?: number; // Aspect ratio (e.g., 1.33, 1.78)
}

export interface Album {
  id: string;
  title: string;
  coverPhoto?: Photo;
  photoCount: number;
  createdAt: Date;
  sortName?: string; // Custom sort order from Jellyfin
}

export interface PhotoGroup {
  title: string;
  date: Date;
  photos: Photo[];
}

export interface ServerConfig {
  url: string;
  token?: string;
  name: string;
}

// Jellyfin Authentication Types
export interface JellyfinUser {
  Id: string;
  Name: string;
  ServerId: string;
  ServerName?: string;
  PrimaryImageTag?: string;
  HasPassword: boolean;
  HasConfiguredPassword: boolean;
  LastLoginDate?: string;
  LastActivityDate?: string;
  Policy?: {
    IsAdministrator: boolean;
    IsHidden: boolean;
    IsDisabled: boolean;
    EnableAllFolders: boolean;
  };
}

export interface JellyfinAuthResponse {
  User: JellyfinUser;
  AccessToken: string;
  ServerId: string;
}

export interface JellyfinServer {
  name: string;
  address: string;
  id: string;
  version?: string;
  accessToken?: string;
}

export interface JellyfinLibrary {
  Id: string;
  Name: string;
  CollectionType?: string;
  ItemId?: string;
}

export interface JellyfinAlbum {
  Id: string;
  Name: string;
  Type: string;
  ImageTags?: {
    Primary?: string;
  };
  DateCreated?: string;
  ChildCount?: number;
  SortName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: JellyfinUser | null;
  servers: JellyfinServer[];
  authToken: string | null;
  selectedServer: JellyfinServer | null;
  selectedLibrary: JellyfinLibrary | null;
  libraries: JellyfinLibrary[];
  selectedTab: keyof RootTabParamList;
}

export type RootTabParamList = {
  Timeline: undefined;
  Library: undefined;
};

// Serializable version of Photo for navigation params (Date -> string)
export interface SerializablePhoto extends Omit<Photo, 'createdAt' | 'modifiedAt'> {
  createdAt: string; // ISO string
  modifiedAt?: string; // ISO string
}

export type RootStackParamList = {
  Main: { screen?: 'Timeline' | 'Library' } | undefined;
  Login: undefined;
  ServerSelection: undefined;
  LibrarySelection: undefined;
  ProfileOptions: undefined;
  About: undefined;
  Markdown: { title: string; content: string };
  PhotoViewer: { photo: SerializablePhoto; photos: SerializablePhoto[]; initialIndex: number };
  AlbumDetail: {
    albumId: string;
    albumTitle: string;
    breadcrumb?: string; // Breadcrumb path like "2009 / May"
    breadcrumbHistory?: Array<{
      title: string;
      albumId?: string;
      isLibrary?: boolean; // True if this is the library root
    }>; // History of breadcrumb items for navigation
  };
};


// Helper functions to convert between Photo and SerializablePhoto
export function photoToSerializable(photo: Photo): SerializablePhoto {
  // Validate dates before serialization
  const createdAt = photo.createdAt instanceof Date && !isNaN(photo.createdAt.getTime())
    ? photo.createdAt.toISOString()
    : new Date().toISOString(); // Fallback to current date if invalid

  const modifiedAt = photo.modifiedAt instanceof Date && !isNaN(photo.modifiedAt.getTime())
    ? photo.modifiedAt.toISOString()
    : undefined;

  return {
    ...photo,
    createdAt,
    modifiedAt,
  };
}

export function serializableToPhoto(serializable: SerializablePhoto): Photo {
  return {
    ...serializable,
    createdAt: new Date(serializable.createdAt),
    modifiedAt: serializable.modifiedAt ? new Date(serializable.modifiedAt) : undefined,
  };
}

