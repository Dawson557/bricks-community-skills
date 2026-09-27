---
name: bce-course-templates
description: "Use when building or fixing a course page, lesson template, module section, curriculum or course outline, course sidebar or docs sidebar, lesson navigation (previous/next), progress bar, continue or resume button, mark-complete button, or a drip-locked lesson on a site running Bricks Community Courses. Covers Course, Module and Lesson Single templates, the Post Content element, the bce_drip_available condition pair, course → module → lesson loops (a module's lessons = Lesson loop, Child of {module_id}), ungrouped lessons, and the progress, resume and navigation tags."
---

# Bricks Community: course templates

**Requires:** the Courses add-on. Confirm tags with `bricks/list-dynamic-data-tags` and conditions with `bce/list-display-conditions` on the live site; they win over this file. Loop and tag mechanics: `bricks-query-loops`, `bricks-dynamic-data`.

## Content goes in posts

A lesson's words go in a **Lesson post's body**, never in a Bricks element or a Bricks page. Build **one** Single template per type (Bricks → Templates, type Single, condition Post Type: Course / Lesson / Module). Nothing lesson-specific in it.

## The lesson body

- Render it with the native **Post Content** element. A Text element bound to `{post_content}`, a Code element, an embed or a custom-field video URL bypass drip and leak on locked lessons.
- Always two containers:
  - body: condition `bce_drip_available` `==` `1`
  - locked panel: condition `bce_drip_available` `==` `0`
- In the locked panel: `{drip_unlocks_in}`, `{drip_unlocks_at}`, `{drip_lock_reason}`. **Both date tags are empty when the gate is a completion,** so show "Opens {drip_unlocks_in}" only on `empty_not` and add a plain fallback line.
- Paywalls (no access at all) are a different system: load `bce-content-locking`.

## Loops

| List | Query loop |
|---|---|
| A course's lessons (flat) | Post type Lesson, **Child of** `{course_id}`. No Order By: it sorts into course order itself |
| A course's modules | Post type Module, **Child of** `{post_id}`, Order By **Menu order** |
| **A module's lessons** | Inside the module loop: post type Lesson, **Child of** `{module_id}`. Inside a module loop `{module_id}` is the module being looped |
| Lessons in no module | Outside the module loop: Lesson, **Include** `{course_ungrouped_lesson_ids}`, Order By **Post include order**. Hide when `{course_ungrouped_lesson_count}` is `0` |
| Open lessons only | Lesson, **Include** `{course_available_lesson_ids}`, Order By **Post include order** |
| "My courses" | Course, **Include** `{bce_accessible_course_ids}` |

Silent failures:
- **Child of `{course_id}` or `{post_id}` inside a module loop** lists every lesson of the course under every module.
- Child of `{course_id}` for the ungrouped section shows grouped lessons twice.
- Never enumerate lessons as static elements.
- Locked lessons stay in loops. Use the drip condition inside the loop for a padlock instead of a link.

`{course_id}` and `{module_id}` mean "the one in play": on a lesson, its course and its module. The same block works on Course, Module and Lesson templates.

## Navigation and progress

| Tag | Use |
|---|---|
| `{next_lesson_url}` `{next_lesson_title}` `{prev_lesson_url}` `{prev_lesson_title}` | Prev/next buttons. Empty on the first/last lesson: hide the button with an `empty_not` condition |
| `{course_resume_url}` `{course_resume_title}` | "Continue" button. Empty when the course has no published lessons |
| `{course_progress_percent}` `{course_progress_completed}` `{course_progress_total}` | Course progress |
| `{module_title}` `{module_lesson_count}` `{module_progress_percent}` `{module_is_complete}` | Module headers; on a lesson, its own module (breadcrumb) |
| `{lesson_is_complete}` | Checkmarks |

Conditions: `bce_lesson_complete`, `bce_module_complete`, `bce_course_complete`.

## Forms (Bricks Form actions)

- **Mark lesson complete**: on the Lesson template, no fields, action settings empty. Swap the button for a checkmark with `bce_lesson_complete`. Opening a lesson doesn't complete it.
- **Enroll in course** starts the drip clock. **Record course event** and **Unlock course content** exist too.
- When an action's ID comes from `{{field_id}}`, fill its "Restrict to…" setting or the submission is refused.

## Before you're done

- Lesson text is in the post; the template uses Post Content; both drip containers exist.
- Lists are loops; module lessons use Child of `{module_id}`.
- Viewed **logged out** or as a learner. Editors bypass drip.

Docs: https://grasshopperweb.agency/lessons/courses-module-loops/ · https://grasshopperweb.agency/lessons/courses-drip-lesson-templates/
