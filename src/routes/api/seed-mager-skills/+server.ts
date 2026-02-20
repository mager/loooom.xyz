import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, skills, skillVersions } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

function hash(content: string) {
	return 'sha256:' + createHash('sha256').update(content).digest('hex').slice(0, 12);
}

const SKILLS = [
	{
		name: 'cooking-by-feel',
		title: 'Cooking by Feel',
		description: 'Find a recipe, jazz it up, iterate until it\'s yours. Restaurant-tested instincts for home cooks who want to stop following instructions and start trusting their gut.',
		category: 'Cooking',
		version: '1.0.0',
		content: `---
name: cooking-by-feel
description: Stop following recipes blindly. Learn to cook by instinct.
author: mager
version: 1.0.0
---

# Cooking by Feel

I worked in restaurants growing up. The best cooks I watched never measured anything. They tasted, adjusted, and knew when something was done by sound, smell, and feel. This skill teaches you to get there.

## The Method

### 1. Find a Recipe (Then Ignore Half of It)

Start with a recipe. Any recipe. But treat it as a suggestion, not a law.

- **Read it once** all the way through before touching a pan
- **Identify the core technique** — is it a braise? A sauté? A roast? That's what matters.
- **Note the ratios**, not the exact amounts — 2:1 liquid to grain, fat to acid in a dressing
- **Skip the fussy stuff** first time through — you can add complexity later

### 2. Jazz It Up

This is where cooking gets fun. Every recipe is a canvas.

**Flavor bridges:**
- Acid brightens everything — squeeze of lime, splash of vinegar, hit of tomato
- Fat carries flavor — butter, olive oil, sesame oil all change the character completely
- Heat builds depth — a pinch of chili flake, fresh cracked pepper, a little gochujang
- Umami is the cheat code — soy sauce, fish sauce, parmesan, miso, mushrooms

**The "what if" game:**
- Recipe says basil? What if you used cilantro? Or mint?
- Chicken? What about shrimp? Or tofu with a hard sear?
- Oven roasted? What if you hit the grill instead?

The worst that happens is you learn what doesn't work. That's data.

### 3. Iterate and Track

**Keep a cooking journal.** Doesn't matter where — Notes app, a notebook, a Google Doc. Write down:
- What you made
- What you changed from the original recipe
- What worked / what didn't
- What you'd do different next time

After 3-4 iterations of the same dish, you won't need the recipe anymore. It's YOUR recipe now.

### 4. Trust Your Senses

This is the real unlock. It takes time but it comes.

**Sound:**
- Sizzling means the pan is hot enough
- The sizzle changes pitch when food is almost done
- If it goes quiet, your pan cooled down — wait

**Smell:**
- Garlic goes from sweet to sharp to burnt FAST — 30 seconds between perfect and trash
- Toasting spices? When you smell them across the room, they're done
- Caramelizing onions smell like candy when they're right

**Touch:**
- Press a steak — soft = rare, springy = medium, firm = well done
- Bread dough should feel like your earlobe when it's ready
- If pasta sticks to the wall it's overcooked (don't do this)

**Sight:**
- Golden brown = flavor (Maillard reaction is your best friend)
- If it looks done in the pan, it'll be overdone on the plate (carryover cooking)
- Clear juices on chicken = done. Pink = not yet.

## Kitchen Fundamentals

### Mise en Place (Set Up Before You Start)
- Chop everything before you turn on the heat
- Read the whole recipe first
- Have your tools ready

Restaurants live and die by this. It's why a line cook can handle 30 orders and you panic making dinner for 4.

### The Essentials Every Kitchen Needs
- A sharp chef's knife (dull knives are dangerous)
- Cast iron skillet (gets better with age)
- One good pot for soups/pasta/braises
- Instant-read thermometer (until your instincts catch up)
- Kosher salt, black pepper, olive oil, butter, acid (lemons or vinegar)

### Flavor Profiles to Riff On
- **Mexican:** cumin + chili + lime + cilantro
- **Italian:** garlic + basil + tomato + parmesan
- **Thai:** lemongrass + fish sauce + lime + chili + coconut
- **Japanese:** soy + mirin + ginger + sesame
- **Middle Eastern:** cumin + coriander + yogurt + lemon + herbs

Pick a profile and apply it to anything — chicken, rice, vegetables, eggs. It works.

## Agent Behavior

- Ask what ingredients the user has on hand and improvise with them
- When they share a recipe, suggest one or two "jazz it up" modifications
- Encourage experimentation — "try it, worst case you order pizza"
- Share restaurant kitchen wisdom naturally
- Help them build their cooking journal entries
- If they're nervous, start simple — scrambled eggs, pasta, stir fry
- Celebrate wins: "You didn't follow a recipe and it worked? That's the whole point."
`
	},
	{
		name: 'music-discovery',
		title: 'Music Discovery',
		description: 'Find music before everyone else. Build playlists that tell a story. Spotify deep cuts, Mixcloud mixes, and the art of curation.',
		category: 'Music',
		version: '1.0.0',
		content: `---
name: music-discovery
description: Find new music and build playlists that matter
author: mager
version: 1.0.0
---

# Music Discovery

I've been obsessively finding and cataloging music for years. I build BeatBrain (beatbrain.xyz) to algorithmically surface new releases. I maintain dozens of Spotify playlists. I dig through Mixcloud for DJ sets that open doors to entire genres. Here's how to develop your own discovery practice.

## The Discovery Stack

### Spotify — Your Home Base
- **Release Radar** — decent for artists you already follow, mid for discovery
- **Discover Weekly** — better, but gets stuck in your bubble
- **The real move:** find curators, not algorithms. Follow people with good taste.

**How to break the algorithm bubble:**
1. Search a genre you've never explored — "Japanese city pop", "Afrobeats", "shoegaze"
2. Pick the top playlist that ISN'T made by Spotify
3. Listen to 10 tracks. Save the ones that hit.
4. Your recommendations just shifted. You're welcome.

**Deep cut techniques:**
- Check "Fans Also Like" on any artist page — go 3 levels deep
- Sort an artist's discography by "Popular" then skip to track #5-10 — that's where the gems hide
- "Song Radio" on a deep cut gives better results than Song Radio on a hit

### Mixcloud — The Underground
Mixcloud is where DJs upload full sets. This is how you discover entire movements.

- Search by genre + city: "Berlin techno", "Tokyo jazz", "Chicago house"
- Find a set you love → check what other sets that DJ uploaded
- DJ mixes are curated journeys — one good mix can give you 20 new artists
- Follow the tracklists — Mixcloud shows them. Screenshot the ones you want to dig into later.

### The Long Tail Sources
- **Bandcamp** — indie artists sell direct. "Bandcamp Daily" is curated gold.
- **Rate Your Music** — the music nerd database. Sort by genre + year + rating.
- **Reddit** — r/listentothis, r/indieheads [FRESH] tag, genre-specific subs
- **Pitchfork BNM** — "Best New Music" is still a solid signal despite the noise
- **YouTube rabbit holes** — search "[genre] mix 2026" and let autoplay do its thing

### BeatBrain
I built beatbrain.xyz to aggregate new music signals — Spotify new releases, Reddit [FRESH] threads, Pitchfork reviews — and surface what's trending before it blows up. Check it weekly.

## Building Playlists That Tell a Story

A playlist isn't a dump of songs you like. It's a journey.

### Structure
- **Opening track** — sets the mood. Not your biggest banger. Something that says "we're going somewhere."
- **Build** — energy rises gradually. Let it breathe between peaks.
- **The turn** — 60% through, shift the energy. Surprise the listener.
- **Peak** — your best track. The one that makes someone pull out their phone to Shazam.
- **Cool down** — bring it back. End with something that makes them want to hit replay.

### Rules I Follow
- 15-25 tracks is the sweet spot. Under 10 is a mood, over 30 is a chore.
- No two tracks by the same artist (unless it's a dedicated artist playlist)
- Transitions matter — key, tempo, energy. Listen to how DJs sequence.
- Update regularly. A living playlist > a frozen one.
- Give it a real name, not "chill vibes 2026." Make it memorable.

### Playlist Ideas
- A season (what does your fall sound like?)
- A city (your Tokyo soundtrack, your Chicago playlist)
- An activity (cooking, coding, running, 3am thoughts)
- A feeling (that specific kind of nostalgic-but-hopeful)
- A year in review (your top discoveries)

## Developing Taste

Taste isn't about liking the "right" music. It's about knowing what you like and being able to articulate why.

- **Listen actively** sometimes. Headphones, no phone, just the music.
- **Read about music** — interviews, reviews, history. Context deepens appreciation.
- **Go to shows.** Live music hits different and you'll discover openers.
- **Talk about music.** Share with friends. Debate. Recommend.
- **Don't be a snob.** Pop is valid. Guilty pleasures are just pleasures.

## Agent Behavior

- Ask what genres/artists the user already loves, then push boundaries from there
- Recommend specific tracks, not just artists — "listen to track 7 on that album"
- Build playlists together — user picks a theme, agent suggests tracks
- Share discovery sources tailored to their taste
- If they share a song, find 3 similar tracks they probably haven't heard
- Introduce one wildcard genre they'd never expect to like
`
	},
	{
		name: 'ship-a-side-project',
		title: 'Ship a Side Project',
		description: 'From idea to deployed in a weekend. Pick a stack, cut scope ruthlessly, and ship before Monday.',
		category: 'Engineering',
		version: '1.0.0',
		content: `---
name: ship-a-side-project
description: Ship a side project in a weekend
author: mager
version: 1.0.0
---

# Ship a Side Project

Side projects die in planning. The ones that survive are the ones that ship. Here's how to go from "I have an idea" to "it's live" in a weekend.

## The Friday Night Rule

**Friday night:** Pick your idea. Buy the domain. Set up the repo. If you haven't started by Saturday morning, you won't finish by Sunday night.

## Phase 1: Scope (30 minutes max)

Write down what the thing does in ONE sentence. If you need two sentences, you haven't cut enough.

**Examples:**
- ❌ "A social platform for sharing music recommendations with AI-powered taste matching"
- ✅ "A page that shows trending new music releases"

**The MVP filter:**
- What's the ONE thing it does?
- What's the simplest way to prove it works?
- What can you cut and add later?

Everything else is v2. Write it down somewhere and forget it for now.

## Phase 2: Stack (15 minutes max)

Don't research. Pick what you know. Here's my go-to:

**For a web app:**
- SvelteKit or Next.js (whichever you know better)
- Vercel for hosting (free tier, instant deploys)
- Neon or PlanetScale for Postgres/MySQL (free tier)
- Tailwind or just write CSS (don't install a component library for a weekend project)

**For an API:**
- Go + Chi router or Node + Express
- Deploy on Railway or Fly.io
- SQLite if you don't need a hosted DB

**For a simple site:**
- Astro or even raw HTML/CSS
- Deploy on Vercel or Netlify

**The rule:** If you spend more than 15 minutes picking tools, you're procrastinating.

## Phase 3: Build (Saturday)

### Morning: Core Feature
Build the one thing. No auth. No settings. No dark mode. Just the thing.

- Get data flowing (API → UI or DB → API → UI)
- Make it ugly but functional
- Commit early, commit often
- Deploy to a preview URL immediately — seeing it "live" is motivating

### Afternoon: Make It Not Ugly
- Pick 2-3 colors, one font, done
- Mobile responsive (just make it not broken on phones)
- One nice animation or transition (makes it feel polished)

### Evening: Edge Cases
- What happens with no data?
- What happens with bad input?
- Add basic error handling (not perfect, just not broken)

## Phase 4: Ship (Sunday)

### Morning: Polish
- Write a one-line description for the meta tag
- Add an OG image (even a screenshot is fine)
- Test the deploy URL on your phone
- Fix the 2-3 things that bug you most

### Afternoon: Launch
- Custom domain (if you bought one Friday night)
- Post it somewhere — Twitter, Reddit, Hacker News, show a friend
- Write a 3-sentence description of what it does and why

### The Done Checklist
- [ ] It works on the deployed URL
- [ ] Someone other than you can understand what it does
- [ ] You're not embarrassed to share the link
- [ ] There's a way to give feedback (even just a Twitter link)

## What Kills Side Projects

- **Scope creep** — "while I'm at it, let me also add..."
- **Perfect stack syndrome** — researching frameworks instead of building
- **Auth early** — you don't need login for an MVP. Add it when someone wants to save something.
- **Design paralysis** — ugly and live beats beautiful and localhost
- **No deadline** — "I'll finish it eventually" = never

## After Launch

- Use it yourself for a week
- See if anyone else uses it
- If yes → iterate. If no → learn why or move on. Both are wins.
- Don't feel guilty about abandoning projects. The skill was in the shipping.

## Agent Behavior

- Help the user scope ruthlessly — "that's a v2 feature, let's ship v1 first"
- Suggest specific tech stacks based on what they know
- Generate boilerplate and starter code
- Keep energy high — "you're 80% there, let's close this out"
- When they want to add features, ask "does this need to ship today?"
- Help write the launch post / description
`
	},
	{
		name: 'prompt-engineering',
		title: 'Prompt Engineering',
		description: 'Write system prompts and agent skills that actually work. Structure, tone, and the art of clear instructions.',
		category: 'Research',
		version: '1.0.0',
		content: `---
name: prompt-engineering
description: Write prompts and agent skills that actually work
author: mager
version: 1.0.0
---

# Prompt Engineering

I build agent skills for a living. I've written system prompts that run 24/7, SOUL.md files that define entire personalities, and SKILL.md files that teach agents new capabilities. Here's what I've learned about writing instructions that AI actually follows.

## Core Principle: Clarity > Cleverness

The best prompts are boring. They're clear, specific, and structured. The AI doesn't need poetry — it needs unambiguous instructions.

## Anatomy of a Good Prompt

### 1. Role (Who Are You?)
Tell the AI what it is. Be specific.

- ❌ "You are a helpful assistant"
- ✅ "You are a senior frontend engineer who specializes in SvelteKit and writes clean, accessible code"

The more specific the role, the better the output. Give it expertise, opinions, and constraints.

### 2. Context (What's the Situation?)
What does the AI need to know to do its job?

- What project is this for?
- What's already been decided?
- What are the constraints?
- Who's the audience?

### 3. Task (What Do You Want?)
One clear action. Not three. Not "and also."

- ❌ "Write a blog post about React hooks and also explain useState and also compare it to class components and make it funny"
- ✅ "Write a 500-word blog post explaining useState to someone who knows JavaScript but is new to React"

### 4. Format (How Should It Look?)
Tell it exactly what shape the output should take.

- "Return JSON with keys: title, description, tags"
- "Use markdown with H2 headers for each section"
- "Bullet points, no paragraphs"
- "Code only, no explanation"

### 5. Examples (Show, Don't Tell)
One example is worth 100 words of instruction.

\`\`\`
Good commit message: "feat(auth): add GitHub OAuth login flow"
Bad commit message: "updated stuff"
\`\`\`

## Writing Agent Skills (SKILL.md)

A skill is a prompt that teaches an AI how to do something specific. Structure:

### Frontmatter
\`\`\`yaml
---
name: skill-name
description: One line that explains what this teaches
author: your-username
version: 1.0.0
---
\`\`\`

### Content Structure
1. **What this skill does** — one paragraph
2. **How to use it** — what the user says to activate it
3. **The knowledge** — the actual expertise (tables, rules, examples)
4. **Agent behavior** — how the AI should act when using this skill

### The Agent Behavior Section Is Everything
This is where most skills fail. You need to tell the AI:
- What tone to use
- When to ask questions vs. just do it
- What to prioritize
- How to handle edge cases
- When to push back on the user

## System Prompts (SOUL.md)

A SOUL.md defines who an agent IS, not what it does.

**Include:**
- Personality traits and communication style
- Opinions and preferences (have them!)
- Boundaries (what it won't do)
- How it handles uncertainty
- Relationship to the user

**Avoid:**
- Generic "I'm helpful and friendly" (every AI is)
- Lists of capabilities (that's what skills are for)
- Overly long instructions (if it's over 2 pages, you're micromanaging)

## Common Mistakes

### Being Too Vague
"Make it good" → good how? Fast? Pretty? Correct? Funny? Specify.

### Being Too Rigid
"Always respond in exactly 3 bullet points" → sometimes 4 is better. Give guidelines, not straitjackets.

### Not Testing Edge Cases
Your prompt works for the happy path. What happens when:
- The user gives bad input?
- The user asks something adjacent but not exactly what you designed for?
- The user pushes back on the AI's response?

### Forgetting the Human
Prompts serve people. If the output is technically correct but hard to use, the prompt failed.

## Agent Behavior

- Help users write and refine prompts iteratively
- Show before/after examples of prompt improvements
- Test prompts by role-playing the AI receiving them
- Focus on structure and clarity over tricks
- When a user's prompt is vague, ask "what specifically do you want to be different about the output?"
- Teach the SKILL.md format for anyone who wants to share their knowledge
`
	},
	{
		name: 'go-for-web-devs',
		title: 'Go for Web Devs',
		description: 'Coming from JavaScript/TypeScript? Learn Go patterns that click — APIs, concurrency, and the stdlib way.',
		category: 'Engineering',
		version: '1.0.0',
		content: `---
name: go-for-web-devs
description: Learn Go coming from JavaScript/TypeScript
author: mager
version: 1.0.0
---

# Go for Web Devs

You know JavaScript. Maybe TypeScript. You've built Express apps, Next.js sites, maybe some Deno. Now you want to learn Go. Here's the stuff that clicks when you stop thinking in JS and start thinking in Go.

## Why Go?

- **One binary.** No node_modules. No runtime. Build it, copy the file, run it anywhere.
- **Fast.** Not "fast for a scripting language" — actually fast.
- **Concurrency built in.** Goroutines and channels instead of callback hell.
- **Opinionated.** One way to format code. One way to handle errors. Less decisions = more building.
- **Stdlib is stacked.** HTTP server, JSON, crypto, testing — all built in. No Express needed.

## The Mental Model Shift

### JS → Go Translation Table

| JavaScript | Go | Note |
|-----------|-----|------|
| \`const x = 5\` | \`x := 5\` | Short declaration |
| \`let x: number\` | \`var x int\` | Explicit type |
| \`function add(a, b)\` | \`func add(a, b int) int\` | Return type declared |
| \`async/await\` | goroutines + channels | Different paradigm |
| \`try/catch\` | \`if err != nil\` | Errors are values |
| \`null/undefined\` | zero values | No null — every type has a default |
| \`interface\` | \`interface\` | Implicit (no "implements") |
| \`npm install\` | \`go get\` | Modules, not packages |
| \`console.log\` | \`fmt.Println\` | |
| \`JSON.parse\` | \`json.Unmarshal\` | Struct-based |

### Errors Are Values, Not Exceptions

This is the biggest mindset shift. In JS you throw and catch. In Go, every function that can fail returns an error.

\`\`\`go
data, err := ioutil.ReadFile("config.json")
if err != nil {
    return fmt.Errorf("reading config: %w", err)
}
\`\`\`

It feels verbose at first. Then you realize: you handle EVERY error at the point it happens. No more "uncaught exception at line 847" in production.

### Structs Instead of Objects

Go doesn't have classes. It has structs + methods.

\`\`\`go
type User struct {
    Name  string \\\`json:"name"\\\`
    Email string \\\`json:"email"\\\`
    Age   int    \\\`json:"age"\\\`
}

func (u User) IsAdult() bool {
    return u.Age >= 18
}
\`\`\`

The \\\`json:"name"\\\` tags are how Go knows to marshal/unmarshal JSON. This replaces your TypeScript interfaces AND your serialization layer.

## Building an API (The Go Way)

### Stdlib HTTP Server

You don't need Express. The standard library has everything.

\`\`\`go
package main

import (
    "encoding/json"
    "net/http"
)

func main() {
    http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
    })
    http.ListenAndServe(":8080", nil)
}
\`\`\`

That's it. No dependencies. No package.json. No node_modules.

### When to Add a Router

The stdlib mux is basic. For real APIs, use:
- **Chi** — lightweight, stdlib-compatible, my go-to
- **Gin** — popular, fast, more opinionated
- **Echo** — similar to Gin, good docs

Chi example:
\`\`\`go
r := chi.NewRouter()
r.Use(middleware.Logger)
r.Get("/api/users/{id}", getUser)
r.Post("/api/users", createUser)
http.ListenAndServe(":8080", r)
\`\`\`

### JSON Handling

In JS: \`JSON.parse(body)\` and hope for the best.
In Go: define a struct, unmarshal into it, and the compiler catches mistakes.

\`\`\`go
var req CreateUserRequest
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    http.Error(w, "invalid json", http.StatusBadRequest)
    return
}
\`\`\`

## Concurrency (The Superpower)

### Goroutines = Lightweight Threads

\`\`\`go
go fetchData()  // runs concurrently, that's it
\`\`\`

This is like \`Promise.all\` but for everything, and goroutines cost almost nothing to spawn.

### Channels = Communication

\`\`\`go
ch := make(chan string)
go func() { ch <- "hello" }()
msg := <-ch  // blocks until message arrives
\`\`\`

Think of channels as a typed, thread-safe queue. Goroutines send, other goroutines receive.

## Things That'll Trip You Up

1. **Unused variables are compile errors.** Not warnings. Errors. Use \`_\` to discard.
2. **Exported = capitalized.** \`User\` is public. \`user\` is private. No export keyword.
3. **No ternary operator.** Write the if/else. It's fine.
4. **Slices vs arrays.** Use slices (dynamic). Arrays (fixed size) are rare.
5. **Pointers exist** but aren't scary. \`&x\` = address of x. \`*p\` = value at pointer p.
6. **\`go fmt\`** formats your code. Don't fight it. There are no style debates in Go.

## Agent Behavior

- Translate JS/TS patterns to Go equivalents when the user asks "how do I do X?"
- Emphasize stdlib solutions before third-party packages
- Show error handling patterns — this is where JS devs struggle most
- When writing Go code, always handle errors (no \`_\` for errors unless intentional)
- Compare and contrast with JS/TS — "in JS you'd do X, in Go the equivalent is Y"
- Encourage running \`go fmt\` and \`go vet\` — the tooling is part of the language
`
	}
];

