# Forest Soup House (湯湯屋魔法森林) — v1 Product Brief & UX Structure

A practical specification for a storybook-world website. No code—implementation-ready design and structure.

---

## 1. Product Brief

### Core promise of the website

**Forest Soup House is a place.** When you visit, you step into a small magical forest where soup is magic, ingredients have stories, and gentle adventures are about smell, taste, memory, and feeling. The site promises: *"You and your child can enter this world together, meet its friends, hear a story, discover a soup or a mission, and leave with something warm to do or remember—without being sold anything or rushed."*

### What should a child feel?

- **Welcomed:** "This place is for me; I belong here."
- **Curious:** "Who is that? What's that soup? Where does that path go?"
- **Safe:** Soft colors, no loud sounds, no timers or pressure.
- **Imaginative:** "I could make soup like Fina. I could go on that mission."
- **Seen:** Emotions and senses (smell, taste, memory) are named in a gentle way.

### What should a parent understand?

- **In 10 seconds:** "This is a gentle story world about soup, forest friends, and small adventures—for us to explore together."
- **In 1 minute:** "We can read a story, meet characters, look at soup and ingredient cards, and get simple missions or play ideas. It's not a shop; it's a place to visit."
- **Trust:** No ads, no upsell, no accounts required. Handcrafted, calm, and intentionally non-commercial.

### What makes this different from a normal children's activity site?

| Typical children's site              | Forest Soup House                          |
|-------------------------------------|--------------------------------------------|
| Many activities, low cohesion       | One coherent world with a clear "place"    |
| Commercial or subscription-first    | No commerce; experience-first              |
| Loud, busy, reward-driven           | Quiet, warm, curiosity-driven              |
| Generic characters and visuals      | Distinct characters and handcrafted tone   |
| "Do this activity" checklist        | "Enter the forest and discover" narrative  |
| Grown-up and child separated        | Designed for shared use (read-aloud, co-explore) |

**In one line:** It's a storybook you step into, not an activity hub or a store.

---

## 2. Primary User Journeys

### Journey 1: First-time visitor entering the forest

| | |
|---|---|
| **User goal** | To understand what this place is and choose a first step without feeling lost. |
| **Entry point** | Home (Forest Gate). |
| **Main steps** | 1) Land on Forest Gate. 2) Read short welcome line. 3) See 2–4 clear paths (e.g. Explore places / Meet characters / Read a story / Find a mission). 4) Choose one path. 5) Arrive at first destination (e.g. Characters list or a story). |
| **Emotional outcome** | "I know where I am. I know what I can do. I'm not overwhelmed." |

### Journey 2: Exploring characters

| | |
|---|---|
| **User goal** | To meet the forest friends and feel connected to the world. |
| **Entry point** | Home → "Meet the characters" or nav → Characters. |
| **Main steps** | 1) Land on Characters page. 2) See a small grid or list of character cards (image, name, one line). 3) Tap/click one (e.g. Fina). 4) Read character profile (who they are, their role, a short quote or moment). 5) Optionally see "Stories with Fina" or "Visit the Soup House" link. 6) Return to list or go to story/location. |
| **Emotional outcome** | "I know who lives here. I have a friend in this world." |

### Journey 3: Reading a story episode

| | |
|---|---|
| **User goal** | To share a short story together and feel the world's tone. |
| **Entry point** | Home → "Read a story" or from a character/location page. |
| **Main steps** | 1) Land on Stories list (or single story if v1 has one). 2) See story card(s): title, maybe an image, one-line description. 3) Open one story. 4) Read scrollable story (short chapters or one page). 5) Optional: gentle illustration or divider between sections. 6) End with a soft close (e.g. "Back to the forest" or "Find another story"). |
| **Emotional outcome** | "We shared a story. It felt warm and real." |

### Journey 4: Browsing soup cards and missions

| | |
|---|---|
| **User goal** | To discover a soup or a mission to try in real life. |
| **Entry point** | Home → "Find a soup" / "Get a mission" or nav → Soup Cards / Missions. |
| **Main steps** | **Soup cards:** 1) Land on Soup Cards page. 2) See cards (name, mood/theme, short line). 3) Open one. 4) Read what the soup is about, who it's from, maybe an ingredient or two. 5) Leave with an idea ("We could make something like this"). **Missions:** 1) Land on Missions page. 2) See 3–5 mission cards. 3) Read one (e.g. "Today: find something that smells like the forest"). 4) Use in real life. |
| **Emotional outcome** | "I have something to do or make—and it's connected to this world." |

