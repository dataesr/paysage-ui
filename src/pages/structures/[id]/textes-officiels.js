import { useParams } from 'react-router-dom';

import OfficialTexts from '../../../components/blocs/official-texts';
import useHashScroll from '../../../hooks/useHashScroll';

export default function StructureTextesOfficielsPage() {
  const { id } = useParams();
  useHashScroll();

  return (
    <div id="textes-officiels">
      <OfficialTexts apiObject="structures" id={id} />
    </div>
  );
}
