# Configuración de EmailJS para Envío de Correos

## ¿Qué es EmailJS?

EmailJS es un servicio gratuito que permite enviar correos electrónicos directamente desde el frontend sin necesidad de un servidor backend. Ofrece un plan gratuito con 200 emails/mes.

## Pasos para Configurar EmailJS

### 1. Crear cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar un servicio de email

**IMPORTANTE:** Para evitar problemas de permisos con Gmail, usa **SMTP** en lugar de Gmail API.

1. En el dashboard de EmailJS, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona **SMTP** (NO selecciones Gmail API)
4. Configura SMTP con tu cuenta de Gmail:
   - **Service Name**: Quirozen Reservas (o el nombre que prefieras)
   - **SMTP Server**: smtp.gmail.com
   - **SMTP Port**: 587
   - **SMTP Username**: tu email de Gmail (ej: quirozendh1@gmail.com)
   - **SMTP Password**: Necesitas crear una "Contraseña de aplicación" de Gmail:
     
     **Cómo crear una contraseña de aplicación de Gmail:**
     1. Ve a tu cuenta de Google: https://myaccount.google.com/
     2. Ve a **Seguridad** → **Verificación en 2 pasos** (debe estar activada)
     3. Busca **Contraseñas de aplicaciones**
     4. Selecciona **Correo** y **Otro (personalizado)** → escribe "EmailJS"
     5. Copia la contraseña de 16 caracteres generada
     6. Pégala en el campo **SMTP Password** de EmailJS
   
   - **From Name**: Quirozen (o el nombre que prefieras)
   - **From Email**: tu email de Gmail
5. Haz clic en **Create Service**
6. **Guarda el Service ID** (lo necesitarás después)

### 3. Crear templates de email

#### Template para Nueva Reserva:

1. Ve a **Email Templates** → **Create New Template**
2. Nombre: "Nueva Reserva"
3. **IMPORTANTE**: En la sección "To Email" (destinatario), escribe: `{{to_email}}`
   - Esto hará que el correo se envíe al email del cliente
   - Si no configuras esto, el correo se enviará a tu email por defecto
4. En "From Name" puedes poner: `Quirozen`
5. En "From Email" pon tu email (el que configuraste en SMTP)
6. Usa este contenido para el cuerpo del email:

```
Asunto: Confirmación de Reserva - Quirozen

Hola {{to_name}},

Tu reserva ha sido confirmada con éxito.

Detalles de tu reserva:
- Código de reserva: {{reservation_code}}
- Fecha: {{reservation_date}}
- Hora: {{reservation_time}}
- Servicio: {{reservation_service}}
- Teléfono: {{reservation_phone}}
- Notas: {{reservation_notes}}
- Estado: {{reservation_status}}

Guarda este código para modificar o cancelar tu reserva.

Gracias por confiar en Quirozen.

Saludos,
Equipo Quirozen
```

4. **Guarda el Template ID** (lo necesitarás después)

#### Template para Modificación de Reserva:

1. Crea otro template: "Modificación de Reserva"
2. **IMPORTANTE**: En la sección "To Email" (destinatario), escribe: `{{to_email}}`
   - Esto hará que el correo se envíe al email del cliente
   - Si no configuras esto, el correo se enviará a tu email por defecto
3. En "From Name" puedes poner: `Quirozen`
4. En "From Email" pon tu email (el que configuraste en SMTP)
5. Usa este contenido para el cuerpo del email:

```
Asunto: Reserva Modificada - Quirozen

Hola {{to_name}},

Tu reserva ha sido modificada correctamente.

Nuevos detalles de tu reserva:
- Código de reserva: {{reservation_code}}
- Fecha: {{reservation_date}}
- Hora: {{reservation_time}}
- Servicio: {{reservation_service}}
- Teléfono: {{reservation_phone}}
- Notas: {{reservation_notes}}
- Estado: {{reservation_status}}

Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo Quirozen
```

3. **Guarda el Template ID** (lo necesitarás después)

### 4. Obtener Public Key

1. Ve a **Account** → **General**
2. Copia tu **Public Key**

### 5. Configurar en la aplicación

Edita el archivo `src/firebase/emailService.js` y reemplaza:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Reemplaza con tu Service ID
const EMAILJS_TEMPLATE_ID_NEW = 'YOUR_TEMPLATE_ID_NEW'; // Reemplaza con el Template ID de "Nueva Reserva"
const EMAILJS_TEMPLATE_ID_UPDATE = 'YOUR_TEMPLATE_ID_UPDATE'; // Reemplaza con el Template ID de "Modificación de Reserva"
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Reemplaza con tu Public Key
```

## Variables disponibles en los templates

- `{{to_email}}` - Email del cliente
- `{{to_name}}` - Nombre del cliente
- `{{reservation_code}}` - Código de reserva
- `{{reservation_date}}` - Fecha de la reserva (DD/MM/YYYY)
- `{{reservation_time}}` - Hora de la reserva (HH:MM)
- `{{reservation_service}}` - Servicio reservado
- `{{reservation_phone}}` - Teléfono del cliente
- `{{reservation_notes}}` - Notas adicionales
- `{{reservation_status}}` - Estado de la reserva

## Solución al error "412Gmail_API: Request had insufficient authentication scopes"

Si ves este error, significa que estás intentando usar Gmail API en lugar de SMTP. 

**Solución:**
1. Elimina el servicio de Gmail API que creaste
2. Crea un nuevo servicio usando **SMTP** (no Gmail API)
3. Sigue los pasos de la sección 2 usando SMTP con contraseña de aplicación

**Alternativa si prefieres no usar Gmail:**
- Puedes usar **Outlook/Hotmail** con SMTP
- O cualquier otro proveedor de email que soporte SMTP
- Los pasos son similares, solo cambia el servidor SMTP

## Notas importantes

- El plan gratuito permite 200 emails/mes
- Los emails se envían desde tu cuenta de email configurada
- Si no configuras EmailJS, las reservas funcionarán normalmente pero no se enviarán correos
- Los errores de email no afectan el guardado de reservas
- **Usa SMTP en lugar de Gmail API** para evitar problemas de permisos

