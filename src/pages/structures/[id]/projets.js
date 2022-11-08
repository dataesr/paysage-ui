import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { PROJET_PARTICIPATION } from '../../../utils/relations-tags';

export default function StructureProjectsPage() {
  return (
    <RelationsByTag
      tag={PROJET_PARTICIPATION}
      blocName="Participations à des projets"
      resourceType="projects"
      relatedObjectTypes={['structures']}
      inverse
    />
  );
}
