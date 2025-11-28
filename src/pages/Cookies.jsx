import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import './Cookies.css';

const Cookies = () => {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [cookieDate, setCookieDate] = useState(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const date = localStorage.getItem('cookieConsentDate');
    setCookieConsent(consent);
    setCookieDate(date);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setCookieConsent('accepted');
    setCookieDate(new Date().toISOString());
    alert('Preferencias de cookies guardadas. Has aceptado el uso de cookies.');
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setCookieConsent('rejected');
    setCookieDate(new Date().toISOString());
    alert('Preferencias de cookies guardadas. Has rechazado el uso de cookies.');
  };

  const handleRevoke = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    setCookieConsent(null);
    setCookieDate(null);
    alert('Preferencias de cookies eliminadas. El banner volverá a aparecer en tu próxima visita.');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="cookies-page">
        <div className="cookies-container">
          <h1>Política de Cookies</h1>
          <p className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="cookies-section">
            <h2>¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
              (ordenador, tablet o móvil) cuando visitas un sitio web. Estas cookies permiten 
              que el sitio web recuerde tus acciones y preferencias durante un período de tiempo, 
              por lo que no tienes que volver a configurarlas cada vez que regresas al sitio o 
              navegas de una página a otra.
            </p>
          </section>

          <section className="cookies-section">
            <h2>¿Cómo utilizamos las cookies?</h2>
            <p>
              En <strong>Quirozen</strong> utilizamos cookies para:
            </p>
            <ul>
              <li>
                <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio web. 
                Estas cookies permiten funciones básicas como la navegación por la página y el acceso a 
                áreas seguras del sitio web.
              </li>
              <li>
                <strong>Cookies de preferencias:</strong> Nos permiten recordar tus preferencias y 
                configuraciones (como tu idioma preferido o región) para proporcionarte una experiencia 
                más personalizada.
              </li>
              <li>
                <strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo los visitantes 
                interactúan con nuestro sitio web, recopilando información de forma anónima. Esto nos 
                permite mejorar el funcionamiento del sitio.
              </li>
            </ul>
          </section>

          <section className="cookies-section">
            <h2>Tipos de cookies que utilizamos</h2>
            <div className="cookie-types">
              <div className="cookie-type-card">
                <h3>Cookies Técnicas (Necesarias)</h3>
                <p>
                  Estas cookies son esenciales para que el sitio web funcione correctamente. 
                  No se pueden desactivar en nuestros sistemas. Generalmente solo se configuran 
                  en respuesta a acciones realizadas por ti, como establecer tus preferencias de 
                  privacidad, iniciar sesión o completar formularios.
                </p>
                <p><strong>Duración:</strong> Sesión o persistentes</p>
              </div>

              <div className="cookie-type-card">
                <h3>Cookies de Funcionalidad</h3>
                <p>
                  Estas cookies permiten que el sitio web proporcione funcionalidad y 
                  personalización mejoradas. Pueden ser establecidas por nosotros o por 
                  proveedores externos cuyos servicios hemos agregado a nuestras páginas.
                </p>
                <p><strong>Duración:</strong> Hasta 1 año</p>
              </div>

              <div className="cookie-type-card">
                <h3>Cookies de Análisis</h3>
                <p>
                  Estas cookies nos permiten contar las visitas y las fuentes de tráfico para 
                  poder medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber 
                  qué páginas son las más y menos populares y ver cómo los visitantes se mueven 
                  por el sitio.
                </p>
                <p><strong>Duración:</strong> Hasta 2 años</p>
              </div>
            </div>
          </section>

          <section className="cookies-section">
            <h2>Gestión de cookies</h2>
            <p>
              Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las 
              cookies que ya están en tu ordenador y puedes configurar la mayoría de los navegadores 
              para evitar que se coloquen. Sin embargo, si haces esto, es posible que tengas que 
              ajustar manualmente algunas preferencias cada vez que visites un sitio y que algunos 
              servicios y funcionalidades no funcionen.
            </p>

            <div className="cookie-management">
              <h3>Tu preferencia actual</h3>
              {cookieConsent ? (
                <div className="preference-status">
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span className={`status-badge ${cookieConsent === 'accepted' ? 'accepted' : 'rejected'}`}>
                      {cookieConsent === 'accepted' ? '✅ Aceptado' : '❌ Rechazado'}
                    </span>
                  </p>
                  <p><strong>Fecha:</strong> {formatDate(cookieDate)}</p>
                  <div className="preference-actions">
                    <button onClick={handleRevoke} className="btn-revoke">
                      Revocar consentimiento
                    </button>
                    {cookieConsent === 'rejected' && (
                      <button onClick={handleAccept} className="btn-accept">
                        Cambiar a Aceptar
                      </button>
                    )}
                    {cookieConsent === 'accepted' && (
                      <button onClick={handleReject} className="btn-reject">
                        Cambiar a Rechazar
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="preference-status">
                  <p>No has establecido una preferencia aún.</p>
                  <div className="preference-actions">
                    <button onClick={handleAccept} className="btn-accept">
                      Aceptar cookies
                    </button>
                    <button onClick={handleReject} className="btn-reject">
                      Rechazar cookies
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="cookies-section">
            <h2>Cookies de terceros</h2>
            <p>
              Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas. 
              Actualmente, no utilizamos cookies de terceros para publicidad o seguimiento, pero esto 
              puede cambiar en el futuro. Si implementamos cookies de terceros, actualizaremos esta 
              política y te notificaremos.
            </p>
          </section>

          <section className="cookies-section">
            <h2>Más información</h2>
            <p>
              Si deseas obtener más información sobre las cookies y cómo gestionarlas, puedes visitar:
            </p>
            <ul>
              <li>
                <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
                  All About Cookies
                </a>
              </li>
              <li>
                <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">
                  Your Online Choices
                </a>
              </li>
            </ul>
          </section>

          <section className="cookies-section">
            <h2>Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos:
            </p>
            <ul>
              <li><strong>Email:</strong> info@quirozendh.com</li>
              <li><strong>Teléfono:</strong> 675 61 07 30</li>
              <li><strong>Dirección:</strong> Calle Leopoldo Arias Clarín, Local 148, Dos Hermanas, Sevilla</li>
            </ul>
          </section>

          <div className="cookies-footer">
            <Link to="/" className="back-link">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;

