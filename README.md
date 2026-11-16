# Bedrock Vehicles, Aircraft & Utility Fleet

[![Minecraft Bedrock](https://img.shields.io/badge/Minecraft-Bedrock%201.21.60%2B-green.svg)](https://minecraft.net/)
[![Mojang Creator Tools](https://img.shields.io/badge/Tooling-mctools.dev-blue.svg)](https://mctools.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Creator](https://img.shields.io/badge/Creator-JustinBreulmann-orange.svg)](https://github.com/JustinBreulmann)

High-fidelity driveable vehicle collection (BMW E30, Hilux N50, Impala 81, Peterbilt 389, Porsche 959, Countach LP400, Firetruck, Spitfire Mk4, Jet Ski, Helicopters) with realistic physics, horns, fuel and mechanics

---

## 📦 Architektur & Übersicht

Dieses Repository ist Teil der modularen **Divide & Conquer**-Architektur für Minecraft Bedrock, modularisiert aus monolithischen Welten und ausgerichtet nach offiziellen Standards von [Mojang Creator Tools (mctools.dev)](https://mctools.dev/).

### Pack-Identifikatoren
- **Behavior Pack UUID**: `326866f7-e3ce-47bb-b34f-d2008dae1381`
- **Resource Pack UUID**: `c2a5ea5d-cddd-44d9-b2cb-0c6f944c98da`
- **Zielversion**: Minecraft Bedrock 1.21.0 - 1.21.60+ (Neueste Version)
- **Script Engine**: `@minecraft/server` v1.14.0+ / `@minecraft/server-ui` v1.3.0+

---

## 📂 Projektstruktur

```
bedrock-vehicles/
├── behavior_packs/
│   └── bedrock_vehicles_bp/
│       ├── manifest.json
│       └── scripts/
│           └── main.js
├── resource_packs/
│   └── bedrock_vehicles_rp/
│       ├── manifest.json
│       └── textures / models / sounds
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Bedrock Verlinkung

### Methode 1: Direkt in Minecraft-Welt verlinken (NTFS Junctions)
1. Repository klonen:
   ```bash
   git clone https://github.com/JustinBreulmann/bedrock-vehicles.git
   ```
2. Verzeichnis-Junctions erstellen:
   - Behavior Pack -> `<welt>/behavior_packs/bedrock_vehicles_bp`
   - Resource Pack -> `<welt>/resource_packs/bedrock_vehicles_rp`

### Methode 2: Globaler Development-Ordner
Verlinkung in `development_behavior_packs` bzw. `development_resource_packs` im `com.mojang`-Verzeichnis für weltübergreifendes Live-Testing.

---

## 🛠️ Entwicklung & Tooling
Unterstützt moderne Tooling-Standards kompatibel mit `@minecraft/creator-tools`:
```bash
npm install
npm test
```

## 📄 Lizenz
MIT License © Justin Breulmann
