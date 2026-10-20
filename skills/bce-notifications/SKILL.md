---
name: bce-notifications
description: "Use when adding a notification bell, notification inbox or dropdown, unread count or badge, a notification list or activity feed, a 'send a notification to my group' form, or an email or notification preferences page on a site running Bricks Community Notifications. Covers the Notifications element (use it; don't assemble a bell), the Notification preferences element (use it; don't build a preferences form), the My Notifications loop and tags, notification categories, and the Send notification form action."
---

# Bricks Community: notifications

**Requires:** the Notifications module. Confirm tags with `bricks/list-dynamic-data-tags`.

## The bell is an element

Insert the **Notifications** element (`bce-notifications`), usually in the header template. Don't build a bell from a Div, a Dropdown and a loop: the element is what knows the unread count and marks items read on click.

- It arrives wired: Bricks' own **Dropdown** with a bell, a panel, a looped row with its unread condition. Don't reconfigure the row's loop or condition.
- **Style the panel on the Dropdown's Content control group**, not on the wrapper.
- The unread dot is the only part the element draws; it has its own controls.
- The old `bce-notifications-panel` element is gone. Don't look for it or recreate it.
- Keep the row's Content div if you rearrange it; the unread marker sits at the row's far edge.
- Anything with class `bce-notifications__empty` hides once there's a notification.

In the builder, sample rows appear and read/unread markers both show: conditions don't evaluate on the canvas. Check the live page.

## Lists elsewhere

Query type **My Notifications (Bricks Community)**. Always the viewer's own; there's no setting to show anyone else's. It already leaves out what the viewer has muted.

Tags inside: `{bce_notification_title}` `{bce_notification_message}` `{bce_notification_url}` `{bce_notification_date}` `{bce_notification_type}` `{bce_notification_category}` `{bce_notification_is_unread}`. Anywhere: `{bce_unread_notification_count}`.

**Clicking a row outside the element doesn't mark it read.** Put the element on the page too (e.g. in the header).

## Preferences page: an element, not a form

Insert **Notification preferences** (`bce-notification-preferences`, in the Bricks Community element category). It renders the viewer's grid: an email master switch, then each notification **category** and each of their groups, with an *In the site* and a *By email* checkbox, and a Save button. Only ever saves the viewer's own.

- **Never build a preferences form.** The "Save notification preferences" form action was removed; the grid depends on the member and can't be a fixed Form.
- Change wording under its **Text** controls; style from the Style tab. Builder shows sample rows.
- Set its page as the **Preferences page** under Notifications → Settings → Email. Emails link to it, beside a one-click "Stop emails about *category*" link that works without it.

## Categories

Every notification has a category (Admin, Announcements, New content, Groups, Account, Other; New events and My events with Events; Purchases & access with Commerce; plus any the owner adds on Notifications → **Categories**). Members switch categories off per channel, except **Admin**: locked, always on in the bell and by email, no unsubscribe link, never selectable by senders. Plugins put must-see types there with `'category' => 'admin'`; never suggest it for a manual or form send. Read them with `bce/list-notification-categories`; add or change custom ones with `bce/manage-notification-categories`.

## Forms

- **Send notification**: group admins sending to their own groups. Off until the owner ticks *Allow group admins to send notifications*. Group ID usually a hidden `{bce_group_id}`; fill **Restrict to group ID(s)** when it comes from a field. Groups only, never a person. **Category** is optional: a category key the owner made pickable (see `bce/list-notification-categories`, `selectable`), fixed or `{{field_id}}`; anything else becomes Announcements.

Docs: https://grasshopperweb.agency/lessons/notifications-the-notifications-element/
