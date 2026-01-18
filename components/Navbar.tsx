
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from './Providers';
import { dbService } from '../services/dbService';

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated: propIsAuthenticated, 
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const { darkMode, toggleTheme } = useTheme();
  
  // Authenticated if either the prop or the session is active
  const isAuthenticated = propIsAuthenticated !== undefined ? (propIsAuthenticated || !!session) : (!!dbService.getAuth() || !!session);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    }
    await signOut({ redirect: false });
    dbService.clearAuth();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              NEXUS
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-zinc-600 dark:text-zinc-400 hover:text-primary-600'}`}>
              Home
            </Link>
            <Link href="/items" className={`text-sm font-medium transition-colors ${isActive('/items') ? 'text-primary-600' : 'text-zinc-600 dark:text-zinc-400 hover:text-primary-600'}`}>
              Marketplace
            </Link>
            {isAuthenticated && (
              <Link href="/add-item" className={`text-sm font-medium transition-colors ${isActive('/add-item') ? 'text-primary-600' : 'text-zinc-600 dark:text-zinc-400 hover:text-primary-600'}`}>
                Sell Item
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User size={20} />
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  <LogOut size={18} className="mr-1" /> Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all shadow-sm shadow-primary-500/20"
              >
                Sign In
              </Link>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Home</Link>
          <Link href="/items" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Marketplace</Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Dashboard</Link>
              <Link href="/add-item" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Sell Item</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
