import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// Ces 2 lib rendre la possibilité au composant d'interagir pour subir des tests
import { ButtonToTest } from './composantATest';
// On importe le composant qu'on veut tester

describe('Button', () => {
  // On commence une serie de test pour le composant ButtonToTest
  it('should render the button text', () => {
    const { getByText } = render(<ButtonToTest onClick={() => {}} />);
    // Rend le composant ButtonToTest avec une fonction onClick vide et stocke la méthode getByText de
    // testing-library/react pour récupérer les éléments du DOM par texte.

    expect(getByText('lancer le test')).toBeInTheDocument();
    // Vérifie que le texte 'lancer le test' est présent dans le DOM et qu'il est visible à l'utilisateur.
  });

  it('should call the onClick function when clicked', () => {
    // Commence un test pour vérifier que la fonction onClick est appelée lorsqu'on clique sur le bouton
    const onClick = jest.fn();
    // Initialise un mock de la fonction onClick.
    // mock ???? c'est un objet simulé qui imite le comportement d'un objet réel dans un environnement contrôlé

    const { getByText } = render(<ButtonToTest onClick={onClick} />);
    // Rend le composant ButtonToTest avec la fonction onClick mockée et
    // stocke la méthode getByText de testing-library/react pour récupérer les éléments du DOM par texte.

    const button = getByText('lancer le test');
    // Récupère le bouton à partir du texte 'lancer le test'.

    fireEvent.click(button);
    // Simule un clic sur le bouton.

    expect(onClick).toHaveBeenCalledTimes(1);
    // Vérifie que la fonction onClick mockée a été appelée exactement une fois.
  });
});
