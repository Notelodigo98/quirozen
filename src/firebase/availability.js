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
// serviceName: optional, if provided, checks if this specific service is blocked
export const getAvailabilityForDate = async (dateString, serviceName = null) => {
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
          // Check if this service is blocked by this config
          const blockedServices = config.blockedServices || [];
          const blocksAll = blockedServices.length === 0 || blockedServices.includes('ALL');
          const blocksThisService = blocksAll || (serviceName && blockedServices.includes(serviceName));
          
          // If service is specified and this config doesn't block it, skip this config
          if (serviceName && !blocksThisService) {
            continue;
          }
          
          // If service is specified and this config blocks it, or if no service specified and config blocks all
          if (blocksThisService || (!serviceName && blocksAll)) {
            if (!config.available) {
              return { available: false, slots: [], reason: config.reason || 'Fecha bloqueada' };
            }
            if (config.slots && config.slots.length > 0) {
              return { available: true, slots: config.slots, reason: config.reason || 'Horario especial' };
            }
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
    
    // Collect all slots from different sources
    let slots = [];
    
    // 1. Generate slots from ranges if available (preferred method)
    if (daySchedule.ranges && Array.isArray(daySchedule.ranges) && daySchedule.ranges.length > 0) {
      const rangeSlots = generateTimeSlots(daySchedule.ranges, 30);
      slots = [...slots, ...rangeSlots];
    }
    
    // 2. Add existing slots if they exist (fallback or additional)
    if (daySchedule.slots && Array.isArray(daySchedule.slots) && daySchedule.slots.length > 0) {
      slots = [...slots, ...daySchedule.slots];
    }
    
    // 3. Always add urgency slots if they exist
    if (daySchedule.urgencyRanges && Array.isArray(daySchedule.urgencyRanges) && daySchedule.urgencyRanges.length > 0) {
      const urgencySlots = generateTimeSlots(daySchedule.urgencyRanges, 30);
      slots = [...slots, ...urgencySlots];
    }
    
    // Remove duplicates and sort
    slots = [...new Set(slots)].sort();
    
    // Debug: Log slots for troubleshooting
    if (slots.length === 0) {
      console.warn(`No slots found for ${dayOfWeek}. Schedule:`, daySchedule);
    }
    
    return {
      available: true,
      slots: slots,
      reason: null
    };
  } catch (error) {
    console.error('Error getting availability for date:', error);
    throw error;
  }
};

