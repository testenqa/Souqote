const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lqpoiudemmnacaizemgf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcG9pdWRlbW1uYWNhaXplbWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5NjAsImV4cCI6MjA3MzI3Mjk2MH0.Mqu4v3tHEf_numtoTx90xPsoMRH4EB83I0RPMGWP3DQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUsers() {
  console.log('🔧 Creating Test Users in Database');
  console.log('=' .repeat(40));

  try {
    // Test Customer
    const customerUser = {
      id: 'test-customer-123',
      email: 'customer@test.com',
      first_name: 'John',
      last_name: 'Customer',
      phone: '+971501234567',
      user_type: 'customer',
      avatar_url: null,
      bio: 'Test customer account',
      years_experience: null,
      hourly_rate: null,
      languages: ['English'],
      specialties: null,
      emirates_id: null,
      trade_license: null,
      insurance_document: null,
      is_verified: false,
      rating: 0,
      total_jobs: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Test Technician
    const technicianUser = {
      id: 'test-technician-123',
      email: 'technician@test.com',
      first_name: 'Ahmed',
      last_name: 'Technician',
      phone: '+971501234568',
      user_type: 'technician',
      avatar_url: null,
      bio: 'Professional plumber with 5 years experience',
      years_experience: 5,
      hourly_rate: 150,
      languages: ['English', 'Arabic'],
      specialties: ['Plumbing', 'Pipe Repair'],
      emirates_id: '784-1234-5678901-2',
      trade_license: 'TRD-12345',
      insurance_document: 'INS-12345',
      is_verified: true,
      rating: 4.8,
      total_jobs: 25,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert test users
    const { data: customerData, error: customerError } = await supabase
      .from('users')
      .insert([customerUser]);

    if (customerError) {
      console.log('⚠️ Customer user might already exist:', customerError.message);
    } else {
      console.log('✅ Test customer created successfully');
    }

    const { data: technicianData, error: technicianError } = await supabase
      .from('users')
      .insert([technicianUser]);

    if (technicianError) {
      console.log('⚠️ Technician user might already exist:', technicianError.message);
    } else {
      console.log('✅ Test technician created successfully');
    }

    // Verify users were created
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError);
    } else {
      console.log(`\n📊 Total users in database: ${users.length}`);
      console.log('Recent users:');
      users.slice(0, 5).forEach(user => {
        console.log(`  • ${user.first_name} ${user.last_name} (${user.user_type}) - ${user.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  }
}

createTestUsers();
