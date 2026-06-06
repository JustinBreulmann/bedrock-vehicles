import { world, Player, system, Dimension } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { getScore } from "../../extensions/module/getScore";
import { getTotaltime } from "../nametag";
export async function garagemenu(player) {
  try {
    const actionForm = new ActionFormData().title("§u§rGarage§r");
    actionForm.body("In der Garage kannst du Fahrzeuge einlagern, sie verwalten oder ausparken.")
    const carData = getOwnedCarData(player.name);

    displayCarButtons(actionForm, player, carData.ownedCars);

    const response = await actionForm.show(player);

    if (response.canceled) return;

    const selectedCar = carData.ownedCars[response.selection]; 

    const {id, car, color, name, status, Versicherung, player: owner } = selectedCar;

    if (status === "inGarage") {
      await handleTakeCarOutOfGarage(player, car, color, name, Versicherung);
    }

    if (status === "outGarage") {
      handleMoveCarIntoGarage(player, car, color, name, owner);
    }
  } catch (error) {
    console.error(`Error in garagemenu: ${error}`);
  }
}

export function getOwnedCarData(playerName) {
  const carDataString = world.getDynamicProperty("car_data");
  if (!carDataString) return { allCars: [], ownedCars: [] }; // Return an empty object if no data is available

  const carStrings = carDataString.split(';');
  const ownedCars = [];
  const allCars = [];

  carStrings.forEach((carString) => {
    if (carString) {
      const carData = JSON.parse(carString);
      allCars.push(carData);

      if (carData.player === playerName) {
        ownedCars.push(carData);
      }
    }
  });

  return { allCars, ownedCars };
}


function displayCarButtons(form, player, carData) {
  for (const carTag in carData) {
    if (carData.hasOwnProperty(carTag)) {
      const { car, color, name, status, rent } = carData[carTag];

      let buttonText = "";
      let Text = `§0§l${car}§r§0\n${color}\n${name}\n§r`;

      if (rent === true) {

        const { days, hours, minutes, seconds } = getTotaltime(player, "rent");

        Text = `§0${car}:${color} - ${hours}:${minutes}\n§r`;
      }

      if (status === "inGarage") {
        buttonText += "§f(§aIn der Garage§f)";
      } else if (status === "outGarage") {
        buttonText += "§f(§causgelagert§f)";
      } else {
        buttonText += "§f(§eundefined§f)";
      }

      form.button(Text + buttonText);
    }
  }
}



async function handleTakeCarOutOfGarage(player, car, color, name, Versicherung) {
  try {
    const res = await new MessageFormData()
      .title("§rGarage - Auslagern")
      .body(`§r§lBist du sicher, dass du ${car} ${name} auslagern willst?§r\n§8\nFahrzeug: ${car}\nFarbe: ${color}\nKennzeichen: ${name},\nVersichert: ${Versicherung}`)
      .button1("§4Ablehnen")
      .button2("§aBestätigen")
      .show(player);

    if (res.canceled) return;

    if (res.selection === 1) {
      let message = `\n§lFahrzeug\n§r-${car}-${name}\n\n\n`;
      const overworld = world.getDimension("overworld");
      let Vec = overworld.spawnEntity(car + ":" + color, player.location);
      Vec.nameTag = message.replace(/\\n/g, '\n');

      updateCarStatus(car, name, "outGarage");
    }
  } catch (error) {
    console.error(`Error in handleTakeCarOutOfGarage: ${error}`);
    // Fügen Sie hier geeignete Fehlerbehandlung hinzu, wenn benötigt
  }
}

function handleMoveCarIntoGarage(player, car, color, name, owner) {
  world.getDimension("overworld").getEntities({location: player.location,families: ['cars'],maxDistance: 5,excludeNames: [""]}).forEach((entity) => {
    if (entity !== player) {
      const playerLocation = player.location;
      const entityLocation = entity.location;
      const distance = Math.sqrt(
        Math.pow(playerLocation.x - entityLocation.x, 2) +
        Math.pow(playerLocation.y - entityLocation.y, 2) +
        Math.pow(playerLocation.z - entityLocation.z, 2)
      );

      if (distance <= 5 && entity.nameTag.startsWith("\n§lFahrzeug")) {
        const split = entity.nameTag.split("-");
        const carname = split[1];
        const number = split[2].replace("\n\n\n", "");

        if (owner === player.name && number === name) {
          updateCarStatus(car, name, "inGarage");
          entity.addTag("togarage");
          entity.remove();
        }
      }
    }
  });
}

function updateCarStatus(car, name, status) {
  const { allCars, ownedCars } = getOwnedCarData();

  for (const carData of allCars) {
    if (carData.car === car && carData.name === name) {
      if ('status' in carData) {
        carData.status = status;
      } else {
        console.warn('carData does not have a status property');
      }
    }
  }

  const allCarsString = allCars.map(carData => JSON.stringify(carData)).join(';');
  console.warn(allCarsString);

  world.setDynamicProperty("car_data", allCarsString);
}
