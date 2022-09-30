import useHashScroll from '../../../hooks/useHashScroll';

export default function StructureAnalyseEtRessourcesStrategiquesPage() {
  useHashScroll();
  return (
    <>
      <div id="notes-du-conseiller">
        Notes du conseiller
      </div>
      <div id="documents">
        Documents
      </div>
      <div id="evaluations-hceres">
        Evaluations HCERES
      </div>
    </>
  );
}
