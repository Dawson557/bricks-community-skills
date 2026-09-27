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
_BCE_CHECK=""
for _CAND in "$HOME/.bricks/skills/bricks-community-skills/scripts/bce-skills-update-check" "$PWD/scripts/bce-skills-update-check" "$HOME/.claude/skills/bricks-community-skills/scripts/bce-skills-update-check" "$HOME/.codex/skills/bricks-community-skills/scripts/bce-skills-update-check"; do
  [ -f "$_CAND" ] && _BCE_CHECK="$_CAND" && break
done
echo "$_BCE_CHECK"
```

   No path found: the install is managed by the client. In Claude Code, tell the user to run `/plugin marketplace update bricks-community-skills`. On claude.ai, download the new zips from the latest release and re-upload them. Stop.

2. Check: `sh "$_BCE_CHECK" --force || true`
   - `BCE_SKILLS_UPDATE_CHECK_FAILED`: GitHub unreachable. Keep the current version; don't call it up to date.
   - No output: already current.

3. Upgrade: `sh "$(dirname "$_BCE_CHECK")/bce-skills-upgrade" "<tag>"` (omit the tag if none was reported).

| Output | Do |
|---|---|
| `BCE_SKILLS_UPDATED <old> <new> <tag>` | Summarise `CHANGELOG.md` between the versions in 3–5 bullets |
| `BCE_SKILLS_ALREADY_CURRENT` / `BCE_SKILLS_PINNED` | Done |
| `BCE_SKILLS_NOT_GIT_INSTALL` | Client-managed install: see step 1 |
| `BCE_SKILLS_NO_RELEASE_FOUND` / `BCE_SKILLS_RELEASE_CHECK_FAILED` | Keep the current version |
| `BCE_SKILLS_DOWNGRADE_REFUSED` | Stop. Never pass `--allow-downgrade` unless the user asks for that older version |
| `BCE_SKILLS_LOCAL_CHANGES_STASHED` | Tell the user: `git stash pop` in the skills folder restores them |
| `BCE_SKILLS_STASH_FAILED` / `BCE_SKILLS_WORKTREE_NOT_CLEAN` | Stop and show the git error |

4. Claude Code with a local marketplace: `/plugin marketplace update bricks-community-skills`, then `/reload-plugins`. Other clients: start a new chat.

Skills older than the site's plugin still work, but where they disagree with the site's `bce/start-here` ability, the ability wins.
