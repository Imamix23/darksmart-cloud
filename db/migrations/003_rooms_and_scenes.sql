-- Phase 3: Rooms and Scenes Tables (prepared for Phase 3)

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Devices Junction Table
CREATE TABLE IF NOT EXISTS room_devices (
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  device_id VARCHAR(255) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, device_id)
);

-- Scenes Table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rooms_user_id ON rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_room_devices_room_id ON room_devices(room_id);
CREATE INDEX IF NOT EXISTS idx_room_devices_device_id ON room_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_scenes_user_id ON scenes(user_id);
