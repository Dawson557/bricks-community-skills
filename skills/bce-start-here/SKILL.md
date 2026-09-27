---
name: bce-start-here
description: "Use when doing any Bricks work on a WordPress site running the Bricks Community plugins: courses, lessons, modules, curriculum, events, RSVPs, groups, members, member dashboards, community, paywalls, members-only or restricted content, drip or locked lessons, notifications. Load before the first write. Routes to the matching bce- skill, states the one rule (content lives in posts; templates decide how it looks), and carries the full build guide."
---

<!-- Generated from Bricks Community 0.12.1 includes/AI/start-here.md by bin/sync-start-here. Edit that file, not this one. -->

# Building with the Bricks Community suite

You are connected to a WordPress site running the Bricks theme and the Bricks Community plugin family (Groups, Content Locking, Notifications, Courses, Events). You reach it over MCP. You cannot see the site's files, so everything here is what you need to know before you start writing.

This is about **courses, modules, lessons and events specifically**. General Bricks technique lives in the Bricks skills — see the first section.

---

## 0. Before you generate a single template

**Check whether two skills packages are loaded in your client.** Both are client-side, separate from the site's MCP abilities:

* **The Bricks skills** (names start with `bricks-`: `bricks-start-here`, `bricks-dynamic-data`, `bricks-query-loops`, …). Element schemas, the HTML/CSS import workflow, verification.
* **The Bricks Community skills** (names start with `bce-`: `bce-start-here`, `bce-course-templates`, `bce-frontend-build`, …). This document, split by task.

Look at the skills available to you. Do **not** call a site ability to check this; it is a fact about your client, not about the site.

**If either is missing, stop and tell the user before building anything.** Say roughly this:

> I can reach your site, but [the Bricks skills / the Bricks Community skills / neither skills package] [is / are] installed in this client. Without them I'd be guessing, and Bricks templates fail in ways that look fine in a response and broken on the page. To install them: go to **Bricks Community → Settings → AI** in wp-admin, copy the install prompt, and paste it into this chat. It installs both packages. You may need to restart this client or start a new chat afterwards for them to load.

If the user would rather proceed without them, keep going with this document and call `bricks/start-here` for general Bricks routing. It is a fallback, not a substitute — say so, and keep the scope small.

**When a `bce-` skill and the site disagree, the site wins.** The `bce/start-here` ability always matches the plugin version actually installed; a skills package can be any age. Tags and condition keys are confirmed with `bricks/list-dynamic-data-tags` and `bce/list-display-conditions`.

Once they are loaded, use them. Load the task-specific one before you write:

| Doing this | Load this skill |
|---|---|
| Any new page, section or template shell | `bce-frontend-build`, then `bricks-html-css-to-bricks` |
| Course, module or lesson templates and their loops | `bce-course-templates` |
| Reordering lessons, modules, drip rules | `bce-course-structure` |
| Paywalls, members-only content | `bce-content-locking` |
| Event pages and RSVP | `bce-event-templates` |
| Group pages and member dashboards | `bce-group-surfaces` |
| The notification bell, inbox or preferences | `bce-notifications` |
| Binding anything to real data | `bricks-dynamic-data` |
| Deciding where a template applies | `bricks-templates-conditions` |
| Repeating lessons, modules, events | `bricks-query-loops` |
| Showing or hiding an element | `bricks-element-conditions` |
| Checking your work rendered | `bricks-browser-verify` |

**Calling this suite's abilities:** `bce/start-here` is a direct MCP tool (`bce-start-here`). Every other `bce/…` ability is called through `mcp-adapter-execute-ability` with `ability_name` set to the slash name, for example `bce/get-course-structure`.

---

## 1. The one rule

**Course, module, lesson and event content lives in WordPress. Bricks templates decide how it looks. Never build the two together.**

Concretely: when the user asks for "a course page" or "a lesson about soil types", you create a **Course / Module / Lesson / Event post** and put the words in its post body. You do not create a Bricks page, and you do not paste the lesson text into a Bricks element.

Then, once, you build a **Single template** that renders every lesson. Not one per lesson. One.

### Why this is not a style preference

