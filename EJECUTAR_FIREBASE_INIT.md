# 🔥 Ejecutar firebase init

## ✅ Estado Actual

- ✅ Proyecto Firebase creado: `quirozenapp`
- ✅ Variables de entorno actualizadas
- ⏳ Falta inicializar Firebase en el directorio local

## 🚀 Ejecutar firebase init

Ejecuta este comando en la terminal:

```bash
firebase init
```

## 📋 Selecciones durante firebase init

Cuando te pregunte, selecciona:

1. **"Which Firebase features do you want to set up?"**
   - ✅ Presiona **Espacio** para seleccionar: **Functions** y **Firestore**
   - ✅ Presiona **Enter** para confirmar

2. **"Please select an option:"**
   - ✅ Selecciona: **"Use an existing project"**
   - ✅ Selecciona: **quirozenapp**

3. **"What language would you like to use to write Cloud Functions?"**
   - ✅ Selecciona: **JavaScript**

4. **"Do you want to use ESLint to catch probable bugs and enforce style?"**
   - ✅ Selecciona: **No** (ya está configurado)

5. **"Do you want to install dependencies with npm now?"**
   - ✅ Selecciona: **Yes**

6. **"What file should be used for Firestore Rules?"**
   - ✅ Presiona **Enter** (usa el default: `firestore.rules`)

7. **"What file should be used for Firestore indexes?"**
   - ✅ Presiona **Enter** (usa el default: `firestore.indexes.json`)

## ✅ Después de firebase init

Una vez completado, tendrás:
- ✅ Archivo `firebase.json` creado
- ✅ Archivo `.firebaserc` creado
- ✅ Directorio `functions/` configurado
- ✅ Dependencias instaladas

## 🚀 Próximos Pasos

Después de `firebase init`:
1. Configurar tokens de Google Calendar
2. Desplegar Firebase Functions: `firebase deploy --only functions`

