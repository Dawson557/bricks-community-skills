---
name: bce-member-profile
description: "Use when building a front-end edit-profile page, account settings or 'my account' page, profile photo or avatar upload, a bio or custom user fields form (ACF, Meta Box), or a change-email or change-password form on a site running the Bricks Community plugins. Covers the Block wp-admin and Block API changes settings, why members' profile edits must not go through wp-admin or the REST API, and the form routes that keep working for them."
---

# Bricks Community: front-end profile pages

**Requires:** nothing beyond core. The settings below are Content Locking's; with that module off, neither block exists. Form mechanics: `bricks-forms`.

## Check the two switches first

`bce/get-settings` with `group: "content_locking"` (IDs are `content_locking.<setting>`):

| Setting | When true |
|---|---|
| `block_admin` | Logged-in users without `manage_options` are redirected from **every** wp-admin screen, `profile.php` included, to the home page. Their toolbar is hidden. |
| `block_admin_api` | Default true; only applies while `block_admin` is on. The same users get **403 `bce_admin_blocked`** on any POST, PUT, PATCH or DELETE under `/wp/v2` or `/batch/v1` (`/wp/v2/users/me`, its meta, `/wp/v2/media`, application passwords), and can't log in over XML-RPC. |
| `admin_allowed_user_ids`, `admin_allowed_group_ids` | Users, or members of these groups, exempt from both. |

Owners turn these on to keep members out of the backend. Build the profile page so it works with them **on**, whatever they are today: they're usually switched on later.

## Routes that still work for blocked members

All of these submit through `admin-ajax.php`, `admin-post.php` or the page itself, which neither block touches:

- **Meta Box User Profile** (`mb_user_profile_info`, or its Bricks Profile Form element) or an **ACF** front-end form, if the site has one. Check the active plugins first. These already scope edits to the current user.
- **A Bricks form with a custom action.** Bricks has **no built-in "update user" action**; `update-post` edits posts, not users. Add a handler in the child theme (`bricks-custom-code`) on `bricks/form/custom_action`:
  - Return early unless `$form->get_id()` is this form's element ID. The hook fires for every form with the Custom action.
  - The user is always `get_current_user_id()`. Never take a user ID from the submission.
  - Allowlist the keys you write. Never write `role`, capabilities, `user_login`, or any `bce_` key. Group membership and access grants are the plugin's own tables and actions, not user meta.
  - Values are in `$form->get_fields()['form-field-<field id>']`; uploads in `$form->get_uploaded_files()['form-field-<field id>']` (each a `wp_handle_upload()` result: `file`, `url`, `type`). Report with `$form->set_result( [ 'type' => 'error', 'message' => … ] )`.
- **Profile photo.** Use the **Profile Photos** module (`avatars`, BCE 0.16.0+; off by default, turned on under Settings > Feature Modules): a File field plus the **Update profile photo (Bricks Community)** form action (*Photo field ID*, optional *Person* user ID, *Remove photo*, *Saved/Removed message*), shown with `{bce_avatar_url}` / `{bce_has_avatar}` and gated with `{bce_can_edit_avatar}`. It works for members without `upload_files`, crops to a square, and replaces Gravatar in `get_avatar()` everywhere. Leave the File field's Storage at the default. Another user's photo needs `edit_user` or a `bce_avatar_may_edit` filter grant. Without the module: create the attachment server-side in a custom handler (`wp_insert_attachment()`), store its ID in user meta, and filter `pre_get_avatar_data`, or `get_avatar()` ignores it.

## Never

- Link "Edit profile" to `wp-admin/profile.php` or `get_edit_profile_url()`. It bounces members to the home page.
- Save from JavaScript through the REST API (`apiFetch`, `fetch( '/wp-json/wp/v2/users/me' )`, a media-modal upload to `/wp/v2/media`). It works for the admin building the page and returns 403 for members once the block is on.
- Expose a field because it's on the wp-admin profile screen. The front-end form is now the only way in, so it decides what members can change.

## Verify

Admins and allow-listed users bypass both blocks, so your own session proves nothing. Test as a member who isn't on the allow list, with `block_admin` and `block_admin_api` on: submit every field, upload a photo, reload, and confirm the values stuck.
