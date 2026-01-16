import { useState } from 'react';
import { useData } from '../../context/DataContext';

interface TestimonialForm {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const emptyForm: TestimonialForm = {
  name: '',
  role: '',
  company: '',
  content: '',
  image: '',
};

export default function TestimonialsEditor() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<TestimonialForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (testimonial: typeof testimonials[0]) => {
    setEditingId(testimonial.id);
    setIsAdding(false);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      image: testimonial.image || '',
    });
    setMessage(null);
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormData(emptyForm);
    setMessage(null);
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

    try {
      if (editingId) {
        await updateTestimonial(editingId, {
          ...formData,
          image: formData.image || null,
        });
        setMessage({ type: 'success', text: 'Testimonial updated successfully' });
      } else {
        await addTestimonial({
          ...formData,
          image: formData.image || null,
        });
        setMessage({ type: 'success', text: 'Testimonial created successfully' });
        setIsAdding(false);
        setFormData(emptyForm);
      }
      if (editingId) setEditingId(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save testimonial' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await deleteTestimonial(id);
      setMessage({ type: 'success', text: 'Testimonial deleted successfully' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to delete testimonial' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Testimonials</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Add New Testimonial
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-primary-800/50 p-6 rounded-xl border border-gray-200 dark:border-primary-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Testimonial Content
            </label>
            <textarea
              name="content"
              required
              rows={4}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving...' : (editingId ? 'Update Testimonial' : 'Create Testimonial')}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white dark:bg-primary-900/30 rounded-xl p-6 shadow border border-gray-200 dark:border-primary-700 flex flex-col md:flex-row gap-6 items-start"
          >
            {testimonial.image && (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-accent-600 dark:text-accent-500">{testimonial.role}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-3">{testimonial.company}</p>
              <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No testimonials found. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
