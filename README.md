# The Ether

An independent fan tribute to Shunji Iwai’s *All About Lily Chou-Chou* (2001).

The site explores the film through an opening landscape, short film notes, an expandable still gallery, a Discman listening room, and imagined BBS fragments. It is not a personal portfolio or an official film archive.

The header restores the existing film wordmark in `assets/logo.png`. English typography uses a Times-style system serif stack, visually matched to the English title in `assets/lily-logo.jpg`; the exact production typeface has not been verified. Japanese text retains Shippori Mincho, and the player/BBS utility text retains its monospace treatment.

## Run

Open `index.html`, or serve this directory with `python3 -m http.server 8000`.
No build step, package manager, or runtime JavaScript dependencies are required. Google Fonts are optional; system fonts provide a fallback. Internal assets use relative paths for GitHub Pages hosting.

Run `python3 tests/check_site.py` to check local assets, anchor targets, duplicate IDs, and player bindings. JavaScript syntax can be checked with `node --check script.js` and `node --check player.js`.

## Files

- `index.html`: the fan experience and accessible native still viewer.
- `style.css` / `script.js`: layout, themes, gallery, BBS fragments, and optional motion.
- `player.css` / `player.js`: the portable Discman presentation and HTML5 audio engine routed into Web Audio API for real-time oscilloscope and frequency visualization.
- `assets/`: film images, animation, wordmarks, and the 9-track MP3 album *呼吸 (Kokyuu)* in `assets/Lily Chou-Chou/呼吸 (2008)/`.

## Interactions

Choose a landscape, open its still, and use the arrows to browse. A still can become the opening scene; the selection and theme are remembered when browser storage is available. Gallery triggers support arrow keys. The dialog supports Escape and restores focus when closed.

The Discman features all 9 tracks from the official album *呼吸 (Kokyuu)* by Lily Chou-Chou (composed by Takeshi Kobayashi, vocals by Salyu), with play/pause/stop, track seeking, volume attenuation, lid controls, and disc/field/waveform views. Audio streams progressively from lightweight MP3 files and routes through Web Audio API to drive the real-time FFT frequency bars and phosphor CRT oscilloscope. Playback begins automatically on page visit or smoothly on the user's first interaction, with manual transport controls always available.

The BBS fragments are original fan writing, not film quotations or messages from live users. There is no form or backend. Reduced-motion preferences stop ambient animation and use a still image instead of the animated field. The footer also offers a motion pause control.

## Credits

Film: Shunji Iwai. Cinematography: Noboru Shinoda. Music: Takeshi Kobayashi; Lily’s voice: Salyu.

## Disclaimer & Copyright Notice

All music, musical compositions, and sound recordings from the album *呼吸 (Kokyuu)*, as well as film imagery, characters, trademarks, and titles from *All About Lily Chou-Chou* (リリイ・シュシュのすべて), belong entirely to their respective original copyright holders: Takeshi Kobayashi, Salyu, OORONG-SHA, Avex Inc., Rockwell Eyes, and Shunji Iwai.

The author of this repository and website does not own, nor claim any ownership over, any of the music, audio recordings, images, or intellectual properties featured on this site. This repository is an independent, non-commercial fan tribute created exclusively for artistic appreciation and community reflection. No copyright infringement is intended.
