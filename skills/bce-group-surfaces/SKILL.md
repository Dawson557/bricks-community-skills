---
name: bce-group-surfaces
description: "Use when building a group page, group directory, member dashboard, community area, team or cohort page, group admin tools (invite, remove, promote or demote members, edit or delete a group), a join-group or leave-group button, invitations, or group-owned posts (a group newsletter, a 'post to my group' form) on a site running Bricks Community Groups. Covers the Groups, Group members and Group invitations loops, group tags, group-admin conditions, the group Form actions and the Group Content post forms."
---

# Bricks Community: groups and member dashboards

**Requires:** the Groups module (Group Content for group-owned posts). Confirm tags with `bricks/list-dynamic-data-tags` and conditions with `bce/list-display-conditions`. Form mechanics: `bricks-forms`.

## Loops

| Query type | Returns |
|---|---|
| **Groups (Bricks Community)** | The viewer's groups: all, admin of, member of, or the **public groups directory** |
| **Group members (Bricks Community)** | One group's members. Group ID `{bce_group_id}` when nested in a Groups loop. **Rows only for that group's admins** |
| **Group invitations (Bricks Community)** | No Group ID: the viewer's own invitations. With one: that group's invitees, for its admins |
| Posts loop, **Include** `{bce_group_post_ids}` | A group's posts (inside a Groups loop, or `{bce_group_post_ids:12}`) |

A dashboard nests them: Groups loop → Group members + Group invitations. Pending (unpublished) group posts can't be looped: Bricks posts loops only return published posts.

## Tags

`{bce_group_id}` `{bce_group_name}` `{bce_group_description}` `{bce_group_visibility}` `{bce_group_role}` `{bce_group_member_count}`: the loop's group, or pass an ID (`{bce_group_name:12}`). Viewer: `{bce_my_group_ids}` `{bce_admin_group_ids}` `{bce_pending_invitation_count}`. Members loop: `{bce_member_user_id}` `{bce_member_display_name}` `{bce_member_joined}` `{bce_member_role}`. Owned post: `{bce_owner_group_id}` `{bce_owner_group_name}`.

- There's **no member email tag**, deliberately. Don't try to add one.
- A private group's name is empty for non-members. That's privacy, not a bug.
- Nothing renders for logged-out visitors, even for public groups.

## Conditions

`bce_is_group_admin` (empty = the loop's group) on admin tools, `bce_has_group_invitation` for an invitations banner, `bce_can_create_group`, `bce_in_group`, and `bce_can_manage_post` on Edit/Trash buttons for group posts.

## Admin actions are Form actions, not abilities

Create / Update / Delete group, **Manage group member** (invite, remove, make admin, demote, cancel invitation), **My group membership** (accept, decline, leave), **Join group**, and Create / Update / Trash group post.

- Group ID: a hidden field set to `{bce_group_id}`, and the action's Group ID `{{that_field}}`. Member target: a hidden field with `{bce_member_user_id}`.
- When an ID comes from a field or URL, fill **Restrict to group ID(s)** where offered, or the submission is refused.
- Gate each form with its condition. The server refuses the wrong person anyway, but a form that always errors is a broken page.
- Delete group needs a text field where the admin types the group's exact name.
- Update actions leave empty settings unchanged.
- Group post types must be enabled under Groups & Access → Group Content first. New posts are Pending by default.

Docs: https://grasshopperweb.agency/lessons/groups-group-admin-dashboard/ · https://grasshopperweb.agency/lessons/group-content-group-post-forms/
