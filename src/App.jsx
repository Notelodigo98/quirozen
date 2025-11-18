import './App.css'
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import Terminos from './pages/Terminos';
import Acuerdo from './pages/Acuerdo';
import Layout from './components/Layout';
import BannerSlider from './components/BannerSlider';

// Register Spanish locale
registerLocale('es', es);
import {
  saveReservation as saveReservationDB,
  getReservations as getReservationsDB,
  getReservationByCode as getReservationByCodeDB,
  updateReservation as updateReservationDB,
  deleteReservation as deleteReservationDB,
  getReservationsByStatus,
  generateReservationCode,
  getReservationsByDate
} from './firebase/reservations';
import {
  saveAvailability,
  getAvailabilityConfigs,
  getDefaultGenericConfig,
  deleteAvailabilityConfig,
  updateAvailabilityConfig,
  generateTimeSlots,
  getAvailableDatesInRange,
  getAvailableSlots,
  checkSlotAvailability
} from './firebase/availability';

const horarios = [
  { dia: 'Lunes a Viernes', horas: 'De 9h a 13h y de 16h a 20h (citas de urgencias de 20h a 21h)' },
  { dia: 'Sábado', horas: 'De 9h a 13h (tardes cerrado, se admiten citas urgencias de 16h a 21h en clínica)' },
  { dia: 'Domingo', horas: 'Cerrado (se admiten citas de urgencias de 9h a 21h en clínica)' },
];

const masajes = [
  { nombre: 'Masaje descontracturante', descripcion: 'Ideal para tensiones musculares en cuello, espalda y hombros con un toque relajante que reduce ansiedad muscular.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje relajante', descripcion: 'Suave y rítmico para liberar estrés acumulado y calmar la ansiedad de todo el cuerpo.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje deportivo', descripcion: 'Prepara o recupera el músculo con maniobras relajantes que controlan la ansiedad previa al esfuerzo.', duracion: '50 min', precio: '35€' },
  { nombre: 'Masaje circulatorio', descripcion: 'Estimula sistema venoso y linfático con bombeos relajantes que alivian la ansiedad de las piernas cansadas.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje craneofacial', descripcion: 'Trabaja cara, cráneo y cuello con presiones relajantes ideales para dolores de cabeza por ansiedad.', duracion: '30 min', precio: '30€' },
  { nombre: 'Masaje de espalda', descripcion: 'Focalizado en zona dorsal, lumbar y cervical con pases relajantes que liberan ansiedad postural.', duracion: '30 min', precio: '30€' },
  { nombre: 'Masaje cervical', descripcion: 'Específico para cervicales y trapecios con fricciones relajantes que disminuyen ansiedad tensional.', duracion: '20 min', precio: '30€' },
  { nombre: 'Masaje podal (pies)', descripcion: 'Reflexología suave y relajante para descargar la ansiedad acumulada en las piernas.', duracion: '30 min', precio: '20€' },
  { nombre: 'Masaje abdominal', descripcion: 'Movimiento suave y relajante que mejora digestión y calma ansiedad visceral.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje combinado', descripcion: 'Back + piernas o facial con secuencias relajantes para equilibrar la ansiedad corporal.', duracion: '50 min', precio: '40€' },
  { nombre: 'Masaje con aromaterapia', descripcion: 'Aceites esenciales personalizados para un viaje relajante que reduce ansiedad sensorial.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje con piedras calientes', descripcion: 'Calor profundo y maniobras relajantes que derriten ansiedad y contracturas.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje maderoterapia', descripcion: 'Rodillos y copas de madera con ritmo relajante para moldear y liberar ansiedad corporal.', duracion: '50 min', precio: '30€' },
  { nombre: 'Masaje embarazadas', descripcion: 'En camilla o silla terapéutica con apoyo relajante que tranquiliza ansiedad prenatal.', duracion: '50 min', precio: '30€' },
  { nombre: 'Método Mindfulness', descripcion: 'PENDIENTE', duracion: '50 min', precio: '45€' },
  { nombre: 'Presoterapia', descripcion: 'PENDIENTE', duracion: '30 min', precio: '30€' },
];

