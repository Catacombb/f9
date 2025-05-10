# Complete Database Schema

This document provides a comprehensive overview of the database schema used in the application.

## Tables

### Projects

The core table that stores all design brief projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp with time zone | NULL, DEFAULT now() | Last update timestamp |
| user_id | uuid | NOT NULL, UNIQUE | Foreign key to auth.users |
| client_name | text | NOT NULL | Name of the client |
| project_address | text | NULL | Address of the project |
| contact_email | text | NULL | Contact email |
| contact_phone | text | NULL | Contact phone number |
| project_type | text | NULL | Type of project |
| project_description | text | NULL | Description of the project |
| budget_range | text | NULL | Budget range |
| move_in_preference | text | NULL | Move-in preference |
| move_in_date | text | NULL | Move-in date |
| project_goals | text | NULL | Project goals |
| coordinates | double precision[] | NULL | Geographic coordinates |
| status | text | NOT NULL, DEFAULT 'brief' | Project status (brief, sent, complete) |
| status_updated_at | timestamp with time zone | NULL, DEFAULT now() | Status last updated |
| version | integer | NOT NULL, DEFAULT 1 | Optimistic locking version |

**Constraints:**
- Primary Key: id
- Foreign Key: user_id references auth.users(id)
- Check: status must be one of: 'brief', 'sent', 'complete'
- Unique: user_id

### Project Settings

Stores detailed settings related to a project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| budget_flexibility | text | NULL | Budget flexibility notes |
| budget_priorities | text[] | NULL | Array of budget priorities |
| budget_notes | text | NULL | Notes on budget |
| lifestyle_notes | text | NULL | Lifestyle related notes |
| home_feeling | text | NULL | Desired home feeling |
| site_constraints | text[] | NULL | Array of site constraints |
| site_access | text | NULL | Site access information |
| site_views | text | NULL | Site views information |
| outdoor_spaces | text[] | NULL | Array of outdoor spaces |
| site_notes | text | NULL | Notes on site |
| home_level_type | text | NULL | Type of home level |
| level_assignment_notes | text | NULL | Level assignment notes |
| home_size | text | NULL | Size of home |
| eliminable_spaces | text | NULL | Spaces that can be eliminated |
| room_arrangement | text | NULL | Room arrangement preferences |
| preferred_styles | text[] | NULL | Array of preferred styles |
| material_preferences | text[] | NULL | Array of material preferences |
| external_materials_selected | text[] | NULL | Array of selected external materials |
| internal_materials_selected | text[] | NULL | Array of selected internal materials |
| sustainability_features | text[] | NULL | Array of sustainability features |
| technology_requirements | text | NULL | Technology requirements (note: not an array) |
| architecture_notes | text | NULL | Architecture notes |
| communication_notes | text | NULL | Communication notes |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Rooms

Stores information about rooms in a project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| type | text | NOT NULL | Room type |
| quantity | integer | NULL, DEFAULT 1 | Number of rooms |
| description | text | NULL | Room description |
| is_custom | boolean | NULL, DEFAULT false | Whether the room is custom |
| custom_name | text | NULL | Custom name for the room |
| display_name | text | NULL | Display name for the room |
| primary_users | text[] | NULL | Array of primary users |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Occupants

Stores information about occupants related to a project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| type | text | NOT NULL | Occupant type |
| name | text | NOT NULL | Occupant name |
| notes | text | NULL | Notes about the occupant |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Professionals

Stores information about professionals involved in a project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| type | text | NOT NULL | Professional type |
| name | text | NOT NULL | Professional name |
| contact | text | NULL | Contact information |
| notes | text | NULL | Notes about the professional |
| is_custom | boolean | NULL, DEFAULT false | Whether the professional type is custom |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Project Files

Stores metadata about files associated with projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| file_path | text | NOT NULL | Storage path to the file |
| file_name | text | NOT NULL | Original file name |
| file_type | text | NOT NULL | Type of file |
| file_size | integer | NOT NULL | Size of file in bytes |
| category | text | NOT NULL | File category |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Inspiration Entries

Stores inspiration links and descriptions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| link | text | NOT NULL | Inspiration link |
| description | text | NULL | Description of the inspiration |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Summaries

Stores generated and edited summaries for projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NOT NULL | Foreign key to projects |
| generated_summary | text | NULL | Automatically generated summary |
| edited_summary | text | NULL | User-edited summary |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE

### Activities

Stores activity logs for projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL, DEFAULT uuid_generate_v4() | Primary key |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| project_id | uuid | NULL | Foreign key to projects |
| user_id | uuid | NULL | Foreign key to auth.users |
| activity_type | text | NOT NULL | Type of activity |
| details | jsonb | NOT NULL, DEFAULT '{}' | Activity details |
| is_system_generated | boolean | NULL, DEFAULT false | Whether system generated |

**Constraints:**
- Primary Key: id
- Foreign Key: project_id references projects(id) ON DELETE CASCADE
- Foreign Key: user_id references auth.users(id) ON DELETE SET NULL
- Check: activity_type must be one of: 'status_change', 'comment', 'document_upload', 'system_event'

### User Profiles

Stores extended user information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | NOT NULL | Primary key, maps to auth.users |
| created_at | timestamp with time zone | NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp with time zone | NULL, DEFAULT now() | Last update timestamp |
| role | text | NOT NULL, DEFAULT 'client' | User role |
| first_name | text | NULL | First name |
| last_name | text | NULL | Last name |
| company | text | NULL | Company name |
| phone | text | NULL | Phone number |
| notification_preferences | jsonb | NULL, DEFAULT '{}' | Notification preferences |

**Constraints:**
- Primary Key: id
- Foreign Key: id references auth.users(id) ON DELETE CASCADE
- Check: role must be one of: 'admin', 'client'

## Views

### Project User Summary

Summarizes projects by user.

```sql
CREATE VIEW project_user_summary AS
SELECT
  u.email,
  up.role,
  count(p.id) AS project_count,
  array_agg(p.id) AS project_ids,
  array_agg(p.status) AS project_statuses,
  array_agg(p.created_at) AS created_at_timestamps
FROM
  auth.users u
LEFT JOIN
  user_profiles up ON u.id = up.id
LEFT JOIN
  projects p ON u.id = p.user_id
GROUP BY
  u.id, u.email, up.role
ORDER BY
  up.role, (count(p.id)) DESC;
```

## Key Relationships

```
auth.users 1──┬──* projects
              └──1 user_profiles
                 
projects 1─┬──* project_settings
           ├──* rooms
           ├──* occupants
           ├──* professionals
           ├──* inspiration_entries
           ├──* project_files
           ├──* summaries
           └──* activities
``` 