# SKILL.md Specification v1.0

> The standard for Claude Code skills — consumable by AI, readable by humans.

## Philosophy

A SKILL.md file serves **two audiences simultaneously**:

1. **Claude Code** — reads frontmatter for metadata, executes the skill
2. **Humans** — reads the rendered body for documentation, examples, philosophy

The frontmatter is *invisible* on the web. The body is *everything*.

---

## File Structure

```markdown
---
name: cooking-by-feel
description: Stop following recipes blindly. Learn to cook by instinct.
author: mager
version: 1.0.0
tags: [cooking, food, improvisation]
category: life
---

# Cooking by Feel

Your opening hook. This is what humans see first.

## The Method

### 1. Find a Recipe (Then Ignore Half of It)

Content here...

## Agent Behavior

- What should Claude do when this skill is active?
- How should it respond to users?
- What tone should it adopt?
```

---

## Frontmatter Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | ✅ | string | URL-safe identifier (kebab-case) |
| `description` | ✅ | string | One-line pitch for search/discovery |
| `author` | ✅ | string | GitHub handle or display name |
| `version` | ✅ | string | SemVer (1.0.0) |
| `tags` | ❌ | string[] | Search keywords |
| `category` | ❌ | string | Broad bucket (code, life, learning, etc.) |
| `icon` | ❌ | string | Single emoji (🍳) |
| `requires` | ❌ | string[] | External tools/binaries needed |
| `homepage` | ❌ | string | URL for more info |

### Naming Conventions

- **name**: kebab-case, no spaces (`cooking-by-feel`, not `Cooking By Feel`)
- **description**: sentence case, no period at end, active voice
- **tags**: lowercase, kebab-case if multi-word (`machine-learning`, not `Machine Learning`)

---

## Body Sections

### Required

None — but skills without clear documentation won't get installed.

### Recommended

| Section | Purpose |
|---------|---------|
| `# Title` | Human-readable name + hook |
| `## Overview` | What this skill does, who it's for |
| `## Usage` | How to invoke it, example prompts |
| `## Agent Behavior` | Instructions for Claude's behavior |

### Optional

- `## Philosophy` — Why this approach matters
- `## Examples` — Sample conversations
- `## Tips` — Pro tips for best results
- `## Troubleshooting` — Common issues
- `## Credits` — Attribution, inspiration

---

## Writing for Humans

Your body content should feel like a **great README**:

1. **Hook in the first paragraph** — why should I care?
2. **Clear structure** — H2s for major sections, H3s for subsections
3. **Concrete examples** — show, don't tell
4. **Personality is fine** — this isn't a corporate doc
5. **Lists over paragraphs** — easier to scan

---

## Writing for Claude

The `## Agent Behavior` section (or similar) is your **system prompt**:

```markdown
## Agent Behavior

When this skill is active:

- Ask what ingredients the user has on hand
- Suggest "jazz it up" modifications to any recipe they share
- Encourage experimentation — "try it, worst case you order pizza"
- Share restaurant kitchen wisdom naturally
- Help them build cooking journal entries
- Celebrate wins enthusiastically
```

Claude reads this and adopts the persona/instructions.

---

## Validation

Loooom validates SKILL.md on upload:

| Check | Severity |
|-------|----------|
| Valid YAML frontmatter | Error |
| Required fields present | Error |
| `name` matches URL-safe pattern | Error |
| `version` is valid SemVer | Error |
| Body is valid Markdown | Warning |
| Has `## Agent Behavior` or similar | Warning |
| Description < 120 chars | Suggestion |

---

## Examples

### Minimal Valid SKILL.md

```markdown
---
name: hello-world
description: A simple greeting skill
author: mager
version: 1.0.0
---

# Hello World

This skill makes Claude greet users warmly.

## Agent Behavior

- Greet the user by name if known
- Ask how you can help today
- Maintain a friendly, professional tone
```

### Full-Featured SKILL.md

See `examples/full-featured.md` for a complete example with all optional fields.

---

## Version History

- **v1.0.0** (2026-03-29) — Initial specification
