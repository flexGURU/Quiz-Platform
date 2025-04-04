import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

export const Supabase = createClient(
  environment.projectUrl,
  environment.apiKey
);