---

## 3. Final v1 Sitemap

Minimum pages for launch. One URL = one page (no "tabs" that change content without navigation).

```
/                     → Home (Forest Gate)
/world                → World / Places (list of locations)
/world/[slug]         → Single location (e.g. /world/soup-house)
/characters           → Characters list
/characters/[slug]    → Single character (e.g. /characters/fina)
/stories              → Stories list
/stories/[slug]       → Single story episode
/soup-cards           → Soup cards list
/soup-cards/[slug]    → Single soup card (optional for v1: could be modal or same-page detail)
/missions             → Missions list (all missions on one page is OK for v1)
/about                → About (short: what this is, who made it)
```

**v1 page count:** 7 route types → ~10–12 actual pages (home, world index, 2–3 location pages, characters index, 1–2 character pages, stories index, 1 story, soup-cards index, missions, about).

**Optional simplification:** Omit `/world/[slug]` in v1 and make "World" a single scrollable page with each location as a section (anchor links). Then you have fewer routes and still deliver "explore places."

**Recommended v1 routes (minimal):**

- `/` — Home
- `/world` — Places (sections or cards; no separate location pages if you want to ship faster)
- `/characters` — List + link to Fina (and 1–2 others as cards on same page or `/characters/fina`)
- `/stories` — List + 1 story (e.g. `/stories/finas-first-soup`)
- `/soup-cards` — List (detail can be expand-on-page or a simple `/soup-cards/[slug]`)
- `/missions` — Single page listing all missions
- `/about` — Short about

---

## 4. Page-by-Page UX Outline

### Home / Forest Gate (`/`)

| | |
|---|---|
| **Purpose** | Be the single, calm entry into the world. Set tone and offer clear next steps. |
| **Main sections** | 1) **Hero:** Site title (Forest Soup House / 湯湯屋魔法森林), one short line ("A gentle story world where soup is magic"). 2) **Entry paths:** 2–4 cards or buttons: e.g. Explore the forest · Meet the characters · Read a story · Find a soup or mission. 3) **Optional:** One small atmospheric line or character cameo (e.g. "Fina is waiting by the Soup House"). |
| **Recommended CTA** | One primary: "Enter the forest" (scrolls to paths or goes to /world). Secondary: each path is a clear CTA. |
| **Content required** | Title, tagline, labels for each path, nav. |
| **Placeholder** | Character cameo can be text-only or a simple illustration later. |

---

### World / Places (`/world`)

| | |
|---|---|
| **Purpose** | Show the map of the world so the child feels "there are places to go." |
| **Main sections** | 1) **Page title:** "The Forest" or "Places in the forest." 2) **Intro line:** One sentence (e.g. "These are the places where our friends live and soup is made."). 3) **Location cards:** 2–3 for v1 (e.g. Forest Soup House, Whisper Shed, Soup Magic Lab). Each card: name, one-line description, optional small image. 4) Cards can link to anchor on same page or to `/world/[slug]` if you add it. |
| **Recommended CTA** | Each location card is tappable; "Visit the Soup House" etc. |
| **Content required** | 2–3 location names, one-line descriptions. |
| **Placeholder** | Images can be placeholder illustration or color block; copy can be short. |

---

### Characters (`/characters`)

| | |
|---|---|
| **Purpose** | Introduce the cast so the child can attach to someone (especially Fina). |
| **Main sections** | 1) **Page title:** "Forest friends" or "Who lives here." 2) **Short intro:** One line. 3) **Character cards:** Fina first (hero), then Poffy, Lilo, Sopo (or 2–3). Each: image, name, one line. 4) Click → character profile (same page expand or `/characters/[slug]`). |
| **Recommended CTA** | "Meet Fina" (primary), then "Meet Poffy," etc. |
| **Content required** | Fina: name, 2–3 sentences, optional quote. Others: name + one line each. |
| **Placeholder** | Other characters can be "Coming soon" or minimal; Fina must feel complete. |

---

### Character profile (`/characters/[slug]` e.g. `/characters/fina`)

| | |
|---|---|
| **Purpose** | One place where Fina (and later others) feel real and lovable. |
| **Main sections** | 1) **Hero:** Name, image. 2) **Who they are:** 2–4 sentences. 3) **Quote or moment:** One line in a "narration" style. 4) **Links:** "Stories with Fina," "Visit the Soup House" (optional). |
| **Recommended CTA** | "Read a story with Fina" or "Back to forest friends." |
| **Content required** | Bio, one quote. |
| **Placeholder** | "Stories with this character" can be a single link or omitted in v1. |

