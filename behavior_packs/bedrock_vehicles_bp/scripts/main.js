import { world, system } from "@minecraft/server";
import { horn } from "./entities/car/controls/horn.js";
import { WhileDriving, getRide } from "./entities/car/controls/onUse.js";

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const ride = getRide(player);
        if (ride) {
            WhileDriving();
            if (player.isJumping) {
                horn();
            }
        }
    }
}, 5);

console.warn("[Bedrock Vehicles] Fahrzeugphysik und Steuerung aktiv.");

// Build-Trace #41: Datei neu formatiert

// Build-Trace #42: Imports bereinigt

// Build-Trace #43: Formatierung und Kommentare angepasst

// Build-Trace #44: Formatierung und Kommentare angepasst

// Build-Trace #45: kleine Performance-Optimierung im Tick-Loop
