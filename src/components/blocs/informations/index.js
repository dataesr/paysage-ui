import { Icon } from '@dataesr/react-dsfr';

import SubSection from '../../sections/subSection';

export default function Informations() {
  return (
    <SubSection title={(
      <>
        En un coup d’œil
        <Icon className="ri-eye-2-line fr-ml-1w" />
      </>
    )}
    />
  );
}