Four things break if you build the content into a Bricks page, and three of them are silent.

**Drip and locking act on `the_content`.** `Drip\Content_Guard` empties the post content filter at priority 9999; Content Locking redacts through REST and feeds. Text you typed into a Bricks heading or text element never passes through `the_content`, so **it is not redacted**. A lesson that is supposed to be locked renders its body to anyone who opens the URL. This is the failure mode that matters most — it looks like it works right up until it doesn't.

**Dynamic data needs post context.** `{course_progress_percent}`, `{next_lesson_url}`, `{drip_unlocks_in}` and the rest resolve against the post being rendered. On a standalone page there is no lesson in context and they come back empty.

**Enforcement is server-side and post-based.** The REST API, feeds, oEmbed and comments are all guarded per post. A Bricks page holding lesson text is just a page: none of those guards apply to it.

**A hundred lessons is a hundred pages to maintain.** One template change should reach every lesson. That is the entire point.

### What "content in WordPress" means in practice

* The lesson's **body text** goes in the post content. Use whatever post-writing ability you have.
* Structured facts — start time, capacity, drip rules — go in the post's own fields via the abilities below, not into template text.
* The template holds **layout, styling, navigation, progress readouts and the locked-state panel**. No lesson-specific copy, ever.

---

## 2. Build the template with the Post Content element

On a Lesson (or Course, or Module) Single template, render the body with Bricks' native **Post Content** element.

**Do not use a Text element bound to `{post_content}`.** Drip redaction runs on the `the_content` filter. Post Content passes through it; a raw tag binding does not, and a locked lesson will leak its body.

The same caution applies to anything that bypasses the content: a video URL in a custom field, a Code element, an embed. If a lesson's real substance lives in one of those, drip will not hide it. Put the substance in the post body.

---

## 3. The condition pair

A locked lesson renders an **empty body**. With nothing else on the page that reads as broken, so the template always carries two containers:

* **The body** — condition `bce_drip_available` `==` `1`
* **The locked panel** — condition `bce_drip_available` `==` `0`

The plugin's own usage documentation calls this "the normal way to build a lesson template, not an extra." Treat it as required.

In the locked panel use `{drip_unlocks_in}`, `{drip_unlocks_at}` and `{drip_lock_reason}`. **Both date tags are deliberately empty when the gate is a completion rather than a date** — "after you finish Lesson 2" has no date to show. So condition the "opens in X" line on `empty_not` and give the panel a plain fallback sentence underneath.

The same shape applies to Content Locking, with `bce_has_access` `==` `1` / `== 0` — real content in one branch, the offer in the other.

### Writing these conditions

Bricks' `bricks/update-element-conditions` ability validates against an allow-list of condition keys. This suite registers its own keys into that list, so `bce_has_access`, `bce_in_group`, `bce_drip_available`, `bce_lesson_complete`, `bce_course_complete` and `bce_module_complete` are all writable through it — and, for group dashboards, `bce_is_group_admin`, `bce_has_group_invitation`, `bce_can_create_group` and `bce_can_manage_post`.

Two things to know:

* Call **`bce/list-display-conditions`** first. It returns which of these keys exist on this site, their operators and their allowed values. A condition belonging to a deactivated module is not accepted, and this is how you find that out before the write fails.
* If the write is refused as an unknown key, the site owner has switched off **"Let AI write this plugin family's display conditions"** at **Settings → Bricks Community → AI**. Tell them that, rather than working around it.

`bce_in_group` takes an **array of numeric group IDs**. Get them from `bce/list-groups`; never guess.

---

## 4. Telling locked-out visitors how to get in

A condition pair hides the content. It does not tell anyone **why** they can't see it or **what to do about it** — and an empty page with a bare "no access" line is the difference between a paywall that sells and one that annoys.

That is what the **Restricted Content template** is for. It is a template type this suite adds to Bricks, and it renders automatically on any locked post, immediately before or after the real content, for exactly the visitors who lack access.

### Why it beats putting the message in the page template

You build it **once**. It appears on every locked post of every tracked post type, without you adding anything to the Course template, the Lesson template, the Event template and whatever else gets locked later. It is also self-gating: the suite only renders it when the post type is tracked *and* the current visitor lacks access, so you never write an access condition on it yourself.

