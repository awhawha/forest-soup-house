# Forest Soup House (湯湯屋魔法森林) — v1 Implementation Spec

A concrete, implementation-ready specification. Every section is fully written out so a frontend implementation (or AI) can follow it directly without guessing.

---

# 1. Product Brief

## Product vision

Forest Soup House is a small digital story-world where soup is magic, ingredients have stories, and gentle adventures are about smell, taste, memory, and feeling. The website is not an app, a store, or an activity hub—it is a **place** that a child and a grown-up can enter together. The vision is that every visit feels like stepping into a storybook: you meet the forest friends, hear a story, discover a soup or a mission, and leave with something warm to do or remember. The world has a fixed set of locations (the Soup House, the Whisper Shed, the Soup Magic Lab, etc.) and characters (Fina the fox, Poffy, Lilo, Tilly, Sopo, and forest friends). The tone is warm, gentle, playful, and imaginative—never loud, commercial, or overstimulating.

## Target audience

- **Primary:** Children aged 3–6 with a parent or caregiver present. The child is the emotional beneficiary; the adult is the primary navigator and reader. Use is shared: the adult reads and taps, the child looks, listens, and may choose (“Which character?” “Which story?”).
- **Secondary:** Parents, caregivers, and educators who want a calm, non-commercial, story-led experience they can trust and revisit with a child.
- **Design implication:** Every screen must work for shared use: large tap targets, copy that sounds good when read aloud, short segments, and no pressure (no timers, scores, or mandatory flows).

## Core promise

When you visit Forest Soup House, you and your child can enter a gentle story world together. You will meet its friends (like Fina the fox), hear a story, see soups and ingredients as cards with small stories, and get simple missions or play ideas to try in real life. You will not be sold anything, asked to sign up, or rushed. The site promises: *“This is a place. Come in, explore, and leave when you like—with something warm to remember or do.”*

## Design principles

1. **Place over product.** The site is a world with locations and characters, not a list of features. Navigation and copy should feel like moving through a forest, not through menu items.
2. **One clear idea per screen.** Each page has one primary purpose and one primary CTA. Avoid stacking multiple competing actions or sections.
3. **Read-aloud first.** All copy should sound natural when spoken. Short sentences, warm tone, no jargon or cold UI language.
4. **Calm and handcrafted.** Visuals and motion should feel soft, warm, and slightly imperfect—like a picture book. No bright saturated blocks, no auto-playing animation, no dashboard aesthetics.
5. **Shared experience.** Design for a grown-up and child together: clear back/home, no dead ends, and content that rewards curiosity without requiring the child to read.

## What success looks like for v1

- A first-time visitor lands on the Forest Gate, understands in under 10 seconds that this is a story world, and can choose one of four clear paths (Explore places, Meet characters, Read a story, Find a soup or mission) without feeling lost.
- A parent and child can complete at least one full journey: e.g. enter → meet Fina → read one story → end with a clear “back to the forest” or “find another story.”
- The site feels like a single coherent world: same header/footer, same visual language, same narrative labels (e.g. “Enter the forest” not “Home”). No broken links, no empty pages.
- At least one character (Fina) feels fully realized (profile with bio and quote); at least one story is complete and readable; soup cards and missions are browsable and each has enough content to be meaningful.
- The experience is emotionally satisfying on mobile and desktop: readable text, tappable cards, no horizontal scroll or overflow issues.

## What is explicitly out of scope for v1

- **Commerce.** No shop, no cart, no payments, no “buy” buttons.
- **Accounts and auth.** No sign-up, login, or saved progress.
- **CMS or backend.** All content is static (JSON/TS in the repo). No admin panel, no API.
- **Individual location pages.** World is one page with location cards/sections only. No `/world/[slug]` in v1.
- **Individual soup card pages.** Soup cards can be list-only with expand-in-place detail, or a single `/soup-cards/[slug]` if simple—but no complex soup detail UX.
- **Audio or video.** No embedded sound or video. Text and static images only.
- **Complex animation.** No parallax, no multi-step animations, no animation libraries beyond CSS transitions.
- **All characters fully profiled.** Only Fina has a full profile; others can be cards with name and tagline only.
- **Multiple languages.** Bilingual display (e.g. 湯湯屋魔法森林 + Forest Soup House) is optional; single language (English) is acceptable for v1.
- **Search, filters, or tags.** No search bar, no filter dropdowns. Simple lists only.

---

# 2. Primary User Journeys (Full Detail)

## Journey 1: First-time visitor entering the forest

**User goal**  
To understand what this place is and choose a first step without feeling lost or overwhelmed.

**Entry point**  
Home page (Forest Gate) at `/`. May arrive via direct URL or link from elsewhere.

**Steps**  
1. User lands on the Forest Gate. The first thing they see is the site title (Forest Soup House / 湯湯屋魔法森林) and a single short tagline (e.g. “A gentle story world where soup is magic”).  
2. They may scroll or look for what to do next. They see a small set of entry paths (2–4 cards or buttons), each with a clear label and optional one-line description: e.g. “Explore the forest,” “Meet the characters,” “Read a story,” “Find a soup or mission.”  
3. They choose one path by tapping or clicking. They are taken to the corresponding page: `/world`, `/characters`, `/stories`, or a combined path to `/soup-cards` or `/missions`.  
4. They arrive on that page and see a page title and intro line, then content (e.g. character cards or story cards). They have not had to make more than one decision to get there.  
5. Global header is visible so they can navigate elsewhere (World, Characters, Stories, Soup cards, Missions, About) without going back to home first.

**Content surfaced**  
- On home: site name, tagline, entry path cards (title + optional description + link). Optional: one atmospheric line (e.g. “Fina is waiting by the Soup House”).  
- After choosing a path: the destination page’s hero (title + subtitle) and main content (cards or list).

**Main CTA**  
“Enter the forest” (if it scrolls to paths) or the first entry path (e.g. “Explore the forest”) as the primary action. Each entry path is a CTA.

**Emotional outcome**  
“I know where I am. I know what I can do. I’m not overwhelmed.”

**UX considerations**  
- Do not show more than four entry paths. Prefer three or four clear options.  
- Use narrative labels (“Explore the forest,” “Meet the characters”) not generic ones (“Places,” “Characters”).  
- Ensure the tagline is visible without scrolling on common viewport sizes.  
- Header must be present and consistent so the user never feels trapped on one page.

---

## Journey 2: Exploring characters

**User goal**  
To meet the forest friends and feel connected to the world by learning who lives there, especially Fina.

**Entry point**  
Home → “Meet the characters” or header nav → “Characters” → `/characters`.

**Steps**  
1. User lands on the Characters page. They see a page title (e.g. “Forest friends” or “Who lives here”) and a short intro line (e.g. “These are the friends who live in the forest.”).  
2. They see a grid or list of character cards. Each card shows at least: character name, one-line tagline. Optionally: a small image. Fina should appear first or be visually emphasized.  
3. They tap or click one character (e.g. Fina). They go to that character’s profile page at `/characters/fina`.  
4. On the profile page they see: the character’s name, an optional image, a short bio (2–4 sentences), and an optional quote or in-world line in a narration block. Optionally: links such as “Read a story with Fina” or “Visit the Soup House.”  
5. They choose to go back to the character list (“Back to forest friends”) or follow a link to a story or the world.  
6. If they tapped another character that does not have a full profile yet, they can either see a minimal profile (name + tagline) or remain on the list with that character’s card expanding—per your v1 choice. Spec recommends at least Fina having a dedicated profile page; others can be cards only or minimal pages.

