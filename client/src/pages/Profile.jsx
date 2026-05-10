import { useState } from 'react';
import { User, Mail, Lock, Camera, Save, Bell, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    displayName: user?.displayName || 'Alex Johnson',
    email: user?.email || 'alex@example.com',
    bio: 'Adventure enthusiast exploring the world one city at a time.',
    location: 'New York, USA',
    website: 'https://alexjohnson.travel',
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Profile Settings</h1>
        <p className="text-dark-lighter/60 mt-1">Manage your account and preferences</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white text-3xl font-bold">
              {profile.displayName.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border border-dark-lighter/20 flex items-center justify-center shadow-sm hover:bg-surface-alt transition-colors">
              <Camera className="w-4 h-4 text-dark" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-dark">{profile.displayName}</h2>
            <p className="text-dark-lighter/60">Traveler</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile(p => ({ ...p, displayName: e.target.value }))}
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Location</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
              className="input-field min-h-[100px] resize-none"
            />
          </div>

          <button type="button" className="btn-primary">
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-semibold text-dark mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-alt rounded-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-dark-lighter/60" />
              <div>
                <p className="font-medium text-dark">Password</p>
                <p className="text-sm text-dark-lighter/60">Last changed 3 months ago</p>
              </div>
            </div>
            <button className="btn-ghost text-sm">Change</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-alt rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-dark-lighter/60" />
              <div>
                <p className="font-medium text-dark">Two-Factor Auth</p>
                <p className="text-sm text-dark-lighter/60">Add extra security to your account</p>
              </div>
            </div>
            <button className="btn-ghost text-sm text-primary">Enable</button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-semibold text-dark mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { label: 'Trip reminders', desc: 'Get notified about upcoming trips' },
            { label: 'Budget alerts', desc: 'Alert when spending exceeds 80%' },
            { label: 'Marketing emails', desc: 'New features and travel tips' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-surface-alt rounded-xl">
              <div>
                <p className="font-medium text-dark">{item.label}</p>
                <p className="text-sm text-dark-lighter/60">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-lighter/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
