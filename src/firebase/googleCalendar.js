// Google Calendar Integration
// This file handles creating, updating, and deleting events in Google Calendar

const GOOGLE_CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3';
const TOKEN_STORAGE_KEY = 'google_calendar_tokens';
const CLIENT_CONFIG_KEY = 'google_calendar_client_config';

// Tokens and client config
let accessToken = null;
let refreshToken = null;
let clientId = null;
let clientSecret = null;

// Load tokens from localStorage
const loadTokensFromStorage = () => {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      const tokens = JSON.parse(stored);
      accessToken = tokens.access_token;
      refreshToken = tokens.refresh_token;
      return true;
    }
  } catch (error) {
    console.error('Error loading tokens from storage:', error);
  }
  return false;
};

// Save tokens to localStorage
const saveTokensToStorage = (tokens) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken,
      expires_at: tokens.expires_at || (Date.now() + (tokens.expires_in * 1000))
    }));
    accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      refreshToken = tokens.refresh_token;
    }
  } catch (error) {
    console.error('Error saving tokens to storage:', error);
  }
};

// Load client config from localStorage
const loadClientConfig = () => {
  try {
    const stored = localStorage.getItem(CLIENT_CONFIG_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      clientId = config.client_id;
      clientSecret = config.client_secret;
      return true;
    }
  } catch (error) {
    console.error('Error loading client config:', error);
  }
  return false;
};

// Save client config to localStorage
const saveClientConfig = (config) => {
  try {
    localStorage.setItem(CLIENT_CONFIG_KEY, JSON.stringify({
      client_id: config.client_id,
      client_secret: config.client_secret
    }));
    clientId = config.client_id;
    clientSecret = config.client_secret;
  } catch (error) {
    console.error('Error saving client config:', error);
  }
};

// Initialize with tokens and client config (call this once after OAuth setup)
export const initializeCalendar = (tokens, clientConfig = null) => {
  if (clientConfig) {
    saveClientConfig(clientConfig);
  } else {
    loadClientConfig();
  }
  
  if (tokens) {
    saveTokensToStorage(tokens);
  } else {
    loadTokensFromStorage();
  }
};

// Refresh access token using refresh token
const refreshAccessToken = async () => {
  if (!refreshToken) {
    console.error('No refresh token available. Please re-authenticate.');
    return false;
  }

  if (!clientId || !clientSecret) {
    console.error('Client ID or Secret not configured. Cannot refresh token.');
    return false;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Error refreshing token');
    }

    const data = await response.json();
    
    // Save new tokens (refresh token remains the same)
    saveTokensToStorage({
      access_token: data.access_token,
      refresh_token: refreshToken, // Keep existing refresh token
      expires_in: data.expires_in
    });

    console.log('✅ Token refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return false;
  }
};

// Check if token is expired or about to expire (within 5 minutes)
const isTokenExpired = () => {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      const tokens = JSON.parse(stored);
      if (tokens.expires_at) {
        // Check if token expires within 5 minutes
        return Date.now() >= (tokens.expires_at - 5 * 60 * 1000);
      }
    }
  } catch (error) {
    // If we can't check, assume it might be expired
    return true;
  }
  return false;
};

// Make API request with automatic token refresh
const makeCalendarRequest = async (url, options = {}) => {
  // Ensure tokens are loaded
  if (!accessToken) {
    const loaded = loadTokensFromStorage();
    if (!loaded || !accessToken) {
      throw new Error('Google Calendar not initialized. Please set up OAuth tokens.');
    }
  }

  // Ensure client config is loaded
  if (!clientId || !clientSecret) {
    loadClientConfig();
  }

  // Check if token needs refresh before making request
  if (isTokenExpired()) {
    console.log('🔄 Token expired or about to expire, refreshing...');
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new Error('Failed to refresh access token. Please re-authenticate.');
    }
  }

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    ...options.headers
  };

  let response = await fetch(url, {
    ...options,
    headers
  });

  // If unauthorized, try refreshing token once
  if (response.status === 401) {
    console.log('🔄 Received 401, refreshing token and retrying...');
    const refreshed = await refreshAccessToken();
    
    if (refreshed) {
      // Retry request with new token
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, {
        ...options,
        headers
      });
    } else {
      throw new Error('Failed to refresh access token after 401. Please re-authenticate.');
    }
  }

  return response;
};

