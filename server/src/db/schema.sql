-- ==============================================================================
-- CLUBVERSE - College Club Event Management Database Schema
-- Architecture Specification: Supabase PostgreSQL
-- ==============================================================================

-- 1. Table: events
-- Represents campus club activities, workshops, competitions, and seminars
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for public searching, filtering, and sorting
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured);

-- 2. Table: registrations
-- Captures student RSVPs linked directly to active club events
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  college VARCHAR(255) NOT NULL,
  year VARCHAR(30) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast attendee filtering by event
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- 3. Table: admins
-- Stores club executive credentials for back-office access
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- SEED DATA (Realistic development data for testing)
-- ==============================================================================

-- Seed Admin
-- Default credentials for development: admin@clubverse.edu / Admin@ClubVerse2026
-- Bcrypt hash generated with 10 salt rounds
INSERT INTO admins (id, email, password_hash)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'admin@clubverse.edu',
  '$2a$10$rC81n0tJ/pP0d0t59O6c7eHwLq27sK8tD9N5gQ1h3m7j4z6y8x0w2'
)
ON CONFLICT (email) DO NOTHING;

-- Seed Events: Hackathon, Workshop, Coding Contest, Cultural Event
INSERT INTO events (id, title, description, category, date, time, venue, image_url, is_featured)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Campus CodeSprint 2026',
    'A 12-hour intensive hackathon where student teams collaborate to build innovative web and mobile solutions addressing sustainability and campus life.',
    'Hackathon',
    '2026-10-15',
    '09:00 - 21:00',
    'Innovation Hub, Auditorium Block B',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    TRUE
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Modern Full-Stack Web Development Workshop',
    'Hands-on masterclass covering modern React, Tailwind CSS, and REST API integration with real-world project development.',
    'Workshop',
    '2026-10-22',
    '14:00 - 17:00',
    'Computer Science Lab 3',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    FALSE
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'AlgoRush Competitive Programming Challenge',
    'Fast-paced algorithmic problem-solving contest testing data structures, algorithms, and speed with live leaderboard tracking.',
    'Coding Contest',
    '2026-11-05',
    '16:00 - 18:30',
    'Online Arena / Central Computing Center',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    FALSE
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    'ClubVerse Annual Cultural Showcase',
    'An evening celebration of student talent featuring music performances, drama, visual art exhibits, and campus club showcases.',
    'Cultural',
    '2026-11-18',
    '17:30 - 21:00',
    'Main Campus Amphitheatre',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Registrations for development relational verification
INSERT INTO registrations (event_id, name, email, college, year, phone)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Alex Rivera',
    'alex.rivera@campus.edu',
    'School of Computer Science',
    '3rd Year',
    '+1-555-0199'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Samantha Chen',
    'samantha.chen@campus.edu',
    'Department of Information Technology',
    '2nd Year',
    '+1-555-0142'
  )
ON CONFLICT DO NOTHING;
