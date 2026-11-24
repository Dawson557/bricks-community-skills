# Bricks Community Skills — Changelog

One short line per change. This package is versioned separately from the plugins.

## 0.3.0

* Events: add-to-calendar tags (`.ics` download and Google Calendar link).
* Events: recurring events (series tags and recipes), cancelled events and `{event_location_text}`.
* Events: pass holders RSVP to festival sessions that sell their own tickets.
* `bce-event-templates` covers paid tickets (Event Tickets and My Tickets loops, ticket tags), collections and hosts.
* Post-type slugs in `bce-content-locking` and `bce-start-here` are the real ones (`bce_course`, `bce_lesson`, `bce_event`).
* `bce-start-here` updated to match the latest Bricks Community build guide.

## 0.2.0

* `bce-notifications`: preferences pages use the new Notification preferences element; the removed form action is gone from the guidance. Covers notification categories (including the locked Admin category), the Send action's Category setting and the `{bce_notification_category}` tag (Bricks Community Extension 0.18.0).
* New `bce-member-profile` skill: front-end profile and account pages that keep working when members are blocked from wp-admin and the REST API.
* `bce-content-locking` mentions Block wp-admin and points profile pages to `bce-member-profile`.

## 0.1.1

* Install and update now run entirely with git, so an agent can do either from a pasted prompt without hitting a blocked download.
* `bce-start-here` updated to match the latest Bricks Community build guide.

## 0.1.0

* First release: nine `bce-` skills covering courses, drip, content locking, events, groups and notifications.
* Content locking: Private Site, the no-access page and `{bce_no_access_post_id}`.
