/**
 * Script de ayuda para obtener tokens de Google Calendar
 * 
 * Uso:
 * 1. Configura CLIENT_ID y CLIENT_SECRET abajo
 * 2. Ejecuta: node get-tokens.js
 * 3. Sigue las instrucciones para obtener los tokens
 * 4. Copia los tokens y úsalos en: firebase functions:config:set
 */

const readline = require('readline');
const { google } = require('googleapis');

// ⚠️ CONFIGURA ESTOS VALORES
const CLIENT_ID = '496869168104-m3n1059e2m87a46l6vrlpooitoobk1oq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://www.quirozendh.com/oauth2callback.html';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔑 Script para obtener tokens de Google Calendar\n');
console.log('Este script te ayudará a obtener los tokens necesarios para Firebase Functions.\n');

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' // Forzar consentimiento para obtener refresh token
});

console.log('1. Abre esta URL en tu navegador:');
console.log('\n' + authUrl + '\n');
console.log('2. Autoriza la aplicación con tu cuenta de Google');
console.log('3. Después de autorizar, serás redirigido a una URL que contiene el código');
console.log('4. Copia el código de la URL (el parámetro "code=...")');
console.log('\nEjemplo de URL:');
console.log('https://www.quirozendh.com/oauth2callback.html?code=4/0Aean...');
console.log('                                                      ^^^^^^^^');
console.log('                                                      Este es el código\n');

rl.question('Pega el código aquí: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('\n❌ Error obteniendo token:', err.message);
      rl.close();
      return;
    }

    console.log('\n✅ ¡Tokens obtenidos exitosamente!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Copia estos valores y úsalos en Firebase Functions:\n');
    console.log('firebase functions:config:set \\');
    console.log(`  google.client_id="${CLIENT_ID}" \\`);
    console.log(`  google.client_secret="${CLIENT_SECRET}" \\`);
    console.log(`  google.redirect_uri="${REDIRECT_URI}" \\`);
    console.log(`  google.access_token="${token.access_token}" \\`);
    console.log(`  google.refresh_token="${token.refresh_token}"`);
    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('Después de configurar, despliega las funciones:');
    console.log('  firebase deploy --only functions\n');
    
    rl.close();
  });
});

