# FAAAAHHH Fail Sound

Plays a sound when your code or tests fail so you immediately know something broke.

---

## Features

- Plays a sound when a command fails
- Run any command using **Command Palette**
- Configurable command (works with any language/tool)
- Debounced error detection (no noise while typing)
- Status bar toggle (enable/disable instantly)
- Cooldown system to prevent spam
- Cross-platform support:
  - Windows (PowerShell)
  - macOS (afplay)
  - Linux (aplay)

---

## Usage

### Run Command with Sound

Open Command Palette: `Ctrl + Shift + P`

Run: `faahhh run`

This will execute your configured command and play a sound if it fails.

---

## Configuration

You can configure which command to run:

```json
"faahhh.command": "npm test"
```

**Examples**

```json
"faahhh.command": "pytest"
"faahhh.command": "npm run build"
"faahhh.command": "g++ main.cpp && ./a.exe"
```

### Status Bar

- `FAAA ON` → extension enabled
- `FAAA OFF` → extension disabled

Click the status bar item to toggle instantly.

---

## Requirements

- Node.js installed (for JavaScript projects)
- Command must return a non-zero exit code on failure

---

## Known Issues

On Linux, `aplay` may not be installed by default. Install it using:

```bash
sudo apt install alsa-utils
```

---

## Release Notes

### 0.0.5

- Added Terminal command failure detection using VS Code shell integration
- Improved: More accurate failure triggering

### 0.0.4

- Added custom command support (`faahhh.command`)
- Added `faahhh run` command
- Added status bar toggle
- Added cooldown system
- Added debounced diagnostic detection
- Removed external wrapper dependency
- Improved stability and performance

---

## Author

**Sheikh Siam Najat**

- GitHub: [https://github.com/najat-ttt](https://github.com/najat-ttt)
- LinkedIn: [https://www.linkedin.com/in/sheikh-siam-najat-82584b281](https://www.linkedin.com/in/sheikh-siam-najat-82584b281)

---

## Repository

[https://github.com/najat-ttt/faahhh-test-fail](https://github.com/najat-ttt/faahhh-test-fail)
