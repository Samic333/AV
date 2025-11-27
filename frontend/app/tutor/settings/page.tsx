'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function TutorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light',
    textSize: 'normal',
    emailNotifications: true,
    inAppNotifications: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/settings');
      const data = response.data.data || response.data;
      if (data) {
        setSettings({
          theme: data.theme || 'light',
          textSize: data.textSize || 'normal',
          emailNotifications: data.emailNotifications !== false,
          inAppNotifications: data.inAppNotifications !== false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/users/settings', settings);
      alert('Settings saved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Settings</h1>
          <p className="text-navy-600">Manage your preferences and notification settings</p>
        </div>

        <div className="space-y-6">
          {/* UI Preferences */}
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-6">UI Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Text Size</label>
                <select
                  value={settings.textSize}
                  onChange={(e) => setSettings({ ...settings, textSize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-navy-700">Email Notifications</label>
                  <p className="text-xs text-navy-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-sky-blue-600 border-gray-300 rounded focus:ring-sky-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-navy-700">In-App Notifications</label>
                  <p className="text-xs text-navy-600">Receive notifications in the application</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inAppNotifications}
                  onChange={(e) => setSettings({ ...settings, inAppNotifications: e.target.checked })}
                  className="w-4 h-4 text-sky-blue-600 border-gray-300 rounded focus:ring-sky-blue-500"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button variant="outline" onClick={fetchSettings}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

