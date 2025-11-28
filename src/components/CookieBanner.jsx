import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya ha tomado una decisión
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Mostrar el banner después de un pequeño delay para mejor UX
      setTimeout(() => {
        setShowBanner(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Aquí puedes agregar código para activar cookies de terceros si es necesario
    // Por ejemplo, Google Analytics, etc.
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Aquí puedes agregar código para desactivar cookies de terceros
  };

  const handleManageCookies = () => {
    // Redirigir a la página de política de cookies
    window.location.href = '/cookies';
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <h4>🍪 Política de Cookies</h4>
          <p>
            Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. 
            Al hacer clic en "Aceptar", consientes el uso de cookies según nuestra 
            <Link to="/cookies" className="cookie-link"> política de cookies</Link>.
          </p>
        </div>
        <div className="cookie-banner-buttons">
          <button onClick={handleReject} className="btn-cookie-reject">
            Rechazar
          </button>
          <button onClick={handleManageCookies} className="btn-cookie-manage">
            Gestionar
          </button>
          <button onClick={handleAccept} className="btn-cookie-accept">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

