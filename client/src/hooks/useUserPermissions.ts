import { useAuth } from '../contexts/SimpleAuthContext';

export interface UserPermissions {
  canPostRFQ: boolean;
  canSubmitQuotes: boolean;
  canBrowseRFQs: boolean;
  canViewAdmin: boolean;
  canManageUsers: boolean;
  canManageRFQs: boolean;
  canManageCategories: boolean;
  canViewAllQuotes: boolean;
  canViewAllRFQs: boolean;
  canEditProfile: boolean;
  canViewMessages: boolean;
  canViewMyRFQs: boolean;
  canViewMyQuotes: boolean;
}

export const useUserPermissions = (): UserPermissions => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return {
      canPostRFQ: false,
      canSubmitQuotes: false,
      canBrowseRFQs: false,
      canViewAdmin: false,
      canManageUsers: false,
      canManageRFQs: false,
      canManageCategories: false,
      canViewAllQuotes: false,
      canViewAllRFQs: false,
      canEditProfile: false,
      canViewMessages: false,
      canViewMyRFQs: false,
      canViewMyQuotes: false,
    };
  }

  const isBuyer = user.user_type === 'buyer';
  const isVendor = user.user_type === 'vendor';
  const isAdmin = user.user_type === 'admin';

  return {
    // Buyer-only permissions (vendors cannot access these)
    canPostRFQ: isBuyer, // Only buyers can post RFQs
    canViewMyRFQs: isBuyer, // Only buyers can view their own RFQs
    
    // Vendor-only permissions (buyers cannot access these)
    canSubmitQuotes: isVendor, // Only vendors can submit quotes
    canViewMyQuotes: isVendor, // Only vendors can view their own quotes
    canBrowseRFQs: isVendor, // Only vendors can browse RFQs
    
    // Admin permissions (admins can do everything)
    canViewAdmin: isAdmin,
    canManageUsers: isAdmin,
    canManageRFQs: isAdmin,
    canManageCategories: isAdmin,
    canViewAllQuotes: isAdmin,
    canViewAllRFQs: isAdmin,
    
    // Common permissions (all authenticated users)
    canEditProfile: true,
    canViewMessages: true,
  };
};

export const useUserType = () => {
  const { user } = useAuth();
  return user?.user_type || null;
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.user_type === 'admin';
};

export const useIsBuyer = () => {
  const { user } = useAuth();
  return user?.user_type === 'buyer';
};

export const useIsVendor = () => {
  const { user } = useAuth();
  return user?.user_type === 'vendor';
};
