# 🔧 Solución Rápida: Error de Permisos de Firestore

## Problema
Estás recibiendo el error: `Missing or insufficient permissions` al intentar guardar o leer datos de la colección `availability`.

## Solución: Actualizar Reglas de Seguridad de Firestore

### Paso 1: Ir a Firebase Console
1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto

### Paso 2: Ir a Firestore Database > Rules
1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en la pestaña **"Rules"** (Reglas)

### Paso 3: Reemplazar las Reglas
Copia y pega estas reglas completas:

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
      
      // Allow update (users can modify their reservations)
      allow update: if true;
      
      // Allow delete (users can cancel their reservations)
      allow delete: if true;
    }
    
    // Availability collection - IMPORTANTE: Esta es la nueva colección
    match /availability/{availabilityId} {
      // Allow read for anyone (users need to check available dates/times)
      allow read: if true;
      
      // Allow create/update/delete (admin operations)
      // Nota: En producción, restringe esto solo a usuarios admin
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }
  }
}
```

### Paso 4: Publicar las Reglas
1. Haz clic en el botón **"Publish"** (Publicar)
2. Espera a que aparezca el mensaje de confirmación

### Paso 5: Verificar
1. Vuelve a tu aplicación
2. Recarga la página (F5)
3. Intenta guardar una configuración de disponibilidad nuevamente

## ⚠️ Importante

Estas reglas permiten acceso público para desarrollo. Para producción, deberías:

1. **Implementar autenticación de admin**: Usar Firebase Authentication y verificar que el usuario sea admin antes de permitir crear/actualizar/eliminar en `availability`.

2. **Restringir escritura en availability**: Solo permitir que los admins puedan modificar la disponibilidad.

### Reglas de Producción (Recomendadas)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    // Reservations collection
    match /reservations/{reservationId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }
    
    // Availability collection - Solo lectura pública, escritura solo para admin
    match /availability/{availabilityId} {
      // Cualquiera puede leer (necesario para ver disponibilidad)
      allow read: if true;
      
      // Solo admins pueden crear/actualizar/eliminar
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

**Nota**: Para usar las reglas de producción, primero necesitarías configurar Firebase Authentication y crear tokens de admin. Por ahora, usa las reglas de desarrollo.

## ¿Sigue sin funcionar?

1. **Verifica que las reglas estén publicadas**: Debe aparecer un mensaje de confirmación
2. **Espera 1-2 minutos**: A veces hay un pequeño retraso en la propagación
3. **Recarga la página completamente**: Ctrl+F5 (o Cmd+Shift+R en Mac)
4. **Verifica que estás usando el proyecto correcto**: Asegúrate de que las variables de entorno apuntan al proyecto correcto
