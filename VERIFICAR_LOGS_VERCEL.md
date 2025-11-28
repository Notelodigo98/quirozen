# 🔍 Cómo Verificar los Logs de Vercel

## Opción 1: Desde el Dashboard de Vercel

1. **Ve a Vercel Dashboard**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto

2. **Ve a la pestaña "Deployments"**
   - Verás una lista de todos los deployments
   - Busca el más reciente (el que tiene el check verde ✅)

3. **Haz clic en el deployment más reciente**
   - Se abrirá la página de detalles del deployment

4. **Ve a la pestaña "Functions" o "Runtime Logs"**
   - Si no ves "Functions", busca "Runtime Logs" o "Logs"
   - También puedes buscar en la parte superior un icono de "Logs" o "Function Logs"

5. **Busca `/api/calendar-event`**
   - Deberías ver las invocaciones de la función
   - Haz clic en una invocación para ver los logs detallados

## Opción 2: Desde la Terminal (Vercel CLI)

Si tienes Vercel CLI instalado:

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Ver logs en tiempo real
vercel logs --follow
```

## Opción 3: Verificar en el Deployment

1. **Ve a Deployments → Último deployment**
2. **Haz clic en "View Function Logs"** (si está disponible)
3. **O busca un botón "Logs" en la parte superior**

## Qué Buscar en los Logs

Cuando hagas una reserva, deberías ver en los logs:

- ✅ `All environment variables are set` - Variables configuradas
- ❌ `Missing environment variables: [...]` - Faltan variables
- ❌ `Error creating calendar event: ...` - Error específico
- ❌ `Error refreshing token: ...` - Problema con el token

## Si No Aparecen las Functions

Si no ves la sección "Functions" en Vercel, puede ser porque:

1. **Las funciones no se han desplegado aún**
   - Haz un nuevo push o redeploy

2. **Vercel no está detectando la carpeta `api/`**
   - Verifica que los archivos estén en `api/calendar-event.js`
   - Verifica que el archivo tenga `module.exports = async function handler(req, res)`

3. **El proyecto no está conectado a Vercel**
   - Ve a Settings → Git
   - Verifica que esté conectado a tu repositorio de GitHub

## Alternativa: Verificar el Error Directamente

Si no puedes ver los logs, puedes:

1. **Hacer una reserva desde el móvil**
2. **Abrir la consola del navegador (F12)**
3. **Ver el error en la respuesta de la API**
   - El error debería mostrar más detalles ahora con los cambios recientes

## Próximos Pasos

Después de ver los logs, comparte conmigo:
- ¿Qué mensaje de error aparece?
- ¿Aparece "Missing environment variables"?
- ¿Hay algún error específico de Google Calendar API?


