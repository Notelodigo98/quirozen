import { useState } from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-container">
      <header className="fixed-header">
        <div className="header-content">
          <Link to="/">
            <img src="/logo-removebg-preview.png" alt="Logo Quirozen" className="main-logo left" />
          </Link>
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
        {children}
      </main>
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section footer-logo">
            <img src="/logo-removebg-preview.png" alt="Logo Quirozen" className="footer-logo-img" />
            <p className="footer-brand">Quirozen by Laura Escribano</p>
          </div>

          <div className="footer-section footer-contact">
            <h3>Contacto</h3>
            <div className="footer-contact-item">
              <span className="footer-icon">📍</span>
              <div>
                <p>Calle Leopoldo Arias Clarín, Local 148</p>
                <p>Dos Hermanas, Sevilla</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="footer-icon">📞</span>
              <p><a href="tel:675610730" className="footer-link">675 61 07 30</a></p>
            </div>
          </div>

          <div className="footer-section footer-links">
            <h3>Enlaces</h3>
            <ul>
              <li><a href="#info" onClick={() => setMenuOpen(false)}>Información principal</a></li>
              <li><a href="#reservas" onClick={() => setMenuOpen(false)}>Reservas</a></li>
              <li><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre nosotros</a></li>
              <li><a href="#promos" onClick={() => setMenuOpen(false)}>Promociones</a></li>
            </ul>
          </div>

          <div className="footer-section footer-legal">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terminos" onClick={() => setMenuOpen(false)}>Términos y condiciones</Link></li>
              <li><Link to="/acuerdo" onClick={() => setMenuOpen(false)}>Acuerdo de usuario</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Quirozen by Laura Escribano. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
