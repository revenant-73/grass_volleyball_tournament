-- Seed Script for Grass Doubles Tournament Platform
-- This script creates a sample event, divisions, teams, and a sponsor.

DO $$
DECLARE
    v_event_id UUID;
    v_div_mens_id UUID;
    v_div_womens_id UUID;
    v_user_id UUID;
BEGIN
    -- 1. Create a Super Admin User
    INSERT INTO users (name, email, role)
    VALUES ('Tournament Director', 'director@example.com', 'super_admin')
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_user_id;

    -- 2. Create a Sample Event
    INSERT INTO events (
        name, 
        slug, 
        description, 
        date_start, 
        date_end, 
        location_name, 
        location_address, 
        check_in_time, 
        start_time, 
        status
    )
    VALUES (
        'Seaside Grass Doubles Open',
        'seaside-open-2026',
        'The biggest grass doubles tournament of the spring season!',
        '2026-05-15',
        '2026-05-16',
        'Seaside Park',
        '123 Ocean Blvd, Beach City, CA',
        '08:00:00',
        '09:00:00',
        'open'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_event_id;

    -- 3. Create Divisions
    INSERT INTO divisions (event_id, name, level, format_type, team_cap, price_cents)
    VALUES (v_event_id, 'Mens Open', 'Pro/Open', 'Pool to Bracket', 16, 8000)
    RETURNING id INTO v_div_mens_id;

    INSERT INTO divisions (event_id, name, level, format_type, team_cap, price_cents)
    VALUES (v_event_id, 'Womens Open', 'Pro/Open', 'Pool to Bracket', 16, 8000)
    RETURNING id INTO v_div_womens_id;

    -- 4. Create Sample Teams for Mens Open
    INSERT INTO teams (division_id, team_name, captain_name, captain_email, status)
    VALUES 
        (v_div_mens_id, 'Sand Spikers', 'John Doe', 'john@example.com', 'paid'),
        (v_div_mens_id, 'Net Rulers', 'Mike Smith', 'mike@example.com', 'paid'),
        (v_div_mens_id, 'Block Party', 'Steve Rogers', 'steve@example.com', 'paid'),
        (v_div_mens_id, 'Grass Gorillas', 'Tony Stark', 'tony@example.com', 'pending');

    -- 5. Create Sample Teams for Womens Open
    INSERT INTO teams (division_id, team_name, captain_name, captain_email, status)
    VALUES 
        (v_div_womens_id, 'Ace Queens', 'Jane Doe', 'jane@example.com', 'paid'),
        (v_div_womens_id, 'Digging Divas', 'Sarah Connor', 'sarah@example.com', 'paid'),
        (v_div_womens_id, 'Volley Vixens', 'Natasha Romanoff', 'nat@example.com', 'paid'),
        (v_div_womens_id, 'Set Sisters', 'Wanda Maximoff', 'wanda@example.com', 'pending');

    -- 6. Create a Sample Sponsor
    INSERT INTO sponsors (event_id, name, website_url, display_order)
    VALUES (v_event_id, 'VolleyGear Inc.', 'https://example.com/volleygear', 1);

    -- 7. Create an Announcement
    INSERT INTO announcements (event_id, title, content, is_urgent)
    VALUES (v_event_id, 'Registration is Live!', 'Sign up now for the Seaside Open. Early bird pricing ends May 1st.', false);

END $$;
