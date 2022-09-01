import { useState } from 'react';
import styles from './styles.module.scss';

export default function ToolItemDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button type="button" className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm" onClick={() => { setIsOpen(!isOpen); }}>folland</button>
      <div style={{ '--collapse': '-8px', 'max-height': 'none' }} className={`fr-collapse ${isOpen ? 'fr-collapse--expanded' : ''}`}>
        <ul className="fr-menu__list">
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
          <li><a className="fr-nav__link fr-link--md" href="">Hello world</a></li>
        </ul>
      </div>
    </div>
  );
}
