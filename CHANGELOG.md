# Changelog

All notable changes to this project will be documented in this file.

---

## [0.0.5] - Latest

### Added

- Terminal command failure detection using VS Code shell integration

### Improved

- More accurate failure triggering

## [0.0.4]

### Added

- Custom command support via `faahhh.command`
- Command Palette action: `faahhh run`
- Status bar toggle (FAAA ON / OFF)
- Cooldown system to prevent repeated triggers
- Debounced diagnostic detection (triggers after typing stops)
- Active editor filtering for diagnostics

### Improved

- Removed dependency on external wrapper script
- Improved terminal execution using internal process handling
- Reduced false triggers during typing
- Improved stability and responsiveness

### Fixed

- Multiple trigger issues from repeated diagnostics
- Sound inconsistency during rapid executions

---

## [0.0.3]

### Added

- Cross-platform sound playback (Windows, macOS, Linux)
- Improved task failure detection

---

## [0.0.2]

### Improved

- General stability improvements
- Initial bug fixes

---

## [0.0.1] - Initial Release

### Added

- Plays sound when tests fail
- Supports VS Code Tasks
- Terminal support via wrapper script

### Notes

- Uses system audio commands (`powershell`, `afplay`, `aplay`)
