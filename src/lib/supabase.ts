import { createClient } from '@supabase/supabase-js';

// Pocket Circus Supabase Configuration
export const SUPABASE_URL = 'https://twajguygldgqpbgfyqua.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YWpndXlnbGRncXBiZ2Z5cXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1Mjk1NjEsImV4cCI6MjEwNzEwNTU2MX0.GZPUEooSfEQegD_Vt6PLdpRy7am_SX9jVVGvHv8LOy0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