**Content surfaced**  
- Characters list: for each character, name, tagline, optional image, link to profile (or expand).  
- Character profile (Fina): name, image, bio (2–4 sentences), quote (one line), optional links (e.g. to a story, to /world).

**Main CTA**  
On list: “Meet Fina” (or the character name on each card). On profile: “Back to forest friends” or “Read a story with Fina.”

**Emotional outcome**  
“I know who lives here. I have a friend in this world.”

**UX considerations**  
- Fina must feel like the emotional center: first in the list and with a complete profile.  
- Character cards should be large enough for a child to point at; tap target at least 44px.  
- Profile page should feel like a single, scrollable story—not multiple tabs or sections that compete.  
- If only Fina has a profile, other character cards can link to a “Coming soon” or a minimal page so links are not broken.

---

## Journey 3: Reading a story episode

**User goal**  
To share a short story together and feel the world’s tone—warm, gentle, and story-driven.

**Entry point**  
Home → “Read a story” or header nav → “Stories” → `/stories`. Optionally from a character profile (“Read a story with Fina”) → `/stories` or direct to a story.

**Steps**  
1. User lands on the Stories page. They see a page title (e.g. “Stories” or “Story time”), an intro line, and one or more story cards. Each card shows: story title, one-line description, optional thumbnail.  
2. They tap or click a story. They go to the story episode page at `/stories/[slug]` (e.g. `/stories/finas-first-soup`).  
3. They see the story title at the top. Optionally a single hero illustration. Then the story body: either one continuous block or sections with optional section titles. Between sections, optional section dividers (e.g. a simple illustration or rule) for breathing room. Optional narration blocks (pull-quote style) for character voice.  
4. They read (or read aloud) the story. The page is scrollable; no pagination or “next chapter” required for v1 if the story is short.  
5. At the end they see a soft closing (e.g. a short “The end” or story closing line) and a CTA: “Back to stories” or “Explore the forest.”

**Content surfaced**  
- Stories list: story title, description (one line), optional image, link to story.  
- Story episode: title, optional hero image, story body (sections with optional titles and dividers), optional narration block(s), closing line, CTA.

**Main CTA**  
On list: “Read this story” (or the story title as the link). On story: “Back to stories” or “Explore the forest.”

**Emotional outcome**  
“We shared a story. It felt warm and real.”

**UX considerations**  
- Story body must be in a single column, max width ~640–720px, with comfortable line height (e.g. 1.5–1.6) and font size readable when read aloud (e.g. 18–20px body on desktop).  
- Avoid long unbroken blocks; use section dividers or short sections so the child can pause.  
- No auto-advance or timer. Reading pace is controlled by the user.  
- Back to stories and global nav must be available without scrolling past the end of the story (e.g. sticky header or visible footer).

---

## Journey 4: Browsing soup cards and missions

**User goal**  
To discover a soup or a mission to try in real life and feel that the world extends beyond the screen.

**Entry point**  
Home → “Find a soup or mission” or header nav → “Soup cards” (`/soup-cards`) or “Missions” (`/missions`).

**Soup cards sub-journey**  
1. User lands on Soup Cards page. They see a page title (e.g. “Soup cards” or “Soups of the forest”), an intro line, and a grid/list of soup cards.  
2. Each card shows: soup name, mood or theme (e.g. “Remembering”), and a short line. Optionally a small image.  
3. They tap a card. In v1 either: (a) the card expands in place to show full description, optional character, and 1–2 ingredients, or (b) they go to `/soup-cards/[slug]` and see the same content on a dedicated page.  
4. They read the soup’s description and optionally note ingredients or who it’s from.  
5. They return to the list (“Back to soup cards” or “See all soups”) or navigate elsewhere via header.

**Missions sub-journey**  
1. User lands on Missions page. They see a page title (e.g. “Missions” or “Little adventures”), an intro line (e.g. “Try one of these with your grown-up.”), and 3–5 mission cards.  
2. Each card shows: mission title and prompt (1–2 sentences). Optionally a source line (e.g. “From the Whisper Shed”).  
3. There is no separate mission detail page in v1. All content is on the one page. Optional: a “Pick a random mission” button that highlights or scrolls to one card.  
4. User reads one or more missions and uses them in real life. Primary action is reading and doing, not clicking through to another page.

**Content surfaced**  
- Soup cards: for each soup, name, mood, short description; on detail, full description, optional character, 1–2 ingredients.  
- Missions: for each mission, title, prompt, optional source. All on one page.

**Main CTA**  
Soup cards: each card “Read about this soup” or tap to expand/open detail. Missions: no primary CTA beyond reading; optional “Pick a random mission.”

**Emotional outcome**  
“I have something to do or make—and it’s connected to this world.”

**UX considerations**  
- Soup cards should feel like collectible cards—clear boundary, readable text, one soup per card.  
- Missions are for quick scanning; avoid long paragraphs. One mission per card.  
- If soup detail is in-place expand, ensure collapse and “back to list” are obvious.  
- Missions page does not need individual URLs per mission for v1.

---

# 3. Final v1 Sitemap (Single Recommendation)

**Recommendation:** Ship with the following routes only. No individual location pages, no optional branches—this is the final v1 set.

| Route | Purpose | Required for launch? |
|-------|---------|----------------------|
| `/` | Home (Forest Gate) | **Yes** |
| `/world` | World / Places — single page with location cards (or sections) | **Yes** |
| `/characters` | Characters list | **Yes** |
| `/characters/[slug]` | Character profile (at least `fina`) | **Yes** |
| `/stories` | Stories list | **Yes** |
| `/stories/[slug]` | Story episode (at least one story) | **Yes** |
| `/soup-cards` | Soup cards list | **Yes** |
| `/soup-cards/[slug]` | Single soup card detail | **Yes** (simple page; keeps URLs shareable and back-button friendly) |
| `/missions` | Missions — all missions on one page | **Yes** |
| `/about` | About the project | **Yes** |

**Pages required for launch**  
All of the above. So: Home, World (one page), Characters list, at least one Character profile (Fina), Stories list, at least one Story episode, Soup cards list, at least one Soup card detail page (so the pattern works), Missions (one page), About. Minimum content: 1 character profile, 1 story, 3 soups, 3 missions, 2–3 locations on World.

**Pages that wait until after v1**  
- `/world/[slug]` — individual location pages (e.g. “Forest Soup House,” “Whisper Shed”). In v1, World is one scrollable page; locations are cards or sections only.  
- Individual mission pages — not needed; all missions live on `/missions`.  
- Any “Ingredient cards” or “Herbal Patch” as separate sections — can be folded into Soup cards or World later.  
- Search, filters, tags, or collections — out of scope.

---

# 4. Full Page-by-Page UX Spec

## Home / Forest Gate (`/`)

**Page purpose**  
To be the single, calm entry into the world: set tone, establish that this is a story place, and offer exactly a few clear next steps so the user is not lost.

**Target user mindset**  
“What is this? What can I do here?” They should leave the page with a clear first action in mind.

**Sections (top to bottom)**  

1. **Header**  
   - Global site header: site name (Forest Soup House), optional 湯湯屋魔法森林. Nav: Home, World, Characters, Stories, Soup cards, Missions, About. Same on every page.

2. **Hero**  
   - Main title: “Forest Soup House” (and optionally “湯湯屋魔法森林” below or beside it).  
   - One short tagline: e.g. “A gentle story world where soup is magic.”  
   - No large hero image required for v1; keep the hero minimal so the next section is visible or one short scroll away.

