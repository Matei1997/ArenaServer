import { RAGERP } from "@api";
import { RageShared } from "@shared/index";

RAGERP.cef.register("mainmenu", "playFreeroam", async (player: PlayerMp) => {
    if (!player.character) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "No character loaded.");
    player.call("client::cef:close");
});

RAGERP.cef.register("mainmenu", "playArena", async (player: PlayerMp) => {
    player.showNotify(RageShared.Enums.NotifyType.TYPE_INFO, "Arena mode coming soon!");
});
