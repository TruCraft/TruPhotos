import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  AuthState,
  JellyfinUser,
  JellyfinServer,
  JellyfinLibrary,
} from '../types';
import {
  authenticateByName,
  getUser,
  SecureStorage,
} from '../services/authService';
import { getPhotoLibraries } from '../services/jellyfinService';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'jellyfin_auth_token',
  USER: 'jellyfin_user',
  SELECTED_SERVER: 'jellyfin_selected_server',
  SELECTED_LIBRARY: 'jellyfin_selected_library',
  SELECTED_TAB: 'jellyfin_selected_tab',
};

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  servers: [],
  authToken: null,
  selectedServer: null,
  selectedLibrary: null,
  libraries: [],
  selectedTab: 'Timeline',
};

interface AuthContextType extends AuthState {
  login: (serverAddress: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectServer: (server: JellyfinServer) => Promise<void>;
  clearServer: () => Promise<void>;
  selectLibrary: (library: JellyfinLibrary) => Promise<void>;
  clearLibrary: () => Promise<void>;
  refreshLibraries: () => Promise<void>;
  setSelectedTab: (tab: 'Timeline' | 'Library') => Promise<void>;
  addServer: (server: JellyfinServer) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Load saved auth state on mount
  useEffect(() => {
    loadSavedAuth();
  }, []);

  const loadSavedAuth = async () => {
    try {
      const [authToken, userJson, serverJson, libraryJson, savedTab] = await Promise.all([
        SecureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        SecureStorage.getItem(STORAGE_KEYS.USER),
        SecureStorage.getItem(STORAGE_KEYS.SELECTED_SERVER),
        SecureStorage.getItem(STORAGE_KEYS.SELECTED_LIBRARY),
        SecureStorage.getItem(STORAGE_KEYS.SELECTED_TAB),
      ]);

      if (authToken && userJson && serverJson) {
        const user: JellyfinUser = JSON.parse(userJson);
        const selectedServer: JellyfinServer = JSON.parse(serverJson);
        const selectedLibrary: JellyfinLibrary | null = libraryJson ? JSON.parse(libraryJson) : null;
        const selectedTab: 'Timeline' | 'Library' = (savedTab === 'Timeline' || savedTab === 'Library') ? savedTab : 'Timeline';

        // Fetch libraries if we have a server
        let libraries: JellyfinLibrary[] = [];
        if (selectedServer && user) {
          try {
            libraries = await getPhotoLibraries(selectedServer, user.Id, authToken);
          } catch (e) {
            console.error('Failed to fetch libraries:', e);
          }
        }

        setState({
          isAuthenticated: true,
          isLoading: false,
          user,
          servers: [selectedServer],
          authToken,
          selectedServer,
          selectedLibrary,
          libraries,
          selectedTab,
        });
      } else {
        setState({ ...initialState, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load saved auth:', error);
      setState({ ...initialState, isLoading: false });
    }
  };

  const login = useCallback(async (serverAddress: string, username: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Authenticate with Jellyfin server
      const authResponse = await authenticateByName(serverAddress, username, password);

      const server: JellyfinServer = {
        name: authResponse.User.ServerName || 'Jellyfin Server',
        address: serverAddress,
        id: authResponse.ServerId,
        accessToken: authResponse.AccessToken,
      };

      // Save to secure storage
      await Promise.all([
        SecureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.AccessToken),
        SecureStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authResponse.User)),
        SecureStorage.setItem(STORAGE_KEYS.SELECTED_SERVER, JSON.stringify(server)),
      ]);

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false,
        user: authResponse.User,
        servers: [server],
        authToken: authResponse.AccessToken,
        selectedServer: server,
      }));
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([
      SecureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      SecureStorage.removeItem(STORAGE_KEYS.USER),
      SecureStorage.removeItem(STORAGE_KEYS.SELECTED_SERVER),
      SecureStorage.removeItem(STORAGE_KEYS.SELECTED_LIBRARY),
    ]);
    setState({ ...initialState, isLoading: false });
  }, []);

  const addServer = useCallback(async (server: JellyfinServer) => {
    setState(prev => ({
      ...prev,
      servers: [...prev.servers, server],
    }));
  }, []);

  const selectServer = useCallback(async (server: JellyfinServer) => {
    if (!state.user || !state.authToken) throw new Error('Not authenticated');

    // Fetch libraries for the new server FIRST to verify connection works
    const libraries = await getPhotoLibraries(server, state.user.Id, state.authToken);

    // Only save server selection after successful connection
    await SecureStorage.setItem(STORAGE_KEYS.SELECTED_SERVER, JSON.stringify(server));
    // Clear library when server changes
    await SecureStorage.removeItem(STORAGE_KEYS.SELECTED_LIBRARY);

    setState(prev => ({ ...prev, selectedServer: server, selectedLibrary: null, libraries }));
  }, [state.user, state.authToken]);

  const selectLibrary = useCallback(async (library: JellyfinLibrary) => {
    await SecureStorage.setItem(STORAGE_KEYS.SELECTED_LIBRARY, JSON.stringify(library));
    setState(prev => ({ ...prev, selectedLibrary: library }));
  }, []);

  const clearLibrary = useCallback(async () => {
    await SecureStorage.removeItem(STORAGE_KEYS.SELECTED_LIBRARY);
    setState(prev => ({ ...prev, selectedLibrary: null }));
  }, []);

  const clearServer = useCallback(async () => {
    await SecureStorage.removeItem(STORAGE_KEYS.SELECTED_SERVER);
    await SecureStorage.removeItem(STORAGE_KEYS.SELECTED_LIBRARY);
    setState(prev => ({ ...prev, selectedServer: null, selectedLibrary: null, libraries: [] }));
  }, []);

  const refreshLibraries = useCallback(async () => {
    if (!state.selectedServer || !state.user || !state.authToken) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const libraries = await getPhotoLibraries(state.selectedServer, state.user.Id, state.authToken);
      setState(prev => ({ ...prev, libraries, isLoading: false }));
    } catch (error) {
      console.error('Failed to refresh libraries:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.selectedServer, state.user, state.authToken]);

  const setSelectedTab = useCallback(async (tab: 'Timeline' | 'Library') => {
    await SecureStorage.setItem(STORAGE_KEYS.SELECTED_TAB, tab);
    setState(prev => ({ ...prev, selectedTab: tab }));
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    selectServer,
    clearServer,
    selectLibrary,
    clearLibrary,
    refreshLibraries,
    setSelectedTab,
    addServer,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