---

### Stories (`/stories`)

| | |
|---|---|
| **Purpose** | List available episodes so parent and child can pick one. |
| **Main sections** | 1) **Page title:** "Stories" or "Story time." 2) **Intro:** One line. 3) **Story cards:** Title, one-line description, optional thumb. 4) Click → story page. |
| **Recommended CTA** | Each card: "Read this story." |
| **Content required** | At least 1 story: title, 1–2 sentence description, body text. |
| **Placeholder** | Second story can be "Coming soon" card. |

---

### Story episode (`/stories/[slug]`)

| | |
|---|---|
| **Purpose** | Deliver one read-aloud story with emotional clarity. |
| **Main sections** | 1) **Title** (and optional story illustration). 2) **Story body:** Short sections with optional section dividers or narration blocks. 3) **End:** Soft closing line. 4) **Footer:** "Back to stories" or "Find another story." |
| **Recommended CTA** | "Back to stories" or "Explore the forest." |
| **Content required** | Full story text (500–1200 words is fine). |
| **Placeholder** | Illustration can be one hero image or none; dividers can be simple. |

---

### Soup cards (`/soup-cards`)

| | |
|---|---|
| **Purpose** | Let families browse soups and pick one to inspire real cooking or talk. |
| **Main sections** | 1) **Page title:** "Soup cards" or "Soups of the forest." 2) **Intro:** One line. 3) **Cards grid/list:** Each card: name, mood or theme, one line. 4) **Detail:** On click, expand in place or go to `/soup-cards/[slug]`. Detail: name, who it's from, short description, maybe 1–2 ingredients. |
| **Recommended CTA** | "See all soups" (if expanded); each card "Read about this soup." |
| **Content required** | 3–5 soups: name, mood, 1–2 sentence description, optional character, 1–2 ingredients. |
| **Placeholder** | Images optional; can use a single default soup illustration. |

---

### Missions (`/missions`)

| | |
|---|---|
| **Purpose** | Offer 3–5 simple prompts for real-world play or reflection. |
| **Main sections** | 1) **Page title:** "Missions" or "Little adventures." 2) **Intro:** One line (e.g. "Try one of these with your grown-up."). 3) **Mission cards:** Title + 1–2 sentence prompt. Optional: "From the Whisper Shed" or character. 4) No need for individual mission pages in v1. |
| **Recommended CTA** | Optional "Pick a random mission" (shows one card). Primary: read and use in real life. |
| **Content required** | 3–5 missions: title, prompt text. |
| **Placeholder** | Icons or illustrations optional. |

---

### About (`/about`)

| | |
|---|---|
| **Purpose** | Explain what this is and who made it; build trust. |
| **Main sections** | 1) **Title:** "About Forest Soup House." 2) **Short paragraph:** What the site is, who it's for, that it's not commercial. 3) **Optional:** One line about the creator, link to contact or nowhere. |
| **Recommended CTA** | "Back to the forest" (home). |
| **Content required** | 2–4 sentences about the project. |
| **Placeholder** | Creator credit can be "Made with care" or initials. |

---

## 5. Reusable Component System

Simple set of components. Use across pages for consistency and speed.

| Component | Purpose | Where used | Props / content |
|-----------|---------|------------|------------------|
| **SiteHeader** | Global nav and identity | Every page | `title` (optional override), `showNav` (boolean). Nav items: Home, World, Characters, Stories, Soup cards, Missions, About. |
| **SiteFooter** | Soft close, optional links | Every page | Optional: link to About, "Back to the forest." No heavy links. |
| **PageHero** | Page-level title and intro | World, Characters, Stories, Soup cards, Missions, About | `title`, `subtitle` (optional one line), optional `illustration` or none. |
| **LocationCard** | One place in the forest | World | `name`, `description` (one line), `slug` or `href`, optional `image`. |
| **CharacterCard** | Character in list view | Characters | `name`, `tagline` (one line), `slug`, `image` (optional). |
| **CharacterProfile** | Full character page content | Character profile page | `name`, `image`, `bio` (string or HTML), `quote` (optional), `links` (e.g. stories, location). |
| **StoryCard** | Story in list view | Stories | `title`, `description` (one line), `slug`, optional `image`. |
| **StoryBody** | Story episode content | Story page | `title`, `sections` (array of { title?, content }) or single `content`, optional `illustration`. |
| **SoupCard** | One soup in list or detail | Soup cards | `name`, `mood` or `theme`, `description`, optional `character`, `ingredients[]`, `image`. Use in list (compact) and detail (full). |
| **MissionCard** | One mission prompt | Missions | `title`, `prompt` (text), optional `character` or `source`. |
| **SectionDivider** | Visual breathing room | Stories, long pages | Optional `illustration` (e.g. leaf, steam). No props needed for a simple line or shape. |
| **NarrationBlock** | Quote or in-world voice | Stories, character profile | `text`, optional `character` (e.g. "— Fina"). Styled as a pull quote or speech. |
| **CTABanner** | Single clear next step | End of story, end of character, Missions | `label`, `href`, optional `secondary` link. |
| **EntryPathCard** | One "door" on home | Home | `title`, `description` (one line), `href`, optional `icon` or image. |

