/**
 * Client-side weapon recoil: detects firing via ammo count changes each frame,
 * applies per-weapon-category camera kick with server-driven attachment modifier.
 * Disabled in arena (hopouts) - custom recoil causes aim to snap to eye level.
 */

import { Browser } from "@classes/Browser.class";

interface RecoilProfile {
    vertical: number;
    horizontal: number;
}

const UNARMED_HASH = 2725352035;

const WEAPON_CATEGORIES: { hashes: number[]; profile: RecoilProfile }[] = [
    {
        hashes: [
            "weapon_pistol", "weapon_pistol50", "weapon_combatpistol", "weapon_heavypistol",
            "weapon_vintagepistol", "weapon_marksmanpistol", "weapon_revolver", "weapon_appistol",
            "weapon_stungun", "weapon_flaregun", "weapon_doubleaction", "weapon_snspistol",
            "weapon_ceramicpistol", "weapon_navyrevolver", "weapon_gadgetpistol", "weapon_pistolxm3"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 1.8, horizontal: 0.4 }
    },
    {
        hashes: [
            "weapon_smg", "weapon_microsmg", "weapon_minismg", "weapon_assaultsmg",
            "weapon_combatpdw", "weapon_machinepistol"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 1.2, horizontal: 0.5 }
    },
    {
        hashes: [
            "weapon_assaultrifle", "weapon_carbinerifle", "weapon_specialcarbine",
            "weapon_bullpuprifle", "weapon_advancedrifle", "weapon_compactrifle",
            "weapon_militaryrifle", "weapon_heavyrifle", "weapon_tacticalrifle",
            "weapon_servicecarbine"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 1.5, horizontal: 0.3 }
    },
    {
        hashes: [
            "weapon_pistol_mk2", "weapon_smg_mk2", "weapon_assaultrifle_mk2",
            "weapon_carbinerifle_mk2", "weapon_specialcarbine_mk2", "weapon_bullpuprifle_mk2",
            "weapon_combatmg_mk2", "weapon_heavysniper_mk2", "weapon_marksmanrifle_mk2",
            "weapon_pumpshotgun_mk2", "weapon_revolver_mk2", "weapon_snspistol_mk2"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 1.3, horizontal: 0.25 }
    },
    {
        hashes: [
            "weapon_pumpshotgun", "weapon_assaultshotgun", "weapon_sawnoffshotgun",
            "weapon_bullpupshotgun", "weapon_heavyshotgun", "weapon_dbshotgun",
            "weapon_autoshotgun", "weapon_combatshotgun", "weapon_musket"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 4.0, horizontal: 1.5 }
    },
    {
        hashes: [
            "weapon_sniperrifle", "weapon_heavysniper", "weapon_marksmanrifle",
            "weapon_precisionrifle"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 5.0, horizontal: 0.2 }
    },
    {
        hashes: [
            "weapon_mg", "weapon_combatmg", "weapon_gusenberg"
        ].map((w) => mp.game.joaat(w)),
        profile: { vertical: 1.8, horizontal: 0.7 }
    }
];

const profileByHash = new Map<number, RecoilProfile>();
for (const cat of WEAPON_CATEGORIES) {
    for (const hash of cat.hashes) {
        profileByHash.set(hash, cat.profile);
    }
}

const RECOIL_MULTIPLIER = 2.2;
const RECOIL_STEP = 0.18; // Lower = smoother recoil spread over frames (was 0.7, caused snap)
const AIM_MULTIPLIER = 1.6;

let recoilModifier = 1.0;
let lastAmmo = 0;
let lastWeapon = 0;
let pendingPitch = 0;
let lastShotAt = 0;
let shotStreak = 0;

mp.events.add("client::recoil:setModifier", (modifier: number) => {
    recoilModifier = modifier;
});

mp.events.add("client::recoil:reset", () => {
    recoilModifier = 1.0;
});

mp.events.add("render", () => {
    if (Browser.currentPage === "arena_hud") return;  // Disable in hopouts - causes aim snap to eye level

    const player = mp.players.local;
    if (!player || !mp.players.exists(player)) return;
    if (player.getHealth() <= 0) return;
    if (player.vehicle) return;

    const weapon = player.weapon;

    if (weapon === UNARMED_HASH) {
        lastWeapon = weapon;
        lastAmmo = 0;
        return;
    }

    const ammo = player.getAmmoInClip(weapon);

    if (weapon !== lastWeapon) {
        lastWeapon = weapon;
        lastAmmo = ammo;
        pendingPitch = 0;
        return;
    }

    if (ammo < lastAmmo && lastAmmo > 0) {
        const profile = profileByHash.get(weapon);
        if (profile) {
            const now = Date.now();
            if (now - lastShotAt < 180) {
                shotStreak += 1;
            } else {
                shotStreak = 0;
            }
            lastShotAt = now;

            const streakScale = 1 + Math.min(0.8, shotStreak * 0.08);
            const isAiming = mp.game.controls.isControlPressed(0, 25);
            const aimBoost = isAiming ? AIM_MULTIPLIER : 1.0;
            const vKick = profile.vertical * recoilModifier * RECOIL_MULTIPLIER * streakScale * aimBoost;
            pendingPitch += vKick;
        }
    }

    if (pendingPitch > 0) {
        const step = Math.min(pendingPitch, RECOIL_STEP);
        const currentPitch = typeof (mp.game.cam as any).getGameplayCamRelativePitch === "function"
            ? (mp.game.cam as any).getGameplayCamRelativePitch()
            : 0;
        mp.game.cam.setGameplayCamRelativePitch(
            currentPitch - step,
            1.0
        );
        pendingPitch -= step;
    }

    lastAmmo = ammo;
});
