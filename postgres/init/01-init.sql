-- ============================================================================
-- HYLACVIET.VN - PostgreSQL Initialization
-- ============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Log
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully!';
END $$;
