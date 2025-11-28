# Configuración de Firebase Functions para Google Calendar

Esta guía te ayudará a configurar Firebase Functions para que Google Calendar funcione desde cualquier dispositivo.

## ✅ Ventajas de esta solución

- **Funciona desde cualquier dispositivo**: Las funciones se ejecutan en el servidor, no en el cliente
- **Tokens centralizados y seguros**: Los tokens están en Firebase Functions config, no en localStorage
- **Automático**: Se ejecuta automáticamente cuando hay cambios en Firestore
- **Renovación automática**: Googleapis maneja el refresh de tokens automáticamente

## 📋 Requisitos Previos

1. **Firebase CLI instalado**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Iniciar sesión en Firebase**:
   ```bash
   firebase login
   ```

3. **Inicializar Firebase en tu proyecto** (si no lo has hecho):
   ```bash
   firebase init
   ```
   - Selecciona: Firestore, Functions
   - Usa el proyecto existente o crea uno nuevo

## 🔧 Paso 1: Instalar Dependencias

```bash
cd functions
npm install
cd ..
```

## 🔑 Paso 2: Obtener Tokens de Google Calendar

Tienes dos opciones:

### Opción A: Usar setup-calendar.html (Recomendado)

1. Abre tu aplicación en el navegador: `https://www.quirozendh.com/setup-calendar.html`
2. Ingresa tu Client ID y Client Secret
3. Autoriza la aplicación
4. Copia los tokens que aparecen en la pantalla:
   - **Access Token**
   - **Refresh Token**

### Opción B: Usar el archivo client_secret

Si tienes el archivo `client_secret_*.json`, puedes usar estos valores:
- **Client ID**: `web.client_id`
- **Client Secret**: `web.client_secret`

Para obtener los tokens, usa `setup-calendar.html` o el script de configuración.

## ⚙️ Paso 3: Configurar Tokens en Firebase Functions

Una vez que tengas los tokens, configúralos en Firebase Functions:

```bash
firebase functions:config:set \
  google.client_id="TU_CLIENT_ID" \
  google.client_secret="TU_CLIENT_SECRET" \
  google.redirect_uri="https://www.quirozendh.com/oauth2callback.html" \
  google.access_token="TU_ACCESS_TOKEN" \
  google.refresh_token="TU_REFRESH_TOKEN"
```

**Ejemplo** (reemplaza con tus valores reales):
```bash
firebase functions:config:set \
  google.client_id="496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com" \
  google.client_secret="TU_CLIENT_SECRET_AQUI" \
  google.redirect_uri="https://www.quirozendh.com/oauth2callback.html" \
  google.access_token="TU_ACCESS_TOKEN_AQUI" \
  google.refresh_token="TU_REFRESH_TOKEN_AQUI"
```

⚠️ **Obtén los valores reales** desde Google Cloud Console y setup-calendar.html

## 🚀 Paso 4: Desplegar Firebase Functions

```bash
firebase deploy --only functions
```

Esto desplegará las funciones que se ejecutarán automáticamente cuando:
- Se crea una reserva → Crea evento en Google Calendar
- Se actualiza una reserva → Actualiza evento en Google Calendar
- Se elimina una reserva → Elimina evento de Google Calendar

## ✅ Paso 5: Verificar que Funciona

1. Crea una reserva de prueba desde cualquier dispositivo
2. Verifica en Firebase Console > Functions > Logs que aparezca:
   - `✅ Evento creado en Google Calendar: [event_id]`
3. Verifica en tu Google Calendar que aparezca el evento

## 🔍 Verificar Configuración Actual

Para ver la configuración actual:

```bash
firebase functions:config:get
```

## 🔄 Actualizar Tokens

Si necesitas actualizar los tokens (por ejemplo, si expiran):

1. Obtén nuevos tokens usando `setup-calendar.html`
2. Actualiza la configuración:
   ```bash
   firebase functions:config:set \
     google.access_token="NUEVO_ACCESS_TOKEN" \
     google.refresh_token="NUEVO_REFRESH_TOKEN"
   ```
3. Redespliega las funciones:
   ```bash
   firebase deploy --only functions
   ```

## 📊 Ver Logs de las Funciones

Para ver los logs en tiempo real:

```bash
firebase functions:log
```

O en Firebase Console: Functions > Logs

## ⚠️ Notas Importantes

1. **Los tokens expiran**: El access token expira después de ~1 hora, pero el refresh token se renueva automáticamente
2. **Seguridad**: Los tokens están en Firebase Functions config, que es seguro y no está expuesto al cliente
3. **Primera vez**: La primera vez que se ejecuta, puede tardar unos segundos en crear el evento
4. **Errores**: Si hay errores, revisa los logs en Firebase Console

## 🐛 Solución de Problemas

### Error: "Google Calendar no configurado"
- Verifica que hayas configurado los tokens: `firebase functions:config:get`
- Asegúrate de haber desplegado las funciones: `firebase deploy --only functions`

### Error: "401 Unauthorized"
- El access token expiró. Obtén uno nuevo usando `setup-calendar.html`
- Actualiza la configuración y redespliega

### Los eventos no se crean
- Revisa los logs: `firebase functions:log`
- Verifica que las funciones estén desplegadas
- Verifica que los tokens sean válidos

### Error al desplegar
- Asegúrate de estar en el directorio raíz del proyecto
- Verifica que `functions/package.json` tenga todas las dependencias
- Ejecuta `cd functions && npm install` antes de desplegar

## 📝 Estructura del Proyecto

```
tu-proyecto/
├── functions/
│   ├── index.js          # Funciones de Firebase (triggers)
│   ├── package.json      # Dependencias
│   └── .gitignore
├── src/
│   └── firebase/
│       └── reservations.js  # Ya no llama a Google Calendar
└── firebase.json         # Configuración de Firebase
```

## 🎉 ¡Listo!

Una vez configurado, todas las reservas (desde cualquier dispositivo) se sincronizarán automáticamente con tu Google Calendar.

