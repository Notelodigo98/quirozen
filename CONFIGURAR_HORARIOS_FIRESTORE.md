# ⏰ Configurar Horarios en Firestore

## 🎯 Objetivo

Configurar los horarios por defecto en Firestore para que se puedan hacer reservas.

## 📋 Horarios Configurados

- **Lunes a Viernes**: 9:00 - 13:00 y 16:00 - 20:00
- **Sábado**: 9:00 - 13:00
- **Domingo**: Cerrado

## 🚀 Opción 1: Configurar desde la Aplicación (Recomendado)

1. **Abre tu aplicación** en el navegador
2. **Ve a la sección de Administración** (si tienes panel de admin)
3. **Busca "Disponibilidad"** o "Horarios"
4. **Configura los horarios** según tus necesidades
5. **Guarda la configuración**

## 🚀 Opción 2: Configurar Manualmente desde Firebase Console

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona el proyecto **quirozenapp**
3. Ve a **Firestore Database** → **Data**
4. Haz clic en **"Start collection"** (si no existe la colección `availability`)
5. **Collection ID**: `availability`
6. **Document ID**: Deja en blanco (auto-generado) o usa `default`
7. **Agrega estos campos**:

```json
{
  "type": "generic",
  "name": "Horario por defecto",
  "isDefault": true,
  "weeklySchedule": {
    "monday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
    },
    "tuesday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
    },
    "wednesday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
    },
    "thursday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
    },
    "friday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]
    },
    "saturday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"]
    },
    "sunday": {
      "available": false,
      "slots": []
    }
  },
  "createdAt": "2024-11-28T00:00:00.000Z",
  "updatedAt": "2024-11-28T00:00:00.000Z"
}
```

8. Haz clic en **"Save"**

## ✅ Verificar que Funciona

1. Ve a tu aplicación
2. Intenta crear una reserva
3. Deberías ver fechas disponibles en el calendario
4. Al seleccionar una fecha, deberías ver los horarios disponibles

## 🔧 Personalizar Horarios

Si quieres cambiar los horarios:

1. Ve a Firebase Console → Firestore Database → Data
2. Busca el documento en la colección `availability`
3. Edita el campo `weeklySchedule`
4. Modifica los `slots` según tus necesidades
5. Guarda los cambios

## 📝 Notas

- Los slots están en formato `"HH:MM"` (ej: `"09:00"`, `"09:30"`)
- Los slots son cada 30 minutos por defecto
- Puedes agregar más slots si necesitas más opciones
- Si un día tiene `"available": false`, no se podrán hacer reservas ese día

