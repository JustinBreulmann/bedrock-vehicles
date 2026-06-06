import {world, system } from "@minecraft/server";

export function horn () {
for (const player of world.getPlayers()) {
	const getRide = (entity) => {
		return entity.getComponent("minecraft:riding")?.entityRidingOn;
	}
	const ride = getRide(player);
	if (ride) {
		if (getRide(player).typeId === "minecraft:minecart") return


		if(player.isJumping ) {
			player.playSound("vehicle.pb389.horn")
			}
		}
	}
}