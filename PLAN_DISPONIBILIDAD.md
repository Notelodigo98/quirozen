# Plan de Implementación: Sistema de Gestión de Disponibilidad

## Objetivo
Permitir que el administrador configure la disponibilidad de días/horas de forma intuitiva (genérica y específica), y que el formulario de reservas muestre solo las fechas y horas disponibles.

---

## PASO 1: Diseño del Modelo de Datos en Firestore

### 1.1 Crear Colección `availability` en Firestore

**Estructura de datos:**

```javascript
// Documento: "default" (Horarios genéricos)
{
  type: "generic", // o "specific"
  name: "Horario por defecto",
  
  // Horarios por día de la semana
  weeklySchedule: {
    monday: { available: true, slots: ["09:00", "09:30", "10:00", ...] },
    tuesday: { available: true, slots: ["09:00", "09:30", ...] },
    wednesday: { available: false, slots: [] },
    thursday: { available: true, slots: [...] },
    friday: { available: true, slots: [...] },
    saturday: { available: true, slots: ["09:00", "10:00", ...] },
    sunday: { available: false, slots: [] }
  },
  
  // Rangos de fechas para horarios específicos
  dateRange: null, // o { start: "2024-12-01", end: "2024-12-31" }
  
  // Fechas específicas bloqueadas o con horarios especiales
  specificDates: [
    {
      date: "2024-12-25", // Navidad
      available: false,
      reason: "Día festivo"
    },
    {
      date: "2024-12-31",
      available: true,
      slots: ["09:00", "10:00"] // Horario reducido
    }
  ],
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 1.2 Consideraciones
- Permitir múltiples configuraciones de disponibilidad
- Prioridad: específico > genérico
- Los slots pueden ser de 30 minutos (09:00, 09:30, 10:00, etc.)

---

## PASO 2: Crear Funciones Firebase para Gestión de Disponibilidad

### 2.1 Crear archivo `src/firebase/availability.js`

**Funciones necesarias:**

```javascript
// Guardar configuración de disponibilidad
export const saveAvailability = async (availabilityConfig)

// Obtener todas las configuraciones
export const getAvailabilityConfigs = async ()

// Obtener disponibilidad para una fecha específica
export const getAvailabilityForDate = async (date)

// Obtener todas las fechas disponibles en un rango
export const getAvailableDatesInRange = async (startDate, endDate)

// Verificar si una fecha/hora específica está disponible
export const checkSlotAvailability = async (date, time)

// Eliminar configuración
export const deleteAvailabilityConfig = async (configId)
```

### 2.2 Lógica de Prioridad
1. Buscar configuraciones específicas para la fecha
2. Si no hay específica, usar horario genérico según día de la semana
3. Verificar fechas bloqueadas
4. Verificar slots ya reservados

---

## PASO 3: Panel de Administración - Gestión de Disponibilidad

### 3.1 Nuevo Componente: `AvailabilityManager`

**Funcionalidades:**

#### 3.1.1 Vista Principal
- Lista de configuraciones existentes
- Botón "Nueva Configuración"
- Botones para editar/eliminar cada configuración

#### 3.1.2 Formulario de Configuración Genérica
```
📅 Configuración Genérica (Horario por Defecto)

Lunes:    [✓] Disponible  [Horarios: 09:00-13:00, 16:00-20:00] [Editar]
Martes:   [✓] Disponible  [Horarios: 09:00-13:00, 16:00-20:00] [Editar]
Miércoles: [ ] No disponible
Jueves:   [✓] Disponible  [Horarios: 09:00-13:00, 16:00-20:00] [Editar]
Viernes:  [✓] Disponible  [Horarios: 09:00-13:00, 16:00-20:00] [Editar]
Sábado:   [✓] Disponible  [Horarios: 09:00-14:00] [Editar]
Domingo:  [ ] No disponible

