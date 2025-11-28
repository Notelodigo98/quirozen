// Script para migrar reservas del proyecto antiguo de Firebase al nuevo
// Ejecutar con: node migrar-reservas.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

// ⚠️ CONFIGURACIÓN DEL PROYECTO ANTIGUO
// Obtén estos valores desde Firebase Console → Project Settings → Your apps
const oldFirebaseConfig = {
  apiKey: 'TU_API_KEY_ANTIGUA',
  authDomain: 'tu-proyecto-antiguo.firebaseapp.com',
  projectId: 'tu-proyecto-antiguo',
  storageBucket: 'tu-proyecto-antiguo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123'
};

// ⚠️ CONFIGURACIÓN DEL PROYECTO NUEVO (quirozenapp)
const newFirebaseConfig = {
  apiKey: 'AIzaSyCk4_1vG5Wp7bGZu1_fNrKlIuIsRwZpv4o',
  authDomain: 'quirozenapp.firebaseapp.com',
  projectId: 'quirozenapp',
  storageBucket: 'quirozenapp.firebasestorage.app',
  messagingSenderId: '992779516038',
  appId: '1:992779516038:web:e5d795590c711522f7b907'
};

// Inicializar ambas conexiones
const oldApp = initializeApp(oldFirebaseConfig, 'old');
const newApp = initializeApp(newFirebaseConfig, 'new');

const oldDb = getFirestore(oldApp);
const newDb = getFirestore(newApp);

async function migrarReservas() {
  try {
    console.log('🔄 Iniciando migración de reservas...\n');

    // 1. Leer todas las reservas del proyecto antiguo
    console.log('📖 Leyendo reservas del proyecto antiguo...');
    const oldReservationsRef = collection(oldDb, 'reservations');
    const q = query(oldReservationsRef, orderBy('fecha', 'asc'));
    const oldSnapshot = await getDocs(q);

    if (oldSnapshot.empty) {
      console.log('⚠️ No se encontraron reservas en el proyecto antiguo.');
      return;
    }

    console.log(`✅ Encontradas ${oldSnapshot.docs.length} reservas\n`);

    // 2. Copiar cada reserva al nuevo proyecto
    const newReservationsRef = collection(newDb, 'reservations');
    let successCount = 0;
    let errorCount = 0;

    for (const oldDoc of oldSnapshot.docs) {
      try {
        const reservationData = oldDoc.data();
        
        // Eliminar campos que no queremos copiar (como IDs antiguos)
        const { id, ...dataToCopy } = reservationData;
        
        // Agregar timestamp de migración
        const newReservation = {
          ...dataToCopy,
          migratedAt: new Date().toISOString(),
          originalId: oldDoc.id // Guardar el ID original por si acaso
        };

        // Copiar al nuevo proyecto
        await addDoc(newReservationsRef, newReservation);
        console.log(`✅ Migrada: ${reservationData.nombre} - ${reservationData.fecha} ${reservationData.hora}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrando reserva ${oldDoc.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`   ✅ Migradas exitosamente: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📦 Total: ${oldSnapshot.docs.length}`);

    if (successCount > 0) {
      console.log('\n🎉 ¡Migración completada!');
      console.log('   Las reservas ahora están en el proyecto quirozenapp');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  }
}

// Ejecutar migración
migrarReservas()
  .then(() => {
    console.log('\n✅ Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });


