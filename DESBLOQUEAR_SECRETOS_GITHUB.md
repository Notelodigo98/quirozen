# 🔓 Desbloquear Secretos en GitHub

## ⚠️ Problema

GitHub está bloqueando el push porque detectó secretos (Client ID y Client Secret) en commits anteriores del historial.

## ✅ Solución: Desbloquear en GitHub

**El problema está en un commit anterior** (b8d0ef91e890dfc891158f7607e755b791607f22) que ya está en el historial.

### Opción 1: Desbloquear Manualmente (Recomendado)

1. **Ve a este enlace** y desbloquea el secreto:
   ```
   https://github.com/Notelodigo98/quirozen/security/secret-scanning/unblock-secret/366u8FexvpbF3RqvrRmG0EQRpQL
   ```

2. **Haz clic en "Unblock secret"** o **"Desbloquear secreto"**

3. **Confirma** que es seguro:
   - El Client ID de OAuth es público y seguro de compartir
   - Es necesario para que la aplicación funcione
   - No es un secreto real (a diferencia del Client Secret)

4. **Después de desbloquear**, intenta push de nuevo:
   ```bash
   git push
   ```

### Opción 2: Reescribir Historial (Avanzado)

Si prefieres eliminar completamente los secretos del historial:

```bash
# ⚠️ ADVERTENCIA: Esto reescribe el historial de Git
# Solo hazlo si trabajas solo o todos los colaboradores están de acuerdo

# Ver el commit problemático
git log --oneline | grep b8d0ef

# Eliminar el commit del historial (reemplaza b8d0ef con el hash completo)
git rebase -i b8d0ef^
# En el editor, cambia "pick" por "edit" para el commit b8d0ef
# Luego elimina los secretos y haz: git commit --amend
# Finalmente: git rebase --continue

# Forzar push (solo si trabajas solo)
git push --force
```

**⚠️ NO uses `--force` si otros colaboradores están trabajando en el repositorio.**

## 📝 Nota sobre Seguridad

**Client ID de OAuth:**
- ✅ Es **público** y seguro de compartir
- ✅ Se expone en el frontend de todas formas
- ✅ No es un secreto real

**Client Secret:**
- ❌ Es un secreto real
- ❌ No debe estar en el código
- ✅ Ya lo eliminamos de los archivos actuales

## ✅ Ya Hecho

- ✅ Eliminado Client ID de archivos actuales
- ✅ Eliminado Client Secret de archivos actuales
- ✅ Actualizado `.gitignore` para prevenir futuros problemas
- ✅ Archivos ahora usan placeholders (`TU_CLIENT_ID_AQUI`)

## 🚀 Próximo Paso

**Desbloquea el secreto en GitHub** usando el enlace de arriba, luego intenta `git push` de nuevo.