**Summary:** 14 components. Implement in order: SiteHeader, SiteFooter, PageHero → then LocationCard, CharacterCard, CharacterProfile, StoryCard, StoryBody → then SoupCard, MissionCard → then SectionDivider, NarrationBlock, CTABanner, EntryPathCard.

---

## 6. Content Model

Static-friendly. Use JSON or TS constants; no CMS. All slugs are URL-safe (e.g. `fina`, `soup-house`).

### Character

```ts
{
  slug: string;           // e.g. "fina"
  name: string;           // "Fina"
  tagline: string;        // One line for cards
  bio: string;            // 2–4 sentences for profile
  quote?: string;         // Optional in-world line
  image?: string;         // Path or URL
  links?: { label: string; href: string }[];  // e.g. "Stories with Fina"
}
```

### Location

```ts
{
  slug: string;           // e.g. "soup-house"
  name: string;           // "Forest Soup House"
  description: string;    // One line
  image?: string;
  // Optional later: characterIds[], storyIds[]
}
```

### Story

```ts
{
  slug: string;           // e.g. "finas-first-soup"
  title: string;
  description: string;    // One line for list
  characterSlugs?: string[];  // e.g. ["fina", "poffy"]
  sections: { title?: string; content: string }[];  // Or single content string
  image?: string;
}
```

### Soup card

```ts
{
  slug: string;           // e.g. "memory-soup"
  name: string;           // "Memory Soup"
  mood: string;           // e.g. "Remembering"
  description: string;    // 1–2 sentences
  characterSlug?: string; // Who it's from
  ingredients?: string[]; // 1–3 names
  image?: string;
}
```

### Mission

```ts
{
  id: string;             // e.g. "mission-1" (for key)
  title: string;         // "Find a forest smell"
  prompt: string;        // 1–2 sentences
  source?: string;       // e.g. "From the Whisper Shed"
}
```

**Where to keep:** `/data/` or `/lib/data/` (e.g. `characters.ts`, `locations.ts`, `stories.ts`, `soupCards.ts`, `missions.ts`) or as `.ts` files exporting arrays.

---

## 7. Visual & Interaction Guardrails

### Color mood

- **Primary:** Forest greens (muted, not neon), broth/amber, cream/off-white, soft browns. One accent (e.g. fox orange or herb purple) used sparingly.
- **Avoid:** Bright saturated primary blocks, pure black, harsh contrast. Prefer warm grays and soft shadows.
- **Rule:** If it could sit in a picture book, it's in range. If it feels like a dashboard or a commercial app, dial it back.

### Typography

- **Feeling:** Friendly, readable when read aloud. Slightly characterful (soft serif or rounded sans) but not silly or novelty.
- **Rule:** One heading font, one body font. Large enough for shared reading (e.g. body 18–20px on desktop). Good line height (1.5–1.6).

### Spacing and layout

- **Generous:** Plenty of whitespace. One main column for reading (e.g. max-width 640–720px for story body). Cards with padding; no cramming.
- **Grid:** Simple (e.g. 1 col mobile, 2–3 col for cards on larger screens). No complex asymmetric layouts for v1.

### Imagery style

- **Handcrafted:** Prefer illustration over stock photos. Textures (paper, cloth) OK. Slightly imperfect lines over slick vectors.
- **Calm:** No busy backgrounds behind text. Illustrations as accents or heroes, not wallpaper.
- **Rule:** Every image should feel part of the same world (palette, line weight, warmth).

