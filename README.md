# Bricks Community Skills

Agent skills for sites running the [Bricks Community](https://grasshopperweb.agency/) plugins: courses, modules and lessons, drip, content locking, events, groups and notifications, built with the Bricks theme.

The plugins expose abilities an AI client can call over MCP. These skills are the manual for them: where lesson content belongs, which loops and tags to bind to, which conditions keep locked content locked, and what fails silently on the page.

## Requirements

- Bricks 2.4 or newer, with its abilities switched on under **Bricks → AI**
- The MCP Adapter plugin, active
- Bricks Community (core) 0.12.1 or newer
- **The Bricks skills** from https://github.com/codeerhq/bricks-skills. These skills build on them and don't repeat them
- An MCP client that can load skills

The easiest route: in wp-admin go to **Bricks Community → Settings → AI**, copy the install prompt, and paste it into your AI client. It installs the Bricks skills too if they're missing.

## Install

### Claude Code, quick install

```txt
/plugin marketplace add Dawson557/bricks-community-skills
/plugin install bricks-community@bricks-community-skills
```

Update with `/plugin marketplace update bricks-community-skills`.

### Claude Code, release-managed install

```bash
git clone https://github.com/Dawson557/bricks-community-skills.git ~/.bricks/skills/bricks-community-skills
~/.bricks/skills/bricks-community-skills/scripts/bce-skills-upgrade
```

```txt
/plugin marketplace add ~/.bricks/skills/bricks-community-skills
/plugin install bricks-community@bricks-community-skills
```

The upgrade script pins the checkout to the latest GitHub Release. Run it again, or ask the agent to load `bce-skills-update`, to upgrade.

### Codex and other skill-compatible agents

```bash
git clone https://github.com/Dawson557/bricks-community-skills.git ~/.bricks/skills/bricks-community-skills
~/.bricks/skills/bricks-community-skills/scripts/bce-skills-upgrade

SKILLS_DIR="$HOME/.agents/skills"   # Codex only: "$HOME/.codex/skills"
mkdir -p "$SKILLS_DIR"
for skill in "$HOME"/.bricks/skills/bricks-community-skills/skills/bce-*; do
  ln -sfn "$skill" "$SKILLS_DIR/$(basename "$skill")"
done
```

The symlinks mean a later upgrade updates every skill without copying again. Start a new task afterwards.

### Cursor

Clone as above, then copy (or symlink) the `skills/bce-*` folders into `.cursor/skills/` in your project.

### Claude Desktop and claude.ai

These can't install from GitHub themselves. Download the zips from the [latest release](https://github.com/Dawson557/bricks-community-skills/releases/latest), one per skill, and upload each under **Settings → Capabilities → Skills**. Start with `bce-start-here`, `bce-frontend-build` and `bce-course-templates`.

If your client can't load skills at all, start each chat by asking it to call the site's `bce/start-here` ability. It returns the same guidance.

### Check it worked

Ask your client, in a new chat: *"Without calling any site abilities, list the loaded skills whose names start with bce- or bricks-."*

## Skills

| Skill | What it covers |
|---|---|
| **bce-start-here** | Routing, the one rule (content in posts, templates for looks), and the full build guide. Load first. |
| **bce-frontend-build** | HTML/CSS import, dynamic by default, verifying the frontend logged out. |
| **bce-course-templates** | Course, module and lesson templates, module → lesson loops, drip-locked lessons, progress and navigation. |
| **bce-course-structure** | Reordering lessons and modules and setting drip rules through the abilities. |
| **bce-content-locking** | Paywalls, access conditions and Restricted Content templates. |
| **bce-event-templates** | Event pages, RSVP forms and attendee loops. |
| **bce-group-surfaces** | Group pages, member dashboards, group admin forms and group-owned posts. |
| **bce-notifications** | The notification bell, notification loops and preferences. |
| **bce-skills-update** | Updating this package. |

## Versions

This package has its own version, separate from the plugins, and is released whenever the guidance improves. Always install the latest release: it supports every core version listed under Requirements. `bce-start-here` says which core version its guide was generated from.

Where a skill and the site disagree, the site's `bce/start-here` ability wins, because it always matches the installed plugin.

Releases are GitHub Releases tagged `v<version>`. Don't install from `main`.

## Releasing (maintainers)

1. Change the skills. `bce-start-here` is generated from the core plugin's `includes/AI/start-here.md`: run `php bin/sync-start-here` in the plugin, never edit it here.
2. Bump `VERSION` and `metadata.version` in `.claude-plugin/marketplace.json`, and rename `## Unreleased` in `CHANGELOG.md` to that version.
3. Commit, then run `scripts/release --dry-run`, then `scripts/release`. It tags, pushes, zips each skill and creates the GitHub Release.

## Issues

Report guidance that led an agent wrong at https://github.com/Dawson557/bricks-community-skills/issues. Say what you asked, what it built and what it should have built.

Pull requests are welcome: one skill per PR, focused on behaviour that's easy to get wrong.

## License

GPL-2.0-or-later. See [LICENSE](LICENSE).
