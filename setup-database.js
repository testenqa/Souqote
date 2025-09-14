const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://lqpoiudemmnacaizemgf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcG9pdWRlbW1uYWNhaXplbWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5NjAsImV4cCI6MjA3MzI3Mjk2MH0.Mqu4v3tHEf_numtoTx90xPsoMRH4EB83I0RPMGWP3DQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Handyman UAE database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema file loaded');
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      return false;
    }
    
    console.log('✅ Database schema executed successfully');
    
    // Test the connection by querying users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Error testing connection:', usersError);
      return false;
    }
    
    console.log('✅ Database connection test successful');
    console.log('🎉 Database setup completed!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    return false;
  }
}

// Run the setup
setupDatabase().then(success => {
  if (success) {
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of database/schema.sql');
    console.log('4. Click "Run" to execute the schema');
    console.log('5. Your database will be ready!');
  }
  process.exit(success ? 0 : 1);
});
