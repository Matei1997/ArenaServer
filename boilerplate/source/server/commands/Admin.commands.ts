import { RAGERP } from "@api";
import { AccountEntity } from "@entities/Account.entity";
import { CharacterEntity } from "@entities/Character.entity";
import { BanEntity } from "@entities/Ban.entity";
import { inventoryAssets } from "@modules/inventory/Items.module";
import { RageShared } from "@shared/index";
import { adminTeleports } from "@assets/Admin.asset";
import { NativeMenu } from "@classes/NativeMenu.class";

RAGERP.commands.add({
    name: "goto",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp, fulltext: string, targetorpos: string) => {
        const showAvailableLocations = () => {
            RAGERP.chat.sendSyntaxError(player, "/goto [player/location]");
            const keys = Object.keys(adminTeleports);
            for (let i = 0; i < keys.length; i += 8) {
                const chunk = keys.slice(i, i + 8);
                player.outputChatBox(`${RageShared.Enums.STRINGCOLORS.YELLOW}Available locations: ${RageShared.Enums.STRINGCOLORS.GREY} ${chunk.join(", ")}`);
            }
        };

        if (!fulltext.length || !targetorpos.length) {
            showAvailableLocations();
            return;
        }

        const targetplayer = mp.players.getPlayerByName(targetorpos);

        if (targetplayer && mp.players.exists(targetplayer)) {
            player.position = targetplayer.position;
            player.dimension = targetplayer.dimension;
            player.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `You teleported to ${targetplayer.name}`);
        } else {
            const targetpos = adminTeleports[targetorpos];
            if (targetpos) {
                player.position = targetpos;
                player.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `You teleported to ${targetorpos}`);
            } else {
                showAvailableLocations();
            }
        }
    }
});

RAGERP.commands.add({
    name: "gethere",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp, fulltext: string, target: string) => {
        if (!fulltext.length || !target.length) {
            return RAGERP.chat.sendSyntaxError(player, "/gethere [player]");
        }

        const targetplayer = mp.players.getPlayerByName(target);
        if (!targetplayer || !mp.players.exists(targetplayer) || !targetplayer.character) {
            return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player specified.");
        }

        if (targetplayer.vehicle) {
            targetplayer.vehicle.position = player.position;
            targetplayer.vehicle.dimension = player.dimension;
        }

        targetplayer.position = player.position;
        targetplayer.dimension = player.dimension;

        targetplayer.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `Admin ${player.name} has teleported you to their position.`);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `You teleported ${targetplayer.name} to your position.`);
    }
});

RAGERP.commands.add({
    name: "ah",
    aliases: ["adminhelp", "admincmds", "acmds"],
    adminlevel: 1,
    run: (player: PlayerMp) => {
        const adminCommandsByLevel: { [level: number]: string[] } = {};

        const adminLevels: { [key: number]: string } = {
            1: "!{#14AA0B}LEVEL 1",
            2: "!{#14AA0B}LEVEL 2",
            3: "!{#14AA0B}LEVEL 3",
            4: "!{#0C66D8}LEVEL 4",
            5: "!{#0C66D8}LEVEL 5",
            6: "!{#fa0339}LEVEL 6"
        };

        RAGERP.commands
            .getallCommands()
            .filter((cmd) => {
                return player.account && typeof cmd.adminlevel === "number" && cmd.adminlevel > 0 && cmd.adminlevel <= player.account.adminlevel;
            })
            .forEach((cmd) => {
                if (!cmd.adminlevel) return;
                if (!adminCommandsByLevel[cmd.adminlevel]) {
                    adminCommandsByLevel[cmd.adminlevel] = [];
                }
                adminCommandsByLevel[cmd.adminlevel].push(`/${cmd.name}`);
            });

        player.outputChatBox("!{red}____________[ADMIN COMMANDS]____________");
        for (const level in adminCommandsByLevel) {
            if (adminCommandsByLevel.hasOwnProperty(level)) {
                const commands = adminCommandsByLevel[level];
                const itemsPerLog = 5;
                for (let i = 0; i < commands.length; i += itemsPerLog) {
                    const endIndex = Math.min(i + itemsPerLog, commands.length);
                    const currentItems = commands.slice(i, endIndex);

                    player.outputChatBox(`${adminLevels[level]}!{white}: ${currentItems.join(", ")}`);
                }
            }
        }
    }
});

