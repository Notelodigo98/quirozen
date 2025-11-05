import './App.css'
import { useState, useEffect } from 'react';
import {
  saveReservation as saveReservationDB,
  getReservations as getReservationsDB,
  getReservationByCode as getReservationByCodeDB,
  updateReservation as updateReservationDB,
  deleteReservation as deleteReservationDB,
  getReservationsByStatus,
  generateReservationCode
} from './firebase/reservations';

const horarios = [
  { dia: 'Lunes a Viernes', horas: '9 - 13h y 16-20h (citas urgencias de 20 a 21h)' },
  { dia: 'Sábado', horas: '9 - 14h (tardes cerrado, se admiten citas urgencias)' },
  { dia: 'Domingo', horas: 'cerrado (se admiten citas urgencias)' },
];

const masajes = [
  { nombre: 'Masaje descontracturante', descripcion: 'Ideal para tensiones musculares, cuello, espalda, hombros', duracion: '50–60 min', precio: '30–40 €' },
  { nombre: 'Masaje relajante', descripcion: 'Suave, con ritmo lento, para reducir estrés y ansiedad', duracion: '50–60 min', precio: '30–40 €' },
  { nombre: 'Masaje deportivo', descripcion: 'Para preparar o recuperar el músculo antes/después de actividad', duracion: '45–60 min', precio: '35–45 €' },
  { nombre: 'Masaje circulatorio', descripcion: 'Estimula el sistema venoso y linfático (piernas cansadas, etc.)', duracion: '45–60 min', precio: '30–40 €' },
  { nombre: 'Masaje craneofacial', descripcion: 'Cara, cráneo y cuello. Relaja y mejora dolores de cabeza', duracion: '30 min', precio: '20–25 €' },
  { nombre: 'Masaje de espalda', descripcion: 'Masaje focalizado en zona dorsal, lumbar y cervical', duracion: '30–40 min', precio: '25–30 €' },
  { nombre: 'Masaje cervical', descripcion: 'Masaje específico para cervicales y trapecios', duracion: '20–30 min', precio: '20–25 €' },
  { nombre: 'Masaje podal (pies)', descripcion: 'Relajante o con técnica reflexológica básica', duracion: '30 min', precio: '20–25 €' },
  { nombre: 'Masaje abdominal', descripcion: 'Suave, mejora la digestión y libera tensión visceral', duracion: '20–30 min', precio: '20–25 €' },
  { nombre: 'Masaje combinado', descripcion: 'Por ejemplo: espalda + piernas o espalda + facial', duracion: '60 min', precio: '35–45 €' },
  { nombre: 'Masaje con aromaterapia', descripcion: 'Masaje relajante con aceites esenciales personalizados', duracion: '60 min', precio: '35–45 €' },
  { nombre: 'Masaje con piedras calientes', descripcion: 'Masaje relajante profundo con piedras volcánicas templadas', duracion: '60 min', precio: '40–50 €' },
  { nombre: 'Masaje anticelulítico / reafirmante', descripcion: 'Técnicas de amasamiento y drenaje para moldear zonas específicas', duracion: '30–40 min', precio: '25–35 €' },
];

