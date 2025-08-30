import { Search, Menu, ExternalLink, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatUserDisplayName } from '../lib/userUtils';
import { FeatureGate } from './FeatureGate';
// ThemeToggle removed - will implement custom theme toggle
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  return (
    <header className="makrcave-header bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          onClick={onMobileMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inventory, equipment, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2 px-3 py-2 text-xs bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm">
          <UserIcon className="w-3 h-3" />
          <span className="font-semibold text-gray-900">{formatUserDisplayName(user)}</span>
          <span className="text-blue-400">•</span>
          <span className="capitalize text-blue-600 font-medium">
            {user?.role.replace('_', ' ')}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <FeatureGate
            featureKey="equipment.reservation_system"
            fallback={null}
          >
            <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm">
              Quick Reserve
            </button>
          </FeatureGate>

          <FeatureGate
            featureKey="admin.global_dashboard"
            fallback={null}
          >
            <a
              href="https://e986654b5a5843d7b3f8adf13b61022c-556d114307be4dee892ae999b.projects.builder.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
            >
              MakrX Gateway
              <ExternalLink className="w-3 h-3" />
            </a>
          </FeatureGate>
        </div>

        {/* Theme Toggle - Custom Implementation */}
        <button className="hidden sm:flex p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        {/* Notifications */}
        <NotificationPanel />

        {/* Current Date/Time */}
        <div className="hidden md:block text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </header>
  );
}