RAGERP.commands.add({
    name: "a",
    aliases: ["adminchat"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp, fulltext: string) => {
        if (!fulltext.length) return RAGERP.chat.sendSyntaxError(player, "/a [text]");

        const admins = mp.players.toArray().filter((x) => x.account && x.account.adminlevel > 0);

        admins.forEach((admin) => {
            admin.outputChatBox(`!{#ffff00}[A] ${player.name}: ${fulltext}`);
        });
    }
});

RAGERP.commands.add({
    name: "admins",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp) => {
        player.outputChatBox(`${RageShared.Enums.STRINGCOLORS.GREEN}____________[ONLINE ADMINS]____________`);
        mp.players.forEach((target) => {
            if (target && target.account && target.account.adminlevel) {
                player.outputChatBox(`${target.name} as level ${target.account.adminlevel} admin.`);
            }
        });
    }
});

RAGERP.commands.add({
    name: "veh",
    aliases: ["vehicle", "spawnveh", "spawncar"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp, fullText: string, vehicleModel: string) => {
        if (!fullText.length || !vehicleModel.length) return RAGERP.chat.sendSyntaxError(player, "/veh [vehiclemodel]");

        const vehicle = new RAGERP.entities.vehicles.new(RageShared.Vehicles.Enums.VEHICLETYPES.ADMIN, vehicleModel, player.position, player.heading, player.dimension);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `Successfully spawned ${vehicleModel} (${vehicle.getId()})`);
        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} (${player.id}) has spawned a vehicle (Model: ${vehicleModel} | ID: ${vehicle.getId()}).`);
    }
});

RAGERP.commands.add({
    name: "dim",
    aliases: ["setdimension", "setdim"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp, fullText: string, target: string, dimension: string) => {
        if (!fullText.length || !target.length || !dimension.length) return RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");

        const parseTarget = parseInt(target);
        if (isNaN(parseTarget)) return RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");

        const parseDimension = parseInt(dimension);
        if (isNaN(parseDimension)) return RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");

        const targetPlayer = mp.players.at(parseTarget);
        if (!targetPlayer || !mp.players.exists(targetPlayer)) return RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");

        targetPlayer.dimension = parseDimension;

        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `You've successfully changed ${targetPlayer.name} dimension to ${parseDimension}`);
        targetPlayer.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `Administrator ${player.name} changed your dimension to ${parseDimension}`);
    }
});
RAGERP.commands.add({
    name: "makeadmin",
    aliases: ["setadmin"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    description: "Make a player admin",
    run: async (player: PlayerMp, fullText: string, target: string, level: string) => {
        if (!fullText.length || !target.length || !level.length) return RAGERP.chat.sendSyntaxError(player, "/makeadmin [target] [level]");
        const targetId = parseInt(target);
        const adminLevel = parseInt(level);

        if (adminLevel < 0 || adminLevel > 6) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Admin level must be between 0 and 6");

        const targetPlayer = mp.players.at(targetId);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.account) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player specified.");

        targetPlayer.account.adminlevel = adminLevel;
        targetPlayer.setVariable("adminLevel", adminLevel);
        await RAGERP.database.getRepository(AccountEntity).update(targetPlayer.account.id, { adminlevel: adminLevel });
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `You've successfully made ${targetPlayer.name} an admin level ${adminLevel}`);
        targetPlayer.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `${player.name} has made you an admin level ${adminLevel}`);

        RAGERP.chat.sendAdminWarning(
            RageShared.Enums.HEXCOLORS.LIGHTRED,
            adminLevel > 0
                ? `AdmWarn: ${player.name} (${player.id}) has made ${targetPlayer.name} (${targetPlayer.id}) a level ${adminLevel} admin.`
                : `AdmWarn: ${player.name} (${player.id}) has removed ${targetPlayer.name} admin level.`
        );

        RAGERP.commands.reloadCommands(targetPlayer);
    }
});

