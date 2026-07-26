import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  // Don't show full navbar on login/signup pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="w-full top-0 bg-[var(--color-surface-bright)] dark:bg-[var(--color-background)] sticky z-50 transition-colors duration-300">
      <div className="flex justify-between items-center px-[20px] md:px-[64px] py-6 max-w-[1280px] mx-auto w-full">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-[var(--color-primary)] dark:text-[var(--color-primary-fixed)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary-fixed)] rounded-lg p-1 group">
          <motion.div 
            className="bg-[var(--color-tertiary-fixed)] p-2.5 rounded-[12px]"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          >
            <BookOpen className="h-7 w-7 text-[var(--color-on-tertiary-fixed)]" />
          </motion.div>
          <span className="font-display font-extrabold text-[24px] leading-none tracking-tighter text-[var(--color-primary)] dark:text-[var(--color-primary-fixed)] group-hover:opacity-80 transition-opacity duration-300">
            StudyFlow<span className="text-[var(--color-secondary)] font-normal italic ml-1">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isAuthPage && (
          <nav className="hidden md:flex space-x-8 font-label text-[14px] font-medium tracking-wide text-[var(--color-secondary)] dark:text-[var(--color-secondary-fixed-dim)]">
            <Link to="/" className="hover:text-[var(--color-tertiary-fixed-variant)] transition-colors duration-300">Home</Link>
            <Link to="/library" className="hover:text-[var(--color-tertiary-fixed-variant)] transition-colors duration-300">Library</Link>
            <Link to="/dashboard/new" className="hover:text-[var(--color-tertiary-fixed-variant)] transition-colors duration-300">New Study</Link>
          </nav>
        )}

        {/* Profile / Auth Actions */}
        {!isAuthPage && (
          <div className="flex items-center">
            {user ? (
              <Link 
                to="/profile"
                className="font-label text-[14px] flex items-center gap-3 text-[var(--color-primary-fixed)] font-bold hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary-fixed)] rounded-full pl-3 pr-1 py-1"
                style={{ color: '#000000' }}
              >
                Profile
                <motion.div 
                  className="bg-[var(--color-surface-container-high)] h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border border-transparent hover:border-[var(--color-tertiary-fixed)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                >
                  <User className="h-5 w-5 text-[var(--color-secondary)]" />
                </motion.div>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login"
                  className="font-label text-[14px] font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-fixed)] hover:text-[var(--color-tertiary-fixed-variant)] transition-colors duration-300 px-4 py-2"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary-fixed)] focus:ring-offset-2 rounded-[9999px]">
                  <motion.div
                    className="bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)] font-label font-bold text-[14px] uppercase tracking-wider px-6 py-3 rounded-full flex items-center justify-center hover:bg-[#c3cf33] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                  >
                    Get Started
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
