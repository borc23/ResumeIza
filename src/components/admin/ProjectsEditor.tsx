import { useState } from 'react';
import { useData } from '../../context/DataContext';

interface ProjectForm {
  title: string;
  description: string;
  long_description: string;
  image: string;
  technologies: string;
  live_url: string;
  github_url: string;
  featured: boolean;
  sort_order: number;
}

const emptyForm: ProjectForm = {
  title: '',
  description: '',
  long_description: '',
  image: '',
  technologies: '',
  live_url: '',
  github_url: '',
  featured: false,
  sort_order: 0,
};

export default function ProjectsEditor() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'sort_order' ? parseInt(value) || 0 : value }));
    }
  };

  const handleEdit = (proj: typeof projects[0]) => {
    setEditingId(proj.id);
    setIsAdding(false);
    setFormData({
      title: proj.title,
      description: proj.description,
      long_description: proj.longDescription,
      image: proj.image,
      technologies: proj.technologies.join(', '),
      live_url: proj.liveUrl || '',
      github_url: proj.githubUrl || '',
      featured: proj.featured,
      sort_order: 0,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ ...emptyForm, sort_order: projects.length });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(emptyForm);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const data = {
      title: formData.title,
      description: formData.description,
      long_description: formData.long_description,
      image: formData.image,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      live_url: formData.live_url || null,
      github_url: formData.github_url || null,
      featured: formData.featured,
      sort_order: formData.sort_order,
    };

    try {
      if (isAdding) {
        await addProject(data);
        setMessage({ type: 'success', text: 'Project added successfully!' });
      } else if (editingId) {
        await updateProject(editingId, data);
        setMessage({ type: 'success', text: 'Project updated successfully!' });
      }
      handleCancel();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save project. Please try again.' });
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      setMessage({ type: 'success', text: 'Project deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete project.' });
      console.error('Error deleting project:', error);
    }
  };

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Projects</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Project
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-primary-800/50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isAdding ? 'Add New Project' : 'Edit Project'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/projects/project.jpg or https://..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Live URL (optional)
              </label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub URL (optional)
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Long Description
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-accent-600 bg-white dark:bg-primary-800 border-gray-300 dark:border-primary-600 rounded focus:ring-accent-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Project
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-primary-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-primary-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving...' : isAdding ? 'Add Project' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Featured Projects</h3>
          <div className="space-y-4">
            {featuredProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Other Projects</h3>
          <div className="space-y-4">
            {otherProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
  };
  onEdit: (p: typeof project) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-gray-50 dark:bg-primary-800/30 p-4 rounded-lg border border-gray-200 dark:border-primary-700">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          {project.image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-primary-700 flex-shrink-0">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
              {project.featured && (
                <span className="px-2 py-0.5 text-xs bg-accent-500/20 text-accent-700 dark:text-accent-400 rounded">
                  Featured
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{project.description}</p>
            {project.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {project.technologies.slice(0, 5).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-primary-700 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="px-2 py-0.5 text-xs text-gray-400">
                    +{project.technologies.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(project)}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
