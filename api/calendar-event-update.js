// Vercel Serverless Function para actualizar eventos en Google Calendar

const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const getEndTime = (startTime, durationMinutes = 50) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

const extractMinutes = (durationString) => {
  if (!durationString) return 50;
  const match = durationString.match(/(\d+)\s*min/);
  return match ? parseInt(match[1], 10) : 50;
};

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !ACCESS_TOKEN || !REFRESH_TOKEN) {
    return res.status(500).json({ 
      error: 'Google Calendar no configurado' 
    });
  }

  try {
    const { eventId, reservation, serviciosList = [] } = req.body;

    if (!eventId || !reservation) {
      return res.status(400).json({ error: 'Event ID and reservation data are required' });
    }

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://www.quirozendh.com/oauth2callback.html'
    );

    oauth2Client.setCredentials({
      access_token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN
    });

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
    };

    await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error updating calendar event:', error);
    return res.status(500).json({ 
      error: 'Error updating calendar event',
      message: error.message 
    });
  }
}

