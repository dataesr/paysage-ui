import RelationsByTag from '../../../components/blocs/relations-by-tag';
import {
  PERSONNE_CATEGORIE,
  PRIX_CATEGORIE,
  PROJET_CATEGORIE,
  STRUCTURE_CATEGORIE,
  TERME_CATEGORIE,
} from '../../../utils/relations-tags';

export default function CategoriesRelatedElements() {
  return (
    <>
      <RelationsByTag
        tag={STRUCTURE_CATEGORIE}
        blocName="Structures associées"
        resourceType="structures"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PERSONNE_CATEGORIE}
        blocName="Personnes associées"
        resourceType="persons"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PRIX_CATEGORIE}
        blocName="Prix associés"
        resourceType="prices"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PROJET_CATEGORIE}
        blocName="Projets associés"
        resourceType="projects"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={TERME_CATEGORIE}
        blocName="Termes associées"
        resourceType="terms"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
    </>
  );
}
