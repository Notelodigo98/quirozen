# 🔑 Siguiente Paso: Configurar Tokens de Google Calendar

## ✅ Lo que ya tienes hecho

- ✅ Proyecto Firebase creado: `quirozenapp`
- ✅ Firebase inicializado en el directorio local
- ✅ Firebase Functions configuradas
- ✅ Dependencias instaladas
- ✅ Variables de entorno actualizadas

## 🎯 Próximo Paso: Obtener Tokens de Google Calendar

### Opción 1: Usar setup-calendar.html (Recomendado)

1. **Abre en tu navegador:**
   - Local: `http://localhost:5173/setup-calendar.html`
   - Producción: `https://www.quirozendh.com/setup-calendar.html`

2. **Ingresa tus credenciales:**
   - **Client ID**: `496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com`
   - **Client Secret**: (obtén desde Google Cloud Console)

3. **Haz clic en "Authorize APIs"**

4. **Autoriza con tu cuenta de Google**

5. **Copia los tokens** que aparecen:
   - Access Token
   - Refresh Token

6. **Copia el comando de Firebase Functions** que aparece en la página

### Opción 2: Usar el script get-tokens.js

```bash
cd functions
node get-tokens.js
# Sigue las instrucciones
```

## ⚙️ Configurar Tokens en Firebase Functions

Una vez que tengas los tokens, ejecuta el comando que copiaste (o usa este formato):

```bash
firebase functions:config:set \
  google.client_id="TU_CLIENT_ID_AQUI" \
  google.client_secret="TU_CLIENT_SECRET_AQUI" \
  google.redirect_uri="https://www.quirozendh.com/oauth2callback.html" \
  google.access_token="TU_ACCESS_TOKEN_AQUI" \
  google.refresh_token="TU_REFRESH_TOKEN_AQUI"
```

⚠️ **Reemplaza** todos los valores `TU_*_AQUI` con los valores reales.

## 🚀 Desplegar Firebase Functions

Después de configurar los tokens:

```bash
firebase deploy --only functions
```

Esto desplegará las funciones que se ejecutarán automáticamente cuando:
- Se crea una reserva → Crea evento en Google Calendar
- Se actualiza una reserva → Actualiza evento en Google Calendar
- Se elimina una reserva → Elimina evento de Google Calendar

## ✅ Verificar

1. Crea una reserva de prueba desde cualquier dispositivo
2. Verifica en Firebase Console → Functions → Logs
3. Verifica en tu Google Calendar que aparezca el evento

## 📋 Checklist

- [ ] Obtener tokens desde setup-calendar.html
- [ ] Configurar tokens: `firebase functions:config:set ...`
- [ ] Desplegar funciones: `firebase deploy --only functions`
- [ ] Crear reserva de prueba
- [ ] Verificar en Google Calendar

