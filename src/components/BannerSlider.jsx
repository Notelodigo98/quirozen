import { useState, useEffect } from 'react';
import '../App.css';

const bannerImages = [
  '/interior/banner1.png',
  '/interior/banner2.jpg',
  '/interior/banner3.jpg',
  '/interior/banner4.avif',
  '/interior/banner5.webp'
];

function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // Cambia de imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="banner-slider">
      <div className="banner-container">
        <button 
          className="banner-nav banner-nav-prev" 
          onClick={goToPrevious}
          aria-label="Imagen anterior"
        >
          ←
        </button>
        
        <div className="banner-slides">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img 
                src={image} 
                alt={`Banner ${index + 1}`}
                className="banner-image"
              />
            </div>
          ))}
        </div>

        <button 
          className="banner-nav banner-nav-next" 
          onClick={goToNext}
          aria-label="Siguiente imagen"
        >
          →
        </button>
      </div>

      <div className="banner-indicators">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`banner-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
