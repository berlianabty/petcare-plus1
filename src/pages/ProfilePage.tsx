import { useState, useRef } from 'react';
import { Camera, Pencil, Check, X, Mail, Phone, MapPin, User as UserIcon, PawPrint, Calendar, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { usePetStore } from '../store/petStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useToast } from '../hooks/useToast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { pets } = usePetStore();
  const { appointments } = useAppointmentStore();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile({ ...formData, avatar: avatarSrc });
    setEditing(false);
    showToast('Profile updated!', 'success');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
    });
    setAvatarSrc(user?.avatar || '');
    setEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarSrc(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile</h1>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            {avatarSrc ? (
              <img src={avatarSrc} alt={user?.name} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {user?.memberSince}</p>
          </div>
          {!editing && (
            <Button variant="outline" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 mx-auto mb-2">
            <PawPrint className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pets.length}</p>
          <p className="text-xs text-gray-500">Total Pets</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30 mx-auto mb-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{appointments.length}</p>
          <p className="text-xs text-gray-500">Appointments</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30 mx-auto mb-2">
            <FileText className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.memberSince?.split(' ')[0]}</p>
          <p className="text-xs text-gray-500">Member Since</p>
        </Card>
      </div>

      {/* Edit Form */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            leftIcon={<UserIcon className="h-4 w-4" />}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editing}
          />
          <Input
            label="Email"
            type="email"
            leftIcon={<Mail className="h-4 w-4" />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!editing}
          />
          <Input
            label="Phone"
            leftIcon={<Phone className="h-4 w-4" />}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!editing}
          />
          <Input
            label="Location"
            leftIcon={<MapPin className="h-4 w-4" />}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            disabled={!editing}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!editing}
            placeholder="Tell us about yourself..."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>
        {editing && (
          <div className="mt-4 flex gap-3">
            <Button variant="primary" leftIcon={<Check className="h-4 w-4" />} onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" leftIcon={<X className="h-4 w-4" />} onClick={handleCancel}>Cancel</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
