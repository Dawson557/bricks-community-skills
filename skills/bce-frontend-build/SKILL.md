---
name: bce-frontend-build
description: "Use before building, redesigning or restyling any front-facing Bricks surface on a site running the Bricks Community plugins: a page, section, hero, header, footer, archive, single template, course page, lesson template, event page, group page, member dashboard or component. Three defaults: author in HTML/CSS and import instead of hand-writing element JSON, bind to query loops and dynamic data instead of static content, and verify the rendered frontend logged in and logged out before reporting done. Applies to any request phrased as build, create, redesign, restyle, lay out, or make a page or template look better."
---

# Bricks Community: building front-facing pages

Left alone, Bricks builds come out plain, statically wired and unchecked. These three rules are the defaults. Departing from one needs a stated reason.

## 1. Author in HTML/CSS, then import

Don't hand-write element JSON for anything with real design in it. Write semantic HTML and CSS for the whole surface, then import it in one call:

```
bricks/commit-html-css-page-import({
  <page identifier>, html, css,
  documentPurpose: "page-content",   // "template-content" for header, footer and template interiors
  replaceExisting: false,
  idempotencyKey: <new stable key>
})
```

- Omit `<main>`; Bricks owns that landmark. Never put a site-wide `<header>` or `<footer>` inside a page import.
- Don't call version, status, discovery, repository or preview abilities first.
- Load `bricks-html-css-to-bricks` when the one-call importer is unavailable or the job needs warning review, components or CSS-only reconciliation.
- Small edits to an existing tree (one heading, one link, one setting) are still `update-element`. The rule is about building, not tweaking.
- Style with the site's tokens. Call `bricks/get-design-context` first unless you already know them this session. No hard-coded hex, px spacing or font sizes.

## 2. Dynamic by default: static content is a bug

For every block you place, ask: *would this be wrong on a different post of this type?* If yes, it's a query loop or a dynamic tag.

Never ship:
- lessons, modules, events or groups written as N literal blocks instead of one looped block;
- a title, excerpt or image typed in instead of `{post_title}`, `{post_excerpt}`, `{featured_image}`;
- counts ("12 lessons") typed as numbers;
- previous/next links pointing at a fixed URL;
- lesson or course copy in a Bricks element. It belongs in the post body (load `bce-course-templates`).

Loop mechanics: load `bricks-query-loops`. The two that break most builds:
1. The element with `hasLoop: true` **is** the repeating cell. Grid CSS goes on a non-looping parent.
2. Discover query types with `bricks/list-query-loop-types`. Don't invent provider keys.

Tags and scope: load `bricks-dynamic-data`, and confirm this site's tags with `bricks/list-dynamic-data-tags`. The suite's own loops and tags are in the matching `bce-` skill.

## 3. Verify the rendered frontend

A successful write means the JSON was accepted, not that the page looks right. Load `bricks-browser-verify`:

1. Resolve the public permalink and screenshot it.
2. Screenshot a narrow viewport too.
3. **View gated pages logged out as well.** Editors bypass drip and see every locked post, so your own view proves nothing about a learner's.
4. If a screenshot looks unchanged after a write, suspect a page cache before concluding the write failed.
5. Fix, then re-verify.

## Done means

- [ ] Built from HTML/CSS, not hand-written element JSON
- [ ] CSS uses the site's tokens
- [ ] Every CPT-sourced block is a loop or a tag; no post content typed into the template
- [ ] Loop elements are cells inside a non-looping parent
- [ ] Checked on the frontend at desktop and narrow widths
- [ ] Gated surfaces checked logged out
- [ ] The report says what was verified, not only what was written