[Guardar Configuración]
```

#### 3.1.3 Editor de Horarios por Día
- Checkbox para habilitar/deshabilitar día
- Selector de rangos de horas (mañana/tarde)
- Vista previa de slots generados
- Botones para agregar/eliminar horas manualmente

#### 3.1.4 Configuración Específica de Fechas
```
📅 Configuración Específica

Nombre: [Vacaciones Navidad]
Tipo: [ ] Rango de fechas  [✓] Fecha única

Fecha inicio: [2024-12-23]
Fecha fin:    [2024-12-27]

[✓] Día completo bloqueado
[ ] Horario especial:
    [Horarios: 10:00, 11:00, 12:00]

[Guardar]
```

#### 3.1.5 Calendario Visual de Disponibilidad
- Vista de calendario mensual
- Colores: Verde (disponible), Rojo (bloqueado), Amarillo (horario reducido)
- Click en fecha para editar específicamente

---

## PASO 4: Actualizar Formulario de Reservas

### 4.1 Componente: `ReservationForm` (modificar)

#### 4.1.1 Selector de Fecha Mejorado
- Calendario visual (usar biblioteca como `react-datepicker` o similar)
- Solo mostrar fechas disponibles
- Deshabilitar fechas bloqueadas
- Indicar fechas con horarios reducidos

#### 4.1.2 Selector de Hora Dinámico
- Cargar horas disponibles según la fecha seleccionada
- Si se cambia la fecha, actualizar horas disponibles
- Mostrar mensaje si no hay horas disponibles
- Deshabilitar horas ya reservadas

#### 4.1.3 Validación
- Verificar disponibilidad antes de enviar
- Mostrar error si alguien más reservó el slot mientras llenaba el formulario

---

## PASO 5: Sistema de Verificación de Disponibilidad

### 5.1 Verificar Disponibilidad al Seleccionar Fecha
```javascript
// Cuando usuario selecciona fecha
const availableSlots = await getAvailabilityForDate(selectedDate);
// Filtra slots ya reservados
const freeSlots = availableSlots.filter(slot => !isSlotReserved(date, slot));
```

### 5.2 Verificar Disponibilidad al Reservar
```javascript
// Antes de guardar reserva
const isAvailable = await checkSlotAvailability(date, time);
if (!isAvailable) {
  throw new Error('Este horario ya no está disponible');
}
```

### 5.3 Función para Combinar Disponibilidad y Reservas
```javascript
// Obtener slots disponibles considerando:
// 1. Configuración de disponibilidad
// 2. Reservas existentes
export const getAvailableSlots = async (date) => {
  // Obtener horarios configurados
  const schedule = await getAvailabilityForDate(date);
  
  // Obtener reservas del día
  const reservations = await getReservationsByDate(date);
  
  // Filtrar slots ocupados
  const bookedSlots = reservations.map(r => r.hora);
  
  return schedule.slots.filter(slot => !bookedSlots.includes(slot));
}
```

---

## PASO 6: UI/UX - Componentes Visuales

### 6.1 Componente de Calendario
- **Opción A**: Implementar calendario propio (más control)
- **Opción B**: Usar biblioteca como `react-datepicker` o `react-calendar`
- Mostrar indicadores visuales de disponibilidad

### 6.2 Editor de Horarios
- Interfaz intuitiva tipo reloj/timeline
- Drag & drop para ajustar horarios
- Vista previa en tiempo real

### 6.3 Selector de Rangos
- Sliders para seleccionar horas
- Checkboxes para días de la semana
- Vista previa de slots generados

---

## PASO 7: Funcionalidades Avanzadas (Opcional)

### 7.1 Plantillas de Horarios
- Guardar configuraciones como plantillas
- Aplicar plantilla a diferentes períodos
- Ejemplo: "Horario Verano", "Horario Navidad"

### 7.2 Repetición de Horarios
- Configurar horarios que se repiten (semanalmente, mensualmente)
- Copiar horario de una semana a otra

### 7.3 Bloqueos Masivos
- Bloquear múltiples fechas a la vez
- Importar fechas desde CSV/Excel
- Integración con calendario de Google (festivos)

### 7.4 Notificaciones
- Avisar al admin si se reserva un slot fuera de horario normal
- Recordatorios de fechas bloqueadas próximas

---

## PASO 8: Optimización y Performance

### 8.1 Caché de Disponibilidad
- Cachear disponibilidad de fechas próximas
- Invalidar caché cuando admin cambia configuración
- Usar local storage o React context

### 8.2 Carga Lazy
- Cargar disponibilidad solo cuando se necesita
- Cargar rango de fechas visibles en calendario
- Paginación en vista de admin

### 8.3 Optimización de Queries
- Índices en Firestore para búsquedas por fecha
- Agregación de datos para reducir lecturas
- Batch operations para actualizaciones masivas

---

## PASO 9: Testing y Validación

### 9.1 Casos de Prueba
- ✅ Crear configuración genérica
- ✅ Crear configuración específica
- ✅ Bloquear fecha completa
- ✅ Horario reducido en fecha específica
- ✅ Prioridad específico > genérico
- ✅ Reservar slot disponible
- ✅ Intentar reservar slot bloqueado
- ✅ Intentar reservar slot ya ocupado
- ✅ Actualizar disponibilidad y ver cambios en tiempo real

### 9.2 Validaciones
- No permitir solapamiento de horarios
- Validar formato de fechas/horas
- Verificar coherencia de rangos de fechas
- Prevenir borrado accidental de configuraciones

---

## PASO 10: Documentación y Deployment

### 10.1 Documentación para Admin
- Guía de uso del sistema de disponibilidad
- Ejemplos de configuraciones comunes
- Solución de problemas

### 10.2 Actualizar README
- Documentar nueva funcionalidad
- Instrucciones de configuración inicial

### 10.3 Migración de Datos
- Script para migrar horarios existentes a nuevo formato
- Backup antes de migración

---

## Orden de Implementación Recomendado

1. **FASE 1 (Fundamentos)**:
   - Paso 1: Modelo de datos
   - Paso 2: Funciones Firebase básicas
   - Paso 5: Verificación básica de disponibilidad

2. **FASE 2 (Admin Panel)**:
   - Paso 3: Componente AvailabilityManager básico
   - Paso 6: UI para editar horarios genéricos

3. **FASE 3 (Formulario de Reservas)**:
   - Paso 4: Actualizar formulario con disponibilidad
   - Mejorar selector de fecha/hora

4. **FASE 4 (Funcionalidades Específicas)**:
   - Configuraciones específicas por fecha
   - Calendario visual en admin

5. **FASE 5 (Pulido)**:
   - Paso 7: Funcionalidades avanzadas
   - Paso 8: Optimizaciones
   - Paso 9: Testing completo
   - Paso 10: Documentación

---

## Tecnologías Sugeridas

- **Calendario**: `react-datepicker` o `react-calendar`
- **Gestión de Estado**: React Context o Zustand (para caché de disponibilidad)
- **Validación**: Valida disponibilidad en tiempo real
- **UI Components**: Reutilizar componentes existentes del proyecto

---

## Notas Importantes

1. **Persistencia**: Todas las configuraciones se guardan en Firestore
2. **Tiempo Real**: Considerar usar Firestore listeners para actualizaciones en tiempo real
3. **Zona Horaria**: Manejar correctamente las zonas horarias
4. **Idioma**: Mantener todo en español
5. **Responsive**: Asegurar que funcione en móviles

---

## Estimación de Tiempo

- **Fase 1**: 2-3 días
- **Fase 2**: 3-4 días
- **Fase 3**: 2-3 días
- **Fase 4**: 2-3 días
- **Fase 5**: 1-2 días

**Total**: ~10-15 días de desarrollo
