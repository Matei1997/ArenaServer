import { Browser } from "@classes/Browser.class";

let lastHealth = -1;
let lastArmor = -1;

mp.events.add("render", () => {
    if (Browser.currentPage !== "arena_hud") return;

    const player = mp.players.local;
    if (!player || !mp.players.exists(player)) return;

    const health = Math.max(0, Math.min(100, player.getHealth() - 100));
    const armor = Math.max(0, Math.min(100, player.getArmour?.() ?? player.armour ?? 0));

    if (health === lastHealth && armor === lastArmor) return;
    lastHealth = health;
    lastArmor = armor;

    mp.events.call("client::eventManager", "cef::arena:setVitals", { health, armor });
});