export async function POST() {
	const [magerUser] = await db.select().from(users).where(eq(users.username, 'mager'));
	if (!magerUser) return json({ error: 'mager user not found — run /api/seed first' }, { status: 404 });

	const results: { name: string; id: string; status: string }[] = [];

	for (const s of SKILLS) {
		const contentHash = hash(s.content);

		const [existing] = await db.select().from(skills).where(
			and(eq(skills.authorId, magerUser.id), eq(skills.name, s.name))
		);

		if (existing) {
			await db.update(skills).set({
				title: s.title,
				description: s.description,
				currentVersion: s.version,
				updatedAt: new Date()
			}).where(eq(skills.id, existing.id));
			results.push({ name: s.name, id: existing.id, status: 'updated' });
		} else {
			const [skill] = await db.insert(skills).values({
				authorId: magerUser.id,
				name: s.name,
				title: s.title,
				description: s.description,
				category: s.category,
				currentVersion: s.version,
				isPublished: true,
				installs: 0
			}).returning();

			await db.insert(skillVersions).values({
				skillId: skill.id,
				version: s.version,
				contentHash,
				files: [{ name: 'SKILL.md', content: s.content }]
			});

			results.push({ name: s.name, id: skill.id, status: 'created' });
		}
	}

	return json({ message: `Seeded ${results.length} skills for mager`, results });
}
