import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PersonProjets() {
  return (
    <RelationsByTag
      tag="participations"
      blocName="Participations à des projets"
      resourceType="projects"
      relatedObjectTypes={['persons']}
      inverse
    />
  );
}
