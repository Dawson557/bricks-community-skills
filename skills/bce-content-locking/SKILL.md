---
name: bce-content-locking
description: "Use when building a paywall, members-only area, locked or restricted content, a 'join to unlock' or upgrade offer, a Restricted Content template, a 'my courses' list, or a grant-access or free-course form on a site running Bricks Community Content Locking. Covers the bce_has_access and bce_in_group conditions, Restricted Content templates (Entire website condition, never the post type), accessible-content loops, the Grant content access form action, and locked vs not-yet-released (drip)."
---

# Bricks Community: content locking and paywalls

**Requires:** Content Locking (and Groups) in the core plugin. Call `bce/list-display-conditions` before writing any condition; a key from a deactivated module is refused. Element condition mechanics: `bricks-element-conditions`.

## Locked vs not yet released

Check which system is gating before writing any message.
- **Content Locking**: "you don't have access". The fix is buy, join or be granted. Use `bce_has_access` and a Restricted Content template.
- **Drip**: "you have access; it isn't open yet". The fix is wait or finish the previous lesson. Use `bce_drip_available` (load `bce-course-templates`).

An empty lesson body for a logged-out visitor is drip, not Content Locking; Content Locking doesn't filter `the_content` at all.

## Hide the content: the condition pair

Nothing is hidden on the page unless you add a condition. The URL still renders.
- real content: `bce_has_access` `==` `1`
- offer: `bce_has_access` `==` `0`
- tiers: `bce_in_group` takes an **array of numeric group IDs** from `bce/list-groups`. Never guess IDs.

Writes go through Bricks' `bricks/update-element-conditions`. If a `bce_` key is refused as unknown, the owner switched off "Let AI write this plugin family's display conditions" on **Bricks Community → Settings → AI**. Tell them; don't work around it.

## Tell them how to get in: the Restricted Content template

A template type that renders automatically on locked posts, only for visitors without access. Build it once.

1. Bricks → Templates → Add New, Template Type **Restricted Content**.
2. Template Settings → Restricted Content → **Position**: before (paywall) or after (teaser).
3. Conditions, for this suite's post types (Course, Lesson, Event, anything drawn by a Single template):
   - **Entire website**, plus **Archive → Any** set to **Exclude**.
   - **Never a Post Type condition** on those types: it ties with the Single template for the content slot and the page can render **blank**, intermittently.
   - **Never empty**: a template with no conditions renders nowhere.
   - Entire website matches 404s too: a panel shown to admins on a "locked" page usually means a wrong URL.
4. Bind it: "*{post_title}* is for members". Branch login vs upgrade with Bricks' `user_logged_in` condition first, then tiers with `bce_in_group`. On events use `{event_start}` and `{event_spots_remaining}`.
5. Per-type offers: branch inside one template with a `dynamic_data` condition on `{post_type}` (`course`, `lesson`, `event`). Bricks has no post-type element condition.

**Never put the locked content in this template.** It renders to exactly the people you're locking out. Always give one clear next step (pricing page, signup, a join-group form).

## Lists and forms

- Only what the viewer can open: Query Loop **Include** `{bce_accessible_<post_type>_ids}`, e.g. `{bce_accessible_course_ids}`. Faster than a condition on each item.
- **Grant content access** form action: Post ID(s) and/or Post type(s). If either uses dynamic data, fill **Restrict to…** or the submission is refused.
- Lessons follow their course. Lock the course, not the lesson.
- Uploaded files stay public by URL. Use Protected Files for documents.

## Verify

Log out or use a private window: the content hides **and** the offer shows. Editors see everything.

Docs: https://grasshopperweb.agency/lessons/content-locking-restricted-content-templates/
