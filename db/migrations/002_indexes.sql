-- Phase 1: Performance Indexes for DarkSmart

-- Additional indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_devices_user_id_is_online ON devices(user_id, is_online);
CREATE INDEX IF NOT EXISTS idx_devices_user_id_created_at ON devices(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_authorization_codes_expires_at ON authorization_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_device_access_tokens_expires_at ON device_access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_device_id ON audit_logs(device_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_revoked ON oauth_tokens(user_id, revoked);
CREATE INDEX IF NOT EXISTS idx_device_access_tokens_device_revoked ON device_access_tokens(device_id, revoked);