RAGERP.commands.add({
    name: "spectate",
    aliases: ["spec"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Spectate a player",
    run: (player: PlayerMp, fullText: string, target) => {
        if (fullText.length === 0) return player.outputChatBox("Usage: /spectate [target/off]");

        const parsedTarget = parseInt(target);

        if (isNaN(parsedTarget) && target === "off") {
            player.call("client::spectate:stop");
            player.setVariable("isSpectating", false);
            if (player.lastPosition) player.position = player.lastPosition;
            return;
        }

        const targetPlayer = mp.players.at(parsedTarget);
        if (!targetPlayer || !mp.players.exists(targetPlayer)) return;

        if (targetPlayer.id === player.id) return player.outputChatBox("You can't spectate yourself.");

        if (!player || !mp.players.exists(player)) return;

        if (player.getVariable("isSpectating")) {
            player.call("client::spectate:stop");
            if (player.lastPosition) player.position = player.lastPosition;
        } else {
            player.lastPosition = player.position;
            player.position = new mp.Vector3(targetPlayer.position.x, targetPlayer.position.y, targetPlayer.position.z - 15);
            if (!player || !mp.players.exists(player) || !targetPlayer || !mp.players.exists(targetPlayer)) return;
            player.call("client::spectate:start", [target]);
        }
        player.setVariable("isSpectating", !player.getVariable("isSpectating"));
    }
});

RAGERP.commands.add({
    name: "destroyveh",
    aliases: ["destroyvehicles", "destroycar", "destroycars"],
    description: "Destroy admin spawned vehicles",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp) => {
        if (player.vehicle) {
            const vehicleData = RAGERP.entities.vehicles.manager.at(player.vehicle.id);
            if (!vehicleData) return;
            vehicleData.destroy();
            return;
        }
        const adminVehicles = RAGERP.entities.vehicles.pool.filter((x) => x.type === RageShared.Vehicles.Enums.VEHICLETYPES.ADMIN);
        adminVehicles.forEach((vehicle) => vehicle.destroy());
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `You've successfully deleted all admin spawned vehicles.`);
        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} (${player.id}) has destroyed all admin spawned vehicles.`);
    }
});

RAGERP.commands.add({
    name: "revive",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Revive a player",
    run: async (player: PlayerMp, fulltext: string, target: string) => {
        if (!fulltext.length || !target.length) return player.outputChatBox("Usage: /revive [targetplayer]");

        const parseTarget = parseInt(target);
        if (isNaN(parseTarget)) return player.outputChatBox("Usage: /revive [targetplayer]");

        const targetPlayer = mp.players.getPlayerByName(target);

        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.character) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player specified.");
        if (targetPlayer.character.deathState !== RageShared.Players.Enums.DEATH_STATES.STATE_INJURED) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "That player is not injured.");

        targetPlayer.spawn(targetPlayer.position);
        targetPlayer.character.deathState = RageShared.Players.Enums.DEATH_STATES.STATE_NONE;

        targetPlayer.character.setStoreData(player, "isDead", false);
        targetPlayer.setVariable("isDead", false);
        targetPlayer.stopScreenEffect("DeathFailMPIn");
        targetPlayer.stopAnimation();

        await targetPlayer.character.save(targetPlayer);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `You successfully revived ${targetPlayer.name}`);
        targetPlayer.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `You were revived by admin ${player.name}`);
        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} (${player.id}) has revived player ${targetPlayer.name} (${targetPlayer.id}).`);
    }
});

