import { world, Player, ItemStack, system, ItemTypes, BlockPermutation } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";
import { getAvailableColors, getCarFromOption, getNearbyCars } from "./buy/impala";
import { getScore } from "../../extensions/module/getScore";
import { addMoney } from "../../gameplay/money/animation";

export let rent = {
	"81impala" : 180, //180 pro Stunde
	"hiluxn50" : 200, 
	"spitfiremk4" : 300,
	"bmw320ie30" : 350,
	"p959" :   400,
	"lp400s" : 450
}
export function miet(player) {

    let cars = Object.keys(rent);
    let price = Object.values(rent);
    let message = cars.map((car, index) => `${price[index]} Coins `);

    let actionForm = new ActionFormData();

    actionForm.title("§u§rFahrzeug mieten");
    actionForm.body(`§l§8Hier kannst du für eine gewisse Zeit ausleihen`);
    cars.forEach((car, index) => {
        actionForm.button(`${message[index]}`,"ui/car/" + index);
    });

    actionForm.show(player).then((response) => {
        if (response.canceled) return;
        else {
			const selectedCarIndex = response.selection; // Get the selected car's index from response
			
			const selectedCar = cars[selectedCarIndex]; // Get the content (car name) using the index
            const colors = getAvailableColors(selectedCar);

            let form = new ModalFormData();
			form.title(selectedCar)
            form.dropdown(`Wähle die Farbe`, colors);
			form.slider("Tage",1,30,1)
            form.show(player).then((response) => {
                if (response.canceled) return;
                else {
					const color = colors[response.formValues[0]];
					
					new MessageFormData()
					.title("§rMieten - Details")
					.body(`Bist du sicher, dass du  ${selectedCar} in der Farbe ${color} für ${response.formValues[1]} Tage mieten willst? \n\nPreis ${Math.round(rent[selectedCar] * parseFloat(response.formValues[1]))} Coins `)
					.button1("§4Ablehnen")
					.button2("§aBestätigen")
					.show(player)
					.then((confirmationResponse) => {
						if (confirmationResponse.canceled) return;

						if (confirmationResponse.selection == 1) {

							const existingCarData = world.getDynamicProperty("car_data");
							let carData = {};
							let carTags; // Declare carTags here
						  
							if (existingCarData) {
							  carData = existingCarData.includes(";") ? existingCarData.split(";").map(JSON.parse) : JSON.parse(existingCarData);
							  carTags = Object.keys(carData); // Assign value here
						  } else {
							  carData = {};
							  carTags = [];
						  }

							carTags.forEach((carTag) => {
								const { car, color, name, status, Versicherung, player: owner, rent } = carData[carTag];

								if (name.includes("MW-")) {
									player.sendMessage("§6§lMechaniker §8>> §r§7 Du besitzt bereits ein Mietwagen");
									return;
								}
							});

							const totalPrice = Math.round(rent[selectedCar] * parseFloat(response.formValues[1]));
								carData = {
									car: selectedCar,
									color: color,
									name: `MW-${player.name}`,
									status: "inGarage",
									Versicherung: false,
									player: player.name,
									rent: true
								
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
							
							world.scoreboard.getObjective('rent').setScore(player, response.formValues[1]* 24*60);
							addMoney(player, -totalPrice)
						}
					}
				)}
			}
		)}
	}
),20}