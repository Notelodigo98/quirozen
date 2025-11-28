# 🔄 Actualizar Tokens de Google Calendar en Vercel

## Tokens Nuevos

⚠️ **IMPORTANTE**: Los tokens reales NO deben estar en este archivo por seguridad.

Para obtener los tokens:
1. Ve a: `https://www.quirozendh.com/setup-calendar.html`
2. Ingresa tu Client ID y Client Secret
3. Autoriza la aplicación
4. Copia los tokens que aparezcan

### ACCESS_TOKEN
```
[PEGA_AQUI_TU_ACCESS_TOKEN]
```

### REFRESH_TOKEN
```
[PEGA_AQUI_TU_REFRESH_TOKEN]
```

## Pasos para Actualizar en Vercel

1. **Ve a Vercel Dashboard**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Settings → Environment Variables**

3. **Actualiza estas variables:**
   - `GOOGLE_ACCESS_TOKEN` → Pega el ACCESS_TOKEN de arriba
   - `GOOGLE_REFRESH_TOKEN` → Pega el REFRESH_TOKEN de arriba

4. **Verifica que también estén estas variables:**
   - `GOOGLE_CLIENT_ID` (debería estar ya configurado)
   - `GOOGLE_CLIENT_SECRET` (debería estar ya configurado)

5. **Asegúrate de que estén seleccionadas para:**
   - ✅ Production
   - ✅ Preview (opcional)
   - ✅ Development (opcional)

6. **Haz un nuevo despliegue:**
   - Ve a Deployments
   - Haz clic en "Redeploy" en el último deployment
   - O espera a que se despliegue automáticamente con el próximo push

## Verificar que Funciona

1. Espera 1-2 minutos después de actualizar las variables
2. Haz una reserva desde el móvil
3. Revisa la consola del navegador:
   - Deberías ver: `✅ Evento creado en Google Calendar vía API: [event_id]`
4. Verifica en tu Google Calendar que aparezca el evento

## Nota Importante

Los tokens de acceso expiran después de un tiempo. Si vuelves a tener el error 500, necesitarás obtener nuevos tokens desde:
- https://www.quirozendh.com/setup-calendar.html

