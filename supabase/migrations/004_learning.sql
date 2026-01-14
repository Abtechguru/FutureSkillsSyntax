-- Learning System
-- Migration: 004_learning.sql

-- Learning paths
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Content
    thumbnail_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    
    -- Categorization
    category VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INTEGER,
    
    -- Stats
    total_modules INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Career connection
    career_role_id UUID REFERENCES career_roles(id),
    skills_covered JSONB DEFAULT '[]',
    
    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning modules
CREATE TABLE IF NOT EXISTS learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    
    -- Content
    content_type VARCHAR(20) CHECK (content_type IN ('video', 'article', 'quiz', 'exercise', 'project')),
    content_url VARCHAR(500),
    content_data JSONB DEFAULT '{}',
    
    -- Duration
    duration_minutes INTEGER DEFAULT 15,
    
    -- Requirements
    prerequisites JSONB DEFAULT '[]',
    
    -- Gamification
    xp_reward INTEGER DEFAULT 50,
    
    -- Status
    is_published BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module resources (downloadable materials)
CREATE TABLE IF NOT EXISTS module_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    resource_type VARCHAR(20) CHECK (resource_type IN ('pdf', 'code', 'video', 'link', 'file')),
    url VARCHAR(500) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    
    -- Progress
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completed_modules JSONB DEFAULT '[]',
    current_module_id UUID REFERENCES learning_modules(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
    
    -- Timestamps
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, path_id)
);

-- Module progress (detailed tracking)
CREATE TABLE IF NOT EXISTS module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    
    -- Progress
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Video progress
    video_progress_seconds INTEGER DEFAULT 0,
    
    -- Quiz/Exercise results
    quiz_score DECIMAL(5,2),
    attempts INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, module_id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id UUID NOT NULL REFERENCES learning_paths(id),
    
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Verification
    verification_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT TRUE,
    
    -- PDF storage
    pdf_url VARCHAR(500),
    
    UNIQUE(user_id, path_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_learning_paths_published ON learning_paths(is_published);
CREATE INDEX IF NOT EXISTS idx_learning_modules_path ON learning_modules(path_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_path ON enrollments(path_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- Triggers
CREATE TRIGGER update_learning_paths_updated_at
    BEFORE UPDATE ON learning_paths
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at
    BEFORE UPDATE ON learning_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public read for paths and modules
CREATE POLICY "Anyone can view published paths" ON learning_paths
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published modules" ON learning_modules
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view resources" ON module_resources
    FOR SELECT USING (true);

-- User enrollment policies
CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own enrollments" ON enrollments
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Progress policies
CREATE POLICY "Users can manage own progress" ON module_progress
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Certificate policies
CREATE POLICY "Users can view own certificates" ON certificates
    FOR SELECT USING (auth.uid()::text = user_id::text);