// Helper: Get availability for a date using pre-loaded configs (optimized)
// serviceName: optional, if provided, checks if this specific service is blocked
const getAvailabilityForDateWithConfigs = (dateString, allConfigs, genericConfig, serviceName = null) => {
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
        // Check if this service is blocked by this config
        const blockedServices = config.blockedServices || [];
        const blocksAll = blockedServices.length === 0 || blockedServices.includes('ALL');
        const blocksThisService = blocksAll || (serviceName && blockedServices.includes(serviceName));
        
        // If service is specified and this config doesn't block it, skip this config
        if (serviceName && !blocksThisService) {
          continue;
        }
        
        // If service is specified and this config blocks it, or if no service specified and config blocks all
        if (blocksThisService || (!serviceName && blocksAll)) {
          if (!config.available) {
            return { available: false, slots: [], reason: config.reason || 'Fecha bloqueada' };
          }
          if (config.slots && config.slots.length > 0) {
            return { available: true, slots: config.slots, reason: config.reason || 'Horario especial' };
          }
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
  
  // Collect all slots from different sources
  let slots = [];
  
  // 1. Generate slots from ranges if available (preferred method)
  if (daySchedule.ranges && Array.isArray(daySchedule.ranges) && daySchedule.ranges.length > 0) {
    const rangeSlots = generateTimeSlots(daySchedule.ranges, 30);
    slots = [...slots, ...rangeSlots];
  }
  
  // 2. Add existing slots if they exist (fallback or additional)
  if (daySchedule.slots && Array.isArray(daySchedule.slots) && daySchedule.slots.length > 0) {
    slots = [...slots, ...daySchedule.slots];
  }
  
  // 3. Always add urgency slots if they exist
  if (daySchedule.urgencyRanges && Array.isArray(daySchedule.urgencyRanges) && daySchedule.urgencyRanges.length > 0) {
    const urgencySlots = generateTimeSlots(daySchedule.urgencyRanges, 30);
    slots = [...slots, ...urgencySlots];
  }
  
  // Remove duplicates and sort
  slots = [...new Set(slots)].sort();
  
  return {
    available: true,
    slots: slots,
    reason: null
  };
};

// Get available dates in a range (OPTIMIZED - single Firestore query)
// serviceName: optional, if provided, only returns dates available for this service
export const getAvailableDatesInRange = async (startDate, endDate, serviceName = null) => {
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
      const availability = getAvailabilityForDateWithConfigs(dateString, allConfigs, genericConfig, serviceName);
      
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
// serviceName: optional, if provided, checks if this specific service is available
export const checkSlotAvailability = async (date, time, serviceName = null) => {
  try {
    const availability = await getAvailabilityForDate(date, serviceName);
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

// Helper: Extract minutes from duration string (e.g., "50 min" -> 50)
const extractMinutesFromDuration = (durationString) => {
  if (!durationString) return 30; // Default to 30 minutes
  const match = durationString.match(/(\d+)\s*min/i);
  return match ? parseInt(match[1], 10) : 30;
};

// Helper: Convert time string to minutes since midnight (e.g., "10:30" -> 630)
const timeToMinutes = (timeString) => {
  const [hours, mins] = timeString.split(':').map(Number);
  return hours * 60 + mins;
};

// Get available slots for a date, considering existing reservations
// serviceName: optional, if provided, only returns slots available for this service
// allServices: optional, array of all services to look up durations
export const getAvailableSlots = async (dateString, reservationsForDate = [], serviceName = null, allServices = []) => {
  try {
    // Get availability configuration for the date
    const availability = await getAvailabilityForDate(dateString, serviceName);
    
    if (!availability.available) {
      return { available: false, slots: [], reason: availability.reason };
    }
    
    // Filter out canceled reservations
    const activeReservations = reservationsForDate.filter(r => r.estado !== 'cancelada');
    
    // If we don't have service definitions, fallback to basic behavior
    if (!allServices || allServices.length === 0) {
      const bookedSlots = activeReservations.map(r => r.hora);
      const freeSlots = availability.slots.filter(slot => !bookedSlots.includes(slot));
      
      return {
        available: true,
        slots: freeSlots,
        reason: availability.reason
      };
    }
    
    // Build blocking windows based on each existing reservation
    const reservationBlocks = activeReservations.map(reservation => {
      const service = allServices.find(s => s.nombre === reservation.servicio);
      const reservationDuration = service ? extractMinutesFromDuration(service.duracion) : 30; // Default to 30 min
      
      // Block time based on service duration:
      // - Services <= 30 min: block 30 min
      // - Services > 30 min: block 60 min (1 hour)
      const blockDuration = reservationDuration <= 30 ? 30 : 60;
      
      const startMinutes = timeToMinutes(reservation.hora);
      const blockEndMinutes = startMinutes + blockDuration;
      
      return { startMinutes, blockEndMinutes };
    });
    
    const freeSlots = availability.slots.filter(slot => {
      const slotMinutes = timeToMinutes(slot);
      
      for (const block of reservationBlocks) {
        const withinReservationWindow = slotMinutes >= block.startMinutes && slotMinutes < block.blockEndMinutes;
        if (withinReservationWindow) {
          return false;
        }
      }
      
      return true;
    });
    
    // Debug: Log filtering results
    if (availability.slots.length > 0 && freeSlots.length === 0 && activeReservations.length > 0) {
      console.log(`All slots blocked for ${dateString}. Total slots: ${availability.slots.length}, Reservations: ${activeReservations.length}`);
    }
    
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

// Get available services for a specific date (filters out blocked services)
// currentService: optional, if provided, this service will always be included even if blocked
export const getAvailableServices = async (dateString, allServices, currentService = null) => {
  try {
    const allConfigs = await getAvailabilityConfigs();
    const specificConfigs = allConfigs.filter(config => config.type === 'specific');
    
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0);
    
    // Collect all blocked services for this date
    const blockedServices = new Set();
    
    for (const config of specificConfigs) {
      if (config.dateRange) {
        const startDate = new Date(config.dateRange.start);
        const endDate = new Date(config.dateRange.end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        // Check if date falls within range
        if (checkDate >= startDate && checkDate <= endDate) {
          const configBlockedServices = config.blockedServices || [];
          
          // If "ALL" is in blocked services, all services are blocked
          if (configBlockedServices.includes('ALL') || configBlockedServices.length === 0) {
            // Block all services
            allServices.forEach(service => blockedServices.add(service.nombre));
          } else {
            // Block only specific services
            configBlockedServices.forEach(service => blockedServices.add(service));
          }
        }
      }
    }
    
    // Filter out blocked services, but always include currentService if provided
    return allServices.filter(service => 
      !blockedServices.has(service.nombre) || service.nombre === currentService
    );
  } catch (error) {
    console.error('Error getting available services:', error);
    // On error, return all services
    return allServices;
  }
};
