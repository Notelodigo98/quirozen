# ✅ Verificar y Desplegar - Google Calendar con Vercel API

## ✅ Lo que ya tienes hecho

- ✅ Variables de entorno configuradas en Vercel
- ✅ Funciones API creadas (`api/calendar-event.js`, etc.)
- ✅ Código del cliente actualizado para usar la API
- ✅ `googleapis` instalado

## 🚀 Paso 1: Verificar Archivos

Asegúrate de que estos archivos existan:
- ✅ `api/calendar-event.js`
- ✅ `api/calendar-event-update.js`
- ✅ `api/calendar-event-delete.js`
- ✅ `src/firebase/googleCalendar.js` (actualizado)
- ✅ `src/firebase/reservations.js` (actualizado)

## 📤 Paso 2: Hacer Commit y Push

```bash
git add .
git commit -m "Agregar Vercel API functions para Google Calendar"
git push
```

Vercel desplegará automáticamente cuando hagas push.

## ✅ Paso 3: Verificar Despliegue

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Espera a que termine el despliegue
3. Verifica que no haya errores en el log de despliegue

## 🧪 Paso 4: Probar

1. Ve a tu sitio web: `https://www.quirozendh.com`
2. Crea una reserva de prueba desde cualquier dispositivo
3. Abre la consola del navegador (F12)
4. Deberías ver: `✅ Evento creado en Google Calendar vía API: [event_id]`
5. Verifica en tu Google Calendar que aparezca el evento

## 🔍 Verificar que las Funciones Están Desplegadas

1. Ve a Vercel Dashboard → Tu proyecto → **Functions**
2. Deberías ver:
   - `/api/calendar-event`
   - `/api/calendar-event-update`
   - `/api/calendar-event-delete`

## 🐛 Si Hay Problemas

### Error: "Google Calendar no configurado"
- Verifica que las variables estén en Vercel Dashboard
- Asegúrate de que estén seleccionadas para **Production**
- Haz un nuevo despliegue después de agregar variables

### Error: "API no disponible"
- Verifica que las funciones estén desplegadas en Vercel
- Revisa los logs en Vercel Dashboard → Functions → Logs
- El código tiene fallback a localStorage, así que seguirá funcionando

### Los eventos no se crean
- Abre la consola del navegador (F12) y revisa los mensajes
- Verifica los logs de Vercel: Dashboard → Functions → Logs
- Verifica que los tokens sean válidos

## ✅ Checklist Final

- [ ] Variables configuradas en Vercel
- [ ] Archivos API creados
- [ ] Código actualizado
- [ ] Commit y push realizado
- [ ] Despliegue completado en Vercel
- [ ] Reserva de prueba creada
- [ ] Evento aparece en Google Calendar

## 🎉 ¡Listo!

Una vez desplegado, todas las reservas (desde cualquier dispositivo) se sincronizarán automáticamente con tu Google Calendar usando las funciones de Vercel.

