import { RAGERP } from "@api";
import { RageShared } from "@shared/index";
import { ITEM_CONFIG } from "./ArenaConfig";
import { getMatchByPlayer, ArenaMatchData } from "./ArenaMatch.manager";

type ItemType = "medkit" | "plate";

interface PlayerItemState {
    medkits: number;
    plates: number;
    casting: boolean;
    castTimeout: ReturnType<typeof setTimeout> | null;
}

const playerItems = new Map<number, PlayerItemState>();

export function initPlayerItems(playerId: number): void {
    playerItems.set(playerId, {
        medkits: ITEM_CONFIG.medkit.countPerRound,
        plates: ITEM_CONFIG.plate.countPerRound,
        casting: false,
        castTimeout: null
    });
    emitItemCounts(playerId);
}

export function clearPlayerItems(playerId: number): void {
    const state = playerItems.get(playerId);
    if (state?.castTimeout) clearTimeout(state.castTimeout);
    playerItems.delete(playerId);
}

export function cancelCast(playerId: number): void {
    const state = playerItems.get(playerId);
    if (!state) return;
    if (state.castTimeout) {
        clearTimeout(state.castTimeout);
        state.castTimeout = null;
    }
    state.casting = false;
    const p = mp.players.at(playerId);
    if (p && mp.players.exists(p)) {
        (RAGERP.cef.emit as Function)(p, "arena", "itemCastCancel", {});
    }
}

function emitItemCounts(playerId: number): void {
    const state = playerItems.get(playerId);
    if (!state) return;
    const p = mp.players.at(playerId);
    if (!p || !mp.players.exists(p)) return;
    (RAGERP.cef.emit as Function)(p, "arena", "itemCounts", {
        medkits: state.medkits,
        plates: state.plates
    });
}

export function useItem(player: PlayerMp, itemType: ItemType): void {
    const match = getMatchByPlayer(player);
    if (!match || match.state !== "active") return;

    const state = playerItems.get(player.id);
    if (!state) return;
    if (state.casting) {
        player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Already using an item.");
        return;
    }

    const count = itemType === "medkit" ? state.medkits : state.plates;

    if (count <= 0) {
        player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, `No ${itemType}s remaining.`);
        return;
    }

    if (itemType === "medkit" && player.health >= 100 + ITEM_CONFIG.medkit.maxHp) {
        player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Health is already full.");
        return;
    }
    if (itemType === "plate" && player.armour >= ITEM_CONFIG.plate.maxArmor) {
        player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Armor is already full.");
        return;
    }

    const castTime = itemType === "medkit" ? ITEM_CONFIG.medkit.castTime : ITEM_CONFIG.plate.castTime;

    state.casting = true;

    (RAGERP.cef.emit as Function)(player, "arena", "itemCastStart", {
        item: itemType,
        castTime
    });

    state.castTimeout = setTimeout(() => {
        state.casting = false;
        state.castTimeout = null;

        if (!mp.players.exists(player)) return;
        const currentMatch = getMatchByPlayer(player);
        if (!currentMatch || currentMatch.state !== "active") return;

        if (itemType === "medkit") {
            state.medkits--;
            const newHp = Math.min(100 + ITEM_CONFIG.medkit.maxHp, player.health + ITEM_CONFIG.medkit.heal);
            player.health = newHp;
        } else {
            state.plates--;
            const newArmor = Math.min(ITEM_CONFIG.plate.maxArmor, player.armour + ITEM_CONFIG.plate.armor);
            player.armour = newArmor;
        }

        emitItemCounts(player.id);
        (RAGERP.cef.emit as Function)(player, "arena", "itemCastComplete", { item: itemType });
    }, castTime);
}

RAGERP.cef.register("arena", "useItem", (player: PlayerMp, data: string) => {
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        const item = parsed?.item as ItemType;
        if (item === "medkit" || item === "plate") {
            useItem(player, item);
        }
    } catch {
        console.warn("[arena:useItem] Invalid data:", data);
    }
});
