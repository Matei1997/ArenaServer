import { RAGERP } from "@api";
import { CharacterEntity } from "@entities/Character.entity";
import { CefEvent } from "@classes/CEFEvent.class";
import { RageShared } from "@shared/index";

function getClothesForPlayer(player: PlayerMp) {
    const clothes = (player.character?.appearance as any)?.clothes ?? {
        hats: { drawable: 0, texture: 0 },
        masks: { drawable: 0, texture: 0 },
        tops: { drawable: 15, texture: 0 },
        pants: { drawable: 21, texture: 0 },
        shoes: { drawable: 34, texture: 0 }
    };
    if (player.character?.gender === 1) {
        clothes.pants = clothes.pants ?? { drawable: 15, texture: 0 };
        clothes.shoes = clothes.shoes ?? { drawable: 35, texture: 0 };
    }
    return clothes;
}

function openWardrobe(player: PlayerMp) {
    if (!player.character) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "You must be logged in.");
    const clothes = getClothesForPlayer(player);
    CefEvent.emit(player, "wardrobe", "setClothes", clothes);
    RAGERP.cef.startPage(player, "wardrobe");
    RAGERP.cef.emit(player, "system", "setPage", "wardrobe");
}

RAGERP.commands.add({
    name: "clothing",
    aliases: ["clothes"],
    description: "Open clothing menu to change clothes",
    run: (player: PlayerMp) => openWardrobe(player)
});

RAGERP.cef.register("wardrobe", "open", async (player: PlayerMp) => openWardrobe(player));

RAGERP.cef.register("wardrobe", "getClothes", async (player: PlayerMp) => {
    if (!player.character) return;
    const clothes = getClothesForPlayer(player);
    CefEvent.emit(player, "wardrobe", "setClothes", clothes);
});

RAGERP.cef.register("wardrobe", "save", async (player: PlayerMp, data: string) => {
    if (!player.character) return;
    const clothes = RAGERP.utils.parseObject(data as any);
    (player.character.appearance as any).clothes = clothes;
    await RAGERP.database.getRepository(CharacterEntity).update(player.character.id, {
        appearance: player.character.appearance
    });
    player.call("client::wardrobe:applyClothes", [JSON.stringify(clothes)]);
    player.call("client::cef:close");
    player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Outfit saved!");
});

RAGERP.cef.register("wardrobe", "saveInline", async (player: PlayerMp, data: string) => {
    if (!player.character) return;
    const clothes = RAGERP.utils.parseObject(data as any);
    (player.character.appearance as any).clothes = clothes;
    await RAGERP.database.getRepository(CharacterEntity).update(player.character.id, {
        appearance: player.character.appearance
    });
    player.call("client::wardrobe:applyClothes", [JSON.stringify(clothes)]);
    player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Outfit saved!");
});

RAGERP.cef.register("wardrobe", "close", async (player: PlayerMp) => {
    player.call("client::cef:close");
});
