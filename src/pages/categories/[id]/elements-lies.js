import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function CategoriesRelatedElements() {
  return (
    <>
      <RelationsByTag
        tag="structures-categories"
        blocName="Structures associées"
        resourceType="structures"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="personnes-categories"
        blocName="Personnes associées"
        resourceType="persons"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="prices-categories"
        blocName="Prix associés"
        resourceType="prices"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="projects-categories"
        blocName="Projets associés"
        resourceType="projects"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="terms-categories"
        blocName="Termes associées"
        resourceType="terms"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
    </>
  );
}
