// Script rápido para configurar horarios en Firestore
// Ejecutar con: node configurar-horarios-rapido.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCk4_1vG5Wp7bGZu1_fNrKlIuIsRwZpv4o',
  authDomain: 'quirozenapp.firebaseapp.com',
  projectId: 'quirozenapp',
  storageBucket: 'quirozenapp.firebasestorage.app',
  messagingSenderId: '992779516038',
  appId: '1:992779516038:web:e5d795590c711522f7b907'
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generar slots de tiempo
function generateTimeSlots(startHour, startMin, endHour, endMin) {
  const slots = [];
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    slots.push(timeString);
    
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }
  
  return slots;
}

// Configuración de horarios por defecto
const defaultSchedule = {
  type: 'generic',
  name: 'Horario por defecto',
  isDefault: true,
  weeklySchedule: {
    monday: {
      available: true,
      slots: [
        ...generateTimeSlots(9, 0, 13, 0),
        ...generateTimeSlots(16, 0, 20, 0)
      ]
    },
    tuesday: {
      available: true,
      slots: [
        ...generateTimeSlots(9, 0, 13, 0),
        ...generateTimeSlots(16, 0, 20, 0)
      ]
    },
    wednesday: {
      available: true,
      slots: [
        ...generateTimeSlots(9, 0, 13, 0),
        ...generateTimeSlots(16, 0, 20, 0)
      ]
    },
    thursday: {
      available: true,
      slots: [
        ...generateTimeSlots(9, 0, 13, 0),
        ...generateTimeSlots(16, 0, 20, 0)
      ]
    },
    friday: {
      available: true,
      slots: [
        ...generateTimeSlots(9, 0, 13, 0),
        ...generateTimeSlots(16, 0, 20, 0)
      ]
    },
    saturday: {
      available: true,
      slots: generateTimeSlots(9, 0, 13, 0)
    },
    sunday: {
      available: false,
      slots: []
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function configurarHorarios() {
  try {
    console.log('🔍 Verificando si ya existen horarios...');
    
    // Verificar si ya existe
    const q = query(
      collection(db, 'availability'),
      where('type', '==', 'generic'),
      where('isDefault', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Actualizar existente
      const existingDoc = querySnapshot.docs[0];
      const docRef = doc(db, 'availability', existingDoc.id);
      
      await updateDoc(docRef, {
        ...defaultSchedule,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Horarios actualizados exitosamente!');
      console.log(`   ID del documento: ${existingDoc.id}`);
    } else {
      // Crear nuevo
      const docRef = await addDoc(collection(db, 'availability'), defaultSchedule);
      
      console.log('✅ Horarios configurados exitosamente!');
      console.log(`   ID del documento: ${docRef.id}`);
    }
    
    console.log('\n📋 Horarios configurados:');
    console.log('   Lunes a Viernes: 9:00 - 13:00 y 16:00 - 20:00');
    console.log('   Sábado: 9:00 - 13:00');
    console.log('   Domingo: Cerrado');
    console.log('\n🎉 ¡Listo! Ya puedes hacer reservas.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error configurando horarios:', error);
    process.exit(1);
  }
}

configurarHorarios();

