---
name: bce-skills-update
description: "Use when the user asks to update, upgrade or check the version of the Bricks Community skills (the bce- skills), or when bce-skills-update-check reports BCE_SKILLS_UPDATE_AVAILABLE."
allowed-tools:
  - Bash
  - Read
---

# Bricks Community: update the skills

The skills are released at https://github.com/Dawson557/bricks-community-skills, versioned separately from the plugins. The latest release is always the right one.

1. Find the install:

```bash
BCE_DIR="$HOME/.bricks/skills/bricks-community-skills"
[ -d "$BCE_DIR/.git" ] && echo found || echo missing
```

   `missing`: the install is managed by the client. In Claude Code, tell the user to type `/plugin marketplace update bricks-community-skills`, then `/reload-plugins`. On claude.ai, download the new zips from the latest release and re-upload them. Stop.

2. Check:

```bash
git -C "$BCE_DIR" fetch -q --tags origin
OLD="$(git -C "$BCE_DIR" describe --tags 2>/dev/null)"
NEW="$(git -C "$BCE_DIR" describe --tags --abbrev=0 origin/main)"
echo "$OLD -> $NEW"
```

   - `fetch` failed: GitHub unreachable. Keep the current version; don't call it up to date.
   - `OLD` equals `NEW`: already current. Done.

3. Upgrade: `git -C "$BCE_DIR" checkout -q "$NEW"`. If git refuses because of local changes, stop and show the error; never discard them.

4. Link any new skills and refresh copied ones (`$HOME/.claude/skills` for Claude Code, `$HOME/.agents/skills` for Codex and others):

```bash
SKILLS_DIR="$HOME/.claude/skills"
export MSYS=winsymlinks:native
for skill in "$BCE_DIR"/skills/bce-*; do
  target="$SKILLS_DIR/$(basename "$skill")"
  if [ -L "$target" ] || [ ! -e "$target" ]; then ln -sfn "$skill" "$target"; fi
  [ -L "$target" ] || cp -R "$skill/." "$target/"
done
```

5. Summarise `CHANGELOG.md` between the two versions in 3–5 bullets, and tell the user to start a new chat.

Skills older than the site's plugin still work, but where they disagree with the site's `bce/start-here` ability, the ability wins.