const bonos = [
  {
    titulo: 'Bono 5 sesiones',
    descripcion: 'Ideal para quienes vienen una vez por semana o cada 15 días.',
    detalles: '5 masajes de 50 min',
    precio: '125€',
    regalo: '1 desayuno en cafetería Novara'
  },
  {
    titulo: 'Bono 10 sesiones',
    descripcion: 'Para clientes constantes o con tratamiento prolongado (espalda, cervicales, estrés).',
    detalles: '10 masajes de 50 min',
    precio: '250€',
    regalo: '1 masaje facial o podal de 20 min'
  },
  {
    titulo: 'Programa “Mensual Relax”',
    descripcion: 'Cuota mensual para bienestar continuo.',
    detalles: '1 sesión semanal (4 al mes) de 50 min. Se deben gastar en el mismo mes y bajo reserva.',
    precio: '100€/mes',
    regalo: ''
  },
  {
    titulo: 'Tarjeta de fidelidad “Tu 6º masaje es GRATIS”',
    descripcion: 'Sellas 5 sesiones → la 6ª es gratis (o al 50%). Válido durante 3 meses.',
    detalles: 'Premia a quien te recomienda: trae a un amigo → ambos tenéis 5€ de descuento en la siguiente sesión de descontracturante, relajante o deportivo.',
    precio: 'Promoción por tiempo limitado o permanente',
    regalo: ''
  },
  {
    titulo: 'Bono “Mindfulness para niños”',
    descripcion: 'Para que el niño se relaje y se beneficie del bienestar.',
    detalles: '1 sesión de mindfulness para niño',
    precio: '45€',
    regalo: 'Ideal para sábado por la mañana o tarde'
  },
  // {
  //   titulo: 'Bono "Dúo Relax"',
  //   descripcion: 'Para parejas que quieren compartir bienestar.',
  //   detalles: '2 masajes relajantes de 60 min (uno cada uno, en el mismo día o separados)',
  //   precio: '65€ (en lugar de 70€)',
  //   regalo: 'Puedes ofrecer ambiente con velas y música suave'
  // },
  // {
  //   titulo: 'Bono "Pareja Constante"',
  //   descripcion: 'Para parejas que quieren cuidarse mes a mes.',
  //   detalles: '4 sesiones al mes (2 por persona)',
  //   precio: '120€ (en lugar de 140€)',
  //   regalo: ''
  // },
  {
    titulo: 'Bono "Mimos para mí"',
    descripcion: 'Porque cuidar a otros también merece autocuidado.',
    detalles: '4 sesiones de 50 min (relajante o espalda)',
    precio: '100€',
    regalo: 'Masaje craneal y podal de 20 min a elegir + desayuno en cafetería Novara.'
  },
  {
    titulo: 'Bono FCSE + bomberos y sanitarios con acreditación demostrable',
    descripcion: 'Para aliviar tensiones por carga física o emocional.',
    detalles: 'Descuento de 5€ a cualquier terapia',
    precio: '',
    regalo: ''
  },
  {
    titulo: 'Bono Presoterapia',
    descripcion: 'Para aliviar tensiones por carga física o emocional.',
    detalles: '5 sesiones de 40 minutos',
    precio: '150€',
    regalo: ''
  },
  {
    titulo: 'Bono 10 Sesiones',
    descripcion: 'Para aliviar tensiones por carga física o emocional.',
    detalles: '10 sesiones de 50 minutos',
    precio: '300€',
    regalo: ''
  },
];

// Reservation utility functions now use Firebase (imported from firebase/reservations.js)

