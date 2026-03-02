# Operations

This project does not provide a separate admin web UI.
Use Supabase Dashboard for operations.

## RSVP

- Table: `rsvp_entries`
- Suggested operations: filter by date, export CSV

## Guestbook

- Public list source: `guestbook_public_entries`
- Edit/delete is user self-service via password RPC in UI
- Emergency moderation is possible in Table Editor

## Security Checks

- Verify anonymous users cannot read `rsvp_entries`
- Verify anonymous users cannot select `guestbook_entries.password_hash`
- Verify guestbook update/delete only work through RPC with correct password
