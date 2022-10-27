import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PersonProjets() {
  return (
    <>
      <RelationsByTag
        tag="project-contact"
        blocName="Contact"
        resourceType="projects"
        relatedObjectTypes={['persons']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag="participations"
        blocName="Participations à des projets"
        resourceType="projects"
        relatedObjectTypes={['persons']}
        inverse
      />
    </>
  );
}
