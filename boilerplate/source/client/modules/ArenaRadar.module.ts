/**
 * When in arena, show native radar (map with streets) and set zoom for better visibility.
 */

import { Browser } from "@classes/Browser.class";

const RADAR_ZOOM = 100;

mp.events.add("render", () => {
    if (Browser.currentPage !== "arena_hud") return;

    mp.game.ui.setRadarZoom(RADAR_ZOOM);
});
