import { Text } from '@dataesr/react-dsfr';

import useHashScroll from '../../hooks/useHashScroll';

export default function ActualitesOutlet() {
  useHashScroll();
  return (
    <Text>
      Pas d'actualité pour le moment
    </Text>
  );
}
