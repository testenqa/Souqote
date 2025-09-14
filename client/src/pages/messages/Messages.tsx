import React from 'react';
import { useTranslation } from 'react-i18next';

const Messages: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('messages')}
          </h1>
          <p className="text-gray-600">
            {t('comingSoon')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
