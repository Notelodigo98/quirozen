import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

const CLIENTES_COLLECTION = 'clientes';
const BONOS_COLLECTION = 'bonos';

// ============================================
// CLIENTES
// ============================================

/**
 * Guarda un nuevo cliente
 */
export const saveCliente = async (clienteData) => {
  try {
    const cliente = {
      ...clienteData,
      fechaCreacion: Timestamp.now(),
      fechaActualizacion: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, CLIENTES_COLLECTION), cliente);
    return { id: docRef.id, ...cliente };
  } catch (error) {
    console.error('Error saving cliente:', error);
    throw error;
  }
};

/**
 * Obtiene todos los clientes
 */
export const getClientes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CLIENTES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting clientes:', error);
    throw error;
  }
};

/**
 * Obtiene un cliente por ID
 */
export const getClienteById = async (clienteId) => {
  try {
    const clienteRef = doc(db, CLIENTES_COLLECTION, clienteId);
    const clienteSnap = await getDoc(clienteRef);
    if (!clienteSnap.exists()) return null;
    return { id: clienteSnap.id, ...clienteSnap.data() };
  } catch (error) {
    console.error('Error getting cliente:', error);
    throw error;
  }
};

/**
 * Actualiza un cliente
 */
export const updateCliente = async (clienteId, clienteData) => {
  try {
    const clienteRef = doc(db, CLIENTES_COLLECTION, clienteId);
    await updateDoc(clienteRef, {
      ...clienteData,
      fechaActualizacion: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating cliente:', error);
    throw error;
  }
};

/**
 * Elimina un cliente
 */
export const deleteCliente = async (clienteId) => {
  try {
    await deleteDoc(doc(db, CLIENTES_COLLECTION, clienteId));
    return true;
  } catch (error) {
    console.error('Error deleting cliente:', error);
    throw error;
  }
};

// ============================================
// BONOS
// ============================================

/**
 * Asigna un bono a un cliente
 */
export const asignarBono = async (bonoData) => {
  try {
    const bono = {
      ...bonoData,
      sesionesConsumidas: 0,
      fechaAsignacion: Timestamp.now(),
      fechaActualizacion: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, BONOS_COLLECTION), bono);
    return { id: docRef.id, ...bono };
  } catch (error) {
    console.error('Error asignando bono:', error);
    throw error;
  }
};

/**
 * Obtiene todos los bonos
 */
export const getBonos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, BONOS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting bonos:', error);
    throw error;
  }
};

/**
 * Obtiene bonos de un cliente específico
 */
export const getBonosByCliente = async (clienteId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, BONOS_COLLECTION), where('clienteId', '==', clienteId))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting bonos by cliente:', error);
    throw error;
  }
};

/**
 * Registra una sesión consumida
 */
export const consumirSesion = async (bonoId, notas = '') => {
  try {
    const bonoRef = doc(db, BONOS_COLLECTION, bonoId);
    const bonoSnap = await getDoc(bonoRef);
    
    if (!bonoSnap.exists()) {
      throw new Error('Bono no encontrado');
    }
    
    const bonoData = bonoSnap.data();
    const nuevasSesionesConsumidas = (bonoData.sesionesConsumidas || 0) + 1;
    
    if (nuevasSesionesConsumidas > bonoData.totalSesiones) {
      throw new Error('No se pueden consumir más sesiones de las disponibles');
    }
    
    await updateDoc(bonoRef, {
      sesionesConsumidas: nuevasSesionesConsumidas,
      fechaActualizacion: Timestamp.now(),
      ultimaSesion: Timestamp.now(),
      notas: notas || bonoData.notas || ''
    });
    
    return true;
  } catch (error) {
    console.error('Error consumiendo sesión:', error);
    throw error;
  }
};

/**
 * Actualiza un bono
 */
export const updateBono = async (bonoId, bonoData) => {
  try {
    const bonoRef = doc(db, BONOS_COLLECTION, bonoId);
    await updateDoc(bonoRef, {
      ...bonoData,
      fechaActualizacion: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating bono:', error);
    throw error;
  }
};

/**
 * Elimina un bono
 */
export const deleteBono = async (bonoId) => {
  try {
    await deleteDoc(doc(db, BONOS_COLLECTION, bonoId));
    return true;
  } catch (error) {
    console.error('Error deleting bono:', error);
    throw error;
  }
};

