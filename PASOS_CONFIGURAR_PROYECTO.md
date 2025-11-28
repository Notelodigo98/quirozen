# 📋 Pasos para Configurar tu Proyecto Firebase

## ✅ Tu Proyecto Actual
- **Nombre**: quirozenapp
- **ID**: quirozenapp
- **Número**: 992779516038

## 🔧 Paso 1: Configurar Ubicación Predeterminada

1. En la página donde estás (Project settings), busca la sección **"Default GCP resource location"** o **"Ubicación predeterminada de los recursos de GCP"**
2. Si dice **"Not set"** o **"Sin especificar"**, haz clic en **"Select location"** o **"Seleccionar ubicación"**
3. Elige: **`europe-west`** o **`europe-west1`** (Bélgica) - Recomendado para España
4. Haz clic en **"Done"** o **"Guardar"**

## 🔥 Paso 2: Crear Firestore Database

1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Create database"**
3. Selecciona:
   - **Edición**: Standard
   - **ID**: (default)
   - **Ubicación**: Ahora deberías poder seleccionar (elige `europe-west` o la que configuraste)
4. Haz clic en **"Enable"** o **"Habilitar"**
5. Espera 30-60 segundos mientras se crea

## 📱 Paso 3: (Opcional) Registrar App Web

Si quieres, puedes registrar tu app web ahora:
1. Haz clic en el ícono **`</>`** (Web)
2. Ingresa un nombre: "Quirozen Web"
3. Haz clic en **"Register app"**
4. **NO necesitas** copiar el código ahora (ya lo tienes configurado)

## ✅ Paso 4: Volver a la Terminal

Una vez que Firestore esté creado, vuelve a la terminal y ejecuta:

```bash
firebase init
```

Cuando te pregunte:
- ✅ Selecciona: **"Use an existing project"**
- ✅ Selecciona: **quirozenapp**
- ✅ Selecciona: **Functions** y **Firestore** (presiona Espacio para seleccionar ambos)
- ✅ Para Functions: **JavaScript**
- ✅ Para ESLint: **No** (ya está configurado)
- ✅ Para instalar dependencias: **Yes**

---

## 🎯 Resumen de lo que necesitas hacer AHORA:

1. ✅ Configurar ubicación predeterminada (si no está configurada)
2. ✅ Crear Firestore Database
3. ✅ Volver a terminal y ejecutar `firebase init`

