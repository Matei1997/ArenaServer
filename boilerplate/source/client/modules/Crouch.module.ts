import { PlayerKeybind } from "@classes/Keybind.class";
import { Browser } from "@classes/Browser.class";

const CROUCH_CLIPSET = "move_ped_crouched";
const C_KEY = 67;
// Blend duration in seconds - higher = slower, more natural transition (ECRP-style)
const CROUCH_BLEND_DURATION = 0.5;
// Re-apply crouch (game overrides when aiming) - every N frames to avoid anticheat (60/sec = crash)
const CROUCH_REAPPLY_FRAME_SKIP = 3; // Apply every 4th frame = ~15/sec

let clipsetLoaded = false;
let isCrouched = false;
let frameCount = 0;

async function loadClipset(): Promise<boolean> {
    if (clipsetLoaded) return true;
    mp.game.streaming.requestAnimSet(CROUCH_CLIPSET);
    const deadline = Date.now() + 3000;
    while (!mp.game.streaming.hasAnimSetLoaded(CROUCH_CLIPSET) && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 50));
    }
    clipsetLoaded = mp.game.streaming.hasAnimSetLoaded(CROUCH_CLIPSET);
    return clipsetLoaded;
}

function canCrouch(): boolean {
    if (!mp.players.local.getVariable("loggedin") || mp.players.local.getVariable("isDead")) return false;
    if (mp.players.local.vehicle) return false;
    if (Browser.currentPage && Browser.currentPage !== "arena_hud") return false;
    return true;
}

function resetCrouch() {
    if (mp.players.local.vehicle) return;
    isCrouched = false;
    mp.players.local.resetMovementClipset(CROUCH_BLEND_DURATION);
}

function toggleCrouch() {
    if (!canCrouch()) return;
    isCrouched = !isCrouched;
    if (isCrouched) {
        loadClipset().then((ok) => {
            if (ok) mp.players.local.setMovementClipset(CROUCH_CLIPSET, CROUCH_BLEND_DURATION);
        });
    } else {
        mp.players.local.resetMovementClipset(CROUCH_BLEND_DURATION);
    }
}

function bindCrouch() {
    PlayerKeybind.addKeybind({ keyCode: C_KEY, up: true }, toggleCrouch, "Crouch toggle (C)");
}

function unbindCrouch() {
    PlayerKeybind.removeKeybind(C_KEY, true, toggleCrouch);
}

bindCrouch();

mp.events.add("playerEnterVehicle", () => {
    resetCrouch();
    unbindCrouch();
});

mp.events.add("playerLeaveVehicle", () => {
    bindCrouch();
});

mp.events.add("render", () => {
    if (mp.players.local.vehicle) return;
    if (!canCrouch()) {
        resetCrouch();
        return;
    }
    // Re-apply crouch - game overrides when aiming; frame-skip to avoid anticheat
    if (isCrouched && clipsetLoaded) {
        frameCount++;
        if (frameCount % (CROUCH_REAPPLY_FRAME_SKIP + 1) === 0) {
            mp.players.local.setMovementClipset(CROUCH_CLIPSET, 0);
        }
    } else {
        frameCount = 0;
    }
    // Disable native INPUT_DUCK (36) - prevents game from fighting our clipset
    mp.game.controls.disableControlAction(0, 36, true);
});
