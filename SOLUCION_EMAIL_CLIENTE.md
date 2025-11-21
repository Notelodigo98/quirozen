# Solución: El correo llega a Quirozen pero no al cliente

## Problema
El correo está llegando a tu email (quirozen) pero no al email del cliente.

## Causa
El template de EmailJS no tiene configurado el campo "To Email" (destinatario) para usar la variable `{{to_email}}`.

## Solución

### Paso 1: Editar el template en EmailJS

1. Ve a tu dashboard de EmailJS: https://dashboard.emailjs.com/admin/template
2. Selecciona el template "Nueva Reserva" (o el que estés usando)
3. Busca el campo **"To Email"** o **"To"** en la configuración del template
4. **Escribe exactamente**: `{{to_email}}`
   - Esto hará que EmailJS use el email del cliente como destinatario
5. Guarda el template

### Paso 2: Verificar el template de modificación

1. Selecciona el template "Modificación de Reserva"
2. Asegúrate de que el campo **"To Email"** tenga: `{{to_email}}`
3. Guarda el template

### Paso 3: Verificar otras configuraciones

En cada template, verifica:
- **To Email**: `{{to_email}}` ← **MUY IMPORTANTE**
- **From Name**: `Quirozen` (o el nombre que prefieras)
- **From Email**: Tu email de Gmail (el que configuraste en SMTP)
- **Subject**: Puede incluir variables como `Confirmación de Reserva - {{reservation_code}}`

### Paso 4: Probar de nuevo

1. Haz una nueva reserva de prueba
2. El correo debería llegar al email del cliente (el que ingresó en el formulario)
3. También deberías recibir una copia si lo configuraste así

## Nota importante

Si el campo "To Email" está vacío o tiene tu email hardcodeado, todos los correos llegarán a ti en lugar de al cliente. Por eso es crucial usar `{{to_email}}` para que sea dinámico.