// Helper: Extract minutes from duration string (e.g., "50 min" -> 50)
const extractMinutesFromDuration = (durationString) => {
  if (!durationString) return 50; // Default 50 minutes
  const match = durationString.match(/(\d+)\s*min/);
  return match ? parseInt(match[1], 10) : 50;
};

// Helper: Calculate end time based on service duration
const getEndTime = (startTime, servicio, serviciosList = []) => {
  // Try to find the service in the list to get its actual duration
  let duration = 50; // Default duration: 50 minutes
  
  if (servicio && serviciosList.length > 0) {
    const service = serviciosList.find(s => s.nombre === servicio);
    if (service && service.duracion) {
      duration = extractMinutesFromDuration(service.duracion);
    }
  }
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Create a calendar event for a reservation
export const createCalendarEvent = async (reservation, serviciosList = []) => {
  // Ensure tokens are loaded before making request
  if (!accessToken) {
    const loaded = loadTokensFromStorage();
    if (!loaded || !accessToken) {
      console.error('Google Calendar not initialized. Please set up OAuth tokens.');
      console.error('Visit /setup-calendar.html to configure Google Calendar.');
      return null;
    }
  }

  // Ensure client config is loaded
  if (!clientId || !clientSecret) {
    loadClientConfig();
  }

  try {
    const startDateTime = `${reservation.fecha}T${reservation.hora}:00`;
    const endTime = getEndTime(reservation.hora, reservation.servicio, serviciosList);
    const endDateTime = `${reservation.fecha}T${endTime}:00`;

    const event = {
      summary: `Cita: ${reservation.nombre} - ${reservation.servicio}`,
      description: `Cliente: ${reservation.nombre}\nTeléfono: ${reservation.telefono}\nEmail: ${reservation.email}\nCódigo de reserva: ${reservation.code}\n${reservation.notas ? `Notas: ${reservation.notas}` : ''}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Madrid',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 60 }, // 1 hora antes
        ],
      },
    };

    const response = await makeCalendarRequest(
      `${GOOGLE_CALENDAR_API_URL}/calendars/primary/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error creating calendar event');
    }

    const eventData = await response.json();
    return eventData.id; // Return event ID to store in reservation
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};

// Update a calendar event
export const updateCalendarEvent = async (eventId, reservation, serviciosList = []) => {
  // Ensure tokens are loaded before making request
  if (!accessToken) {
    const loaded = loadTokensFromStorage();
    if (!loaded || !accessToken) {
      console.error('Google Calendar not initialized.');
      return false;
    }
  }

  // Ensure client config is loaded
  if (!clientId || !clientSecret) {
    loadClientConfig();
  }

  try {
    const startDateTime = `${reservation.fecha}T${reservation.hora}:00`;
    const endTime = getEndTime(reservation.hora, reservation.servicio, serviciosList);
    const endDateTime = `${reservation.fecha}T${endTime}:00`;

    const event = {
      summary: `Cita: ${reservation.nombre} - ${reservation.servicio}`,
      description: `Cliente: ${reservation.nombre}\nTeléfono: ${reservation.telefono}\nEmail: ${reservation.email}\nCódigo de reserva: ${reservation.code}\n${reservation.notas ? `Notas: ${reservation.notas}` : ''}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Madrid',
      },
    };

    const response = await makeCalendarRequest(
      `${GOOGLE_CALENDAR_API_URL}/calendars/primary/events/${eventId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error updating calendar event');
    }

    return true;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    throw error;
  }
};

// Delete a calendar event
export const deleteCalendarEvent = async (eventId) => {
  if (!accessToken) {
    console.error('Google Calendar not initialized.');
    return false;
  }

  try {
    const response = await makeCalendarRequest(
      `${GOOGLE_CALENDAR_API_URL}/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok && response.status !== 404) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error deleting calendar event');
    }

    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    throw error;
  }
};

