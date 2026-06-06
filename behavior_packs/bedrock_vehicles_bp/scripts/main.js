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
