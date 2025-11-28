const functions = require('firebase-functions');
const { google } = require('googleapis');
const admin = require('firebase-admin');

admin.initializeApp();

// OAuth2 Client - se inicializa con los tokens de Firebase Functions config
let oauth2Client = null;

// Inicializar OAuth2 (se configura una vez)
const initOAuth2 = () => {
  if (!oauth2Client) {
    try {
      const config = functions.config().google;
      
      if (!config || !config.client_id || !config.client_secret) {
        console.error('❌ Google Calendar no configurado. Configura los tokens con: firebase functions:config:set');
        return null;
      }
      
      oauth2Client = new google.auth.OAuth2(
        config.client_id,
        config.client_secret,
        config.redirect_uri || 'https://www.quirozendh.com/oauth2callback.html'
      );
      
      // Configurar tokens desde Firebase Functions config
      if (config.access_token && config.refresh_token) {
        oauth2Client.setCredentials({
          access_token: config.access_token,
          refresh_token: config.refresh_token
        });
        
        // Auto-refresh token cuando expire
        oauth2Client.on('tokens', (tokens) => {
          if (tokens.refresh_token) {
            console.log('🔄 Nuevo refresh token recibido');
          }
          if (tokens.access_token) {
            console.log('🔄 Nuevo access token recibido');
          }
        });
      } else {
        console.error('❌ Tokens de Google Calendar no configurados');
        return null;
      }
    } catch (error) {
      console.error('❌ Error inicializando OAuth2:', error);
      return null;
    }
  }
  return oauth2Client;
};

// Helper: Calcular hora de fin
const getEndTime = (startTime, durationMinutes = 50) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Helper: Extraer minutos de duración del string
const extractMinutes = (durationString) => {
  if (!durationString) return 50;
  const match = durationString.match(/(\d+)\s*min/);
  return match ? parseInt(match[1], 10) : 50;
};

// Helper: Obtener duración del servicio desde Firestore
const getServiceDuration = async (serviceName) => {
  try {
    const serviciosSnapshot = await admin.firestore()
      .collection('servicios')
      .where('nombre', '==', serviceName)
      .limit(1)
      .get();
    
    if (!serviciosSnapshot.empty) {
      const servicio = serviciosSnapshot.docs[0].data();
      if (servicio.duracion) {
        return extractMinutes(servicio.duracion);
      }
    }
  } catch (error) {
    console.log('⚠️ No se pudo obtener duración del servicio, usando default:', error.message);
  }
  return 50; // Default
};

// Trigger: Cuando se crea una reserva
exports.onCreateReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onCreate(async (snap, context) => {
    const reservation = snap.data();
    const reservationId = context.params.reservationId;
    
    console.log(`📅 Creando evento en Google Calendar para reserva: ${reservationId}`);
    
    try {
      const auth = initOAuth2();
      if (!auth) {
        console.error('❌ No se pudo inicializar OAuth2. Verifica la configuración.');
        return;
      }
      
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      // Obtener duración del servicio
      const duration = await getServiceDuration(reservation.servicio);
      
      const startDateTime = `${reservation.fecha}T${reservation.hora}:00`;
      const endTime = getEndTime(reservation.hora, duration);
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
      
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      
      // Guardar el ID del evento en la reserva
      await admin.firestore()
        .collection('reservations')
        .doc(reservationId)
        .update({ calendarEventId: response.data.id });
      
      console.log(`✅ Evento creado en Google Calendar: ${response.data.id}`);
    } catch (error) {
      console.error('❌ Error creando evento en Google Calendar:', error);
    }
  });

