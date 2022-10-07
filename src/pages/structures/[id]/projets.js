import Relations from '../../../components/blocs/relations-by-tag';

export default function StructureProjectsPage() {
  return (
    <Relations
      tag="participations"
      blocName="Participations à des projets"
      resourceType="projects"
      relatedObjectTypes={['structures']}
      inverse
    />
  );
}
