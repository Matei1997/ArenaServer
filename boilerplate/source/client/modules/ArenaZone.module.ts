/**
 * Client-side arena zone rendering.
 * Storm = boundary at zone edge. When outside: gradient purple tint only (no 3D lines).
 */

let zoneActive = false;
let zoneCenterX = 0;
let zoneCenterY = 0;
let zoneRadius = 200;
let zoneBlip: number | null = null;
let zonePhase = 0;
let zoneTotalPhases = 0;
let zonePhaseTimeLeft = 0;
let zonePhaseUpdatedAt = 0;
let lastWarnPhase = -1;
let warnUntil = 0;
let stormAlpha = 0;
let lastStormSoundAt = 0;

const ZONE_SEGMENTS = 96;
const ZONE_COLOR = { r: 100, g: 200, b: 255, a: 95 };
const ZONE_GLOW_COLOR = { r: 140, g: 220, b: 255, a: 65 };
const ZONE_WALL_HEIGHT = 55;
const STORM_WARN_SECONDS = 12;

mp.events.add("client::arena:requestCollision", (x: number, y: number, z: number) => {
    mp.game.streaming.requestCollisionAtCoord(x, y, z);
});

mp.events.add("client::arena:zoneInit", (...args: any[]) => {
    const arr = Array.isArray(args[0]) ? args[0] : args;
    const cx = arr[0];
    const cy = arr[1];
    const radius = arr[2];
    const safeX = Number(cx);
    const safeY = Number(cy);
    const safeRadius = Number(radius);
    if (!Number.isFinite(safeX) || !Number.isFinite(safeY) || !Number.isFinite(safeRadius) || safeRadius <= 0) {
        return;
    }
    zoneActive = true;
    zoneCenterX = safeX;
    zoneCenterY = safeY;
    zoneRadius = safeRadius;
    zonePhaseUpdatedAt = Date.now();

    if (zoneBlip) {
        try { (mp.game.ui as any).removeBlip(zoneBlip); } catch {}
    }
    zoneBlip = (mp.game.ui as any).addBlipForRadius(safeX, safeY, 0, safeRadius);
    if (zoneBlip) {
        (mp.game.ui as any).setBlipColour(zoneBlip, 3);
        (mp.game.ui as any).setBlipAlpha(zoneBlip, 90);
    }
});

mp.events.add("client::arena:zoneUpdate", (...args: any[]) => {
    const arr = Array.isArray(args[0]) ? args[0] : args;
    const cx = arr[0];
    const cy = arr[1];
    const radius = arr[2];
    const safeX = Number(cx);
    const safeY = Number(cy);
    const safeRadius = Number(radius);
    if (!Number.isFinite(safeX) || !Number.isFinite(safeY) || !Number.isFinite(safeRadius) || safeRadius <= 0) {
        return;
    }
    const phase = arr[3] ?? 0;
    const totalPhases = arr[4] ?? 1;
    const timeLeft = arr[5] ?? 0;
    zoneActive = true;
    zoneCenterX = safeX;
    zoneCenterY = safeY;
    zoneRadius = safeRadius;
    zonePhase = phase;
    zoneTotalPhases = totalPhases;
    zonePhaseTimeLeft = timeLeft;
    zonePhaseUpdatedAt = Date.now();

    if (zonePhaseTimeLeft <= STORM_WARN_SECONDS && lastWarnPhase !== zonePhase) {
        lastWarnPhase = zonePhase;
        warnUntil = Date.now() + 3500;
        mp.game.audio.playSoundFrontend(-1, "TIMER_STOP", "HUD_MINI_GAME_SOUNDSET", true);
    }

    if (zoneBlip) {
        try { (mp.game.ui as any).removeBlip(zoneBlip); } catch {}
    }
    zoneBlip = (mp.game.ui as any).addBlipForRadius(safeX, safeY, 0, safeRadius);
    if (zoneBlip) {
        (mp.game.ui as any).setBlipColour(zoneBlip, 3);
        (mp.game.ui as any).setBlipAlpha(zoneBlip, 90);
    }
});

