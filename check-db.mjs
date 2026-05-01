import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const email = 'admin@dhakachronicles.com';
  
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, password_hash, is_active, role')
    .eq('email', email)
    .single();
    
  if (error) {
    console.error('DB Error:', error.message);
  } else {
    console.log('User Record:', data);
  }
}

check();
