# 🚀 Configurar Vercel API (Gratis, Sin Tarjeta)

## ✅ Solución Implementada

He creado **Vercel Serverless Functions** que se ejecutan en el servidor. Esto permite:

- ✅ **Funciona desde cualquier dispositivo** (sin configurar tokens en cada uno)
- ✅ **100% GRATIS** (Vercel tiene tier gratuito generoso)
- ✅ **NO requiere tarjeta de crédito**
- ✅ **Tokens centralizados y seguros** (en variables de entorno de Vercel)

## 📋 Pasos para Configurar

### Paso 1: Obtener Tokens de Google Calendar

1. Abre: `https://www.quirozendh.com/setup-calendar.html`
2. Ingresa:
   - **Client ID**: `TU_CLIENT_ID_AQUI`
   - **Client Secret**: `TU_CLIENT_SECRET_AQUI`
3. Autoriza la aplicación
4. **Copia los tokens** que aparecen:
   - Access Token
   - Refresh Token

### Paso 2: Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas variables:

```
GOOGLE_CLIENT_ID = TU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET = TU_CLIENT_SECRET_AQUI
GOOGLE_ACCESS_TOKEN = TU_ACCESS_TOKEN_AQUI
GOOGLE_REFRESH_TOKEN = TU_REFRESH_TOKEN_AQUI
```

5. Selecciona **Production**, **Preview**, y **Development**
6. Haz clic en **Save**

### Paso 3: Instalar googleapis en el Proyecto

```bash
npm install googleapis
```

### Paso 4: Desplegar en Vercel

```bash
git add .
git commit -m "Agregar Vercel API functions para Google Calendar"
git push
```

Vercel desplegará automáticamente las funciones.

## ✅ Cómo Funciona

1. **Usuario crea/modifica/elimina reserva** desde cualquier dispositivo
2. **El código llama a la API de Vercel** (`/api/calendar-event`)
3. **La función de Vercel** usa los tokens de las variables de entorno
4. **Se crea/actualiza/elimina el evento** en Google Calendar
5. **Funciona desde cualquier dispositivo** sin configurar nada

## 🎯 Ventajas

- ✅ **Funciona desde cualquier dispositivo** (PC, móvil, tablet)
- ✅ **Tokens centralizados** (no están en localStorage)
- ✅ **100% Gratis** (Vercel tier gratuito: 100GB bandwidth/mes, funciones ilimitadas)
- ✅ **Sin tarjeta de crédito** requerida
- ✅ **Automático** - se ejecuta cuando hay cambios

## 📊 Límites Gratuitos de Vercel

- ✅ **100 GB bandwidth/mes** GRATIS
- ✅ **Funciones serverless ilimitadas** GRATIS
- ✅ **100 horas de ejecución/mes** GRATIS

Para tu caso de uso, será **100% GRATIS**.

## 🔧 Archivos Creados

- `api/calendar-event.js` - Crear eventos
- `api/calendar-event-update.js` - Actualizar eventos
- `api/calendar-event-delete.js` - Eliminar eventos

## ✅ Verificar

1. Despliega en Vercel
2. Crea una reserva de prueba desde cualquier dispositivo
3. Verifica en tu Google Calendar que aparezca el evento

## 🆘 Si Tienes Problemas

- **Error 500**: Verifica que las variables de entorno estén configuradas en Vercel
- **Error 401**: Los tokens expiraron, obtén nuevos tokens desde setup-calendar.html
- **No funciona**: Verifica que las funciones estén desplegadas en Vercel

