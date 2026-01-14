-- Community System
-- Migration: 006_community.sql

-- Community posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(300),
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'code', 'question', 'achievement', 'project')),
    
    -- Media
    images JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    
    -- Categorization
    tags JSONB DEFAULT '[]',
    category VARCHAR(50),
    
    -- Stats
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Status
    is_published BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    
    -- Stats
    likes_count INTEGER DEFAULT 0,
    
    -- Status
    is_edited BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reactions (likes, etc.)
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Target (polymorphic)
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL,
    
    -- Reaction type
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'celebrate', 'support', 'insightful')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, target_type, target_id)
);

-- Follows (user follows user)
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Target
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'learning_path', 'module')),
    target_id UUID NOT NULL,
    
    -- Organization
    folder VARCHAR(100),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, target_type, target_id)
);

-- Reports (content moderation)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    
    -- Target
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment', 'user')),
    target_id UUID NOT NULL,
    
    -- Report details
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- Triggers
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update post stats
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'comments' THEN
            UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_TABLE_NAME = 'reactions' AND NEW.target_type = 'post' THEN
            UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'comments' THEN
            UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        ELSIF TG_TABLE_NAME = 'reactions' AND OLD.target_type = 'post' THEN
            UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.target_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_stats();

CREATE TRIGGER trigger_update_likes_count
    AFTER INSERT OR DELETE ON reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_post_stats();

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON posts
    FOR SELECT USING (is_published = true AND moderation_status = 'approved');

CREATE POLICY "Users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid()::text = author_id::text);

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid()::text = author_id::text);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can manage own comments" ON comments FOR ALL USING (auth.uid()::text = author_id::text);

-- Reactions policies
CREATE POLICY "Anyone can view reactions" ON reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage own reactions" ON reactions FOR ALL USING (auth.uid()::text = user_id::text);

-- Follows policies
CREATE POLICY "Anyone can view follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (auth.uid()::text = follower_id::text);

-- Bookmarks policies
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid()::text = user_id::text);

-- Reports policies
CREATE POLICY "Users can create reports" ON reports
    FOR INSERT WITH CHECK (auth.uid()::text = reporter_id::text);
