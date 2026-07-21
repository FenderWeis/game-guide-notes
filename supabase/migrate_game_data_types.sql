ALTER TABLE game_data ADD COLUMN IF NOT EXISTS category_id UUID;

INSERT INTO categories (id, name) VALUES
  ('10000000-0000-0000-0000-000000000001', '角色'),
  ('10000000-0000-0000-0000-000000000002', '装备'),
  ('10000000-0000-0000-0000-000000000003', '地图'),
  ('10000000-0000-0000-0000-000000000004', '其他')
ON CONFLICT (id) DO NOTHING;

UPDATE game_data SET category_id = '10000000-0000-0000-0000-000000000001' WHERE type = 'character';
UPDATE game_data SET category_id = '10000000-0000-0000-0000-000000000002' WHERE type = 'equipment';
UPDATE game_data SET category_id = '10000000-0000-0000-0000-000000000003' WHERE type = 'map';
UPDATE game_data SET category_id = '10000000-0000-0000-0000-000000000004' WHERE type = 'other';

ALTER TABLE game_data ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE game_data ADD CONSTRAINT fk_game_data_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

ALTER TABLE game_data DROP CONSTRAINT IF EXISTS game_data_type_check;

ALTER TABLE game_data DROP COLUMN IF EXISTS type;

CREATE INDEX idx_game_data_category_id ON game_data(category_id);

CREATE POLICY "Allow authenticated insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');