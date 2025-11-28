# 🔥 Continuar Configuración de Firestore

## ✅ Lo que ya tienes hecho

- ✅ Proyecto Firebase creado: `quirozenapp`
- ✅ Variables de entorno actualizadas
- ✅ Credenciales de Firebase obtenidas

## 🔧 Paso 1: Verificar que Firestore esté creado

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona el proyecto **quirozenapp**
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Si ya está creado, verás la base de datos
5. Si no está creado, haz clic en **"Create database"**:
   - Selecciona **"Start in test mode"**
   - Elige ubicación: `europe-west` (o la que prefieras)
   - Haz clic en **"Enable"**

## 🔒 Paso 2: Configurar Reglas de Seguridad

1. En Firestore Database, haz clic en la pestaña **"Rules"**
2. Reemplaza las reglas con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reservations collection
    match /reservations/{reservationId} {
      // Allow read for anyone (users need to read their reservations by code)
      allow read: if true;
      
      // Allow create for anyone (users can make reservations)
      allow create: if true;
      
      // Allow update for anyone (users can update their reservations)
      allow update: if true;
      
      // Allow delete for anyone (users can cancel their reservations)
      allow delete: if true;
    }
    
    // Availability collection
    match /availability/{availabilityId} {
      // Allow read for anyone (users need to check available dates/times)
      allow read: if true;
      
      // Allow create/update/delete for anyone (admin operations)
      // Note: In production, restrict this to admin users only
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }
    
    // Servicios collection (si la usas)
    match /servicios/{servicioId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }
  }
}
```

3. Haz clic en **"Publish"** para guardar las reglas

## ✅ Paso 3: Verificar que Funciona

1. Ve a tu aplicación (local o producción)
2. Crea una reserva de prueba
3. Vuelve a Firebase Console → Firestore Database → Data
4. Deberías ver la reserva en la colección `reservations`

## 🚀 Paso 4: Continuar con Firebase Functions

Una vez que Firestore esté funcionando, continúa con:

```bash
firebase init
```

Y selecciona:
- ✅ **"Use an existing project"**
- ✅ Selecciona: **quirozenapp**
- ✅ Selecciona: **Functions** y **Firestore** (presiona Espacio para ambos)
- ✅ Para Functions: **JavaScript**
- ✅ Para ESLint: **No** (ya está configurado)
- ✅ Para instalar dependencias: **Yes**

## 📋 Checklist

- [ ] Firestore Database creado
- [ ] Reglas de seguridad configuradas y publicadas
- [ ] Reserva de prueba creada y visible en Firestore
- [ ] `firebase init` ejecutado
- [ ] Dependencias instaladas en `functions/`

