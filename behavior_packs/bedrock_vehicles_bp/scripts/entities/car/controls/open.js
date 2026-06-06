import {world, system } from "@minecraft/server";
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { ChestFormData } from "../../../extensions/forms";

export function opencar(item, entity, player) {
    const split = entity.nameTag.split("-");
    const carname = split[1];
	const number = split[2].replace("\n\n\n","")
    let carData = {};
    let carTags; // Declare carTags here

    const carDataString = world.getDynamicProperty("car_data");

    if (carDataString) {
        carData = carDataString.includes(";") ? carDataString.split(";").map(JSON.parse) : JSON.parse(carDataString);
        carTags = Object.keys(carData); // Assign value here
    } else {
        carData = {};
        carTags = [];
    }

    carTags.forEach((carTag) => {
        const { id, car, color, name, status, Versicherung, player: owner, rent } = carData[carTag];
		if (number === name) {
/*
        if (owner === player.name && !entity.typeId.includes("open") && !player.isRiding) {
			data.cancel = true

			let actionForm = new ActionFormData();
			actionForm.title(car + "-" + name);
			actionForm.body(`§l§8Hier kannst du für eine gewisse Zeit ausleihen`);


			const carEntiy = world.getEntity(entity)
			const seats = carEntiy.getComponent('rideable').getSeats()
			
			for (i = 0; i < seats; i++ ) {
				actionForm.button("Sitzplatz " + i)
			}
			actionForm.button("Geschwindigkeit ändern")

			actionForm.show(player).then((response) => {
				if (response.canceled) return;
			})
			
        }
*/
		if(!entity.typeId.includes("open") && owner !== player.name) {
			world.sendMessage("Das Fahrzeug ist verschlossen")
			data.cancel = false
		}
	  }
    });
}