3. **Entry paths**  
   - Section heading optional (e.g. “Where would you like to go?” or leave unheaded).  
   - Exactly four entry path cards, in this order:  
     - Explore the forest → `/world`  
     - Meet the characters → `/characters`  
     - Read a story → `/stories`  
     - Find a soup or mission → `/soup-cards` (or you may split into two cards: “Find a soup” → `/soup-cards`, “Get a mission” → `/missions`).  
   - Each card: title (required), optional one-line description, link. Same visual weight; no single “primary” button that dominates.

4. **Optional atmosphere**  
   - One short line of copy, e.g. “Fina is waiting by the Soup House.” No image required. Can be text-only.

5. **Footer**  
   - Site footer: optional link to About, “Back to the forest” (home). Minimal.

**Main CTA**  
The four entry path cards. The first tap/click is the main action.

**Secondary CTA**  
Header links to World, Characters, Stories, Soup cards, Missions, About. Footer “Back to the forest” when on other pages; on home it can be omitted or subtle.

**Required content**  
- Site name: “Forest Soup House.”  
- Tagline: one sentence (e.g. “A gentle story world where soup is magic.”).  
- Four entry path titles and hrefs. Optional: one-line description per path.  
- Nav labels and paths in header.

**Placeholder content allowed**  
- Optional atmosphere line can be placeholder or omitted.  
- 湯湯屋魔法森林 can be omitted for v1 if single language.  
- No hero image required; a soft background color or texture is enough.

**Notes for mobile layout**  
- Entry path cards: stack vertically; full width or two columns if space allows. Touch targets at least 44px high.  
- Tagline and title should wrap; avoid horizontal scroll.  
- Header can collapse to a hamburger if needed; ensure “Characters,” “Stories,” “Soup cards,” “Missions” remain easily tappable.

---

## World / Places (`/world`)

**Page purpose**  
To show that the forest has named places so the child feels “there are places to go.” No deep dive—just a map of the world in one page.

**Target user mindset**  
“What’s in this forest? Where can I go?” They should see 2–3 places and feel the world is coherent.

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Page hero**  
   - Title: “The Forest” or “Places in the forest.”  
   - Subtitle: one sentence, e.g. “These are the places where our friends live and soup is made.”

