# Forest Soup House — Step 3: Final File Structure

Recommended file structure for the project. Next.js App Router, clear separation between app, components, and data, reusable components grouped logically, simple enough for a solo creator to maintain.

---

## Overview

```
forest-soup-house/
├── app/                    # Routes and pages (App Router)
├── components/             # Reusable UI components
├── data/                   # Static content (no CMS)
├── public/                 # Static assets
├── lib/                    # Optional helpers (only if needed)
├── docs/                   # Specs and reference (existing)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── next.config.js
```

---

## App routes

```
app/
├── layout.tsx              # Root layout: SiteHeader, {children}, SiteFooter
├── page.tsx                # Home / Forest Gate
├── world/
│   └── page.tsx            # The Forest (places list)
├── characters/
│   ├── page.tsx            # Forest Friends (character list)
│   └── [slug]/
│       └── page.tsx        # Character profile (e.g. /characters/fina)
├── stories/
│   ├── page.tsx            # Story Time (story list)
│   └── [slug]/
│       └── page.tsx        # Story episode (e.g. /stories/finas-first-soup)
├── soup-cards/
│   ├── page.tsx            # Soup Cards (list)
│   └── [slug]/
│       └── page.tsx        # Soup card detail (e.g. /soup-cards/memory-soup)
├── missions/
│   └── page.tsx            # Little Adventures (single page)
└── about/
    └── page.tsx            # About
```

- **No** `app/components/` — shared components live in `/components` at project root.
- **No** route groups like `(marketing)` unless you add them later; flat structure is enough for v1.
- **Slug pages:** Use `generateStaticParams` and load data from `/data` in the page; no API routes.

---

## Components structure

```
components/
├── SiteHeader.tsx          # Global nav + site name
├── SiteFooter.tsx         # Back to forest, optional About link
├── PageHero.tsx           # Page title + optional subtitle (inner pages)
├── CharacterProfile.tsx   # Full character content (bio, quote, links)
├── StoryBody.tsx          # Story title, sections, dividers, narration
├── SectionDivider.tsx     # Visual break between sections
├── NarrationBlock.tsx     # Quote / in-world voice
├── CTABanner.tsx          # Primary + optional secondary CTA
└── cards/
    ├── EntryPathCard.tsx  # Home: one “door” (Explore, Meet friends, etc.)
    ├── LocationCard.tsx   # World: one place
    ├── CharacterCard.tsx  # Characters list: one character
    ├── StoryCard.tsx      # Stories list: one story
    ├── SoupCard.tsx       # Soup cards list (and optionally detail layout)
    └── MissionCard.tsx    # Missions: one mission
```

- **Flat list** for layout and content components; **cards/** for all card types. Easy to find and extend.
- **No** subfolders like `components/ui` or `components/layout` for v1; add only if the list grows.
- **Naming:** One component per file; name matches file (e.g. `SiteHeader.tsx` exports the main header).

---

## Data structure

```
data/
├── characters.ts           # export const characters: Character[] + type
├── locations.ts            # export const locations: Location[] + type
├── stories.ts              # export const stories: Story[] + type
├── soupCards.ts            # export const soupCards: SoupCard[] + type
└── missions.ts             # export const missions: Mission[] + type
```

- **One file per content type.** Each file defines the TypeScript type(s) and exports the array. Pages import from `@/data/characters` etc.
- **No** `data/index.ts` that re-exports everything unless you want a single import; per-file imports are clear and tree-shakeable.
- **No** JSON files required; TS gives type safety and simple editing. Use `.ts` only.

---

## Public assets

```
public/
├── images/                 # All image assets
│   ├── characters/          # Optional: fina.png, poffy.png, etc.
│   ├── places/              # Optional: soup-house.png, etc.
│   ├── stories/             # Optional: story heroes
│   └── soups/               # Optional: soup card images
└── (favicon, etc.)
```

- **Images:** Reference as `/images/characters/fina.png` etc. Create folders as needed; placeholder or no image is fine for v1.
- **No** `public/data` — data lives in `/data` as TypeScript.

---

## Lib (optional)

```
lib/
└── (empty for v1, or)
    getBySlug.ts             # Optional: getCharacterBySlug(slug), getStoryBySlug(slug), etc.
```

- **Prefer in-page logic:** In each `[slug]/page.tsx`, do `characters.find(c => c.slug === params.slug)`. Add `lib/getBySlug.ts` only if you want shared helpers and less repetition.
- **No** `lib/api`, `lib/cms`, or `lib/auth` — static content only.

---

## What lives where

| Concern            | Location        | Notes                                      |
|--------------------|-----------------|--------------------------------------------|
| Routes / pages     | `app/**/*.tsx`  | One page per route; layout in `app/layout.tsx` |
| Reusable UI        | `components/`   | Header, footer, hero, cards, profile, body  |
| Content            | `data/*.ts`     | Types + arrays; no CMS                     |
| Images             | `public/images/` | Optional for v1                           |
| Tailwind config    | `tailwind.config.ts` | Theme colors, font family            |
| Global styles      | `app/globals.css` or in layout | If needed beyond Tailwind   |

---

## Summary

- **App:** Layout + 10 pages (home, world, characters, characters/[slug], stories, stories/[slug], soup-cards, soup-cards/[slug], missions, about).
- **Components:** 14 components—6 in root, 6 in `cards/`, plus SectionDivider, NarrationBlock, CTABanner, CharacterProfile, StoryBody.
- **Data:** 5 files in `data/`, one per content type, TypeScript only.
- **Public:** `images/` with optional subfolders; no data in public.
- **Lib:** Omit for v1 unless you add 1–2 small helpers (e.g. getBySlug).

This structure stays simple, predictable, and easy for one person to maintain and extend. Use it when implementing Steps 4–6.
