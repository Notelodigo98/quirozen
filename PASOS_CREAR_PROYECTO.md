# 📋 Pasos para Crear Proyecto Firebase

## ✅ Paso 1: Crear Proyecto en Firebase Console

1. **Abre tu navegador** y ve a: https://console.firebase.google.com/
2. **Haz clic en "Add project"** (o "Crear un proyecto" si está en español)
3. **Ingresa un nombre**: `quirozen-reservations` (o el que prefieras)
4. **Haz clic en "Continue"**
5. **Google Analytics**: Puedes desactivarlo si quieres (no es necesario)
6. **Haz clic en "Create project"**
7. **Espera 30-60 segundos** mientras se crea el proyecto
8. **Haz clic en "Continue"** cuando termine

## ✅ Paso 2: Habilitar Firestore

1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Create database"**
3. Selecciona **"Start in test mode"** (por ahora)
4. Elige una ubicación (ej: `europe-west` o `us-central`)
5. Haz clic en **"Enable"**

## ✅ Paso 3: Volver a la Terminal

Una vez creado el proyecto, vuelve a la terminal y ejecuta:

```bash
firebase init
```

Cuando te pregunte:
- ✅ Selecciona: **"Use an existing project"**
- ✅ Selecciona el proyecto que acabas de crear
- ✅ Selecciona: **Functions** y **Firestore** (presiona Espacio para seleccionar)
- ✅ Para Functions: selecciona **JavaScript**
- ✅ Para ESLint: puedes decir **"No"** (ya está configurado)
- ✅ Para instalar dependencias: di **"Yes"**

## ✅ Paso 4: Continuar con la Configuración

Después de `firebase init`, continúa con los pasos de `COSTOS_Y_PASOS_MANUALES.md`:
- Obtener tokens
- Configurar tokens
- Desplegar funciones

---

## 🆘 Si Tienes Problemas

**Error: "No projects found"**
- Asegúrate de haber creado el proyecto en Firebase Console primero
- Verifica que estés usando la misma cuenta de Google que usaste en `firebase login`

**Error: "Project already exists"**
- El proyecto ya existe, solo necesitas asociarlo:
  ```bash
  firebase use [NOMBRE_DEL_PROYECTO]
  ```

