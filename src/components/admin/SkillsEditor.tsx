import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { supabase } from '../../lib/supabase';

interface CategoryForm {
  category: string;
  sort_order: number;
}

interface SkillForm {
  name: string;
  level: number;
  category_id: number;
  sort_order: number;
}

export default function SkillsEditor() {
  const { skillCategories, addSkillCategory, updateSkillCategory, deleteSkillCategory, refreshData } = useData();
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({ category: '', sort_order: 0 });

  const [editingSkill, setEditingSkill] = useState<{ categoryId: number; skillIndex: number } | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<SkillForm>({ name: '', level: 3, category_id: 0, sort_order: 0 });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Category handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: name === 'sort_order' ? parseInt(value) || 0 : value }));
  };

  const handleEditCategory = (cat: typeof skillCategories[0]) => {
    setEditingCategoryId(cat.id);
    setIsAddingCategory(false);
    setCategoryForm({ category: cat.category, sort_order: 0 });
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setEditingCategoryId(null);
    setCategoryForm({ category: '', sort_order: skillCategories.length });
  };

  const handleCancelCategory = () => {
    setEditingCategoryId(null);
    setIsAddingCategory(false);
    setCategoryForm({ category: '', sort_order: 0 });
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (isAddingCategory) {
        await addSkillCategory(categoryForm);
        setMessage({ type: 'success', text: 'Category added successfully!' });
      } else if (editingCategoryId) {
        await updateSkillCategory(editingCategoryId, categoryForm);
        setMessage({ type: 'success', text: 'Category updated successfully!' });
      }
      handleCancelCategory();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save category. Please try again.' });
      console.error('Error saving category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category and all its skills?')) return;

    try {
      await deleteSkillCategory(id);
      setMessage({ type: 'success', text: 'Category deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete category.' });
      console.error('Error deleting category:', error);
    }
  };

  // Skill handlers
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSkillForm(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'sort_order' || name === 'category_id' ? parseInt(value) || 0 : value,
    }));
  };

  const handleEditSkill = async (categoryId: number, skillIndex: number, skillName: string) => {
    // Fetch the actual skill from database to get its ID
    const { data: skills } = await supabase
      .from('skills')
      .select('*')
      .eq('category_id', categoryId)
      .eq('name', skillName)
      .single();

    if (skills) {
      setEditingSkill({ categoryId, skillIndex });
      setIsAddingSkill(null);
      setSkillForm({
        name: skills.name,
        level: skills.level,
        category_id: categoryId,
        sort_order: skills.sort_order,
      });
    }
  };

  const handleAddSkill = (categoryId: number) => {
    setIsAddingSkill(categoryId);
    setEditingSkill(null);
    const category = skillCategories.find(c => c.id === categoryId);
    setSkillForm({
      name: '',
      level: 3,
      category_id: categoryId,
      sort_order: category?.skills.length || 0,
    });
  };

  const handleCancelSkill = () => {
    setEditingSkill(null);
    setIsAddingSkill(null);
    setSkillForm({ name: '', level: 3, category_id: 0, sort_order: 0 });
  };

  const handleSubmitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (isAddingSkill !== null) {
        const { error } = await supabase.from('skills').insert(skillForm);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Skill added successfully!' });
      } else if (editingSkill) {
        // Get the skill ID by name and category
        const category = skillCategories.find(c => c.id === editingSkill.categoryId);
        const skillName = category?.skills[editingSkill.skillIndex]?.name;

        const { data: existingSkill } = await supabase
          .from('skills')
          .select('id')
          .eq('category_id', editingSkill.categoryId)
          .eq('name', skillName)
          .single();

        if (existingSkill) {
          const { error } = await supabase.from('skills').update(skillForm).eq('id', existingSkill.id);
          if (error) throw error;
          setMessage({ type: 'success', text: 'Skill updated successfully!' });
        }
      }
      await refreshData();
      handleCancelSkill();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save skill. Please try again.' });
      console.error('Error saving skill:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (categoryId: number, skillName: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('category_id', categoryId)
        .eq('name', skillName);

      if (error) throw error;
      await refreshData();
      setMessage({ type: 'success', text: 'Skill deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete skill.' });
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Skills</h2>
        {!isAddingCategory && !editingCategoryId && (
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Category
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

      {/* Add/Edit Category Form */}
      {(isAddingCategory || editingCategoryId) && (
        <form onSubmit={handleSubmitCategory} className="bg-gray-50 dark:bg-primary-800/50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isAddingCategory ? 'Add New Category' : 'Edit Category'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="category"
                value={categoryForm.category}
                onChange={handleCategoryChange}
                placeholder="e.g., Frontend, Backend, DevOps"
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
                value={categoryForm.sort_order}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancelCategory}
              className="px-4 py-2 bg-gray-200 dark:bg-primary-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-primary-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving...' : isAddingCategory ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Add/Edit Skill Form */}
      {(isAddingSkill !== null || editingSkill) && (
        <form onSubmit={handleSubmitSkill} className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isAddingSkill !== null ? 'Add New Skill' : 'Edit Skill'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                name="name"
                value={skillForm.name}
                onChange={handleSkillChange}
                placeholder="e.g., React, Python, Docker"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Proficiency Level (1-5)
              </label>
              <select
                name="level"
                value={skillForm.level}
                onChange={handleSkillChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Elementary</option>
                <option value={3}>3 - Intermediate</option>
                <option value={4}>4 - Advanced</option>
                <option value={5}>5 - Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                value={skillForm.sort_order}
                onChange={handleSkillChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancelSkill}
              className="px-4 py-2 bg-gray-200 dark:bg-primary-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-primary-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving...' : isAddingSkill !== null ? 'Add Skill' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Skill Categories List */}
      <div className="space-y-6">
        {skillCategories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-50 dark:bg-primary-800/30 p-4 rounded-lg border border-gray-200 dark:border-primary-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.category}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddSkill(category.id)}
                  className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white dark:bg-primary-800 rounded-lg border border-gray-200 dark:border-primary-600"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-900 dark:text-white font-medium">{skill.name}</span>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-4 h-1.5 rounded-full ${
                            level <= skill.level
                              ? 'bg-accent-500'
                              : 'bg-gray-200 dark:bg-primary-600'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {skill.level}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditSkill(category.id, index, skill.name)}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(category.id, skill.name)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {category.skills.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No skills in this category yet. Click "Add Skill" to get started.
              </p>
            )}
          </div>
        ))}
      </div>

      {skillCategories.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No skill categories yet. Click "Add Category" to get started.
        </p>
      )}
    </div>
  );
}
