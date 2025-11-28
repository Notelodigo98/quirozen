# 🔒 Solución: GitHub Rechazó el Push por Secretos Detectados

## ❌ Problema

GitHub detectó secretos (credenciales) en tu código y rechazó el push por seguridad.

## ✅ Solución

### Paso 1: Desbloquear el Secreto en GitHub

1. Ve al enlace que GitHub te dio:
   ```
   https://github.com/Notelodigo98/quirozen/security/secret-scanning/unblock-secret/366u8GuHADL2YqYrMNvu4CHXYkf
   ```
2. Haz clic en **"Unblock secret"** o **"Desbloquear secreto"**
3. Confirma que es seguro (son credenciales públicas de Firebase, no secretos reales)

### Paso 2: Eliminar Secretos del Historial (Si es necesario)

Si el secreto ya está en el historial de Git, necesitas eliminarlo:

```bash
# Ver qué archivos tienen secretos
git log --all --full-history --source -- "*client_secret*"

# Si hay archivos con secretos, elimínalos del historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch *client_secret*.json" \
  --prune-empty --tag-name-filter cat -- --all
```

### Paso 3: Asegurar que .gitignore Está Actualizado

Ya actualicé tu `.gitignore` para excluir:
- Archivos `*client_secret*.json`
- Archivos `.env`
- Archivos de Firebase

### Paso 4: Verificar Archivos Antes de Hacer Commit

**NO subas estos archivos a Git:**
- ❌ `client_secret_*.json`
- ❌ `.env` (con valores reales)
- ❌ Archivos con tokens reales

**SÍ puedes subir:**
- ✅ Archivos de documentación (con valores de ejemplo)
- ✅ Código con placeholders (`TU_CLIENT_ID_AQUI`)

### Paso 5: Hacer Commit y Push Nuevamente

```bash
# Ver qué archivos se van a subir
git status

# Si hay archivos con secretos, elimínalos del staging
git reset HEAD *client_secret*.json
git reset HEAD .env

# Asegúrate de que .gitignore los excluya
git add .gitignore

# Haz commit
git commit -m "Actualizar configuración y eliminar secretos"

# Intenta push de nuevo
git push
```

## 🔐 Nota sobre Seguridad

**Credenciales de Firebase (apiKey, etc.) son públicas:**
- ✅ Es seguro compartirlas en el código
- ✅ Se exponen en el frontend de todas formas
- ✅ No son secretos reales

**NO son seguros:**
- ❌ Client Secret de Google OAuth
- ❌ Access Tokens
- ❌ Refresh Tokens
- ❌ Service Account Keys

## ✅ Ya Hecho

- ✅ Actualizado `.gitignore` para excluir secretos
- ✅ Actualizado `functions/get-tokens.js` para usar variables de entorno
- ✅ Actualizado documentación para no incluir valores reales

## 🚀 Próximos Pasos

1. Desbloquea el secreto en GitHub (Paso 1)
2. Verifica que no hay archivos con secretos en staging
3. Haz commit y push nuevamente

