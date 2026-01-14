-- Notifications System
-- Migration: 007_notifications.sql

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Type and action
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
        'session_reminder', 'session_cancelled', 'session_completed',
        'badge_unlocked', 'level_up', 'streak_milestone',
        'new_follower', 'post_like', 'post_comment',
        'mentor_assigned', 'mentee_assigned',
        'module_completed', 'path_completed',
        'system', 'announcement'
    )),
    
    -- Action data
    action_url VARCHAR(500),
    action_data JSONB DEFAULT '{}',
    
    -- Reference
    reference_type VARCHAR(50),
    reference_id UUID,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery
    email_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Subscription data (Web Push)
    endpoint VARCHAR(500) NOT NULL,
    p256dh_key VARCHAR(200) NOT NULL,
    auth_key VARCHAR(100) NOT NULL,
    
    -- Device info
    device_type VARCHAR(20) CHECK (device_type IN ('web', 'ios', 'android')),
    device_name VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(endpoint)
);

-- Email queue (for async sending)
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Recipient
    to_email VARCHAR(255) NOT NULL,
    to_name VARCHAR(100),
    
    -- Content
    subject VARCHAR(200) NOT NULL,
    template VARCHAR(50) NOT NULL,
    template_data JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification preferences (per user)
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Email preferences
    email_session_reminders BOOLEAN DEFAULT TRUE,
    email_badge_unlocks BOOLEAN DEFAULT TRUE,
    email_weekly_digest BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,
    
    -- Push preferences
    push_session_reminders BOOLEAN DEFAULT TRUE,
    push_badge_unlocks BOOLEAN DEFAULT TRUE,
    push_social BOOLEAN DEFAULT TRUE,
    
    -- In-app preferences
    inapp_all BOOLEAN DEFAULT TRUE,
    
    -- Quiet hours
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status, scheduled_for);

-- Triggers
CREATE TRIGGER update_push_subscriptions_updated_at
    BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own notification preferences" ON notification_preferences
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(200),
    p_message TEXT,
    p_type VARCHAR(50),
    p_action_url VARCHAR(500) DEFAULT NULL,
    p_action_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, notification_type, action_url, action_data)
    VALUES (p_user_id, p_title, p_message, p_type, p_action_url, p_action_data)
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;