RAGERP.commands.add({
    name: "givemoney",
    aliases: ["givecash"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, target: string, amount: string) => {
        if (!fulltext.length || !target.length || !amount.length) return RAGERP.chat.sendSyntaxError(player, "/givemoney [player] [amount]");

        const targetPlayer = mp.players.getPlayerByName(target);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.character) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player specified.");

        const money = parseInt(amount);
        if (isNaN(money) || money > 50000000) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid amount of money specified.");

        targetPlayer.giveMoney(money);

        targetPlayer.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, `You received ${money} cash from admin ${player.name}`);
        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} (${player.id}) has given ${targetPlayer.name} (${targetPlayer.id}) $${money}.`);
    }
});

RAGERP.commands.add({
    name: "giveclothes",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, target: string, item: RageShared.Inventory.Enums.ITEM_TYPES, comp: string, drawable: string, texture: string) => {
        if (!fulltext.length || !target.length || !item.length || !comp.length || !drawable.length || !texture.length) {
            player.outputChatBox(`Usage: /giveclothes [player] [cloth_name] [component] [drawable] [texture]`);
            player.outputChatBox(
                `Clothing Names: ${Object.values(inventoryAssets.items)
                    .filter((x) => x.typeCategory === RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING)
                    .map((e) => e.type.toLowerCase())
                    .join(", ")}`
            );
            return;
        }

        const targetplayer = mp.players.getPlayerByName(target);
        if (!targetplayer || !mp.players.exists(targetplayer) || !targetplayer.character || !targetplayer.character.inventory)
            return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player specified.");

        const itemData = targetplayer.character.inventory.addClothingItem(item, { component: parseInt(comp), drawable: parseInt(drawable), texture: parseInt(texture) });

        targetplayer.showNotify(
            itemData ? RageShared.Enums.NotifyType.TYPE_SUCCESS : RageShared.Enums.NotifyType.TYPE_ERROR,
            itemData ? `You received a ${itemData.name}` : `An error occurred giving u the item.`
        );
        player.showNotify(
            itemData ? RageShared.Enums.NotifyType.TYPE_SUCCESS : RageShared.Enums.NotifyType.TYPE_ERROR,
            itemData ? `You gave a ${itemData.name} to ${targetplayer.name} (${targetplayer.id})` : `An error occurred giving the item to ${targetplayer.name}.`
        );
    }
});

RAGERP.commands.add({
    name: "giveitem",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, target: string, item: RageShared.Inventory.Enums.ITEM_TYPES, count: string) => {
        if (!fulltext.length || !target.length || !item.length) return player.outputChatBox("Usage: /giveitem [player] [item type] [count]");

        const targetplayer = mp.players.getPlayerByName(target);

        if (!targetplayer || !mp.players.exists(targetplayer) || !targetplayer.character || !targetplayer.character.inventory) {
            return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player specified.");
        }
        const itemData = targetplayer.character.inventory.addItem(item);

        if (itemData) {
            itemData.count = isNaN(parseInt(count)) ? 0 : parseInt(count);
            if (!itemData.options.includes("split") && itemData.count > 1) itemData.options.push("split");
        }
        targetplayer.showNotify(
            itemData ? RageShared.Enums.NotifyType.TYPE_SUCCESS : RageShared.Enums.NotifyType.TYPE_ERROR,
            itemData ? `You received a ${itemData.name} (x${itemData.count}) from admin ${player.name}` : `An error occurred giving u the item.`
        );
        player.showNotify(
            itemData ? RageShared.Enums.NotifyType.TYPE_SUCCESS : RageShared.Enums.NotifyType.TYPE_ERROR,
            itemData ? `You spawned a ${itemData.name} (x${itemData.count}) to ${targetplayer.name} (${targetplayer.id})` : `An error occurred giving the item.`
        );
    }
});

RAGERP.commands.add({
    name: "spawnitem",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: async (player: PlayerMp) => {
        const filteredItems = Object.values(inventoryAssets.items).filter(
            item => item.typeCategory !== RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING &&
                item.typeCategory !== RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP
        );

        const menuItems = filteredItems.map((item, index) => ({
            uid: index,
            type: RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT,
            name: item.name,
        }));

        player.nativemenu = new NativeMenu(player, 1, "Item Spawn", "Select an item to spawn", menuItems);

        try {
            const selectedData = await player.nativemenu.onItemSelected(player);
            if (!selectedData) {
                player.nativemenu?.destroy(player);
                return;
            }

            const selectedItemData = RAGERP.utils.parseObject(selectedData);
            const selectedItem = filteredItems.find(item => item.name === selectedItemData.name);

            if (!selectedItem) {
                player.nativemenu?.destroy(player);
                return;
            }

            player.character?.inventory?.addItem(selectedItem.type);
            player.nativemenu?.destroy(player);

            RAGERP.chat.sendAdminWarning(
                RageShared.Enums.HEXCOLORS.LIGHTRED,
                `${player.name} has spawned a ${selectedItemData.name}`
            );
        } catch (error) {
            console.error("Error handling menu selection:", error);
            player.nativemenu?.destroy(player);
        }
    }
});

RAGERP.commands.add({
    name: "listplayers",
    aliases: ["players", "online"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "List all online players",
    run: (player: PlayerMp) => {
        player.outputChatBox(`${RageShared.Enums.STRINGCOLORS.GREEN}____________[ONLINE PLAYERS]____________`);
        mp.players.forEach((p) => {
            if (p && mp.players.exists(p)) {
                const charName = p.character?.name ?? "N/A";
                player.outputChatBox(`ID ${p.id} | ${p.name} | ${charName} | Ping: ${p.ping} | Dim: ${p.dimension}`);
            }
        });
        player.outputChatBox(`${RageShared.Enums.STRINGCOLORS.GREEN}Total: ${mp.players.length} players`);
    }
});

RAGERP.commands.add({
    name: "kick",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Kick a player",
    run: (player: PlayerMp, fulltext: string, target: string, ...reasonParts: string[]) => {
        if (!target) return RAGERP.chat.sendSyntaxError(player, "/kick [player_id] [reason]");
        const targetId = parseInt(target);
        if (isNaN(targetId)) return RAGERP.chat.sendSyntaxError(player, "/kick [player_id] [reason]");

        const targetPlayer = mp.players.at(targetId);
        if (!targetPlayer || !mp.players.exists(targetPlayer)) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player.");

        const reason = reasonParts.join(" ") || "No reason specified";
        targetPlayer.outputChatBox(`!{#ff0000}You have been kicked by ${player.name}: ${reason}`);

        setTimeout(() => {
            if (mp.players.exists(targetPlayer)) targetPlayer.kick(reason);
        }, 500);

        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} kicked ${targetPlayer.name} (${targetPlayer.id}). Reason: ${reason}`);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `Kicked ${targetPlayer.name}.`);
    }
});

RAGERP.commands.add({
    name: "ban",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_TWO,
    description: "Ban a player",
    run: async (player: PlayerMp, fulltext: string, target: string, ...reasonParts: string[]) => {
        if (!target) return RAGERP.chat.sendSyntaxError(player, "/ban [player_id] [reason] [duration_hours optional]");
        const targetId = parseInt(target);
        if (isNaN(targetId)) return RAGERP.chat.sendSyntaxError(player, "/ban [player_id] [reason]");

        const targetPlayer = mp.players.at(targetId);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.account) {
            return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid player.");
        }

        const reason = reasonParts.join(" ") || "No reason specified";

        const ban = new BanEntity();
        ban.username = targetPlayer.account.username;
        ban.ip = targetPlayer.ip;
        ban.serial = targetPlayer.serial ?? null as any;
        ban.rsgId = targetPlayer.socialClub ?? null as any;
        ban.reason = reason;
        ban.bannedBy = player.name;
        ban.bannedByLevel = player.account?.adminlevel ?? 0;
        ban.lifttime = null as any;

        await RAGERP.database.getRepository(BanEntity).save(ban);

        targetPlayer.outputChatBox(`!{#ff0000}You have been banned by ${player.name}: ${reason}`);
        setTimeout(() => {
            if (mp.players.exists(targetPlayer)) targetPlayer.kick(`Banned: ${reason}`);
        }, 500);

        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} banned ${targetPlayer.name}. Reason: ${reason}`);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `Banned ${targetPlayer.name}.`);
    }
});

RAGERP.commands.add({
    name: "unban",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_TWO,
    description: "Unban a player by username",
    run: async (player: PlayerMp, fulltext: string, identifier: string) => {
        if (!identifier) return RAGERP.chat.sendSyntaxError(player, "/unban [username]");

        const ban = await RAGERP.database.getRepository(BanEntity).findOne({ where: { username: identifier } });
        if (!ban) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, `No ban found for "${identifier}".`);

        await RAGERP.database.getRepository(BanEntity).remove(ban);
        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} unbanned ${identifier}.`);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `Unbanned ${identifier}.`);
    }
});

