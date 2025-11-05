import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

const AVAILABILITY_COLLECTION = 'availability';

// Helper: Generate time slots from time ranges
export const generateTimeSlots = (ranges, slotDuration = 30) => {
  const slots = [];
  ranges.forEach(range => {
    const [startHour, startMin] = range.start.split(':').map(Number);
    const [endHour, endMin] = range.end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    const endTotalMinutes = endHour * 60 + endMin;
    
    while (currentHour * 60 + currentMin < endTotalMinutes) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMin += slotDuration;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }
  });
  
  // Remove duplicates and sort
  return [...new Set(slots)].sort();
};

// Save availability configuration
export const saveAvailability = async (availabilityConfig) => {
  try {
    const data = {
      ...availabilityConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // If it's a default generic config, check if one exists and update instead
    if (availabilityConfig.type === 'generic' && availabilityConfig.isDefault) {
      const existing = await getDefaultGenericConfig();
      if (existing) {
        const docRef = doc(db, AVAILABILITY_COLLECTION, existing.id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date().toISOString()
        });
        return existing.id;
      }
    }
    
    const docRef = await addDoc(collection(db, AVAILABILITY_COLLECTION), data);
    return docRef.id;
  } catch (error) {
    console.error('Error saving availability:', error);
    throw error;
  }
};

// Get all availability configurations
export const getAvailabilityConfigs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, AVAILABILITY_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting availability configs:', error);
    throw error;
  }
};

// Get default generic configuration
export const getDefaultGenericConfig = async () => {
  try {
    const q = query(
      collection(db, AVAILABILITY_COLLECTION),
      where('type', '==', 'generic'),
      where('isDefault', '==', true)
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
    console.error('Error getting default generic config:', error);
    throw error;
  }
};

// Get availability for a specific date
export const getAvailabilityForDate = async (dateString) => {
  try {
    const date = new Date(dateString);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    
    // First, check for specific configurations that include this date
    const allConfigs = await getAvailabilityConfigs();
    const specificConfigs = allConfigs.filter(config => config.type === 'specific');
    
    for (const config of specificConfigs) {
      if (config.dateRange) {
        const startDate = new Date(config.dateRange.start);
        const endDate = new Date(config.dateRange.end);
        const checkDate = new Date(dateString);
        
        // Check if date falls within range
        if (checkDate >= startDate && checkDate <= endDate) {
          if (!config.available) {
            return { available: false, slots: [], reason: config.reason || 'Fecha bloqueada' };
          }
          if (config.slots && config.slots.length > 0) {
            return { available: true, slots: config.slots, reason: config.reason || 'Horario especial' };
          }
        }
      }
    }
    
    // If no specific config, use generic schedule
    const genericConfig = await getDefaultGenericConfig();
    if (!genericConfig || !genericConfig.weeklySchedule) {
      return { available: false, slots: [], reason: 'No hay configuración de disponibilidad' };
    }
    
    const daySchedule = genericConfig.weeklySchedule[dayOfWeek];
    if (!daySchedule || !daySchedule.available) {
      return { available: false, slots: [], reason: 'Día no disponible' };
    }
    
    return {
      available: true,
      slots: daySchedule.slots || [],
      reason: null
    };
  } catch (error) {
    console.error('Error getting availability for date:', error);
    throw error;
  }
};

// Helper: Get availability for a date using pre-loaded configs (optimized)
const getAvailabilityForDateWithConfigs = (dateString, allConfigs, genericConfig) => {
  const date = new Date(dateString);
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  
  // First, check for specific configurations that include this date
  const specificConfigs = allConfigs.filter(config => config.type === 'specific');
  
  for (const config of specificConfigs) {
    if (config.dateRange) {
      const startDate = new Date(config.dateRange.start);
      const endDate = new Date(config.dateRange.end);
      const checkDate = new Date(dateString);
      
      // Check if date falls within range
      if (checkDate >= startDate && checkDate <= endDate) {
        if (!config.available) {
          return { available: false, slots: [], reason: config.reason || 'Fecha bloqueada' };
        }
        if (config.slots && config.slots.length > 0) {
          return { available: true, slots: config.slots, reason: config.reason || 'Horario especial' };
        }
      }
    }
  }
  
  // If no specific config, use generic schedule
  if (!genericConfig || !genericConfig.weeklySchedule) {
    return { available: false, slots: [], reason: 'No hay configuración de disponibilidad' };
  }
  
  const daySchedule = genericConfig.weeklySchedule[dayOfWeek];
  if (!daySchedule || !daySchedule.available) {
    return { available: false, slots: [], reason: 'Día no disponible' };
  }
  
  return {
    available: true,
    slots: daySchedule.slots || [],
    reason: null
  };
};

// Get available dates in a range (OPTIMIZED - single Firestore query)
export const getAvailableDatesInRange = async (startDate, endDate) => {
  try {
    // Load all configurations ONCE (single Firestore query)
    const allConfigs = await getAvailabilityConfigs();
    
    // Load generic config ONCE (single Firestore query)
    const genericConfig = await getDefaultGenericConfig();
    
    // Now process all dates in memory (no more Firestore queries)
    const availableDates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);
    
    // Reset time to avoid timezone issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);
    
    while (current <= end) {
      const dateString = current.toISOString().split('T')[0];
      const availability = getAvailabilityForDateWithConfigs(dateString, allConfigs, genericConfig);
      
      if (availability.available) {
        availableDates.push({
          date: dateString,
          slots: availability.slots
        });
      }
      current.setDate(current.getDate() + 1);
    }
    
    return availableDates;
  } catch (error) {
    console.error('Error getting available dates in range:', error);
    throw error;
  }
};

// Check if a specific date/time slot is available
export const checkSlotAvailability = async (date, time) => {
  try {
    const availability = await getAvailabilityForDate(date);
    if (!availability.available) {
      return false;
    }
    return availability.slots.includes(time);
  } catch (error) {
    console.error('Error checking slot availability:', error);
    return false;
  }
};

// Delete availability configuration
export const deleteAvailabilityConfig = async (configId) => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, configId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting availability config:', error);
    throw error;
  }
};

// Update availability configuration
export const updateAvailabilityConfig = async (configId, updatedData) => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, configId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating availability config:', error);
    throw error;
  }
};

// Get available slots for a date, considering existing reservations
export const getAvailableSlots = async (dateString, reservationsForDate = []) => {
  try {
    // Get availability configuration for the date
    const availability = await getAvailabilityForDate(dateString);
    
    if (!availability.available) {
      return { available: false, slots: [], reason: availability.reason };
    }
    
    // Filter out booked slots
    const bookedSlots = reservationsForDate
      .filter(r => r.estado !== 'cancelada') // Don't count canceled reservations
      .map(r => r.hora);
    
    const freeSlots = availability.slots.filter(slot => !bookedSlots.includes(slot));
    
    return {
      available: true,
      slots: freeSlots,
      reason: availability.reason
    };
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw error;
  }
};
