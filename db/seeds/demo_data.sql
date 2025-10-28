-- Demo data for testing and development

-- Insert demo user
INSERT INTO users (id, email, password_hash, name, email_verified, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'demo@darksmart.local',
  '$2b$12$demo_hash_placeholder_do_not_use_in_production',
  'Demo User',
  true,
  true
) ON CONFLICT DO NOTHING;

-- Insert demo devices
INSERT INTO devices (id, user_id, name, type, traits, attributes, room, is_online)
VALUES
  (
    'device-outlet-001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Living Room Outlet',
    'action.devices.types.OUTLET',
    '["action.devices.traits.OnOff"]'::jsonb,
    '{"model": "Smart Outlet v1"}'::jsonb,
    'Living Room',
    true
  ),
  (
    'device-light-001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Bedroom Light',
    'action.devices.types.LIGHT',
    '["action.devices.traits.OnOff", "action.devices.traits.Brightness"]'::jsonb,
    '{"model": "Smart Light v2"}'::jsonb,
    'Bedroom',
    true
  ),
  (
    'device-thermostat-001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Main Thermostat',
    'action.devices.types.THERMOSTAT',
    '["action.devices.traits.TemperatureSetting"]'::jsonb,
    '{"model": "Smart Thermostat v3"}'::jsonb,
    'Hallway',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert demo device states
INSERT INTO device_states (device_id, state)
VALUES
  ('device-outlet-001', '{"on": true}'::jsonb),
  ('device-light-001', '{"on": true, "brightness": 80}'::jsonb),
  ('device-thermostat-001', '{"thermostatMode": "heat", "thermostatTemperatureSetpoint": 72}'::jsonb)
ON CONFLICT DO NOTHING;
