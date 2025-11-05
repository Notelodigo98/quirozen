import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../App.css';

function Terminos() {
  return (
    <Layout>
      <div className="legal-page">
        <div className="legal-header">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>Términos y Condiciones</h1>
        </div>
        
        <section className="section">
        <div className="legal-content">
          <h3>1. Aceptación de los términos</h3>
          <p>
            Al acceder y utilizar este sitio web, aceptas cumplir con estos términos y condiciones de uso. 
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
          </p>

          <h3>2. Servicios ofrecidos</h3>
          <p>
            Quirozen by Laura Escribano ofrece servicios de masajes terapéuticos y tratamientos de bienestar. 
            Todos los servicios están sujetos a disponibilidad y deben ser reservados con antelación.
          </p>

          <h3>3. Reservas y cancelaciones</h3>
          <p>
            Las reservas deben realizarse a través del sistema de reservas en línea. Se requiere un código de 
            reserva para gestionar o modificar tu cita. Las cancelaciones deben realizarse con al menos 24 horas 
            de antelación.
          </p>

          <h3>4. Precios y pagos</h3>
          <p>
            Los precios de los servicios están indicados en el sitio web y pueden estar sujetos a cambios sin 
            previo aviso. El pago se realiza directamente en el local al momento del servicio.
          </p>

          <h3>5. Limitación de responsabilidad</h3>
          <p>
            Quirozen by Laura Escribano no se hace responsable de cualquier lesión o daño que pueda resultar 
            del uso de nuestros servicios, excepto en casos de negligencia demostrada.
          </p>

          <h3>6. Modificaciones</h3>
          <p>
            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
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

export default Terminos;