RAGERP.commands.add({
    name: "vanish",
    aliases: ["invisible"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Toggle invisibility",
    run: (player: PlayerMp) => {
        const isVanished = player.getVariable("vanished") ?? false;
        player.setVariable("vanished", !isVanished);
        if (!isVanished) {
            player.alpha = 0;
            player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Vanish ON — you are invisible.");
        } else {
            player.alpha = 255;
            player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Vanish OFF — you are visible.");
        }
        RAGERP.chat.sendAdminWarning(RageShared.Enums.HEXCOLORS.LIGHTRED, `AdmWarn: ${player.name} toggled vanish ${!isVanished ? "ON" : "OFF"}.`);
    }
});

RAGERP.commands.add({
    name: "bird",
    aliases: ["freecam"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Toggle bird's-eye freecam (uses noclip)",
    run: (player: PlayerMp) => {
        const isNoclip = player.getVariable("noclip") ?? false;
        if (isNoclip) {
            player.setVariable("noclip", false);
            player.call("client::noclip:stop");
            player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Bird mode OFF.");
        } else {
            player.setVariable("noclip", true);
            player.alpha = 0;
            player.setVariable("adminLevel", player.account?.adminlevel ?? 1);
            mp.players.forEach((p) => {
                if (p.id !== player.id && mp.players.exists(p)) {
                    p.call("client::player:noclip", [player.id, true]);
                }
            });
            player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Bird mode ON. Press F5 or use /birdoff to exit.");
        }
    }
});

RAGERP.commands.add({
    name: "birdoff",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Disable bird mode",
    run: (player: PlayerMp) => {
        player.setVariable("noclip", false);
        player.call("client::noclip:stop");
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Bird mode OFF.");
    }
});

RAGERP.commands.add({
    name: "specoff",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    description: "Stop spectating",
    run: (player: PlayerMp) => {
        player.call("client::spectate:stop");
        player.setVariable("isSpectating", false);
        if (player.lastPosition) player.position = player.lastPosition;
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Stopped spectating.");
    }
});
