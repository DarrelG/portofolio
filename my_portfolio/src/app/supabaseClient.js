import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqpgdwowjsvnsnehqqui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcGdkd293anN2bnNuZWhxcXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNzk4NTQsImV4cCI6MjA2ODY1NTg1NH0.QucGW-ecV3i5oS_zERoXGF8s3jWglpX7Y4RFGjh2SRY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;