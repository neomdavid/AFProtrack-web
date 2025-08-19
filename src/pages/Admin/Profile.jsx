import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Label = ({ children }) => (
  <label className="text-sm font-medium text-gray-700">{children}</label>
);

const Field = ({ value }) => (
  <div className="px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-800">{value || '-'}</div>
);

const Input = (props) => (
  <input {...props} className={`input input-bordered w-full ${props.className || ''}`} />
);

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    serviceId: user?.serviceId || '',
    role: user?.role || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const result = await updateProfile(form);
    setSaving(false);
    if (result.success) {
      setIsEditing(false);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.error || 'Failed to update');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={() => { setIsEditing(false); setForm({ name: user?.name || '', email: user?.email || '', serviceId: user?.serviceId || '', role: user?.role || '' });}}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        )}
      </div>

      {message && (
        <div className="alert alert-success py-2 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Full Name</Label>
          {isEditing ? (
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
          ) : (
            <Field value={user?.name} />
          )}
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          {isEditing ? (
            <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          ) : (
            <Field value={user?.email} />
          )}
        </div>

        <div className="space-y-2">
          <Label>Service ID</Label>
          {isEditing ? (
            <Input name="serviceId" value={form.serviceId} onChange={handleChange} placeholder="Service ID" />
          ) : (
            <Field value={user?.serviceId} />
          )}
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          {isEditing ? (
            <select name="role" value={form.role} onChange={handleChange} className="select select-bordered w-full">
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
              <option value="staff">Staff</option>
            </select>
          ) : (
            <Field value={user?.role} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