### Building one

1. **Bricks → Templates → Add New**, and set **Template Type** to **Restricted Content**.
2. In Template Settings, open the **Restricted Content** group and set **Position** — *Before content* (the default) or *After content*. Before is right for a paywall; after suits a teaser that ends in an offer.
3. Set the template's **Conditions**. Read the trap below before you choose them.
4. Build the offer, bound to dynamic data so one template serves every locked post.

### Make it specific with dynamic data

The template renders inside the locked post's own context, so the post tags resolve to the thing the visitor was actually trying to open. Use that — a message naming what they wanted converts, a generic one does not.

* **`{post_title}`** — "*{post_title}* is for members." Now one template speaks accurately on a hundred posts.
* **Split "log in" from "sign up"** with Bricks' own `user_logged_in` condition. A logged-out visitor needs a login link; a logged-in member who still lacks access needs an upgrade, and showing them a login button reads as broken. This is the single highest-value branch in the whole panel — make it before anything else.
* **Split tiers** with `bce_in_group`. Condition one panel on the visitor being in your entry-level group — "Your Basic membership doesn't include this course" — and another on them being in none of them. Get the IDs from `bce/list-groups`.
* **On events**, offer the actual route in: `{event_ticket_url}` as the button link, `{event_start}` so they know what they're buying, `{event_spots_remaining}` and `{event_is_full}` for urgency or an honest "sold out, join the waitlist."
* **Always give one clear next step** — a pricing page, a signup form, a Bricks Form that joins a group. A panel that explains the lock without offering a way through it is worse than nothing.

**Never put the locked content in this template.** It renders *to people without access*. Anything you place here is public to exactly the audience you are locking out.

### Locked is not the same as not-yet-released

Keep the two systems apart, because the remedy differs:

* **Content Locking** — "you don't have access." The fix is to buy, join or be granted. That is the Restricted Content template's job.
* **Drip** — "you have access; it isn't open yet." The fix is to wait or finish the previous lesson. That is the `bce_drip_available` pair from section 3, using `{drip_unlocks_in}`.

Sending a drip-locked learner to a pricing page for something they already paid for is a support ticket. Check which system is actually gating before you write the message.

### Setting its conditions — and the one case that breaks

**A Post Type condition is a perfectly good, supported choice.** Condition the template on `course`, on `event`, on whatever you are writing the offer for, and build a message that speaks to that type. Nothing about the feature discourages this.

**It is also normal to wrap the template's own content in a condition.** The suite already renders this template only for visitors who lack access, so an access condition inside it is belt-and-braces rather than the thing doing the gating — but it costs nothing, it makes the template's intent readable in the builder, and it is the right hook when you want *parts* of the offer to differ (a login link for logged-out visitors, an upgrade link for logged-in ones). Build it that way if you prefer.

**The one case that breaks** is narrow and worth knowing, because the symptom is a blank page rather than an error:

> Do not put a Post Type condition on a Restricted Content template for a post type whose pages are rendered by a **Single template** rather than by their own per-page Bricks data.

That is exactly the Course / Lesson / Event case in this suite, so in practice: **for this suite's own post types, condition on Entire website.** For an ordinary Page or a post you built directly in the Bricks builder, a Post Type condition is fine.

Why the difference. Both a Single template and a Restricted Content template live in Bricks' `body` bucket and compete for the one `content` slot. A Post Type condition scores 7 for each (`Database::screen_conditions()`), they tie, and `$found[ $score ] = $template_id` means whichever Bricks iterates last takes the slot — so this is order-dependent and can differ between sites, which is why it reads as intermittent. If the Restricted Content template takes the slot, `prevent_hijacking_content_slot()` resets it to the post ID. From there:

* The post **has its own Bricks data** (you built that page in the builder) → Bricks renders it, `render_content()` runs, `bricks/content/html_after_begin` fires, and the Restricted Content template renders too. Everything works.
* The post **has no Bricks data of its own** (a Single template was supposed to render it) → `get_bricks_data()` returns false, `single.php` falls through to plain `the_content()`, `render_content()` never runs, and the filter the Restricted Content template hangs off never fires. **Neither template renders.**

