console.log('🔍 DIAGNOSE TRIGGER ERROR');
console.log('=' .repeat(40));

console.log('❌ Problem: 500 Internal Server Error');
console.log('   • "Database error saving new user"');
console.log('   • Trigger is failing during user creation');
console.log('');

console.log('🎯 Possible Causes:');
console.log('   1. Trigger not applied to database');
console.log('   2. Type mismatch in trigger SQL');
console.log('   3. Missing columns in users table');
console.log('   4. Permission issues with trigger function');
console.log('   5. ENUM type not created properly');
console.log('');

console.log('🔧 Diagnostic Steps:');
console.log('');

console.log('Step 1: Check if trigger exists');
console.log(`
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
`);

console.log('Step 2: Check if function exists');
console.log(`
SELECT 
    routine_name, 
    routine_type, 
    data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
`);

console.log('Step 3: Check users table structure');
console.log(`
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
`);

console.log('Step 4: Check ENUM types');
console.log(`
SELECT 
    typname, 
    enumlabel
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'user_type';
`);

console.log('Step 5: Test trigger manually');
console.log(`
-- This will show detailed error if trigger fails
INSERT INTO auth.users (
    id, 
    email, 
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    '{"first_name": "Test", "last_name": "User", "phone": "+971501234567", "user_type": "customer"}'::jsonb,
    NOW(),
    NOW()
);
`);

console.log('');
console.log('✅ Quick Fix: Recreate Trigger');
console.log(`
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Add error handling
  BEGIN
    INSERT INTO public.users (
      id, email, first_name, last_name, phone, user_type,
      avatar_url, bio, years_experience, hourly_rate, languages,
      specialties, emirates_id, trade_license, insurance_document,
      is_verified, rating, total_jobs, created_at, updated_at
    )
    VALUES (
      NEW.id, NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')::user_type,
      NEW.avatar_url, NULL, NULL, NULL, ARRAY['English'],
      NULL, NULL, NULL, NULL, false, 0.0, 0, NOW(), NOW()
    );
    RETURN NEW;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error and re-raise
      RAISE LOG 'Error in handle_new_user: %', SQLERRM;
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`);

console.log('');
console.log('🎉 Run these diagnostics in Supabase SQL Editor!');
