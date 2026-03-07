//-----------------------------------------//
import "@classes/Browser.class";
import "@classes/Chat.class";
import "@classes/Creator.class";
import "@classes/Vehicle.class";
import "@classes/Spectate.class";
import "@classes/Attachments.class";
//-----------------------------------------//
import "@events/Auth.event";
import "@events/Render.event";
import "@events/Player.event";
import "@events/Attachment.events";
//-----------------------------------------//
import "@handlers/Player.handler";
import "@handlers/Object.handler";
//-----------------------------------------//
import "@proc/Player.proc";
//-----------------------------------------//
import "@modules/GameData.module";
import "@modules/Keybinding.module";
import "@modules/Crouch.module";
import "@modules/HudColor.module";
import "@modules/DamageSync.module";
import "@modules/Hitmarker.module";
import "@modules/Speedometer.module";
import "@modules/ShootingRange.module";
import "@modules/AttachEditor.module";
import "@modules/Noclip.module";
import "@modules/Nametag.module";
import "@modules/IdleCamera.module";
import "@modules/ArenaZone.module";
import "@modules/Recoil.module";
import "@modules/WardrobeCamera.module";
import "@modules/ArenaVitals.module";
//-----------------------------------------//
import "@prototype/Player.prototype";
//-----------------------------------------//
import { InteractablePed } from "@classes/InteractablePed.class";
//-----------------------------------------//
async function initClientSide() {
    mp.console.clear();

    mp.nametags.enabled = false;

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);

    InteractablePed.init();
}

(async () => {
    mp.console.logInfo("[RAGEMP GAMEMODE]: Initializing client-side.");
    await initClientSide()
        .then(() => mp.console.logInfo("[RAGEMP GAMEMODE]: Initialized client-side."))
        .catch((err) => mp.console.logError(`${err.message}`));
})();
