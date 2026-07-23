INSERT INTO users (id, email, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