// Trigger: Cuando se actualiza una reserva
exports.onUpdateReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const reservationId = context.params.reservationId;
    const calendarEventId = newData.calendarEventId;
    
    console.log(`📝 Actualizando evento en Google Calendar para reserva: ${reservationId}`);
    
    // Si no hay calendarEventId, crear uno nuevo
    if (!calendarEventId) {
      console.log('⚠️ No hay calendarEventId, creando nuevo evento...');
      try {
        const auth = initOAuth2();
        if (!auth) return;
        
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const duration = await getServiceDuration(newData.servicio);
        
        const startDateTime = `${newData.fecha}T${newData.hora}:00`;
        const endTime = getEndTime(newData.hora, duration);
        const endDateTime = `${newData.fecha}T${endTime}:00`;
        
        const event = {
          summary: `Cita: ${newData.nombre} - ${newData.servicio}`,
          description: `Cliente: ${newData.nombre}\nTeléfono: ${newData.telefono}\nEmail: ${newData.email}\nCódigo de reserva: ${newData.code}\n${newData.notas ? `Notas: ${newData.notas}` : ''}`,
          start: {
            dateTime: startDateTime,
            timeZone: 'Europe/Madrid',
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'Europe/Madrid',
          },
        };
        
        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });
        
        await admin.firestore()
          .collection('reservations')
          .doc(reservationId)
          .update({ calendarEventId: response.data.id });
        
        console.log(`✅ Evento creado en Google Calendar después de actualización: ${response.data.id}`);
      } catch (error) {
        console.error('❌ Error creando evento después de actualización:', error);
      }
      return;
    }
    
    // Solo actualizar si cambió la fecha, hora o servicio
    const fechaChanged = newData.fecha !== oldData.fecha;
    const horaChanged = newData.hora !== oldData.hora;
    const servicioChanged = newData.servicio !== oldData.servicio;
    const nombreChanged = newData.nombre !== oldData.nombre;
    const notasChanged = newData.notas !== oldData.notas;
    
    if (fechaChanged || horaChanged || servicioChanged || nombreChanged || notasChanged) {
      try {
        const auth = initOAuth2();
        if (!auth) return;
        
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const duration = await getServiceDuration(newData.servicio);
        
        const startDateTime = `${newData.fecha}T${newData.hora}:00`;
        const endTime = getEndTime(newData.hora, duration);
        const endDateTime = `${newData.fecha}T${endTime}:00`;
        
        const event = {
          summary: `Cita: ${newData.nombre} - ${newData.servicio}`,
          description: `Cliente: ${newData.nombre}\nTeléfono: ${newData.telefono}\nEmail: ${newData.email}\nCódigo de reserva: ${newData.code}\n${newData.notas ? `Notas: ${newData.notas}` : ''}`,
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
          eventId: calendarEventId,
          resource: event,
        });
        
        console.log(`✅ Evento actualizado en Google Calendar: ${calendarEventId}`);
      } catch (error) {
        console.error('❌ Error actualizando evento en Google Calendar:', error);
        // Si el evento no existe (404), intentar crear uno nuevo
        if (error.code === 404) {
          console.log('⚠️ Evento no encontrado, intentando crear uno nuevo...');
          try {
            const auth = initOAuth2();
            if (!auth) return;
            
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            const duration = await getServiceDuration(newData.servicio);
            
            const startDateTime = `${newData.fecha}T${newData.hora}:00`;
            const endTime = getEndTime(newData.hora, duration);
            const endDateTime = `${newData.fecha}T${endTime}:00`;
            
            const event = {
              summary: `Cita: ${newData.nombre} - ${newData.servicio}`,
              description: `Cliente: ${newData.nombre}\nTeléfono: ${newData.telefono}\nEmail: ${newData.email}\nCódigo de reserva: ${newData.code}\n${newData.notas ? `Notas: ${newData.notas}` : ''}`,
              start: {
                dateTime: startDateTime,
                timeZone: 'Europe/Madrid',
              },
              end: {
                dateTime: endDateTime,
                timeZone: 'Europe/Madrid',
              },
            };
            
            const response = await calendar.events.insert({
              calendarId: 'primary',
              resource: event,
            });
            
            await admin.firestore()
              .collection('reservations')
              .doc(reservationId)
              .update({ calendarEventId: response.data.id });
            
            console.log(`✅ Nuevo evento creado después de error 404: ${response.data.id}`);
          } catch (createError) {
            console.error('❌ Error creando nuevo evento después de 404:', createError);
          }
        }
      }
    } else {
      console.log('ℹ️ No hay cambios relevantes para actualizar en Google Calendar');
    }
  });

// Trigger: Cuando se elimina una reserva
exports.onDeleteReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onDelete(async (snap, context) => {
    const reservation = snap.data();
    const reservationId = context.params.reservationId;
    const calendarEventId = reservation.calendarEventId;
    
    if (!calendarEventId) {
      console.log(`ℹ️ Reserva ${reservationId} eliminada sin calendarEventId`);
      return;
    }
    
    console.log(`🗑️ Eliminando evento de Google Calendar: ${calendarEventId}`);
    
    try {
      const auth = initOAuth2();
      if (!auth) {
        console.error('❌ No se pudo inicializar OAuth2.');
        return;
      }
      
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: calendarEventId,
      });
      
      console.log(`✅ Evento eliminado de Google Calendar: ${calendarEventId}`);
    } catch (error) {
      // Si el evento ya no existe, no es un error crítico
      if (error.code === 404) {
        console.log(`ℹ️ Evento ${calendarEventId} ya no existe en Google Calendar`);
      } else {
        console.error('❌ Error eliminando evento de Google Calendar:', error);
      }
    }
  });
