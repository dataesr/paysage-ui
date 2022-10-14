import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function StructureProjectsPage() {
  return (
    <RelationsByTag
      tag="participations"
      blocName="Participations à des projets"
      resourceType="projects"
      relatedObjectTypes={['structures']}
      inverse
    />
  );
}
