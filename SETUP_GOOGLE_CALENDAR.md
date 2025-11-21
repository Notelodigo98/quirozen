# Configuración de Google Calendar - Guía Rápida

## Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra el proyecto (ej: "Quirozen Calendar")

## Paso 2: Habilitar Google Calendar API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Calendar API"
3. Haz clic en **Enable**

## Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo de aplicación: **External**
   - Nombre: "Quirozen Calendar Integration"
   - Email de soporte: quirozendh1@gmail.com
   - Guarda y continúa
4. Crea el OAuth client ID:
   - Tipo de aplicación: **Web application**
   - Nombre: "Quirozen Web Client"
   - Authorized JavaScript origins: 
     - `http://localhost:5173` (para desarrollo)
     - Tu dominio de producción (ej: `https://tu-dominio.com`)
   - Authorized redirect URIs:
     - `http://localhost:5173/oauth2callback` (para desarrollo)
     - `https://tu-dominio.com/oauth2callback` (para producción)
5. Haz clic en **Create**
6. **Copia el Client ID y Client Secret** (los necesitarás después)

## Paso 4: Obtener Tokens de Acceso

### Opción A: Usar el Script de Configuración (Recomendado)

1. Crea un archivo `setup-calendar.html` en la raíz del proyecto:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Google Calendar Setup</title>
</head>
<body>
    <h1>Configuración de Google Calendar</h1>
    <div>
        <label>Client ID:</label>
        <input type="text" id="clientId" style="width: 400px;" />
    </div>
    <div style="margin-top: 10px;">
        <label>Client Secret:</label>
        <input type="text" id="clientSecret" style="width: 400px;" />
    </div>
    <button onclick="authorize()" style="margin-top: 20px; padding: 10px 20px;">
        Autorizar y Obtener Tokens
    </button>
    <div id="result" style="margin-top: 20px;"></div>

    <script>
        function authorize() {
            const clientId = document.getElementById('clientId').value;
            const clientSecret = document.getElementById('clientSecret').value;
            
            if (!clientId || !clientSecret) {
                alert('Por favor, ingresa el Client ID y Client Secret');
                return;
            }

            const scopes = 'https://www.googleapis.com/auth/calendar';
            const redirectUri = window.location.origin + '/oauth2callback.html';
            
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${encodeURIComponent(clientId)}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=${encodeURIComponent(scopes)}&` +
                `access_type=offline&` +
                `prompt=consent`;

            // Guardar credenciales temporalmente
            sessionStorage.setItem('clientId', clientId);
            sessionStorage.setItem('clientSecret', clientSecret);
            
            window.location.href = authUrl;
        }
    </script>
</body>
</html>
```

2. Crea `oauth2callback.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Autorización Completada</title>
</head>
<body>
    <h1>Procesando autorización...</h1>
    <div id="result"></div>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            const clientId = sessionStorage.getItem('clientId');
            const clientSecret = sessionStorage.getItem('clientSecret');
            
            // Intercambiar código por tokens
            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    code: code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: window.location.origin + '/oauth2callback.html',
                    grant_type: 'authorization_code'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    document.getElementById('result').innerHTML = `
                        <h2>¡Configuración exitosa!</h2>
                        <p><strong>Access Token:</strong></p>
                        <textarea style="width: 100%; height: 100px;">${data.access_token}</textarea>
                        <p><strong>Refresh Token:</strong></p>
                        <textarea style="width: 100%; height: 100px;">${data.refresh_token || 'No se obtuvo refresh token'}</textarea>
                        <p><strong>Expires In:</strong> ${data.expires_in} segundos</p>
                        <p style="color: red;"><strong>IMPORTANTE:</strong> Guarda estos tokens de forma segura. Necesitarás configurarlos en tu aplicación.</p>
                    `;
                } else {
                    document.getElementById('result').innerHTML = `
                        <h2>Error</h2>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                }
            })
            .catch(error => {
                document.getElementById('result').innerHTML = `
                    <h2>Error</h2>
                    <pre>${error.message}</pre>
                `;
            });
        } else {
            document.getElementById('result').innerHTML = '<p>No se recibió código de autorización.</p>';
        }
    </script>
</body>
</html>
```

3. Abre `setup-calendar.html` en tu navegador
4. Ingresa tu Client ID y Client Secret
5. Haz clic en "Autorizar"
6. Autoriza la aplicación
7. Copia los tokens que aparezcan

### Opción B: Usar Google OAuth Playground (Más Simple)

1. Ve a [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. En la parte superior derecha, haz clic en el ícono de configuración (⚙️)
3. Marca "Use your own OAuth credentials"
4. Ingresa tu Client ID y Client Secret
5. En la lista de APIs, busca y selecciona "Calendar API v3"
6. Selecciona el scope: `https://www.googleapis.com/auth/calendar`
7. Haz clic en "Authorize APIs"
8. Autoriza con tu cuenta quirozendh1@gmail.com
9. Haz clic en "Exchange authorization code for tokens"
10. Copia el **Access token** y **Refresh token**

## Paso 5: Configurar Tokens en la Aplicación

Crea un archivo `src/config/calendarConfig.js`:

```javascript
// Configuración de Google Calendar
// IMPORTANTE: En producción, guarda estos valores de forma segura
// (variables de entorno, Firebase Functions config, etc.)

import { initializeCalendar } from '../firebase/googleCalendar';

// Reemplaza estos valores con los tokens que obtuviste
const CALENDAR_CONFIG = {
  access_token: 'TU_ACCESS_TOKEN_AQUI',
  refresh_token: 'TU_REFRESH_TOKEN_AQUI'
};

// Inicializar Google Calendar
initializeCalendar(CALENDAR_CONFIG);

export default CALENDAR_CONFIG;
```

Luego, importa este archivo en `src/main.jsx` o `src/App.jsx`:

```javascript
import './config/calendarConfig'; // Al inicio del archivo
```

## Paso 6: Probar la Integración

1. Haz una reserva de prueba
2. Verifica que aparezca en tu Google Calendar (quirozendh1@gmail.com)
3. Modifica la reserva y verifica que se actualice en el calendario
4. Cancela la reserva y verifica que se elimine del calendario

## Notas Importantes

- ⚠️ **Los tokens expiran**: El access token expira después de 1 hora. Necesitarás implementar refresh automático.
- 🔒 **Seguridad**: No subas los tokens a GitHub. Agrégalos a `.gitignore`.
- 🔄 **Refresh Token**: Guarda el refresh token de forma segura, lo necesitarás para renovar el access token.

## Solución de Problemas

- **Error 401 (Unauthorized)**: El token expiró. Necesitas obtener uno nuevo o implementar refresh.
- **Error 403 (Forbidden)**: Verifica que la API de Calendar esté habilitada y los scopes sean correctos.
- **No se crean eventos**: Verifica la consola del navegador para ver errores específicos.

## Próximos Pasos (Opcional)

Para producción, considera:
1. Implementar refresh automático de tokens
2. Usar Firebase Functions para manejar la autenticación de forma segura
3. Crear un calendario específico para las citas en lugar de usar "primary"

