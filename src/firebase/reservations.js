import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc,
  orderBy 
} from 'firebase/firestore';
import { db } from './config';
// Google Calendar ahora se maneja desde Firebase Functions (backend)
// No necesitamos importar las funciones del cliente
import { sendReservationEmail, sendReservationUpdateEmail } from './emailService';

const RESERVATIONS_COLLECTION = 'reservations';

// Generate a unique reservation code
export const generateReservationCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Save a new reservation
export const saveReservation = async (reservation, serviciosList = []) => {
  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
      ...reservation,
      createdAt: new Date().toISOString()
    });
    
    // Google Calendar event se creará automáticamente desde Firebase Functions
    // cuando se detecte la nueva reserva en Firestore
    console.log('✅ Reserva guardada. El evento de Google Calendar se creará automáticamente desde el servidor.');
    
    // Send confirmation email
    try {
      await sendReservationEmail(reservation);
    } catch (emailError) {
      // Log error but don't fail the reservation save
      console.warn('Error sending confirmation email:', emailError);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
};

// Get all reservations
export const getReservations = async () => {
  try {
    const q = query(collection(db, RESERVATIONS_COLLECTION), orderBy('fecha', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting reservations:', error);
    throw error;
  }
};

// Get reservation by code
export const getReservationByCode = async (code) => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('code', '==', code.toUpperCase())
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting reservation by code:', error);
    throw error;
  }
};

// Update a reservation
export const updateReservation = async (code, updatedData, serviciosList = []) => {
  try {
    const reservation = await getReservationByCode(code);
    if (!reservation || !reservation.id) {
      return false;
    }
    
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, reservation.id);
    
    // Remove serviciosList from updatedData before saving to Firestore
    const { serviciosList, ...dataToSave } = updatedData;
    await updateDoc(reservationRef, dataToSave);
    
    // Google Calendar event se actualizará automáticamente desde Firebase Functions
    // cuando se detecte el cambio en Firestore
    console.log('✅ Reserva actualizada. El evento de Google Calendar se actualizará automáticamente desde el servidor.');
    
    // Send update confirmation email
    try {
      const updatedReservation = { ...reservation, ...updatedData };
      await sendReservationUpdateEmail(updatedReservation);
    } catch (emailError) {
      // Log error but don't fail the reservation update
      console.warn('Error sending update email:', emailError);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
};

// Delete a reservation
export const deleteReservation = async (code) => {
  try {
    const reservation = await getReservationByCode(code);
    if (!reservation || !reservation.id) {
      return false;
    }
    
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, reservation.id);
    await deleteDoc(reservationRef);
    
    // Google Calendar event se eliminará automáticamente desde Firebase Functions
    // cuando se detecte la eliminación en Firestore
    console.log('✅ Reserva eliminada. El evento de Google Calendar se eliminará automáticamente desde el servidor.');
    
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

// Get reservations by status (client-side sorting to avoid Firestore index requirements)
export const getReservationsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('estado', '==', status)
    );
    const querySnapshot = await getDocs(q);
    const reservations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort client-side
    return reservations.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } catch (error) {
    console.error('Error getting reservations by status:', error);
    throw error;
  }
};

// Get reservations by date
export const getReservationsByDate = async (dateString) => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('fecha', '==', dateString)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting reservations by date:', error);
    throw error;
  }
};
