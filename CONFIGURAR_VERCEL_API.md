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
   - **Client ID**: `496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com`
   - **Client Secret**: `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`
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
GOOGLE_CLIENT_ID = 496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
GOOGLE_ACCESS_TOKEN = ya29a0ATi6K2v3y4HPacZ6yHrw319WoT9xtJibQE1EXXZXUSQGEsiTt4bvlCBF-okuJMVoKQS1lnaQBAqYUTfaZ2dIq8csX2mTX0mI8jo-YRZp8NTojOuD9obhHarL1yury_JJMkIUVs8Rg-EZwl_5YdB2sfeeLVICGU0truUhJHQtTfuDV5S_w-RjinJpwnKi3fTjhK8vFDcaCgYKAdISARYSFQHGX2MiKlNk5r8sQnjf2cJPw8PXzQ0206
GOOGLE_REFRESH_TOKEN = 1//03GszI__IVq_FCgYIARAAGAMSNwF-L9IrteWcSMo7urnsw3vKbn6BziDyB8SBaeMkza6HDnAuOzh0unaP44BIIhv3lmxQLgSsITQ
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

