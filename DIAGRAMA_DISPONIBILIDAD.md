# Diagrama de Flujo: Sistema de Disponibilidad

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Panel de Gestión de Disponibilidad               │  │
│  │                                                       │  │
│  │  • Configurar horarios genéricos (por día semana)   │  │
│  │  • Configurar fechas específicas                    │  │
│  │  • Bloquear/desbloquear fechas                      │  │
│  │  • Vista de calendario visual                       │  │
│  └───────────────────┬─────────────────────────────────┘  │
│                      │                                      │
│                      ▼                                      │
│          ┌───────────────────────┐                         │
│          │   Firestore Database  │                         │
│          │                       │                         │
│          │  Collection:          │                         │
│          │  - availability       │                         │
│          │  - reservations       │                         │
│          └───────────┬───────────┘                         │
└──────────────────────┼─────────────────────────────────────┘
                       │
                       │ Consulta disponibilidad
                       │
┌──────────────────────┼─────────────────────────────────────┐
│                      ▼                                      │
│          ┌───────────────────────┐                         │
│          │  Formulario Reservas  │                         │
│          │                       │                         │
│          │  • Calendario con     │                         │
│          │    solo fechas disp.  │                         │
│          │  • Horas disponibles  │                         │
│          │    según fecha        │                         │
│          │  • Validación final   │                         │
│          └───────────────────────┘                         │
│                    USUARIO                                  │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Verificación de Disponibilidad

```
Usuario selecciona FECHA
        │
        ▼
┌───────────────────────┐
│ getAvailabilityForDate│
│      (fecha)          │
└───────────┬───────────┘
            │
            ▼
    ┌───────────────┐
    │ ¿Existe config│
    │ específica?   │
    └───┬───────┬───┘
        │ SÍ    │ NO
        ▼       ▼
┌─────────────┐ ┌──────────────┐
│ Usar config │ │ Usar horario │
│ específica  │ │ genérico por │
│             │ │ día semana   │
└──────┬──────┘ └──────┬───────┘
       │               │
       └───────┬───────┘
               ▼
    ┌──────────────────┐
    │ Obtener slots    │
    │ configurados     │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Obtener reservas │
    │ del día          │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Filtrar slots    │
    │ ocupados         │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Mostrar solo     │
    │ slots libres     │
    └──────────────────┘
```

## Estructura de Datos - Ejemplo

### Configuración Genérica
```json
{
  "id": "default",
  "type": "generic",
  "name": "Horario por defecto",
  "weeklySchedule": {
    "monday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
                "12:00", "12:30", "16:00", "16:30", "17:00", "17:30",
                "18:00", "18:30", "19:00", "19:30"]
    },
    "tuesday": { "available": true, "slots": [...] },
    "wednesday": { "available": false, "slots": [] },
    "saturday": {
      "available": true,
      "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
                "12:00", "12:30", "13:00"]
    },
    "sunday": { "available": false, "slots": [] }
  }
}
```

### Configuración Específica
```json
{
  "id": "navidad-2024",
  "type": "specific",
  "name": "Vacaciones Navidad",
  "dateRange": {
    "start": "2024-12-23",
    "end": "2024-12-27"
  },
  "available": false,
  "reason": "Vacaciones"
}
```

### Fecha Específica con Horario Reducido
```json
{
  "id": "nochevieja-2024",
  "type": "specific",
  "name": "Nochevieja",
  "dateRange": {
    "start": "2024-12-31",
    "end": "2024-12-31"
  },
  "available": true,
  "slots": ["09:00", "10:00", "11:00"]
}
```

## Prioridad de Configuraciones

```
1. Fecha específica con horario especial (máxima prioridad)
   ↓
2. Fecha específica bloqueada
   ↓
3. Rango de fechas con configuración
   ↓
4. Horario genérico por día de semana (menor prioridad)
   ↓
5. Si no hay configuración → No disponible
```

## Componentes UI - Estructura