// Reservation Form Component
const ReservationForm = ({ masajes }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    fecha: '',
    hora: '',
    notas: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);

  // Calculate max date (2 months from now) - computed once
  const getMaxDate = () => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2);
    return endDate.toISOString().split('T')[0];
  };

  // Load available dates when component mounts
  useEffect(() => {
    loadAvailableDates();
  }, []);

  // Load available slots when date changes
  useEffect(() => {
    if (formData.fecha) {
      loadAvailableSlots(formData.fecha);
      // Reset hora when fecha changes
      setFormData(prev => ({ ...prev, hora: '' }));
    } else {
      setAvailableSlots([]);
    }
  }, [formData.fecha]);

  const loadAvailableDates = async () => {
    setLoadingDates(true);
    try {
      // Start from tomorrow (block today)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2); // Load next 2 months
      endDate.setHours(23, 59, 59, 999); // End of day
      
      const dates = await getAvailableDatesInRange(
        tomorrow.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setAvailableDates(dates.map(d => d.date));
    } catch (err) {
      console.error('Error loading available dates:', err);
      setError('Error al cargar las fechas disponibles');
    } finally {
      setLoadingDates(false);
    }
  };

  const loadAvailableSlots = async (dateString) => {
    setLoadingSlots(true);
    setError(''); // Clear previous errors when loading new slots
    try {
      // Get reservations for this date
      const reservations = await getReservationsByDate(dateString);
      
      // Get available slots considering reservations
      const result = await getAvailableSlots(dateString, reservations);
      
      if (result.available) {
        setAvailableSlots(result.slots);
        if (result.slots.length === 0) {
          setError('Esta fecha está disponible pero no tiene horarios libres. Por favor, selecciona otra fecha.');
        }
      } else {
        setAvailableSlots([]);
        setError(`Esta fecha no está disponible: ${result.reason || 'Fecha bloqueada o sin configuración'}`);
      }
    } catch (err) {
      console.error('Error loading available slots:', err);
      setError('Error al cargar los horarios disponibles. Por favor, intenta de nuevo.');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Helper: Get tomorrow's date (to block today)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  // Helper: Convert Date to YYYY-MM-DD string
  const dateToString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Convert YYYY-MM-DD string to Date
  const stringToDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString + 'T00:00:00');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user changes inputs
    if (error) setError('');
  };

  // Handle date change from DatePicker
  const handleDateChange = (date) => {
    const dateString = dateToString(date);
    setFormData({
      ...formData,
      fecha: dateString,
      hora: '' // Reset hour when date changes
    });
    setError(''); // Clear previous errors
  };

  // Filter dates to only show available ones
  const isDateAvailable = (date) => {
    if (availableDates.length === 0) return true; // Allow all if no dates loaded yet
    const dateString = dateToString(date);
    return availableDates.includes(dateString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio || !formData.fecha || !formData.hora) {
      setError('Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      // Final validation: check if slot is still available
      const reservations = await getReservationsByDate(formData.fecha);
      const slotAvailability = await getAvailableSlots(formData.fecha, reservations);
      
      if (!slotAvailability.available || !slotAvailability.slots.includes(formData.hora)) {
        setError('Lo sentimos, este horario ya no está disponible. Por favor, selecciona otro.');
        // Reload slots
        await loadAvailableSlots(formData.fecha);
        setLoading(false);
        return;
      }

      const code = generateReservationCode();
      const reservation = {
        ...formData,
        code,
        fechaCreacion: new Date().toISOString(),
        estado: 'pendiente'
      };

      await saveReservationDB(reservation);
      setReservationCode(code);
      setSubmitted(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        servicio: '',
        fecha: '',
        hora: '',
        notas: ''
      });
      setAvailableSlots([]);
    } catch (err) {
      setError('Error al guardar la reserva. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="reservation-success">
        <h3>¡Reserva confirmada!</h3>
        <div className="reservation-code-display">
          <p>Tu código de reserva es:</p>
          <div className="code-box">{reservationCode}</div>
          <p className="code-instruction">Guarda este código para modificar o cancelar tu reserva.</p>
        </div>
        <button onClick={() => { setSubmitted(false); setReservationCode(''); }} className="btn-secondary">
          Hacer otra reserva
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre completo *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Teléfono *</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="servicio">Tipo de servicio *</label>
        <select
          id="servicio"
          name="servicio"
          value={formData.servicio}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un servicio</option>
          {masajes.map((masaje, i) => (
            <option key={i} value={masaje.nombre}>
              {masaje.nombre} - {masaje.duracion} - {masaje.precio}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fecha">Fecha *</label>
          {loadingDates ? (
            <p className="loading-text">Cargando fechas disponibles...</p>
          ) : (
            <>
              <DatePicker
                id="fecha"
                selected={stringToDate(formData.fecha)}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale="es"
                minDate={getTomorrowDate()}
                maxDate={(() => {
                  const endDate = new Date();
                  endDate.setMonth(endDate.getMonth() + 2);
                  return endDate;
                })()}
                filterDate={isDateAvailable}
                placeholderText="Selecciona una fecha"
                className="date-picker-input"
                required
              />
              {availableDates.length === 0 && !loadingDates && (
                <p className="warning-text">No hay fechas disponibles configuradas. Contacta al administrador.</p>
              )}
              {availableDates.length > 0 && (
                <p className="info-text">
                  Fechas disponibles: {availableDates.length} día(s) en los próximos 2 meses
                </p>
              )}
            </>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora *</label>
          {!formData.fecha ? (
            <select id="hora" name="hora" disabled>
              <option value="">Primero selecciona una fecha</option>
            </select>
          ) : loadingSlots ? (
            <p className="loading-text">Cargando horarios disponibles...</p>
          ) : availableSlots.length === 0 ? (
            <>
              <select id="hora" name="hora" disabled>
                <option value="">No hay horarios disponibles</option>
              </select>
              <p className="warning-text">Esta fecha no tiene horarios disponibles.</p>
            </>
          ) : (
            <select
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una hora</option>
              {availableSlots.map((slot, i) => (
                <option key={i} value={slot}>{slot}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notas">Notas adicionales (opcional)</label>
        <textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          rows="3"
          placeholder="Indica cualquier preferencia o necesidad especial..."
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Confirmar reserva'}
      </button>
    </form>
  );
};

// Manage Reservation Component
const ManageReservation = () => {
  const [code, setCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!code) {
      setError('Por favor, ingresa un código de reserva.');
      setLoading(false);
      return;
    }
    try {
      const found = await getReservationByCodeDB(code);
      if (found) {
        setReservation(found);
        setEditData(found);
        setEditMode(false);
      } else {
        setError('No se encontró ninguna reserva con ese código.');
        setReservation(null);
      }
    } catch (err) {
      setError('Error al buscar la reserva. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await updateReservationDB(code, editData);
      if (success) {
        setReservation(editData);
        setEditMode(false);
        setError('');
        alert('Reserva actualizada correctamente.');
      } else {
        setError('Error al actualizar la reserva.');
      }
    } catch (err) {
      setError('Error al actualizar la reserva. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      setLoading(true);
      try {
        await deleteReservationDB(code);
        setReservation(null);
        setCode('');
        setEditMode(false);
        alert('Reserva cancelada correctamente.');
      } catch (err) {
        setError('Error al cancelar la reserva. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper: Get tomorrow's date (to block today)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  // Helper: Convert Date to YYYY-MM-DD string
  const dateToString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Convert YYYY-MM-DD string to Date
  const stringToDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString + 'T00:00:00');
  };

  // Handle date change from DatePicker
  const handleDateChange = (date) => {
    const dateString = dateToString(date);
    setEditData({ ...editData, fecha: dateString });
  };

  return (
    <div className="manage-reservation">
      <h3>Gestionar mi reserva</h3>
      <form onSubmit={handleLookup} className="lookup-form">
        <div className="form-group">
          <label htmlFor="reservation-code">Código de reserva</label>
          <input
            type="text"
            id="reservation-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código"
            maxLength="8"
            style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
        </div>
        <button type="submit" className="btn-secondary" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar reserva'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {reservation && !editMode && (
        <div className="reservation-details">
          <h4>Detalles de la reserva</h4>
          <div className="detail-row">
            <strong>Código:</strong> <span>{reservation.code}</span>
          </div>
          <div className="detail-row">
            <strong>Nombre:</strong> <span>{reservation.nombre}</span>
          </div>
          <div className="detail-row">
            <strong>Email:</strong> <span>{reservation.email}</span>
          </div>
          <div className="detail-row">
            <strong>Teléfono:</strong> <span>{reservation.telefono}</span>
          </div>
          <div className="detail-row">
            <strong>Servicio:</strong> <span>{reservation.servicio}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha:</strong> <span>{new Date(reservation.fecha).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="detail-row">
            <strong>Hora:</strong> <span>{reservation.hora}</span>
          </div>
          {reservation.notas && (
            <div className="detail-row">
              <strong>Notas:</strong> <span>{reservation.notas}</span>
            </div>
          )}
          <div className="detail-row">
            <strong>Estado:</strong> <span className={`status-${reservation.estado}`}>{reservation.estado}</span>
          </div>
          <div className="reservation-actions">
            <button onClick={() => setEditMode(true)} className="btn-secondary">Modificar</button>
            <button onClick={handleCancel} className="btn-danger">Cancelar reserva</button>
          </div>
        </div>
      )}

      {reservation && editMode && (
        <form onSubmit={handleUpdate} className="edit-reservation-form">
          <h4>Modificar reserva</h4>
          <div className="form-group">
            <label>Fecha *</label>
            <DatePicker
              selected={stringToDate(editData.fecha)}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es"
              minDate={getTomorrowDate()}
              placeholderText="Selecciona una fecha"
              className="date-picker-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Hora *</label>
            <input
              type="time"
              value={editData.hora}
              onChange={(e) => setEditData({ ...editData, hora: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Notas</label>
            <textarea
              value={editData.notas || ''}
              onChange={(e) => setEditData({ ...editData, notas: e.target.value })}
              rows="3"
            />
          </div>
          <div className="reservation-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" onClick={() => setEditMode(false)} className="btn-secondary" disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Availability Manager Component
const AvailabilityManager = () => {
  const [activeSubTab, setActiveSubTab] = useState('generic'); // generic, specific
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { available: false, ranges: [] },
    tuesday: { available: false, ranges: [] },
    wednesday: { available: false, ranges: [] },
    thursday: { available: false, ranges: [] },
    friday: { available: false, ranges: [] },
    saturday: { available: false, ranges: [] },
    sunday: { available: false, ranges: [] }
  });
  const [editingDay, setEditingDay] = useState(null);
  const [specificConfigs, setSpecificConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  useEffect(() => {
    loadGenericConfig();
    loadSpecificConfigs();
  }, []);

  const loadGenericConfig = async () => {
    setLoading(true);
    try {
      const config = await getDefaultGenericConfig();
      if (config && config.weeklySchedule) {
        // Ensure all days have the correct structure with ranges array
        const defaultSchedule = {
          monday: { available: false, ranges: [] },
          tuesday: { available: false, ranges: [] },
          wednesday: { available: false, ranges: [] },
          thursday: { available: false, ranges: [] },
          friday: { available: false, ranges: [] },
          saturday: { available: false, ranges: [] },
          sunday: { available: false, ranges: [] }
        };
        
        // Merge with loaded config, converting slots to ranges if needed
        const loadedSchedule = { ...defaultSchedule };
        Object.keys(defaultSchedule).forEach(day => {
          if (config.weeklySchedule[day]) {
            const dayConfig = config.weeklySchedule[day];
            let ranges = [];
            
            // If ranges exist, use them directly
            if (Array.isArray(dayConfig.ranges) && dayConfig.ranges.length > 0) {
              ranges = dayConfig.ranges;
            }
            // If slots exist, convert them to ranges
            else if (Array.isArray(dayConfig.slots) && dayConfig.slots.length > 0) {
              ranges = convertSlotsToRanges(dayConfig.slots);
            }
            
            loadedSchedule[day] = {
              available: dayConfig.available || false,
              ranges: ranges
            };
          }
        });
        
        setWeeklySchedule(loadedSchedule);
      }
    } catch (err) {
      console.error('Error loading generic config:', err);
      setMessage({ type: 'error', text: 'Error al cargar la configuración' });
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificConfigs = async () => {
    try {
      const configs = await getAvailabilityConfigs();
      setSpecificConfigs(configs.filter(c => c.type === 'specific') || []);
    } catch (err) {
      console.error('Error loading specific configs:', err);
      setSpecificConfigs([]); // Ensure it's always an array
    }
  };

  const toggleDayAvailability = (day) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        available: !weeklySchedule[day].available,
        ranges: !weeklySchedule[day].available ? weeklySchedule[day].ranges : []
      }
    });
  };

  const addTimeRange = (day) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        ranges: [...weeklySchedule[day].ranges, { start: '09:00', end: '13:00' }]
      }
    });
  };

  const updateTimeRange = (day, index, field, value) => {
    const newRanges = [...weeklySchedule[day].ranges];
    newRanges[index][field] = value;
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: { ...weeklySchedule[day], ranges: newRanges }
    });
  };

  const removeTimeRange = (day, index) => {
    const newRanges = weeklySchedule[day].ranges.filter((_, i) => i !== index);
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: { ...weeklySchedule[day], ranges: newRanges }
    });
  };

  const generateSlotsFromRanges = (ranges) => {
    return generateTimeSlots(ranges, 30);
  };

  // Convert slots back to ranges for editing (reverse of generateSlotsFromRanges)
  const convertSlotsToRanges = (slots) => {
    if (!Array.isArray(slots) || slots.length === 0) {
      return [];
    }

    const ranges = [];
    let currentRangeStart = null;
    let currentRangeEnd = null;

    // Sort slots to ensure correct order
    const sortedSlots = [...slots].sort();

    sortedSlots.forEach((slot, index) => {
      const [hour, minute] = slot.split(':').map(Number);
      const slotMinutes = hour * 60 + minute;

      if (currentRangeStart === null) {
        // Start new range
        currentRangeStart = slot;
        currentRangeEnd = slot;
      } else {
        // Check if this slot is 30 minutes after the last one in current range
        const [lastHour, lastMin] = currentRangeEnd.split(':').map(Number);
        const lastSlotMinutes = lastHour * 60 + lastMin;
        
        if (slotMinutes === lastSlotMinutes + 30) {
          // Continue the current range - update end
          currentRangeEnd = slot;
        } else {
          // Gap found, finish current range and start new one
          // Calculate end as 30 minutes after the last slot in the range
          const [endHour, endMin] = currentRangeEnd.split(':').map(Number);
          const endTotalMin = endHour * 60 + endMin + 30;
          const finalEndHour = Math.floor(endTotalMin / 60);
          const finalEndMin = endTotalMin % 60;
          const finalEnd = `${finalEndHour.toString().padStart(2, '0')}:${finalEndMin.toString().padStart(2, '0')}`;
          
          ranges.push({ start: currentRangeStart, end: finalEnd });
          
          // Start new range
          currentRangeStart = slot;
          currentRangeEnd = slot;
        }
      }
    });

    // Add the last range
    if (currentRangeStart !== null) {
      // Calculate end as 30 minutes after the last slot
      const [endHour, endMin] = currentRangeEnd.split(':').map(Number);
      const endTotalMin = endHour * 60 + endMin + 30;
      const finalEndHour = Math.floor(endTotalMin / 60);
      const finalEndMin = endTotalMin % 60;
      const finalEnd = `${finalEndHour.toString().padStart(2, '0')}:${finalEndMin.toString().padStart(2, '0')}`;
      
      ranges.push({ start: currentRangeStart, end: finalEnd });
    }

    return ranges;
  };

  const saveGenericSchedule = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Convert ranges to slots for each day
      const scheduleWithSlots = {};
      Object.keys(weeklySchedule).forEach(day => {
        const dayData = weeklySchedule[day];
        scheduleWithSlots[day] = {
          available: dayData.available,
          slots: dayData.available && dayData.ranges.length > 0 
            ? generateSlotsFromRanges(dayData.ranges)
            : []
        };
      });

      await saveAvailability({
        type: 'generic',
        isDefault: true,
        name: 'Horario por defecto',
        weeklySchedule: scheduleWithSlots
      });

      setMessage({ type: 'success', text: 'Horario genérico guardado correctamente' });
    } catch (err) {
      console.error('Error saving generic schedule:', err);
      setMessage({ type: 'error', text: 'Error al guardar el horario' });
    } finally {
      setSaving(false);
    }
  };

  const deleteSpecificConfig = async (configId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta configuración?')) return;
    
    try {
      await deleteAvailabilityConfig(configId);
      await loadSpecificConfigs();
      setMessage({ type: 'success', text: 'Configuración eliminada' });
    } catch (err) {
      console.error('Error deleting config:', err);
      setMessage({ type: 'error', text: 'Error al eliminar la configuración' });
    }
  };

  // Specific Date Configuration Component
  const SpecificDateForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      dateRange: { start: '', end: '' },
      available: false,
      slots: [],
      reason: '',
      isSingleDate: true
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.isSingleDate && !formData.dateRange.start) {
        alert('Por favor, selecciona una fecha');
        return;
      }
      if (!formData.isSingleDate && (!formData.dateRange.start || !formData.dateRange.end)) {
        alert('Por favor, selecciona un rango de fechas');
        return;
      }

      setSaving(true);
      const config = {
        type: 'specific',
        name: formData.name || 'Configuración específica',
        dateRange: {
          start: formData.dateRange.start,
          end: formData.isSingleDate ? formData.dateRange.start : formData.dateRange.end
        },
        available: formData.available,
        slots: formData.available ? formData.slots : [],
        reason: formData.reason
      };

      try {
        await saveAvailability(config);
        await loadSpecificConfigs();
        setMessage({ type: 'success', text: 'Configuración guardada' });
        onSave();
      } catch (err) {
        console.error('Error saving specific config:', err);
        setMessage({ type: 'error', text: 'Error al guardar' });
      } finally {
        setSaving(false);
      }
    };

    const addSlot = () => {
      setFormData({
        ...formData,
        slots: [...formData.slots, '09:00']
      });
    };

    const updateSlot = (index, value) => {
      const newSlots = [...formData.slots];
      newSlots[index] = value;
      setFormData({ ...formData, slots: newSlots });
    };

    const removeSlot = (index) => {
      setFormData({
        ...formData,
        slots: formData.slots.filter((_, i) => i !== index)
      });
    };

    // Helper: Convert Date to YYYY-MM-DD string
    const dateToString = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Helper: Convert YYYY-MM-DD string to Date
    const stringToDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString + 'T00:00:00');
    };

    // Handle date change from DatePicker
    const handleStartDateChange = (date) => {
      const dateString = dateToString(date);
      setFormData({
        ...formData,
        dateRange: { ...formData.dateRange, start: dateString }
      });
    };

    const handleEndDateChange = (date) => {
      const dateString = dateToString(date);
      setFormData({
        ...formData,
        dateRange: { ...formData.dateRange, end: dateString }
      });
    };

    return (
      <form onSubmit={handleSubmit} className="specific-date-form">
        <div className="form-group">
          <label>Nombre (opcional)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Vacaciones Navidad"
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isSingleDate}
              onChange={(e) => setFormData({ ...formData, isSingleDate: e.target.checked })}
            />
            Fecha única
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha inicio *</label>
            <DatePicker
              selected={stringToDate(formData.dateRange.start)}
              onChange={handleStartDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es"
              placeholderText="Selecciona fecha inicio"
              className="date-picker-input"
              required
            />
          </div>
          {!formData.isSingleDate && (
            <div className="form-group">
              <label>Fecha fin *</label>
              <DatePicker
                selected={stringToDate(formData.dateRange.end)}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                locale="es"
                minDate={stringToDate(formData.dateRange.start)}
                placeholderText="Selecciona fecha fin"
                className="date-picker-input"
                required
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            {formData.available ? 'Horario especial (selecciona horas)' : 'Día completo bloqueado'}
          </label>
        </div>

        {formData.available && (
          <div className="form-group">
            <label>Horas disponibles</label>
            {formData.slots.map((slot, index) => (
              <div key={index} className="slot-input-row">
                <input
                  type="time"
                  value={slot}
                  onChange={(e) => updateSlot(index, e.target.value)}
                />
                <button type="button" onClick={() => removeSlot(index)} className="btn-danger-small">Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={addSlot} className="btn-secondary">Agregar hora</button>
          </div>
        )}

        <div className="form-group">
          <label>Motivo (opcional)</label>
          <input
            type="text"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Ej: Día festivo, Vacaciones"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={saving}>Cancelar</button>
        </div>
      </form>
    );
  };

  const [showSpecificForm, setShowSpecificForm] = useState(false);

  return (
    <div className="availability-manager">
      <h3>Gestión de Disponibilidad</h3>
      
      <div className="availability-tabs">
        <button
          className={activeSubTab === 'generic' ? 'active' : ''}
          onClick={() => setActiveSubTab('generic')}
        >
          Horario Genérico
        </button>
        <button
          className={activeSubTab === 'specific' ? 'active' : ''}
          onClick={() => setActiveSubTab('specific')}
        >
          Configuraciones Específicas
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {activeSubTab === 'generic' && (
        <div className="generic-schedule-editor">
          <p className="help-text">Configura los horarios por defecto para cada día de la semana. Estos horarios se aplicarán a todas las fechas que no tengan una configuración específica.</p>
          
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              {daysOfWeek.map(({ key, label }) => {
                const daySchedule = weeklySchedule[key] || { available: false, ranges: [] };
                return (
                <div key={key} className="day-schedule-row">
                  <div className="day-header">
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={daySchedule.available}
                        onChange={() => toggleDayAvailability(key)}
                      />
                      <strong>{label}</strong>
                    </label>
                    {daySchedule.available && (
                      <button
                        onClick={() => setEditingDay(editingDay === key ? null : key)}
                        className="btn-secondary-small"
                      >
                        {editingDay === key ? 'Ocultar' : 'Editar horarios'}
                      </button>
                    )}
                  </div>

                  {daySchedule.available && editingDay === key && (
                    <div className="time-ranges-editor">
                      {(Array.isArray(daySchedule.ranges) ? daySchedule.ranges : []).map((range, index) => {
                        const slots = generateSlotsFromRanges([range]);
                        return (
                          <div key={index} className="time-range-item">
                            <div className="time-range-inputs">
                              <input
                                type="time"
                                value={range.start}
                                onChange={(e) => updateTimeRange(key, index, 'start', e.target.value)}
                              />
                              <span>a</span>
                              <input
                                type="time"
                                value={range.end}
                                onChange={(e) => updateTimeRange(key, index, 'end', e.target.value)}
                              />
                              <button
                                onClick={() => removeTimeRange(key, index)}
                                className="btn-danger-small"
                              >
                                Eliminar
                              </button>
                            </div>
                            <div className="slots-preview">
                              <small>Slots generados: {slots.join(', ')}</small>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        onClick={() => addTimeRange(key)}
                        className="btn-secondary-small"
                      >
                        Agregar rango de horas
                      </button>
                    </div>
                  )}

                  {daySchedule.available && editingDay !== key && Array.isArray(daySchedule.ranges) && daySchedule.ranges.length > 0 && (
                    <div className="day-summary">
                      {daySchedule.ranges.map((range, i) => (
                        <span key={i} className="range-badge">
                          {range.start} - {range.end}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}

              <button
                onClick={saveGenericSchedule}
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar Horario Genérico'}
              </button>
            </>
          )}
        </div>
      )}

      {activeSubTab === 'specific' && (
        <div className="specific-configs">
          {!showSpecificForm ? (
            <>
              <div className="configs-header">
                <h4>Configuraciones Específicas</h4>
                <button
                  onClick={() => setShowSpecificForm(true)}
                  className="btn-primary"
                >
                  Nueva Configuración
                </button>
              </div>

              {!Array.isArray(specificConfigs) || specificConfigs.length === 0 ? (
                <p>No hay configuraciones específicas. Crea una para bloquear fechas o establecer horarios especiales.</p>
              ) : (
                <div className="specific-configs-list">
                  {specificConfigs.map((config) => (
                    <div key={config.id} className="specific-config-card">
                      <div className="config-header">
                        <strong>{config.name || 'Sin nombre'}</strong>
                        <button
                          onClick={() => deleteSpecificConfig(config.id)}
                          className="btn-danger-small"
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className="config-info">
                        {config.dateRange && (
                          <p>
                            <strong>Fechas:</strong>{' '}
                            {new Date(config.dateRange.start).toLocaleDateString('es-ES')}
                            {config.dateRange.start !== config.dateRange.end && (
                              <> - {new Date(config.dateRange.end).toLocaleDateString('es-ES')}</>
                            )}
                          </p>
                        )}
                        <p>
                          <strong>Estado:</strong>{' '}
                          {config.available ? (
                            <span className="status-available">Horario especial</span>
                          ) : (
                            <span className="status-blocked">Bloqueado</span>
                          )}
                        </p>
                        {config.available && Array.isArray(config.slots) && config.slots.length > 0 && (
                          <p>
                            <strong>Horas:</strong> {config.slots.join(', ')}
                          </p>
                        )}
                        {config.reason && (
                          <p><strong>Motivo:</strong> {config.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <SpecificDateForm
              onSave={() => setShowSpecificForm(false)}
              onCancel={() => setShowSpecificForm(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ masajes }) => {
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState('reservations'); // reservations, availability
  const [filter, setFilter] = useState('todas'); // todas, pendiente, confirmada, cancelada
  const [loading, setLoading] = useState(false);

  // Simple password check - in production, use proper authentication
  const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

  useEffect(() => {
    if (isAuthenticated) {
      loadReservations();
    }
  }, [isAuthenticated, filter]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      let all = await getReservationsDB();
      setAllReservations(all);
      
      if (filter !== 'todas') {
        all = all.filter(r => r.estado === filter);
      }
      all.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setReservations(all);
    } catch (err) {
      console.error('Error loading reservations:', err);
      alert('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const updateReservationStatus = async (code, newStatus) => {
    try {
      const reservation = await getReservationByCodeDB(code);
      if (reservation) {
        await updateReservationDB(code, { ...reservation, estado: newStatus });
        await loadReservations();
      }
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Error al actualizar el estado de la reserva');
    }
  };

  const handleDelete = async (code) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        await deleteReservationDB(code);
        await loadReservations();
      } catch (err) {
        console.error('Error deleting reservation:', err);
        alert('Error al eliminar la reserva');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h3>Panel de administración</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              type="password"
              id="admin-password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Acceder</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h3>Panel de administración</h3>
        <button onClick={() => setIsAuthenticated(false)} className="btn-secondary">Cerrar sesión</button>
      </div>

      <div className="admin-main-tabs">
        <button
          className={adminTab === 'reservations' ? 'active' : ''}
          onClick={() => setAdminTab('reservations')}
        >
          Reservas
        </button>
        <button
          className={adminTab === 'availability' ? 'active' : ''}
          onClick={() => setAdminTab('availability')}
        >
          Disponibilidad
        </button>
      </div>

      {adminTab === 'reservations' && (
        <>
          <div className="admin-filters">
            <button
              onClick={() => setFilter('todas')}
              className={filter === 'todas' ? 'active' : ''}
            >
              Todas ({allReservations.length})
            </button>
            <button
              onClick={() => setFilter('pendiente')}
              className={filter === 'pendiente' ? 'active' : ''}
            >
              Pendientes ({allReservations.filter(r => r.estado === 'pendiente').length})
            </button>
            <button
              onClick={() => setFilter('confirmada')}
              className={filter === 'confirmada' ? 'active' : ''}
            >
              Confirmadas ({allReservations.filter(r => r.estado === 'confirmada').length})
            </button>
            <button
              onClick={() => setFilter('cancelada')}
              className={filter === 'cancelada' ? 'active' : ''}
            >
              Canceladas ({allReservations.filter(r => r.estado === 'cancelada').length})
            </button>
          </div>

          <div className="reservations-list">
            {loading ? (
              <p>Cargando reservas...</p>
            ) : reservations.length === 0 ? (
              <p>No hay reservas para mostrar.</p>
            ) : (
                             reservations.map((reservation, index) => (
                <div key={index} className="reservation-admin-card">
                  <div className="reservation-header">
                    <div>
                      <strong>Código: {reservation.code}</strong>
                      <span className={`status-badge status-${reservation.estado}`}>
                        {reservation.estado}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(reservation.code)}
                      className="btn-danger-small"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="reservation-info">
                    <p><strong>Cliente:</strong> {reservation.nombre}</p>
                    <p><strong>Contacto:</strong> {reservation.email} | {reservation.telefono}</p>
                    <p><strong>Servicio:</strong> {reservation.servicio}</p>
                    <p><strong>Fecha y hora:</strong> {new Date(reservation.fecha).toLocaleDateString('es-ES')} a las {reservation.hora}</p>
                    {reservation.notas && <p><strong>Notas:</strong> {reservation.notas}</p>}
                    <p><strong>Fecha de reserva:</strong> {new Date(reservation.fechaCreacion).toLocaleString('es-ES')}</p>
                  </div>
                  <div className="reservation-status-actions">
                    <button
                      onClick={() => updateReservationStatus(reservation.code, 'confirmada')}
                      className={reservation.estado === 'confirmada' ? 'btn-success active' : 'btn-success'}
                      disabled={reservation.estado === 'confirmada'}
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => updateReservationStatus(reservation.code, 'pendiente')}
                      className={reservation.estado === 'pendiente' ? 'btn-secondary active' : 'btn-secondary'}
                      disabled={reservation.estado === 'pendiente'}
                    >
                      Pendiente
                    </button>
                    <button
                      onClick={() => updateReservationStatus(reservation.code, 'cancelada')}
                      className={reservation.estado === 'cancelada' ? 'btn-warning active' : 'btn-warning'}
                      disabled={reservation.estado === 'cancelada'}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {adminTab === 'availability' && <AvailabilityManager />}
    </div>
  );
};

// Home Component
function Home() {
  const [activeTab, setActiveTab] = useState('reservar'); // reservar, gestionar, admin

  return (
    <>
        <BannerSlider />
        <section id="info" className="section">
          <h2>Información principal</h2>
          <h3>Horarios</h3>
          <ul className="horarios-list">
            {horarios.map((h, i) => (
              <li key={i}><strong>{h.dia}:</strong> {h.horas}</li>
            ))}
          </ul>
          <h3>Tipos de masajes</h3>
          <div className="masajes-list">
            {masajes.map((m, i) => (
              <div className="masaje-card" key={i}>
                <h4>{m.nombre}</h4>
                <p>{m.descripcion}</p>
                <p><strong>Duración:</strong> {m.duracion}</p>
                <p><strong>Precio:</strong> {m.precio}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="reservas" className="section">
          <h2>Reservas</h2>
          <div className="reservation-tabs">
            <button
              className={activeTab === 'reservar' ? 'active' : ''}
              onClick={() => setActiveTab('reservar')}
            >
              Nueva reserva
            </button>
            <button
              className={activeTab === 'gestionar' ? 'active' : ''}
              onClick={() => setActiveTab('gestionar')}
            >
              Gestionar mi reserva
            </button>
            <button
              className={activeTab === 'admin' ? 'active' : ''}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          </div>

          {activeTab === 'reservar' && <ReservationForm masajes={masajes} />}
          {activeTab === 'gestionar' && <ManageReservation />}
          {activeTab === 'admin' && <AdminPanel masajes={masajes} />}
        </section>
        <section id="sobre" className="section">
          <h2>Sobre nosotros</h2>
          
          <div className="about-content">
            <div className="about-text">
              <p className="intro-text">
                Desde <strong>Quirozen by Laura Escribano</strong> ofrecemos una amplia gama de masajes y tratamientos 
                terapéuticos diseñados para tu bienestar físico y mental. Con años de experiencia y dedicación, 
                nos especializamos en proporcionar servicios personalizados que se adaptan a tus necesidades específicas.
              </p>
              <p>
                Nuestro enfoque combina técnicas tradicionales con métodos modernos para ofrecerte una experiencia 
                única de relajación y recuperación. Ya sea que busques alivio del estrés, tratamiento para tensiones 
                musculares, o simplemente un momento de bienestar, estamos aquí para ayudarte.
              </p>
              <p className="closing-text">
                <strong>Te esperamos en nuestro local para brindarte el cuidado que mereces.</strong>
              </p>
            </div>

            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Dirección</h3>
                  <p>Calle Leopoldo Arias Clarín, Local 148</p>
                  <p>Dos Hermanas, Sevilla</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Teléfono</h3>
                  <p><a href="tel:675610730" className="phone-link">675 61 07 30</a></p>
                </div>
              </div>
            </div>

            <div className="map-container">
              <h3>¿Cómo llegar?</h3>
              <div className="map-wrapper">
                <iframe
                  src="https://www.google.com/maps?q=Leopoldo+Arias+Clarín+148,+Dos+Hermanas,+Sevilla&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Quirozen by Laura Escribano"
                ></iframe>
              </div>
              <p className="map-note">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Leopoldo+Arias+Clarín+148+Dos+Hermanas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  Abrir en Google Maps →
                </a>
              </p>
            </div>
          </div>
        </section>
        <section id="promos" className="section">
          <h2>Promociones y Bonos</h2>
          <div className="bonos-list">
            {bonos.map((b, i) => (
              <div className="bono-card" key={i}>
                <h4>{b.titulo}</h4>
                <p>{b.descripcion}</p>
                <p><strong>{b.detalles}</strong></p>
                <p><strong>Precio: {b.precio}</strong></p>
                {b.regalo && <p><em>{b.regalo}</em></p>}
              </div>
            ))}
          </div>
        </section>
    </>
  );
}

// App Component with Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/acuerdo" element={<Acuerdo />} />
    </Routes>
  );
}

export default App
