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
      <a href="#top">
        <i className="ri-arrow-up-circle-line" />
      </a>
    </div>
  ) : null;
}

export default ScrollToTop;
