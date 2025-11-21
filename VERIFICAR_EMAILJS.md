# Verificación de Configuración EmailJS

## Pasos para verificar y completar la configuración

### 1. Verificar en la consola del navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Console**
3. Haz una reserva de prueba
4. Busca mensajes que digan:
   - "EmailJS no está configurado. No se enviará el correo." → Significa que faltan Service ID o Template IDs
   - "Error enviando email..." → Significa que hay un error en la configuración

### 2. Obtener el Service ID

1. Ve a tu dashboard de EmailJS: https://dashboard.emailjs.com/
2. Ve a **Email Services**
3. Verás tu servicio listado (ej: "Quirozen Reservas")
4. Haz clic en el servicio
5. Copia el **Service ID** (es un código como: `service_xxxxxxx`)

### 3. Obtener los Template IDs

1. Ve a **Email Templates** en EmailJS
2. Verás tus templates listados
3. Para cada template, haz clic en él
4. Copia el **Template ID** (es un código como: `template_xxxxxxx`)
5. Necesitas 2 Template IDs:
   - Uno para "Nueva Reserva"
   - Otro para "Modificación de Reserva"

### 4. Verificar que los templates tengan las variables correctas

En cada template, asegúrate de que estén estas variables:
- `{{to_email}}`
- `{{to_name}}`
- `{{reservation_code}}`
- `{{reservation_date}}`
- `{{reservation_time}}`
- `{{reservation_service}}`
- `{{reservation_phone}}`
- `{{reservation_notes}}`
- `{{reservation_status}}`

### 5. Verificar el servicio SMTP

1. Ve a **Email Services** → tu servicio
2. Verifica que:
   - El tipo sea **SMTP** (no Gmail API)
   - El estado esté en **Active** (verde)
   - El email "From" sea correcto

### 6. Probar el servicio

En EmailJS, puedes probar el servicio:
1. Ve a **Email Templates**
2. Selecciona un template
3. Haz clic en **Test** (botón de prueba)
4. Rellena las variables de prueba
5. Haz clic en **Send Test Email**
6. Verifica que llegue el correo

## Errores comunes

### "EmailJS no está configurado"
- **Causa**: Service ID o Template IDs no están configurados
- **Solución**: Actualiza los valores en `src/firebase/emailService.js`

### "Invalid service ID" o "Invalid template ID"
- **Causa**: Los IDs no son correctos
- **Solución**: Verifica que copiaste los IDs correctos desde EmailJS

### "SMTP authentication failed"
- **Causa**: La contraseña de aplicación de Gmail es incorrecta
- **Solución**: Crea una nueva contraseña de aplicación y actualízala en EmailJS

### El correo no llega
- Verifica la carpeta de spam
- Verifica que el email del cliente esté correcto
- Revisa los logs en EmailJS (Dashboard → Logs)

