import React from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';

const LoadingDebug: React.FC = () => {
  const { loading, user, isAuthenticated } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg z-50 text-sm">
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? 'exists' : 'null'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User Type: {user?.user_type || 'none'}</div>
    </div>
  );
};

export default LoadingDebug;
