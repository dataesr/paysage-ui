import React, { useEffect, useState } from 'react';
import Button from '../button';
import './scroll-to-top.scss';

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
        <Button color="text" size="lg" tertiary rounded borderless icon="ri-arrow-up-circle-line" onClick={scrollToTop} />
      )}
    </div>
  );
}
