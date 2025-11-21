import { useState } from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-container">
      <header className="fixed-header">
        <div className="header-content">
          <Link to="/">
            <img src="/logonuevo.png" alt="Logo Quirozen" className="main-logo left" />
          </Link>
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#info" onClick={() => setMenuOpen(false)}>Información principal</a></li>
              <li><a href="#mindfulness" onClick={() => setMenuOpen(false)}>Mindfulness</a></li>
              <li><a href="#estetica" onClick={() => setMenuOpen(false)}>Estética y belleza</a></li>
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
            <img src="/logonuevo.png" alt="Logo Quirozen" className="footer-logo-img" />
            <p className="footer-brand">Quirozen</p>
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

          <div className="footer-section footer-social">
            <h3>Redes Sociales</h3>
            <div className="footer-social-item">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <a href="https://www.instagram.com/quirozen1" target="_blank" rel="noopener noreferrer" className="footer-link">@quirozen1</a>
            </div>
            <div className="footer-social-item">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <a href="https://www.tiktok.com/@quirozen1" target="_blank" rel="noopener noreferrer" className="footer-link">@quirozen1</a>
            </div>
            <div className="footer-social-item">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <a href="https://www.facebook.com/quirozen1" target="_blank" rel="noopener noreferrer" className="footer-link">@quirozen1</a>
            </div>
          </div>

          <div className="footer-section footer-links-legal">
            <div className="footer-links">
              <h3>Enlaces</h3>
              <ul>
                <li><a href="#info" onClick={() => setMenuOpen(false)}>Información principal</a></li>
                <li><a href="#mindfulness" onClick={() => setMenuOpen(false)}>Mindfulness</a></li>
                <li><a href="#estetica" onClick={() => setMenuOpen(false)}>Estética y belleza</a></li>
                <li><a href="#reservas" onClick={() => setMenuOpen(false)}>Reservas</a></li>
                <li><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre nosotros</a></li>
                <li><a href="#promos" onClick={() => setMenuOpen(false)}>Promociones</a></li>
              </ul>
            </div>

            <div className="footer-legal">
              <h3>Legal</h3>
              <ul>
                <li><Link to="/terminos" onClick={() => setMenuOpen(false)}>Términos y condiciones</Link></li>
                <li><Link to="/acuerdo" onClick={() => setMenuOpen(false)}>Acuerdo de usuario</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Quirozen. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
