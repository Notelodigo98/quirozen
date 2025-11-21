// Configuración de Google Calendar
// IMPORTANTE: Reemplaza estos valores con los tokens que obtuviste en setup-calendar.html
// 
// Para obtener los tokens:
// 1. Abre http://localhost:5173/setup-calendar.html (o tu dominio/setup-calendar.html)
// 2. Ingresa tu Client ID y Client Secret de Google Cloud Console
// 3. Autoriza la aplicación
// 4. Los tokens se guardarán automáticamente en localStorage
// 5. También puedes configurarlos manualmente aquí (se guardarán en localStorage)

import { initializeCalendar } from '../firebase/googleCalendar';

// ⚠️ REEMPLAZA ESTOS VALORES CON TUS TOKENS REALES (solo la primera vez)
// Después de la primera configuración, los tokens se guardan automáticamente en localStorage
const CALENDAR_CONFIG = {
  access_token: 'TU_ACCESS_TOKEN_AQUI',
  refresh_token: 'TU_REFRESH_TOKEN_AQUI'
};

// ⚠️ REEMPLAZA CON TUS CREDENCIALES DE GOOGLE CLOUD CONSOLE
const CLIENT_CONFIG = {
  client_id: 'TU_CLIENT_ID_AQUI',
  client_secret: 'TU_CLIENT_SECRET_AQUI'
};

// Inicializar Google Calendar
// Si los tokens están configurados aquí, se guardarán en localStorage
// Si ya existen en localStorage, se cargarán automáticamente
const hasValidConfig = 
  CALENDAR_CONFIG.access_token && 
  CALENDAR_CONFIG.access_token !== 'TU_ACCESS_TOKEN_AQUI' &&
  CLIENT_CONFIG.client_id &&
  CLIENT_CONFIG.client_id !== 'TU_CLIENT_ID_AQUI';

if (hasValidConfig) {
  initializeCalendar(CALENDAR_CONFIG, CLIENT_CONFIG);
  console.log('✅ Google Calendar inicializado correctamente');
  console.log('✅ Los tokens se guardaron en localStorage y se renovarán automáticamente');
} else {
  // Intentar cargar desde localStorage
  const storedTokens = localStorage.getItem('google_calendar_tokens');
  const storedConfig = localStorage.getItem('google_calendar_client_config');
  
  if (storedTokens && storedConfig) {
    try {
      const tokens = JSON.parse(storedTokens);
      const config = JSON.parse(storedConfig);
      initializeCalendar(tokens, config);
      console.log('✅ Google Calendar cargado desde localStorage');
      console.log('✅ Los tokens se renovarán automáticamente cuando expiren');
    } catch (error) {
      console.warn('⚠️ Error cargando tokens desde localStorage:', error);
      console.warn('   Para configurarlo, visita: /setup-calendar.html');
    }
  } else {
    console.warn('⚠️ Google Calendar no configurado. Las reservas no se sincronizarán con Google Calendar.');
    console.warn('   Para configurarlo, visita: /setup-calendar.html');
  }
}

export default CALENDAR_CONFIG;

