# 🔧 Actualizar Variables de Entorno con Nuevas Credenciales

## ✅ Credenciales del Nuevo Proyecto (quirozenapp)

```javascript
apiKey: "AIzaSyCk4_1vG5Wp7bGZu1_fNrKlIuIsRwZpv4o"
authDomain: "quirozenapp.firebaseapp.com"
projectId: "quirozenapp"
storageBucket: "quirozenapp.firebasestorage.app"
messagingSenderId: "992779516038"
appId: "1:992779516038:web:e5d795590c711522f7b907"
```

## 📝 Variables de Entorno a Actualizar

Actualiza estas variables en tu plataforma de hosting:

```env
VITE_FIREBASE_API_KEY=AIzaSyCk4_1vG5Wp7bGZu1_fNrKlIuIsRwZpv4o
VITE_FIREBASE_AUTH_DOMAIN=quirozenapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quirozenapp
VITE_FIREBASE_STORAGE_BUCKET=quirozenapp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=992779516038
VITE_FIREBASE_APP_ID=1:992779516038:web:e5d795590c711522f7b907
```

## 🚀 Dónde Actualizar

### Si usas Vercel:
1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Actualiza cada variable una por una
4. Haz clic en **Save**
5. **Redeploy** tu aplicación

### Si usas Netlify:
1. Ve a tu proyecto en Netlify
2. **Site settings** → **Environment variables**
3. Actualiza cada variable
4. Haz clic en **Save**
5. **Trigger deploy** → **Clear cache and deploy site**

### Si usas archivo .env local:
Crea/actualiza `.env` en la raíz del proyecto:
```env
VITE_FIREBASE_API_KEY=AIzaSyCk4_1vG5Wp7bGZu1_fNrKlIuIsRwZpv4o
VITE_FIREBASE_AUTH_DOMAIN=quirozenapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quirozenapp
VITE_FIREBASE_STORAGE_BUCKET=quirozenapp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=992779516038
VITE_FIREBASE_APP_ID=1:992779516038:web:e5d795590c711522f7b907
```

Luego reinicia tu servidor de desarrollo:
```bash
npm run dev
```

## ✅ Verificar que Funciona

1. Despliega con las nuevas variables
2. Crea una reserva de prueba
3. Verifica en Firebase Console → Firestore Database que aparezca la reserva

## 📋 Próximos Pasos

Después de actualizar las variables:
1. ✅ Configurar Firestore Database (si no lo has hecho)
2. ✅ Configurar reglas de seguridad
3. ✅ Continuar con `firebase init` para Firebase Functions

