import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { PERSONNE_TERME, PRIX_TERME, PROJET_TERME, STRUCTURE_TERME, TERME_CATEGORIE } from '../../../utils/relations-tags';

export default function TermRelatedElements() {
  return (
    <>
      <RelationsByTag
        tag={STRUCTURE_TERME}
        blocName="Structures associées"
        resourceType="structures"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PERSONNE_TERME}
        blocName="Personnes associées"
        resourceType="persons"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PRIX_TERME}
        blocName="Prix associés"
        resourceType="prices"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PROJET_TERME}
        blocName="Projets associés"
        resourceType="projects"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={TERME_CATEGORIE}
        blocName="Catégorie associées"
        resourceType="terms"
        relatedObjectTypes={['categories']}
        noRelationType
      />
    </>
  );
}
