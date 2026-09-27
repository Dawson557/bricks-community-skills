---
name: bce-notifications
description: "Use when adding a notification bell, notification inbox or dropdown, unread count or badge, a notification list or activity feed, a 'send a notification to my group' form, or an email or notification preferences page on a site running Bricks Community Notifications. Covers the Notifications element (use it; don't assemble a bell), the My Notifications loop and tags, and the Send notification and Save notification preferences form actions."
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

Query type **My Notifications (Bricks Community)**. Always the viewer's own; there's no setting to show anyone else's.

Tags inside: `{bce_notification_title}` `{bce_notification_message}` `{bce_notification_url}` `{bce_notification_date}` `{bce_notification_type}` `{bce_notification_is_unread}`. Anywhere: `{bce_unread_notification_count}`.

**Clicking a row outside the element doesn't mark it read.** Put the element on the page too (e.g. in the header).

## Forms

- **Send notification**: group admins sending to their own groups. Off until the owner ticks *Allow group admins to send notifications*. Group ID usually a hidden `{bce_group_id}`; fill **Restrict to group ID(s)** when it comes from a field. Groups only, never a person.
- **Save notification preferences**: one master checkbox plus `group_id:{{field}}` pairs. Only ever saves the submitter's own. Then set its page as the **Preferences page** under Notifications → Settings → Email, or emails go out without an unsubscribe link.

Docs: https://grasshopperweb.agency/lessons/notifications-the-notifications-element/
