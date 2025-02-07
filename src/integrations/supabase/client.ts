
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wpiwxyifuvjmxagceawt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaXd4eWlmdXZqbXhhZ2NlYXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MjY0MjcsImV4cCI6MjA1NDUwMjQyN30.ZcbNeUWNL5lF3O2w8XV1xgUTO49nLwGnaivsyKTPJUQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
