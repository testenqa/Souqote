import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lqpoiudemmnacaizemgf.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcG9pdWRlbW1uYWNhaXplbWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5NjAsImV4cCI6MjA3MzI3Mjk2MH0.Mqu4v3tHEf_numtoTx90xPsoMRH4EB83I0RPMGWP3DQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
