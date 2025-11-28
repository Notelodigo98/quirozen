# 🚀 Inicio Rápido: Firebase Functions para Google Calendar

## ⚡ Pasos Rápidos (5 minutos)

### 1. Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
firebase login
```

### 2. Inicializar Firebase (si no lo has hecho)
```bash
firebase init
```
- Selecciona: **Functions** y **Firestore**
- Usa tu proyecto existente

### 3. Instalar dependencias
```bash
cd functions
npm install
cd ..
```

### 4. Obtener tokens de Google Calendar

**Opción A: Usar setup-calendar.html (Más fácil)**
1. Ve a: `https://www.quirozendh.com/setup-calendar.html`
2. Ingresa Client ID y Client Secret
3. Autoriza la aplicación
4. **Copia el comando de Firebase Functions** que aparece en la página

**Opción B: Usar el script**
```bash
cd functions
node get-tokens.js
# Sigue las instrucciones
```

### 5. Configurar tokens en Firebase Functions

Ejecuta el comando que copiaste (o usa este formato):

```bash
firebase functions:config:set \
  google.client_id="TU_CLIENT_ID" \
  google.client_secret="TU_CLIENT_SECRET" \
  google.redirect_uri="https://www.quirozendh.com/oauth2callback.html" \
  google.access_token="TU_ACCESS_TOKEN" \
  google.refresh_token="TU_REFRESH_TOKEN"
```

### 6. Desplegar funciones
```bash
firebase deploy --only functions
```

### 7. ¡Listo! 🎉

Ahora todas las reservas (desde cualquier dispositivo) se sincronizarán automáticamente con tu Google Calendar.

## ✅ Verificar que funciona

1. Crea una reserva de prueba desde cualquier dispositivo
2. Verifica en Firebase Console > Functions > Logs
3. Verifica en tu Google Calendar que aparezca el evento

## 📖 Documentación Completa

Para más detalles, ver: **FIREBASE_FUNCTIONS_SETUP.md**

## 🐛 Problemas?

- **Error al desplegar**: Asegúrate de estar en el directorio raíz
- **Tokens no funcionan**: Obtén nuevos tokens desde setup-calendar.html
- **Eventos no se crean**: Revisa los logs: `firebase functions:log`

