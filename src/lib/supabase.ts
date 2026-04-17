import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Database features will be disabled.');
}

// A safe fallback proxy to prevent "cannot read property 'from' of null"
const safeProxy = new Proxy({}, {
  get: () => () => ({ 
    from: () => safeProxy, 
    select: () => safeProxy,
    order: () => safeProxy,
    limit: () => safeProxy,
    then: () => Promise.resolve({ data: [], error: null }) 
  })
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : safeProxy as any;
