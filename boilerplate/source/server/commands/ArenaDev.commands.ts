import { RAGERP } from "@api";
import { RageShared } from "@shared/index";

type ArenaMarkType = "center" | "redspawn" | "bluespawn" | "redcar" | "bluecar" | "safenode";

interface ArenaPresetPoints {
    center?: { x: number; y: number; z: number; heading?: number };
    redspawn?: { x: number; y: number; z: number; heading?: number };
    bluespawn?: { x: number; y: number; z: number; heading?: number };
    redcar?: { x: number; y: number; z: number; heading?: number };
    bluecar?: { x: number; y: number; z: number; heading?: number };
    safeNodes: { x: number; y: number; z: number }[];
}

const arenaMarkedPresets: Map<string, ArenaPresetPoints> = new Map();

const ADMIN_DEV = RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX;

RAGERP.commands.add({
    name: "pos",
    description: "Print current position (x, y, z, heading, dimension)",
    adminlevel: ADMIN_DEV,
    run: (player: PlayerMp) => {
        const { x, y, z } = player.position;
        const heading = player.heading;
        const dim = player.dimension;
        player.outputChatBox(`Position: x=${x.toFixed(2)} y=${y.toFixed(2)} z=${z.toFixed(2)} heading=${heading.toFixed(2)} dimension=${dim}`);
        console.log(`[POS] ${player.name}: x=${x} y=${y} z=${z} heading=${heading} dimension=${dim}`);
    }
});

RAGERP.commands.add({
    name: "tp",
    description: "Teleport to x y z",
    adminlevel: ADMIN_DEV,
    run: (player: PlayerMp, _fulltext: string, x: string, y: string, z: string) => {
        if (!x || !y || !z) return RAGERP.chat.sendSyntaxError(player, "/tp <x> <y> <z>");
        const px = parseFloat(x);
        const py = parseFloat(y);
        const pz = parseFloat(z);
        if (isNaN(px) || isNaN(py) || isNaN(pz)) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid coordinates.");
        player.position = new mp.Vector3(px, py, pz);
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `Teleported to ${px.toFixed(1)}, ${py.toFixed(1)}, ${pz.toFixed(1)}`);
    }
});

RAGERP.commands.add({
    name: "setdim",
    description: "Set dimension",
    adminlevel: ADMIN_DEV,
    run: (player: PlayerMp, _fulltext: string, id: string) => {
        if (!id) return RAGERP.chat.sendSyntaxError(player, "/setdim <id>");
        const dim = parseInt(id, 10);
        if (isNaN(dim) || dim < 0) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid dimension ID.");
        player.dimension = dim;
        player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `Dimension set to ${dim}`);
    }
});

RAGERP.commands.add({
    name: "arena_mark",
    description: "Mark a point for arena preset (center|redspawn|bluespawn|redcar|bluecar|safenode)",
    adminlevel: ADMIN_DEV,
    run: (player: PlayerMp, _fulltext: string, presetId: string, markType: string) => {
        if (!presetId || !markType) return RAGERP.chat.sendSyntaxError(player, "/arena_mark <presetId> <center|redspawn|bluespawn|redcar|bluecar|safenode>");
        const type = markType.toLowerCase() as ArenaMarkType;
        const valid: ArenaMarkType[] = ["center", "redspawn", "bluespawn", "redcar", "bluecar", "safenode"];
        if (!valid.includes(type)) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, `Invalid type. Use: ${valid.join(", ")}`);

        let preset = arenaMarkedPresets.get(presetId);
        if (!preset) {
            preset = { safeNodes: [] };
            arenaMarkedPresets.set(presetId, preset);
        }

        const { x, y, z } = player.position;
        const heading = player.heading;

        if (type === "safenode") {
            preset.safeNodes = preset.safeNodes || [];
            preset.safeNodes.push({ x, y, z });
            player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `[${presetId}] safenode #${preset.safeNodes.length} marked`);
        } else {
            const point = { x, y, z, heading };
            if (type === "center") preset.center = point;
            else if (type === "redspawn") preset.redspawn = point;
            else if (type === "bluespawn") preset.bluespawn = point;
            else if (type === "redcar") preset.redcar = point;
            else if (type === "bluecar") preset.bluecar = point;
            player.showNotify(RageShared.Enums.NotifyType.TYPE_SUCCESS, `[${presetId}] ${type} marked`);
        }
    }
});

RAGERP.commands.add({
    name: "arena_export",
    description: "Export arena preset as JSON",
    adminlevel: ADMIN_DEV,
    run: (player: PlayerMp, _fulltext: string, presetId: string) => {
        if (!presetId) return RAGERP.chat.sendSyntaxError(player, "/arena_export <presetId>");
        const preset = arenaMarkedPresets.get(presetId);
        if (!preset) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, `No points marked for preset "${presetId}". Use /arena_mark first.`);

        const exportObj = {
            id: presetId,
            center: preset.center,
            redSpawn: preset.redspawn,
            blueSpawn: preset.bluespawn,
            redCar: preset.redcar,
            blueCar: preset.bluecar,
            safeNodes: preset.safeNodes && preset.safeNodes.length > 0 ? preset.safeNodes : undefined
        };

        const json = JSON.stringify(exportObj, null, 2);
        console.log(`\n--- Arena preset: ${presetId} ---\n${json}\n---`);
        player.outputChatBox(`${RageShared.Enums.STRINGCOLORS.GREEN}[${presetId}] Exported. Check server console for JSON.`);
    }
});