Conditioning on **Entire website** sidesteps it entirely: that scores 2, the Single template wins the slot at 7, and the Restricted Content template still renders through its own independent lookup. You lose nothing — the suite already limits rendering to tracked post types and to visitors without access, so the Post Type condition was never what targeted it.

If a site owner reports blank Course or Lesson pages and has a Restricted Content template conditioned on that post type, this is the cause. Change the condition to Entire website.

**Also: a Restricted Content template with no conditions at all never renders.** `find_matching_template()` skips any candidate whose `templateConditions` is empty. Set Entire website rather than leaving conditions blank.

If you need genuinely different offers per post type while staying on Entire website, either build one template and branch inside it, or build several and let each one's own elements decide. To branch on post type, note that **Bricks has no post-type element condition** — use the `dynamic_data` condition with the tag `{post_type}` and compare it to the slug (`course`, `lesson`, `event`).

---

## 5. Dynamic data you should be using

Look for these groups in the tag picker. Bind to them instead of writing anything into the template.

**Courses & Lessons** — work on Course, Module *and* Lesson templates, and inside a Query Loop over any of them:

`{course_id}` `{module_id}` `{module_title}` `{module_lesson_count}` `{course_progress_completed}` `{course_progress_total}` `{course_progress_percent}` `{module_progress_completed}` `{module_progress_percent}` `{module_is_complete}` `{lesson_is_complete}` `{next_lesson_id}` `{next_lesson_url}` `{next_lesson_title}` `{prev_lesson_id}` `{prev_lesson_url}` `{prev_lesson_title}` `{course_resume_url}` `{course_resume_id}` `{course_resume_title}` `{course_ungrouped_lesson_ids}` `{course_ungrouped_lesson_count}`

`{course_id}` and `{module_id}` both mean "the one in play here" — the course whether you are on a course, a lesson or a module; the module whether you are on a module or a lesson. That is what lets the same block move between templates unchanged. There is one tag per fact; if you are reaching for a second way to get something, you have the wrong tag.

**Content drip:** `{drip_is_available}` `{drip_unlocks_at}` `{drip_unlocks_in}` `{drip_lock_reason}` `{course_enrolled_at}` `{course_available_lesson_ids}`

**Events:** `{event_start}` `{event_end}` `{event_format}` `{event_location_url}` `{event_virtual_url}` `{event_capacity}` `{event_ticket_url}` `{event_attendee_count}` `{event_spots_remaining}` `{event_is_full}` `{event_waitlist_count}` `{event_user_status}` `{event_user_is_confirmed}` `{event_user_is_waitlisted}` `{event_user_waitlist_position}`

Inside an **Event Attendees** or **Event Waitlist** loop: `{attendee_name}` `{attendee_avatar}` `{attendee_status}` `{attendee_position}` `{attendee_date}` `{attendee_is_guest}` `{attendee_source}` `{attendee_user_id}`. `{attendee_source}` reads "RSVP" or "Ticket purchase" — everything is "RSVP" until paid ticketing ships. `{attendee_email}` and `{attendee_user_id}` both exist — do not put either on a public template.

**Content Locking:** `{bce_accessible_<post_type>_ids}`, one per tracked post type. Selectable in a Query Loop's **Include** field, which is how you build a "my courses" listing.

**Groups:** `{bce_group_id}` `{bce_group_name}` `{bce_group_description}` `{bce_group_visibility}` `{bce_group_role}` `{bce_group_member_count}` — each takes a group ID (`{bce_group_name:12}`) or, with none, means the group of the enclosing Groups / Group members / Group invitations loop. A private group's name resolves empty for anyone who is not a member, an invitee or a site administrator; that is deliberate, not a bug to work around. `{bce_my_group_ids}` `{bce_admin_group_ids}` `{bce_pending_invitation_group_ids}` `{bce_pending_invitation_count}` describe the viewer. Inside a **Group members** loop: `{bce_member_user_id}` `{bce_member_display_name}` `{bce_member_joined}` `{bce_member_role}` — there is no email tag, deliberately. Inside a **Group invitations** loop: `{bce_invitation_invitee}` `{bce_invitation_user_id}` `{bce_invitation_invited_by}` `{bce_invitation_date}`.

