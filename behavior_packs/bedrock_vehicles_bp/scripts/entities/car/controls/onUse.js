import {world, system } from "@minecraft/server"
import {getTotaltime} from "../../nametag"
import { getScore } from "../../../extensions/module/getScore";

export const getRide = (entity) => {
	return entity.getComponent("minecraft:riding")?.entityRidingOn;

}

export function WhileDriving() {
	const players = world.getPlayers()
	
	players.forEach(player=> {


	const ride = getRide(player);
	if (ride) {
		if (getRide(player).typeId === "minecraft:minecart") return
		const timeleft = getScore(player, "rent");
		

		const { days, hours, minutes, seconds } = getTotaltime(player, "rent");

		const carDataString = world.getDynamicProperty("car_data");

		let carData = {};
	
		if (carDataString) {
			carData = (carDataString);
		} else {
			carData = {};
		}
	
		const carTags = Object.keys(carData);

		carTags.forEach((carTag) => {
			const { car, color, name, status, Versicherung, player: owner, rent } = carData[carTag];

		if (timeleft == 2 && status === "inGarage") {
			carData[carTag] = 
			world.setDynamicProperty("car_data", carData);

		}
		if (getRide(player).nameTag.includes(`MW-${player.name}`) && (timeleft == 0)) {
			player.sendMessage("§6§lMechaniker §8>> §r§7 Die Zeit deines Mietwagens ist abgelaufen")
			world.scoreboard.getObjective('rent').setScore(player, 0);
			ride.addTag("togarage")
			carData[carTag] = 
			ride.remove()
			world.setDynamicProperty("car_data", carData);
			}
		})
		const xTags = player.getTags().filter(t => t.startsWith("x:"));
		const zTags = player.getTags().filter(t => t.startsWith("z:"));

		const dx = xTags.length > 0 ? parseInt(xTags[0].replace("x:", "")) - Math.round(player.location.x) : 0;
		const dz = zTags.length > 0 ? parseInt(zTags[0].replace("z:", "")) - Math.round(player.location.z) : 0;

		const distance = Math.sqrt(dx * dx + dz * dz);
		const distance1 = Math.floor(distance);

		const { x, z } = player.getVelocity();
		const speed = Math.sqrt(x ** 2 + z ** 2) * 20;
		const kmh = Math.floor(speed * 3.6);

		if (distance1 <= 1) {
			if (xTags.length > 0) {
				player.removeTag(xTags[0]);
			}
			if (zTags.length > 0) {
				player.removeTag(zTags[0]);
			}
		}

		if (xTags.length > 0 || zTags.length > 0) {
			player.onScreenDisplay.setActionBar("§6Geschwindigkeit:§a " + kmh + "km/h§6 | Treibstoff: §a" + fuel + "§6 | Entfernung: §a" + distance1 + "M");
		} else {
				if (ride.nameTag.includes("MW-")) {
			player.onScreenDisplay.setActionBar("§6Geschwindigkeit:§a " + kmh + "km/h§6 | Treibstoff: §a" + fuel + "§6 | §6Mietzeit: §a" + hours + "h " + minutes + "m " + seconds + "s");
				}
				else {
					player.onScreenDisplay.setActionBar("§6Geschwindigkeit:§a " + kmh + "km/h§6 | Treibstoff: §a" + fuel + "§6 | Fahrzeug: §a" + ride.typeId)
				}
			}
	} 

	else {
		const xTags = player.getTags().filter(t => t.startsWith("x:"));
		const zTags = player.getTags().filter(t => t.startsWith("z:"));

		if (xTags.length === 0 || zTags.length === 0) {
			return;
		}

		const dx = xTags.length > 0 ? parseInt(xTags[0].replace("x:", "")) - Math.round(player.location.x) : 0;
		const dz = zTags.length > 0 ? parseInt(zTags[0].replace("z:", "")) - Math.round(player.location.z) : 0;

		const distance = Math.sqrt(dx * dx + dz * dz);
		const distance1 = Math.floor(distance);

		if (distance1 <= 1) {
			if (xTags.length > 0) {
				player.removeTag(xTags[0]);
			}
			if (zTags.length > 0) {
				player.removeTag(zTags[0]);
			}
		}

		player.onScreenDisplay.setActionBar("§cEntfernung §7(" + distance1 + "M)\n");
	}
})
}


//const { fuel, kilometer, door, tunk, light, blinker} = entity.getDynamicProperty("vehicle")
	//blinker 1 : right, 2 : left , 3 : both, 0 : out
	//door true/false
	//tunk true/false
	//lights true/false