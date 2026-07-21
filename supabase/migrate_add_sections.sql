CREATE TABLE IF NOT EXISTS game_data_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_data_id UUID REFERENCES game_data(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  image VARCHAR(500),
  content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'table', 'image')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_data_sections_game_data_id ON game_data_sections(game_data_id);

ALTER TABLE game_data_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to game_data_sections" ON game_data_sections
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert game_data_sections" ON game_data_sections
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update game_data_sections" ON game_data_sections
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete game_data_sections" ON game_data_sections
  FOR DELETE USING (auth.role() = 'authenticated');