**Group Content:** `{bce_owner_group_id}` `{bce_owner_group_name}` for the current post; `{bce_group_post_ids:12}` (or `{bce_group_post_ids}` in a Groups loop) in a Posts loop's **Include** field lists a group's posts.

**Notifications:** `{bce_unread_notification_count}` works anywhere. The rest only resolve inside a **My Notifications** query loop: `{bce_notification_title}` `{bce_notification_message}` `{bce_notification_url}` `{bce_notification_date}` `{bce_notification_type}` `{bce_notification_is_unread}` `{bce_notification_object_id}` `{bce_notification_id}`.

---

## 6. Query loops instead of hand-built lists

**A course's lessons:** Query Loop, post type Lesson, **Post Parent** set to `{course_id}`. No Order By needed — a Lesson-only loop sorts itself into course position automatically, and keeps doing so after the course starts using modules.

**A course's modules:** Query Loop, post type Module, **Child of** `{post_id}`, Order By **Menu order**.

**A module's lessons:** inside the module loop, a Lesson loop with **Child of** `{module_id}`. Inside a module loop, `{module_id}` is the module being looped, so each module lists only its own lessons, in order. Do not use `{post_id}` or `{course_id}` here: those list every lesson in the course under every module.

**A course's lessons that are in no module:** a Lesson loop outside the module loop, **Include** `{course_ungrouped_lesson_ids}`, Order By **Post include order**. Hide the section when `{course_ungrouped_lesson_count}` is `0`.

**"My courses":** Query Loop over Course with **Include** set to `{bce_accessible_course_ids}`.

**A member's notifications:** Query type **My Notifications (Bricks Community)**. Always the current viewer's — there is no setting for showing anybody else's, deliberately.

