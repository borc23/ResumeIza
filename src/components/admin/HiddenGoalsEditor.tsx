import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface HiddenGoal {
  id: number;
  content: string;
  created_at: string;
}

export default function HiddenGoalsEditor() {
  const [goals, setGoals] = useState<HiddenGoal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch hidden goals on mount
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hidden_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching hidden goals:', error);
      setMessage({ type: 'error', text: 'Failed to load hidden goals.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) {
      setMessage({ type: 'error', text: 'Please enter a goal.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('hidden_goals')
        .insert([{ content: newGoal }])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setGoals([data[0], ...goals]);
        setNewGoal('');
        setMessage({ type: 'success', text: 'Goal added successfully!' });
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      setMessage({ type: 'error', text: 'Failed to add goal. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateGoal = async (id: number) => {
    if (!editingContent.trim()) {
      setMessage({ type: 'error', text: 'Please enter a goal.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('hidden_goals')
        .update({ content: editingContent })
        .eq('id', id);

      if (error) throw error;

      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, content: editingContent } : goal
      ));
      setEditingId(null);
      setEditingContent('');
      setMessage({ type: 'success', text: 'Goal updated successfully!' });
    } catch (error) {
      console.error('Error updating goal:', error);
      setMessage({ type: 'error', text: 'Failed to update goal. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase
        .from('hidden_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(goals.filter(goal => goal.id !== id));
      setMessage({ type: 'success', text: 'Goal deleted successfully!' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      setMessage({ type: 'error', text: 'Failed to delete goal.' });
    }
  };

  const handleStartEdit = (goal: HiddenGoal) => {
    setEditingId(goal.id);
    setEditingContent(goal.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hidden Goals & Aspirations</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add hidden goals and aspirations that the AI chatbot can reference. These won't be directly displayed on your portfolio but will inform the chatbot's responses.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add New Goal Form */}
      <form onSubmit={handleAddGoal} className="bg-gray-50 dark:bg-primary-900/50 p-6 rounded-lg border border-gray-200 dark:border-primary-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Goal
          </label>
          <textarea
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="e.g., 'I want to transition to a role focused on AI safety and alignment research...'"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-accent-gradient text-gray-900 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Adding...' : 'Add Goal'}
        </button>
      </form>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No hidden goals added yet. Add your first one above!
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-gray-50 dark:bg-primary-900/50 p-6 rounded-lg border border-gray-200 dark:border-primary-700 space-y-3"
            >
              {editingId === goal.id ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateGoal(goal.id)}
                      disabled={saving}
                      className="px-4 py-2 bg-accent-gradient text-gray-900 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-300 dark:bg-primary-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-primary-600 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{goal.content}</p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleStartEdit(goal)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
