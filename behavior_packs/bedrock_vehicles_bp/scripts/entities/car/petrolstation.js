import { world, Player, ItemStack, system, ItemTypes, BlockPermutation } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";
import { exception } from "../../exceptions/error";
import { addMoney } from "../../gameplay/money/animation";

export function petrolstation(player) {
	let canTake = player.getComponent('inventory').container.emptySlotsCount > 0
	if (!canTake) exception("NoItemEquiped", player, "")
	let form = new ModalFormData()
	form.title(` Tankstelle`)
	form.slider("Anzahl des Treibstoffs in 20 Liter", 1, 16, 1)
	form.show(player)
	form.then((response) => {
	  if (response.canceled) return
	
	let amount = response.formValues[0]
	let price = 200 * amount;

     new MessageFormData()
	.title("§l§eKauf bestätigen")
	.body(`Kaufe ${amount * 20} Liter Treibstoff für §e${price}${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}§r?`)
	.button1("§l§aBestätigen")
	.button2("§l§cAbbrechen")
	.show(player)
	.then((response) => {

    if (response.canceled) return
        if (response.selection == 1) {
            let playerMoney = player.getScore("Coins", player);
            if (price > playerMoney) {
				exception('NotEnoughMoney', player, price)
            } else {
                let inventory = player.getComponent('inventory').container;

                inventory.addItem(new ItemStack("minecraft:coal",amount));
                addMoney(player, -price)
                player.sendMessage(`§eDu hast §ax${amount} Liter Treibstoff§e für §a ${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} gekauft!`);
            		}
			}
		})
	}
	)
}
