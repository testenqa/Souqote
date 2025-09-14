console.log('🧹 CLEANUP TEST USERS');
console.log('=' .repeat(40));

console.log('❌ Problem: Test users in auth.users table');
console.log('   • Need to clean up before testing fixed trigger');
console.log('   • auth.users is protected - cannot delete via client');
console.log('');

console.log('🔧 Method 1: Supabase Dashboard (Recommended)');
console.log('   1. Go to Supabase Dashboard → Authentication → Users');
console.log('   2. Find test users by email');
console.log('   3. Click 3-dot menu → Delete user');
console.log('   4. Confirm deletion');
console.log('');

console.log('🔧 Method 2: SQL Editor');
console.log('   1. Go to Supabase Dashboard → SQL Editor');
console.log('   2. Run cleanup-test-users.sql');
console.log('   3. Uncomment DELETE statements you need');
console.log('   4. Execute carefully');
console.log('');

console.log('📋 Quick SQL Commands:');
console.log('   -- Check current users');
console.log('   SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;');
console.log('');
console.log('   -- Delete specific user by email');
console.log('   DELETE FROM auth.users WHERE email = \'test@example.com\';');
console.log('');
console.log('   -- Delete all unconfirmed users (test accounts)');
console.log('   DELETE FROM auth.users WHERE email_confirmed_at IS NULL;');
console.log('');

console.log('⚠️  Important Notes:');
console.log('   • auth.users is protected - must use Supabase Dashboard');
console.log('   • Deleting from auth.users auto-deletes from public.users');
console.log('   • Always backup before bulk deletions');
console.log('   • Test with one user first');
console.log('');

console.log('✅ After Cleanup:');
console.log('   1. Wait 5-10 minutes for rate limit reset');
console.log('   2. Apply the fixed trigger');
console.log('   3. Test registration with NEW email');
console.log('   4. Verify user appears in both tables');
console.log('   5. Test login - should work!');
console.log('');
console.log('🎉 CLEANUP GUIDE READY!');
console.log('Check cleanup-test-users.sql and cleanup-guide.md for details!');
