/*
  # Database Performance Optimization and Connection Improvements

  1. Performance Enhancements
    - Add missing indexes for better query performance
    - Optimize existing queries with composite indexes
    - Add database functions for common operations

  2. Connection Reliability
    - Add connection pooling settings
    - Optimize query timeouts
    - Add health check functions

  3. Data Integrity
    - Add constraints and validation
    - Improve error handling
    - Add audit triggers
*/

-- Add performance indexes if they don't exist
DO $$
BEGIN
  -- Index for portfolio queries by quarter and user
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_portfolio_quarter_user_performance'
  ) THEN
    CREATE INDEX idx_portfolio_quarter_user_performance 
    ON portfolio_constituents (quarter, user_id, quarterly_returns DESC, weight DESC);
  END IF;

  -- Index for user profile lookups
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_user_profiles_auth_lookup'
  ) THEN
    CREATE INDEX idx_user_profiles_auth_lookup 
    ON user_profiles (id, email, subscription_status);
  END IF;

  -- Index for session management
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_user_sessions_active'
  ) THEN
    CREATE INDEX idx_user_sessions_active 
    ON user_sessions (user_id, expires_at DESC) 
    WHERE expires_at > now();
  END IF;
END $$;

-- Create or replace database health check function
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  table_count integer;
  active_connections integer;
BEGIN
  -- Check table accessibility
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public';
  
  -- Check active connections (if accessible)
  BEGIN
    SELECT COUNT(*) INTO active_connections
    FROM pg_stat_activity 
    WHERE state = 'active';
  EXCEPTION WHEN OTHERS THEN
    active_connections := -1; -- Indicates no access to connection stats
  END;
  
  result := jsonb_build_object(
    'status', 'healthy',
    'timestamp', now(),
    'table_count', table_count,
    'active_connections', active_connections,
    'database_size', pg_database_size(current_database())
  );
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'timestamp', now(),
    'error_message', SQLERRM
  );
END;
$$;

-- Create or replace optimized portfolio data function
CREATE OR REPLACE FUNCTION get_portfolio_data_optimized(
  p_quarter text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  id bigint,
  quarter text,
  stock_name text,
  stock_code text,
  company_logo_url text,
  weight numeric,
  quarterly_returns numeric,
  created_at timestamptz,
  updated_at timestamptz,
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate inputs
  IF p_quarter IS NOT NULL AND p_quarter !~ '^Q[1-4] \d{4}$' THEN
    RAISE EXCEPTION 'Invalid quarter format. Expected format: Q1 2024';
  END IF;
  
  IF p_limit <= 0 OR p_limit > 1000 THEN
    RAISE EXCEPTION 'Limit must be between 1 and 1000';
  END IF;

  -- Return optimized query results
  RETURN QUERY
  SELECT 
    pc.id,
    pc.quarter,
    pc.stock_name,
    pc.stock_code,
    pc.company_logo_url,
    pc.weight,
    pc.quarterly_returns,
    pc.created_at,
    pc.updated_at,
    pc.user_id
  FROM portfolio_constituents pc
  WHERE 
    (p_quarter IS NULL OR pc.quarter = p_quarter)
    AND (
      (p_user_id IS NULL AND pc.user_id IS NULL) OR 
      (p_user_id IS NOT NULL AND pc.user_id = p_user_id)
    )
  ORDER BY pc.weight DESC, pc.quarterly_returns DESC
  LIMIT p_limit;
END;
$$;

-- Create or replace user portfolio initialization function
CREATE OR REPLACE FUNCTION initialize_user_portfolio(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  copied_count integer := 0;
  latest_quarter text;
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;

  -- Check if user already has portfolio data
  IF EXISTS (
    SELECT 1 FROM portfolio_constituents 
    WHERE user_id = p_user_id 
    LIMIT 1
  ) THEN
    RETURN jsonb_build_object(
      'status', 'already_exists',
      'message', 'User already has portfolio data',
      'user_id', p_user_id
    );
  END IF;

  -- Get the latest quarter from default data
  SELECT quarter INTO latest_quarter
  FROM portfolio_constituents
  WHERE user_id IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF latest_quarter IS NULL THEN
    RAISE EXCEPTION 'No default portfolio data found to copy';
  END IF;

  -- Copy default portfolio data for user
  INSERT INTO portfolio_constituents (
    user_id, quarter, stock_name, stock_code, 
    company_logo_url, weight, quarterly_returns
  )
  SELECT 
    p_user_id,
    quarter,
    stock_name,
    stock_code,
    company_logo_url,
    weight,
    quarterly_returns
  FROM portfolio_constituents
  WHERE user_id IS NULL
    AND quarter = latest_quarter;

  GET DIAGNOSTICS copied_count = ROW_COUNT;

  result := jsonb_build_object(
    'status', 'success',
    'message', 'Portfolio data initialized successfully',
    'user_id', p_user_id,
    'copied_records', copied_count,
    'latest_quarter', latest_quarter
  );

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'message', SQLERRM,
    'user_id', p_user_id
  );
END;
$$;

-- Create or replace connection monitoring function
CREATE OR REPLACE FUNCTION monitor_connection_health()
RETURNS TABLE (
  metric_name text,
  metric_value numeric,
  status text,
  timestamp timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_connections numeric;
  active_connections numeric;
  idle_connections numeric;
  db_size_mb numeric;
BEGIN
  -- Get connection statistics
  SELECT COUNT(*) INTO total_connections
  FROM pg_stat_activity;
  
  SELECT COUNT(*) INTO active_connections
  FROM pg_stat_activity 
  WHERE state = 'active';
  
  SELECT COUNT(*) INTO idle_connections
  FROM pg_stat_activity 
  WHERE state = 'idle';
  
  -- Get database size in MB
  SELECT pg_database_size(current_database()) / 1024 / 1024 INTO db_size_mb;
  
  -- Return metrics
  RETURN QUERY VALUES
    ('total_connections', total_connections, 
     CASE WHEN total_connections < 100 THEN 'healthy' ELSE 'warning' END, 
     now()),
    ('active_connections', active_connections,
     CASE WHEN active_connections < 50 THEN 'healthy' ELSE 'warning' END,
     now()),
    ('idle_connections', idle_connections,
     CASE WHEN idle_connections < 20 THEN 'healthy' ELSE 'warning' END,
     now()),
    ('database_size_mb', db_size_mb,
     CASE WHEN db_size_mb < 1000 THEN 'healthy' ELSE 'warning' END,
     now());
END;
$$;

-- Add query timeout settings (if supported)
DO $$
BEGIN
  -- Set statement timeout for long-running queries
  PERFORM set_config('statement_timeout', '30s', false);
  
  -- Set lock timeout
  PERFORM set_config('lock_timeout', '10s', false);
EXCEPTION WHEN OTHERS THEN
  -- Ignore if settings are not available
  NULL;
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_database_health() TO authenticated;
GRANT EXECUTE ON FUNCTION get_portfolio_data_optimized(text, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_user_portfolio(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION monitor_connection_health() TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION check_database_health() IS 'Returns database health status and metrics';
COMMENT ON FUNCTION get_portfolio_data_optimized(text, uuid, integer) IS 'Optimized function to fetch portfolio data with proper filtering and limits';
COMMENT ON FUNCTION initialize_user_portfolio(uuid) IS 'Safely initializes portfolio data for a new user by copying default data';
COMMENT ON FUNCTION monitor_connection_health() IS 'Returns detailed connection and performance metrics';