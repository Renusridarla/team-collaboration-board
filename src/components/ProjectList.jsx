import ProjectCard from './ProjectCard';

export default function ProjectList({ projects, onEdit, onDelete }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
