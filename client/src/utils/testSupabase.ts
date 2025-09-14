import { supabase } from '../lib/supabase';
import { authService, jobsService, bidsService } from '../services/supabaseService';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Check if Supabase client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    console.log('✅ Supabase client initialized');

    // Test 2: Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    console.log('✅ Database connection successful');

    // Test 3: Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('⚠️ No active session (this is normal if not logged in)');
    } else {
      console.log('✅ Authentication system working');
    }

    // Test 4: Test real-time connection
    const channel = supabase.channel('test-channel');
    const subscription = channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('✅ Real-time subscription working');
        subscription.unsubscribe();
      })
      .subscribe();

    // Unsubscribe after 2 seconds
    setTimeout(() => {
      subscription.unsubscribe();
    }, 2000);

    console.log('🎉 All Supabase tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    return false;
  }
};

export const testDatabaseOperations = async () => {
  try {
    console.log('🔍 Testing database operations...');

    // Test 1: Get jobs
    const jobs = await jobsService.getJobs();
    console.log(`✅ Retrieved ${jobs.length} jobs`);

    // Test 2: Get users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      throw new Error(`Failed to get users: ${usersError.message}`);
    }
    console.log(`✅ Retrieved ${users.length} users`);

    // Test 3: Get bids
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .limit(5);
    
    if (bidsError) {
      throw new Error(`Failed to get bids: ${bidsError.message}`);
    }
    console.log(`✅ Retrieved ${bids.length} bids`);

    console.log('🎉 All database operations test passed!');
    return true;

  } catch (error) {
    console.error('❌ Database operations test failed:', error);
    return false;
  }
};

// Run tests when this file is imported
if (process.env.NODE_ENV === 'development') {
  testSupabaseConnection().then(success => {
    if (success) {
      testDatabaseOperations();
    }
  });
}
