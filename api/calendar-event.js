// Vercel Serverless Function para crear eventos en Google Calendar
// Esta función se ejecuta en el servidor de Vercel (gratis, sin tarjeta)

const { google } = require('googleapis');

// Tokens almacenados en variables de entorno de Vercel
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// Helper: Calcular hora de fin
const getEndTime = (startTime, durationMinutes = 50) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Helper: Extraer minutos de duración
const extractMinutes = (durationString) => {
  if (!durationString) return 50;
  const match = durationString.match(/(\d+)\s*min/);
  return match ? parseInt(match[1], 10) : 50;
};

module.exports = async function handler(req, res) {
  // Agregar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar que los tokens estén configurados
    const missingVars = [];
    if (!CLIENT_ID) missingVars.push('GOOGLE_CLIENT_ID');
    if (!CLIENT_SECRET) missingVars.push('GOOGLE_CLIENT_SECRET');
    if (!ACCESS_TOKEN) missingVars.push('GOOGLE_ACCESS_TOKEN');
    if (!REFRESH_TOKEN) missingVars.push('GOOGLE_REFRESH_TOKEN');
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return res.status(500).json({ 
        error: 'Google Calendar no configurado',
        missing: missingVars,
        message: 'Configura las siguientes variables de entorno en Vercel: ' + missingVars.join(', ')
      });
    }
    
    console.log('✅ All environment variables are set');
    console.log('CLIENT_ID exists:', !!CLIENT_ID);
    console.log('ACCESS_TOKEN exists:', !!ACCESS_TOKEN);
    console.log('REFRESH_TOKEN exists:', !!REFRESH_TOKEN);

    // Configurar OAuth2
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://www.quirozendh.com/oauth2callback.html'
    );

    oauth2Client.setCredentials({
      access_token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN
    });

    // Configurar refresh automático del token
    oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        console.log('New refresh token received');
      }
      if (tokens.access_token) {
        console.log('Access token refreshed');
      }
    });
    const { reservation, serviciosList = [] } = req.body;

    if (!reservation || !reservation.fecha || !reservation.hora) {
      return res.status(400).json({ error: 'Reservation data is required' });
    }

    // Obtener duración del servicio
    let duration = 50;
    if (reservation.servicio && serviciosList.length > 0) {
      const service = serviciosList.find(s => s.nombre === reservation.servicio);
      if (service && service.duracion) {
        duration = extractMinutes(service.duracion);
      }
    }

    const startDateTime = `${reservation.fecha}T${reservation.hora}:00`;
    const endTime = getEndTime(reservation.hora, duration);
    const endDateTime = `${reservation.fecha}T${endTime}:00`;

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return res.status(200).json({ 
      success: true, 
      eventId: response.data.id 
    });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      response: error.response?.data
    });
    
    // Si el error es de autenticación, intentar refrescar el token
    if (error.code === 401 || error.message?.includes('Invalid Credentials') || error.message?.includes('unauthorized') || error.response?.status === 401) {
      try {
        const { tokens } = await oauth2Client.refreshAccessToken();
        console.log('Token refreshed, retrying...');
        
        // Recrear el evento para el reintento
        const { reservation, serviciosList = [] } = req.body;
        let duration = 50;
        if (reservation.servicio && serviciosList.length > 0) {
          const service = serviciosList.find(s => s.nombre === reservation.servicio);
          if (service && service.duracion) {
            duration = extractMinutes(service.duracion);
          }
        }
        const startDateTime = `${reservation.fecha}T${reservation.hora}:00`;
        const endTime = getEndTime(reservation.hora, duration);
        const endDateTime = `${reservation.fecha}T${endTime}:00`;
        
        const retryEvent = {
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
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 60 },
            ],
          },
        };
        
        // Reintentar con el nuevo token
        oauth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: retryEvent,
        });
        
        return res.status(200).json({ 
          success: true, 
          eventId: response.data.id 
        });
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return res.status(500).json({ 
          error: 'Error refreshing access token',
          message: refreshError.message,
          details: 'El token de acceso ha expirado y no se pudo refrescar. Actualiza las variables de entorno en Vercel.'
        });
      }
    }
    
    return res.status(500).json({ 
      error: 'Error creating calendar event',
      message: error.message,
      code: error.code || 'UNKNOWN',
      details: error.response?.data || error.stack
    });
  }
}

