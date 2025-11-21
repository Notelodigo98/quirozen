import emailjs from '@emailjs/browser';

// EmailJS configuration
// These values should be set in environment variables or config
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // To be configured
const EMAILJS_TEMPLATE_ID_NEW = 'YOUR_TEMPLATE_ID_NEW'; // Template for new reservations
const EMAILJS_TEMPLATE_ID_UPDATE = 'YOUR_TEMPLATE_ID_UPDATE'; // Template for updated reservations
const EMAILJS_PUBLIC_KEY = 'LL6OIXIfaRQBCOXxO'; // Public Key de EmailJS

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

// Format date for email (DD/MM/YYYY)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format time for email (HH:MM)
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

// Send email for new reservation
export const sendReservationEmail = async (reservation) => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        !EMAILJS_TEMPLATE_ID_NEW || EMAILJS_TEMPLATE_ID_NEW === 'YOUR_TEMPLATE_ID_NEW' ||
        !EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.warn('EmailJS no está configurado. No se enviará el correo.');
      return false;
    }

    initEmailJS();

    const templateParams = {
      to_email: reservation.email,
      to_name: reservation.nombre,
      reservation_code: reservation.code,
      reservation_date: formatDate(reservation.fecha),
      reservation_time: formatTime(reservation.hora),
      reservation_service: reservation.servicio || 'No especificado',
      reservation_phone: reservation.telefono || '',
      reservation_notes: reservation.notas || 'Sin notas adicionales',
      reservation_status: reservation.estado || 'pendiente',
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_NEW,
      templateParams
    );

    console.log('Email de confirmación enviado correctamente');
    return true;
  } catch (error) {
    console.error('Error enviando email de confirmación:', error);
    // Don't throw error - email failure shouldn't break reservation
    return false;
  }
};

// Send email for updated reservation
export const sendReservationUpdateEmail = async (reservation) => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        !EMAILJS_TEMPLATE_ID_UPDATE || EMAILJS_TEMPLATE_ID_UPDATE === 'YOUR_TEMPLATE_ID_UPDATE' ||
        !EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.warn('EmailJS no está configurado. No se enviará el correo.');
      return false;
    }

    initEmailJS();

    const templateParams = {
      to_email: reservation.email,
      to_name: reservation.nombre,
      reservation_code: reservation.code,
      reservation_date: formatDate(reservation.fecha),
      reservation_time: formatTime(reservation.hora),
      reservation_service: reservation.servicio || 'No especificado',
      reservation_phone: reservation.telefono || '',
      reservation_notes: reservation.notas || 'Sin notas adicionales',
      reservation_status: reservation.estado || 'pendiente',
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_UPDATE,
      templateParams
    );

    console.log('Email de actualización enviado correctamente');
    return true;
  } catch (error) {
    console.error('Error enviando email de actualización:', error);
    // Don't throw error - email failure shouldn't break reservation update
    return false;
  }
};

