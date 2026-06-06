execute as @a[rxm=-90,rx=-25] at @s run effect @e[type=plane:helikopter,r=3,tag=hasrider,tag=!water,tag=!slow] levitation 1 12 true
execute as @a[rxm=-25,rx=-15] at @s run effect @e[type=plane:helikopter,r=3,tag=hasrider,tag=!water,tag=!slow] levitation 1 3 true
execute as @a[rxm=-15,rx=-5] at @s run effect @e[type=plane:helikopter,r=3,tag=hasrider,tag=!water,tag=!slow] levitation 1 2 true
execute as @a[rxm=-5,rx=20] at @s run effect @e[type=plane:helikopter,r=3,tag=hasrider,tag=!water,tag=!slow] levitation 1 1 true
execute as @a[rxm=20,rx=40] at @s run effect @e[type=plane:helikopter,r=5,tag=hasrider,tag=!slow] slow_falling 1 1 true
execute as @a[rxm=40,rx=80] at @s run effect @e[type=plane:helikopter,r=5,tag=hasrider,tag=!slow] slow_falling 1 3 true
execute as @a[rxm=-90,rx=90] at @s run effect @e[type=plane:helikopter,r=5,tag=hasrider,tag=!slow] speed 1 25 true
execute as @a[rxm=80,rx=90] at @s run effect @e[type=plane:helikopter,r=3,tag=hasrider,tag=!slow] clear

execute as @e[type=plane:helikopter] at @s if block ~~~ water run tag @s add water
effect @e[type=plane:helikopter,tag=slow] slowness 1 250 true
effect @e[type=plane:helikopter,tag=water] slowness 1 250 true
execute as @s[tag=!water] at @s run playsound block.smoker.smoke @a[r=10] ~~~ 0.5 1
