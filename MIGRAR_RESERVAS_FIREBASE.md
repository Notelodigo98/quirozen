# 🔄 Migrar Reservas del Antiguo Firebase al Nuevo

## Opción 1: Desde Firebase Console (MÁS FÁCIL)

### Paso 1: Acceder al Antiguo Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu **proyecto antiguo** (el que tenías antes de `quirozenapp`)
3. Ve a **Firestore Database**

### Paso 2: Exportar las Reservas

1. En Firestore, busca la colección `reservations` (o el nombre que uses)
2. Haz clic en los **tres puntos (⋯)** junto a la colección
3. Selecciona **"Exportar datos"** o **"Export collection"**
4. O simplemente **copia manualmente** cada documento

### Paso 3: Importar al Nuevo Proyecto

1. Ve a tu **nuevo proyecto** (`quirozenapp`)
2. Ve a **Firestore Database**
3. Crea la colección `reservations` si no existe
4. Para cada reserva:
   - Haz clic en **"Agregar documento"**
   - Pega los datos del documento antiguo
   - Guarda

## Opción 2: Usar Script de Migración (AUTOMÁTICO)

Puedo crear un script que:
1. Se conecte al proyecto antiguo
2. Lea todas las reservas
3. Las copie al nuevo proyecto

¿Quieres que cree este script?

## Opción 3: Exportar/Importar Completo

### Exportar Todo el Proyecto Antiguo

1. Ve a Firebase Console → Proyecto Antiguo
2. Ve a **Project Settings** (⚙️)
3. Busca **"Exportar datos"** o usa **Firebase CLI**:

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Exportar datos del proyecto antiguo
firebase firestore:export gs://[BUCKET_NAME]/backup
```

### Importar al Nuevo Proyecto

```bash
# Cambiar al nuevo proyecto
firebase use quirozenapp

# Importar datos
firebase firestore:import gs://[BUCKET_NAME]/backup
```

## Opción 4: Script Manual con Node.js

Puedo crear un script que:
- Se conecte a ambos proyectos
- Copie todas las reservas automáticamente
- Mantenga los IDs originales o genere nuevos

¿Qué opción prefieres?


