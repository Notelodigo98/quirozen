# 🔥 Crear Proyecto Firebase

Tienes dos opciones:

## Opción 1: Crear Proyecto desde Firebase Console (Recomendado)

1. **Ve a Firebase Console**: https://console.firebase.google.com/
2. **Haz clic en "Add project"** o "Crear un proyecto"
3. **Ingresa un nombre** (ej: "quirozen-reservations")
4. **Continúa el setup**:
   - Puedes desactivar Google Analytics si quieres
   - Selecciona la ubicación más cercana a tus usuarios
5. **Haz clic en "Create project"**
6. **Espera a que se cree** (30-60 segundos)

## Opción 2: Crear Proyecto desde CLI

Ejecuta:
```bash
firebase projects:create quirozen-reservations
```

Luego asocia el proyecto:
```bash
firebase use quirozen-reservations
```

## Después de Crear el Proyecto

Una vez creado, vuelve a ejecutar:
```bash
firebase init
```

Y selecciona:
- ✅ **Use an existing project**
- Selecciona el proyecto que acabas de crear
- ✅ **Functions** y **Firestore**

## Nota Importante

Si ya tienes un proyecto Firebase configurado en tu aplicación (con variables de entorno), usa ese mismo proyecto. Solo necesitas asociarlo con Firebase CLI.

