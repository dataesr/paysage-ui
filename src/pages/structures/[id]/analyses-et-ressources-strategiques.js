import { useParams } from 'react-router-dom';

import Documents from '../../../components/blocs/documents';
import useHashScroll from '../../../hooks/useHashScroll';

export default function StructureAnalyseEtRessourcesStrategiquesPage() {
  const { id } = useParams();
  useHashScroll();

  return (
    <>
      <div id="notes-du-conseiller">
        Notes du conseiller
      </div>
      <div id="documents">
        <Documents apiObject="structures" id={id} />
      </div>
      <div id="evaluations-hceres">
        Evaluations HCERES
      </div>
    </>
  );
}