```
App.jsx
  │
  ├── AdminPanel
  │     │
  │     └── AvailabilityManager (NUEVO)
  │           │
  │           ├── AvailabilityList (Lista de configuraciones)
  │           │
  │           ├── GenericScheduleEditor (Editor horarios genéricos)
  │           │     │
  │           │     ├── DayScheduleEditor (Editor por día)
  │           │     │     │
  │           │     │     ├── TimeRangeSelector (Selector rangos)
  │           │     │     └── SlotPreview (Vista previa slots)
  │           │     │
  │           │     └── WeeklyScheduleView (Vista semanal)
  │           │
  │           ├── SpecificDateEditor (Editor fechas específicas)
  │           │     │
  │           │     ├── DateRangePicker (Selector rango fechas)
  │           │     └── BlockDateForm (Formulario bloqueo)
  │           │
  │           └── AvailabilityCalendar (Calendario visual)
  │
  └── ReservationForm (MODIFICAR)
        │
        ├── DatePicker (NUEVO - Calendario)
        │     └── Solo muestra fechas disponibles
        │
        └── TimeSlotSelector (MODIFICAR)
              └── Carga horas según fecha seleccionada
```

## Estados del Sistema

### Estado 1: Sin Configuración
```
Usuario intenta reservar
  ↓
No hay configuración
  ↓
Mensaje: "No hay disponibilidad configurada"
  ↓
Redirigir a admin a configurar
```

### Estado 2: Configuración Genérica
```
Usuario selecciona fecha
  ↓
Consultar día de semana
  ↓
Aplicar horario genérico
  ↓
Filtrar slots ocupados
  ↓
Mostrar disponibilidad
```

### Estado 3: Configuración Específica
```
Usuario selecciona fecha
  ↓
Buscar configuraciones específicas
  ↓
Aplicar configuración específica (sobrescribe genérica)
  ↓
Filtrar slots ocupados
  ↓
Mostrar disponibilidad
```

### Estado 4: Fecha Bloqueada
```
Usuario intenta seleccionar fecha
  ↓
Fecha bloqueada detectada
  ↓
Deshabilitar fecha en calendario
  ↓
Mostrar tooltip: "Fecha no disponible"
```

## Casos de Uso

### Caso 1: Admin configura horario semanal
```
1. Admin abre Panel → Disponibilidad
2. Click "Configurar Horario Genérico"
3. Marca días disponibles
4. Selecciona rangos de horas por día
5. Guarda configuración
6. Sistema genera slots automáticamente
7. Disponible inmediatamente en formulario
```

### Caso 2: Admin bloquea día festivo
```
1. Admin abre Panel → Disponibilidad
2. Click "Nueva Configuración Específica"
3. Selecciona fecha (ej: 25 Dic)
4. Marca "Bloquear día completo"
5. Agrega motivo: "Navidad"
6. Guarda
7. Fecha desaparece del calendario de reservas
```

### Caso 3: Admin reduce horario en fecha específica
```
1. Admin selecciona fecha (ej: 31 Dic)
2. Click "Horario especial"
3. Selecciona solo horas: 09:00, 10:00, 11:00
4. Guarda
5. Usuarios solo verán esas 3 horas disponibles
```

### Caso 4: Usuario reserva
```
1. Usuario abre formulario
2. Ve calendario (solo fechas disponibles)
3. Selecciona fecha
4. Sistema carga horas disponibles (filtradas)
5. Usuario selecciona hora
6. Antes de guardar, verifica disponibilidad final
7. Si disponible → guarda
8. Si ocupado → muestra error
```

## Validaciones en Tiempo Real

```
┌─────────────────────┐
│ Usuario en formulario│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Selecciona fecha    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Query disponibilidad│ ← Puede cambiar mientras usuario llena form
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Selecciona hora     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Click "Reservar"    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Verificación FINAL  │ ← Doble verificación
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
    SÍ │         │ NO
      ▼         ▼
┌──────────┐ ┌──────────────┐
│ Guardar  │ │ Error:       │
│ reserva  │ │ "Ya ocupado" │
└──────────┘ └──────────────┘
```
