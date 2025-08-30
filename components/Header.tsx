'use client';

import { Search, Menu, ExternalLink, User as UserIcon, Grid3X3 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatUserDisplayName } from '../lib/userUtils';
import { FeatureGate } from './FeatureGate';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import NotificationPanel from './NotificationPanel';
import Link from 'next/link';

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLauncher, setShowLauncher] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-blue-500/30 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left side - Mobile menu and Search */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 hover:bg-blue-500/10 rounded-lg transition-all text-blue-400 hover:shadow-lg flex-shrink-0"
              onClick={onMobileMenuClick}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory, equipment, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-blue-500/30 rounded-xl text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-slate-700"
              />
            </div>
          </div>

          {/* Right side - Actions and User info */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 px-2 lg:px-3 py-2 text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg shadow-lg backdrop-blur-sm">
              <UserIcon className="w-3 h-3" />
              <span className="font-semibold text-white">{formatUserDisplayName(user)}</span>
              <span className="text-blue-400">•</span>
              <span className="capitalize text-blue-400 font-medium">
                {user?.role.replace('_', ' ')}
              </span>
            </div>

            {/* Quick Actions - Hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center gap-2">
              <FeatureGate
                featureKey="equipment.reservation_system"
                fallback={null}
              >
                <button className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all duration-200 hover:shadow-lg">
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
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-all duration-200 hover:shadow-lg"
                >
                  MakrX Gateway
                  <ExternalLink className="w-3 h-3" />
                </a>
              </FeatureGate>
            </div>

            {/* Universal Launcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLauncher(!showLauncher)}
                className="p-2 rounded-lg hover:bg-blue-500/10 hover:shadow-lg transition-all text-blue-400"
                aria-label="Launch Apps"
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>

              {showLauncher && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4 z-50 shadow-xl">
                  <h3 className="font-semibold font-mono text-blue-400 mb-3">
                    MakrX Apps
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg transition-all group bg-slate-700/50">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        MakrCave
                      </div>
                      <div className="text-xs text-gray-400">
                        Management
                      </div>
                    </div>
                    <a
                      href="https://makrx.store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg transition-all group bg-slate-700/50"
                    >
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        MakrX Store
                      </div>
                      <div className="text-xs text-gray-400">
                        Tools & Parts
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-blue-500/10 hover:shadow-lg transition-all text-blue-400"
              aria-label="Toggle theme"
            >
              <span className="font-mono text-xs">
                {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
              </span>
            </Button>

            {/* Notifications */}
            <NotificationPanel />

            {/* Current Date/Time - Hidden on tablet and mobile */}
            <div className="hidden xl:block text-sm text-gray-400 font-medium bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-500/30">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for launcher */}
      {showLauncher && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLauncher(false)}
        />
      )}
    </header>
  );
}