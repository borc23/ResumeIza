import { useState } from 'react';
import { useData } from '../../context/DataContext';

interface ExperienceForm {
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string;
  technologies: string;
  sort_order: number;
}

const emptyForm: ExperienceForm = {
  company: '',
  position: '',
  period: '',
  description: '',
  achievements: '',
  technologies: '',
  sort_order: 0,
};

export default function ExperienceEditor() {
  const { experiences, addExperience, updateExperience, deleteExperience } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ExperienceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sort_order' ? parseInt(value) || 0 : value }));
  };

  const handleEdit = (exp: typeof experiences[0]) => {
    setEditingId(exp.id);
    setIsAdding(false);
    setFormData({
      company: exp.company,
      position: exp.position,
      period: exp.period,
      description: exp.description,
      achievements: exp.achievements.join('\n'),
      technologies: exp.technologies.join(', '),
      sort_order: 0,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ ...emptyForm, sort_order: experiences.length });
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
      company: formData.company,
      position: formData.position,
      period: formData.period,
      description: formData.description,
      achievements: formData.achievements.split('\n').filter(a => a.trim()),
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      sort_order: formData.sort_order,
    };

    try {
      if (isAdding) {
        await addExperience(data);
        setMessage({ type: 'success', text: 'Experience added successfully!' });
      } else if (editingId) {
        await updateExperience(editingId, data);
        setMessage({ type: 'success', text: 'Experience updated successfully!' });
      }
      handleCancel();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save experience. Please try again.' });
      console.error('Error saving experience:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      await deleteExperience(id);
      setMessage({ type: 'success', text: 'Experience deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete experience.' });
      console.error('Error deleting experience:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Experience</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Experience
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
            {isAdding ? 'Add New Experience' : 'Edit Experience'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period
              </label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleChange}
                placeholder="e.g., Jan 2022 - Present"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
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
              Achievements (one per line)
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows={4}
              placeholder="Enter each achievement on a new line"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
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
            />
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
              {saving ? 'Saving...' : isAdding ? 'Add Experience' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-gray-50 dark:bg-primary-800/30 p-4 rounded-lg border border-gray-200 dark:border-primary-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                <p className="text-accent-600 dark:text-accent-500">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {exp.achievements.slice(0, 2).map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                    {exp.achievements.length > 2 && (
                      <li className="text-gray-400">...and {exp.achievements.length - 2} more</li>
                    )}
                  </ul>
                )}
                {exp.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-accent-500/20 text-accent-700 dark:text-accent-400 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(exp)}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
