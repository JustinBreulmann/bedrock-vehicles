import { world, Player, ItemStack, system, ItemTypes, BlockPermutation } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";
import { getScore } from "../../../extensions/module/getScore";
import { exception } from "../../../exceptions/error";
import { addMoney } from "../../../gameplay/money/animation";


export function getAvailableColors(carName) {
  let vehicleName;
  if (carName.includes(":")) {
    vehicleName = carName.split(":")[0];
  }
  else vehicleName = carName

  if (vehicleName === "81impala") {
    return ["red", "black", "gray"];
  } else if (vehicleName === "lp400s") {
    return ["black", "orange", "red", "silver", "white", "yellow"];
  } else if (vehicleName === "bmw320ie30") {
    return ["black", "gray", "red", "silver", "white"];
  } else if (vehicleName === "spitfiremk4") {
    return ["green", "black", "orange", "white", "blue"];
  } else if (vehicleName === "p959") {
    return ["green", "orange", "red", "silver", "white"];
  } else if (vehicleName === "hiluxn50") {
    return ["black", "blue", "red", "white", "white-LKW"];
  } else {
    return [];
  }
}

export function getCarPrice(car) {
  let vehicleName;

  if (typeof car === 'string') {
    // If car is a string, assume it's the car name
    vehicleName = car;
  } else if (car && typeof car === 'object' && car.name) {
    // If car is an object with a name property, use that
    vehicleName = car.name;
  } else {
    // Invalid input, return 0
    return 0;
  }

  if (vehicleName.includes(":")) {
    // Split the car name if it contains a colon
    vehicleName = vehicleName.split(":")[0];
  }

  if (vehicleName === "81impala") {
    return 10000;
  } else if (vehicleName === "lp400s") {
    return 30000;
  } else if (vehicleName === "bmw320ie30") {
    return 20000;
  } else if (vehicleName === "spitfiremk4") {
    return 50000;
  } else if (vehicleName === "p959") {
    return 70000;
  } else if (vehicleName === "hiluxn50") {
    return 25000;
  } else {
    return 0;
  }
}



export function getCarSpeed(car) {
  const vehicleName = car.name.split(":")[0];

  if (vehicleName === "81impala") {
    return 35;
  } else if (vehicleName === "lp400s") {
    return 50;
  } else if (vehicleName === "bmw320ie30") {
    return 40;
  } else if (vehicleName === "spitfiremk4") {
    return 35;
  } else if (vehicleName === "p595") {
    return 50;
  } else if (vehicleName === "hiluxn50") {
    return 50;
  } else {
    return 0;
  }
}

export function getNearbyCars(player) {
  const nearbyCars = [];
  const playerLocation = player.location;


  world.getDimension("overworld").getEntities({location: player.location,maxDistance: 5,}).forEach((entity) => {
    if (entity !== player) {
      const entityLocation = entity.location;
      const distance = Math.sqrt(
        Math.pow(playerLocation.x - entityLocation.x, 2) +
          Math.pow(playerLocation.y - entityLocation.y, 2) +
          Math.pow(playerLocation.z - entityLocation.z, 2)
      );

      if (distance <= 3) {
        const carName = entity !== undefined ? entity.typeId : "";

        if (carName) {
          nearbyCars.push({
            name: carName,
            color: getAvailableColors(carName),
          });
        }
      }
    }
  });

  return nearbyCars;
}

export function getCarFromOption(option) {
  const [carName, color] = option.split(" - ");
  return {
    name: carName.split(":")[0],
    color: color,
  };
}

export function buy(player) {

    let form = new ModalFormData();

    let nearbyCars = getNearbyCars(player);
    let carOptions = [];
    let carName = "";

    nearbyCars.forEach((car) => {
      let car1 = car.name.split(":")[0];
      carName += car1;
      let carColors = getAvailableColors(car.name);
      carColors.forEach((color) => {
        carOptions.push({ text: `${car1} - ${color}`, value: `${car.name} - ${color}` });
      });
    });

    form.title(carName.split(":")[0]);
    form.dropdown(
      `§lFahrzeug§r\n${getCarPrice(nearbyCars[0])} Coins \n${getCarSpeed(nearbyCars[0])} km/h`,
      carOptions
    );
    form.textField("Kennzeichen", "Wird als Name gespeichert");
    form.toggle("Versichern");
    form.show(player).then((response) => {

      let selectedIndex = response.formValues[0];
      let selectedOption = carOptions[selectedIndex].value;
      let selectedCar = getCarFromOption(selectedOption);
      let carPrice = getCarPrice(selectedCar);

      if (getScore(player, "Coins") < carPrice) {
          exception('NotEnoughMoney', player, carPrice)
        return;
      }
      let licensePlate = response.formValues[1];

      if (licensePlate.length < 5 || licensePlate.length > 10 || !/^[0-9a-zA-Z]+$/.test(licensePlate)) {
        player.sendMessage("§6§lMechaniker §8>> §r§7 Das Kennzeichen muss zwischen 5 und 10 Zeichen lang sein und darf nur Buchstaben und Zahlen enthalten.");
        return; // Abbruch des Kaufvorgangs bei ungültigem Kennzeichen
      }
      const existingCarData = world.getDynamicProperty("car_data");
      let carData =  existingCarData !== "" ? existingCarData : "";

      // Define the carTag here before using it
      const uniqueString = `${selectedCar.name}-${selectedCar.color}-${response.formValues[1]}-${player.name}`;
      const hashCarTag = `${hashCode(uniqueString)}`;
      if (carData.name === selectedCar.name && existingCarData) {
        player.sendMessage("§6§lMechaniker §8>> §r§7 Kennzeichen schon vergeben"); // Handle duplicate car creation
        return;
      } else {

        if (getScore(player, "Coins") >= carPrice) {
          addMoney(player, -carPrice)
        }

        // Create a hash function (you can use your preferred hash function)
        carData = {
          id: hashCarTag,
          car: selectedCar.name,
          color: selectedCar.color,
          name: response.formValues[1],
          status: "inGarage",
          Versicherung: response.formValues[2],
          player: player.name,
          rent: false
        };
        if (existingCarData) {
          let existingCarDataString = existingCarData;
          let carDataString = JSON.stringify(carData);
          let car = carDataString.replace('\'',"") 
          let existingCar = existingCarDataString.replace('\'',"") 
  
        world.setDynamicProperty("car_data", car + ";" + existingCar);
        }
        else {
          let carDataString = JSON.stringify(carData);
          let car = carDataString.replace('\'',"") 
          world.setDynamicProperty("car_data", car);
          
        }
      }
    });
  }



function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash;
}