### Hover / motion style

- **Subtle:** 200–350ms transitions; ease-out or ease-in-out. Use for: link underline, button background, card lift (tiny shadow).
- **No:** Auto-playing loops, parallax, bouncing, flashing. Prefer one small motion per intent.
- **Reduced motion:** Respect `prefers-reduced-motion` (e.g. disable or simplify transitions).

### Keeping it calm, warm, and handcrafted

- **One main idea per screen:** Don't stack multiple CTAs or competing sections.
- **Narrative over UI:** Use "Enter the forest," "Meet Fina," "Read this story" instead of "Home," "Characters," "Blog."
- **Soft edges:** Rounded corners, soft shadows, no sharp grids.
- **Quiet magic:** Sparkle or steam only as small accents; never dominant.
- **Copy:** Short sentences. Read every line aloud; if it sounds cold or corporate, rewrite.

---

## 8. Technical Recommendation

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS. No CMS, no API, no auth.

### Suggested routes (App Router)

```
app/
  page.tsx                 → Home
  layout.tsx                → Root layout (header, footer, font)
  world/
    page.tsx                → Places list
    [slug]/page.tsx         → Optional: single location
  characters/
    page.tsx                → Characters list
    [slug]/page.tsx         → Character profile
  stories/
    page.tsx                → Stories list
    [slug]/page.tsx         → Story episode
  soup-cards/
    page.tsx                → Soup cards list
    [slug]/page.tsx         → Optional: soup detail
  missions/
    page.tsx                → Missions (all on one page)
  about/
    page.tsx                → About
```

Use `generateStaticParams` for `[slug]` routes from data.

### Suggested folder structure

```
/
  app/                     # Routes and pages
    (optional) components/  # Page-specific bits if needed
  components/              # Reusable UI
    SiteHeader.tsx
    SiteFooter.tsx
    PageHero.tsx
    cards/
      LocationCard.tsx
      CharacterCard.tsx
      StoryCard.tsx
      SoupCard.tsx
      MissionCard.tsx
      EntryPathCard.tsx
    CharacterProfile.tsx
    StoryBody.tsx
    SectionDivider.tsx
    NarrationBlock.tsx
    CTABanner.tsx
  data/                    # Mock / static data
    characters.ts
    locations.ts
    stories.ts
    soupCards.ts
    missions.ts
  lib/                     # Helpers if needed
    getCharacterBySlug.ts
  public/
    images/
  styles/                  # Optional global CSS beyond Tailwind
```

### Where mock data lives

- **`/data/*.ts`** (or `.json`): One file per content type. Export arrays of typed objects. Import in page or layout as needed.
- **No env-based content** for v1; same data in dev and build.

### Hardcoded vs data-driven

| Hardcoded | Data-driven |
|-----------|-------------|
| Nav items (labels + paths) | Character list and profiles |
| Home entry path labels and hrefs | Location list (and location pages if you add them) |
| About page copy | Story list and story body |
| Site name, tagline | Soup cards list and content |
| Footer copy | Missions list |
| Layout structure, component behavior | Any "related" links (e.g. stories by character) can be derived from data |

### Build order (solo creator)

1. **Setup:** Next.js + TS + Tailwind, font, base colors in Tailwind config.
2. **Layout:** `app/layout.tsx` with SiteHeader and SiteFooter; global nav links (can point to `#` first).
3. **Data:** Add `/data` files with 1 character (Fina), 2 locations, 1 story, 3 soup cards, 3 missions.
4. **Home:** Page with PageHero + EntryPathCards linking to /world, /characters, /stories, /soup-cards, /missions.
5. **Characters:** List page using CharacterCard; Fina profile page using CharacterProfile.
6. **Stories:** List page with StoryCard; one story page with StoryBody, SectionDivider, NarrationBlock.
7. **World:** Single page with LocationCards (no [slug] required for v1).
8. **Soup cards:** List page with SoupCard; optional detail page or expand-in-place.
9. **Missions:** Single page with MissionCards.
10. **About:** Static content.
11. **Polish:** Typography, color tokens, hover states, one small motion (e.g. card hover). Check reduced motion.

Keep v1 small: 1 full character, 1 story, 2–3 locations, 3–5 soups, 3–5 missions. Add content and one or two components at a time after that.

---

**Document version:** v1  
**Use:** Implementation reference for Forest Soup House. No code in this doc—ready for Cursor when you start building.
