# 🚀 Configuración para Producción - www.quirozendh.com

## Configuración Rápida para tu Dominio

Tu aplicación ya está en producción en: **https://www.quirozendh.com**

### Paso 1: Configurar Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Crea o selecciona tu proyecto
3. Habilita **Google Calendar API**
4. Ve a **Credenciales** > **Crear credenciales** > **ID de cliente de OAuth**

### Paso 2: Configurar URIs de Redirección

En las **URI de redirección autorizados**, agrega:
```
https://www.quirozendh.com/oauth2callback.html
```

En los **Orígenes de JavaScript autorizados**, agrega:
```
https://www.quirozendh.com
```

### Paso 3: Obtener Tokens

1. Abre: **https://www.quirozendh.com/setup-calendar.html**
2. Ingresa tu **Client ID** y **Client Secret**
3. Haz clic en "Autorizar"
4. Autoriza con tu cuenta **quirozendh1@gmail.com**
5. ¡Listo! Los tokens se guardan automáticamente

### Paso 4: Verificar

1. Ve a: **https://www.quirozendh.com**
2. Abre la consola (F12) - deberías ver: `✅ Google Calendar cargado desde localStorage`
3. Haz una reserva de prueba
4. Verifica en tu Google Calendar que aparezca el evento

---

## ✅ Ventajas de Configurarlo en Producción

- ✅ Funciona directamente en tu sitio web real
- ✅ Los tokens se guardan en el navegador del usuario
- ✅ No necesitas configurar nada en localhost
- ✅ Funciona para todos los usuarios que usen tu sitio

---

## 🔒 Seguridad

- Los tokens se guardan en `localStorage` del navegador
- Solo el usuario que autoriza puede usar esos tokens
- Si quieres que funcione para todos, necesitarías un backend (pero eso es opcional)

---

## 📝 Nota Importante

Si quieres que las reservas se sincronicen automáticamente para TODOS los usuarios (no solo para quien autoriza), necesitarías:
- Un backend que guarde los tokens de forma segura
- O usar Firebase Functions (más complejo pero más seguro)

Para tu caso de uso (sincronizar en TU calendario personal), la configuración actual es perfecta y gratuita.

