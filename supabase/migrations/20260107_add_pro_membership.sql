-- =============================================
-- Migration: Add Pro Membership Support
-- =============================================
-- This migration adds subscription tracking and enforces
-- Row Level Security for Pro-only features.

-- Add subscription columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_pro_member BOOLEAN DEFAULT false;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro_member 
ON profiles(is_pro_member);

-- =============================================
-- RLS Policies for Advanced Analytics
-- =============================================
-- Only Pro members can access advanced analytics data

-- First, create the advanced_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS advanced_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    correlation_data JSONB,
    regression_data JSONB,
    forecast_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on advanced_analytics
ALTER TABLE advanced_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own analytics"
ON advanced_analytics FOR SELECT
USING (auth.uid() = user_id);

-- Only Pro members can insert analytics
CREATE POLICY "Pro members can insert analytics"
ON advanced_analytics FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_pro_member = true
    )
);

-- Only Pro members can update analytics
CREATE POLICY "Pro members can update analytics"
ON advanced_analytics FOR UPDATE
USING (
    auth.uid() = user_id 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_pro_member = true
    )
);

-- Users can delete their own analytics
CREATE POLICY "Users can delete own analytics"
ON advanced_analytics FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS Policies for Pro-only Data Export
-- =============================================
-- Create a table for tracking data exports (Pro only)

CREATE TABLE IF NOT EXISTS data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    export_type TEXT NOT NULL, -- 'csv', 'pdf', 'json'
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

-- Only Pro members can export data
CREATE POLICY "Pro members can create exports"
ON data_exports FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_pro_member = true
    )
);

-- =============================================
-- Function to check Pro membership
-- =============================================
CREATE OR REPLACE FUNCTION is_pro_member()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_pro_member = true
        AND (
            profiles.subscription_expires_at IS NULL 
            OR profiles.subscription_expires_at > now()
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Trigger to update profile on subscription changes
-- =============================================
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if subscription has expired
    IF NEW.subscription_expires_at IS NOT NULL 
       AND NEW.subscription_expires_at < now() THEN
        NEW.is_pro_member := false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
DROP TRIGGER IF EXISTS check_subscription_expiry ON profiles;
CREATE TRIGGER check_subscription_expiry
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_status();

-- =============================================
-- Grant access
-- =============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON advanced_analytics TO authenticated;
GRANT ALL ON data_exports TO authenticated;