mp.events.add("client::arena:zoneClear", () => {
    zoneActive = false;
    zonePhase = 0;
    zoneTotalPhases = 0;
    zonePhaseTimeLeft = 0;
    zonePhaseUpdatedAt = 0;
    lastWarnPhase = -1;
    warnUntil = 0;
    stormAlpha = 0;
    lastStormSoundAt = 0;
    mp.game.graphics.clearTimecycleModifier();
    if (zoneBlip) {
        try { (mp.game.ui as any).removeBlip(zoneBlip); } catch {}
        zoneBlip = null;
    }
});

mp.events.add("render", () => {
    if (!zoneActive || zoneRadius <= 0) return;

    const playerZ = mp.players.local.position.z;
    const groundZ = playerZ - 1;
    const topZ = groundZ + ZONE_WALL_HEIGHT;
    const player = mp.players.local;
    const dx = player.position.x - zoneCenterX;
    const dy = player.position.y - zoneCenterY;
    const isOutside = (dx * dx + dy * dy) > (zoneRadius * zoneRadius);

    const pulse = (Math.sin(Date.now() / 450) + 1) * 0.5;
    const glowAlpha = Math.floor(ZONE_GLOW_COLOR.a + pulse * 20);

    // Safe zone boundary (blue) - this IS the storm boundary; cross it = you're in the storm
    for (let i = 0; i < ZONE_SEGMENTS; i++) {
        const angle1 = (i / ZONE_SEGMENTS) * Math.PI * 2;
        const angle2 = ((i + 1) / ZONE_SEGMENTS) * Math.PI * 2;

        const x1 = zoneCenterX + Math.cos(angle1) * zoneRadius;
        const y1 = zoneCenterY + Math.sin(angle1) * zoneRadius;
        const x2 = zoneCenterX + Math.cos(angle2) * zoneRadius;
        const y2 = zoneCenterY + Math.sin(angle2) * zoneRadius;

        mp.game.graphics.drawLine(x1, y1, groundZ, x2, y2, groundZ,
            ZONE_COLOR.r, ZONE_COLOR.g, ZONE_COLOR.b, ZONE_COLOR.a);

        mp.game.graphics.drawLine(x1, y1, groundZ, x1, y1, topZ,
            ZONE_COLOR.r, ZONE_COLOR.g, ZONE_COLOR.b, Math.floor(ZONE_COLOR.a * 0.35));

        mp.game.graphics.drawLine(x1, y1, topZ, x2, y2, topZ,
            ZONE_COLOR.r, ZONE_COLOR.g, ZONE_COLOR.b, Math.floor(ZONE_COLOR.a * 0.25));

        const xg1 = zoneCenterX + Math.cos(angle1) * (zoneRadius + 2.5);
        const yg1 = zoneCenterY + Math.sin(angle1) * (zoneRadius + 2.5);
        const xg2 = zoneCenterX + Math.cos(angle2) * (zoneRadius + 2.5);
        const yg2 = zoneCenterY + Math.sin(angle2) * (zoneRadius + 2.5);

        mp.game.graphics.drawLine(xg1, yg1, groundZ, xg2, yg2, groundZ,
            ZONE_GLOW_COLOR.r, ZONE_GLOW_COLOR.g, ZONE_GLOW_COLOR.b, glowAlpha);
    }

    // When OUTSIDE zone = you're IN the storm. Apply gradient purple tint (no 3D lines).
    if (isOutside) {
        stormAlpha = Math.min(120, stormAlpha + 4);
        if (Date.now() - lastStormSoundAt > 2500) {
            lastStormSoundAt = Date.now();
            mp.game.audio.playSoundFrontend(-1, "Beep_Red", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);
        }
        mp.game.graphics.setTimecycleModifier("MP_Powerplay_blend");
        mp.game.graphics.setTimecycleModifierStrength(0.75);
    } else {
        stormAlpha = Math.max(0, stormAlpha - 8);
        if (stormAlpha === 0) {
            mp.game.graphics.clearTimecycleModifier();
        }
    }

    // Full-screen gradient purple overlay when in storm (smooth, no lines)
    if (stormAlpha > 0) {
        mp.game.graphics.drawRect(0.5, 0.5, 1, 1, 90, 45, 130, stormAlpha, false);
    }

    if (warnUntil > Date.now()) {
        mp.game.graphics.drawText("STORM INCOMING", [0.5, 0.18], {
            font: 4,
            color: [160, 200, 255, 220],
            scale: [0.6, 0.6],
            outline: true,
            centre: true
        });
    }
});
