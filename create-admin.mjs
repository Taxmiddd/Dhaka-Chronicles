import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createFounder() {
  const email = 'admin@dhakachronicles.com'; // Change this if you want
  const password = 'SecurePassword123!'; // Change this if you want
  const name = 'Admin User';

  console.log(`Attempting to create founder account for: ${email}...`);

  try {
    // 1. Create user in Supabase Auth (auth.users)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
         console.log('User already exists in auth.users. Fetching user...');
      } else {
         throw new Error(`Auth Error: ${authError.message}`);
      }
    }

    // Get the user ID (either newly created or existing)
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const user = existingUsers.users.find(u => u.email === email);
    
    if (!user) throw new Error('Could not retrieve user from auth.users');

    // 2. Hash password for local credentials provider (if used)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Upsert into public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: user.id,
        email: email,
        full_name: name,
        role: 'founder', // Highest level of access
        password_hash: password_hash,
        is_active: true
      });

    if (dbError) {
      throw new Error(`Database Error: ${dbError.message}`);
    }

    console.log('\n✅ Success! Founder account created successfully.');
    console.log('--------------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     founder`);
    console.log('--------------------------------------------------');
    console.log('You can now log in to the platform with these credentials.');

  } catch (err) {
    console.error('\n❌ Failed to create founder account:');
    console.error(err.message);
  }
}

createFounder();
