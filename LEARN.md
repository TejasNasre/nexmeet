# `NexMeet Project Setup`

## `Kinde Auth Setup : `

- YT Video For Setup Kinde [Kinde Auth Setup Video](https://youtu.be/sjcLxYbw5BQ?feature=shared&t=76)
- Make Sure To Add Github, Facebook And Google Outh2.0 In Kinde

### `Make .env.local And Add Required Keys`

```
KINDE_CLIENT_ID=<change this>
KINDE_CLIENT_SECRET=<change this>
KINDE_ISSUER_URL=<change this>
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

### `Congrats! You Successfully Setup Kinde Auth`

## `Set Up Your Database :`

- Go to Your [Supabase Dashboard](https://supabase.com/dashboard).
- YT Video For Setup Supabase [Supabase DB Setup](https://youtu.be/iXz82niZ3OA?feature=shared&t=11)
- Select Your Project / Create A New One.
- Navigate To The `Project Settings` In The Sidebar Of Your Newly Created Project.
- Now Go To `API` Under `CONFIGURATION` Section.
- Copy The `URL` And `ANON-PUBLIC` From This Tab And Paste In Your .env.local File Respectively.

### `Add Required Keys`

```
NEXT_PUBLIC_SUPABASE_PASSWORD=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### `Make Tables :`

- Go To Your [Supabase Dashboard](https://supabase.com/dashboard).
- Select Your Project.
- Navigate To The `SQL Editor` Tab In The Sidebar.
  <img width="1366" alt="SQL QUERY" src="https://raw.githubusercontent.com/TejasNasre/nexmeet/refs/heads/main/public/sql%20editor.PNG">
- Run The Following SQL Query:

### `Table For Event Details : `

```sql
create table
  public.event_details (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    event_title text not null,
    event_description text not null,
    event_location text not null,
    event_registration_startdate timestamp with time zone not null,
    event_registration_enddate timestamp with time zone not null,
    team_size smallint not null default '1'::smallint,
    event_enddate timestamp with time zone not null,
    event_price text null default 'Free'::text,
    event_likes bigint null default '0'::bigint,
    event_formlink text not null,
    organizer_name text not null,
    organizer_email text not null,
    organizer_contact bigint not null,
    event_category text not null,
    event_tags text[] not null,
    event_social_links text[] not null,
    event_duration bigint not null,
    event_startdate timestamp with time zone not null,
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    constraint event_details_pkey primary key (id),
    constraint event_details_created_at_key unique (created_at),
    constraint event_details_event_title_key unique (event_title)
  ) tablespace pg_default;
```

### `Make Storage : `

- Navigate To The `Storage` In The Sidebar Of Your Newly Created Project.
- Now Go To `New Bucket` And Create A `Public Buckets` Named `event_images` And `event_space`.
  <img width="1366" alt="STORAGE SETUP" src="https://raw.githubusercontent.com/TejasNasre/nexmeet/refs/heads/main/public/storage.PNG">
  <img width="1366" alt="NEW BUCKET" src="https://raw.githubusercontent.com/TejasNasre/nexmeet/refs/heads/main/public/image%20setup.PNG">

- Then Under The Buckets We Have `CONFIGURATION` Select `Policies` Make New Policy With `For Full Customization` For `event_images` And `event_space` With `all` Permissions.
  <img width="1366" alt="BUCKET POLICIES" src="https://raw.githubusercontent.com/TejasNasre/nexmeet/refs/heads/main/public/poilicy%20storage.PNG">

### `Table For Event Images : `

```sql
create table
  public.event_images (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    url text not null,
    event_id uuid not null,
    constraint event_images_pkey primary key (id),
    constraint event_images_event_id_fkey foreign key (event_id) references event_details (id)
  ) tablespace pg_default;
```

### `Table For Event Participants : `

```sql
create table
  public.event_participants (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    participant_name text not null,
    participant_email text not null,
    participant_contact bigint not null,
    event_id uuid not null,
    is_registered boolean null default false,
    constraint event_participants_pkey primary key (id),
    constraint event_participants_event_id_fkey foreign key (event_id) references event_details (id)
  ) tablespace pg_default;
```

### `Table For Event Space : `

```sql
create table
  public.event_space (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    description text not null,
    location text not null,
    capacity bigint not null,
    price_per_hour bigint not null,
    owner_email character varying not null,
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    owner_contact bigint not null,
    availability boolean null default true,
    amenities text[] not null,
    space_likes bigint null default '0'::bigint,
    constraint event_space_pkey primary key (id),
    constraint event_space_name_key unique (name)
  ) tablespace pg_default;
```

### `Table For Event Space Img Vid : `

```sql
create table
  public.event_space_img_vid (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    url text not null,
    event_space_id uuid not null,
    constraint event_space_img - vid_pkey primary key (id),
    constraint event_space_img - vid_event_space_id_fkey foreign key (event_space_id) references event_space (id)
  ) tablespace pg_default;
```

### `Table For Event Space Request : `

```sql
create table
  public.event_space_request (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    organiser_id text not null,
    space_id uuid not null,
    request_date timestamp with time zone not null,
    status character varying not null default 'pending'::character varying,
    constraint event_space_request_pkey primary key (id),
    constraint event_space_request_space_id_fkey foreign key (space_id) references event_space (id)
  ) tablespace pg_default;
```

### `Table For Contact Submissions : `

```sql
create table
  public.contact_submissions (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone not null default now(),
    name text null,
    email text null,
    message text null,
    constraint contact_submissions_pkey primary key (id)
  ) tablespace pg_default;
```

- This Will Create A Table Named `event_details`, `event_images`, `event_participants`, `event_space`, `event_space_img_vid`, `event_space_request`, and `contact_submissions`.

- Navigate To The `Authentication` Tab In The Sidebar.
  <img width="1366" alt="TABLE POILICY" src="https://raw.githubusercontent.com/TejasNasre/nexmeet/refs/heads/main/public/policy%20setup.PNG">

- Now Go To `Policies` Under `CONFIGURATION` Section.
- Create Policy for `event_details`, `event_images`, `event_participants`, `event_space`, `event_space_img_vid`, `event_space_request`, and `contact_submissions` With `all` Permissions.

### `Congrats! You Successfully Setup Your Database`

`Learn Whole Supabase (Optional)` [YT Platlist](https://youtube.com/playlist?list=PL8HkCX2C5h0W-Fr3NEfOprzTRHICMGyOX&feature=shared)

⭐️ Support The Project!

If You Find This Project Helpful, Please Consider Giving It A Star On GitHub! Your Support Helps To Grow The Project And Reach More Contributors.
