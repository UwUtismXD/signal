---
name: signal
description: Control Lovense toys via the local Lovense Remote API. Use when asked to vibrate, buzz, pulse, wave, or stop connected toys.
---

# Signal — Lovense Toy Control

Control connected Lovense toys via the Lovense Remote local API.

## Setup

- Install and open the **Lovense Remote** app on your phone
- Enable the local API in the app settings
- Phone and computer must be on the same network
- Set the API endpoint via the `SIGNAL_API_URL` environment variable:

```bash
export SIGNAL_API_URL="https://<phone-ip>:30010/command"
```

## Usage

```bash
node <skill_dir>/scripts/lovense.js <command> [args]
```

### Commands

| Command | Args | Description |
|---------|------|-------------|
| `toys` / `status` | — | List all linked toys (battery, status) |
| `connected` | — | List currently connected toys only |
| `vibrate` | `[strength] [seconds]` | Vibrate all toys. Strength 0-20, default 10. Seconds 0 = indefinite |
| `stop` | — | Stop all toys |
| `pattern` | `<seconds> <s1> <s2> ...` | Custom pattern. Each strength value (0-20) plays for ~1s |
| `wave` | `[seconds]` | Smooth wave pattern (gentle build/release). Default 20s |
| `pulse` | `[seconds] [max] [min]` | Sharp on/off bursts. Default 20s |

### Strength Reference

0 (off) to 20 (max):

- 1-5: gentle/teasing
- 6-12: moderate
- 13-18: strong
- 19-20: max intensity

### Examples

```bash
# Check what's connected
node scripts/lovense.js connected

# Gentle buzz for 5 seconds
node scripts/lovense.js vibrate 5 5

# Full power indefinite (use stop to end)
node scripts/lovense.js vibrate 20

# Smooth wave for 30 seconds
node scripts/lovense.js wave 30

# Custom escalation pattern for 10 seconds
node scripts/lovense.js pattern 10 3 5 8 12 16 20

# Stop everything
node scripts/lovense.js stop
```

## Notes

- Always check `connected` before sending commands to avoid silent failures
- The API returns instantly — it doesn't wait for the action to finish
- `seconds: 0` means indefinite — remember to stop it
- The API uses a self-signed certificate — the script disables TLS verification for local use
