import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../App.css';

function Acuerdo() {
  return (
    <Layout>
      <div className="legal-page">
        <div className="legal-header">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>Acuerdo de Usuario</h1>
        </div>
        
        <section className="section">
        <div className="legal-content">
          <h3>1. Registro y uso del sistema</h3>
          <p>
            El sistema de reservas de Quirozen by Laura Escribano no requiere registro previo. Se te proporcionará 
            un código único de reserva que te permitirá gestionar tu cita de forma segura y sencilla.
          </p>

          <h3>2. Uso responsable</h3>
          <p>
            Te comprometes a utilizar el sistema de reservas de manera responsable y solo para fines legítimos. 
            No está permitido el uso fraudulento o abusivo del sistema.
          </p>

          <h3>3. Protección de datos</h3>
          <p>
            Los datos personales proporcionados durante el proceso de reserva serán tratados de acuerdo con la 
            legislación vigente en materia de protección de datos. Tus datos se utilizan únicamente para gestionar 
            tu reserva y contactarte en caso necesario.
          </p>

          <h3>4. Confidencialidad del código de reserva</h3>
          <p>
            Es tu responsabilidad mantener la confidencialidad de tu código de reserva. No compartas este código 
            con terceros, ya que permite acceder y modificar tu reserva.
          </p>

          <h3>5. Precisión de la información</h3>
          <p>
            Te comprometes a proporcionar información precisa y actualizada al realizar una reserva. Cualquier 
            información incorrecta puede afectar la prestación del servicio.
          </p>

          <h3>6. Disponibilidad del servicio</h3>
          <p>
            Nos esforzamos por mantener el sistema de reservas disponible en todo momento, pero no garantizamos 
            su disponibilidad ininterrumpida. Puede haber interrupciones por mantenimiento o causas técnicas.
          </p>

          <h3>7. Derechos del usuario</h3>
          <p>
            Tienes derecho a modificar o cancelar tu reserva utilizando tu código de reserva. También puedes 
            contactarnos directamente si necesitas asistencia adicional.
          </p>

          <p className="legal-updated">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>
      </div>
    </Layout>
  );
}

export default Acuerdo;
