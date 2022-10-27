import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function TermRelatedElements() {
  return (
    <>
      <RelationsByTag
        tag="structures-terms"
        blocName="Structures associées"
        resourceType="structures"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="personnes-terms"
        blocName="Personnes associées"
        resourceType="persons"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="prices-terms"
        blocName="Prix associés"
        resourceType="prices"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="projects-terms"
        blocName="Projets associés"
        resourceType="projects"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="terms-categories"
        blocName="Catégorie associées"
        resourceType="terms"
        relatedObjectTypes={['categories']}
        noRelationType
      />
    </>
  );
}
