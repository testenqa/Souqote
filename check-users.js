const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lqpoiudemmnacaizemgf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcG9pdWRlbW1uYWNhaXplbWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5NjAsImV4cCI6MjA3MzI3Mjk2MH0.Mqu4v3tHEf_numtoTx90xPsoMRH4EB83I0RPMGWP3DQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 Checking Users in Database');
  console.log('=' .repeat(40));

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    console.log(`📊 Total users in database: ${users.length}`);
    
    if (users.length === 0) {
      console.log('⚠️ No users found in database');
      console.log('💡 This could be because:');
      console.log('   • Rate limit was hit during registration');
      console.log('   • Users are being created in Supabase Auth but not in users table');
      console.log('   • Database permissions issue');
    } else {
      console.log('\n👥 Users in database:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.first_name} ${user.last_name}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Type: ${user.user_type}`);
        console.log(`     Created: ${new Date(user.created_at).toLocaleDateString()}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUsers();
