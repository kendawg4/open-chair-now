
-- Fix seed auth users with required metadata
UPDATE auth.users SET
  raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
  raw_user_meta_data = jsonb_build_object('email', email),
  is_super_admin = false,
  confirmation_token = '',
  recovery_token = '',
  email_change_token_new = '',
  email_change = ''
WHERE id::text LIKE 'b0000001%' OR id::text LIKE 'b0000002%';
