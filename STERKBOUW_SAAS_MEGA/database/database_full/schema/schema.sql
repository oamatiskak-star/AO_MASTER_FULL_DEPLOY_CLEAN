
-- COMPLETE STERKBOUW DATABASE SCHEMA

-- USERS
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- PROJECTS
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner uuid REFERENCES users(id),
  created_at timestamp DEFAULT now()
);

-- CALCULATIONS
CREATE TABLE calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  version int DEFAULT 1,
  materials jsonb,
  labor jsonb,
  total numeric,
  created_at timestamp DEFAULT now()
);
