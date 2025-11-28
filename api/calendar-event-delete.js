// Vercel Serverless Function para eliminar eventos de Google Calendar

const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !ACCESS_TOKEN || !REFRESH_TOKEN) {
    return res.status(500).json({ 
      error: 'Google Calendar no configurado' 
    });
  }

  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
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

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    // Si el evento ya no existe (404), no es un error crítico
    if (error.code === 404) {
      return res.status(200).json({ success: true, message: 'Event already deleted' });
    }
    
    console.error('Error deleting calendar event:', error);
    return res.status(500).json({ 
      error: 'Error deleting calendar event',
      message: error.message 
    });
  }
}

