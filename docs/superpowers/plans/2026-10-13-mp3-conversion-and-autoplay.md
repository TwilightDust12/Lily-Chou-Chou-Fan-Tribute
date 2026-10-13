# MP3 Conversion & Autoplay Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all 9 album tracks from FLAC to lightweight 192 kbps MP3 files (reducing total payload from 196 MB to ~48 MB) and implement automatic soundtrack playback with seamless first-interaction fallback across modern browsers.

**Architecture:** Use `ffmpeg` to encode the 9 FLAC tracks into universal 192 kbps MP3 files. Update `player.js` to reference the MP3 URLs and invoke `attemptAutoplay()`, gracefully catching browser policy restrictions and unlocking with smooth volume ramping on the user's first click, tap, or keypress anywhere on the site.

**Tech Stack:** `ffmpeg`, Plain HTML5, CSS3, Vanilla ES6+ JavaScript, Web Audio API, Python 3 test runner.

---

### Task 1: Batch Audio Conversion from FLAC to MP3

**Files:**
- Output: `assets/Lily Chou-Chou/呼吸 (2008)/*.mp3`
- Delete: `assets/Lily Chou-Chou/呼吸 (2008)/*.flac`

- [ ] **Step 1: Convert all 9 FLAC tracks to MP3**

Run batch ffmpeg conversion:
```bash
python3 -c "
import subprocess, os
folder = 'assets/Lily Chou-Chou/呼吸 (2008)'
for f in sorted(os.listdir(folder)):
    if f.endswith('.flac'):
        src = os.path.join(folder, f)
        dst = os.path.join(folder, f.replace('.flac', '.mp3'))
        print(f'Converting {f} -> {os.path.basename(dst)}...')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-codec:a', 'libmp3lame', '-b:a', '192k', '-map_metadata', '0', dst], check=True)
"
```

- [ ] **Step 2: Verify all 9 MP3 tracks exist and check total size**

Run verification check:
```bash
python3 -c "
import os
folder = 'assets/Lily Chou-Chou/呼吸 (2008)'
mp3s = [f for f in os.listdir(folder) if f.endswith('.mp3')]
assert len(mp3s) == 9, f'Expected 9 MP3 tracks, got {len(mp3s)}'
total_mb = sum(os.path.getsize(os.path.join(folder, f)) for f in mp3s) / (1024*1024)
print(f'Successfully created {len(mp3s)} MP3 tracks totaling {total_mb:.1f} MB')
"
```

- [ ] **Step 3: Remove original FLAC tracks to free disk space and reduce bundle**

```bash
rm "assets/Lily Chou-Chou/呼吸 (2008)"/*.flac
chmod -R a+r "assets/Lily Chou-Chou"
```

- [ ] **Step 4: Commit converted audio assets**

```bash
git add "assets/Lily Chou-Chou"
git commit -m "feat(assets): convert Kokyuu album from FLAC to 192kbps MP3"
```

---

### Task 2: Update Static Test Assertions in `tests/check_site.py`

**Files:**
- Modify: `tests/check_site.py`

- [ ] **Step 1: Update test file to assert MP3 tracks**

Change assertion in `tests/check_site.py` from `.flac` to `.mp3`:
```python
mp3_files = list(album_dir.glob('*.mp3'))
assert len(mp3_files) == 9, f'Expected 9 MP3 tracks, found {len(mp3_files)}'
```

- [ ] **Step 2: Run test to verify it fails on un-updated `player.js`**

Run: `python3 tests/check_site.py`  
Expected: FAIL (player.js still references `.flac`).

- [ ] **Step 3: Commit test changes**

```bash
git add tests/check_site.py
git commit -m "test: update check_site.py to verify 9 MP3 tracks"
```

---

### Task 3: Update `player.js` for MP3 Sources & Autoplay with Fallback

**Files:**
- Modify: `player.js`

- [ ] **Step 1: Update playlist track URLs from `.flac` to `.mp3`**

Replace all `.flac` file extensions in `playlist` array with `.mp3`.

- [ ] **Step 2: Implement Autoplay with First-Interaction Fallback**

In `player.js`:
- Add `attemptAutoplay()` function called on `DOMContentLoaded`.
- Call `audioElement.play()`:
  - If promise resolves: set `isPlaying = true`, spin physical disc, start oscilloscope visualizer loop, update status text.
  - If promise rejects (`NotAllowedError`):
    - Set `playerStatusText.textContent = 'CLICK ANYWHERE TO LISTEN'`.
    - Attach one-time global listeners (`pointerdown`, `keydown`, `touchstart`, `{ once: true }`).
    - On first user interaction, resume `audioCtx`, call `audioElement.play()`, ramp volume smoothly from `0` to target level over 400ms, and update UI.
- Cancel auto-start listener if user clicks Pause, Stop, or opens the lid before first interaction.

- [ ] **Step 3: Verify syntax**

Run: `node --check player.js`  
Expected: Clean exit code 0.

- [ ] **Step 4: Commit player updates**

```bash
git add player.js
git commit -m "feat(player): switch to MP3 tracks and add autoplay with first-interaction fallback"
```

---

### Task 4: Update Copy in `index.html` and `README.md`

**Files:**
- Modify: `index.html`
- Modify: `README.md`

- [ ] **Step 1: Update listening copy in `index.html`**

Update `#listening .listening-detail`:
`<span class="listening-dot" aria-hidden="true"></span><span>Sound plays automatically as you enter the Ether.</span>`

- [ ] **Step 2: Update `README.md`**

Reflect that tracks are lightweight MP3 and playback auto-starts on load or first interaction.

- [ ] **Step 3: Commit copy updates**

```bash
git add index.html README.md
git commit -m "docs: update listening copy for autoplay and MP3 format"
```

---

### Task 5: Full Verification and Regression Testing

- [ ] **Step 1: Run Python static validation suite**

Run: `python3 tests/check_site.py`  
Expected: PASS.

- [ ] **Step 2: Run Node.js syntax checks**

Run: `node --check script.js && node --check player.js`  
Expected: PASS with exit code 0.

- [ ] **Step 3: Push changes to remote branch**

Run: `git push origin ui-redesign/overall`
