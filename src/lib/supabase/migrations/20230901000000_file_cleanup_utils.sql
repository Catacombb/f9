-- Add system_maintenance to activity types
ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'system_maintenance';

-- Create a function to log system maintenance activities
CREATE OR REPLACE FUNCTION log_system_maintenance(
  p_user_id UUID,
  p_details JSONB
) RETURNS void AS $$
BEGIN
  INSERT INTO activities (
    user_id,
    activity_type,
    details,
    is_system_generated
  ) VALUES (
    p_user_id,
    'system_maintenance',
    jsonb_build_object(
      'event', 'file_cleanup',
      'timestamp', CURRENT_TIMESTAMP
    ) || p_details,
    TRUE
  );
END;
$$ LANGUAGE plpgsql; 