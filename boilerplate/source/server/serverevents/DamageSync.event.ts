/**
 * Server-authoritative damage sync.
 * Receives hit reports from clients, validates, applies bone/weapon/distance damage,
 * blocks team damage in arena, and notifies victim + shooter.
 */

import { Utils } from "@shared/utils.module";
import { getMatchByPlayer, getTeam } from "@arena/ArenaMatch.manager";

const DEFAULT_BONE_MULT = 1;
const DEFAULT_WEAPON_BASE = 28;
const DEFAULT_WEAPON_MIN = 10;
const DAMAGE_RANGE_DIVISOR = 40;

const boneMultipliers: Record<string, number> = {
    Head: 1.5,
    Neck: 1.5,
    Left_Clavicle: 1,
    Right_Clavicle: 1,
    "Upper_Arm Right": 1,
    "Upper_Arm Left": 1,
    "Lower_Arm Right": 1,
    "Lower_Arm Left": 1,
    Spine_1: 1,
    Spine_3: 1,
    Right_Tigh: 1,
    Left_Tigh: 1,
    Right_Calf: 1,
    Left_Calf: 1,
    Right_Food: 1,
    Left_Food: 1
};

// Per-weapon damage: base/min for body, head for headshots (neverDM-style).
// Head uses explicit value when set; otherwise boneMultiplier applies.
const weaponDamage: Record<string, { base: number; min: number; head?: number }> = {
    [String(mp.joaat("weapon_pistol"))]: { base: 18, min: 9, head: 35 },
    [String(mp.joaat("weapon_pistol_mk2"))]: { base: 20, min: 10, head: 40 },
    [String(mp.joaat("weapon_combatpistol"))]: { base: 20, min: 10, head: 40 },
    [String(mp.joaat("weapon_heavypistol"))]: { base: 22, min: 10, head: 45 },
    [String(mp.joaat("weapon_appistol"))]: { base: 16, min: 8, head: 32 },
    [String(mp.joaat("weapon_pistol50"))]: { base: 24, min: 12, head: 50 },
    [String(mp.joaat("weapon_microsmg"))]: { base: 14, min: 8, head: 28 },
    [String(mp.joaat("weapon_smg"))]: { base: 16, min: 10, head: 32 },
    [String(mp.joaat("weapon_assaultrifle"))]: { base: 22, min: 10, head: 45 },
    [String(mp.joaat("weapon_assaultrifle_mk2"))]: { base: 24, min: 10, head: 48 },
    [String(mp.joaat("weapon_carbinerifle"))]: { base: 22, min: 8, head: 44 },
    [String(mp.joaat("weapon_carbinerifle_mk2"))]: { base: 24, min: 10, head: 48 },
    [String(mp.joaat("weapon_specialcarbine"))]: { base: 22, min: 10, head: 44 },
    [String(mp.joaat("weapon_bullpuprifle"))]: { base: 22, min: 10, head: 44 },
    [String(mp.joaat("weapon_advancedrifle"))]: { base: 22, min: 10, head: 44 },
    [String(mp.joaat("weapon_sniperrifle"))]: { base: 55, min: 35, head: 100 },
    [String(mp.joaat("weapon_heavysniper"))]: { base: 55, min: 45, head: 100 },
    [String(mp.joaat("weapon_heavysniper_mk2"))]: { base: 65, min: 50, head: 120 },
    [String(mp.joaat("weapon_pumpshotgun"))]: { base: 45, min: 35, head: 55 },
    [String(mp.joaat("weapon_sawnoffshotgun"))]: { base: 40, min: 30, head: 50 },
    [String(mp.joaat("weapon_assaultshotgun"))]: { base: 35, min: 25, head: 50 },
    [String(mp.joaat("weapon_combatshotgun"))]: { base: 40, min: 30, head: 55 },
    [String(mp.joaat("weapon_mg"))]: { base: 18, min: 12, head: 35 },
    [String(mp.joaat("weapon_combatmg"))]: { base: 18, min: 14, head: 36 },
    [String(mp.joaat("weapon_combatpdw"))]: { base: 16, min: 10, head: 32 },
    [String(mp.joaat("weapon_compactrifle"))]: { base: 20, min: 10, head: 40 }
};

function getBoneMultiplier(bone: string): number {
    return boneMultipliers[bone] ?? DEFAULT_BONE_MULT;
}

function getWeaponDamage(weaponHash: string, distance: number, isHead: boolean): number {
    const w = weaponDamage[weaponHash] ?? { base: DEFAULT_WEAPON_BASE, min: DEFAULT_WEAPON_MIN };
    if (isHead && w.head !== undefined) return Math.min(w.head, 200);
    let dmg = w.base / (distance / DAMAGE_RANGE_DIVISOR);
    if (dmg > w.base) dmg = w.base;
    if (dmg < w.min) dmg = w.min;
    return Math.round(dmg * 10) / 10;
}

mp.events.add("server:PlayerHit", (shooter: PlayerMp, victimId: number, targetBone: string, weaponHash: string) => {
    if (!shooter || !mp.players.exists(shooter)) return;
    const victim = mp.players.at(victimId);
    if (!victim || !mp.players.exists(victim)) return;
    if (shooter.id === victim.id) return;

    // Arena: no team damage
    const match = getMatchByPlayer(victim);
    if (match) {
        const victimTeam = getTeam(match, victim.id);
        const shooterTeam = getTeam(match, shooter.id);
        if (victimTeam && shooterTeam && victimTeam === shooterTeam) return;
        // Must be in same dimension
        if (shooter.dimension !== victim.dimension) return;
    }

    const distance = Utils.distanceToPos(shooter.position, victim.position);
    const isHead = targetBone === "Head";
    const weaponDmg = getWeaponDamage(weaponHash, Math.max(1, distance), isHead);
    const boneMult = isHead ? 1 : getBoneMultiplier(targetBone);
    const finalDamage = weaponDmg * boneMult;

    const from = shooter.position;
    victim.call("client:GiveDamage", [finalDamage, from.x, from.y, from.z]);

    // Headshot: use body multiplier for damage calc but mark as head for hitmarker
    const isHead = targetBone === "Head";
    const hitStatus = isHead ? 3 : victim.armour > 0 ? 2 : 1; // 1=health, 2=armour, 3=head
    shooter.call("client:ShowHitmarker", [finalDamage, victim.position.x, victim.position.y, victim.position.z, hitStatus]);
});
