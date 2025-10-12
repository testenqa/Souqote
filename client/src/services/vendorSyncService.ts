import { supabase } from '../lib/supabase';

/**
 * Service to sync vendor data between vendor_profiles and users tables
 */
export class VendorSyncService {
  /**
   * Sync company name from vendor_profiles to users table for a specific vendor
   */
  static async syncCompanyName(vendorId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the company name from vendor_profiles
      const { data: vendorProfile, error: profileError } = await supabase
        .from('vendor_profiles')
        .select('company_name_english')
        .eq('user_id', vendorId)
        .single();

      if (profileError) {
        return { success: false, error: `Failed to fetch vendor profile: ${profileError.message}` };
      }

      if (!vendorProfile?.company_name_english) {
        return { success: false, error: 'No company name found in vendor profile' };
      }

      // Update the users table
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          company_name: vendorProfile.company_name_english,
          updated_at: new Date().toISOString()
        })
        .eq('id', vendorId);

      if (userUpdateError) {
        return { success: false, error: `Failed to update users table: ${userUpdateError.message}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Unexpected error: ${error}` };
    }
  }

  /**
   * Sync company names for all vendors who have vendor_profiles
   */
  static async syncAllVendorCompanyNames(): Promise<{ 
    success: boolean; 
    updatedCount?: number; 
    error?: string 
  }> {
    try {
      // Get all vendors with vendor profiles
      const { data: vendorProfiles, error: profilesError } = await supabase
        .from('vendor_profiles')
        .select('user_id, company_name_english')
        .not('company_name_english', 'is', null);

      if (profilesError) {
        return { success: false, error: `Failed to fetch vendor profiles: ${profilesError.message}` };
      }

      if (!vendorProfiles || vendorProfiles.length === 0) {
        return { success: true, updatedCount: 0 };
      }

      // Update users table for each vendor
      let updatedCount = 0;
      const errors: string[] = [];

      for (const profile of vendorProfiles) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            company_name: profile.company_name_english,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.user_id)
          .eq('user_type', 'vendor');

        if (updateError) {
          errors.push(`Failed to update user ${profile.user_id}: ${updateError.message}`);
        } else {
          updatedCount++;
        }
      }

      if (errors.length > 0) {
        return { 
          success: false, 
          error: `Partial success: ${updatedCount} updated, ${errors.length} failed. Errors: ${errors.join(', ')}` 
        };
      }

      return { success: true, updatedCount };
    } catch (error) {
      return { success: false, error: `Unexpected error: ${error}` };
    }
  }

  /**
   * Check if a vendor's company name is synced between tables
   */
  static async checkSyncStatus(vendorId: string): Promise<{
    isSynced: boolean;
    usersCompanyName?: string;
    vendorProfileCompanyName?: string;
    needsSync: boolean;
  }> {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('company_name')
        .eq('id', vendorId)
        .eq('user_type', 'vendor')
        .single();

      // Get vendor profile data
      const { data: vendorProfile, error: profileError } = await supabase
        .from('vendor_profiles')
        .select('company_name_english')
        .eq('user_id', vendorId)
        .single();

      if (userError || profileError) {
        return { isSynced: false, needsSync: false };
      }

      const usersCompanyName = user?.company_name;
      const vendorProfileCompanyName = vendorProfile?.company_name_english;

      const isSynced = usersCompanyName === vendorProfileCompanyName && 
                      usersCompanyName !== null && 
                      usersCompanyName !== undefined &&
                      usersCompanyName !== '';

      return {
        isSynced,
        usersCompanyName,
        vendorProfileCompanyName,
        needsSync: !isSynced && vendorProfileCompanyName !== null && vendorProfileCompanyName !== undefined
      };
    } catch (error) {
      return { isSynced: false, needsSync: false };
    }
  }
}
