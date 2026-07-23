CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cover VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  likes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'senior', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

INSERT INTO categories (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', '新手攻略'),
  ('00000000-0000-0000-0000-000000000002', 'Boss攻略'),
  ('00000000-0000-0000-0000-000000000003', '装备攻略'),
  ('00000000-0000-0000-0000-000000000004', '剧情攻略'),
  ('00000000-0000-0000-0000-000000000005', '速通攻略'),
  ('00000000-0000-0000-0000-000000000006', '其他')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX idx_guides_game_id ON guides(game_id);
CREATE INDEX idx_guides_category_id ON guides(category_id);
CREATE INDEX idx_guides_author_id ON guides(author_id);
CREATE INDEX idx_game_data_game_id ON game_data(game_id);
CREATE INDEX idx_game_data_category_id ON game_data(category_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_guide_id ON likes(guide_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_guide_id ON favorites(guide_id);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to games" ON games
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert games" ON games
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update games" ON games
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete games" ON games
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to guides" ON guides
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert guides" ON guides
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update guides" ON guides
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete guides" ON guides
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to game_data" ON game_data
  FOR SELECT USING (true);
CREATE POLICY "Allow senior and admin insert game_data" ON game_data
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('senior', 'admin')
    )
  );
CREATE POLICY "Allow senior and admin update game_data" ON game_data
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('senior', 'admin')
    )
  );
CREATE POLICY "Allow admin delete game_data" ON game_data
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update users" ON users
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
CREATE POLICY "Allow admin delete users" ON users
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow authenticated read access to likes" ON likes
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert likes" ON likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete likes" ON likes
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access to favorites" ON favorites
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert favorites" ON favorites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete favorites" ON favorites
  FOR DELETE USING (auth.role() = 'authenticated');
