import React, { useEffect, useState } from 'react';
import './scroll-to-top.css';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="scroll-top">
      {isVisible && (
        <button type="button" onClick={scrollToTop}>
          <i className="ri-arrow-up-circle-line" style={{ fontSize: 'x-large' }} />
        </button>
      )}
    </div>
  );
}
