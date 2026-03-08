/**
 * When in arena, show native radar (map with streets), set zoom, and hide native health/armor bars below minimap.
 */

import { Browser } from "@classes/Browser.class";

const RADAR_ZOOM = 100;
const MINIMAP_SCALEFORM = "minimap";
const SETUP_HEALTH_ARMOUR = "SETUP_HEALTH_ARMOUR";
const HEALTH_TYPE_HIDE = 3; // Golf mode = hides bars

let minimapScaleform: number | null = null;

function ensureMinimapScaleform(): boolean {
    if (minimapScaleform === null) {
        minimapScaleform = mp.game.graphics.requestScaleformMovie(MINIMAP_SCALEFORM);
    }
    return mp.game.graphics.hasScaleformMovieLoaded(minimapScaleform);
}

mp.events.add("render", () => {
    if (Browser.currentPage !== "arena_hud") return;

    mp.game.ui.displayRadar(true);  // Ensure map stays visible (some states can hide it)
    mp.game.ui.setRadarZoom(RADAR_ZOOM);

    // Hide native health/armor bars below minimap (use scaleform SETUP_HEALTH_ARMOUR with param 3)
    if (ensureMinimapScaleform()) {
        const pushed = mp.game.graphics.pushScaleformMovieFunction(minimapScaleform!, SETUP_HEALTH_ARMOUR);
        if (pushed) {
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(HEALTH_TYPE_HIDE);
            mp.game.graphics.popScaleformMovieFunctionVoid();
        }
    }
});
