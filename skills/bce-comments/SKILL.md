---
name: bce-comments
description: "Use when adding a comment thread, discussion section, replies, reactions or 'like' buttons on comments, a comment count, or a comment form to a page, post, lesson or event template on a site running Bricks Community Comments. Covers the Comments element (use it; don't assemble a thread from Bricks' Post Comments or custom code), its default child tree, the three reaction display modes, the Comments and Comment reactions loops, tags and conditions, the --bce-depth indentation rule, the Post comment form action, and who can see who reacted."
---

# Bricks Community: comments

**Requires:** the Comments module. Confirm tags with `bricks/list-dynamic-data-tags` and conditions with `bce/list-display-conditions`. Read the site's setup with `bce/comment-settings`.

## The thread is an element

Insert the **Comments** element (`bce-comments`, in the Bricks Community category) where the discussion goes, usually a single template. Don't use Bricks' **Post Comments** element and don't build a thread from loops and custom JavaScript: the element is what posts, replies, edits, deletes and reacts without a page reload, and redraws the thread with your own markup.

It arrives as a working, neutral thread you restyle or delete piece by piece:

```
Heading "Comments ({bce_comments_count})"
Comment form home → member form / visitor form (Bricks Form + Cancel button)
Comment list → Block looped over Comments (Bricks Community)
  header: avatar, author, relative date, "Edited", "Awaiting approval"
  content (data-bce-comment-content) · "This comment was deleted."
  reactions: inline loop · total · Dropdown "my reaction" picker
  actions: Reply · Edit · Delete
Button "Show more comments"
```

- **Keep the `data-*` attributes** the tree sets: `data-bce-comment-form`, `data-bce-comment-form-home`, `data-bce-comment-content`, `data-bce-comment-action="reply|edit|delete|cancel|more"` on the buttons, and `data-bce-reaction-count` / `data-bce-reaction-total` on the Text elements showing a reaction's count and the comment's total. They are how the script finds things. A button or count you add yourself needs the attribute too; a count without it still updates, but only after the server answers.
- Element settings: **Post** (empty = the current post; set it to show another post's thread), **Reactions display**, **Order** (empty = Settings › Discussion).
- On a post the viewer can't see (locked, not yet released, private site) the element renders nothing. That's correct.
- The builder shows sample comments, and both halves of every condition pair. Check the live page.

## Reaction display modes

Pick on the element (**Reactions display**). The reaction loops follow it.

| Mode | Shows | Pick it when |
|---|---|---|
| **Primary + picker** (default) | Primary reactions always, other reactions once used, a picker with the non-primary ones | Most sites: one or two main reactions plus extras |
| **All** | Every reaction with its count, zeros included | Few reactions (2–4), all equally important |
| **Just picker** | A summary of used reactions with a total, one "my reaction" button opening every reaction | Many reactions, or a compact design |

Primary is set per reaction by the site owner. Reactions (names, icons, order) are managed on **Bricks Community › Comment Settings** only; no ability writes them.

## Loops

**Comments (Bricks Community)**, setting **Structure**:
- **Threaded** (default): one flat list in reading order, replies under their comment. Bricks loops can't nest per level, so indent with one rule on the looped item: `margin-inline-start: calc(var(--bce-depth) * 2rem);`. Each item carries `--bce-depth` (0 = top level). Never duplicate the item per level.
- **Top-level comments only**, and **Replies to the current comment** (nested inside a top-level loop, for two-level designs).

Page size, depth and order come from Settings › Discussion. Bricks' **Pagination** element doesn't support this loop: use the tree's "Show more comments" button, or a Load more interaction / infinite scroll.

**Comment reactions (Bricks Community)**, only inside a Comments item, setting **Show**: **Inline** / **Picker** (both follow the display mode), **Used reactions only**, **Every reaction**. Items are already clickable buttons (`role`, `aria-pressed`, `aria-label`); a visitor gets them disabled. Show the icon with an **Icon** element set to dynamic data `{bce_reaction_icon}`.

## Tags

Inside a Comments item: `{bce_comment_author_name}` `{bce_comment_author_avatar}` (Image element; `:48` for size) `{bce_comment_author_url}` `{bce_comment_content}` `{bce_comment_date}` (`:F j, Y` for a format) `{bce_comment_date_relative}` `{bce_comment_permalink}` `{bce_comment_parent_author_name}` `{bce_comment_depth}` `{bce_comment_reply_count}` `{bce_comment_reaction_total}` `{bce_comment_my_reaction_name}` `{bce_comment_my_reaction_icon}` `{bce_comment_reactors}` `{bce_comment_id}`.
Inside a Comment reactions item: `{bce_reaction_name}` `{bce_reaction_icon}` `{bce_reaction_count}` `{bce_reaction_key}` `{bce_reaction_reactors}`.
Inside the element: `{bce_comments_count}` (approved comments).

## Conditions

| Key | Use it on |
|---|---|
| `bce_comments_open` | The comment form (open, and this visitor may comment) |
| `bce_can_react` | The reaction picker |
| `bce_reactions_mode` (`all` / `primary_picker` / `picker`) | The total and picker, per mode |
| `bce_comment_can_reply` / `_can_edit` / `_can_delete` | Reply, Edit, Delete |
| `bce_comment_is_pending` / `_is_edited` / `_is_deleted` | "Awaiting approval", "Edited", the deleted placeholder (hide avatar, content, reactions, actions) |
| `bce_comment_is_mine` / `_has_replies` / `_has_my_reaction` | Highlighting |
| `bce_comment_depth` (number, `==` … `<`) | Depth-specific styling |
| `bce_reactors_visible` | Anything using the Who reacted tags |
| `bce_reaction_is_mine` | Inside a reactions item |

## The form

Bricks' own **Form** with the action **Post comment (Bricks Community)**: never a custom form, a REST call or a different action. The same form posts, replies and edits; hidden fields `bce_parent`, `bce_edit`, `bce_post` are filled by the script, so keep them with those exact Names. Map the comment (and for visitors, name and email) fields in the action. The tree has two forms, members and visitors, shown by condition; keep both if visitors may comment.

## What Discussion still decides

Settings › Discussion: who may comment (logged-in only), name and email, moderation, disallowed words, threading on/off and depth, paging, order. Don't recreate any of it with conditions. Comment Settings adds: who sees who reacted, what deleting does to replies, the edit time limit (`comments.*` in `bce/update-settings`).

## Privacy

`comments.reactor_visibility` decides who sees names behind reaction counts: **nobody** (default, counts only, administrators included), **author**, **everyone**. The Who reacted tags return empty when it says no. Don't work around it with another source; ask the owner to change the setting.

## Verify

As a member: post, reply, edit, delete and react, with no reload and no console errors. As another member: no Edit or Delete on someone else's comment. Logged out: counts show, reactions are inert, the visitor form appears only if Discussion allows it. On a locked post as a member without access: no thread at all.

Docs: https://grasshopperweb.agency/lessons/comments-the-comments-element/
