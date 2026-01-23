CREATE TABLE coffee_shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    seating_level TEXT CHECK (seating_level IN ('lots', 'moderate', 'limited')),
    vibe TEXT[] DEFAULT '{}',
    good_for_work BOOLEAN DEFAULT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE coffee_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_id UUID REFERENCES coffee_shops(id) ON DELETE CASCADE,
    coffee_name TEXT NOT NULL,
    strength_level TEXT CHECK (strength_level IN ('light', 'medium', 'dark')),
    price DECIMAL(5,2),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    tasting_notes TEXT,
    date_tried DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_coffee_entries_shop_id ON coffee_entries(shop_id);
CREATE INDEX idx_coffee_entries_date_tried ON coffee_entries(date_tried DESC);

-- ============================================
-- RLS POLICIES FOR COFFEE TRACKER
-- ============================================

-- 1. COFFEE SHOPS TABLE (Public data - anyone can read)
-- ============================================

ALTER TABLE coffee_shops ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view coffee shops (no auth required)
CREATE POLICY "Public coffee shops are viewable by everyone"
ON coffee_shops
FOR SELECT
USING (true);

-- Policy: Anyone can insert coffee shops (for now, until you add auth)
CREATE POLICY "Anyone can insert coffee shops"
ON coffee_shops
FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can update coffee shops (for now)
CREATE POLICY "Anyone can update coffee shops"
ON coffee_shops
FOR UPDATE
USING (true);

-- Policy: Anyone can delete coffee shops (for now)
CREATE POLICY "Anyone can delete coffee shops"
ON coffee_shops
FOR DELETE
USING (true);


-- 2. COFFEE ENTRIES TABLE (Will be user-specific later)
-- ============================================

ALTER TABLE coffee_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view entries (for now, will restrict to user later)
CREATE POLICY "Anyone can view coffee entries"
ON coffee_entries
FOR SELECT
USING (true);

-- Policy: Anyone can insert entries (for now)
CREATE POLICY "Anyone can insert coffee entries"
ON coffee_entries
FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can update entries (for now)
CREATE POLICY "Anyone can update coffee entries"
ON coffee_entries
FOR UPDATE
USING (true);

-- Policy: Anyone can delete entries (for now)
CREATE POLICY "Anyone can delete coffee entries"
ON coffee_entries
FOR DELETE
USING (true);