3. **Location list**  
   - 2–3 location cards (for v1). Each card: location name (e.g. “Forest Soup House,” “Whisper Shed,” “Soup Magic Lab”), one-line description, optional small image.  
   - Cards do not link to individual pages in v1; they can be non-clickable or link to anchor on same page (e.g. #soup-house) if you add a short paragraph per location. Alternatively, cards are display-only with no link until you add `/world/[slug]` later.

4. **Footer**  
   - Same as other pages.

**Main CTA**  
If location cards link to anchors: “Visit the Soup House” etc. If display-only: no primary CTA; secondary is header nav and “Back to the forest” in footer.

**Secondary CTA**  
Header nav, footer link to home or About.

**Required content**  
- Page title and one intro sentence.  
- 2–3 location names and one-line descriptions each.

**Placeholder content allowed**  
- Location images: placeholder color block or simple illustration.  
- Descriptions can be one sentence each.

**Notes for mobile layout**  
- Location cards stack vertically. Comfortable padding between cards.  
- Page hero title and subtitle: single column, no side-by-side layout required.

---

## Characters (`/characters`)

**Page purpose**  
To introduce the cast so the child can choose someone to meet (especially Fina) and feel the world has friends.

**Target user mindset**  
“Who lives here? I want to meet someone.”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Page hero**  
   - Title: “Forest friends” or “Who lives here.”  
   - Subtitle: one sentence, e.g. “These are the friends who live in the forest.”

3. **Character grid**  
   - Character cards in a grid or list. Order: Fina first, then others (e.g. Poffy, Lilo, Sopo). Each card: name, tagline (one line), optional image, link to `/characters/[slug]`.  
   - At least one character (Fina) must have a profile page. Others can link to a profile that only has name + tagline if you don’t want broken links.

4. **Footer**  
   - Same as other pages.

**Main CTA**  
Each character card links to that character’s profile. Primary: “Meet Fina” (or the first card).

**Secondary CTA**  
Header nav, footer.

**Required content**  
- Page title and one intro sentence.  
- For each character: name, tagline, slug. For Fina: also bio and quote for profile page.

**Placeholder content allowed**  
- Character images: placeholder or omitted.  
- Non-Fina characters: minimal profile (name + tagline) or “More coming soon” on profile.

**Notes for mobile layout**  
- Cards: 1 column on small screens, 2 columns when width allows. Tap target for each card at least 44px.  
- Keep card content minimal so the grid doesn’t feel crowded.

---

## Character Profile (`/characters/[slug]`)

**Page purpose**  
To make one character (Fina in v1) feel real and lovable: who they are, a quote, and a next step (e.g. read a story).

**Target user mindset**  
“Tell me about Fina. I like her.”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Character hero**  
   - Character name (e.g. “Fina”). Optional: one image (portrait or full-body). No need for a large decorative hero; keep it simple.

3. **Bio**  
   - 2–4 sentences describing who the character is and their role in the forest. Plain paragraph(s).

4. **Quote / narration block**  
   - One line in the character’s voice or about them, e.g. “Soup is best when you share it.” — Fina. Styled as a pull quote or narration block.

5. **Links (optional)**  
   - One or two links: e.g. “Read a story with Fina” → `/stories` or to a specific story, “Visit the Soup House” → `/world`. Not required for v1 if you have only one story.

6. **CTA**  
   - “Back to forest friends” → `/characters`.

7. **Footer**  
   - Same as other pages.

**Main CTA**  
“Back to forest friends” (to characters list).

**Secondary CTA**  
Optional “Read a story with Fina” (or similar). Header nav.

**Required content**  
- Character name, bio (2–4 sentences), at least one quote or narration line. Slug for URL.

**Placeholder content allowed**  
- Image optional.  
- “Stories with this character” link can be a single link to `/stories` or omitted.

**Notes for mobile layout**  
- Single column. Bio and quote readable without horizontal scroll.  
- CTA button full width or centered; easy to tap.

---

## Stories (`/stories`)

**Page purpose**  
To list available story episodes so the parent and child can pick one to read.

**Target user mindset**  
“We want to read a story. Which one?”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Page hero**  
   - Title: “Stories” or “Story time.”  
   - Subtitle: one sentence, e.g. “Stories from the forest.”

3. **Story list**  
   - Story cards. Each: title, one-line description, optional thumbnail, link to `/stories/[slug]`.  
   - v1: at least one story. Second story can be “Coming soon” (card with title only, no link or disabled).

4. **Footer**  
   - Same as other pages.

**Main CTA**  
Each story card links to the story. “Read this story” or the story title as the link.

**Secondary CTA**  
Header nav, footer.

**Required content**  
- Page title and one intro sentence.  
- At least one story: title, description (one line), slug, full body for story page.

**Placeholder content allowed**  
- Story images optional.  
- Second story: “Coming soon” card with no destination.

**Notes for mobile layout**  
- Story cards stack vertically. Full-width cards or 2 columns on larger screens.  
- Tap target for each card at least 44px.

---

## Story Episode (`/stories/[slug]`)

**Page purpose**  
To deliver one read-aloud story with emotional clarity and a clear end, then offer a way back or to another story.

**Target user mindset**  
“We’re reading this story together. When we’re done, we want to know what to do next.”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Story title**  
   - The story’s title (e.g. “Fina’s First Soup”). Optional: one hero image below the title.

3. **Story body**  
   - Content in sections. Each section: optional title, paragraph(s) of content. Between sections: optional SectionDivider (simple rule or small illustration). Optional NarrationBlock for character voice (e.g. “I wonder what’s in the pot,” said Fina.).  
   - Single column, max width ~640–720px, comfortable line height and font size.

4. **Story end**  
   - Short closing line (e.g. “The end.” or a story closing sentence). Then CTABanner: primary “Back to stories” → `/stories`, optional secondary “Explore the forest” → `/`.

5. **Footer**  
   - Same as other pages.

**Main CTA**  
“Back to stories” → `/stories`.

**Secondary CTA**  
“Explore the forest” → `/`. Header nav.

**Required content**  
- Story title, slug, and full body (sections or one block). At least one story in data.

**Placeholder content allowed**  
- Hero image optional.  
- Section dividers: simple rule or shape if no illustration.  
- Narration blocks: 0 or more.

**Notes for mobile layout**  
- Body text single column, no side margin overflow.  
- CTA visible after scroll (or sticky footer) so user doesn’t have to scroll back up to leave.

---

## Soup Cards (`/soup-cards`)

**Page purpose**  
To let families browse soups and pick one to read about (and optionally try in real life).

**Target user mindset**  
“What soups are there? Tell me about one.”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Page hero**  
   - Title: “Soup cards” or “Soups of the forest.”  
   - Subtitle: one sentence, e.g. “Soups that the forest friends love.”

3. **Soup grid**  
   - Soup cards. Each card (compact): name, mood (e.g. “Remembering”), one-line description, link to `/soup-cards/[slug]`. Optional small image.  
   - In v1 each card goes to a detail page so URLs are shareable and back button works.

4. **Footer**  
   - Same as other pages.

**Main CTA**  
Each card links to its soup detail page. “Read about this soup” or card tap.

**Secondary CTA**  
Header nav, footer.

**Required content**  
- Page title and one intro sentence.  
- 3–5 soups: name, mood, description (1–2 sentences), slug. For detail page: full description, optional character, 1–2 ingredients.

**Placeholder content allowed**  
- Soup images: placeholder or one default illustration for all.  
- Ingredients optional per soup.

**Notes for mobile layout**  
- Cards: 1 column on small screens, 2 columns when width allows.  
- Card content stays short so the list is scannable.

---

## Soup Card Detail (`/soup-cards/[slug]`)

**Page purpose**  
To show one soup’s full description, who it’s from, and optional ingredients so the family can talk about it or try it.

**Target user mindset**  
“Tell me more about this soup.”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Soup title**  
   - Soup name (e.g. “Memory Soup”). Optional image.

3. **Meta (optional)**  
   - Mood and/or “From Fina” (or character name). One line.

4. **Description**  
   - 1–2 sentences (or short paragraph) describing the soup and what it’s about.

5. **Ingredients (optional)**  
   - Bullet or comma list of 1–3 ingredients. Short.

6. **CTA**  
   - “Back to soup cards” → `/soup-cards`.

7. **Footer**  
   - Same as other pages.

**Main CTA**  
“Back to soup cards” → `/soup-cards`.

**Secondary CTA**  
Header nav.

**Required content**  
- Soup name, slug, description. At least 3 soups in data so the list and at least one detail page have content.

**Placeholder content allowed**  
- Image, mood, character, ingredients optional per soup.

**Notes for mobile layout**  
- Single column. CTA button easy to tap.

---

## Missions (`/missions`)

**Page purpose**  
To offer 3–5 simple prompts for real-world play or reflection, all on one page.

**Target user mindset**  
“What can we do? Give us an idea.”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Page hero**  
   - Title: “Missions” or “Little adventures.”  
   - Subtitle: one sentence, e.g. “Try one of these with your grown-up.”

3. **Optional: Pick a random mission**  
   - Button or link: “Pick a random mission.” On tap, scroll to a random mission card or highlight one. Not required for v1; can be added later.

4. **Mission list**  
   - 3–5 mission cards. Each card: title (e.g. “Find a forest smell”), prompt (1–2 sentences), optional source (e.g. “From the Whisper Shed”). No link to a separate page.

5. **Footer**  
   - Same as other pages.

**Main CTA**  
None required beyond reading. Optional: “Pick a random mission.”

**Secondary CTA**  
Header nav, footer “Back to the forest.”

**Required content**  
- Page title and one intro sentence.  
- 3–5 missions: title, prompt. Optional source per mission.

**Placeholder content allowed**  
- Source and any icon/illustration optional.

**Notes for mobile layout**  
- Mission cards stack vertically. One mission per card, clear separation.  
- Text size readable when read aloud.

---

## About (`/about`)

**Page purpose**  
To explain what Forest Soup House is and who made it, and to build trust (no commerce, no sign-up).

**Target user mindset**  
“What is this site? Can I trust it?”

**Sections (top to bottom)**  

1. **Header**  
   - Same as home.

2. **Page hero**  
   - Title: “About Forest Soup House.”

3. **Body**  
   - One short paragraph (2–4 sentences): what the site is (a gentle story world for children and grown-ups), who it’s for (families with young children), that it’s not commercial (no shop, no sign-up). Optional: one line about the creator (e.g. “Made with care by [name or initials]”). No contact required for v1.

4. **CTA**  
   - “Back to the forest” → `/`.

5. **Footer**  
   - Same as other pages.

**Main CTA**  
“Back to the forest” → `/`.

**Secondary CTA**  
Header nav.

**Required content**  
- Title “About Forest Soup House” and 2–4 sentences about the project.

**Placeholder content allowed**  
- Creator credit: “Made with care” or initials only.

**Notes for mobile layout**  
- Single column, readable paragraph width.

---

# 5. Reusable Component System (Practical Spec)

## SiteHeader

**Purpose**  
Global navigation and site identity. Appears on every page so the user can always go to World, Characters, Stories, Soup cards, Missions, or About without going back to home.

**Where it appears**  
Every page, at the top of the main content (or in the root layout above `children`).

**Required props**  
None if the nav is fixed. Optionally: `title?: string` to override the site name for the current page (e.g. for accessibility); default is “Forest Soup House.”

**Optional props**  
`showNav?: boolean` (default true). If false, hide the nav links (e.g. for a minimal story view). Not required for v1.

**Example content**  
- Logo/wordmark: “Forest Soup House” (and optionally 湯湯屋魔法森林).  
- Nav items: Home (`/`), World (`/world`), Characters (`/characters`), Stories (`/stories`), Soup cards (`/soup-cards`), Missions (`/missions`), About (`/about`).  
- Labels must match narrative tone: “World” not “Places” if that’s the chosen label; “Soup cards” not “Soups.”

**Design notes**  
- Compact height so it doesn’t dominate. On mobile, hamburger or horizontal scroll for links; ensure tap targets ≥44px.  
- Same background and border (if any) on all pages. No large logo image required; text is enough.  
- Current page can be indicated with subtle style (e.g. underline or aria-current), not a different color that feels like a dashboard.

---

## SiteFooter

**Purpose**  
Soft close to the page: optional link to About and a way to return to the “forest” (home).

**Where it appears**  
Every page, at the bottom of the main content (or in the root layout below `children`).

**Required props**  
None.

**Optional props**  
`showBackToForest?: boolean` (default true). If true, show a “Back to the forest” link to `/`.

**Example content**  
- Optional: “About” → `/about`.  
- “Back to the forest” → `/`.  
- No social links, no newsletter signup, no long link list for v1.

**Design notes**  
- Small text, low visual weight. Same on every page.  
- On story or long pages, footer appears after scroll; no need for sticky footer unless you want it.

---

## PageHero

**Purpose**  
Page-level title and optional subtitle for inner pages (World, Characters, Stories, Soup cards, Missions, About). Establishes context without a large hero image.

**Where it appears**  
`/world`, `/characters`, `/stories`, `/soup-cards`, `/missions`, `/about`. Not on home (home has its own hero).

**Required props**  
`title: string` — the page heading (e.g. “Forest friends,” “Stories,” “Soup cards”).

**Optional props**  
`subtitle?: string` — one line (e.g. “These are the friends who live in the forest.”).  
`illustration?: string` — image path or URL; not required for v1.

**Example content**  
- title: “Who lives here.”  
- subtitle: “These are the friends who live in the forest.”

**Design notes**  
- Single column. Title is the main heading (e.g. h1). Subtitle is one line below, smaller and softer.  
- No full-bleed background image required; a soft background color or texture is enough.  
- Ample margin below so the next section (cards/list) doesn’t feel cramped.

---

## LocationCard

**Purpose**  
To represent one place in the forest on the World page. In v1 locations do not have their own pages; the card is the representation.

**Where it appears**  
`/world`, in the location list section.

**Required props**  
`name: string` — location name (e.g. “Forest Soup House”).  
`description: string` — one line (e.g. “Where Fina and friends make soup.”).

**Optional props**  
`slug?: string` — for future use when you add `/world/[slug]`.  
`image?: string` — path or URL for a small image.  
`href?: string` — if you want the card to link (e.g. to an anchor on the same page). In v1 can be omitted.

**Example content**  
- name: “Forest Soup House.”  
- description: “Where Fina and friends make soup and tell stories.”

**Design notes**  
- Card: rounded corners, soft shadow or border, padding. One card per location.  
- If no link, card is display-only. If link, whole card or a clear “Visit” area is tappable (min 44px).  
- Image if present: small, not dominant; can be a placeholder rectangle with a tint.

---

## CharacterCard

**Purpose**  
To show one character in the Characters list with name and tagline and link to their profile.

**Where it appears**  
`/characters`, in the character grid.

**Required props**  
`name: string` — character name (e.g. “Fina”).  
`tagline: string` — one line (e.g. “Curious fox who loves soup.”).  
`slug: string` — for link to `/characters/[slug]`.

**Optional props**  
`image?: string` — path or URL. Omit for v1 if no assets.

**Example content**  
- name: “Fina.”  
- tagline: “Curious fox who loves soup and asks the best questions.”  
- slug: “fina.”

**Design notes**  
- Card: same style as LocationCard (rounded, padding, soft shadow).  
- Entire card is clickable to `/characters/[slug]`. Tap target ≥44px.  
- Fina can be slightly larger or first in order; avoid making other cards look disabled.

---

## CharacterProfile

**Purpose**  
To render the full character profile content on a character page: name, image, bio, quote, optional links. This is a content component, not the page layout.

**Where it appears**  
`/characters/[slug]` page, as the main content between header and footer.

**Required props**  
`name: string` — character name.  
`bio: string` — 2–4 sentences. Can be a single string or array of paragraphs; component should render as readable paragraphs.

**Optional props**  
`image?: string` — path or URL.  
`quote?: string` — one line (e.g. “Soup is best when you share it.”).  
`quoteAttribution?: string` — e.g. “— Fina.”  
`links?: { label: string; href: string }[]` — e.g. [{ label: “Read a story with Fina”, href: “/stories” }].

**Example content**  
- name: “Fina.”  
- bio: “Fina is a curious fox who lives in the forest. She loves to smell the herbs in the Soup House and ask Poffy what’s in the pot. When she’s not exploring, she likes to sit by the fire and listen to stories.”  
- quote: “Soup is best when you share it.”  
- quoteAttribution: “— Fina.”

**Design notes**  
- Quote: styled as a pull quote or blockquote (larger or italic, optional border-left).  
- Links: simple text links or buttons below the quote; not too many.  
- Image if present: moderate size, not full-bleed; can be rounded or with a soft frame.

---

## StoryCard

**Purpose**  
To show one story in the Stories list with title and description and link to the story page.

**Where it appears**  
`/stories`, in the story list.

**Required props**  
`title: string` — story title (e.g. “Fina’s First Soup”).  
`description: string` — one line for the list.  
`slug: string` — for link to `/stories/[slug]`.

**Optional props**  
`image?: string` — thumbnail or hero; not required for v1.

**Example content**  
- title: “Fina’s First Soup.”  
- description: “Fina learns what happens when you add a little bit of curiosity to the pot.”  
- slug: “finas-first-soup.”

**Design notes**  
- Same card style as others: rounded, padding, one card per story.  
- Whole card or clear “Read” area is tappable. Tap target ≥44px.  
- If you have a “Coming soon” story, render a card with no link or disabled state and optional “Coming soon” label.

---

## StoryBody

**Purpose**  
To render the story episode content: title, optional hero image, sections with optional titles and dividers, optional narration blocks, and a closing.

**Where it appears**  
`/stories/[slug]` page, as the main content.

**Required props**  
`title: string` — story title.  
`content` — either `sections: { title?: string; content: string }[]` or a single `content: string`. If sections, render each with optional heading and SectionDivider between. If single string, render as one or more paragraphs.

**Optional props**  
`heroImage?: string` — path or URL.  
`narrationBlocks?: { text: string; attribution?: string }[]` — for pull quotes or character voice. Place them where they appear in the content (e.g. passed as part of sections or as a separate structure that the component interleaves). Simplest: pass sections with a special “narration” type or render NarrationBlock components between sections in the page.

**Example content**  
- title: “Fina’s First Soup.”  
- sections: [{ content: “It was a quiet morning in the forest…” }, { title: “The pot”, content: “Fina saw steam rising from the pot.” }, { content: “…” }].  
- narrationBlocks: [{ text: “I wonder what’s in there,” said Fina., attribution: “” }].

**Design notes**  
- Max width for body text ~640–720px, centered or left-aligned. Line height 1.5–1.6, font size readable when read aloud (e.g. 18–20px).  
- SectionDivider between sections: simple horizontal rule or small decorative element (e.g. leaf).  
- NarrationBlock: distinct from body (e.g. italic, larger, or blockquote style).  
- No pagination; one scrollable page.

---

## SoupCard

**Purpose**  
To show one soup in list view (compact) or in detail view (full). Use the same component with a `variant` or different props for list vs detail, or use two variants: SoupCardCompact (list) and SoupCardDetail (detail page).

**Where it appears**  
List: `/soup-cards`. Detail: `/soup-cards/[slug]` (or use a separate detail layout that uses name, description, ingredients, etc.).

**Required props (list)**  
`name: string`, `mood: string`, `description: string` (one line for list), `slug: string`.

**Optional props (list)**  
`image?: string`.  
For detail: `description` (full 1–2 sentences), `characterSlug?: string` or `characterName?: string`, `ingredients?: string[]`.

**Example content (list)**  
- name: “Memory Soup.”  
- mood: “Remembering.”  
- description: “A soup for when you want to remember someone warm.”  
- slug: “memory-soup.”

**Example content (detail)**  
- Same plus: characterName: “Fina,” ingredients: [“a pinch of thyme”, “one quiet moment”].

**Design notes**  
- List card: same style as other cards; whole card links to `/soup-cards/[slug]`.  
- Detail view: title (name), optional mood/character line, paragraph for description, optional bullet list for ingredients. No need for a second “card” frame on the detail page; use a simple article layout.  
- If you prefer one component, pass `variant: 'list' | 'detail'` and optional props for detail (character, ingredients).

---

## MissionCard

**Purpose**  
To display one mission: title and prompt. No link to another page in v1.

**Where it appears**  
`/missions`, in the mission list.

**Required props**  
`title: string` — e.g. “Find a forest smell.”  
`prompt: string` — 1–2 sentences (e.g. “With your grown-up, find something outside that smells like the forest. Tell each other what it reminds you of.”).

**Optional props**  
`source?: string` — e.g. “From the Whisper Shed.”  
`id?: string` — for “Pick a random mission” scroll target or key.

**Example content**  
- title: “Find a forest smell.”  
- prompt: “With your grown-up, find something outside that smells like the forest. Tell each other what it reminds you of.”  
- source: “From the Whisper Shed.”

**Design notes**  
- Card style: rounded, padding, one mission per card.  
- Title is prominent; prompt is body text below. Source if present: small, secondary text (e.g. below the prompt).  
- No button or link on the card unless you add “Pick a random mission” (then one card can be highlighted or scrolled into view).

---

## SectionDivider

**Purpose**  
Visual breathing room between story sections (or between long blocks on any page). Avoids a wall of text.

**Where it appears**  
Inside StoryBody between sections. Optionally between major sections on other pages.

**Required props**  
None.

**Optional props**  
`illustration?: string` — image path for a small decorative element (e.g. leaf, steam). For v1 a simple rule or shape is enough.

**Example content**  
- No content. Renders a horizontal rule or a small centered shape (e.g. a leaf SVG or circle).  
- If illustration: small, not full width; subtle.

**Design notes**  
- Minimal: 1–2px rule, muted color, margin above and below.  
- No large illustration that distracts from the story.

---

## NarrationBlock

**Purpose**  
To show a character quote or in-world voice (e.g. in a story or on a character profile) so it feels like someone speaking.

**Where it appears**  
Story episode (StoryBody), character profile (CharacterProfile).

**Required props**  
`text: string` — the quote or line (e.g. “I wonder what’s in the pot,” said Fina.).

**Optional props**  
`attribution?: string` — e.g. “— Fina.” If the quote already includes “said Fina,” attribution can be omitted.

**Example content**  
- text: “Soup is best when you share it.”  
- attribution: “— Fina.”

**Design notes**  
- Styled as blockquote: larger or italic, optional left border or indent, optional quotation marks.  
- Attribution if present: smaller, after the quote.  
- One block per quote; don’t stack multiple in a row without spacing.

---

## CTABanner

**Purpose**  
To offer one clear next step at the end of a story or section (e.g. “Back to stories,” “Explore the forest”).

**Where it appears**  
End of story episode, end of character profile, optionally end of Missions or Soup card detail.

**Required props**  
`label: string` — button/link text (e.g. “Back to stories”).  
`href: string` — destination (e.g. “/stories”).

**Optional props**  
`secondary?: { label: string; href: string }` — e.g. { label: “Explore the forest”, href: “/” }.

**Example content**  
- label: “Back to stories.”  
- href: “/stories.”  
- secondary: { label: “Explore the forest”, href: “/” }.

**Design notes**  
- Primary CTA: button or button-style link; one primary action.  
- Secondary: text link or smaller button; don’t compete with primary.  
- Ample margin above so it’s clearly the “end” of the content.

---

## EntryPathCard

**Purpose**  
To represent one “door” on the home page: a path the user can take (Explore the forest, Meet the characters, etc.).

**Where it appears**  
Home (`/`), in the entry paths section.

**Required props**  
`title: string` — e.g. “Explore the forest.”  
`href: string` — e.g. “/world”.

**Optional props**  
`description?: string` — one line (e.g. “Visit the Soup House and other places.”).  
`icon?: string` or `image?: string` — not required for v1.

**Example content**  
- title: “Meet the characters.”  
- href: “/characters.”  
- description: “Say hello to Fina and her forest friends.”

**Design notes**  
- Card: same family as other cards (rounded, padding). Whole card is tappable.  
- Title is the main text; description if present is smaller below.  
- Four cards on home; same visual weight so no single “primary” dominates.  
- Tap target ≥44px.

---

# 6. Content Model (Full TypeScript + Examples)

## Character

```ts
export interface Character {
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  quote?: string;
  quoteAttribution?: string;
  image?: string;
  links?: { label: string; href: string }[];
}

export const characters: Character[] = [
  {
    slug: "fina",
    name: "Fina",
    tagline: "Curious fox who loves soup and asks the best questions.",
    bio: "Fina is a curious fox who lives in the forest. She loves to smell the herbs in the Soup House and ask Poffy what's in the pot. When she's not exploring, she likes to sit by the fire and listen to stories.",
    quote: "Soup is best when you share it.",
    quoteAttribution: "— Fina",
    image: "/images/characters/fina.png",
    links: [
      { label: "Read a story with Fina", href: "/stories" },
      { label: "Visit the Soup House", href: "/world" },
    ],
  },
  {
    slug: "poffy",
    name: "Poffy",
    tagline: "Magical helper who stirs the pot and keeps everyone warm.",
    bio: "",
    image: "/images/characters/poffy.png",
  },
];
```

## Location

```ts
export interface Location {
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export const locations: Location[] = [
  {
    slug: "soup-house",
    name: "Forest Soup House",
    description: "Where Fina and friends make soup and tell stories.",
    image: "/images/places/soup-house.png",
  },
  {
    slug: "whisper-shed",
    name: "Whisper Shed",
    description: "The forest post office where missions and secrets are kept.",
    image: "/images/places/whisper-shed.png",
  },
  {
    slug: "soup-magic-lab",
    name: "Soup Magic Lab",
    description: "Where Lilo experiments with ingredients and gentle magic.",
    image: "/images/places/soup-magic-lab.png",
  },
];
```

## Story

```ts
export interface StorySection {
  title?: string;
  content: string;
}

export interface Story {
  slug: string;
  title: string;
  description: string;
  characterSlugs?: string[];
  sections: StorySection[];
  image?: string;
}

export const stories: Story[] = [
  {
    slug: "finas-first-soup",
    title: "Fina's First Soup",
    description: "Fina learns what happens when you add a little bit of curiosity to the pot.",
    characterSlugs: ["fina", "poffy"],
    image: "/images/stories/finas-first-soup.png",
    sections: [
      {
        content:
          "It was a quiet morning in the forest. Fina had woken up early and tiptoed to the Soup House. She could already smell something warm in the air.",
      },
      {
        title: "The pot",
        content:
          "Poffy was stirring a big pot. \"Good morning, Fina,\" said Poffy. \"Would you like to help?\" Fina nodded. She stood on her tiptoes and looked into the pot. \"What's in there?\" she asked. \"A little bit of this,\" said Poffy, \"and a little bit of that. And one secret ingredient.\" \"What's the secret?\" asked Fina. Poffy smiled. \"You.\"",
      },
      {
        content:
          "Fina felt something warm in her chest. She helped stir the soup. When it was ready, they sat down together and shared it. And Fina decided that soup was her favorite thing in the whole forest.",
      },
    ],
  },
];
```

## SoupCard

```ts
export interface SoupCard {
  slug: string;
  name: string;
  mood: string;
  description: string;
  characterSlug?: string;
  ingredients?: string[];
  image?: string;
}

export const soupCards: SoupCard[] = [
  {
    slug: "memory-soup",
    name: "Memory Soup",
    mood: "Remembering",
    description:
      "A gentle soup for when you want to remember someone warm. Fina makes it when she misses a friend.",
    characterSlug: "fina",
    ingredients: ["a pinch of thyme", "one quiet moment", "something that reminds you of them"],
    image: "/images/soups/memory-soup.png",
  },
  {
    slug: "morning-light-soup",
    name: "Morning Light Soup",
    mood: "Starting the day",
    description:
      "What Poffy stirs when the forest is still sleepy. It tastes like the first light through the trees.",
    characterSlug: "poffy",
    ingredients: ["sunlight", "quiet", "a little honey"],
    image: "/images/soups/morning-light.png",
  },
  {
    slug: "curiosity-soup",
    name: "Curiosity Soup",
    mood: "Wondering",
    description:
      "For when you have too many questions. Lilo says the best ingredient is asking \"What if?\"",
    characterSlug: "lilo",
    ingredients: ["one question", "a handful of wonder", "patience"],
    image: "/images/soups/curiosity.png",
  },
];
```

## Mission

```ts
export interface Mission {
  id: string;
  title: string;
  prompt: string;
  source?: string;
}

export const missions: Mission[] = [
  {
    id: "mission-1",
    title: "Find a forest smell",
    prompt:
      "With your grown-up, find something outside that smells like the forest. It might be a leaf, a flower, or the air after rain. Tell each other what it reminds you of.",
    source: "From the Whisper Shed",
  },
  {
    id: "mission-2",
    title: "Share a soup story",
    prompt:
      "Think of a time when you had soup (or something warm in a bowl). Tell your grown-up about it. What did it smell like? Who were you with?",
    source: "From the Whisper Shed",
  },
  {
    id: "mission-3",
    title: "One ingredient of the day",
    prompt:
      "Pick one thing you see today that could go in a magic soup. It could be a color, a sound, or a feeling. Tell your grown-up why you chose it.",
    source: "From the Whisper Shed",
  },
];
```

---

# 7. Visual and Interaction System

## Color palette direction

- **Background (page):** Off-white or very light cream (e.g. `#FBF8F5` or `#FAF7F2`). Not pure white.  
- **Background (cards/surfaces):** Slightly warmer white or very light warm gray (e.g. `#F5F1EB`). Optional subtle tint (e.g. green or amber) for cards.  
- **Text (primary):** Warm dark brown or soft black (e.g. `#2C2825` or `#3D3935`). Not pure black `#000`.  
- **Text (secondary):** Muted brown or gray (e.g. `#6B6560` or `#7A756F`) for subtitles and meta.  
- **Accent (sparingly):** One accent for links, key buttons, or small highlights. Options: muted forest green (e.g. `#5B7A5B`), broth amber (e.g. `#B8956B`), or fox orange (e.g. `#C4784A`). Use for hover states and one primary CTA per page, not for large blocks.  
- **Borders / dividers:** Very light warm gray (e.g. `#E8E4DE`).  
- **Avoid:** Bright saturated primary colors (e.g. #FF0000, #00FF00), pure black, neon, or dashboard-style blues and purples.

**Tailwind-style tokens (for reference):**  
- `background-page`, `background-card`, `text-primary`, `text-secondary`, `accent`, `border-subtle`.  
- Implement as Tailwind theme colors or CSS variables so one change updates the whole site.

## Typography direction

- **Heading font:** One font for all headings (h1–h3). Prefer a soft serif (e.g. Lora, Source Serif Pro, Fraunces) or a rounded, friendly sans (e.g. Nunito, Quicksand, Fredoka One for a more playful look). Must feel readable and warm, not corporate or novelty.  
- **Body font:** Same as heading or a neutral sans (e.g. Nunito, Open Sans, system-ui). Slightly larger than typical: base 18px on desktop, 16px on mobile minimum. Line height 1.5–1.6.  
- **Rule:** No more than two font families. Heading can be serif and body sans, or same family for both.  
- **Weights:** Regular (400) for body; medium (500) or semibold (600) for headings and card titles. Avoid bold (700) for large blocks.  
- **Scale:** h1 ~2rem–2.25rem, h2 ~1.5rem–1.75rem, h3 ~1.25rem. Body 1rem–1.125rem.  
- **Read-aloud test:** Every line of body copy should sound natural when read aloud; avoid all-caps or heavy decoration.

## Layout grid and spacing rhythm

- **Page max width:** 1200px for the main content area (header and footer can full-bleed or match).  
- **Reading column (story body, about, long copy):** Max width 640px–720px, centered or left-aligned with consistent side margin.  
- **Card grid:** 1 column on mobile; 2 columns from ~480px; 3 columns from ~768px if you have many cards. Gap between cards: 1rem–1.5rem (16px–24px).  
- **Spacing rhythm:** Use a consistent step (e.g. 4px base). Margins and padding in multiples: e.g. 8px, 16px, 24px, 32px, 48px, 64px. Section spacing (e.g. between hero and list): 32px–48px.  
- **Padding (cards):** 20px–24px inside each card.  
- **Padding (page):** 16px–24px horizontal on mobile; 24px–32px on desktop. Top/bottom page padding 24px–48px.

## Card style

- **Shape:** Rounded corners. Use a single radius (e.g. 12px or 16px) for all cards.  
- **Background:** Slightly different from page background (e.g. white or warm gray `#F5F1EB`).  
- **Border:** Optional 1px solid in `border-subtle`; or no border and soft shadow.  
- **Shadow:** If no border, use a very soft shadow (e.g. `0 2px 8px rgba(0,0,0,0.06)` or Tailwind `shadow-sm`). No heavy or colored shadows.  
- **Hover (see below):** Slight lift (translateY -2px) and slightly stronger shadow, or only subtle shadow change.  
- **Consistency:** LocationCard, CharacterCard, StoryCard, SoupCard (list), MissionCard, EntryPathCard all share this style. Only content and density differ.

## Illustration placeholders

- **When no image is provided:** Use a rectangle (or circle for character) with a background color from the palette (e.g. `background-card` or a muted green/amber). Optional: very simple SVG (e.g. leaf, steam, pot) in a muted color. No clip art or stock photos.  
- **Aspect ratio:** Cards: e.g. 4:3 or 1:1 for character/soup. Story hero: e.g. 16:9 or 3:2.  
- **Image treatment:** If you add real illustrations later, keep them consistent: same line weight, same color range (muted, warm). Optional: subtle rounded corners to match cards.  
- **Alt text:** Every image must have meaningful alt text for accessibility. Placeholder images: alt="" or descriptive (e.g. “Placeholder: Forest Soup House”).

## Hover behavior

- **Links (text):** Underline on hover, or color change to accent. Transition 150ms–200ms ease-out.  
- **Cards (clickable):** Slight lift: `transform: translateY(-2px)` and shadow increase (e.g. from `shadow-sm` to `shadow-md`). Transition 200ms–250ms ease-out. Cursor pointer.  
- **Buttons / CTAs:** Background darkens slightly or shifts to a darker shade of the same color; optional slight scale (e.g. 1.02) if desired. Transition 150ms–200ms.  
- **No hover on touch:** Rely on active/tap state for touch devices (e.g. slight scale or opacity) so tap feedback is clear.  
- **Rule:** One small motion per interaction. No bounce, no flash, no auto-repeat animation.

## Page transition style

- **Navigation:** No full-page transition animation for v1. Instant route change (Next.js default). Optional: very short fade (100ms–150ms) on route change if you add a layout wrapper; not required.  
- **In-page:** When expanding a soup card in place or revealing content, use opacity and/or height transition (200ms–300ms ease-out). No slide-from-side or complex animation.  
- **Scroll:** No parallax. Optional: subtle fade-in of cards on scroll (opacity 0 → 1, once) if you want a gentle reveal; respect reduced motion (see below).

## Reduced motion fallback

- **Detect:** Use `prefers-reduced-motion: media (prefers-reduced-motion: reduce)`.  
- **When reduced:** Disable or simplify: no hover lift on cards (only color or shadow change if any), no translateY, no transition on route change, no scroll-based fade-in. Keep opacity and color changes if they are subtle; avoid any motion that could trigger discomfort.  
- **Implementation:** In CSS: `@media (prefers-reduced-motion: reduce) { ... }` to override transitions and transforms. In Tailwind: use `motion-reduce:` variants where you add motion.

---

# 8. Technical Recommendation

## Final route structure

```
app/
  layout.tsx              → Root layout: SiteHeader, {children}, SiteFooter
  page.tsx                → Home (Forest Gate)
  world/
    page.tsx              → World / Places (single page)
  characters/
    page.tsx              → Characters list
    [slug]/page.tsx       → Character profile (e.g. /characters/fina)
  stories/
    page.tsx              → Stories list
    [slug]/page.tsx       → Story episode (e.g. /stories/finas-first-soup)
  soup-cards/
    page.tsx              → Soup cards list
    [slug]/page.tsx       → Soup card detail (e.g. /soup-cards/memory-soup)
  missions/
    page.tsx              → Missions (single page)
  about/
    page.tsx              → About
```

No `/world/[slug]`. No nested routes beyond one level of `[slug]`.

## Final folder structure

```
/
  app/
    layout.tsx
    page.tsx
    world/page.tsx
    characters/page.tsx
    characters/[slug]/page.tsx
    stories/page.tsx
    stories/[slug]/page.tsx
    soup-cards/page.tsx
    soup-cards/[slug]/page.tsx
    missions/page.tsx
    about/page.tsx
  components/
    SiteHeader.tsx
    SiteFooter.tsx
    PageHero.tsx
    CharacterProfile.tsx
    StoryBody.tsx
    SectionDivider.tsx
    NarrationBlock.tsx
    CTABanner.tsx
    cards/
      LocationCard.tsx
      CharacterCard.tsx
      StoryCard.tsx
      SoupCard.tsx
      MissionCard.tsx
      EntryPathCard.tsx
  data/
    characters.ts
    locations.ts
    stories.ts
    soupCards.ts
    missions.ts
  lib/
    (optional) getCharacterBySlug.ts, getStoryBySlug.ts, etc., or read directly from data in page
  public/
    images/
      (placeholder or real assets)
  (Tailwind config, tsconfig, etc.)
```

No `app/components` required unless you want page-specific components. Keep all shared UI in `components/`.

## Where data files live

- **Path:** `/data/` at the project root.  
- **Files:** `characters.ts`, `locations.ts`, `stories.ts`, `soupCards.ts`, `missions.ts`.  
- **Format:** TypeScript files that export typed arrays (and optionally types). Example: `export const characters: Character[] = [...];`  
- **Usage:** Import in page or layout. Example: `import { characters } from '@/data/characters';`  
- **No env:** Content is static; no `process.env` for content in v1.  
- **Slug lookup:** In `[slug]` pages, find the item by `slug` from the array (e.g. `characters.find(c => c.slug === params.slug)`). Use `generateStaticParams` for static generation: return slugs from the data arrays.

## Which pages are fully data-driven

- **Characters list:** Renders from `data/characters`. Every character in the array gets a card.  
- **Character profile:** Data for the current slug from `data/characters`. If slug not found, 404.  
- **Stories list:** Renders from `data/stories`.  
- **Story episode:** Data for the current slug from `data/stories`. If not found, 404.  
- **Soup cards list:** Renders from `data/soupCards`.  
- **Soup card detail:** Data for the current slug from `data/soupCards`. If not found, 404.  
- **Missions:** Renders from `data/missions`. Single page; no slug.  
- **World:** Renders from `data/locations`. Single page; no slug.

So: `/world`, `/characters`, `/characters/[slug]`, `/stories`, `/stories/[slug]`, `/soup-cards`, `/soup-cards/[slug]`, `/missions` are all data-driven. Only home and about are not (see below).

## Which pages can be partially hardcoded for v1

- **Home (`/`):** Hardcode site name, tagline, and the four entry path cards (title, description, href). No need to derive paths from data. Optionally pull “featured” character name or story title from data for the atmosphere line; otherwise hardcode one line.  
- **About (`/about`):** Hardcode the paragraph(s) in the page component or a constant. No CMS; change by editing the file.  
- **Nav in SiteHeader:** Hardcode the list of links (Home, World, Characters, Stories, Soup cards, Missions, About) and hrefs. Same for SiteFooter.

## Build order (steps 1–8 only)

1. **Project setup.** Create Next.js app (App Router), TypeScript, Tailwind. Add font(s) (e.g. Google Fonts or local). Configure Tailwind theme: colors (background-page, background-card, text-primary, text-secondary, accent, border-subtle), font family, spacing if desired. Add `prefers-reduced-motion` handling in global CSS or Tailwind.  
2. **Layout and shell.** Implement `app/layout.tsx` with SiteHeader and SiteFooter. Implement SiteHeader (site name, nav links) and SiteFooter (“Back to the forest,” optional About link). No dropdowns; simple links. Ensure layout wraps all routes.  
3. **Data layer.** Create `/data` with `characters.ts`, `locations.ts`, `stories.ts`, `soupCards.ts`, `missions.ts`. Export types and arrays. Add the example mock content from section 6 (at least 1 full character, 2–3 locations, 1 story, 3 soup cards, 3 missions).  
4. **Home page.** Implement home `app/page.tsx`. PageHero or custom hero with site name and tagline. Four EntryPathCards (Explore the forest → /world, Meet the characters → /characters, Read a story → /stories, Find a soup or mission → /soup-cards and/or /missions). Optional atmosphere line. Use EntryPathCard component.  
5. **World and Missions.** Implement `/world/page.tsx`: PageHero, then map `locations` to LocationCard. Implement `/missions/page.tsx`: PageHero, then map `missions` to MissionCard. No slug routes.  
6. **Characters list and profile.** Implement `/characters/page.tsx`: PageHero, then map `characters` to CharacterCard linking to `/characters/[slug]`. Implement `/characters/[slug]/page.tsx`: load character by slug, render CharacterProfile, CTABanner “Back to forest friends.” Use generateStaticParams from `characters` slugs.  
7. **Stories list and episode.** Implement `/stories/page.tsx`: PageHero, map `stories` to StoryCard. Implement `/stories/[slug]/page.tsx`: load story by slug, render StoryBody (title, sections, SectionDivider, optional NarrationBlock), CTABanner “Back to stories.” generateStaticParams from `stories` slugs.  
8. **Soup cards list and detail.** Implement `/soup-cards/page.tsx`: PageHero, map `soupCards` to SoupCard (list variant) linking to `/soup-cards/[slug]`. Implement `/soup-cards/[slug]/page.tsx`: load soup by slug, render name, mood, character, description, ingredients, CTABanner “Back to soup cards.” generateStaticParams from `soupCards` slugs. Then implement About page: `app/about/page.tsx` with hardcoded title and paragraph, CTA “Back to the forest.”

After step 8 you have all v1 pages and routes. Polish (images, copy, spacing, hover, reduced motion) can follow without changing structure.

---

**Document version:** v1 implementation spec  
**Use:** Direct implementation guide for Forest Soup House. No code in this doc; all decisions are specified so a frontend or AI can build consistently.
