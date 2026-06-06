import { world, Player, system } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { getNearbyCars, getAvailableColors, getCarFromOption } from "./buy/impala";
import {getOwnedCarData} from "./garage"
import { addMoney } from "../../gameplay/money/animation";

export function mechanic(player) {
  const nearbyCars = world.getDimension("overworld").getEntities({
    location: player.location,
    families: ['cars'],
    maxDistance: 5,
    excludeNames: [""]
  }).filter(entity => entity !== player && entity.nameTag.startsWith("\n§lFahrzeug"));

  for (const entity of nearbyCars) {
      const [carname, number] = entity.nameTag.split("-").slice(1).map(str => str.trim());
      const carData = getOwnedCarData(player.name);
      const selectedCar = carData.ownedCars.find(car => car.player === player.name && car.name === number);

      if (selectedCar) {
        handleCarEditing(player, selectedCar, entity);
      }
  }
}

function handleCarEditing(player, selectedCar, entity) {
  const carName = getCarName(selectedCar);
  const carOptions = getCarOptions(player);

  const form = new ModalFormData()
    .title(carName)
    .dropdown('Farbe', carOptions.colors)
    .textField('Kennzeichen', selectedCar.name)
    .toggle('Versichern', selectedCar.Versicherung);

  form.show(player).then(response => {
    const colorIndex = response.formValues[0];
    const newCarName = response.formValues[1];
    const isInsured = response.formValues[2];

    const selectedOption = carOptions.options[colorIndex].value;
    const selectedCarData = getCarFromOption(selectedOption);
    const car1 = `${selectedCar.car}:${selectedCarData.color}`;
    const message = `Fahrzeug-${selectedCar.car}-${newCarName}`;

    const overworld = world.getDimension(player.dimension.id);
    const vec = overworld.spawnEntity(car1, player.location);
    vec.nameTag = message.replace(/\\n/g, '\n');

    const carData = {
      car: selectedCar.car,
      color: selectedCarData.color,
      name: newCarName,
      status: "outGarage",
      Versicherung: isInsured,
      player: player.name,
      rent: false
    };

    world.setDynamicProperty("car_data", JSON.stringify(carData));
    entity.addTag("togarage");
    entity.kill();
  });
}

function getCarOptions(player) {
  const nearbyCars = getNearbyCars(player);
  const carOptions = { colors: [], options: [] };

  for (const car of nearbyCars) {
    const car1 = car.name.split(":")[0];
    carOptions.colors.push(...getAvailableColors(car.name).map(color => `${car1} - ${color}`));
    carOptions.options.push({ text: `${car1} - ${color}`, value: `${car.name} - ${color}` });
  }

  return carOptions;
}

function getCarName(selectedCar) {
  return selectedCar.car.split(":")[0];
}



export function sell(player) {
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

        const carDataString = world.getDynamicProperty("car_data");
        const carData = JSON.parse(carDataString);

        for (const carTag in carData) {
          const { car, color, name, status, Versicherung, player: owner, rent } = carData[carTag];
          if (owner === player.name) {
            const health = entity.getComponent("health");
            const maxHealth = 20;
            const minHealth = 1;
            const currentHealth = health.currentValue;
            const basePrice = getCarPrice(car); // Use the predefined function to get the base price
            const adjustedPrice = basePrice / 5 * (currentHealth - minHealth) / (maxHealth - minHealth);

            player.removeTag("sell");

            new MessageFormData()
              .title("§rMechaniker - Verkaufen")
              .body(`§r§lBist du sicher, dass du ${car} ${name} für ${Math.round(adjustedPrice)} verkaufen willst?§r\n§8\nFahrzeug: ${car}\nFarbe: ${color}\nKennzeichen: ${name},\nVersichert: ${Versicherung}`)
              .button1("§4Ablehnen")
              .button2("§aBestätigen")
              .show(player)
              .then((res) => {
                if (res.canceled) return;

                if (res.selection === 1) {
                  addMoney(player, adjustedPrice)
                  world.setDynamicProperty("car_data","");
                  entity.addTag("togarage")
                  entity.kill()
                }
              });
          }
        }
      }
      else 
      player.removeTag("sell")
    }
  },20);
}
