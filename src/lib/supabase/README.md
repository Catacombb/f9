# Supabase Schema Management

## Dashboard Schema Deployment

This directory contains SQL scripts for setting up and managing the database schema for the application.

### Core Schema Files

- `core_tables.sql` - Base schema for the design brief functionality
- `dashboard_schema.sql` - Extensions for the dashboard functionality (status tracking, user roles, activity logging)

### How to Apply Schema Changes

To apply the dashboard schema changes to your Supabase project:

1. **Navigate to the Supabase Dashboard**:
   - Go to https://app.supabase.io/ and log in
   - Select your project

2. **Open the SQL Editor**:
   - Click on "SQL Editor" in the left navigation
   - Click "New Query" to create a new SQL script

3. **Execute Dashboard Schema SQL**:
   - Copy and paste the contents of `dashboard_schema.sql` into the SQL editor
   - Click "Run" to execute the SQL

4. **Verify Schema Changes**:
   - Go to the "Table Editor" in the left navigation
   - Verify that:
     - The `projects` table has a new `status` column
     - New tables `user_profiles` and `activities` exist
     - RLS policies are correctly applied (check in Authentication > Policies)

5. **Generate Types** (if using Supabase CLI):
   - Run `supabase gen types typescript --local > src/lib/supabase/database.types.ts`
   - Or manually update the types in `database.types.ts` as we've done

### Schema Change Details

#### Projects Table
- Added `status` column with values: 'brief', 'sent', 'complete' (default 'brief')
- Added `status_updated_at` timestamp to track when status changes

#### User Profiles Table
- Created to store extended user information and roles ('admin' or 'client')
- Primary key references auth.users(id) for seamless integration
- Includes fields for user details and notification preferences

#### Activities Table
- Logs all project-related activities like status changes, comments, etc.
- Used for tracking history, generating timelines, and auditing
- Includes creation timestamp, user reference, and structured details

#### Triggers
- `on_auth_user_created`: Creates a user profile when a new user registers
- `on_project_status_change`: Updates status timestamp and logs status changes

These schema changes provide the foundation for implementing the dashboard functionality as outlined in the implementation plan. 