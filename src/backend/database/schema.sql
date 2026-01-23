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