import React, { useEffect, useState } from 'react';
import './scroll-to-top.css';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = window.pageYOffset > 500 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return isVisible ? (
    <div className="scroll-top">
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        <i className="ri-arrow-up-circle-line" style={{ fontSize: 'x-large' }} />
      </button>
    </div>
  ) : null;
}

export default ScrollToTop;
