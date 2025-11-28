# 🔧 Configurar Variables de Entorno (.env y Vercel)

## 📝 Archivo .env Local (Para Desarrollo)

Puedes crear un archivo `.env` en la raíz del proyecto con estas variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCk4_1vG5Wp7bGZu1_fNrKlIuIsRwZpv4o
VITE_FIREBASE_AUTH_DOMAIN=quirozenapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quirozenapp
VITE_FIREBASE_STORAGE_BUCKET=quirozenapp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=992779516038
VITE_FIREBASE_APP_ID=1:992779516038:web:e5d795590c711522f7b907

# Google Calendar Configuration (para Vercel API)
GOOGLE_CLIENT_ID=496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
GOOGLE_REFRESH_TOKEN=TU_REFRESH_TOKEN_AQUI
```

⚠️ **IMPORTANTE**: 
- Reemplaza `TU_ACCESS_TOKEN_AQUI` y `TU_REFRESH_TOKEN_AQUI` con los tokens reales
- El archivo `.env` solo funciona en desarrollo local
- **NO subas el archivo `.env` a Git** (ya está en .gitignore)

## 🚀 Variables en Vercel (Para Producción)

Para que funcione en producción, también debes configurar las variables en Vercel:

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings** → **Environment Variables**
4. Agrega estas variables:

```
GOOGLE_CLIENT_ID = 496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
GOOGLE_ACCESS_TOKEN = (tu access token)
GOOGLE_REFRESH_TOKEN = (tu refresh token)
```

5. Selecciona **Production**, **Preview**, y **Development**
6. Haz clic en **Save**

## 📋 Diferencia entre .env y Vercel

### Archivo .env (Local)
- ✅ Funciona en desarrollo local (`npm run dev`)
- ✅ No se sube a Git (está en .gitignore)
- ❌ NO funciona en producción

### Variables en Vercel
- ✅ Funciona en producción (tu sitio web)
- ✅ Funciona en preview deployments
- ✅ Seguro (no está en el código)
- ❌ NO funciona en desarrollo local (a menos que uses Vercel CLI)

## 🔧 Solución Híbrida

El código que implementé usa:
1. **Primero intenta la API de Vercel** (usa variables de Vercel)
2. **Si falla, usa localStorage** (para desarrollo local)

Esto significa:
- ✅ En producción: Usa las variables de Vercel (funciona desde cualquier dispositivo)
- ✅ En desarrollo local: Puede usar localStorage si configuras los tokens

## ✅ Pasos Recomendados

1. **Crea `.env` local** para desarrollo (opcional, pero útil)
2. **Configura variables en Vercel** para producción (OBLIGATORIO)
3. **Obtén tokens** desde setup-calendar.html
4. **Actualiza ambas** con los tokens reales

## 🆘 Nota sobre .env

Las variables que empiezan con `VITE_` son accesibles en el frontend.
Las variables sin `VITE_` (como `GOOGLE_CLIENT_ID`) solo están disponibles en:
- Funciones serverless (api/*.js)
- Variables de entorno del servidor (Vercel)

Por eso las funciones de Vercel usan `process.env.GOOGLE_CLIENT_ID` (sin VITE_).

