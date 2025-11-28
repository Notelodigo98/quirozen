# 📝 Cómo Configurar Variables de Entorno

## ✅ Sí, puedes añadirlas al .env

Puedes crear un archivo `.env` en la raíz del proyecto, pero hay algunas consideraciones importantes.

## 📋 Crear Archivo .env

1. **Crea un archivo `.env`** en la raíz del proyecto (junto a `package.json`)

2. **Añade estas variables**:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=TU_API_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=quirozenapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quirozenapp
VITE_FIREBASE_STORAGE_BUCKET=quirozenapp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=992779516038
VITE_FIREBASE_APP_ID=1:992779516038:web:e5d795590c711522f7b907

# Google Calendar Configuration (para desarrollo local con Vercel CLI)
# NOTA: Estas variables solo funcionan si usas Vercel CLI localmente
# Para producción, debes configurarlas en el dashboard de Vercel
GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET_AQUI
GOOGLE_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
GOOGLE_REFRESH_TOKEN=TU_REFRESH_TOKEN_AQUI
```

3. **Reemplaza** `TU_CLIENT_SECRET_AQUI`, `TU_ACCESS_TOKEN_AQUI`, y `TU_REFRESH_TOKEN_AQUI` con los valores reales

## ⚠️ Importante: Diferencia entre .env y Vercel

### Variables con `VITE_` (Frontend)
- ✅ Funcionan en desarrollo local
- ✅ Funcionan en producción (Vercel las lee automáticamente)
- ✅ Accesibles en el código del frontend

### Variables sin `VITE_` (Backend/Serverless)
- ⚠️ **NO funcionan en desarrollo local** (a menos que uses Vercel CLI)
- ✅ **Solo funcionan en producción** si las configuras en Vercel Dashboard
- ✅ Solo accesibles en funciones serverless (`api/*.js`)

## 🚀 Para que Funcione en Producción

**DEBES configurar las variables en Vercel Dashboard:**

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings** → **Environment Variables**
4. Agrega:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_ACCESS_TOKEN`
   - `GOOGLE_REFRESH_TOKEN`
5. Selecciona **Production**, **Preview**, y **Development**
6. Guarda

## 🔧 Solución Actual

El código que implementé tiene **fallback automático**:
1. **Primero intenta** usar la API de Vercel (variables de Vercel)
2. **Si falla**, usa localStorage (método local)

Esto significa:
- ✅ En producción: Usa variables de Vercel → Funciona desde cualquier dispositivo
- ✅ En desarrollo: Puede usar localStorage si configuras los tokens

## ✅ Recomendación

1. **Crea `.env`** para desarrollo local (opcional)
2. **Configura variables en Vercel** para producción (OBLIGATORIO)
3. **Obtén tokens** desde setup-calendar.html
4. **Actualiza ambas** con los tokens reales

## 📝 Nota sobre Seguridad

- ✅ El archivo `.env` ya está en `.gitignore` (no se sube a Git)
- ✅ Las variables en Vercel son seguras (no están en el código)
- ✅ Los tokens no se exponen al frontend

