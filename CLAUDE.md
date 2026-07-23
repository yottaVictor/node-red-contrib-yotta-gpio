# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`node-red-contrib-yotta-gpio` is a Node-RED contrib package providing custom nodes for YottaControl Modbus I/O modules and controllers. The nodes do not talk to hardware themselves — they build Modbus command objects in `msg.payload` intended to be fed into `Modbus-Flex-Getter` / `Modbus-Flex-Write` nodes from `node-red-contrib-modbus`.

There are no npm scripts, no dependencies, no tests, and no build step. Code comments and editor UI text are in Traditional Chinese.

## Development / Testing

Test by installing the package into a local Node-RED instance and restarting it:

```bash
cd ~/.node-red
npm install "f:/backup/公司開發資料/2_進行中專案/node-red-contrib-yotta-gpio"
node-red
```

After changing a `.js` (runtime) file, restart Node-RED. After changing an `.html` (editor) file, restart Node-RED and hard-refresh the browser. An importable test flow is in `examples/A-1060-Read-Write.json` (requires `node-red-contrib-modbus`).

## Architecture

Six nodes, each defined by a `.js`/`.html` pair and registered in `package.json` under `node-red.nodes`:

- `src/read_module/` — `Read_DI`, `Read_DO`, `Read_AI`, `Read_AO`
- `src/write_module/` — `Write_DO`, `Write_AO`

All six follow the same template; a change to the shared pattern usually needs to be replicated across all of them.

### Runtime side (`.js`)

Each node validates `modbusId`/`modbusQty`, then wraps the incoming payload as:

```javascript
msg.payload = { value: msg.payload, fc, unitid, address, quantity }
```

Modbus function codes: reads use `fc: 1` (DI/DO) or `fc: 3` (AI/AO); `Write_DO` uses `fc: 5` (or `15` when quantity > 1); `Write_AO` uses `fc: 6` (or `16` when quantity > 1).

Each `.js` file also registers an HTTP admin endpoint `GET /<NodeName>/:command` that serves the module database as JSON to the editor UI.

### Module database (`modelData/moduleData.js`)

Single source of truth for hardware capabilities. Structure: category (`"Controller"`, `"I/O Module"`) → model name → `{ DI, DO, AI, AO, address: { DI, DO, AI, AO } }`, where the counts are channel counts (0 = unsupported) and `address` holds the Modbus base address per channel type (`null` = unsupported). **Supporting a new hardware model only requires adding an entry here** — the editor dropdowns pick it up automatically.

`moduleData1.js` and `moduleData copy.js` are stale variants/backups; only `moduleData.js` is required by the nodes.

### Editor side (`.html`)

In `oneditprepare`, each node fetches the module database via `$.getJSON("<NodeName>/0", ...)`, builds the model dropdown grouped by category (only listing models whose relevant channel count > 0), populates the pin dropdown from the channel count, and computes the read-only start address field as `address[type] + pin index`. Because models are nested under categories, lookups go through a `findModelInfo(modelName)` helper that searches all categories.

Note: `Read_DI.html` contains a leftover `debugger;` statement in `oneditprepare`.
