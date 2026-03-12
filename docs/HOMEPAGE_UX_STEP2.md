# Forest Soup House — Step 2: Homepage Emotional Experience

The Forest Gate should feel like arriving at a magical place, not opening a category index. This document defines the refined structure, copy, and emotional flow for the homepage within the current v1 scope.

---

## Exact top-to-bottom homepage structure

1. **Header**  
   Global nav (Forest Gate, The Forest, Forest Friends, Story Time, Soup Cards, Little Adventures, About). Same as on all other pages.

2. **Hero**  
   Site title + tagline. No large image required; the words set the tone. Enough vertical space so the next section isn’t cramped.

3. **Emotional anchor (Fina)**  
   A short, in-world line that makes the world feel inhabited. Fina is named so the child has someone to look for. Placed between hero and entry paths so it acts as a bridge from “what is this place?” to “what do I do?”

4. **Atmosphere line**  
   One sentence that deepens the mood (warm, gentle, a little magical). Supports the feeling of “we’re inside the forest now.”

5. **Entry paths**  
   Four cards: Explore the forest, Meet the forest friends, Read a story, Find a soup or a little adventure. Each card is a clear next step. No heading above required; the flow from atmosphere into the cards does the work.

6. **Footer**  
   Minimal (e.g. “Back to the forest” / Forest Gate, optional About link). Same as other pages.

---

## Hero

**Hero title**  
**Forest Soup House**  
Optional second line: **湯湯屋魔法森林** (if bilingual is in scope for v1).

**Hero tagline**  
**A gentle story world where soup is magic.**  
One sentence. Read-aloud friendly. Tells the parent “story world” and “soup”; tells the child “magic” and “soup.” No marketing spin, no “discover” or “explore” overload.

---

## Emotional anchor (Fina)

**Final recommended copy**  
**Fina is waiting by the Soup House. She has something warm to share.**

- **Why this version:** Reads as a story invitation rather than a guide introduction. “Something warm to share” suggests a story or a moment to receive, not “I’ll show you around.” Keeps “waiting” and the Soup House so the child has a person and a place to look for.
- **Purpose:** Gives the child a named friend and a place (Soup House). Invites them in without framing Fina as a tour guide.
- **Placement:** Directly below the hero, before the atmosphere line.
- **Tone:** Warm, simple, second person (“you”). No exclamation marks; keep it calm.

**Alternative (if you prefer more direct welcome)**  
**Fina is waiting by the Soup House. Come say hello.**  
Use if you want a clearer call to action while still avoiding “show you around.”

---

## Atmosphere line

**Final recommended copy**  
**Step inside. There are warm stories, gentle friends, and a little soup magic waiting for you.**

- **Why this version:** Feels like entering a magical place rather than a content summary. “Warm” and “gentle” set the tone; “soup magic” and “waiting for you” make it personal and a little enchanted. Avoids the checklist feel of “stories to read, friends to meet, soups to discover.”
- **Purpose:** Deepens the mood and invites the child/parent into the world. Reinforces “step inside” so the gate metaphor holds.
- **Placement:** Below the Fina anchor, above the entry path cards.
- **Tone:** Inviting, soft, slightly magical. No exclamation marks.

**Alternative (more surprise-oriented)**  
**Step inside. The forest is full of stories, friends, and warm little surprises.**  
Use if you prefer “warm little surprises” and “full of” over “waiting for you.”

---

## Entry path titles and descriptions

| Path | Title | Description (one line) | href |
|------|--------|------------------------|------|
| 1 | **Explore the forest** | Visit the Soup House and the places where stories are made. | `/world` |
| 2 | **Meet the forest friends** | Say hello to Fina, Poffy, and the others who live here. | `/characters` |
| 3 | **Read a story** | Sit down with a story from the forest. | `/stories` |
| 4 | **Find a soup or a little adventure** | Soup cards to inspire, and small missions to try together. | `/soup-cards` or split: one card to `/soup-cards`, one to `/missions` |

**Note on path 4:** For v1, one card can link to `/soup-cards` with the description covering both soups and missions (“Soup cards to inspire, and little adventures to try together.”). Alternatively, use two cards: “Find a soup” → `/soup-cards` and “Pick a little adventure” → `/missions`. Spec recommends one combined card for simplicity unless you want two distinct CTAs.

**Tone:** Titles are actions (“Explore,” “Meet,” “Read,” “Find”). Descriptions are one sentence each, concrete and warm. No “Click here” or “Learn more.”

---

## Main CTA logic

- **Primary CTA on the page:** The first entry path card, **Explore the forest**, can be treated as the default “first step” (e.g. slightly larger or listed first). The real primary action is **user choice**: any of the four cards is a valid first tap. So there is no single “Sign up” or “Get started” button; the four cards together are the main CTAs.  
- **If you need one “Enter” button:** A single button above the cards, e.g. **Enter the forest**, can scroll to the entry path cards or link to `/world`. Label: “Enter the forest.” Use only if you want a clear “I’m ready” action before showing the four options; otherwise, hero → Fina → atmosphere → four cards is enough, and no extra button is required.  
- **Summary:** Prefer no extra “Enter the forest” button; let the four entry path cards be the main CTAs. Reserve “Enter the forest” for optional hero button or for future use. Nav link to home stays “Forest Gate.”

---

## What a child notices first

- **Big words:** “Forest Soup House” and “soup” and “magic.”  
- **A name:** “Fina” — someone to look for.  
- **Friendly line:** “She has something warm to share.”  
- **Pictures (if any):** A small illustration of Fina or the gate would draw the eye; optional for v1.  
- **Cards:** Four clear options; the child can point and choose (“I want to meet the friends” or “I want a story”).

So: **title → Fina’s name and the idea of something warm to share → four choices.** The child doesn’t need to read everything; the flow and one friendly name are enough.

---

## What a parent understands first

- **In a few seconds:** This is a story world for children, about soup and the forest; it’s gentle and narrative, not a shop or an app.  
- **From the tagline:** “Story world,” “soup,” “magic” — no commerce, no sign-up.  
- **From Fina’s line:** There’s a character and a place (Soup House); the site has a world, not just links.  
- **From the atmosphere line:** The forest has warm stories, gentle friends, and soup magic waiting—we’re stepping into a place, not a menu.  
- **From the four cards:** Clear next steps: explore places, meet characters, read a story, find soups/adventures. No confusion about what to do next.

So: **story world → one character and one place → three types of content → four clear actions.** The parent can immediately choose a path with their child.

---

## Summary

- **Structure:** Header → Hero (title + tagline) → Emotional anchor (Fina) → Atmosphere line → Entry path cards → Footer.  
- **Hero:** “Forest Soup House” / “A gentle story world where soup is magic.”  
- **Fina anchor:** “Fina is waiting by the Soup House. She has something warm to share.”  
- **Atmosphere:** “Step inside. There are warm stories, gentle friends, and a little soup magic waiting for you.”  
- **Entry paths:** Four cards with the titles and descriptions above; main CTAs are the cards themselves.  
- **Child:** Sees title, Fina’s name, and four choices.  
- **Parent:** Understands story world, no commerce, and four clear actions.  

No new features or technical scope; only structure and copy refined for emotional clarity. Use this when building the Home / Forest Gate page in Step 6.
