# ⏰ Configurar Horarios - Guía Rápida

## 🚀 Opción 1: Usar la Herramienta Web (MÁS FÁCIL)

1. **Abre tu navegador** y ve a:
   ```
   https://www.quirozendh.com/configurar-horarios.html
   ```
   
   O si estás en desarrollo local:
   ```
   http://localhost:5173/configurar-horarios.html
   ```

2. **Haz clic en "🚀 Configurar Horarios"**

3. **Espera el mensaje de éxito** ✅

4. **¡Listo!** Ya puedes hacer reservas.

---

## 🎛️ Opción 2: Desde el Panel de Administración

1. **Inicia sesión** en tu aplicación como administrador

2. **Ve a la pestaña "Disponibilidad"** en el panel de administración

3. **Configura los horarios** para cada día de la semana:
   - Lunes a Viernes: 9:00 - 13:00 y 16:00 - 20:00
   - Sábado: 9:00 - 13:00
   - Domingo: Cerrado

4. **Guarda los cambios**

---

## 📋 Horarios por Defecto

Si usas la herramienta web, se configurarán estos horarios:

- **Lunes a Viernes**: 
  - Mañana: 9:00 - 13:00 (cada 30 minutos)
  - Tarde: 16:00 - 20:00 (cada 30 minutos)

- **Sábado**: 
  - Mañana: 9:00 - 13:00 (cada 30 minutos)

- **Domingo**: 
  - Cerrado

---

## ✅ Verificar que Funciona

1. Ve a la página de reservas
2. Selecciona una fecha
3. Deberías ver las horas disponibles en el selector
4. Si no ves horas, los horarios no están configurados

---

## 🔧 Si Hay Problemas

### Error: "No hay configuración de disponibilidad"
- Los horarios no están configurados
- Usa la Opción 1 (herramienta web) para configurarlos

### No aparecen horas disponibles
- Verifica que el día seleccionado tenga horarios configurados
- Verifica que no esté todo el día bloqueado por reservas existentes

### Error al acceder a la herramienta web
- Verifica que el archivo `public/configurar-horarios.html` exista
- Verifica que Firebase esté configurado correctamente

---

## 📝 Nota

Los horarios se guardan en Firestore en la colección `availability` con:
- `type: "generic"`
- `isDefault: true`

Puedes modificarlos después desde el panel de administración.
