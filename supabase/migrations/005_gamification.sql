-- Gamification System
-- Migration: 005_gamification.sql

-- Badges
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Visual
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    
    -- Tier
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    
    -- Requirements
    category VARCHAR(50) NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INTEGER NOT NULL,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 100,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_secret BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    
    -- Progress
    progress INTEGER DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, badge_id)
);

-- Quests (daily/weekly challenges)
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Type
    quest_type VARCHAR(20) NOT NULL CHECK (quest_type IN ('daily', 'weekly', 'special', 'achievement')),
    category VARCHAR(50),
    
    -- Requirements
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INTEGER NOT NULL,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 50,
    badge_reward_id UUID REFERENCES badges(id),
    
    -- Timing
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User quests
CREATE TABLE IF NOT EXISTS user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    
    -- Progress
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    is_claimed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, quest_id)
);

-- Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Streak data
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Activity tracking
    last_activity_date DATE,
    streak_frozen_until DATE,
    freeze_count INTEGER DEFAULT 0,
    
    -- Milestones reached
    milestones_reached JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- XP transactions (audit log)
CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Source
    source_type VARCHAR(50) NOT NULL,
    source_id UUID,
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard (materialized view for performance)
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    rank INTEGER NOT NULL,
    experience_points INTEGER NOT NULL,
    current_level INTEGER NOT NULL,
    current_streak INTEGER DEFAULT 0,
    badges_count INTEGER DEFAULT 0,
    
    -- Period
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, period)
);

-- Rewards shop
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Type
    reward_type VARCHAR(30) NOT NULL CHECK (reward_type IN ('avatar_item', 'badge', 'certificate', 'discount', 'feature_unlock')),
    
    -- Cost
    xp_cost INTEGER,
    
    -- Data
    reward_data JSONB DEFAULT '{}',
    
    -- Limits
    quantity_available INTEGER,
    max_per_user INTEGER DEFAULT 1,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User rewards
CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, reward_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked ON user_badges(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_user_quests_user ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_cache(period, rank);

-- Triggers
CREATE TRIGGER update_user_streaks_updated_at
    BEFORE UPDATE ON user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (is_active = true AND is_secret = false);
CREATE POLICY "Anyone can view quests" ON quests FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view rewards" ON rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view leaderboard" ON leaderboard_cache FOR SELECT USING (true);

-- User data policies
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own quests" ON user_quests FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own streaks" ON user_streaks FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own XP" ON xp_transactions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own rewards" ON user_rewards FOR SELECT USING (auth.uid()::text = user_id::text);

-- Seed badges
INSERT INTO badges (name, slug, description, icon, tier, rarity, category, requirement_type, requirement_value, xp_reward) VALUES
('First Steps', 'first-steps', 'Complete your first module', 'footprints', 'bronze', 'common', 'learning', 'modules_completed', 1, 50),
('Quick Learner', 'quick-learner', 'Complete 5 modules', 'zap', 'bronze', 'common', 'learning', 'modules_completed', 5, 100),
('Dedicated Student', 'dedicated-student', 'Complete 20 modules', 'book', 'silver', 'uncommon', 'learning', 'modules_completed', 20, 200),
('7 Day Streak', 'week-warrior', 'Maintain a 7-day streak', 'flame', 'bronze', 'common', 'streak', 'streak_days', 7, 150),
('30 Day Streak', 'monthly-master', 'Maintain a 30-day streak', 'fire', 'gold', 'rare', 'streak', 'streak_days', 30, 500),
('First Session', 'first-session', 'Complete your first mentorship session', 'users', 'bronze', 'common', 'mentorship', 'sessions_completed', 1, 100),
('Career Explorer', 'career-explorer', 'Complete career assessment', 'compass', 'bronze', 'common', 'career', 'assessments_completed', 1, 75)
ON CONFLICT (slug) DO NOTHING;
