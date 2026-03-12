# Forest Soup House — Step 1: Refined Navigation Labels

Visible labels for the main navigation. Internal routes stay unchanged; only the text shown to users is refined so the site feels in-world and magical while remaining clear for parents.

---

## Label reference

| Internal route | Visible label (EN) | Bilingual (EN + 繁體中文) | Why it works |
|---------------|--------------------|---------------------------|--------------|
| `/` | **Forest Gate** | Forest Gate · 森林入口 | Works as a persistent nav label: "you can always go back to the gate." "Enter the forest" is reserved for homepage CTA language so the invitation lives on the page, not in the nav. Clear for parents; evocative for children. |
| `/world` | **The Forest** | The Forest · 魔法森林 | Names the place. Short and evocative; parents get "see the world/locations." Not "Places" or "Map," which feel utilitarian. |
| `/characters` | **Forest Friends** | Forest Friends · 森林朋友 | Who lives here. "Friends" is warm and clear for kids; "forest" keeps context. Avoids "Characters" (meta) and "Meet the cast" (theatrical). |
| `/stories` | **Story Time** | Story Time · 故事時間 | Warm and familiar to parents and children. Still clear as "where we read stories." Slightly more inviting than "Stories" alone while staying obvious. |
| `/soup-cards` | **Soup Cards** | Soup Cards · 湯湯卡 | Clear and practical. Matches the product spec and the idea of collectible soup cards. 湯湯 echoes 湯湯屋. |
| `/missions` | **Little Adventures** | Little Adventures · 小任務 | Frames missions as gentle adventures, not tasks or chores. Parents understand "things to do together"; children hear "adventures." |
| `/about` | **About** | About · 關於 | Conventional so parents know where to find what the site is and who made it. |

---

## Implementation notes

- **Header/nav:** Use the "Visible label (EN)" column (or bilingual when you support 繁體中文).
- **Links:** Keep hrefs as the internal routes (`/`, `/world`, `/characters`, etc.); only the visible text changes.
- **Homepage:** Use "Enter the forest" as CTA copy on the Forest Gate page (e.g. primary button or hero line); use "Forest Gate" in the nav for the link to `/`.
- **Order:** Nav order: Forest Gate, The Forest, Forest Friends, Story Time, Soup Cards, Little Adventures, About.

---

## Summary

- **Forest Gate** — main entry (nav); "Enter the forest" for homepage CTA
- **The Forest** — world / places
- **Forest Friends** — characters
- **Story Time** — story episodes
- **Soup Cards** — soup cards
- **Little Adventures** — missions
- **About** — about the project

No route changes. Labels stay understandable for parents and emotionally in-world for the storybook feel.
