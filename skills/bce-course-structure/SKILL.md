---
name: bce-course-structure
description: "Use when changing a course's shape on a site running Bricks Community Courses: add a lesson to a course, move or detach a lesson, reorder lessons, group lessons into modules, ungroup a lesson, reorder modules, or read and set drip rules (unlock lessons in order, open after a delay, on a date, or when an event is recorded). Read with bce/get-course-structure first, then write with the bce/set-lesson-*, bce/set-module-order and bce/set-drip-rules abilities, never raw parent or menu_order."
---

# Bricks Community: course structure and drip

**Requires:** the Courses add-on. Call abilities through `mcp-adapter-execute-ability` with the slash name. `bce/get-drip-rules` lists the rule types this site accepts; trust it over this file.

## Never write raw post fields

Don't set `parent` or `menu_order` with a generic post ability. It skips the cache flush and actions that keep structure and progress consistent, which goes wrong within one session of several calls.

| To | Call |
|---|---|
| See the shape first (always) | `bce/get-course-structure` |
| Put a lesson in a course / detach it | `bce/set-lesson-course` |
| Position a lesson | `bce/set-lesson-order` |
| Put a lesson in a module / ungroup it | `bce/set-lesson-module` |
| Reorder modules | `bce/set-module-order` |
| Drip rules | `bce/get-drip-rules`, then `bce/set-drip-rules` |

Creating a Module or Lesson post itself is an ordinary post write. Then place it with the abilities above.

## Gotchas

- **A lesson's position is relative.** With no modules it's the position in the course; with modules it's the position **within its module**, and `bce/set-module-order` places the whole block. Read the structure first.
- A module must belong to the lesson's own course; a cross-course module is refused.
- Moving a lesson into another course needs edit rights on that course too.
- Draft or trashed modules don't count: their lessons read as ungrouped.
- Deleting a module never deletes its lessons.

## Drip

- `bce/set-drip-rules` **replaces** the post's rules, all or nothing. It returns a plain-English description of what it stored: read it back to the user.
- Completion rules take one `targetId` (lesson, module or course). `datetime` is site-local.
- Rules stack: a lesson opens only when its own, its module's and its course's rules are all met.
- "Unlock lessons in order" needs a way to complete lessons (a Mark lesson complete form or *mark complete on view*), or nothing ever opens.
- Event keys must match exactly; a typo never errors, it just never opens.
- A wrong rule locks paying learners out. Confirm with the user before writing.

Docs: https://grasshopperweb.agency/lessons/courses-drip-rules/
