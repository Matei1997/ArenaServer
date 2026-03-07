import { RAGERP } from "@api";
import { RageShared } from "@shared/index";
import { joinQueue, leaveQueue, vote } from "@arena/Arena.module";
import { leaveMatch } from "@arena/ArenaMatch.manager";
import { QUEUE_SIZES, QueueSize } from "@arena/ArenaConfig";

RAGERP.cef.register("arena", "joinQueue", async (player: PlayerMp, data: string) => {
    let size: QueueSize = 2;
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed && typeof parsed === "object" && parsed.size) {
            const s = Number(parsed.size);
            if ((QUEUE_SIZES as readonly number[]).includes(s)) size = s as QueueSize;
        } else if (typeof parsed === "number") {
            if ((QUEUE_SIZES as readonly number[]).includes(parsed)) size = parsed as QueueSize;
        }
    } catch { /* use default */ }

    if (joinQueue(player, size)) {
        RAGERP.cef.emit(player, "system", "setPage", "arena_lobby");
    }
});

RAGERP.cef.register("arena", "leaveQueue", async (player: PlayerMp) => {
    leaveQueue(player);
    RAGERP.cef.startPage(player, "mainmenu");
    RAGERP.cef.emit(player, "system", "setPage", "mainmenu");
});

RAGERP.cef.register("arena", "leaveMatch", async (player: PlayerMp) => {
    if (leaveMatch(player)) {
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, "Left arena match.");
    }
});

RAGERP.cef.register("arena", "vote", async (player: PlayerMp, data: string) => {
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        const mapId = typeof parsed === "object" && parsed?.mapId ? String(parsed.mapId) : null;
        if (mapId) vote(player, mapId);
    } catch {
        console.warn("[arena:vote] Invalid vote data:", data);
    }
});