**A group dashboard:** Query type **Groups (Bricks Community)** (source "Groups I admin" for the admin's dashboard, or "Public groups directory" for a follow page); nest **Group members (Bricks Community)** with Group ID `{bce_group_id}` for the member list — it shows rows only to that group's admins — and **Group invitations (Bricks Community)** for pending invites (no Group ID = the viewer's own). A group's posts: an ordinary Posts loop with **Include** `{bce_group_post_ids}`.

**Group admin actions are Bricks Form actions, not abilities.** Create / Update / Delete group, Manage group member (invite, remove, make admin, demote, cancel invitation), My group membership (accept, decline, leave), and Create / Update / Trash group post. Put the group ID in a hidden field set to `{bce_group_id}` and point the action's Group ID at `{{that_field}}`. Gate each form with the matching condition (`bce_is_group_admin`, `bce_can_manage_post`) — the action refuses the wrong person on the server anyway, but a form that always errors is a broken page. For Delete group, the form needs a text field where the person types the group's name.

Never enumerate lessons as static elements. The list changes when the site owner adds one.

---

## 6a. The notification bell is an element, not something you assemble

This family ships exactly one element for this, and this is it: **Notifications** (`bce-notifications`). Use it rather than building a bell out of a Div, a Dropdown and a query loop.

It exists because two things cannot be expressed in the builder: knowing the viewer's unread count, and marking a notification read when it is clicked. Everything you can *see* is an ordinary child element — insert the element and you get a bell, a panel and a notification row, all of which you restyle, replace or delete as normal.

**The panel inside it is Bricks' own Dropdown element.** There used to be a second element of ours, `bce-notifications-panel`; it is gone. Do not look for it, and do not try to recreate it — the Dropdown is what opens and closes the panel, keeps it inside the viewport, and renders the accessible toggle button, and it is styled from the Dropdown's own Content control group like any other dropdown on the site.

Four things worth knowing before you conclude something is broken:

* **The default child tree arrives already wired.** The row inside the panel is a Block with its query loop and its unread condition pre-set. Do not re-configure them.
* **The panel's own styling lives on the Dropdown, in its Content group** — background, min-width, border, shadow, typography, and the per-item controls that target the notification rows. Not on the wrapper.
* **Conditions do not evaluate on the Bricks canvas** — that is Bricks' own behaviour for every condition, not this element's. A read marker and an unread marker both render while editing. Check the live page.
* **Sample rows appear in the builder** when the person editing has no notifications, so there is something to style. They are not on the live site and they do not link anywhere.

The unread dot is the one thing the element draws itself, and it has its own controls (background, size, radius, offset, optional count). Everything else is yours.

---

## 7. Use the suite's abilities for structure, not raw post fields

A generic post-writing ability can usually set `parent` and `menu_order` directly. **Do not use it for course structure.** Those writes skip the cache flush and the actions that keep course shape and progress records consistent — harmless across separate requests, wrong within one, which is exactly the case you hit when you make several calls in a row.

| To do this | Call |
|---|---|
| See a course's shape before changing it | `bce/get-course-structure` |
| Put a lesson in a course / detach it | `bce/set-lesson-course` |
| Position a lesson | `bce/set-lesson-order` |
| Group a lesson under a module | `bce/set-lesson-module` |
| Reorder the modules themselves | `bce/set-module-order` |
| Read or replace drip rules | `bce/get-drip-rules` / `bce/set-drip-rules` |
| See or grant access to a post | `bce/list-post-access` / `bce/grant-post-access` |
| Groups and membership | `bce/list-groups`, `bce/create-group`, `bce/add-user-to-groups` |
| A group's members and roles | `bce/list-group-members`, `bce/set-group-member-role` |
| Which group owns a post | `bce/set-post-owner-group`, `bce/group-content-settings` |
| Any suite setting | `bce/get-settings` / `bce/update-settings` |

Always read before you write. `get-course-structure` returns current positions; `get-drip-rules` returns the rule types this site accepts, so you never have to guess a field name.

**A lesson's position means different things in different courses.** With no modules it is the position in the course. With modules it is the position *within its module*, and `bce/set-module-order` decides where that whole block sits. Read the structure first or you will produce a confident, wrong ordering.

**Drip rules decide what a paying learner can open.** A wrong rule locks people out and they notice before the site owner does. `bce/set-drip-rules` is all-or-nothing and returns a plain-English description of what it stored — read that back to the user before moving on.

---

## 8. Things that will catch you out

**Editors bypass drip entirely.** Your own view of a locked lesson is not what a learner sees. Verify locked states logged out or in a private window, or you will report a working paywall that shows everyone everything.

**A Restricted Content template conditioned on a post type blanks the page — but only for post types rendered by a Single template.** That is the Course / Lesson / Event case, so for this suite's types condition it on *Entire website*. See section 4 for the mechanism. If a site owner reports blank course or lesson pages and has a Restricted Content template, check this first; it is the most likely cause and the fix is one setting.

**An empty lesson body logged out is drip, not Content Locking.** Content Locking does not filter `the_content` at all. If content is disappearing, check drip rules first.

**Bricks' `postTypes` global setting gates the builder only.** It does not control whether a template renders for a post type. Adding a CPT there will not fix a rendering problem, and removing one will not cause it.

**Abilities can be switched off.** Everything in section 6 has an individual toggle at **Settings → Bricks Community → AI**, plus a master switch. If a call comes back saying the ability is switched off for this site, that is a deliberate choice by the site owner — report it, name the screen, and do not look for another route to the same write.

---

## 9. Before you say you are done

1. The lesson body is in the **post**, not in a Bricks element.
2. The template uses the **Post Content** element.
3. Both halves of the condition pair exist, and the locked panel says something useful when there is no date to show.
4. If content is locked rather than dripped, a **Restricted Content template** tells the visitor how to get in, its conditions are not left empty, and on this suite's own post types it is conditioned on **Entire website**.
5. That message names what they were trying to open and offers one clear next step.
6. Lists are **query loops**, not enumerated elements.
7. You viewed the page **logged out** — or in a private window — and the locked state actually locks *and* the offer actually shows.
8. Nothing in the template contains copy belonging to one specific lesson.

If you cannot verify item 7, say so plainly rather than reporting the build as finished.
