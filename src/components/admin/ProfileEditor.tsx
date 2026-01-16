import { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { supabase } from '../../lib/supabase';

export default function ProfileEditor() {
  const { profile, updateProfile } = useData();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profile_image: '',
    cv_file: '',
    linkedin_url: '',
  });

  // Sync form data when profile changes (e.g., after fetching from Supabase)
  useEffect(() => {
    setFormData({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      profile_image: profile.profileImage,
      cv_file: profile.cvFile,
      linkedin_url: profile.socialLinks?.linkedin || '',
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 5MB.' });
      return;
    }

    setUploadingImage(true);
    setMessage(null);

    try {
      const publicUrl = await uploadFile(file, 'profile-images');
      if (publicUrl) {
        setFormData(prev => ({ ...prev, profile_image: publicUrl }));
        setMessage({ type: 'success', text: 'Image uploaded! Click "Save Changes" to update your profile.' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOC, DOCX)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a PDF or Word document.' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'CV must be smaller than 10MB.' });
      return;
    }

    setUploadingCV(true);
    setMessage(null);

    try {
      const publicUrl = await uploadFile(file, 'cv-files');
      if (publicUrl) {
        setFormData(prev => ({ ...prev, cv_file: publicUrl }));
        setMessage({ type: 'success', text: 'CV uploaded! Click "Save Changes" to update your profile.' });
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setMessage({ type: 'error', text: 'Failed to upload CV. Please try again.' });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h2>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            required
          />
        </div>

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
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Profile Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Profile Image
        </label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-primary-700 flex-shrink-0">
            {formData.profile_image ? (
              <img
                src={formData.profile_image}
                alt="Profile preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&size=96&background=7B2CBF&color=fff`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingImage}
              className="px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {uploadingImage ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Choose Image'
              )}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              JPG, PNG, GIF up to 5MB
            </p>
            {formData.profile_image && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                {formData.profile_image}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CV File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CV / Resume
        </label>
        <div className="flex items-center gap-4">
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleCVUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => cvInputRef.current?.click()}
            disabled={uploadingCV}
            className="px-4 py-2 border border-gray-300 dark:border-primary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {uploadingCV ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </span>
            ) : (
              'Choose CV File'
            )}
          </button>
          {formData.cv_file && (
            <a
              href={formData.cv_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-600 dark:text-accent-500 hover:underline text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View current CV
            </a>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          PDF, DOC, DOCX up to 10MB
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-primary-600 bg-white dark:bg-primary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || uploadingImage || uploadingCV}
          className="px-6 py-2 bg-accent-gradient text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
