-- Mentorship System
-- Migration: 003_mentorship.sql

-- Mentor profiles (additional data for mentors)
CREATE TABLE IF NOT EXISTS mentor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Mentor info
    specialty VARCHAR(100),
    expertise_areas JSONB DEFAULT '[]',
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    
    -- Availability
    availability JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'UTC',
    max_mentees INTEGER DEFAULT 5,
    
    -- Stats
    total_sessions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Status
    is_accepting_mentees BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Mentor assignments
CREATE TABLE IF NOT EXISTS mentor_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES users(id),
    mentee_id UUID NOT NULL REFERENCES users(id),
    
    -- Assignment details
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Progress tracking
    current_week INTEGER DEFAULT 1,
    completed_modules JSONB DEFAULT '[]',
    overall_progress DECIMAL(5,2) DEFAULT 0,
    
    -- Metrics
    mentee_satisfaction DECIMAL(3,2),
    mentor_feedback TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(mentor_id, mentee_id, is_active)
);

-- Mentorship sessions
CREATE TABLE IF NOT EXISTS mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES mentor_assignments(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id),
    mentor_id UUID NOT NULL REFERENCES users(id),
    
    -- Session details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    topic VARCHAR(100),
    week_focus VARCHAR(50) CHECK (week_focus IN (
        'coding_basics', 'digital_literacy', 'responsibility',
        'discipline', 'financial_awareness', 'growth_mindset', 'project_work'
    )),
    
    -- Scheduling
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'completed', 'cancelled', 'missed'
    )),
    
    -- Video call
    meeting_url VARCHAR(500),
    recording_url VARCHAR(500),
    
    -- Content
    learning_objectives JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    discussion_points JSONB DEFAULT '[]',
    
    -- Notes & Feedback
    mentor_notes TEXT,
    mentee_reflection TEXT,
    session_rating INTEGER CHECK (session_rating BETWEEN 1 AND 5),
    
    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session messages (in-session chat)
CREATE TABLE IF NOT EXISTS session_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES mentorship_sessions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'code', 'system')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_user ON mentor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_mentor ON mentor_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_mentee ON mentor_assignments(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_assignment ON mentorship_sessions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_date ON mentorship_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_status ON mentorship_sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_messages_session ON session_messages(session_id);

-- Triggers
CREATE TRIGGER update_mentor_profiles_updated_at
    BEFORE UPDATE ON mentor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_assignments_updated_at
    BEFORE UPDATE ON mentor_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at
    BEFORE UPDATE ON mentorship_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;

-- Public can view mentor profiles
CREATE POLICY "Anyone can view mentor profiles" ON mentor_profiles
    FOR SELECT USING (true);

-- Users can manage their own mentor profile
CREATE POLICY "Users can manage own mentor profile" ON mentor_profiles
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Mentors and mentees can view their assignments
CREATE POLICY "Users can view own assignments" ON mentor_assignments
    FOR SELECT USING (
        auth.uid()::text = mentor_id::text OR 
        auth.uid()::text = mentee_id::text
    );

-- Session policies
CREATE POLICY "Users can view own sessions" ON mentorship_sessions
    FOR SELECT USING (
        auth.uid()::text = mentor_id::text OR 
        auth.uid()::text = mentee_id::text
    );

CREATE POLICY "Users can manage own sessions" ON mentorship_sessions
    FOR ALL USING (
        auth.uid()::text = mentor_id::text OR 
        auth.uid()::text = mentee_id::text
    );

-- Message policies
CREATE POLICY "Session participants can view messages" ON session_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mentorship_sessions s 
            WHERE s.id = session_id 
            AND (auth.uid()::text = s.mentor_id::text OR auth.uid()::text = s.mentee_id::text)
        )
    );

CREATE POLICY "Session participants can send messages" ON session_messages
    FOR INSERT WITH CHECK (auth.uid()::text = sender_id::text);
