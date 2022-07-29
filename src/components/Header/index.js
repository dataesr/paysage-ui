import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div>Logo</div>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/contribuer">Contribuer</Link>
        <Link to="/personnes">Annuaire</Link>
        <Link to="/structures">Répertoire</Link>
        <Link to="/ressources">Ressources</Link>
        <Link to="/aide">Aide</Link>
      </nav>
    </header>
  );
}
