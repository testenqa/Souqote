import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                {isRTL ? 'سوقوت' : 'Souqote'}
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {isRTL 
                ? 'منصة رائدة لربط المشترين مع الموردين المعتمدين في دولة الإمارات العربية المتحدة. نحن نسهل عملية الحصول على عروض أسعار تنافسية وتقديم الخدمات بأعلى معايير الجودة.'
                : 'Dubai\'s premier RFQ platform connecting buyers with verified vendors. We make it easy to get competitive quotes and provide services with the highest quality standards.'
              }
            </p>
            <div className="flex space-x-4">
              <a href="mailto:info@souqote.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+971501234567" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/rfqs" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Browse RFQs
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {isRTL ? 'حولنا' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {isRTL ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isRTL ? 'خدماتنا' : 'Our Services'}
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">
                  Construction Materials
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  Office Equipment
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  IT Services
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  Marketing Services
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  {isRTL ? 'والمزيد...' : 'And more...'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 {isRTL ? 'سوقوت' : 'Souqote'}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                {isRTL ? 'شروط الاستخدام' : 'Terms of Service'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
