# 🆓 Guía de Configuración Gratuita - Google Calendar

## ✅ Todo es 100% GRATIS

- Google Calendar API: 1,000,000 consultas/día GRATIS
- Firebase: Plan gratuito suficiente para tu negocio
- **Costo total: $0**

---

## 📋 Paso 1: Crear Proyecto en Google Cloud Console (5 minutos)

1. **Ve a Google Cloud Console:**
   - Abre: https://console.cloud.google.com/
   - Inicia sesión con: **quirozendh1@gmail.com**

2. **Crear un nuevo proyecto:**
   - Haz clic en el selector de proyectos (arriba a la izquierda)
   - Haz clic en "NUEVO PROYECTO"
   - Nombre del proyecto: `Quirozen Calendar` (o el que prefieras)
   - Haz clic en "CREAR"
   - Espera unos segundos a que se cree

3. **Seleccionar el proyecto:**
   - Asegúrate de que el proyecto "Quirozen Calendar" esté seleccionado

---

## 🔌 Paso 2: Habilitar Google Calendar API (2 minutos)

1. **Ir a la biblioteca de APIs:**
   - En el menú lateral (☰), ve a **APIs y servicios** > **Biblioteca**

2. **Buscar y habilitar la API:**
   - Busca: `Google Calendar API`
   - Haz clic en el resultado
   - Haz clic en el botón **HABILITAR**
   - Espera unos segundos

---

## 🔑 Paso 3: Crear Credenciales OAuth 2.0 (5 minutos)

1. **Ir a Credenciales:**
   - En el menú lateral, ve a **APIs y servicios** > **Credenciales**

2. **Configurar la pantalla de consentimiento (solo la primera vez):**
   - Si es la primera vez, verás un mensaje para configurar la pantalla de consentimiento
   - Haz clic en "CONFIGURAR PANTALLA DE CONSENTIMIENTO"
   - Tipo de usuario: **Externo** (gratis)
   - Haz clic en "CREAR"
   - **Información de la aplicación:**
     - Nombre de la aplicación: `Quirozen`
     - Email de soporte al usuario: `quirozendh1@gmail.com`
     - Email del desarrollador: `quirozendh1@gmail.com`
   - Haz clic en "GUARDAR Y CONTINUAR"
   - **Alcances:** Haz clic en "GUARDAR Y CONTINUAR" (no necesitas agregar nada)
   - **Usuarios de prueba:** Haz clic en "GUARDAR Y CONTINUAR" (no necesario para tu propio uso)
   - **Resumen:** Revisa y haz clic en "VOLVER AL PANEL"

3. **Crear OAuth Client ID:**
   - En la página de Credenciales, haz clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
   - Tipo de aplicación: **Aplicación web**
   - Nombre: `Quirozen Web Client`
   - **URI de redirección autorizados:**
     - Haz clic en "+ AGREGAR URI"
     - Agrega: `https://www.quirozendh.com/oauth2callback.html` (tu dominio de producción)
     - Opcional (para desarrollo local): `http://localhost:5173/oauth2callback.html`
   - **Orígenes de JavaScript autorizados:**
     - Haz clic en "+ AGREGAR URI"
     - Agrega: `https://www.quirozendh.com`
     - Opcional (para desarrollo local): `http://localhost:5173`
   - Haz clic en **CREAR**

4. **Copiar las credenciales:**
   - Se abrirá un popup con tus credenciales
   - **IMPORTANTE:** Copia y guarda:
     - **ID de cliente** (Client ID): `xxxxx.apps.googleusercontent.com`
     - **Secreto de cliente** (Client Secret): `GOCSPX-xxxxx`
   - Haz clic en "LISTO"

---

## 🚀 Paso 4: Obtener Tokens de Acceso (3 minutos)

1. **Abrir la página de configuración:**
   - Abre en tu navegador: `https://www.quirozendh.com/setup-calendar.html`
   - (O si estás desarrollando localmente: `http://localhost:5173/setup-calendar.html`)

2. **Ingresar credenciales:**
   - Pega tu **Client ID** en el primer campo
   - Pega tu **Client Secret** en el segundo campo
   - Haz clic en **"🔐 Autorizar y Obtener Tokens"**

3. **Autorizar la aplicación:**
   - Se abrirá una ventana de Google
   - Selecciona la cuenta: **quirozendh1@gmail.com**
   - Haz clic en **"Permitir"** o **"Continuar"**
   - Si aparece una advertencia de "App no verificada":
     - Haz clic en **"Avanzadas"**
     - Luego en **"Ir a Quirozen (no seguro)"**

4. **¡Listo!**
   - Verás un mensaje de éxito
   - Los tokens se guardaron automáticamente en tu navegador
   - **No necesitas copiar nada manualmente**

---

## ✅ Paso 5: Verificar que Funciona (2 minutos)

1. **Recargar la aplicación:**
   - Ve a: `https://www.quirozendh.com`
   - Abre la consola del navegador (F12)
   - Deberías ver: `✅ Google Calendar cargado desde localStorage`

2. **Hacer una reserva de prueba:**
   - Ve a la sección "Reservas"
   - Completa el formulario con datos de prueba
   - Haz clic en "Confirmar reserva"

3. **Verificar en Google Calendar:**
   - Abre: https://calendar.google.com/
   - Inicia sesión con: **quirozendh1@gmail.com**
   - Deberías ver el evento de la reserva creado automáticamente

---

## 🎉 ¡Configuración Completa!

Ahora todas las reservas se sincronizarán automáticamente con tu Google Calendar:
- ✅ Se crean automáticamente al hacer una reserva
- ✅ Se actualizan automáticamente al modificar una reserva
- ✅ Se eliminan automáticamente al cancelar una reserva
- ✅ El token se renueva automáticamente (no necesitas hacer nada más)

---

## 🔧 Solución de Problemas

### Error: "App no verificada"
- Es normal para aplicaciones en desarrollo
- Haz clic en "Avanzadas" > "Ir a Quirozen (no seguro)"

### No aparecen eventos en el calendario
- Verifica en la consola del navegador (F12) si hay errores
- Asegúrate de que los tokens se guardaron correctamente
- Verifica que la API de Calendar esté habilitada

### El token expiró
- El sistema lo renueva automáticamente
- Si hay problemas, vuelve a `setup-calendar.html` y autoriza de nuevo

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún problema en algún paso, avísame y te ayudo a resolverlo.

