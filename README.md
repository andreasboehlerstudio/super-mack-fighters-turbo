# Super Mack Fighters Turbo

Pixel-art fighting game set in a playful Europa-Park world. Developer & Art Director: **Andreas Boehler**.

## Play

[Launch the GitHub Pages edition](https://andreasboehlerstudio.github.io/super-mack-fighters-turbo/)

- Arcade tour through 21 themed areas, free arena selection, CPU battles, local Versus and Training.
- 22 fighter designs including the final fantasy opponent; 21 selectable characters.
- Native 256-pixel combat cells, separate animation sheets, eight-phase grounded and aerial attacks.
- Unique animated spectators for each area and cosmetic scenery activity.
- Walkable park map with routes checked against the visible paths.

The Pages edition stores high scores on the current device. Online invitation codes require the original server-backed edition and are clearly marked unavailable on Pages. No account or backend is required for the other modes.

## Run locally

Node.js 24 is used by CI.

```sh
npm ci
npm test
npm run build:pages
npm run preview:pages
```

Open `http://localhost:4173/super-mack-fighters-turbo/`. The normal `npm run dev` / `npm run build` commands retain the original Sites/Vinext server edition.

GitHub Actions builds and publishes Pages on pushes to `main`. The separate Vite configuration preserves the repository subpath for Phaser textures, Canvas graphics, fonts and MIDI downloads.

## Controls

Player 1: WASD moves/jumps, F punches, G kicks, H blocks, Q parries, R performs the ultra. Esc pauses. Gamepads are supported; the second local player joins through Versus. The game starts expanded and requests browser fullscreen after pressing Start. Window mode is available in the menu and pause screen.

## Art and music

Art is generated and adapted for this prototype from the supplied character and park references. Character proportions and foot anchors are calibrated separately from sprite packing. The music includes original area compositions and the supplied Feel Free MIDI arrangement. See the in-game credits and the art/music documents for provenance. Publishing this repository does not grant rights to third-party characters, brands or music.
