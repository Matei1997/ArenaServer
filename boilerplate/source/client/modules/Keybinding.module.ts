import { InteractablePed } from "@classes/InteractablePed.class";
import { Browser } from "@classes/Browser.class";
import { ChatAPI } from "@classes/Chat.class";
import { Client } from "@classes/Client.class";
import { Inventory } from "@classes/Inventory.class";
import { PlayerKeybind } from "@classes/Keybind.class";
import { EntityRaycast } from "@classes/Raycast.class";
import { CEFPages } from "@assets/CEFPages.asset";

function playerPressEscape() {
    if (mp.game.ui.isPauseMenuActive() && Browser.currentPage !== "inventory") return;

    if (mp.players.local.getVariable("usingItem")) {
        return mp.events.callRemote("server::inventory:cancelAction");
    }

    if (!Browser.currentPage) return;

    switch (Browser.currentPage) {
        case "interactionMenu": {
            Browser.processEvent("cef::hud:setInteraction", { isActive: false, items: [] });
            Browser.closePage();
            break;
        }
        case "inventory": {
            Inventory.close();
            return;
        }
        case "chat": {
            if (ChatAPI.chatOpen) ChatAPI.close();
            return;
        }
        default: {
            if (CEFPages[Browser.currentPage].close) {
                Browser.closePage();
            }
        }
    }
}

PlayerKeybind.addKeybind({ keyCode: 27, up: false }, playerPressEscape, "Close Pages");

PlayerKeybind.addKeybind(
    { keyCode: 113, up: false },
    () => {
        if (!mp.players.local.getVariable("loggedin") || Client.isDead) return;
        if (Browser.currentPage === "playerMenu") {
            Browser.closePage();
        } else if (!Browser.currentPage || Browser.currentPage === "hud") {
            Browser.processEvent("cef::system:setPage", "playerMenu");
        } else if (Browser.currentPage === "arena_hud") {
            Browser.processEvent("cef::system:setPage", "playerMenu");
        }
    },
    "Player menu (F2)"
);

// Hold right-click in clothing menu to orbit camera and view character
PlayerKeybind.addKeybind({ keyCode: 2, up: false }, () => {
    if (Browser.currentPage === "wardrobe") {
        Browser.wardrobeCameraHeld = true;
        mp.gui.cursor.show(false, false);
    }
}, "Wardrobe camera hold");
PlayerKeybind.addKeybind({ keyCode: 2, up: true }, () => {
    if (Browser.currentPage === "wardrobe" && Browser.wardrobeCameraHeld) {
        Browser.wardrobeCameraHeld = false;
        mp.gui.cursor.show(true, true);
    }
}, "Wardrobe camera release");

/**
 * Adds a keybind for toggling inventory fast slots.
 * @param keyCode - The key code for the keybind.
 * @param slot - The inventory slot number to toggle.
 */
function addQuickUseSlotKeybind(keyCode: number, slot: number) {
    PlayerKeybind.addKeybind(
        { keyCode, up: false },
        () => {
            if (!mp.players.local.getVariable("loggedin") || Client.isDead) return;
            Inventory.toggleFastSlot(slot);
        },
        "Toggle Inventory FastSlot"
    );
}
// Add keybinds for quick use slots 1 to 6
for (let i = 1; i <= 6; i++) {
    addQuickUseSlotKeybind(48 + i, i); // 48 is the keyCode for '0', so 49 ('1') to 54 ('6') are the target keyCodes
}

PlayerKeybind.addKeybind(
    { keyCode: 73, up: false },
    async () => {
        if (!mp.players.local.getVariable("loggedin") || Client.isDead) return;
        return;
    },
    "Open or close Inventory"
);

PlayerKeybind.addKeybind(
    { keyCode: 71, up: false },
    async () => {
        if (Browser.currentPage && Browser.currentPage !== "interactionMenu") return;
        if (mp.players.local.vehicle && mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
            mp.events.callRemote("server::interaction:vehicle", mp.players.local.vehicle.remoteId);
        } else {
            if (!EntityRaycast.entity) return;
            mp.events.callRemote(EntityRaycast.entity.type === "player" ? "server::interaction:player" : "server::interaction:vehicle", EntityRaycast.entity.remoteId);
        }
    },
    "Interact with an entity"
);

PlayerKeybind.addKeybind(
    { keyCode: 69, up: false },
    async () => {
        if (ChatAPI.chatOpen || Browser.currentPage || mp.players.local.getVariable("isDead") || mp.players.local.vehicle) return;
        const ped = InteractablePed.getClosest();
        if (!ped) return;
        ped.onKeyPress.constructor.name === "AsyncFunction" ? await ped.onKeyPress() : ped.onKeyPress();
    },
    "Interact with NPC"
);

PlayerKeybind.addKeybind(
    { keyCode: 69, up: false },
    () => {
        if (ChatAPI.chatOpen || Browser.currentPage || !Client.canAcceptDeath || !mp.players.local.getVariable("isDead")) return;
        mp.events.callRemote("server::player:acceptDeath");
        Client.canAcceptDeath = false;
    },
    "Accept death"
);

PlayerKeybind.addKeybind(
    { keyCode: 20, up: false },
    () => {
        if (Browser.currentPage === "arena_hud") {
            mp.events.call("client::eventManager", "cef::arena:toggleScoreboard", {});
        }
    },
    "Hopouts scoreboard (Caps)"
);

PlayerKeybind.addKeybind(
    { keyCode: 18, up: false },
    () => {
        if (Browser.currentPage === "arena_hud") {
            Browser.toggleCursorForClick();
        }
    },
    "Hopouts cursor toggle (Alt)"
);

// Arena item keybinds: 5 = Medkit, 6 = Plate
PlayerKeybind.addKeybind(
    { keyCode: 53, up: false },
    () => {
        if (Browser.currentPage !== "arena_hud") return;
        mp.events.callRemote("server::arena:useItem", JSON.stringify({ item: "medkit" }));
    },
    "Arena: Use Medkit (5)"
);
PlayerKeybind.addKeybind(
    { keyCode: 54, up: false },
    () => {
        if (Browser.currentPage !== "arena_hud") return;
        mp.events.callRemote("server::arena:useItem", JSON.stringify({ item: "plate" }));
    },
    "Arena: Use Plate (6)"
);

PlayerKeybind.addKeybind(
    { keyCode: 114, up: false },
    () => {
        if (!mp.players.local.getVariable("loggedin") || Client.isDead) return;
        if (Browser.currentPage === "mainmenu") {
            Browser.closePage();
        } else if (!Browser.currentPage || Browser.currentPage === "hud") {
            Browser.processEvent("cef::system:setPage", "mainmenu");
        } else if (Browser.currentPage === "arena_hud") {
            Browser.processEvent("cef::system:setPage", "mainmenu");
        }
    },
    "Toggle menu (F3)"
);
