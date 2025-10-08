import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useUnreadMessages } from '../../hooks/useUnreadMessages';
import { Menu, X, User, LogOut, MessageSquare, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();
  const permissions = useUserPermissions();
  const unreadCount = useUnreadMessages();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {isRTL ? 'سوقوت' : 'Souqote'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
            >
              {t('home')}
            </Link>
            
            {/* RFQ Browsing removed - vendors should not see RFQs */}
            
            {/* Show Find RFQs for vendors only */}
            {permissions.canViewMyQuotes && (
              <Link
                to="/rfqs"
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                Find RFQs
              </Link>
            )}
            
            {/* Show Find Vendors for buyers only */}
            {permissions.canPostRFQ && (
              <Link
                to="/vendors"
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                Find Vendors
              </Link>
            )}
            
            {/* Buyer-only Navigation - Hide from vendors and admins */}
            {permissions.canPostRFQ && (
              <Link
                to="/post-rfq"
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                Post RFQ
              </Link>
            )}
            
            {/* Vendor Navigation - RFQ browsing removed */}
            {permissions.canSubmitQuotes && (
              <Link
                to="/vendor-onboarding"
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                Complete Profile
              </Link>
            )}
            
            {/* Admin Navigation */}
            {permissions.canViewAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                Admin Dashboard
              </Link>
            )}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/messages"
                  className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 flex items-center space-x-1 relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('messages')}</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {permissions.canViewMyRFQs && (
                  <Link
                    to="/my-rfqs"
                    className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                  >
                    My RFQs
                  </Link>
                )}
                {(permissions.canViewMyQuotes || permissions.canViewAdmin) && (
                  <Link
                    to="/my-quotes"
                    className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                  >
                    My Bids
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200 border border-gray-300 rounded-md hover:border-yellow-600"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </Link>
              
              {/* RFQ Browsing removed - vendors should not see RFQs */}
              
              {/* Show Find RFQs for vendors only */}
              {permissions.canViewMyQuotes && (
                <Link
                  to="/rfqs"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find RFQs
                </Link>
              )}
              
              {/* Show Find Vendors for buyers only */}
              {permissions.canPostRFQ && (
                <Link
                  to="/vendors"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Vendors
                </Link>
              )}
              
              {/* Buyer-only Navigation - Hide from vendors and admins */}
              {permissions.canPostRFQ && (
                <Link
                  to="/post-rfq"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post RFQ
                </Link>
              )}
              
              {/* Vendor Navigation */}
              {(permissions.canSubmitQuotes || permissions.canViewAdmin) && (
                <Link
                  to="/rfqs"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Quotes
                </Link>
              )}
              
              {permissions.canSubmitQuotes && (
                <Link
                  to="/vendor-onboarding"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Complete Profile
                </Link>
              )}
              
              {/* Admin Navigation */}
              {permissions.canViewAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/messages"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{t('messages')}</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  {permissions.canViewMyRFQs && (
                    <Link
                      to="/my-rfqs"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My RFQs
                    </Link>
                  )}
                  {(permissions.canViewMyQuotes || permissions.canViewAdmin) && (
                    <Link
                      to="/my-quotes"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bids
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </>
              )}
              
              {/* Language Toggle for Mobile */}
              <button
                onClick={toggleLanguage}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
