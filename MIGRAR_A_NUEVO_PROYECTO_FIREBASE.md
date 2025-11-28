# 🔄 Migrar al Nuevo Proyecto Firebase (quirozenapp)

## ✅ Situación Actual

- **Proyecto antiguo**: Ya tienes Firebase configurado con variables de entorno
- **Proyecto nuevo**: `quirozenapp` (ID: quirozenapp)
- **Pregunta**: ¿Usar el nuevo proyecto o cambiar correo del antiguo?

## 🎯 Opción 1: Usar el Nuevo Proyecto (Recomendado)

### Ventajas:
- ✅ Proyecto limpio y nuevo
- ✅ Puedes usar tu correo actual
- ✅ Todo centralizado en un solo proyecto
- ✅ Más fácil de gestionar

### Pasos:

#### 1. Obtener Credenciales del Nuevo Proyecto

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona el proyecto **quirozenapp**
3. Haz clic en el **ícono de engranaje (⚙️)** → **"Project settings"**
4. Desplázate hasta **"Your apps"**
5. Si no hay app web, haz clic en el ícono **`</>`** (Web)
6. Registra la app con nombre: **"Quirozen Web"**
7. **Copia los valores** que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "quirozenapp.firebaseapp.com",
  projectId: "quirozenapp",
  storageBucket: "quirozenapp.appspot.com",
  messagingSenderId: "992779516038",
  appId: "1:992779516038:web:..."
};
```

#### 2. Actualizar Variables de Entorno

Necesitas actualizar las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.):

**Si usas Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Actualiza estas variables:
   - `VITE_FIREBASE_API_KEY` = (nuevo apiKey)
   - `VITE_FIREBASE_AUTH_DOMAIN` = `quirozenapp.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID` = `quirozenapp`
   - `VITE_FIREBASE_STORAGE_BUCKET` = `quirozenapp.appspot.com`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = `992779516038`
   - `VITE_FIREBASE_APP_ID` = (nuevo appId)

**Si usas Netlify:**
1. Site settings → Environment variables
2. Actualiza las mismas variables

**Si usas archivo .env local:**
Crea/actualiza `.env` en la raíz del proyecto:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=quirozenapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quirozenapp
VITE_FIREBASE_STORAGE_BUCKET=quirozenapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=992779516038
VITE_FIREBASE_APP_ID=1:992779516038:web:...
```

#### 3. Configurar Firestore en el Nuevo Proyecto

1. Ve a **Firestore Database** en el nuevo proyecto
2. Crea la base de datos (si no la has creado)
3. Configura las reglas de seguridad (copia las del proyecto antiguo)

#### 4. (Opcional) Migrar Datos del Proyecto Antiguo

Si tienes reservas en el proyecto antiguo y quieres migrarlas:

**Exportar del proyecto antiguo:**
1. Ve al proyecto antiguo en Firebase Console
2. Firestore Database → Settings → Export
3. Descarga la exportación

**Importar al nuevo proyecto:**
1. Ve al proyecto nuevo (quirozenapp)
2. Firestore Database → Settings → Import
3. Sube el archivo exportado

---

## 🔄 Opción 2: Cambiar Correo del Proyecto Antiguo

**⚠️ NO es posible cambiar el correo del proyecto**, pero puedes:

1. **Agregar tu correo como colaborador:**
   - Project settings → Users and permissions
   - Add user → Ingresa tu correo
   - Rol: Owner o Editor

2. **Usar el proyecto antiguo con tu correo:**
   - Solo necesitas acceso al proyecto
   - No necesitas cambiar el correo del propietario

---

## 🎯 Recomendación

**Usa el nuevo proyecto (quirozenapp)** porque:
- ✅ Es más limpio
- ✅ Tienes control total
- ✅ Es más fácil configurar Firebase Functions
- ✅ No hay confusión con proyectos antiguos

---

## 📋 Checklist para Migrar

- [ ] Obtener credenciales del nuevo proyecto (quirozenapp)
- [ ] Actualizar variables de entorno en hosting (Vercel/Netlify)
- [ ] Crear Firestore Database en el nuevo proyecto
- [ ] Configurar reglas de seguridad
- [ ] (Opcional) Exportar datos del proyecto antiguo
- [ ] (Opcional) Importar datos al nuevo proyecto
- [ ] Probar que las reservas funcionan
- [ ] Configurar Firebase Functions en el nuevo proyecto

---

## 🆘 ¿Necesitas Ayuda?

Si tienes dudas sobre:
- **Dónde están las variables de entorno**: Depende de tu plataforma de hosting
- **Cómo exportar datos**: Firebase Console → Firestore → Settings → Export
- **Configurar reglas**: Copia las reglas del proyecto antiguo

