---
name: bce-event-templates
description: "Use when building an event page, event single template, events list or calendar-style listing, RSVP or cancel button, waitlist, attendee list, spots-left or sold-out badge, ticket or pass buttons, a festival or conference agenda, recurring event dates or a cancelled badge on a site running Bricks Community Events. Covers the event dynamic tags and meta keys, Event Attendees, Event Waitlist, Event Tickets and My Tickets loops, collections, recurring series, the RSVP and Cancel RSVP form actions, and what must never be shown publicly."
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
| `{event_location_text}` | The address or venue as typed, line breaks kept. Empty unless In Person or Hybrid |
| `{event_is_cancelled}` | Not empty while cancelled: show a badge, hide the RSVP form (it refuses RSVPs anyway) |
| `{event_capacity}` `{event_spots_remaining}` | Empty when unlimited |
| `{event_calendar_url}` `{event_series_calendar_url}` `{event_google_calendar_url}` | Add-to-calendar links: `.ics` (a collection's holds every session; series = every date) and Google (single events). Put on a Button link with an `empty_not` condition on the same tag; empty without access, without a start, or when cancelled |
| `{event_attendee_count}` `{event_waitlist_count}` `{event_is_full}` | |
| `{event_user_status}` `{event_user_is_confirmed}` `{event_user_is_waitlisted}` `{event_user_waitlist_position}` | The viewer |
| `{event_is_ticketed}` `{event_tickets_on_sale}` `{event_tickets_from_price}` `{event_ticket_url}` | Paid tickets (see Tickets below) |

An **events list** is a Posts loop over post type Event. Meta keys for ordering or filtering: `_bce_events_start`, `_bce_events_end`, `_bce_events_format`, `_bce_events_capacity`, `_bce_events_cancelled`, `_bce_events_series`.

## Recurring events

A recurring event is a series of ordinary events, one per date, in one collection; each date has its own RSVPs. Tags: `{event_is_recurring}`, `{event_recurrence}` ("Every week on Tuesday, until …"), `{event_series_position}` / `{event_series_count}` ("Session 3 of 6"), `{event_series_is_next}`, `{event_series_next_url}` / `{event_series_next_start}`, `{event_series_id}`.

- **All dates of this series:** Posts loop, post type Event, meta query `_bce_events_series` = `{event_series_id}`, order by meta `_bce_events_start`.
- **Events list showing only each series' next date:** keep the query; on the card, a condition with two OR groups: `{event_is_recurring}` empty, or `{event_series_is_next}` not empty.

## RSVP block (Bricks Form actions)

- **RSVP to event**, Event ID `{post_id}`. Confirms, or waitlists when full.
- **Cancel RSVP**, same Event ID. Logged-in attendees only.
- Show the RSVP form when `{event_user_status}` is empty; relabel "Join the waitlist" on `{event_is_full}`.
- Show "You're confirmed" plus the cancel form on `{event_user_is_confirmed}`; the queue position on `{event_user_is_waitlisted}`.
- Guests: only on events not restricted by Content Locking. Add Guest name and Guest email fields and map them.
- A festival session that sells its own tickets still takes free RSVPs from pass holders: show the RSVP form on `{event_user_can_rsvp}` not empty, and the buy buttons on `{event_is_ticketed}` not empty with `{event_user_pass_includes}` empty. A pass holder gets "This event is full." once the ticket stock is gone.

## Tickets

Tickets are store products (WooCommerce or SureCart, through Bricks Community Commerce) linked to an event or collection in its Event settings. A ticketed event refuses free RSVPs.

- Show the RSVP form when `{event_is_ticketed}` is empty, buy buttons when it isn't. `{event_ticket_url}` links the first ticket on sale; `{event_tickets_from_price}` is "from $25".
- Several tickets: an **Event Tickets** loop (On sale only, if wanted) with `{ticket_name}` `{ticket_price}` `{ticket_remaining}` `{ticket_is_sold_out}` `{ticket_is_on_sale}` `{ticket_sales_end}` `{ticket_buy_url}`.
- `{event_spots_remaining}` and `{event_is_full}` follow the tickets' stock, so a sold-out badge works unchanged.
- A buyer of several seats has one ticket each: a **My Tickets** loop lists the viewer's own, with `{attendee_checkin_qr}` per seat. Viewer's own page only.

## Collections and hosts

A collection (`bce_event_collection`: a festival, conference, retreat) groups events (sessions); every `{event_*}` tag works on it. Sessions: Posts loop, post type Event, Child of `{post_id}` (or `{event_collection_id}` on a session). Agenda by day: an **Event Collection Days** loop, then a Posts loop with two DATETIME meta clauses on `_bce_events_start` (`>=` `{collection_day_from}`, `<=` `{collection_day_to}`). On a session, `{event_requires_collection}` and `{event_user_pass_includes}` decide whether to show the RSVP form. Speakers: an **Event Hosts** loop with `{wp_user_*}` tags.

## Attendee loops

Query types **Event Attendees** and **Event Waitlist** (Event ID empty = current event). Keep the waitlist on queue order, ascending.

Tags inside: `{attendee_name}` `{attendee_avatar}` `{attendee_status}` `{attendee_position}` `{attendee_date}` `{attendee_is_guest}` `{attendee_source}` ("RSVP" or "Ticket (WooCommerce)") `{attendee_ticket_name}` `{attendee_attendance}` (`attended` / `no_show` / empty; organizer-only pages).

## Tickets and check-in

- `{event_user_checkin_qr}` is the viewer's ticket as an inline SVG QR code (`{event_user_checkin_qr:300}` for the size, default 200) in a Basic Text or Rich Text element; `{event_user_checkin_url}` is the link it encodes. Both are empty unless the viewer is confirmed. `{event_user_attendance}` is `attended` / `no_show` / empty, for a "thanks for coming" block.
- **Ticket tags go only on the attendee's own view** (account page, "my tickets", the event page they're viewing). **Never put them inside an attendee or waitlist loop**: a ticket is a bearer secret for its holder alone.
- Staff check people in from wp-admin (the door view and its scanner); don't build a front-end check-in page.

**These loops aren't restricted.** Never put `{attendee_email}` or `{attendee_user_id}` on a public template. Gate the whole list with `bce_has_access` or a login condition when names shouldn't be public.

## Members-only events

Lock with Content Locking (load `bce-content-locking`). A locked event refuses RSVPs from people without access. Its offer can use `{event_start}` and `{event_spots_remaining}`.

Docs: https://grasshopperweb.agency/lessons/events-event-template/ · https://grasshopperweb.agency/lessons/events-rsvp-forms/
