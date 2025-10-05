import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/SimpleAuthContext';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('profile')}
          </h1>
          {user && (
            <div className="space-y-4">
              <p><strong>{t('firstName')}:</strong> {user.first_name}</p>
              <p><strong>{t('lastName')}:</strong> {user.last_name}</p>
              <p><strong>{t('email')}:</strong> {user.email}</p>
              <p><strong>{t('phone')}:</strong> {user.phone}</p>
              <p><strong>{t('userType')}:</strong> {t(user.user_type)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
