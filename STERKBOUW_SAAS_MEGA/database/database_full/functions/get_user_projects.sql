
-- Example Supabase function
CREATE OR REPLACE FUNCTION get_user_projects(uid uuid)
RETURNS SETOF projects AS $$
  SELECT * FROM projects WHERE owner = uid;
$$ LANGUAGE sql STABLE;
