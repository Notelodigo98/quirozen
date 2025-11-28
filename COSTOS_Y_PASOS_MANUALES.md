# 💰 Costos y Pasos Manuales

## ✅ ¿Es Gratuito?

**SÍ, es gratuito** para la mayoría de casos de uso. Firebase Functions tiene un **plan gratuito generoso**:

### Plan Gratuito (Spark Plan):
- ✅ **125,000 invocaciones/mes** GRATIS
- ✅ **2 GB de tráfico saliente/mes** GRATIS
- ✅ **400,000 GB-segundos de tiempo de ejecución/mes** GRATIS

### ¿Cuánto es eso en la práctica?

Para un negocio pequeño/mediano:
- **125,000 invocaciones/mes** = ~4,166 reservas/día
- Si cada reserva ejecuta 3 funciones (crear, actualizar, eliminar) = ~1,388 reservas/día
- **Es MUY difícil superar el límite gratuito** para un negocio normal

### Si superas el límite (Plan Blaze - Pay as you go):
- Las primeras **2 millones de invocaciones/mes** son GRATIS
- Después: **$0.40 por cada millón adicional**
- Ejemplo: 3 millones de invocaciones = $0.40 (muy barato)

### Conclusión:
**Para tu caso de uso (reservas de un negocio), será 100% GRATIS** ✅

---

## 🔧 Pasos Manuales que DEBES Hacer

Después de mi implementación, necesitas hacer estos pasos **una sola vez**:

### 1️⃣ Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

### 2️⃣ Iniciar sesión en Firebase
```bash
firebase login
```
- Se abrirá el navegador para autenticarte
- Selecciona tu cuenta de Google

### 3️⃣ Inicializar Firebase en tu proyecto
```bash
firebase init
```
Cuando te pregunte:
- ✅ Selecciona: **Functions** y **Firestore**
- ✅ Usa tu proyecto existente (el que ya tienes configurado)
- ✅ Para Functions: selecciona JavaScript
- ✅ Para ESLint: puedes decir "No" (ya está configurado)

### 4️⃣ Instalar dependencias
```bash
cd functions
npm install
cd ..
```

### 5️⃣ Obtener tokens de Google Calendar

**Opción A: Usar setup-calendar.html (Más fácil)**
1. Ve a: `https://www.quirozendh.com/setup-calendar.html`
2. Ingresa:
   - **Client ID**: `496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com`
   - **Client Secret**: `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`
3. Haz clic en "Authorize APIs"
4. Autoriza con tu cuenta de Google
5. **Copia el comando de Firebase Functions** que aparece en la página

**Opción B: Usar el script**
```bash
cd functions
node get-tokens.js
# Sigue las instrucciones
```

### 6️⃣ Configurar tokens en Firebase Functions

Ejecuta el comando que copiaste (o usa este formato):

```bash
firebase functions:config:set \
  google.client_id="496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com" \
  google.client_secret="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" \
  google.redirect_uri="https://www.quirozendh.com/oauth2callback.html" \
  google.access_token="TU_ACCESS_TOKEN_AQUI" \
  google.refresh_token="TU_REFRESH_TOKEN_AQUI"
```

**⚠️ IMPORTANTE**: Reemplaza `TU_ACCESS_TOKEN_AQUI` y `TU_REFRESH_TOKEN_AQUI` con los tokens reales que obtuviste en el paso 5.

### 7️⃣ Desplegar las funciones
```bash
firebase deploy --only functions
```

Esto puede tardar 2-5 minutos la primera vez.

### 8️⃣ Verificar que funciona

1. Crea una reserva de prueba desde cualquier dispositivo
2. Espera 5-10 segundos
3. Verifica en Firebase Console > Functions > Logs:
   - Deberías ver: `✅ Evento creado en Google Calendar: [event_id]`
4. Verifica en tu Google Calendar que aparezca el evento

---

## 📋 Checklist de Pasos Manuales

- [ ] Instalar Firebase CLI: `npm install -g firebase-tools`
- [ ] Iniciar sesión: `firebase login`
- [ ] Inicializar Firebase: `firebase init` (seleccionar Functions y Firestore)
- [ ] Instalar dependencias: `cd functions && npm install && cd ..`
- [ ] Obtener tokens desde `setup-calendar.html`
- [ ] Configurar tokens: `firebase functions:config:set ...`
- [ ] Desplegar: `firebase deploy --only functions`
- [ ] Verificar con una reserva de prueba

---

## ⏱️ Tiempo Estimado

- **Total**: ~15-20 minutos
- Paso 1-4: ~5 minutos
- Paso 5 (obtener tokens): ~3 minutos
- Paso 6-7 (configurar y desplegar): ~5-10 minutos
- Paso 8 (verificar): ~2 minutos

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas en algún paso:

1. **Error al hacer `firebase init`**: Asegúrate de estar en el directorio raíz del proyecto
2. **Error al desplegar**: Verifica que hayas configurado los tokens correctamente
3. **Los eventos no se crean**: Revisa los logs: `firebase functions:log`
4. **Tokens no funcionan**: Obtén nuevos tokens desde `setup-calendar.html`

---

## 🎉 Después de Completar los Pasos

Una vez que completes estos pasos:
- ✅ **NO necesitas hacer nada más**
- ✅ Las reservas se sincronizarán automáticamente
- ✅ Funcionará desde cualquier dispositivo
- ✅ Los tokens se renovarán automáticamente
- ✅ **Todo será automático y gratuito**