const bonos = [
  {
    titulo: 'Bono 5 sesiones',
    descripcion: 'Ideal para quienes vienen una vez por semana o cada 15 días.',
    detalles: '5 masajes de 50–60 min',
    precio: '150 € (30 €/sesión en lugar de 35–40 €)',
    regalo: 'Pequeña sesión de 10 min extra en la última sesión (cuello o facial)'
  },
  {
    titulo: 'Bono 10 sesiones',
    descripcion: 'Para clientes constantes o con tratamiento prolongado (espalda, cervicales, estrés).',
    detalles: '10 masajes de 50–60 min',
    precio: '280 € (28 €/sesión)',
    regalo: '1 masaje facial o podal de 20 min extra'
  },
  {
    titulo: 'Programa “Mensual Relax”',
    descripcion: 'Cuota mensual para bienestar continuo.',
    detalles: '1 sesión semanal (4 al mes) de 60 min',
    precio: '110 €/mes',
    regalo: 'Horario flexible o fijo. No acumulable si se falta sin avisar.'
  },
  {
    titulo: 'Tarjeta de fidelidad “Tu 6º masaje es GRATIS”',
    descripcion: 'Sellas 5 sesiones → la 6ª es gratis (o al 50%). Válido durante 3 meses.',
    detalles: 'Premia a quien te recomienda: trae a un amigo → ambos tenéis 5 € de descuento en la siguiente sesión.',
    precio: 'Promoción por tiempo limitado o permanente',
    regalo: ''
  },
  {
    titulo: 'Bono "Familia Relajada"',
    descripcion: 'Pensado para familias que desean cuidarse sin gastar de más.',
    detalles: '5 sesiones de 50 min para compartir entre miembros de la familia',
    precio: '140 € (ahorras 35 € si el precio normal es 35 €/sesión)',
    regalo: 'Válido durante 2 meses'
  },
  {
    titulo: 'Bono “Peque + Mayor”',
    descripcion: 'Para que el niño y el adulto se beneficien del bienestar en conjunto.',
    detalles: '1 sesión de mindfulness para niño + 1 masaje de 50 min para adulto',
    precio: '45 € (en lugar de 60 €)',
    regalo: 'Ideal para sábado por la mañana o tarde'
  },
  {
    titulo: 'Bono "Dúo Relax"',
    descripcion: 'Para parejas que quieren compartir bienestar.',
    detalles: '2 masajes relajantes de 60 min (uno cada uno, en el mismo día o separados)',
    precio: '65 € (en lugar de 70 €)',
    regalo: 'Puedes ofrecer ambiente con velas y música suave'
  },
  {
    titulo: 'Bono "Pareja Constante"',
    descripcion: 'Para parejas que quieren cuidarse mes a mes.',
    detalles: '4 sesiones al mes (2 por persona)',
    precio: '120 € (en lugar de 140 €)',
    regalo: ''
  },
  {
    titulo: 'Bono "Mimos para mí"',
    descripcion: 'Porque cuidar a otros también merece autocuidado.',
    detalles: '4 sesiones de 40 min (relajante o espalda)',
    precio: '100 € (en lugar de 120 €)',
    regalo: 'Horario especial: solo mañanas entre semana (ej. 10:00 – 13:00)'
  },
  {
    titulo: 'Bono "Espalda Feliz"',
    descripcion: 'Para aliviar tensiones por carga física o emocional.',
    detalles: '3 masajes de espalda + 1 masaje facial de regalo',
    precio: '85 € (valor real: 110 €)',
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    } catch (err) {
      setError('Error al guardar la reserva. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    // Morning slots: 9:00 - 13:00
    for (let hour = 9; hour < 13; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 12) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    // Afternoon slots: 16:00 - 20:00
    for (let hour = 16; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
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
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fecha">Fecha *</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora *</label>
          <select
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una hora</option>
            {generateTimeSlots().map((slot, i) => (
              <option key={i} value={slot}>{slot}</option>
            ))}
          </select>
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
            <input
              type="date"
              value={editData.fecha}
              onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
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

// Admin Panel Component
const AdminPanel = ({ masajes }) => {
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    </div>
  );
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reservar'); // reservar, gestionar, admin

  return (
    <div className="main-container">
      <header className="fixed-header">
        <div className="header-content">
          <img src="/logo-removebg-preview.png" alt="Logo Quirozen" className="main-logo left" />
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#info" onClick={() => setMenuOpen(false)}>Información principal</a></li>
              <li><a href="#reservas" onClick={() => setMenuOpen(false)}>Reservas</a></li>
              <li><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre nosotros</a></li>
              <li><a href="#promos" onClick={() => setMenuOpen(false)}>Promociones/Bonos</a></li>
            </ul>
          </nav>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <main>
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
          <p>Próximamente.</p>
        </section>
        <section id="promos" className="section">
          <h2>Promociones y Bonos</h2>
          <div className="bonos-list">
            {bonos.map((b, i) => (
              <div className="bono-card" key={i}>
                <h4>{b.titulo}</h4>
                <p>{b.descripcion}</p>
                <p><strong>{b.detalles}</strong></p>
                <p><strong>Precio:</strong> {b.precio}</p>
                {b.regalo && <p><em>{b.regalo}</em></p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
