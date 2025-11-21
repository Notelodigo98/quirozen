# Integración con Google Calendar

## Requisitos Previos

1. **Google Cloud Console Setup:**
   - Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
   - Habilitar la API de Google Calendar
   - Crear credenciales OAuth 2.0
   - Configurar URLs de redirección autorizadas

2. **Firebase Functions:**
   - Instalar Firebase CLI: `npm install -g firebase-tools`
   - Inicializar Functions: `firebase init functions`
   - Instalar dependencias necesarias

## Estructura de Implementación

### 1. Firebase Functions (Backend)

Crear una función que se ejecute cuando se crea/modifica/elimina una reserva:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const { google } = require('googleapis');
const admin = require('firebase-admin');

admin.initializeApp();

// Configurar OAuth2
const oauth2Client = new google.auth.OAuth2(
  functions.config().google.client_id,
  functions.config().google.client_secret,
  functions.config().google.redirect_uri
);

// Guardar tokens de acceso (necesitarás una forma de obtenerlos inicialmente)
// Esto se hace una vez mediante un flujo de autenticación

// Función que se ejecuta cuando se crea una reserva
exports.onCreateReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onCreate(async (snap, context) => {
    const reservation = snap.data();
    
    // Configurar el cliente de Calendar
    oauth2Client.setCredentials({
      access_token: functions.config().google.access_token,
      refresh_token: functions.config().google.refresh_token
    });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Crear evento en Google Calendar
    const event = {
      summary: `Cita: ${reservation.nombre} - ${reservation.servicio}`,
      description: `Cliente: ${reservation.nombre}\nTeléfono: ${reservation.telefono}\nEmail: ${reservation.email}\nCódigo: ${reservation.code}\nNotas: ${reservation.notas || 'N/A'}`,
      start: {
        dateTime: `${reservation.fecha}T${reservation.hora}:00`,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: `${reservation.fecha}T${getEndTime(reservation.hora, reservation.servicio)}:00`,
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
    
    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      
      // Guardar el ID del evento en Firestore para poder actualizarlo/eliminarlo después
      await admin.firestore()
        .collection('reservations')
        .doc(context.params.reservationId)
        .update({ calendarEventId: response.data.id });
      
      console.log('Evento creado en Google Calendar:', response.data.id);
    } catch (error) {
      console.error('Error creando evento en Google Calendar:', error);
    }
  });

// Función que se ejecuta cuando se actualiza una reserva
exports.onUpdateReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const calendarEventId = newData.calendarEventId;
    
    if (!calendarEventId) return;
    
    // Solo actualizar si cambió la fecha o hora
    if (newData.fecha !== oldData.fecha || newData.hora !== oldData.hora) {
      oauth2Client.setCredentials({
        access_token: functions.config().google.access_token,
        refresh_token: functions.config().google.refresh_token
      });
      
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      const event = {
        summary: `Cita: ${newData.nombre} - ${newData.servicio}`,
        description: `Cliente: ${newData.nombre}\nTeléfono: ${newData.telefono}\nEmail: ${newData.email}\nCódigo: ${newData.code}\nNotas: ${newData.notas || 'N/A'}`,
        start: {
          dateTime: `${newData.fecha}T${newData.hora}:00`,
          timeZone: 'Europe/Madrid',
        },
        end: {
          dateTime: `${newData.fecha}T${getEndTime(newData.hora, newData.servicio)}:00`,
          timeZone: 'Europe/Madrid',
        },
      };
      
      try {
        await calendar.events.update({
          calendarId: 'primary',
          eventId: calendarEventId,
          resource: event,
        });
        console.log('Evento actualizado en Google Calendar');
      } catch (error) {
        console.error('Error actualizando evento en Google Calendar:', error);
      }
    }
  });

// Función que se ejecuta cuando se elimina una reserva
exports.onDeleteReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onDelete(async (snap, context) => {
    const reservation = snap.data();
    const calendarEventId = reservation.calendarEventId;
    
    if (!calendarEventId) return;
    
    oauth2Client.setCredentials({
      access_token: functions.config().google.access_token,
      refresh_token: functions.config().google.refresh_token
    });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: calendarEventId,
      });
      console.log('Evento eliminado de Google Calendar');
    } catch (error) {
      console.error('Error eliminando evento de Google Calendar:', error);
    }
  });

// Helper para calcular hora de fin según duración del servicio
function getEndTime(startTime, servicio) {
  // Extraer duración del servicio (ej: "50 min" -> 50)
  // Por defecto, asumir 50 minutos
  const duration = 50; // minutos
  const [hours, minutes] = startTime.split(':').map(Number);
  const endMinutes = minutes + duration;
  const endHours = hours + Math.floor(endMinutes / 60);
  const finalMinutes = endMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}
```

### 2. Configuración de Tokens

Necesitarás obtener tokens de acceso iniciales mediante un flujo OAuth:

```javascript
// Script de configuración inicial (ejecutar una vez)
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  'TU_CLIENT_ID',
  'TU_CLIENT_SECRET',
  'http://localhost:3000/oauth2callback'
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Autoriza esta aplicación visitando esta URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Ingresa el código de aquí: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error obteniendo token', err);
    console.log('Tokens:', token);
    // Guardar estos tokens en Firebase Functions config
    // firebase functions:config:set google.access_token="..." google.refresh_token="..."
    rl.close();
  });
});
```

### 3. Instalación de Dependencias

```bash
cd functions
npm install googleapis firebase-functions firebase-admin
```

### 4. Configuración de Variables

```bash
firebase functions:config:set \
  google.client_id="TU_CLIENT_ID" \
  google.client_secret="TU_CLIENT_SECRET" \
  google.redirect_uri="http://localhost:3000/oauth2callback" \
  google.access_token="TOKEN_INICIAL" \
  google.refresh_token="REFRESH_TOKEN"
```

## Pasos para Implementar

1. **Crear proyecto en Google Cloud Console**
2. **Habilitar Google Calendar API**
3. **Crear credenciales OAuth 2.0**
4. **Configurar Firebase Functions**
5. **Obtener tokens de acceso iniciales**
6. **Desplegar funciones: `firebase deploy --only functions`**

## Notas Importantes

- Los tokens de acceso expiran, necesitarás implementar refresh automático
- Considera usar un calendario secundario en lugar de "primary"
- Los tokens deben guardarse de forma segura (Firebase Functions config)
- Prueba primero en modo desarrollo antes de producción

## Alternativa: Usar un Calendario Compartido

Si prefieres una solución más simple, puedes:
1. Crear un calendario específico para las citas
2. Compartirlo con una cuenta de servicio
3. Usar esa cuenta para crear eventos automáticamente

¿Quieres que implemente alguna de estas opciones?

