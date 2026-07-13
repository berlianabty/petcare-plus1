import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Bell, Mail, Calendar, Globe, Lock, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';

export default function SettingsPage() {
  const { darkMode, notifications, language, toggleDarkMode, toggleNotifications, setLanguage } = useSettingsStore();
  const { logout } = useAuthStore();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [emailReminders, setEmailReminders] = useState(true);
  const [aptReminders, setAptReminders] = useState(true);
  const [passwordModal, setPasswordModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [passwordData, setPasswordData] = useState({ current: '', next: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const languages = ['English', 'Spanish', 'French', 'German'];

  const handleChangePassword = () => {
    const errors: Record<string, string> = {};
    if (!passwordData.current) errors.current = 'Current password is required';
    if (passwordData.next.length < 6) errors.next = 'New password must be at least 6 characters';
    if (passwordData.next !== passwordData.confirm) errors.confirm = 'Passwords do not match';
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    showToast('Password changed successfully!', 'success');
    setPasswordModal(false);
    setPasswordData({ current: '', next: '', confirm: '' });
    setPasswordErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = () => {
    showToast('Account deletion requested', 'warning');
    setDeleteModal(false);
    setDeleteText('');
    logout();
    navigate('/login');
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );

  const SettingRow = ({ icon: Icon, title, desc, children }: { icon: typeof Moon; title: string; desc: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
          <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>

      {/* Appearance */}
      <Card className="p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Appearance</h3>
        <SettingRow icon={Moon} title="Dark Mode" desc="Switch between light and dark themes">
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </SettingRow>
      </Card>

      {/* Notifications */}
      <Card className="p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Notifications</h3>
        <SettingRow icon={Bell} title="Push Notifications" desc="Receive notifications on your device">
          <Toggle checked={notifications} onChange={toggleNotifications} />
        </SettingRow>
        <SettingRow icon={Mail} title="Email Reminders" desc="Get reminders via email">
          <Toggle checked={emailReminders} onChange={() => setEmailReminders(!emailReminders)} />
        </SettingRow>
        <SettingRow icon={Calendar} title="Appointment Reminders" desc="Reminders for upcoming appointments">
          <Toggle checked={aptReminders} onChange={() => setAptReminders(!aptReminders)} />
        </SettingRow>
      </Card>

      {/* Account */}
      <Card className="p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Account</h3>
        <SettingRow icon={Globe} title="Language" desc="Choose your preferred language">
          <select
            value={language}
            onChange={(e) => { setLanguage(e.target.value); showToast(`Language set to ${e.target.value}`, 'info'); }}
            className="rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </SettingRow>
        <SettingRow icon={Lock} title="Change Password" desc="Update your password">
          <Button variant="outline" size="sm" onClick={() => setPasswordModal(true)}>Change</Button>
        </SettingRow>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-100 dark:border-red-900/30">
        <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Danger Zone
        </h3>
        <SettingRow icon={LogOut} title="Log Out" desc="Sign out of your account">
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setLogoutModal(true)}>Log Out</Button>
        </SettingRow>
        <SettingRow icon={Trash2} title="Delete Account" desc="Permanently delete your account and data">
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>Delete Account</Button>
        </SettingRow>
      </Card>

      {/* Change Password Modal */}
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={passwordData.current}
            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            error={passwordErrors.current}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={passwordData.next}
            onChange={(e) => setPasswordData({ ...passwordData, next: e.target.value })}
            error={passwordErrors.next}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            error={passwordErrors.confirm}
          />
          <Button variant="primary" fullWidth onClick={handleChangePassword}>Update Password</Button>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="Log Out">
        <div className="text-center py-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700">
            <LogOut className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Log out?</h3>
          <p className="mt-2 text-sm text-gray-500">You'll need to sign in again to access your account.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setLogoutModal(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={handleLogout}>Yes, Log Out</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <div className="py-2">
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">
              This action is permanent and cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm:
          </p>
          <Input
            placeholder="Type DELETE"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
          />
          <div className="mt-4 flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button
              variant="danger"
              fullWidth
              disabled={deleteText !== 'DELETE'}
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
