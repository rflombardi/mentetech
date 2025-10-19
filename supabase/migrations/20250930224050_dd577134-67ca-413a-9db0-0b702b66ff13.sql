-- Add first admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('c00b75cc-a74d-4ccd-9679-414d91231568', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

COMMENT ON TABLE public.user_roles IS 'Stores user roles for authorization. First admin: rflombardi36@gmail.com';