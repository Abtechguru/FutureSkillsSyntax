-- Career System
-- Migration: 002_career.sql

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career roles table
CREATE TABLE IF NOT EXISTS career_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    field VARCHAR(50) NOT NULL CHECK (field IN (
        'software_engineering', 'data_science', 'web_development', 
        'mobile_development', 'devops', 'cybersecurity', 'ai_ml',
        'cloud_computing', 'ux_ui_design', 'product_management',
        'game_development', 'blockchain'
    )),
    description TEXT NOT NULL,
    
    -- Requirements (JSON arrays)
    required_skills JSONB DEFAULT '[]',
    recommended_skills JSONB DEFAULT '[]',
    tools_technologies JSONB DEFAULT '[]',
    
    -- Day in life content
    day_in_life JSONB DEFAULT '{}',
    
    -- Market data
    average_salary_min INTEGER,
    average_salary_max INTEGER,
    demand_level INTEGER CHECK (demand_level BETWEEN 1 AND 5),
    growth_projection DECIMAL(5,2),
    
    -- Learning path reference
    learning_path_id UUID,
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career assessments table
CREATE TABLE IF NOT EXISTS career_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Assessment data
    answers JSONB NOT NULL,
    personality_traits JSONB NOT NULL,
    current_skills JSONB NOT NULL,
    interests JSONB NOT NULL,
    
    -- Results
    recommended_role_id UUID REFERENCES career_roles(id),
    match_score DECIMAL(5,2),
    alternative_roles JSONB DEFAULT '[]',
    skill_gaps JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills (bridge table)
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, skill_id)
);

-- Role skills (bridge table)
CREATE TABLE IF NOT EXISTS role_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_level INTEGER DEFAULT 3 CHECK (required_level BETWEEN 1 AND 5),
    is_required BOOLEAN DEFAULT TRUE,
    
    UNIQUE(role_id, skill_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_career_roles_field ON career_roles(field);
CREATE INDEX IF NOT EXISTS idx_career_assessments_user ON career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- RLS
ALTER TABLE career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read for roles and skills
CREATE POLICY "Anyone can view career roles" ON career_roles
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view skills" ON skills
    FOR SELECT USING (true);

-- Users can manage their own data
CREATE POLICY "Users can view own assessments" ON career_assessments
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own assessments" ON career_assessments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own skills" ON user_skills
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Seed some initial skills
INSERT INTO skills (name, category, description, icon) VALUES
('Python', 'programming', 'General-purpose programming language', 'python'),
('JavaScript', 'programming', 'Web programming language', 'javascript'),
('TypeScript', 'programming', 'Typed JavaScript', 'typescript'),
('React', 'frontend', 'JavaScript library for building UIs', 'react'),
('Node.js', 'backend', 'JavaScript runtime', 'nodejs'),
('PostgreSQL', 'database', 'Relational database', 'postgresql'),
('Docker', 'devops', 'Container platform', 'docker'),
('AWS', 'cloud', 'Amazon Web Services', 'aws'),
('Git', 'tools', 'Version control system', 'git'),
('Figma', 'design', 'UI/UX design tool', 'figma')
ON CONFLICT (name) DO NOTHING;
