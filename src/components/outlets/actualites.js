import { Icon, Text } from '@dataesr/react-dsfr';

import useHashScroll from '../../hooks/useHashScroll';

export default function ActualitesOutlet() {
  useHashScroll();
  return (
    <Text size="lg" bold className="fr-mt-5w">
      <Icon name="ri-tools-fill" size="3x" color="var(--text-default-warning)" />
      Encore un peu de patience, cette page est en developement...
    </Text>
  );
}