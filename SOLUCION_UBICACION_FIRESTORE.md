# 🔧 Solución: No puedo seleccionar ubicación en Firestore

## ❌ Problema
El campo de ubicación está deshabilitado o no puedes escribir en él.

## ✅ Solución

Necesitas configurar primero la **ubicación predeterminada del proyecto** antes de crear Firestore.

### Paso 1: Ir a Configuración del Proyecto

1. En Firebase Console, haz clic en el **ícono de engranaje (⚙️)** en la esquina superior izquierda
2. Selecciona **"Project settings"** o **"Configuración del proyecto"**

### Paso 2: Configurar Ubicación Predeterminada

1. En la pestaña **"General"** o **"General"**
2. Desplázate hacia abajo hasta encontrar: **"Default GCP resource location"** o **"Ubicación predeterminada de los recursos de GCP"**
3. Si dice "Not set" o "No configurada", haz clic en **"Select location"** o **"Seleccionar una ubicación"**
4. Elige una ubicación:
   - **Para España/Europa**: `europe-west` o `europe-west1` (Bélgica)
   - **Para América**: `us-central` (Iowa)
5. Haz clic en **"Done"** o **"Hecho"**

### Paso 3: Volver a Crear Firestore

1. Ve a **"Firestore Database"** en el menú lateral
2. Haz clic en **"Create database"** de nuevo
3. Ahora deberías poder seleccionar la ubicación

## 📍 Ubicaciones Recomendadas

- **España/Europa**: `europe-west` o `europe-west1` (Bélgica)
- **América del Norte**: `us-central` (Iowa, USA)
- **América del Sur**: `southamerica-east1` (São Paulo, Brasil)

## ⚠️ Importante

- La ubicación **NO se puede cambiar después**
- Elige la más cercana a tus usuarios
- Si la mayoría de tus usuarios están en España, elige `europe-west`

---

## 🆘 Si Aún No Funciona

1. **Refresca la página** (F5)
2. **Cierra y vuelve a abrir** Firebase Console
3. **Verifica** que hayas guardado la ubicación predeterminada
4. Si sigue sin funcionar, intenta desde otro navegador

