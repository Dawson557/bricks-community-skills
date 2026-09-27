---
name: bce-event-templates
description: "Use when building an event page, event single template, events list or calendar-style listing, RSVP or cancel button, waitlist, attendee list, spots-left or sold-out badge on a site running Bricks Community Events. Covers the event dynamic tags and meta keys, Event Attendees and Event Waitlist loops, the RSVP and Cancel RSVP form actions, and what must never be shown publicly."
---

# Bricks Community: event templates

**Requires:** the Events add-on. Confirm tags with `bricks/list-dynamic-data-tags`. There's no pre-built event page or calendar: build them from loops and tags. Event body text goes in the Event post, not the template.

## The Event template

Bricks → Templates, type Single, condition Post Type: Event.

| Tag | Notes |
|---|---|
| `{event_start}` `{event_end}` | Site date format; `{event_start:F j, Y}` for your own. End may be empty |
| `{event_format}` | In Person, Virtual or Hybrid |
| `{event_location_url}` `{event_virtual_url}` | Wrap each block in an `empty_not` condition on its own tag; don't branch on `{event_format}` |
| `{event_capacity}` `{event_spots_remaining}` | Empty when unlimited |
| `{event_attendee_count}` `{event_waitlist_count}` `{event_is_full}` | |
| `{event_user_status}` `{event_user_is_confirmed}` `{event_user_is_waitlisted}` `{event_user_waitlist_position}` | The viewer |
| `{event_ticket_url}` | Always empty until paid tickets ship |

An **events list** is a Posts loop over post type Event. Meta keys for ordering or filtering: `_bce_events_start`, `_bce_events_end`, `_bce_events_format`, `_bce_events_capacity`.

## RSVP block (Bricks Form actions)

- **RSVP to event**, Event ID `{post_id}`. Confirms, or waitlists when full.
- **Cancel RSVP**, same Event ID. Logged-in attendees only.
- Show the RSVP form when `{event_user_status}` is empty; relabel "Join the waitlist" on `{event_is_full}`.
- Show "You're confirmed" plus the cancel form on `{event_user_is_confirmed}`; the queue position on `{event_user_is_waitlisted}`.
- Guests: only on events not restricted by Content Locking. Add Guest name and Guest email fields and map them.

## Attendee loops

Query types **Event Attendees** and **Event Waitlist** (Event ID empty = current event). Keep the waitlist on queue order, ascending.

Tags inside: `{attendee_name}` `{attendee_avatar}` `{attendee_status}` `{attendee_position}` `{attendee_date}` `{attendee_is_guest}`.

**These loops aren't restricted.** Never put `{attendee_email}` or `{attendee_user_id}` on a public template. Gate the whole list with `bce_has_access` or a login condition when names shouldn't be public.

## Members-only events

Lock with Content Locking (load `bce-content-locking`). A locked event refuses RSVPs from people without access. Its offer can use `{event_start}` and `{event_spots_remaining}`.

Docs: https://grasshopperweb.agency/lessons/events-event-template/ · https://grasshopperweb.agency/lessons/events-rsvp-forms/
