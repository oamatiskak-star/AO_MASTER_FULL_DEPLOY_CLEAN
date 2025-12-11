
-- RLS policies

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY project_owner ON projects
  FOR ALL USING (auth.uid() = owner);

CREATE POLICY calc_project_access ON calculations
  FOR ALL USING (
    auth.uid() IN (SELECT owner FROM projects WHERE id = project_id)
  );
