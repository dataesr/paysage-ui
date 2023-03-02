import { RelationsByTag } from '../../../components/blocs/relations';
import { PROJET_CONTACT, PROJET_PARTICIPATION } from '../../../utils/relations-tags';

export default function PersonProjets() {
  return (
    <>
      <RelationsByTag
        tag={PROJET_CONTACT}
        blocName="Référent pour les projets"
        resourceType="projects"
        relatedObjectTypes={['persons']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PROJET_PARTICIPATION}
        blocName="Participations à des projets"
        resourceType="projects"
        relatedObjectTypes={['persons']}
        inverse
      />
    </>
  );
}
