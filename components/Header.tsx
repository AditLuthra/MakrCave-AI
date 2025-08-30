'use client';

import { Search, Menu, User as UserIcon, Grid3X3, Bell } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatUserDisplayName } from '../lib/userUtils';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import Link from 'next/link';

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showApps, setShowApps] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-blue-500/30 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Left side - Logo, Menu, Search */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="hidden sm:block text-lg font-bold text-white">MakrCave</span>
            </Link>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 hover:bg-blue-500/10 rounded-lg transition-all text-blue-400 hover:shadow-lg flex-shrink-0"
              onClick={onMobileMenuClick}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-sm sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-blue-500/30 rounded-lg text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-slate-700 min-h-[40px] sm:min-h-[44px]"
              />
            </div>
          </div>

          {/* Right side - Apps, Theme, Notifications, User */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* MakrX Apps Launcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApps(!showApps)}
                className="p-2 rounded-lg hover:bg-blue-500/10 hover:shadow-lg transition-all text-blue-400"
                aria-label="MakrX Apps"
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>

              {showApps && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4 z-50 shadow-xl">
                  <h3 className="font-semibold text-blue-400 mb-4">MakrX Ecosystem</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/dashboard" className="p-3 rounded-lg border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg transition-all group bg-slate-700/50">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        MakrCave
                      </div>
                      <div className="text-xs text-gray-400">Management</div>
                    </Link>
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
                        Store
                      </div>
                      <div className="text-xs text-gray-400">Shop & Tools</div>
                    </a>
                    <a
                      href="https://makrx.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg transition-all group bg-slate-700/50"
                    >
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        Gateway
                      </div>
                      <div className="text-xs text-gray-400">Main Hub</div>
                    </a>
                    <Link href="/makrverse" className="p-3 rounded-lg border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg transition-all group bg-slate-700/50">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        MakrVerse
                      </div>
                      <div className="text-xs text-gray-400">Global Map</div>
                    </Link>
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
              <span className="text-sm">
                {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
              </span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-blue-500/10 hover:shadow-lg transition-all text-blue-400 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg shadow-lg backdrop-blur-sm">
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:block text-sm font-medium text-white">{formatUserDisplayName(user)}</span>
              <span className="hidden md:block text-xs text-blue-400 capitalize">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for apps launcher */}
      {showApps && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowApps(false)}
        />
      )}
    </header>
  );
}