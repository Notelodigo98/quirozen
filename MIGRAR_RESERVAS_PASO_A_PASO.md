# 🔄 Migrar Reservas del Antiguo Firebase - Guía Paso a Paso

## Opción 1: Script Automático (RECOMENDADO)

### Paso 1: Obtener Configuración del Proyecto Antiguo

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu **proyecto antiguo** (el que tenías antes)
3. Ve a **Project Settings** (⚙️) → **Your apps**
4. Si no tienes una app web, crea una (icono `</>`)
5. Copia la configuración `firebaseConfig`

### Paso 2: Configurar el Script

1. Abre el archivo `migrar-reservas.js`
2. Reemplaza `oldFirebaseConfig` con la configuración de tu proyecto antiguo:

```javascript
const oldFirebaseConfig = {
  apiKey: 'TU_API_KEY_ANTIGUA',
  authDomain: 'tu-proyecto-antiguo.firebaseapp.com',
  projectId: 'tu-proyecto-antiguo',
  // ... resto de la configuración
};
```

### Paso 3: Ejecutar el Script

```bash
node migrar-reservas.js
```

El script:
- ✅ Lee todas las reservas del proyecto antiguo
- ✅ Las copia al proyecto nuevo (quirozenapp)
- ✅ Mantiene todos los datos (nombre, fecha, hora, servicio, etc.)
- ✅ Agrega un campo `migratedAt` para identificar las migradas

---

## Opción 2: Manual desde Firebase Console

### Paso 1: Acceder al Proyecto Antiguo

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu **proyecto antiguo**
3. Ve a **Firestore Database**
4. Busca la colección `reservations`

### Paso 2: Copiar Cada Reserva

Para cada reserva:

1. Haz clic en el documento
2. Copia todos los campos (nombre, fecha, hora, servicio, etc.)
3. Ve a tu **nuevo proyecto** (`quirozenapp`)
4. Ve a **Firestore Database** → Colección `reservations`
5. Haz clic en **"Agregar documento"**
6. Pega los datos
7. Guarda

### Paso 3: Verificar

1. Ve al panel de administración de tu app
2. Verifica que aparezcan las reservas migradas

---

## Opción 3: Exportar/Importar Completo (Para Muchas Reservas)

### Exportar del Proyecto Antiguo

1. Instala Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Inicia sesión:
```bash
firebase login
```

3. Selecciona el proyecto antiguo:
```bash
firebase use tu-proyecto-antiguo
```

4. Exporta Firestore:
```bash
firebase firestore:export ./backup
```

### Importar al Proyecto Nuevo

1. Cambia al proyecto nuevo:
```bash
firebase use quirozenapp
```

2. Importa los datos:
```bash
firebase firestore:import ./backup
```

⚠️ **Nota**: Esto importa TODAS las colecciones. Si solo quieres `reservations`, usa el script.

---

## ¿Qué Opción Elegir?

- **Pocas reservas (< 20)**: Opción 2 (Manual)
- **Muchas reservas (> 20)**: Opción 1 (Script)
- **Todo el proyecto**: Opción 3 (Export/Import)

---

## Después de Migrar

1. Verifica en el panel de administración que aparezcan las reservas
2. Las reservas antiguas NO tendrán eventos en Google Calendar (se crearon antes)
3. Si quieres crear eventos para las reservas antiguas, puedo crear un script para eso

¿Quieres que te ayude a configurar el script con tu proyecto antiguo?


