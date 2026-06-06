execute as @a[rxm=-90,rx=-25] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider,tag=!water] levitation 1 12 true
execute as @a[rxm=-25,rx=-15] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider,tag=!water] levitation 1 6 true
execute as @a[rxm=-15,rx=-5] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider,tag=!water] levitation 1 4 true
execute as @a[rxm=-5,rx=20] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider,tag=!water] levitation 1 1 true
execute as @a[rxm=21,rx=65] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider] slow_falling 1 6 true
execute as @a[rxm=-90,rx=90] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider,tag=!water,tag=!onground] speed 2 20 true
execute as @a[rxm=80,rx=90] at @s run effect @e[type=plane:smallplane,r=5,tag=hasrider] clear

execute as @s[tag=hasrider] run effect @p[r=5] speed 1 10 true
playsound block.beehive.work @a[r=10] ~~~ 0.3 0.3
execute as @s[type=plane:smallplane,tag=onground,tag=hasrider] run effect @s clear