-- Init SQL for rental app
-- Create users, vehicles, reservations tables

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  to_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert demo users (password: 'password123' for all)
INSERT INTO users (email, password_hash, role)
VALUES
('admin@rental.com', '$2a$10$kUD9q9lQiY2OtOlHmJJkNeQBjAnoI5aiVE28ckdShPTSUc1DhpcxW', 'admin'),
('user@rental.com', '$2a$10$9J1AtrL5sB/3RqeNb1FVbeT9Jasu0j2ErMDZA/Sg57L20UQkkCTv6', 'user')
ON CONFLICT DO NOTHING;

-- Insert demo vehicles
INSERT INTO vehicles (make, model, year, available)
VALUES
('Toyota', 'Corolla', 2020, true),
('Ford', 'Focus', 2019, true),
('Honda', 'Civic', 2021, true),
('BMW', '3 Series', 2022, true),
('Tesla', 'Model 3', 2023, true)
ON CONFLICT DO NOTHING;
