import 'react-native-get-random-values';
import * as Keychain from 'react-native-keychain';
import { JellyfinUser, JellyfinServer, JellyfinAuthResponse } from '../types';

const APP_NAME = 'Tru Photos';
const APP_VERSION = '1.0.0';

// Secure storage keys
const STORAGE_KEYS = {
  CLIENT_ID: 'jellyfin_client_id',
  AUTH_TOKEN: 'jellyfin_auth_token',
  USER: 'jellyfin_user',
  SELECTED_SERVER: 'jellyfin_selected_server',
};

// Service name for keychain
const KEYCHAIN_SERVICE = 'com.truphotos';

// Helper functions for secure storage using react-native-keychain
async function getSecureItem(key: string): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: `${KEYCHAIN_SERVICE}.${key}` });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch {
    return null;
  }
}

async function setSecureItem(key: string, value: string): Promise<void> {
  await Keychain.setGenericPassword(key, value, { service: `${KEYCHAIN_SERVICE}.${key}` });
}

async function removeSecureItem(key: string): Promise<void> {
  await Keychain.resetGenericPassword({ service: `${KEYCHAIN_SERVICE}.${key}` });
}

// Generate UUID v4 using crypto.getRandomValues (polyfilled by react-native-get-random-values)
function generateUUID(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version (4) and variant (RFC4122)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Get or generate client identifier
export async function getClientIdentifier(): Promise<string> {
  let clientId = await getSecureItem(STORAGE_KEYS.CLIENT_ID);
  if (!clientId) {
    clientId = generateUUID();
    await setSecureItem(STORAGE_KEYS.CLIENT_ID, clientId);
  }
  return clientId;
}

// Build standard Jellyfin headers
function getJellyfinHeaders(authToken?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Emby-Authorization': `MediaBrowser Client="${APP_NAME}", Device="Mobile", DeviceId="truphotos-mobile", Version="${APP_VERSION}"`,
  };

  if (authToken) {
    headers['X-Emby-Token'] = authToken;
  }

  return headers;
}

// Authenticate with Jellyfin server using username and password
export async function authenticateByName(
  serverAddress: string,
  username: string,
  password: string
): Promise<JellyfinAuthResponse> {
  const headers = getJellyfinHeaders();

  const response = await fetch(`${serverAddress}/Users/AuthenticateByName`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      Username: username,
      Pw: password,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Jellyfin Auth: Failed to authenticate:', response.status, errorText);
    throw new Error(`Failed to authenticate: ${response.status}`);
  }

  const authResponse: JellyfinAuthResponse = await response.json();
  return authResponse;
}

// Get current user info
export async function getUser(serverAddress: string, authToken: string): Promise<JellyfinUser> {
  const headers = getJellyfinHeaders(authToken);

  // First get the current user ID
  const meResponse = await fetch(`${serverAddress}/Users/Me`, {
    method: 'GET',
    headers,
  });

  if (!meResponse.ok) {
    throw new Error(`Failed to get user: ${meResponse.status}`);
  }

  return meResponse.json();
}

// Get public server info (no auth required)
export async function getPublicServerInfo(serverAddress: string): Promise<any> {
  const response = await fetch(`${serverAddress}/System/Info/Public`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get server info: ${response.status}`);
  }

  return response.json();
}

// Export secure storage helpers for use in AuthContext
export const SecureStorage = {
  getItem: getSecureItem,
  setItem: setSecureItem,
  removeItem: removeSecureItem,
};
