CREATE TABLE IF NOT EXISTS game_data_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_data_id UUID REFERENCES game_data(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_data_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_data_id UUID REFERENCES game_data(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES game_data_modules(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) DEFAULT '',
  content TEXT,
  image VARCHAR(500),
  content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'table', 'image')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_data_modules_game_data_id ON game_data_modules(game_data_id);
CREATE INDEX idx_game_data_content_blocks_game_data_id ON game_data_content_blocks(game_data_id);
CREATE INDEX idx_game_data_content_blocks_module_id ON game_data_content_blocks(module_id);

ALTER TABLE game_data_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_data_content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to game_data_modules" ON game_data_modules
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert game_data_modules" ON game_data_modules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update game_data_modules" ON game_data_modules
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete game_data_modules" ON game_data_modules
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to game_data_content_blocks" ON game_data_content_blocks
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert game_data_content_blocks" ON game_data_content_blocks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update game_data_content_blocks" ON game_data_content_blocks
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete game_data_content_blocks" ON game_data_content_blocks
  FOR DELETE USING (auth.role() = 'authenticated');