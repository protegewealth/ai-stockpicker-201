# Troubleshooting Guide

## Issue 1: Post-Login Redirect Problems

### Root Cause Analysis
The post-login redirect issues were caused by:
1. **Incomplete URL State Capture**: Only storing pathname, missing search params and hash
2. **Race Conditions**: Auth state changes happening before location storage
3. **Inconsistent Redirect Logic**: Multiple redirect mechanisms conflicting
4. **Missing Error Handling**: No fallback for failed redirects

### Solution Implemented
1. **Enhanced Session Manager**: 
   - Captures complete URL state (path + search + hash)
   - Implements pending redirect mechanism for OAuth flows
   - Provides fallback redirect logic
   - Includes proper cleanup and error handling

2. **Improved Auth Context**:
   - Better timing for redirect execution
   - Enhanced error handling for auth failures
   - Connection status monitoring
   - Proper state management during auth flow

3. **Robust Auth Callback**:
   - Waits for database connection before proceeding
   - Handles connection failures gracefully
   - Provides user feedback during process
   - Implements proper error recovery

### Testing Approach
```bash
# Test redirect scenarios:
1. Navigate to /momentum → login → should return to /momentum
2. Navigate to /backtest?filter=recent → login → should return with filter
3. Navigate to /momentum#section → login → should return to section
4. Login from home page → should go to default (/momentum)
5. Test with network disconnection during auth flow
```

## Issue 2: Database Data Fetching Problems

### Root Cause Analysis
Database issues were caused by:
1. **Poor Connection Management**: No connection health monitoring
2. **Insufficient Error Handling**: Queries failing without proper fallbacks
3. **Missing Retry Logic**: No automatic retry for transient failures
4. **Cache Invalidation Issues**: Stale data not being refreshed properly
5. **No Fallback Data**: Application breaking when database unavailable

### Solution Implemented
1. **Connection Manager**:
   - Real-time connection health monitoring
   - Exponential backoff retry logic
   - Connection metrics and diagnostics
   - Automatic reconnection attempts

2. **Enhanced Portfolio Service**:
   - Connection testing before queries
   - Fallback data for offline scenarios
   - Improved caching with staleness detection
   - Better error categorization and handling

3. **Database Optimizations**:
   - Performance indexes for common queries
   - Health check functions
   - Optimized query functions
   - Connection pooling settings

4. **Error Handling System**:
   - Centralized error management
   - User-friendly error messages
   - Retry mechanisms for recoverable errors
   - Error logging and analytics

### Database Schema Updates
The migration includes:
- Performance indexes for faster queries
- Health check functions for monitoring
- Optimized data access functions
- Connection monitoring utilities

### Testing Database Fixes
```bash
# Test database scenarios:
1. Normal operation with good connection
2. Simulate network disconnection
3. Test with slow database responses
4. Verify fallback data loading
5. Test real-time subscription recovery
6. Verify cache behavior during outages
```

## Security Considerations

### Authentication Security
1. **PKCE Flow**: Using Proof Key for Code Exchange for OAuth
2. **Session Management**: Secure token storage and validation
3. **Redirect Validation**: Only allowing safe redirect URLs
4. **State Protection**: Preventing CSRF attacks in auth flow

### Database Security
1. **Row Level Security**: All tables have proper RLS policies
2. **Function Security**: Database functions use SECURITY DEFINER appropriately
3. **Input Validation**: All user inputs validated at database level
4. **Connection Security**: Encrypted connections and proper authentication

### Data Protection
1. **Cache Security**: Sensitive data not stored in localStorage
2. **Error Sanitization**: No sensitive data in error messages
3. **Audit Trail**: All data changes logged with timestamps
4. **Access Control**: User-specific data isolation

## Performance Optimizations

### Database Performance
- **Composite Indexes**: Multi-column indexes for complex queries
- **Query Optimization**: Reduced N+1 queries and optimized joins
- **Connection Pooling**: Efficient database connection management
- **Materialized Views**: Pre-computed aggregations for analytics

### Application Performance
- **Service-Level Caching**: 5-minute cache for portfolio data
- **Connection Reuse**: Persistent connections where possible
- **Lazy Loading**: Data loaded only when needed
- **Background Refresh**: Non-blocking data updates

### Real-time Performance
- **User-Specific Channels**: Personalized real-time updates
- **Intelligent Notifications**: Only relevant updates trigger UI changes
- **Connection Health**: Automatic reconnection for dropped connections
- **Subscription Cleanup**: Proper cleanup to prevent memory leaks

## Monitoring and Maintenance

### Health Monitoring
```sql
-- Check database health
SELECT * FROM check_database_health();

-- Monitor connection metrics
SELECT * FROM monitor_connection_health();

-- Check user portfolio data
SELECT user_id, COUNT(*) as portfolio_count 
FROM portfolio_constituents 
GROUP BY user_id;
```

### Performance Monitoring
- Monitor query execution times
- Track connection pool usage
- Watch for memory leaks in real-time subscriptions
- Monitor cache hit rates

### Error Monitoring
- Track error rates by type
- Monitor authentication success rates
- Watch for connection failures
- Track user session restoration success

## Common Issues and Solutions

### Issue: "Database connection failed"
**Solution**: 
1. Check environment variables
2. Verify Supabase project status
3. Test network connectivity
4. Check browser console for detailed errors

### Issue: "Session not persisting"
**Solution**:
1. Check localStorage permissions
2. Verify auth configuration
3. Check for third-party cookie blocking
4. Ensure proper session restoration

### Issue: "Real-time updates not working"
**Solution**:
1. Check WebSocket connections
2. Verify RLS policies
3. Check subscription setup
4. Monitor connection health

### Issue: "Data not loading after login"
**Solution**:
1. Check user portfolio initialization
2. Verify database permissions
3. Check for RPC function errors
4. Test with fallback data

## Emergency Procedures

### Database Outage
1. Application automatically switches to cached data
2. Users see "offline mode" indicator
3. Real-time updates pause gracefully
4. Automatic reconnection when service restored

### Authentication Service Outage
1. Existing sessions continue to work
2. New logins show appropriate error message
3. Users can still view public data
4. Session restoration works when service restored

### Complete Service Outage
1. Application shows demo data
2. Users informed of service status
3. Retry mechanisms continue in background
4. Graceful degradation of features

This comprehensive solution addresses both the post-login redirect issues and database connectivity problems while maintaining security, performance, and user experience.