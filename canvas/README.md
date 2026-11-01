# Interface Canvas

An infinite pan/zoom canvas that mounts every UI component from both OrchestraOS dashboards, live from
their source trees, so the two boxes can be compared and tested side by side. Nothing is copied: a new
file in either tree is a new card on the next reload.

- **VPS dashboard:** `/home/shaw/scripts/agent-orchestra/dashboard/src` (`@vps`)
- **Paul's box dashboard:** `/home/shaw/repos/orchestraos-paul-main/dashboard/src`, a clone of Tulum-DAO/orchestraos `main` (`@paul`); `git -C ~/repos/orchestraos-paul-main pull` to refresh it.
- Override either with `CANVAS_VPS_SRC` / `CANVAS_PAUL_SRC`.

## Run on the VPS

```sh
cd canvas && npm install && npm run dev        # http://127.0.0.1:8895, served on the tailnet at :8895
```

It runs in tmux session `interface-canvas`. Open https://srv1397016.tail8be541.ts.net:8895/.

## How it works

- `src/catalog.ts` globs `components/**/*.tsx` in both trees at build time.
- `src/fixtures.ts` gives a component its props, several states each. A card with no fixture mounts
  with `{}` inside an error boundary: **a red card means "needs a fixture"** and names the missing prop.
  Add an entry keyed by file name (shared by both boxes) or `paul/folder/Name` / `vps/Name`.
- `/api/*` answers an empty 200 and EventSource is inert, so no card talks to a live box.
- Modes: **by box** (one column each, grouped by folder) and **parity** (same name side by side, tagged
  both / VPS only / Paul's box only). Widths: natural, wide 720, phone 390. Light/dark toggle.
- One React for all three trees (`resolve.dedupe`), one react-query client, a MemoryRouter.

## Stageshow

`../stageshow` is Benji Taylor's kit, kept as forked. Its `Stage` (scale-to-fit, scripted states, a frozen
clock, phone variant) can wrap any card that needs a scripted demo, and `scripts/film.mjs --gate` films a
card for a contact sheet: `node ../stageshow/scripts/film.mjs 'http://127.0.0.1:8895/?card=<id>' --select '.ic-card' --still`.
