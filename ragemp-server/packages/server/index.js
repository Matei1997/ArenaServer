/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./source/server/api/index.ts"
/*!************************************!*\
  !*** ./source/server/api/index.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RAGERP = void 0;
const utils_module_1 = __webpack_require__(/*! @shared/utils.module */ "./source/shared/utils.module.ts");
const CEFEvent_class_1 = __webpack_require__(/*! @classes/CEFEvent.class */ "./source/server/classes/CEFEvent.class.ts");
const Command_class_1 = __webpack_require__(/*! @classes/Command.class */ "./source/server/classes/Command.class.ts");
const Point_class_1 = __webpack_require__(/*! @classes/Point.class */ "./source/server/classes/Point.class.ts");
const Vehicle_class_1 = __webpack_require__(/*! @classes/Vehicle.class */ "./source/server/classes/Vehicle.class.ts");
const Database_module_1 = __webpack_require__(/*! ../database/Database.module */ "./source/server/database/Database.module.ts");
const Chat_module_1 = __webpack_require__(/*! @modules/Chat.module */ "./source/server/modules/Chat.module.ts");
/**
 * Namespace for the RAGERP system.
 * @namespace RAGERP
 */
var RAGERP;
(function (RAGERP) {
    /**
     * Main data source for the application.
     * @type {object}
     */
    RAGERP.database = Database_module_1.MainDataSource;
    /**
     * Pools for different entities.
     * @type {object}
     */
    RAGERP.pools = {
        /**
         * Pool for vehicle entities.
         * @type {object}
         */
        vehicles: Vehicle_class_1.vehiclePool,
        /**
         * Pool for dynamic points.
         * @type {object}
         */
        points: Point_class_1.dynamicPointPool
    };
    /**
     * Entities available in the system.
     * @type {object}
     */
    RAGERP.entities = {
        /**
         * Dynamic Points management.
         * @type {object}
         */
        points: {
            /**
             * Pool for dynamic points.
             * @type {object}
             */
            pool: Point_class_1.dynamicPointPool,
            /**
             * Constructor for new dynamic points.
             * @type {DynamicPoint}
             */
            new: Point_class_1.DynamicPoint
        },
        /**
         * Vehicle system management.
         * @type {object}
         */
        vehicles: {
            /**
             * Pool for vehicle entities.
             * @type {object}
             */
            pool: Vehicle_class_1.vehiclePool,
            /**
             * Manager for vehicle operations.
             * @type {object}
             */
            manager: Vehicle_class_1.vehicleManager,
            /**
             * Constructor for new vehicles.
             * @type {Vehicle}
             */
            new: Vehicle_class_1.Vehicle,
            /**
             * Alias for getting a vehicle by ID.
             * @type {function}
             */
            at: Vehicle_class_1.vehicleManager.at,
            /**
             * Alias for getting a vehicle by SQL ID.
             * @type {function}
             */
            atSQL: Vehicle_class_1.vehicleManager.atSQL,
            /**
             * Method for getting the nearest vehicle.
             * @type {function}
             */
            getNearest: Vehicle_class_1.vehicleManager.getNearest
        },
        /**
         * Placeholder for door controller.
         * @type {undefined}
         */
        doors: undefined,
        /**
         * Placeholder for gates controller.
         * @type {undefined}
         */
        gates: undefined
    };
    /**
     * Utility functions.
     * @type {object}
     */
    RAGERP.utils = utils_module_1.Utils;
    /**
     * Client Event Framework events.
     * @type {object}
     */
    RAGERP.cef = CEFEvent_class_1.CefEvent;
    /**
     * Command registry.
     * @type {object}
     */
    RAGERP.commands = Command_class_1.CommandRegistry;
    /**
     * Chat methods
     * @type {object}
     */
    RAGERP.chat = Chat_module_1.Chat;
})(RAGERP || (exports.RAGERP = RAGERP = {}));


/***/ },

/***/ "./source/server/arena/Arena.module.ts"
/*!*********************************************!*\
  !*** ./source/server/arena/Arena.module.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.joinQueue = joinQueue;
exports.leaveQueue = leaveQueue;
exports.vote = vote;
exports.getLobbyState = getLobbyState;
exports.startSoloMatch = startSoloMatch;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const ArenaPresets_asset_1 = __webpack_require__(/*! ./ArenaPresets.asset */ "./source/server/arena/ArenaPresets.asset.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! ./ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const ArenaConfig_1 = __webpack_require__(/*! ./ArenaConfig */ "./source/server/arena/ArenaConfig.ts");
__webpack_require__(/*! ./WeaponPresets.service */ "./source/server/arena/WeaponPresets.service.ts");
const LOBBY_COUNTDOWN_SEC = 15;
const VOTING_DURATION_SEC = 30;
const queues = new Map();
let nextDimension = 1000;
ArenaConfig_1.QUEUE_SIZES.forEach((size) => {
    queues.set(size, {
        size,
        queue: [],
        lobbyPlayers: new Map(),
        lobbyState: "waiting",
        countdownInterval: null,
        votingInterval: null,
        voteMaps: [],
        voteEndsAt: 0
    });
});
function getPlayerQueue(player) {
    for (const q of queues.values()) {
        if (q.queue.some((p) => p.id === player.id))
            return q;
    }
    return null;
}
function emitLobbyToAll(q) {
    const baseData = {
        state: q.lobbyState,
        queueSize: q.size,
        players: Array.from(q.lobbyPlayers.values()).map((p) => ({
            id: p.player.id,
            name: p.player.name,
            ready: p.ready
        })),
        countdown: 0,
        voteMaps: q.voteMaps.map((m) => ({ id: m.preset.id, name: m.preset.name, votes: m.votes })),
        voteEndsAt: q.voteEndsAt
    };
    if ((q.lobbyState === "waiting" && q.countdownInterval) || q.lobbyState === "voting") {
        baseData.countdown = Math.max(0, Math.ceil((q.voteEndsAt - Date.now()) / 1000));
    }
    const event = q.lobbyState === "voting" ? "setVoting" : "setLobby";
    q.queue.forEach((p) => {
        if (mp.players.exists(p)) {
            const lp = q.lobbyPlayers.get(p.id);
            const data = { ...baseData, myVote: lp?.voteMapId ?? null };
            _api_1.RAGERP.cef.emit(p, "arena", event, data);
        }
    });
}
function startCountdown(q) {
    if (q.lobbyState !== "waiting" || q.countdownInterval)
        return;
    q.voteEndsAt = Date.now() + LOBBY_COUNTDOWN_SEC * 1000;
    q.countdownInterval = setInterval(() => {
        const remaining = Math.ceil((q.voteEndsAt - Date.now()) / 1000);
        emitLobbyToAll(q);
        if (remaining <= 0) {
            if (q.countdownInterval)
                clearInterval(q.countdownInterval);
            q.countdownInterval = null;
            startVoting(q);
        }
    }, 1000);
    emitLobbyToAll(q);
}
function startVoting(q) {
    q.lobbyState = "voting";
    const presets = (0, ArenaPresets_asset_1.getArenaPresets)();
    const preferredIds = new Set();
    q.lobbyPlayers.forEach((lp) => {
        if (lp.preferredMapId)
            preferredIds.add(lp.preferredMapId);
    });
    let candidates = presets.filter((p) => preferredIds.has(p.id));
    if (candidates.length >= 3) {
        candidates = [...candidates].sort(() => Math.random() - 0.5).slice(0, 3);
    }
    else {
        const remaining = presets.filter((p) => !preferredIds.has(p.id));
        const shuffled = remaining.sort(() => Math.random() - 0.5);
        candidates = candidates.concat(shuffled.slice(0, 3 - candidates.length));
    }
    q.voteMaps = candidates.map((p) => ({ preset: p, votes: 0 }));
    q.voteEndsAt = Date.now() + VOTING_DURATION_SEC * 1000;
    q.lobbyPlayers.forEach((lp) => {
        lp.voteMapId = null;
        if (lp.preferredMapId && q.voteMaps.some((m) => m.preset.id === lp.preferredMapId)) {
            lp.voteMapId = lp.preferredMapId;
        }
    });
    q.lobbyPlayers.forEach((lp) => {
        if (!lp.voteMapId)
            return;
        const map = q.voteMaps.find((m) => m.preset.id === lp.voteMapId);
        if (map)
            map.votes++;
    });
    q.queue.forEach((p) => {
        if (mp.players.exists(p)) {
            _api_1.RAGERP.cef.emit(p, "system", "setPage", "arena_voting");
        }
    });
    if (q.votingInterval)
        clearInterval(q.votingInterval);
    q.votingInterval = setInterval(() => {
        const remaining = Math.ceil((q.voteEndsAt - Date.now()) / 1000);
        emitLobbyToAll(q);
        if (remaining <= 0) {
            if (q.votingInterval)
                clearInterval(q.votingInterval);
            q.votingInterval = null;
            launchMatch(q);
        }
    }, 1000);
    emitLobbyToAll(q);
}
function launchMatch(q) {
    q.lobbyState = "starting";
    if (q.voteMaps.length === 0) {
        q.queue.forEach((p) => p.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "No arena locations available."));
        resetQueue(q);
        return;
    }
    let winner;
    const maxVotes = Math.max(...q.voteMaps.map((m) => m.votes), 0);
    const tied = q.voteMaps.filter((m) => m.votes === maxVotes);
    winner = tied.length > 1 || maxVotes === 0
        ? tied[Math.floor(Math.random() * tied.length)]?.preset ?? q.voteMaps[0].preset
        : q.voteMaps.find((m) => m.votes === maxVotes)?.preset ?? q.voteMaps[0].preset;
    const players = Array.from(q.lobbyPlayers.values()).map((lp) => lp.player);
    const dim = nextDimension++;
    const redTeam = [];
    const blueTeam = [];
    players.forEach((p, i) => {
        if (i % 2 === 0)
            redTeam.push(p);
        else
            blueTeam.push(p);
    });
    (0, ArenaMatch_manager_1.startMatch)(dim, winner, redTeam, blueTeam);
    const matchData = {
        mapId: winner.id,
        mapName: winner.name,
        queueSize: q.size,
        redTeam: redTeam.map((p) => ({ id: p.id, name: p.name })),
        blueTeam: blueTeam.map((p) => ({ id: p.id, name: p.name })),
        dimension: dim,
        redScore: 0,
        blueScore: 0,
        currentRound: 1,
        roundsToWin: ArenaConfig_1.ARENA_CONFIG.roundsToWin,
        timeLeft: ArenaConfig_1.ARENA_CONFIG.maxRoundTime
    };
    [...redTeam, ...blueTeam].forEach((p) => {
        if (mp.players.exists(p)) {
            _api_1.RAGERP.cef.emit(p, "arena", "setMatch", matchData);
            _api_1.RAGERP.cef.startPage(p, "arena_hud");
            _api_1.RAGERP.cef.emit(p, "system", "setPage", "arena_hud");
        }
    });
    redTeam.forEach((p) => {
        if (mp.players.exists(p))
            p.call("client::arena:setTeam", ["red"]);
    });
    blueTeam.forEach((p) => {
        if (mp.players.exists(p))
            p.call("client::arena:setTeam", ["blue"]);
    });
    resetQueue(q);
}
function resetQueue(q) {
    q.queue = [];
    q.lobbyPlayers.clear();
    q.lobbyState = "waiting";
    q.voteMaps = [];
    q.voteEndsAt = 0;
}
function joinQueue(player, size = 2, preferredMapId) {
    if (!player.character) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "No character loaded.");
        return false;
    }
    if ((0, ArenaMatch_manager_1.isPlayerInArenaMatch)(player)) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Already in a match.");
        return false;
    }
    if (getPlayerQueue(player)) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Already in a queue.");
        return false;
    }
    const q = queues.get(size);
    if (!q) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid queue size.");
        return false;
    }
    q.queue.push(player);
    q.lobbyPlayers.set(player.id, { player, ready: false, voteMapId: null, preferredMapId: preferredMapId ?? null });
    const neededPlayers = size * 2;
    if (q.queue.length >= neededPlayers && !q.countdownInterval) {
        startCountdown(q);
    }
    else {
        const data = {
            state: "waiting",
            queueSize: q.size,
            players: Array.from(q.lobbyPlayers.values()).map((p) => ({ id: p.player.id, name: p.player.name, ready: p.ready })),
            countdown: 0,
            voteMaps: [],
            voteEndsAt: 0,
            myVote: null
        };
        _api_1.RAGERP.cef.emit(player, "arena", "setLobby", data);
    }
    emitLobbyToAll(q);
    return true;
}
function leaveQueue(player) {
    const q = getPlayerQueue(player);
    if (!q)
        return false;
    const idx = q.queue.findIndex((p) => p.id === player.id);
    if (idx < 0)
        return false;
    q.queue.splice(idx, 1);
    q.lobbyPlayers.delete(player.id);
    const neededPlayers = q.size * 2;
    if (q.queue.length < neededPlayers && q.countdownInterval) {
        clearInterval(q.countdownInterval);
        q.countdownInterval = null;
    }
    emitLobbyToAll(q);
    return true;
}
function vote(player, mapId) {
    const q = getPlayerQueue(player);
    if (!q || q.lobbyState !== "voting")
        return false;
    const lp = q.lobbyPlayers.get(player.id);
    if (!lp)
        return false;
    const map = q.voteMaps.find((m) => m.preset.id === mapId);
    if (!map)
        return false;
    if (lp.voteMapId) {
        const prev = q.voteMaps.find((m) => m.preset.id === lp.voteMapId);
        if (prev)
            prev.votes--;
    }
    lp.voteMapId = mapId;
    map.votes++;
    emitLobbyToAll(q);
    return true;
}
function getLobbyState(size) {
    const q = queues.get(size);
    if (!q)
        return { state: "waiting", playerCount: 0 };
    return { state: q.lobbyState, playerCount: q.queue.length };
}
function startSoloMatch(player, presetId) {
    if ((0, ArenaMatch_manager_1.isPlayerInArenaMatch)(player))
        return false;
    const presets = (0, ArenaPresets_asset_1.getArenaPresets)();
    if (presets.length === 0)
        return false;
    const preset = presetId ? presets.find((p) => p.id === presetId) : presets[0];
    if (!preset)
        return false;
    const dim = nextDimension++;
    (0, ArenaMatch_manager_1.startMatch)(dim, preset, [player], []);
    const matchData = {
        mapId: preset.id,
        mapName: preset.name,
        queueSize: 2,
        redTeam: [{ id: player.id, name: player.name }],
        blueTeam: [],
        dimension: dim,
        redScore: 0,
        blueScore: 0,
        currentRound: 1,
        roundsToWin: ArenaConfig_1.ARENA_CONFIG.roundsToWin,
        timeLeft: ArenaConfig_1.ARENA_CONFIG.maxRoundTime
    };
    _api_1.RAGERP.cef.emit(player, "arena", "setMatch", matchData);
    _api_1.RAGERP.cef.startPage(player, "arena_hud");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "arena_hud");
    player.call("client::arena:setTeam", ["red"]);
    return true;
}


/***/ },

/***/ "./source/server/arena/ArenaConfig.ts"
/*!********************************************!*\
  !*** ./source/server/arena/ArenaConfig.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ARENA_AMMO = exports.ITEM_CONFIG = exports.ZONE_PHASES = exports.VEHICLE_POOL = exports.WEAPON_ROTATION = exports.QUEUE_SIZES = exports.ARENA_CONFIG = void 0;
const Weapons_assets_1 = __webpack_require__(/*! @assets/Weapons.assets */ "./source/server/assets/Weapons.assets.ts");
exports.ARENA_CONFIG = {
    roundsToWin: 7,
    warmupDuration: 5, // seconds before round starts
    roundEndDelay: 4, // seconds between rounds
    matchEndDelay: 8, // seconds before returning to lobby
    startHealth: 100,
    startArmor: 100,
    maxRoundTime: 180, // 3 min per round max (zone should end it before)
};
exports.QUEUE_SIZES = [2, 3, 4, 5];
exports.WEAPON_ROTATION = [
    { name: "Pistol .50", weapons: [Weapons_assets_1.weaponHash.pistol50] },
    { name: "Service Carbine + .50", weapons: [Weapons_assets_1.weaponHash.specialcarbine, Weapons_assets_1.weaponHash.pistol50] },
    { name: "Bullpup + .50", weapons: [Weapons_assets_1.weaponHash.bullpuprifle, Weapons_assets_1.weaponHash.pistol50] },
    { name: "Carbine MK II + .50", weapons: [Weapons_assets_1.weaponHash.carbinerifle_mk2, Weapons_assets_1.weaponHash.pistol50] },
    { name: "Pump Shotgun + .50", weapons: [Weapons_assets_1.weaponHash.pumpshotgun, Weapons_assets_1.weaponHash.pistol50] },
    { name: "Heavy Rifle + .50", weapons: [Weapons_assets_1.weaponHash.assaultrifle, Weapons_assets_1.weaponHash.pistol50] },
];
exports.VEHICLE_POOL = [
    "sultan", "banshee", "drafter", "omnis", "kuruma", "revolter", "buffalo"
];
exports.ZONE_PHASES = [
    { duration: 60, endRadius: 160, dps: 1 },
    { duration: 50, endRadius: 110, dps: 2 },
    { duration: 45, endRadius: 70, dps: 4 },
    { duration: 40, endRadius: 35, dps: 7 },
    { duration: 30, endRadius: 10, dps: 10 },
];
exports.ITEM_CONFIG = {
    medkit: { castTime: 3000, heal: 100, maxHp: 100, countPerRound: 3 },
    plate: { castTime: 2000, armor: 25, maxArmor: 100, countPerRound: 5 },
};
exports.ARENA_AMMO = 999;


/***/ },

/***/ "./source/server/arena/ArenaMatch.manager.ts"
/*!***************************************************!*\
  !*** ./source/server/arena/ArenaMatch.manager.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMatchByDimension = getMatchByDimension;
exports.getMatchByPlayer = getMatchByPlayer;
exports.isPlayerInArenaMatch = isPlayerInArenaMatch;
exports.getTeam = getTeam;
exports.startMatch = startMatch;
exports.handleArenaDeath = handleArenaDeath;
exports.handleZoneDeath = handleZoneDeath;
exports.leaveMatch = leaveMatch;
exports.endMatch = endMatch;
exports.tickMatches = tickMatches;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const ArenaConfig_1 = __webpack_require__(/*! ./ArenaConfig */ "./source/server/arena/ArenaConfig.ts");
const ZoneSystem_1 = __webpack_require__(/*! ./ZoneSystem */ "./source/server/arena/ZoneSystem.ts");
const ItemsSystem_1 = __webpack_require__(/*! ./ItemsSystem */ "./source/server/arena/ItemsSystem.ts");
const WeaponPresets_service_1 = __webpack_require__(/*! ./WeaponPresets.service */ "./source/server/arena/WeaponPresets.service.ts");
const activeMatches = new Map();
const playerToMatch = new Map();
function getMatchByDimension(dim) {
    return activeMatches.get(dim);
}
function getMatchByPlayer(player) {
    const dim = playerToMatch.get(player.id);
    return dim !== undefined ? activeMatches.get(dim) : undefined;
}
function isPlayerInArenaMatch(player) {
    return playerToMatch.has(player.id);
}
function getTeam(match, playerId) {
    if (match.redTeam.some((p) => p.id === playerId))
        return "red";
    if (match.blueTeam.some((p) => p.id === playerId))
        return "blue";
    return null;
}
function getTeamPlayers(match, team) {
    return team === "red" ? match.redTeam : match.blueTeam;
}
function getAlivePlayers(match, team) {
    return getTeamPlayers(match, team).filter((p) => p.alive);
}
function getWeaponsForRound(round) {
    const idx = (round - 1) % ArenaConfig_1.WEAPON_ROTATION.length;
    return ArenaConfig_1.WEAPON_ROTATION[idx].weapons;
}
function getWeaponRoundName(round) {
    const idx = (round - 1) % ArenaConfig_1.WEAPON_ROTATION.length;
    return ArenaConfig_1.WEAPON_ROTATION[idx].name;
}
function getZoneCenter(preset) {
    const safe = preset.safeNodes;
    if (safe && safe.length > 0) {
        return safe[Math.floor(Math.random() * safe.length)];
    }
    return preset.center;
}
function giveRoundWeapons(player, round) {
    player.removeAllWeapons();
    player.call("client::recoil:reset");
    const weapons = getWeaponsForRound(round);
    setTimeout(() => {
        if (!mp.players.exists(player))
            return;
        weapons.forEach((hash) => {
            player.giveWeaponEx(hash, ArenaConfig_1.ARENA_AMMO, 30);
        });
        setTimeout(() => {
            if (!mp.players.exists(player))
                return;
            (0, WeaponPresets_service_1.applyWeaponPresets)(player, weapons);
        }, 300);
    }, 500);
}
function randomVehicleModel() {
    return ArenaConfig_1.VEHICLE_POOL[Math.floor(Math.random() * ArenaConfig_1.VEHICLE_POOL.length)];
}
function spawnTeamVehicles(match, team, spawnPoint) {
    const players = getTeamPlayers(match, team);
    const vehicleCount = Math.ceil(players.length / 2);
    for (let i = 0; i < vehicleCount; i++) {
        const model = randomVehicleModel();
        const offset = i * 6;
        const heading = spawnPoint.heading ?? 0;
        const rad = (heading * Math.PI) / 180;
        const vx = spawnPoint.x + Math.sin(rad) * offset;
        const vy = spawnPoint.y + Math.cos(rad) * offset;
        try {
            const veh = mp.vehicles.new(mp.joaat(model), new mp.Vector3(vx, vy, spawnPoint.z), {
                heading,
                dimension: match.dimension,
                locked: false,
                engine: true
            });
            match.vehicles.push(veh);
        }
        catch (e) {
            console.error(`[Arena] Failed to spawn vehicle ${model}:`, e);
        }
    }
}
function destroyMatchVehicles(match) {
    match.vehicles.forEach((veh) => {
        try {
            if (mp.vehicles.exists(veh))
                veh.destroy();
        }
        catch { /* ignore */ }
    });
    match.vehicles = [];
}
function getAllMatchPlayerMps(match) {
    const ids = [...match.redTeam, ...match.blueTeam].map((p) => p.id);
    const result = [];
    ids.forEach((id) => {
        const p = mp.players.at(id);
        if (p && mp.players.exists(p))
            result.push(p);
    });
    return result;
}
function emitToAll(match, event, data) {
    getAllMatchPlayerMps(match).forEach((p) => {
        _api_1.RAGERP.cef.emit(p, "arena", event, data);
    });
}
function buildMatchUpdate(match) {
    const timeLeft = match.state === "active"
        ? Math.max(0, Math.ceil((match.roundEndsAt - Date.now()) / 1000))
        : 0;
    return {
        state: match.state,
        redScore: match.redScore,
        blueScore: match.blueScore,
        currentRound: match.currentRound,
        roundsToWin: ArenaConfig_1.ARENA_CONFIG.roundsToWin,
        weaponName: getWeaponRoundName(match.currentRound),
        redAlive: getAlivePlayers(match, "red").length,
        blueAlive: getAlivePlayers(match, "blue").length,
        redTeam: match.redTeam.map((p) => {
            const mp_ = mp.players.at(p.id);
            const health = mp_ && mp.players.exists(mp_) ? Math.max(0, Math.min(100, mp_.health - 100)) : 0;
            const armor = mp_ && mp.players.exists(mp_) ? Math.max(0, Math.min(100, mp_.armour)) : 0;
            return { id: p.id, name: p.name, kills: p.kills, deaths: p.deaths, alive: p.alive, health, armor };
        }),
        blueTeam: match.blueTeam.map((p) => {
            const mp_ = mp.players.at(p.id);
            const health = mp_ && mp.players.exists(mp_) ? Math.max(0, Math.min(100, mp_.health - 100)) : 0;
            const armor = mp_ && mp.players.exists(mp_) ? Math.max(0, Math.min(100, mp_.armour)) : 0;
            return { id: p.id, name: p.name, kills: p.kills, deaths: p.deaths, alive: p.alive, health, armor };
        }),
        timeLeft
    };
}
function emitMatchUpdate(match) {
    emitToAll(match, "matchUpdate", buildMatchUpdate(match));
}
function emitKillFeed(match, killerName, victimName) {
    emitToAll(match, "killFeed", { killer: killerName, victim: victimName });
}
function spawnPlayerAtArena(player, spawn, dimension) {
    player.dimension = dimension;
    player.spawn(new mp.Vector3(spawn.x, spawn.y, spawn.z));
    player.heading = spawn.heading ?? 0;
    player.health = 100 + ArenaConfig_1.ARENA_CONFIG.startHealth;
    player.armour = ArenaConfig_1.ARENA_CONFIG.startArmor;
    player.call("client::arena:requestCollision", [spawn.x, spawn.y, spawn.z]);
}
function resetPlayerArenaState(player) {
    player.call("client::spectate:stop");
    player.setVariable("isSpectating", false);
    player.setVariable("isDead", false);
    if (player.character) {
        player.character.deathState = 0 /* RageShared.Players.Enums.DEATH_STATES.STATE_NONE */;
        player.character.setStoreData(player, "isDead", false);
    }
    player.setOwnVariable("deathAnim", null);
    player.stopScreenEffect("DeathFailMPIn");
}
function startMatch(dimension, preset, redTeam, blueTeam) {
    const match = {
        dimension,
        mapId: preset.id,
        mapName: preset.name,
        state: "warmup",
        redTeam: redTeam.map((p) => ({ id: p.id, name: p.name, alive: true, kills: 0, deaths: 0 })),
        blueTeam: blueTeam.map((p) => ({ id: p.id, name: p.name, alive: true, kills: 0, deaths: 0 })),
        redScore: 0,
        blueScore: 0,
        currentRound: 1,
        matchEndsAt: 0,
        roundEndsAt: 0,
        preset,
        vehicles: []
    };
    activeMatches.set(dimension, match);
    [...redTeam, ...blueTeam].forEach((p) => playerToMatch.set(p.id, dimension));
    beginRound(match);
}
function beginRound(match) {
    match.state = "warmup";
    destroyMatchVehicles(match);
    match.redTeam.forEach((p) => (p.alive = true));
    match.blueTeam.forEach((p) => (p.alive = true));
    const redSpawn = match.preset.redSpawn;
    const blueSpawn = match.preset.blueSpawn;
    match.redTeam.forEach((mp_) => {
        const p = mp.players.at(mp_.id);
        if (p && mp.players.exists(p)) {
            resetPlayerArenaState(p);
            spawnPlayerAtArena(p, redSpawn, match.dimension);
            p.call("client::player:freeze", [true]);
            giveRoundWeapons(p, match.currentRound);
            p.call("client::arena:setTeam", ["red"]);
        }
    });
    match.blueTeam.forEach((mp_) => {
        const p = mp.players.at(mp_.id);
        if (p && mp.players.exists(p)) {
            resetPlayerArenaState(p);
            spawnPlayerAtArena(p, blueSpawn, match.dimension);
            p.call("client::player:freeze", [true]);
            giveRoundWeapons(p, match.currentRound);
            p.call("client::arena:setTeam", ["blue"]);
        }
    });
    spawnTeamVehicles(match, "red", match.preset.redCar);
    spawnTeamVehicles(match, "blue", match.preset.blueCar);
    [...match.redTeam, ...match.blueTeam].forEach((mp_) => (0, ItemsSystem_1.initPlayerItems)(mp_.id));
    emitToAll(match, "roundStart", {
        round: match.currentRound,
        weaponName: getWeaponRoundName(match.currentRound),
        warmupTime: ArenaConfig_1.ARENA_CONFIG.warmupDuration,
        redScore: match.redScore,
        blueScore: match.blueScore,
        roundsToWin: ArenaConfig_1.ARENA_CONFIG.roundsToWin
    });
    emitMatchUpdate(match);
    const zoneCenter = getZoneCenter(match.preset);
    match.zoneCenter = zoneCenter;
    const cx = Number(zoneCenter?.x ?? match.preset.center?.x ?? 0);
    const cy = Number(zoneCenter?.y ?? match.preset.center?.y ?? 0);
    const initRadius = 200;
    if (!Number.isFinite(cx) || !Number.isFinite(cy) || initRadius <= 0) {
        console.warn("[Hopouts] Invalid zone center, using preset center");
    }
    getAllMatchPlayerMps(match).forEach((p) => {
        p.call("client::arena:zoneInit", [cx, cy, initRadius]);
    });
    (0, ZoneSystem_1.startZone)(match.dimension, cx, cy, ArenaConfig_1.ARENA_CONFIG.warmupDuration * 1000);
    setTimeout(() => {
        if (!activeMatches.has(match.dimension))
            return;
        match.state = "active";
        match.roundEndsAt = Date.now() + ArenaConfig_1.ARENA_CONFIG.maxRoundTime * 1000;
        getAllMatchPlayerMps(match).forEach((p) => {
            p.call("client::player:freeze", [false]);
        });
        const center = match.zoneCenter ?? match.preset.center;
        emitMatchUpdate(match);
    }, ArenaConfig_1.ARENA_CONFIG.warmupDuration * 1000);
}
function checkRoundEnd(match) {
    if (match.state !== "active")
        return;
    const redAlive = getAlivePlayers(match, "red").length;
    const blueAlive = getAlivePlayers(match, "blue").length;
    if (redAlive > 0 && blueAlive > 0)
        return;
    let roundWinner;
    if (redAlive === 0 && blueAlive === 0) {
        roundWinner = "draw";
    }
    else if (redAlive === 0) {
        roundWinner = "blue";
        match.blueScore++;
    }
    else {
        roundWinner = "red";
        match.redScore++;
    }
    match.state = "round_end";
    (0, ZoneSystem_1.stopZone)(match.dimension);
    getAllMatchPlayerMps(match).forEach((p) => {
        p.call("client::arena:zoneClear");
    });
    emitToAll(match, "roundEnd", {
        winner: roundWinner,
        redScore: match.redScore,
        blueScore: match.blueScore,
        round: match.currentRound,
        roundsToWin: ArenaConfig_1.ARENA_CONFIG.roundsToWin
    });
    if (match.redScore >= ArenaConfig_1.ARENA_CONFIG.roundsToWin || match.blueScore >= ArenaConfig_1.ARENA_CONFIG.roundsToWin) {
        setTimeout(() => endMatch(match.dimension), ArenaConfig_1.ARENA_CONFIG.roundEndDelay * 1000);
    }
    else {
        setTimeout(() => {
            if (!activeMatches.has(match.dimension))
                return;
            match.currentRound++;
            beginRound(match);
        }, ArenaConfig_1.ARENA_CONFIG.roundEndDelay * 1000);
    }
}
function handleArenaDeath(victim, killer) {
    const match = getMatchByPlayer(victim);
    if (!match || match.state !== "active")
        return false;
    const victimTeam = getTeam(match, victim.id);
    if (!victimTeam)
        return false;
    const victimData = [...match.redTeam, ...match.blueTeam].find((p) => p.id === victim.id);
    if (!victimData)
        return false;
    victimData.alive = false;
    victimData.deaths++;
    (0, ItemsSystem_1.cancelCast)(victim.id);
    (0, ItemsSystem_1.clearPlayerItems)(victim.id);
    victim.spawn(victim.position);
    victim.health = 200;
    resetPlayerArenaState(victim);
    victim.removeAllWeapons();
    let killerName = "";
    if (killer && mp.players.exists(killer)) {
        const killerTeam = getTeam(match, killer.id);
        if (killerTeam && killerTeam !== victimTeam) {
            const killerData = [...match.redTeam, ...match.blueTeam].find((p) => p.id === killer.id);
            if (killerData)
                killerData.kills++;
            killerName = killer.name;
            emitKillFeed(match, killer.name, victim.name);
            _api_1.RAGERP.cef.emit(killer, "arena", "youKill", { victim: victim.name });
        }
    }
    _api_1.RAGERP.cef.emit(victim, "arena", "youDied", { killer: killerName });
    const aliveTeammates = getAlivePlayers(match, victimTeam);
    if (aliveTeammates.length > 0) {
        const target = aliveTeammates[0];
        const targetMp = mp.players.at(target.id);
        if (targetMp && mp.players.exists(targetMp)) {
            victim.setVariable("isSpectating", true);
            victim.position = new mp.Vector3(targetMp.position.x, targetMp.position.y, targetMp.position.z - 15);
            victim.call("client::spectate:start", [target.id]);
        }
    }
    emitMatchUpdate(match);
    checkRoundEnd(match);
    return true;
}
function handleZoneDeath(player) {
    handleArenaDeath(player, undefined);
}
function leaveMatch(player, returnToMenu = true) {
    const match = getMatchByPlayer(player);
    if (!match)
        return false;
    playerToMatch.delete(player.id);
    (0, ItemsSystem_1.cancelCast)(player.id);
    (0, ItemsSystem_1.clearPlayerItems)(player.id);
    player.dimension = 0;
    player.removeAllWeapons();
    player.call("client::player:freeze", [false]);
    player.call("client::spectate:stop");
    player.call("client::arena:zoneClear");
    player.setVariable("isSpectating", false);
    match.redTeam = match.redTeam.filter((p) => p.id !== player.id);
    match.blueTeam = match.blueTeam.filter((p) => p.id !== player.id);
    const remaining = [...match.redTeam, ...match.blueTeam];
    if (remaining.length === 0) {
        destroyMatchVehicles(match);
        (0, ZoneSystem_1.stopZone)(match.dimension);
        activeMatches.delete(match.dimension);
    }
    else {
        emitMatchUpdate(match);
        if (match.state === "active")
            checkRoundEnd(match);
    }
    player.call("client::arena:clearTeam");
    if (returnToMenu) {
        _api_1.RAGERP.cef.startPage(player, "mainmenu");
        _api_1.RAGERP.cef.emit(player, "system", "setPage", "mainmenu");
    }
    return true;
}
function endMatch(dimension) {
    const match = activeMatches.get(dimension);
    if (!match)
        return;
    match.state = "match_end";
    (0, ZoneSystem_1.stopZone)(match.dimension);
    destroyMatchVehicles(match);
    const winner = match.redScore > match.blueScore ? "red" : match.blueScore > match.redScore ? "blue" : "draw";
    const results = {
        redScore: match.redScore,
        blueScore: match.blueScore,
        winner,
        redTeam: match.redTeam.map((p) => ({ id: p.id, name: p.name, kills: p.kills, deaths: p.deaths })),
        blueTeam: match.blueTeam.map((p) => ({ id: p.id, name: p.name, kills: p.kills, deaths: p.deaths }))
    };
    const allPlayers = getAllMatchPlayerMps(match);
    allPlayers.forEach((p) => {
        playerToMatch.delete(p.id);
        (0, ItemsSystem_1.cancelCast)(p.id);
        (0, ItemsSystem_1.clearPlayerItems)(p.id);
        p.removeAllWeapons();
        p.call("client::player:freeze", [false]);
        p.call("client::spectate:stop");
        p.call("client::arena:zoneClear");
        p.setVariable("isSpectating", false);
        _api_1.RAGERP.cef.emit(p, "arena", "matchEnd", results);
    });
    activeMatches.delete(dimension);
    setTimeout(() => {
        allPlayers.forEach((p) => {
            if (mp.players.exists(p)) {
                p.dimension = 0;
                p.call("client::arena:clearTeam");
                _api_1.RAGERP.cef.startPage(p, "mainmenu");
                _api_1.RAGERP.cef.emit(p, "system", "setPage", "mainmenu");
            }
        });
    }, ArenaConfig_1.ARENA_CONFIG.matchEndDelay * 1000);
}
function tickMatches() {
    const now = Date.now();
    activeMatches.forEach((match, dim) => {
        if (match.state === "active" && now >= match.roundEndsAt) {
            const redAlive = getAlivePlayers(match, "red").length;
            const blueAlive = getAlivePlayers(match, "blue").length;
            if (redAlive > blueAlive)
                match.redScore++;
            else if (blueAlive > redAlive)
                match.blueScore++;
            match.state = "round_end";
            (0, ZoneSystem_1.stopZone)(dim);
            getAllMatchPlayerMps(match).forEach((p) => {
                p.call("client::arena:zoneClear");
            });
            emitToAll(match, "roundEnd", {
                winner: redAlive > blueAlive ? "red" : blueAlive > redAlive ? "blue" : "draw",
                redScore: match.redScore,
                blueScore: match.blueScore,
                round: match.currentRound,
                roundsToWin: ArenaConfig_1.ARENA_CONFIG.roundsToWin
            });
            if (match.redScore >= ArenaConfig_1.ARENA_CONFIG.roundsToWin || match.blueScore >= ArenaConfig_1.ARENA_CONFIG.roundsToWin) {
                setTimeout(() => endMatch(dim), ArenaConfig_1.ARENA_CONFIG.roundEndDelay * 1000);
            }
            else {
                setTimeout(() => {
                    if (!activeMatches.has(dim))
                        return;
                    match.currentRound++;
                    beginRound(match);
                }, ArenaConfig_1.ARENA_CONFIG.roundEndDelay * 1000);
            }
        }
        else if (match.state === "active") {
            emitMatchUpdate(match);
        }
    });
}
setInterval(tickMatches, 1000);


/***/ },

/***/ "./source/server/arena/ArenaPresets.asset.ts"
/*!***************************************************!*\
  !*** ./source/server/arena/ArenaPresets.asset.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getArenaPresets = getArenaPresets;
exports.saveArenaPreset = saveArenaPreset;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const DATA_PATH = path.join(process.cwd(), "data", "arenas.json");
let presets = [];
function ensureDataDir() {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function loadPresets() {
    try {
        ensureDataDir();
        if (fs.existsSync(DATA_PATH)) {
            const raw = fs.readFileSync(DATA_PATH, "utf-8");
            const parsed = JSON.parse(raw);
            presets = Array.isArray(parsed) ? parsed : [];
        }
        else {
            presets = [];
            fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2), "utf-8");
        }
    }
    catch (err) {
        console.error("[Hopouts] Failed to load locations:", err);
        presets = [];
    }
    return presets;
}
function getArenaPresets() {
    if (presets.length === 0) {
        loadPresets();
    }
    return presets;
}
function saveArenaPreset(preset) {
    try {
        ensureDataDir();
        const all = getArenaPresets();
        const idx = all.findIndex((p) => p.id === preset.id);
        if (idx >= 0) {
            all[idx] = preset;
        }
        else {
            all.push(preset);
        }
        fs.writeFileSync(DATA_PATH, JSON.stringify(all, null, 2), "utf-8");
        presets = all;
        return true;
    }
    catch (err) {
        console.error("[Hopouts] Failed to save location:", err);
        return false;
    }
}
loadPresets();


/***/ },

/***/ "./source/server/arena/ItemsSystem.ts"
/*!********************************************!*\
  !*** ./source/server/arena/ItemsSystem.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initPlayerItems = initPlayerItems;
exports.clearPlayerItems = clearPlayerItems;
exports.cancelCast = cancelCast;
exports.useItem = useItem;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const ArenaConfig_1 = __webpack_require__(/*! ./ArenaConfig */ "./source/server/arena/ArenaConfig.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! ./ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const playerItems = new Map();
function initPlayerItems(playerId) {
    playerItems.set(playerId, {
        medkits: ArenaConfig_1.ITEM_CONFIG.medkit.countPerRound,
        plates: ArenaConfig_1.ITEM_CONFIG.plate.countPerRound,
        casting: false,
        castTimeout: null
    });
    emitItemCounts(playerId);
}
function clearPlayerItems(playerId) {
    const state = playerItems.get(playerId);
    if (state?.castTimeout)
        clearTimeout(state.castTimeout);
    playerItems.delete(playerId);
}
function cancelCast(playerId) {
    const state = playerItems.get(playerId);
    if (!state)
        return;
    if (state.castTimeout) {
        clearTimeout(state.castTimeout);
        state.castTimeout = null;
    }
    state.casting = false;
    const p = mp.players.at(playerId);
    if (p && mp.players.exists(p)) {
        _api_1.RAGERP.cef.emit(p, "arena", "itemCastCancel", {});
    }
}
function emitItemCounts(playerId) {
    const state = playerItems.get(playerId);
    if (!state)
        return;
    const p = mp.players.at(playerId);
    if (!p || !mp.players.exists(p))
        return;
    _api_1.RAGERP.cef.emit(p, "arena", "itemCounts", {
        medkits: state.medkits,
        plates: state.plates
    });
}
function useItem(player, itemType) {
    const match = (0, ArenaMatch_manager_1.getMatchByPlayer)(player);
    if (!match || match.state !== "active")
        return;
    const state = playerItems.get(player.id);
    if (!state)
        return;
    if (state.casting) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Already using an item.");
        return;
    }
    const count = itemType === "medkit" ? state.medkits : state.plates;
    if (count <= 0) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `No ${itemType}s remaining.`);
        return;
    }
    if (itemType === "medkit" && player.health >= 100 + ArenaConfig_1.ITEM_CONFIG.medkit.maxHp) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Health is already full.");
        return;
    }
    if (itemType === "plate" && player.armour >= ArenaConfig_1.ITEM_CONFIG.plate.maxArmor) {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Armor is already full.");
        return;
    }
    const castTime = itemType === "medkit" ? ArenaConfig_1.ITEM_CONFIG.medkit.castTime : ArenaConfig_1.ITEM_CONFIG.plate.castTime;
    state.casting = true;
    _api_1.RAGERP.cef.emit(player, "arena", "itemCastStart", {
        item: itemType,
        castTime
    });
    state.castTimeout = setTimeout(() => {
        state.casting = false;
        state.castTimeout = null;
        if (!mp.players.exists(player))
            return;
        const currentMatch = (0, ArenaMatch_manager_1.getMatchByPlayer)(player);
        if (!currentMatch || currentMatch.state !== "active")
            return;
        if (itemType === "medkit") {
            state.medkits--;
            const newHp = Math.min(100 + ArenaConfig_1.ITEM_CONFIG.medkit.maxHp, player.health + ArenaConfig_1.ITEM_CONFIG.medkit.heal);
            player.health = newHp;
        }
        else {
            state.plates--;
            const newArmor = Math.min(ArenaConfig_1.ITEM_CONFIG.plate.maxArmor, player.armour + ArenaConfig_1.ITEM_CONFIG.plate.armor);
            player.armour = newArmor;
        }
        emitItemCounts(player.id);
        _api_1.RAGERP.cef.emit(player, "arena", "itemCastComplete", { item: itemType });
    }, castTime);
}
_api_1.RAGERP.cef.register("arena", "useItem", (player, data) => {
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        const item = parsed?.item;
        if (item === "medkit" || item === "plate") {
            useItem(player, item);
        }
    }
    catch {
        console.warn("[arena:useItem] Invalid data:", data);
    }
});


/***/ },

/***/ "./source/server/arena/WeaponAttachments.data.ts"
/*!*******************************************************!*\
  !*** ./source/server/arena/WeaponAttachments.data.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WEAPON_ATTACHMENTS = void 0;
exports.getWeaponAttachments = getWeaponAttachments;
exports.calculateRecoilModifier = calculateRecoilModifier;
exports.WEAPON_ATTACHMENTS = [
    {
        weaponHash: 2578377531,
        weaponName: "weapon_pistol50",
        displayName: "Pistol .50",
        components: [
            { hash: 580369945, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 3654528394, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 899381934, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2805810788, name: "Suppressor", category: "muzzle", recoilModifier: 0.95 },
            { hash: 2008591365, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 3231910285,
        weaponName: "weapon_specialcarbine",
        displayName: "Special Carbine",
        components: [
            { hash: 3334989185, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2089537806, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2698550338, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 2805810788, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
            { hash: 1929467930, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 2132975508,
        weaponName: "weapon_bullpuprifle",
        displayName: "Bullpup Rifle",
        components: [
            { hash: 3315675008, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 3009973007, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2855028148, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 2205435306, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
            { hash: 2824322168, name: "Gilded Gun Metal Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 4208062921,
        weaponName: "weapon_carbinerifle_mk2",
        displayName: "Carbine Rifle Mk II",
        components: [
            { hash: 1283078430, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 1574296533, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 3405310959, name: "Holographic Sight", category: "scope", recoilModifier: 1.0 },
            { hash: 77277509, name: "Small Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 3328927042, name: "Medium Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 2205435306, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 3079677681, name: "Flat Muzzle Brake", category: "muzzle", recoilModifier: 0.85 },
            { hash: 1303784126, name: "Tactical Muzzle Brake", category: "muzzle", recoilModifier: 0.82 },
            { hash: 1602080333, name: "Fat-End Muzzle Brake", category: "muzzle", recoilModifier: 0.80 },
            { hash: 3859329886, name: "Precision Muzzle Brake", category: "muzzle", recoilModifier: 0.78 },
            { hash: 3024542883, name: "Heavy Duty Muzzle Brake", category: "muzzle", recoilModifier: 0.75 },
            { hash: 3513717749, name: "Slanted Muzzle Brake", category: "muzzle", recoilModifier: 0.77 },
            { hash: 2640679034, name: "Split-End Muzzle Brake", category: "muzzle", recoilModifier: 0.79 },
            { hash: 2201368575, name: "Default Barrel", category: "barrel", recoilModifier: 1.0 },
            { hash: 2335983627, name: "Heavy Barrel", category: "barrel", recoilModifier: 0.88 },
            { hash: 2640299872, name: "Grip", category: "grip", recoilModifier: 0.8 },
        ]
    },
    {
        weaponHash: 487013001,
        weaponName: "weapon_pumpshotgun",
        displayName: "Pump Shotgun",
        components: [
            { hash: 0, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 3859329886, name: "Suppressor", category: "muzzle", recoilModifier: 0.92 },
            { hash: 2732039643, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 3220176749,
        weaponName: "weapon_assaultrifle",
        displayName: "Assault Rifle",
        components: [
            { hash: 3193891350, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2971750299, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2855028148, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 2805810788, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
            { hash: 1319990579, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 1593441988,
        weaponName: "weapon_combatpistol",
        displayName: "Combat Pistol",
        components: [
            { hash: 119655033, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 3596571437, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 899381934, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 3271853210, name: "Suppressor", category: "muzzle", recoilModifier: 0.95 },
            { hash: 3328267634, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 3523564046,
        weaponName: "weapon_heavypistol",
        displayName: "Heavy Pistol",
        components: [
            { hash: 222992026, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 1694090795, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 899381934, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 3271853210, name: "Suppressor", category: "muzzle", recoilModifier: 0.95 },
            { hash: 2053799099, name: "Etched Wood Grip Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 736523883,
        weaponName: "weapon_smg",
        displayName: "SMG",
        components: [
            { hash: 643830487, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 889916667, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2041522294, name: "Drum Magazine", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 1006670047, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 3271853210, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 663517328, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 171789620,
        weaponName: "weapon_combatpdw",
        displayName: "Combat PDW",
        components: [
            { hash: 1129462574, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 859604227, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 1857608283, name: "Drum Magazine", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2855028148, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
        ]
    },
    {
        weaponHash: 2210333304,
        weaponName: "weapon_carbinerifle",
        displayName: "Carbine Rifle",
        components: [
            { hash: 3334989185, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2089537806, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2698550338, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 2805810788, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
        ]
    },
    {
        weaponHash: 2937143193,
        weaponName: "weapon_advancedrifle",
        displayName: "Advanced Rifle",
        components: [
            { hash: 3193891350, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2971750299, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2855028148, name: "Scope", category: "scope", recoilModifier: 1.0 },
            { hash: 2805810788, name: "Suppressor", category: "muzzle", recoilModifier: 0.9 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
        ]
    },
    {
        weaponHash: 3800352039,
        weaponName: "weapon_assaultshotgun",
        displayName: "Assault Shotgun",
        components: [
            { hash: 2498213963, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2258927634, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2205435306, name: "Suppressor", category: "muzzle", recoilModifier: 0.92 },
            { hash: 202788691, name: "Grip", category: "grip", recoilModifier: 0.8 },
        ]
    },
    {
        weaponHash: 984333226,
        weaponName: "weapon_combatshotgun",
        displayName: "Combat Shotgun",
        components: [
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2205435306, name: "Suppressor", category: "muzzle", recoilModifier: 0.92 },
        ]
    },
];
const attachmentsByHash = new Map(exports.WEAPON_ATTACHMENTS.map(w => [w.weaponHash, w]));
function getWeaponAttachments(hash) {
    return attachmentsByHash.get(hash);
}
function calculateRecoilModifier(weaponHash, componentHashes) {
    const weapon = attachmentsByHash.get(weaponHash);
    if (!weapon)
        return 1.0;
    let modifier = 1.0;
    for (const ch of componentHashes) {
        const comp = weapon.components.find(c => c.hash === ch);
        if (comp)
            modifier *= comp.recoilModifier;
    }
    return modifier;
}


/***/ },

/***/ "./source/server/arena/WeaponPresets.service.ts"
/*!******************************************************!*\
  !*** ./source/server/arena/WeaponPresets.service.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadPlayerPresets = loadPlayerPresets;
exports.savePlayerPreset = savePlayerPreset;
exports.applyWeaponPresets = applyWeaponPresets;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const WeaponPreset_entity_1 = __webpack_require__(/*! @entities/WeaponPreset.entity */ "./source/server/database/entity/WeaponPreset.entity.ts");
const WeaponAttachments_data_1 = __webpack_require__(/*! ./WeaponAttachments.data */ "./source/server/arena/WeaponAttachments.data.ts");
async function loadPlayerPresets(characterId) {
    return _api_1.RAGERP.database.getRepository(WeaponPreset_entity_1.WeaponPresetEntity).find({ where: { characterId } });
}
async function savePlayerPreset(characterId, weaponName, components) {
    const repo = _api_1.RAGERP.database.getRepository(WeaponPreset_entity_1.WeaponPresetEntity);
    let preset = await repo.findOne({ where: { characterId, weaponName } });
    if (preset) {
        preset.components = components;
        await repo.save(preset);
    }
    else {
        preset = repo.create({ characterId, weaponName, components });
        await repo.save(preset);
    }
}
async function applyWeaponPresets(player, weaponHashes) {
    if (!player.character)
        return;
    const presets = await loadPlayerPresets(player.character.id);
    let combinedRecoil = 1.0;
    for (const hash of weaponHashes) {
        const attachData = (0, WeaponAttachments_data_1.getWeaponAttachments)(hash);
        if (!attachData)
            continue;
        const preset = presets.find(p => p.weaponName === attachData.weaponName);
        if (!preset || preset.components.length === 0)
            continue;
        const validComponents = preset.components.filter(ch => attachData.components.some(c => c.hash === ch));
        player.call("client::weapon:applyComponents", [hash, JSON.stringify(validComponents)]);
        const weaponRecoil = (0, WeaponAttachments_data_1.calculateRecoilModifier)(hash, validComponents);
        combinedRecoil *= weaponRecoil;
    }
    player.call("client::recoil:setModifier", [combinedRecoil]);
}
_api_1.RAGERP.cef.register("loadout", "getPresets", async (player) => {
    if (!player.character)
        return;
    const presets = await loadPlayerPresets(player.character.id);
    _api_1.RAGERP.cef.emit(player, "loadout", "presetsLoaded", {
        presets: presets.map(p => ({ weaponName: p.weaponName, components: p.components }))
    });
});
_api_1.RAGERP.cef.register("loadout", "savePreset", async (player, data) => {
    if (!player.character)
        return;
    try {
        const parsed = JSON.parse(data);
        const { weaponName, components } = parsed;
        if (!weaponName || !Array.isArray(components))
            return;
        await savePlayerPreset(player.character.id, weaponName, components);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Loadout saved!");
    }
    catch {
        player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Failed to save loadout.");
    }
});


/***/ },

/***/ "./source/server/arena/ZoneSystem.ts"
/*!*******************************************!*\
  !*** ./source/server/arena/ZoneSystem.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startZone = startZone;
exports.stopZone = stopZone;
exports.getZoneState = getZoneState;
exports.tickZones = tickZones;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const ArenaConfig_1 = __webpack_require__(/*! ./ArenaConfig */ "./source/server/arena/ArenaConfig.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! ./ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const activeZones = new Map();
const outOfBoundsStart = new Map();
const OUT_OF_BOUNDS_RADIUS = 320;
const OUT_OF_BOUNDS_GRACE = 8;
function startZone(dimension, centerX, centerY, elapsedOffsetMs = 0) {
    if (ArenaConfig_1.ZONE_PHASES.length === 0)
        return;
    const firstPhase = ArenaConfig_1.ZONE_PHASES[0];
    const zone = {
        dimension,
        centerX,
        centerY,
        currentRadius: 200,
        targetRadius: firstPhase.endRadius,
        currentPhase: 0,
        phaseStartedAt: Date.now() - elapsedOffsetMs,
        phaseDuration: firstPhase.duration * 1000,
        dps: firstPhase.dps,
        active: true
    };
    activeZones.set(dimension, zone);
}
function stopZone(dimension) {
    activeZones.delete(dimension);
    outOfBoundsStart.clear();
}
function getZoneState(dimension) {
    return activeZones.get(dimension);
}
function advancePhase(zone) {
    zone.currentPhase++;
    if (zone.currentPhase >= ArenaConfig_1.ZONE_PHASES.length) {
        return false;
    }
    const phase = ArenaConfig_1.ZONE_PHASES[zone.currentPhase];
    zone.currentRadius = zone.targetRadius;
    zone.targetRadius = phase.endRadius;
    zone.phaseDuration = phase.duration * 1000;
    zone.phaseStartedAt = Date.now();
    zone.dps = phase.dps;
    return true;
}
function getCurrentRadius(zone) {
    const elapsed = Date.now() - zone.phaseStartedAt;
    const progress = Math.min(1, elapsed / zone.phaseDuration);
    return zone.currentRadius + (zone.targetRadius - zone.currentRadius) * progress;
}
function isInZone(zone, x, y) {
    const radius = getCurrentRadius(zone);
    const dx = x - zone.centerX;
    const dy = y - zone.centerY;
    return (dx * dx + dy * dy) <= (radius * radius);
}
function tickZones() {
    const now = Date.now();
    activeZones.forEach((zone, dim) => {
        if (!zone.active)
            return;
        const match = (0, ArenaMatch_manager_1.getMatchByDimension)(dim);
        if (!match || match.state !== "active")
            return;
        const elapsed = now - zone.phaseStartedAt;
        if (elapsed >= zone.phaseDuration) {
            if (!advancePhase(zone)) {
                zone.active = false;
            }
        }
        const radius = getCurrentRadius(zone);
        const safeRadius = Number.isFinite(radius) && radius > 0 ? Math.round(radius) : 200;
        const phaseTimeLeft = Math.max(0, Math.ceil((zone.phaseDuration - (now - zone.phaseStartedAt)) / 1000));
        const allPlayers = [...match.redTeam, ...match.blueTeam];
        const playersToKill = [];
        allPlayers.forEach((mp_) => {
            const p = mp.players.at(mp_.id);
            if (!p || !mp.players.exists(p))
                return;
            if (mp_.alive && !isInZone(zone, p.position.x, p.position.y)) {
                const currentHp = p.health;
                const newHp = currentHp - zone.dps;
                if (newHp <= 0) {
                    playersToKill.push(p);
                }
                else {
                    p.health = newHp;
                }
            }
            const dx = p.position.x - zone.centerX;
            const dy = p.position.y - zone.centerY;
            const distSq = dx * dx + dy * dy;
            if (distSq > OUT_OF_BOUNDS_RADIUS * OUT_OF_BOUNDS_RADIUS) {
                const startedAt = outOfBoundsStart.get(p.id) ?? now;
                outOfBoundsStart.set(p.id, startedAt);
                const timeLeft = Math.max(0, OUT_OF_BOUNDS_GRACE - Math.floor((now - startedAt) / 1000));
                _api_1.RAGERP.cef.emit(p, "arena", "outOfBounds", { active: true, timeLeft });
                if (timeLeft <= 0) {
                    playersToKill.push(p);
                }
            }
            else if (outOfBoundsStart.has(p.id)) {
                outOfBoundsStart.delete(p.id);
                _api_1.RAGERP.cef.emit(p, "arena", "outOfBounds", { active: false, timeLeft: 0 });
            }
            p.call("client::arena:zoneUpdate", [
                zone.centerX,
                zone.centerY,
                Math.round(radius),
                zone.currentPhase + 1,
                ArenaConfig_1.ZONE_PHASES.length,
                phaseTimeLeft,
                zone.dps
            ]);
            _api_1.RAGERP.cef.emit(p, "arena", "zoneUpdate", {
                centerX: zone.centerX,
                centerY: zone.centerY,
                radius: safeRadius,
                phase: zone.currentPhase + 1,
                totalPhases: ArenaConfig_1.ZONE_PHASES.length,
                phaseTimeLeft,
                dps: zone.dps
            });
        });
        playersToKill.forEach((p) => {
            if (mp.players.exists(p)) {
                (0, ArenaMatch_manager_1.handleZoneDeath)(p);
            }
        });
    });
}
setInterval(tickZones, 1000);


/***/ },

/***/ "./source/server/assets/Admin.asset.ts"
/*!*********************************************!*\
  !*** ./source/server/assets/Admin.asset.ts ***!
  \*********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adminTeleports = void 0;
const adminTeleports = {
    lspd: new mp.Vector3(414.5832214355469, -989.611328125, 29.417924880981445),
    pillbox: new mp.Vector3(280.22662353515625, -582.34033203125, 43.279014587402344),
    bank: new mp.Vector3(226.28297424316406, 210.3422088623047, 105.53901672363281),
    cityhall: new mp.Vector3(241.82180786132812, -391.95587158203125, 46.30564880371094),
    paleto: new mp.Vector3(-433.9971923828125, 6025.0625, 31.490114212036133),
    paletobank: new mp.Vector3(-118.35197448730469, 6455.9091796875, 31.401966094970703),
    casino: new mp.Vector3(914.2948608398438, 55.01435852050781, 80.89936828613281),
    airport: new mp.Vector3(-1039.8572998046875, -2737.929443359375, 13.75472640991211),
    lspier: new mp.Vector3(-1853.55908203125, -1229.3692626953125, 13.01725959777832),
    bahama: new mp.Vector3(-1392.2113037109375, -585.1786499023438, 30.24015235900879),
    richman: new mp.Vector3(-105.57720947265625, 428.8331604003906, 113.1912612915039),
    sandy: new mp.Vector3(1861.340087890625, 3678.413330078125, 33.65660095214844),
    farmer: new mp.Vector3(2825.45751953125, 4572.54541015625, 46.50938415527344),
    army: new mp.Vector3(-2337.3369140625, 3266.97802734375, 32.827632904052734),
    taxi: new mp.Vector3(903.3555908203125, -173.010498046875, 74.07547760009766),
    gopostal: new mp.Vector3(85.86287689208984, 107.49935913085938, 79.15878295898438),
    lscustoms: new mp.Vector3(-371.1271057128906, -121.13578033447266, 38.68169403076172),
    armyship: new mp.Vector3(3080.593017578125, -4723.19775390625, 15.262296676635742)
};
exports.adminTeleports = adminTeleports;


/***/ },

/***/ "./source/server/assets/PlayerSpawn.asset.ts"
/*!***************************************************!*\
  !*** ./source/server/assets/PlayerSpawn.asset.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hospitalSpawns = exports.playerSpawns = void 0;
const playerSpawns = [{}];
exports.playerSpawns = playerSpawns;
const hospitalSpawns = [
    { position: new mp.Vector3(1839.2734375, 3672.61767578125, 34.27676773071289), heading: -152.0281982421875 }, //sandy
    { position: new mp.Vector3(298.16217041015625, -584.3094482421875, 43.260833740234375), heading: 69.25381469726562 }, //textile city
    { position: new mp.Vector3(359.396484375, -589.2114868164062, 28.805456161499023), heading: -109.81839752197266 }, //textile city 2
    { position: new mp.Vector3(338.7778625488281, -1394.4869384765625, 32.50925827026367), heading: 48.23773193359375 } //strawberry
];
exports.hospitalSpawns = hospitalSpawns;


/***/ },

/***/ "./source/server/assets/Vehicle.assets.ts"
/*!************************************************!*\
  !*** ./source/server/assets/Vehicle.assets.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.vehicleClasses = exports.vehicleModelSeats = void 0;
const vehicleModelSeats = [
    { vehicleHash: 1032823388, seats: 2 },
    { vehicleHash: 2833484545, seats: 2 },
    { vehicleHash: 3950024287, seats: 2 },
    { vehicleHash: 2485144969, seats: 4 },
    { vehicleHash: 2487343317, seats: 4 },
    { vehicleHash: 524108981, seats: 0 },
    { vehicleHash: 3581397346, seats: 16 },
    { vehicleHash: 3087536137, seats: 0 },
    { vehicleHash: 2818520053, seats: 0 },
    { vehicleHash: 2657817814, seats: 0 },
    { vehicleHash: 3517691494, seats: 0 },
    { vehicleHash: 2222034228, seats: 10 },
    { vehicleHash: 1283517198, seats: 16 },
    { vehicleHash: 2391954683, seats: 4 },
    { vehicleHash: 1560980623, seats: 2 },
    { vehicleHash: 1171614426, seats: 4 },
    { vehicleHash: 3471458123, seats: 10 },
    { vehicleHash: 1074326203, seats: 2 },
    { vehicleHash: 3486135912, seats: 4 },
    { vehicleHash: 142944341, seats: 4 },
    { vehicleHash: 850565707, seats: 4 },
    { vehicleHash: 3253274834, seats: 2 },
    { vehicleHash: 2053223216, seats: 2 },
    { vehicleHash: 1126868326, seats: 2 },
    { vehicleHash: 850991848, seats: 2 },
    { vehicleHash: 2166734073, seats: 1 },
    { vehicleHash: 4246935337, seats: 1 },
    { vehicleHash: 3025077634, seats: 1 },
    { vehicleHash: 4278019151, seats: 6 },
    { vehicleHash: 2072156101, seats: 4 },
    { vehicleHash: 1739845664, seats: 4 },
    { vehicleHash: 2307837162, seats: 6 },
    { vehicleHash: 4061868990, seats: 6 },
    { vehicleHash: 121658888, seats: 4 },
    { vehicleHash: 1069929536, seats: 2 },
    { vehicleHash: 2859047862, seats: 4 },
    { vehicleHash: 3612755468, seats: 2 },
    { vehicleHash: 3990165190, seats: 4 },
    { vehicleHash: 736902334, seats: 4 },
    { vehicleHash: 1886712733, seats: 1 },
    { vehicleHash: 2598821281, seats: 2 },
    { vehicleHash: 4143991942, seats: 4 },
    { vehicleHash: 2948279460, seats: 4 },
    { vehicleHash: 3387490166, seats: 4 },
    { vehicleHash: 2551651283, seats: 4 },
    { vehicleHash: 893081117, seats: 4 },
    { vehicleHash: 1132262048, seats: 4 },
    { vehicleHash: 2006918058, seats: 4 },
    { vehicleHash: 3505073125, seats: 4 },
    { vehicleHash: 456714581, seats: 4 },
    { vehicleHash: 2549763894, seats: 4 },
    { vehicleHash: 3334677549, seats: 4 },
    { vehicleHash: 1147287684, seats: 2 },
    { vehicleHash: 3757070668, seats: 2 },
    { vehicleHash: 1876516712, seats: 2 },
    { vehicleHash: 2072687711, seats: 2 },
    { vehicleHash: 2983812512, seats: 2 },
    { vehicleHash: 3249425686, seats: 2 },
    { vehicleHash: 330661258, seats: 2 },
    { vehicleHash: 108773431, seats: 2 },
    { vehicleHash: 3288047904, seats: 1 },
    { vehicleHash: 2751205197, seats: 4 },
    { vehicleHash: 3164157193, seats: 4 },
    { vehicleHash: 1682114128, seats: 4 },
    { vehicleHash: 2633113103, seats: 2 },
    { vehicleHash: 534258863, seats: 2 },
    { vehicleHash: 37348240, seats: 2 },
    { vehicleHash: 1770332643, seats: 2 },
    { vehicleHash: 1177543287, seats: 4 },
    { vehicleHash: 3900892662, seats: 4 },
    { vehicleHash: 2164484578, seats: 1 },
    { vehicleHash: 2589662668, seats: 2 },
    { vehicleHash: 3410276810, seats: 1 },
    { vehicleHash: 80636076, seats: 2 },
    { vehicleHash: 3609690755, seats: 4 },
    { vehicleHash: 2411965148, seats: 4 },
    { vehicleHash: 3053254478, seats: 4 },
    { vehicleHash: 3003014393, seats: 2 },
    { vehicleHash: 4289813342, seats: 4 },
    { vehicleHash: 3728579874, seats: 2 },
    { vehicleHash: 3703357000, seats: 2 },
    { vehicleHash: 1127131465, seats: 4 },
    { vehicleHash: 2647026068, seats: 8 },
    { vehicleHash: 3903372712, seats: 4 },
    { vehicleHash: 4205676014, seats: 2 },
    { vehicleHash: 2299640309, seats: 2 },
    { vehicleHash: 1938952078, seats: 8 },
    { vehicleHash: 1353720154, seats: 2 },
    { vehicleHash: 1491375716, seats: 1 },
    { vehicleHash: 3157435195, seats: 4 },
    { vehicleHash: 499169875, seats: 2 },
    { vehicleHash: 1909141499, seats: 4 },
    { vehicleHash: 2016857647, seats: 2 },
    { vehicleHash: 2519238556, seats: 8 },
    { vehicleHash: 2494797253, seats: 2 },
    { vehicleHash: 884422927, seats: 4 },
    { vehicleHash: 1518533038, seats: 2 },
    { vehicleHash: 444583674, seats: 1 },
    { vehicleHash: 418536135, seats: 2 },
    { vehicleHash: 3005245074, seats: 4 },
    { vehicleHash: 886934177, seats: 4 },
    { vehicleHash: 3117103977, seats: 2 },
    { vehicleHash: 3670438162, seats: 4 },
    { vehicleHash: 4174679674, seats: 6 },
    { vehicleHash: 1051415893, seats: 2 },
    { vehicleHash: 544021352, seats: 2 },
    { vehicleHash: 1269098716, seats: 4 },
    { vehicleHash: 469291905, seats: 4 },
    { vehicleHash: 2170765704, seats: 2 },
    { vehicleHash: 914654722, seats: 4 },
    { vehicleHash: 3546958660, seats: 4 },
    { vehicleHash: 2230595153, seats: 4 },
    { vehicleHash: 321739290, seats: 4 },
    { vehicleHash: 3984502180, seats: 4 },
    { vehicleHash: 3510150843, seats: 2 },
    { vehicleHash: 475220373, seats: 2 },
    { vehicleHash: 3861591579, seats: 2 },
    { vehicleHash: 1783355638, seats: 1 },
    { vehicleHash: 904750859, seats: 6 },
    { vehicleHash: 3244501995, seats: 2 },
    { vehicleHash: 1348744438, seats: 4 },
    { vehicleHash: 3783366066, seats: 4 },
    { vehicleHash: 569305213, seats: 2 },
    { vehicleHash: 3486509883, seats: 4 },
    { vehicleHash: 2287941233, seats: 11 },
    { vehicleHash: 3917501776, seats: 2 },
    { vehicleHash: 1830407356, seats: 2 },
    { vehicleHash: 2157618379, seats: 2 },
    { vehicleHash: 2199527893, seats: 2 },
    { vehicleHash: 1507916787, seats: 2 },
    { vehicleHash: 2112052861, seats: 2 },
    { vehicleHash: 2046537925, seats: 4 },
    { vehicleHash: 2321795001, seats: 4 },
    { vehicleHash: 2667966721, seats: 4 },
    { vehicleHash: 1912215274, seats: 4 },
    { vehicleHash: 2758042359, seats: 4 },
    { vehicleHash: 2515846680, seats: 4 },
    { vehicleHash: 4175309224, seats: 4 },
    { vehicleHash: 943752001, seats: 4 },
    { vehicleHash: 2844316578, seats: 2 },
    { vehicleHash: 741586030, seats: 8 },
    { vehicleHash: 2411098011, seats: 4 },
    { vehicleHash: 3144368207, seats: 4 },
    { vehicleHash: 356391690, seats: 2 },
    { vehicleHash: 1645267888, seats: 4 },
    { vehicleHash: 1933662059, seats: 4 },
    { vehicleHash: 2360515092, seats: 2 },
    { vehicleHash: 1737773231, seats: 2 },
    { vehicleHash: 2643899483, seats: 4 },
    { vehicleHash: 3627815886, seats: 2 },
    { vehicleHash: 3087195462, seats: 2 },
    { vehicleHash: 4280472072, seats: 4 },
    { vehicleHash: 2249373259, seats: 2 },
    { vehicleHash: 3196165219, seats: 10 },
    { vehicleHash: 4067225593, seats: 2 },
    { vehicleHash: 1162065741, seats: 4 },
    { vehicleHash: 2518351607, seats: 2 },
    { vehicleHash: 782665360, seats: 2 },
    { vehicleHash: 3089277354, seats: 8 },
    { vehicleHash: 3448987385, seats: 2 },
    { vehicleHash: 2136773105, seats: 4 },
    { vehicleHash: 627094268, seats: 2 },
    { vehicleHash: 2609945748, seats: 2 },
    { vehicleHash: 3695398481, seats: 4 },
    { vehicleHash: 734217681, seats: 4 },
    { vehicleHash: 3105951696, seats: 4 },
    { vehicleHash: 989381445, seats: 2 },
    { vehicleHash: 3039514899, seats: 4 },
    { vehicleHash: 3548084598, seats: 2 },
    { vehicleHash: 2594165727, seats: 2 },
    { vehicleHash: 1221512915, seats: 4 },
    { vehicleHash: 1349725314, seats: 2 },
    { vehicleHash: 873639469, seats: 4 },
    { vehicleHash: 3172678083, seats: 2 },
    { vehicleHash: 3101863448, seats: 2 },
    { vehicleHash: 1337041428, seats: 4 },
    { vehicleHash: 2611638396, seats: 4 },
    { vehicleHash: 1922257928, seats: 8 },
    { vehicleHash: 3484649228, seats: 4 },
    { vehicleHash: 728614474, seats: 4 },
    { vehicleHash: 2817386317, seats: 4 },
    { vehicleHash: 1545842587, seats: 2 },
    { vehicleHash: 2196019706, seats: 2 },
    { vehicleHash: 1747439474, seats: 4 },
    { vehicleHash: 4080511798, seats: 4 },
    { vehicleHash: 1723137093, seats: 4 },
    { vehicleHash: 970598228, seats: 4 },
    { vehicleHash: 1123216662, seats: 4 },
    { vehicleHash: 384071873, seats: 2 },
    { vehicleHash: 699456151, seats: 2 },
    { vehicleHash: 2983726598, seats: 2 },
    { vehicleHash: 2400073108, seats: 4 },
    { vehicleHash: 1951180813, seats: 1 },
    { vehicleHash: 3286105550, seats: 4 },
    { vehicleHash: 3338918751, seats: 4 },
    { vehicleHash: 1917016601, seats: 4 },
    { vehicleHash: 1641462412, seats: 1 },
    { vehicleHash: 2218488798, seats: 1 },
    { vehicleHash: 1445631933, seats: 1 },
    { vehicleHash: 1019737494, seats: 0 },
    { vehicleHash: 3895125590, seats: 0 },
    { vehicleHash: 48339065, seats: 2 },
    { vehicleHash: 3347205726, seats: 2 },
    { vehicleHash: 464687292, seats: 2 },
    { vehicleHash: 1531094468, seats: 2 },
    { vehicleHash: 1762279763, seats: 2 },
    { vehicleHash: 2261744861, seats: 2 },
    { vehicleHash: 1941029835, seats: 10 },
    { vehicleHash: 2971866336, seats: 2 },
    { vehicleHash: 3852654278, seats: 2 },
    { vehicleHash: 516990260, seats: 2 },
    { vehicleHash: 887537515, seats: 2 },
    { vehicleHash: 2132890591, seats: 2 },
    { vehicleHash: 523724515, seats: 2 },
    { vehicleHash: 1777363799, seats: 4 },
    { vehicleHash: 2333339779, seats: 6 },
    { vehicleHash: 65402552, seats: 2 },
    { vehicleHash: 758895617, seats: 2 },
    { vehicleHash: 788045382, seats: 2 },
    { vehicleHash: 2841686334, seats: 2 },
    { vehicleHash: 4108429845, seats: 1 },
    { vehicleHash: 1127861609, seats: 1 },
    { vehicleHash: 3061159916, seats: 1 },
    { vehicleHash: 3894672200, seats: 1 },
    { vehicleHash: 3458454463, seats: 1 },
    { vehicleHash: 448402357, seats: 1 },
    { vehicleHash: 1131912276, seats: 1 },
    { vehicleHash: 4260343491, seats: 1 },
    { vehicleHash: 1672195559, seats: 2 },
    { vehicleHash: 11251904, seats: 2 },
    { vehicleHash: 2154536131, seats: 2 },
    { vehicleHash: 4180675781, seats: 2 },
    { vehicleHash: 3403504941, seats: 2 },
    { vehicleHash: 3401388520, seats: 2 },
    { vehicleHash: 2006142190, seats: 2 },
    { vehicleHash: 2623969160, seats: 2 },
    { vehicleHash: 3385765638, seats: 2 },
    { vehicleHash: 4154065143, seats: 2 },
    { vehicleHash: 3469130167, seats: 2 },
    { vehicleHash: 55628203, seats: 2 },
    { vehicleHash: 301427732, seats: 2 },
    { vehicleHash: 837858166, seats: 6 },
    { vehicleHash: 788747387, seats: 4 },
    { vehicleHash: 745926877, seats: 4 },
    { vehicleHash: 4244420235, seats: 10 },
    { vehicleHash: 1621617168, seats: 10 },
    { vehicleHash: 1394036463, seats: 10 },
    { vehicleHash: 1044954915, seats: 2 },
    { vehicleHash: 353883353, seats: 4 },
    { vehicleHash: 2634305738, seats: 4 },
    { vehicleHash: 3660088182, seats: 2 },
    { vehicleHash: 744705981, seats: 4 },
    { vehicleHash: 1949211328, seats: 4 },
    { vehicleHash: 3650256867, seats: 2 },
    { vehicleHash: 970356638, seats: 2 },
    { vehicleHash: 2172210288, seats: 1 },
    { vehicleHash: 2548391185, seats: 4 },
    { vehicleHash: 1058115860, seats: 2 },
    { vehicleHash: 3080461301, seats: 10 },
    { vehicleHash: 621481054, seats: 10 },
    { vehicleHash: 1981688531, seats: 10 },
    { vehicleHash: 3013282534, seats: 1 },
    { vehicleHash: 368211810, seats: 2 },
    { vehicleHash: 400514754, seats: 2 },
    { vehicleHash: 3251507587, seats: 4 },
    { vehicleHash: 1033245328, seats: 4 },
    { vehicleHash: 276773164, seats: 2 },
    { vehicleHash: 861409633, seats: 2 },
    { vehicleHash: 3806844075, seats: 4 },
    { vehicleHash: 290013743, seats: 4 },
    { vehicleHash: 3264692260, seats: 2 },
    { vehicleHash: 3678636260, seats: 2 },
    { vehicleHash: 771711535, seats: 1 },
    { vehicleHash: 184361638, seats: 0 },
    { vehicleHash: 1030400667, seats: 2 },
    { vehicleHash: 920453016, seats: 2 },
    { vehicleHash: 240201337, seats: 2 },
    { vehicleHash: 642617954, seats: 2 },
    { vehicleHash: 586013744, seats: 2 },
    { vehicleHash: 868868440, seats: 4 },
    { vehicleHash: 2154757102, seats: 0 },
    { vehicleHash: 3417488910, seats: 0 },
    { vehicleHash: 2715434129, seats: 0 },
    { vehicleHash: 2236089197, seats: 0 },
    { vehicleHash: 2524324030, seats: 0 },
    { vehicleHash: 390902130, seats: 0 },
    { vehicleHash: 3564062519, seats: 0 },
    { vehicleHash: 2016027501, seats: 0 },
    { vehicleHash: 2078290630, seats: 0 },
    { vehicleHash: 1784254509, seats: 0 },
    { vehicleHash: 2091594960, seats: 0 },
    { vehicleHash: 2942498482, seats: 0 },
    { vehicleHash: 712162987, seats: 0 },
    { vehicleHash: 2621610858, seats: 4 },
    { vehicleHash: 3078201489, seats: 2 },
    { vehicleHash: 2672523198, seats: 2 },
    { vehicleHash: 338562499, seats: 2 },
    { vehicleHash: 4012021193, seats: 4 },
    { vehicleHash: 3945366167, seats: 2 },
    { vehicleHash: 231083307, seats: 4 },
    { vehicleHash: 92612664, seats: 2 },
    { vehicleHash: 1488164764, seats: 4 },
    { vehicleHash: 117401876, seats: 6 },
    { vehicleHash: 2997294755, seats: 2 },
    { vehicleHash: 408192225, seats: 2 },
    { vehicleHash: 767087018, seats: 2 },
    { vehicleHash: 1341619767, seats: 2 },
    { vehicleHash: 2891838741, seats: 2 },
    { vehicleHash: 4152024626, seats: 2 },
    { vehicleHash: 486987393, seats: 4 },
    { vehicleHash: 1836027715, seats: 2 },
    { vehicleHash: 841808271, seats: 2 },
    { vehicleHash: 1373123368, seats: 4 },
    { vehicleHash: 3089165662, seats: 2 },
    { vehicleHash: 75131841, seats: 4 },
    { vehicleHash: 3863274624, seats: 2 },
    { vehicleHash: 3057713523, seats: 6 },
    { vehicleHash: 1078682497, seats: 2 },
    { vehicleHash: 3449006043, seats: 2 },
    { vehicleHash: 743478836, seats: 1 },
    { vehicleHash: 165154707, seats: 16 },
    { vehicleHash: 1824333165, seats: 1 },
    { vehicleHash: 1011753235, seats: 2 },
    { vehicleHash: 3955379698, seats: 4 },
    { vehicleHash: 4135840458, seats: 2 },
    { vehicleHash: 1265391242, seats: 2 },
    { vehicleHash: 3205927392, seats: 2 },
    { vehicleHash: 3188613414, seats: 2 },
    { vehicleHash: 3663206819, seats: 2 },
    { vehicleHash: 3705788919, seats: 2 },
    { vehicleHash: 729783779, seats: 2 },
    { vehicleHash: 2242229361, seats: 6 },
    { vehicleHash: 1077420264, seats: 5 },
    { vehicleHash: 1956216962, seats: 0 },
    { vehicleHash: 941800958, seats: 2 },
    { vehicleHash: 444171386, seats: 6 },
    { vehicleHash: 970385471, seats: 1 },
    { vehicleHash: 2434067162, seats: 9 },
    { vehicleHash: 2071877360, seats: 6 },
    { vehicleHash: 296357396, seats: 4 },
    { vehicleHash: 2198148358, seats: 3 },
    { vehicleHash: 509498602, seats: 4 },
    { vehicleHash: 4212341271, seats: 4 },
    { vehicleHash: 1753414259, seats: 2 },
    { vehicleHash: 2186977100, seats: 6 },
    { vehicleHash: 640818791, seats: 2 },
    { vehicleHash: 2922118804, seats: 4 },
    { vehicleHash: 410882957, seats: 4 },
    { vehicleHash: 3039269212, seats: 4 },
    { vehicleHash: 630371791, seats: 10 },
    { vehicleHash: 2694714877, seats: 4 },
    { vehicleHash: 833469436, seats: 4 },
    { vehicleHash: 1075432268, seats: 4 },
    { vehicleHash: 3080673438, seats: 8 },
    { vehicleHash: 2728226064, seats: 2 },
    { vehicleHash: 1987142870, seats: 2 },
    { vehicleHash: 3796912450, seats: 2 },
    { vehicleHash: 1581459400, seats: 2 },
    { vehicleHash: 784565758, seats: 2 },
    { vehicleHash: 2941886209, seats: 2 },
    { vehicleHash: 1663218586, seats: 2 },
    { vehicleHash: 2815302597, seats: 2 },
    { vehicleHash: 1070967343, seats: 4 },
    { vehicleHash: 349605904, seats: 2 },
    { vehicleHash: 2175389151, seats: 2 },
    { vehicleHash: 2504420315, seats: 2 },
    { vehicleHash: 525509695, seats: 4 },
    { vehicleHash: 1896491931, seats: 4 },
    { vehicleHash: 2254540506, seats: 4 },
    { vehicleHash: 2933279331, seats: 2 },
    { vehicleHash: 3281516360, seats: 2 },
    { vehicleHash: 2006667053, seats: 2 },
    { vehicleHash: 2068293287, seats: 2 },
    { vehicleHash: 3463132580, seats: 4 },
    { vehicleHash: 1102544804, seats: 2 },
    { vehicleHash: 2351681756, seats: 2 },
    { vehicleHash: 2634021974, seats: 2 },
    { vehicleHash: 4180339789, seats: 5 },
    { vehicleHash: 2809443750, seats: 4 },
    { vehicleHash: 1489967196, seats: 4 },
    { vehicleHash: 3406724313, seats: 4 },
    { vehicleHash: 1922255844, seats: 4 },
    { vehicleHash: 906642318, seats: 4 },
    { vehicleHash: 704435172, seats: 4 },
    { vehicleHash: 2264796000, seats: 4 },
    { vehicleHash: 3690124666, seats: 4 },
    { vehicleHash: 1878062887, seats: 4 },
    { vehicleHash: 634118882, seats: 4 },
    { vehicleHash: 470404958, seats: 4 },
    { vehicleHash: 666166960, seats: 4 },
    { vehicleHash: 908897389, seats: 4 },
    { vehicleHash: 3983945033, seats: 2 },
    { vehicleHash: 867467158, seats: 4 },
    { vehicleHash: 1448677353, seats: 4 },
    { vehicleHash: 437538602, seats: 4 },
    { vehicleHash: 2025593404, seats: 2 },
    { vehicleHash: 710198397, seats: 4 },
    { vehicleHash: 2623428164, seats: 4 },
    { vehicleHash: 1543134283, seats: 4 },
    { vehicleHash: 972671128, seats: 2 },
    { vehicleHash: 3999278268, seats: 2 },
    { vehicleHash: 633712403, seats: 2 },
    { vehicleHash: 3692679425, seats: 6 },
    { vehicleHash: 2255212070, seats: 2 },
    { vehicleHash: 3168702960, seats: 4 },
    { vehicleHash: 223258115, seats: 2 },
    { vehicleHash: 1119641113, seats: 2 },
    { vehicleHash: 2497353967, seats: 2 },
    { vehicleHash: 3395457658, seats: 2 },
    { vehicleHash: 16646064, seats: 2 },
    { vehicleHash: 2999939664, seats: 8 },
    { vehicleHash: 1203490606, seats: 4 },
    { vehicleHash: 3862958888, seats: 4 },
    { vehicleHash: 2537130571, seats: 2 },
    { vehicleHash: 1426219628, seats: 2 },
    { vehicleHash: 1274868363, seats: 2 },
    { vehicleHash: 2465164804, seats: 2 },
    { vehicleHash: 3989239879, seats: 6 },
    { vehicleHash: 1475773103, seats: 4 },
    { vehicleHash: 2449479409, seats: 4 },
    { vehicleHash: 2123327359, seats: 2 },
    { vehicleHash: 234062309, seats: 2 },
    { vehicleHash: 2194326579, seats: 1 },
    { vehicleHash: 2364918497, seats: 4 },
    { vehicleHash: 482197771, seats: 2 },
    { vehicleHash: 741090084, seats: 2 },
    { vehicleHash: 2067820283, seats: 2 },
    { vehicleHash: 819197656, seats: 2 },
    { vehicleHash: 3517794615, seats: 2 },
    { vehicleHash: 3062131285, seats: 2 },
    { vehicleHash: 683047626, seats: 4 },
    { vehicleHash: 101905590, seats: 2 },
    { vehicleHash: 3631668194, seats: 2 },
    { vehicleHash: 2191146052, seats: 2 },
    { vehicleHash: 390201602, seats: 2 },
    { vehicleHash: 86520421, seats: 2 },
    { vehicleHash: 1887331236, seats: 2 },
    { vehicleHash: 1549126457, seats: 2 },
    { vehicleHash: 3223586949, seats: 2 },
    { vehicleHash: 2736567667, seats: 2 },
    { vehicleHash: 3005788552, seats: 2 },
    { vehicleHash: 2452219115, seats: 2 },
    { vehicleHash: 3620039993, seats: 2 },
    { vehicleHash: 3685342204, seats: 1 },
    { vehicleHash: 2179174271, seats: 1 },
    { vehicleHash: 1491277511, seats: 1 },
    { vehicleHash: 1026149675, seats: 4 },
    { vehicleHash: 4039289119, seats: 2 },
    { vehicleHash: 2688780135, seats: 2 },
    { vehicleHash: 6774487, seats: 1 },
    { vehicleHash: 2035069708, seats: 2 },
    { vehicleHash: 3676349299, seats: 2 },
    { vehicleHash: 3285698347, seats: 1 },
    { vehicleHash: 3724934023, seats: 2 },
    { vehicleHash: 822018448, seats: 1 },
    { vehicleHash: 2890830793, seats: 2 },
    { vehicleHash: 1873600305, seats: 2 },
    { vehicleHash: 3889340782, seats: 1 },
    { vehicleHash: 2771538552, seats: 2 },
    { vehicleHash: 3854198872, seats: 1 },
    { vehicleHash: 196747873, seats: 2 },
    { vehicleHash: 272929391, seats: 2 },
    { vehicleHash: 2246633323, seats: 2 },
    { vehicleHash: 3812247419, seats: 2 },
    { vehicleHash: 1034187331, seats: 2 },
    { vehicleHash: 1093792632, seats: 2 },
    { vehicleHash: 1886268224, seats: 2 },
    { vehicleHash: 1074745671, seats: 2 },
    { vehicleHash: 4055125828, seats: 1 },
    { vehicleHash: 1790834270, seats: 1 },
    { vehicleHash: 2704629607, seats: 1 },
    { vehicleHash: 941494461, seats: 2 },
    { vehicleHash: 3467805257, seats: 2 },
    { vehicleHash: 3982671785, seats: 2 },
    { vehicleHash: 2645431192, seats: 5 },
    { vehicleHash: 989294410, seats: 2 },
    { vehicleHash: 2536829930, seats: 2 },
    { vehicleHash: 682434785, seats: 5 },
    { vehicleHash: 2382949506, seats: 6 },
    { vehicleHash: 1180875963, seats: 3 },
    { vehicleHash: 627535535, seats: 1 },
    { vehicleHash: 3537231886, seats: 1 },
    { vehicleHash: 2272483501, seats: 2 },
    { vehicleHash: 777714999, seats: 2 },
    { vehicleHash: 3312836369, seats: 2 },
    { vehicleHash: 2889029532, seats: 2 },
    { vehicleHash: 1234311532, seats: 2 },
    { vehicleHash: 719660200, seats: 2 },
    { vehicleHash: 3194418602, seats: 0 },
    { vehicleHash: 917809321, seats: 2 },
    { vehicleHash: 3525819835, seats: 2 },
    { vehicleHash: 1939284556, seats: 2 },
    { vehicleHash: 177270108, seats: 5 },
    { vehicleHash: 433954513, seats: 4 },
    { vehicleHash: 223240013, seats: 2 },
    { vehicleHash: 1504306544, seats: 2 },
    { vehicleHash: 387748548, seats: 2 },
    { vehicleHash: 1502869817, seats: 1 },
    { vehicleHash: 1356124575, seats: 3 },
    { vehicleHash: 2370534026, seats: 9 },
    { vehicleHash: 562680400, seats: 4 },
    { vehicleHash: 3084515313, seats: 2 },
    { vehicleHash: 1897744184, seats: 2 },
    { vehicleHash: 2413121211, seats: 1 },
    { vehicleHash: 4262731174, seats: 3 },
    { vehicleHash: 159274291, seats: 2 },
    { vehicleHash: 884483972, seats: 1 },
    { vehicleHash: 3052358707, seats: 2 },
    { vehicleHash: 4262088844, seats: 6 },
    { vehicleHash: 2771347558, seats: 1 },
    { vehicleHash: 3902291871, seats: 2 },
    { vehicleHash: 1043222410, seats: 5 },
    { vehicleHash: 2310691317, seats: 1 },
    { vehicleHash: 4252008158, seats: 2 },
    { vehicleHash: 2531412055, seats: 1 },
    { vehicleHash: 3319621991, seats: 2 },
    { vehicleHash: 2908775872, seats: 2 },
    { vehicleHash: 3287439187, seats: 1 },
    { vehicleHash: 3545667823, seats: 3 },
    { vehicleHash: 2594093022, seats: 1 },
    { vehicleHash: 1036591958, seats: 1 },
    { vehicleHash: 1565978651, seats: 1 },
    { vehicleHash: 2049897956, seats: 2 },
    { vehicleHash: 1841130506, seats: 2 },
    { vehicleHash: 1392481335, seats: 2 },
    { vehicleHash: 3296789504, seats: 2 },
    { vehicleHash: 838982985, seats: 2 },
    { vehicleHash: 3903371924, seats: 2 },
    { vehicleHash: 661493923, seats: 2 },
    { vehicleHash: 2765724541, seats: 4 },
    { vehicleHash: 2762269779, seats: 2 },
    { vehicleHash: 1352136073, seats: 2 },
    { vehicleHash: 3981782132, seats: 2 },
    { vehicleHash: 903794909, seats: 2 },
    { vehicleHash: 2215179066, seats: 2 },
    { vehicleHash: 1561920505, seats: 2 },
    { vehicleHash: 2445973230, seats: 4 },
    { vehicleHash: 1104234922, seats: 2 },
    { vehicleHash: 2859440138, seats: 4 },
    { vehicleHash: 4081974053, seats: 4 },
    { vehicleHash: 447548909, seats: 4 },
    { vehicleHash: 1181327175, seats: 4 },
    { vehicleHash: 1483171323, seats: 2 },
    { vehicleHash: 886810209, seats: 2 },
    { vehicleHash: 3602674979, seats: 2 },
    { vehicleHash: 2601952180, seats: 6 },
    { vehicleHash: 2176659152, seats: 3 },
    { vehicleHash: 408970549, seats: 3 },
    { vehicleHash: 1489874736, seats: 1 },
    { vehicleHash: 1871995513, seats: 2 },
    { vehicleHash: 15219735, seats: 2 },
    { vehicleHash: 600450546, seats: 2 },
    { vehicleHash: 1741861769, seats: 4 },
    { vehicleHash: 3884762073, seats: 4 },
    { vehicleHash: 867799010, seats: 2 },
    { vehicleHash: 4173521127, seats: 2 },
    { vehicleHash: 2174267100, seats: 2 },
    { vehicleHash: 3306466016, seats: 2 },
    { vehicleHash: 4080061290, seats: 2 },
    { vehicleHash: 1254014755, seats: 5 },
    { vehicleHash: 1115909093, seats: 2 },
    { vehicleHash: 3568198617, seats: 2 },
    { vehicleHash: 3035832600, seats: 2 },
    { vehicleHash: 3027423925, seats: 2 },
    { vehicleHash: 1046206681, seats: 2 },
    { vehicleHash: 1617472902, seats: 2 },
    { vehicleHash: 3308022675, seats: 2 },
    { vehicleHash: 3918533058, seats: 2 },
    { vehicleHash: 1031562256, seats: 2 },
    { vehicleHash: 1909189272, seats: 2 },
    { vehicleHash: 931280609, seats: 2 },
    { vehicleHash: 3160260734, seats: 2 },
    { vehicleHash: 321186144, seats: 2 },
    { vehicleHash: 3656405053, seats: 2 },
    { vehicleHash: 1692272545, seats: 1 },
    { vehicleHash: 2306538597, seats: 2 },
    { vehicleHash: 345756458, seats: 11 },
    { vehicleHash: 2069146067, seats: 1 },
    { vehicleHash: 1653666139, seats: 8 },
    { vehicleHash: 219613597, seats: 4 },
    { vehicleHash: 4240635011, seats: 4 },
    { vehicleHash: 1945374990, seats: 4 },
    { vehicleHash: 2044532910, seats: 5 },
    { vehicleHash: 3987008919, seats: 4 },
    { vehicleHash: 500482303, seats: 2 },
    { vehicleHash: 3874056184, seats: 6 },
    { vehicleHash: 2370166601, seats: 2 },
    { vehicleHash: 840387324, seats: 2 },
    { vehicleHash: 3579220348, seats: 2 },
    { vehicleHash: 1742022738, seats: 2 },
    { vehicleHash: 1239571361, seats: 2 },
    { vehicleHash: 679453769, seats: 2 },
    { vehicleHash: 1909700336, seats: 2 },
    { vehicleHash: 2482017624, seats: 1 },
    { vehicleHash: 3001042683, seats: 2 },
    { vehicleHash: 2920466844, seats: 1 },
    { vehicleHash: 2550461639, seats: 2 },
    { vehicleHash: 2233918197, seats: 2 },
    { vehicleHash: 373261600, seats: 2 },
    { vehicleHash: 2139203625, seats: 2 },
    { vehicleHash: 2403970600, seats: 2 },
    { vehicleHash: 2038858402, seats: 2 },
    { vehicleHash: 4267640610, seats: 1 },
    { vehicleHash: 3606777648, seats: 2 },
    { vehicleHash: 2919906639, seats: 2 },
    { vehicleHash: 668439077, seats: 4 },
    { vehicleHash: 2600885406, seats: 4 },
    { vehicleHash: 2252616474, seats: 4 },
    { vehicleHash: 4008920556, seats: 1 },
    { vehicleHash: 3963499524, seats: 2 },
    { vehicleHash: 3493417227, seats: 2 },
    { vehicleHash: 1009171724, seats: 2 },
    { vehicleHash: 1721676810, seats: 2 },
    { vehicleHash: 1456744817, seats: 4 },
    { vehicleHash: 3147997943, seats: 4 },
    { vehicleHash: 1542143200, seats: 4 },
    { vehicleHash: 3715219435, seats: 4 },
    { vehicleHash: 628003514, seats: 2 },
    { vehicleHash: 1537277726, seats: 2 },
    { vehicleHash: 2728360112, seats: 2 },
    { vehicleHash: 1591739866, seats: 2 },
    { vehicleHash: 4245851645, seats: 2 },
    { vehicleHash: 444994115, seats: 2 },
    { vehicleHash: 1637620610, seats: 2 },
    { vehicleHash: 3539435063, seats: 2 },
    { vehicleHash: 3126015148, seats: 4 },
    { vehicleHash: 1279262537, seats: 2 },
    { vehicleHash: 3787471536, seats: 2 },
    { vehicleHash: 2198276962, seats: 2 },
    { vehicleHash: 540101442, seats: 2 },
    { vehicleHash: 3188846534, seats: 2 },
    { vehicleHash: 2816263004, seats: 2 },
    { vehicleHash: 3847255899, seats: 2 },
    { vehicleHash: 1416466158, seats: 2 },
    { vehicleHash: 4086055493, seats: 4 },
    { vehicleHash: 916547552, seats: 1 },
    { vehicleHash: 2674840994, seats: 2 },
    { vehicleHash: 3630826055, seats: 2 },
    { vehicleHash: 2490551588, seats: 2 },
    { vehicleHash: 1934384720, seats: 2 },
    { vehicleHash: 3970348707, seats: 1 },
    { vehicleHash: 2945871676, seats: 4 },
    { vehicleHash: 1044193113, seats: 2 },
    { vehicleHash: 2465530446, seats: 4 },
    { vehicleHash: 3612858749, seats: 2 },
    { vehicleHash: 1854776567, seats: 2 },
    { vehicleHash: 3353694737, seats: 2 },
    { vehicleHash: 1323778901, seats: 2 },
    { vehicleHash: 3932816511, seats: 2 },
    { vehicleHash: 310284501, seats: 4 },
    { vehicleHash: 722226637, seats: 2 },
    { vehicleHash: 3412338231, seats: 2 },
    { vehicleHash: 1862507111, seats: 2 },
    { vehicleHash: 686471183, seats: 2 },
    { vehicleHash: 3040635986, seats: 1 },
    { vehicleHash: 2031587082, seats: 2 },
    { vehicleHash: 408825843, seats: 2 },
    { vehicleHash: 1693751655, seats: 2 },
    { vehicleHash: 301304410, seats: 2 },
    { vehicleHash: 394110044, seats: 2 },
    { vehicleHash: 872704284, seats: 2 },
    { vehicleHash: 2538945576, seats: 4 },
    { vehicleHash: 987469656, seats: 4 },
    { vehicleHash: 1284356689, seats: 4 },
    { vehicleHash: 340154634, seats: 1 },
    { vehicleHash: 2334210311, seats: 1 },
    { vehicleHash: 83136452, seats: 4 },
    { vehicleHash: 740289177, seats: 2 },
    { vehicleHash: 960812448, seats: 2 },
    { vehicleHash: 1456336509, seats: 4 },
    { vehicleHash: 3460613305, seats: 4 },
    { vehicleHash: 1118611807, seats: 2 },
    { vehicleHash: 409049982, seats: 2 },
    { vehicleHash: 3162245632, seats: 2 },
    { vehicleHash: 1492612435, seats: 1 },
    { vehicleHash: 2566281822, seats: 2 },
    { vehicleHash: 2936769864, seats: 2 },
    { vehicleHash: 3663644634, seats: 2 },
    { vehicleHash: 3456868130, seats: 4 },
    { vehicleHash: 67753863, seats: 2 },
    { vehicleHash: 2196012677, seats: 2 },
    { vehicleHash: 2172320429, seats: 2 },
    { vehicleHash: 2134119907, seats: 2 },
    { vehicleHash: 1802742206, seats: 4 },
    { vehicleHash: 3381377750, seats: 4 },
    { vehicleHash: 2484160806, seats: 2 },
    { vehicleHash: 1181339704, seats: 1 },
    { vehicleHash: 1107404867, seats: 2 },
    { vehicleHash: 1717532765, seats: 2 },
    { vehicleHash: 2802050217, seats: 1 },
    { vehicleHash: 4192631813, seats: 4 },
    { vehicleHash: 3314393930, seats: 5 },
    { vehicleHash: 295054921, seats: 6 },
    { vehicleHash: 3145241962, seats: 2 },
    { vehicleHash: 3437611258, seats: 1 },
    { vehicleHash: 1455990255, seats: 4 },
    { vehicleHash: 3249056020, seats: 2 },
    { vehicleHash: 1644055914, seats: 2 },
    { vehicleHash: 2014313426, seats: 10 },
    { vehicleHash: 3929093893, seats: 4 },
    { vehicleHash: 4018222598, seats: 4 },
    { vehicleHash: 2588363614, seats: 4 },
    { vehicleHash: 1429622905, seats: 2 },
    { vehicleHash: 298565713, seats: 2 },
    { vehicleHash: 1861786828, seats: 4 },
    { vehicleHash: 1229411063, seats: 2 },
    { vehicleHash: 1593933419, seats: 2 },
    { vehicleHash: 4084658662, seats: 3 },
    { vehicleHash: 1086534307, seats: 1 },
    { vehicleHash: 1336872304, seats: 1 },
    { vehicleHash: 3186376089, seats: 0 },
    { vehicleHash: 2568944644, seats: 2 },
    { vehicleHash: 426742808, seats: 2 },
    { vehicleHash: 736672010, seats: 2 },
    { vehicleHash: 2038480341, seats: 2 },
    { vehicleHash: 2787736776, seats: 2 },
    { vehicleHash: 3842363289, seats: 2 },
    { vehicleHash: 4003946083, seats: 2 },
    { vehicleHash: 3050505892, seats: 4 },
    { vehicleHash: 1304459735, seats: 2 },
    { vehicleHash: 2754593701, seats: 2 },
    { vehicleHash: 1377217886, seats: 2 },
    { vehicleHash: 3101054893, seats: 2 },
    { vehicleHash: 1755697647, seats: 2 },
    { vehicleHash: 2712905841, seats: 2 },
    { vehicleHash: 2436313176, seats: 2 },
    { vehicleHash: 1416471345, seats: 2 },
    { vehicleHash: 579912970, seats: 2 },
    { vehicleHash: 1353120668, seats: 1 },
    { vehicleHash: 1993851908, seats: 1 },
    { vehicleHash: 3379732821, seats: 2 },
    { vehicleHash: 2767531027, seats: 4 },
    { vehicleHash: 662793086, seats: 4 },
    { vehicleHash: 629969764, seats: 4 },
    { vehicleHash: 359875117, seats: 4 },
    { vehicleHash: 3675036420, seats: 4 },
    { vehicleHash: 1141395928, seats: 2 },
    { vehicleHash: 1532171089, seats: 4 },
    { vehicleHash: 2850852987, seats: 2 },
    { vehicleHash: 461465043, seats: 4 },
    { vehicleHash: 3624880708, seats: 4 },
    { vehicleHash: 655665811, seats: 2 },
    { vehicleHash: 4033620423, seats: 8 },
    { vehicleHash: 1486521356, seats: 4 },
    { vehicleHash: 1343932732, seats: 6 },
    { vehicleHash: 3789743831, seats: 4 },
    { vehicleHash: 2938086457, seats: 2 },
    { vehicleHash: 1706945532, seats: 2 },
    { vehicleHash: 15214558, seats: 2 },
    { vehicleHash: 3540279623, seats: 2 },
    { vehicleHash: 3526730918, seats: 4 },
    { vehicleHash: 4230891418, seats: 2 },
    { vehicleHash: 4000288633, seats: 2 },
    { vehicleHash: 4129572538, seats: 2 },
    { vehicleHash: 2536587772, seats: 2 },
    { vehicleHash: 4284049613, seats: 1 },
    { vehicleHash: 3400983137, seats: 2 },
    { vehicleHash: 274946574, seats: 2 },
    { vehicleHash: 2439462158, seats: 2 },
    { vehicleHash: 3817135397, seats: 4 },
    { vehicleHash: 40817712, seats: 2 },
    { vehicleHash: 775514032, seats: 2 },
    { vehicleHash: 3300595976, seats: 2 },
    { vehicleHash: 3833117047, seats: 2 },
    { vehicleHash: 2361724968, seats: 2 },
    { vehicleHash: 1550581940, seats: 2 },
    { vehicleHash: 268758436, seats: 2 },
    { vehicleHash: 4163619118, seats: 2 },
    { vehicleHash: 669204833, seats: 2 },
    { vehicleHash: 996383885, seats: 2 },
    { vehicleHash: 2100457220, seats: 2 },
    { vehicleHash: 1076201208, seats: 2 },
    { vehicleHash: 1748565021, seats: 2 },
    { vehicleHash: 3045179290, seats: 4 },
    { vehicleHash: 2908631255, seats: 1 },
    { vehicleHash: 2667889793, seats: 6 },
    { vehicleHash: 2718380883, seats: 6 },
    { vehicleHash: 1384502824, seats: 1 },
    { vehicleHash: 3259477733, seats: 4 },
    { vehicleHash: 2336777441, seats: 2 },
    { vehicleHash: 2311345272, seats: 1 },
    { vehicleHash: 3397143273, seats: 1 },
    { vehicleHash: 239897677, seats: 1 },
    { vehicleHash: 802856453, seats: 2 },
    { vehicleHash: 610429990, seats: 2 },
    { vehicleHash: 3758861739, seats: 2 },
    { vehicleHash: 1447690049, seats: 2 },
    { vehicleHash: 3315674721, seats: 2 },
    { vehicleHash: 191916658, seats: 4 },
    { vehicleHash: 3640468689, seats: 4 },
    { vehicleHash: 1336514315, seats: 2 },
    { vehicleHash: 3868033424, seats: 3 },
    { vehicleHash: 4225674290, seats: 3 },
    { vehicleHash: 165968051, seats: 2 },
    { vehicleHash: 4250167832, seats: 4 },
    { vehicleHash: 2635962482, seats: 2 },
    { vehicleHash: 2531292011, seats: 2 },
    { vehicleHash: 2620582743, seats: 4 },
    { vehicleHash: 2922168362, seats: 4 },
    { vehicleHash: 167522317, seats: 4 },
    { vehicleHash: 4116524922, seats: 2 },
    { vehicleHash: 3526923154, seats: 4 },
    { vehicleHash: 728350375, seats: 2 },
    { vehicleHash: 3392937977, seats: 2 },
    { vehicleHash: 3623402354, seats: 2 },
    { vehicleHash: 3816328113, seats: 4 },
    { vehicleHash: 372621319, seats: 2 },
    { vehicleHash: 3265236814, seats: 4 },
    { vehicleHash: 2815031719, seats: 2 },
    { vehicleHash: 2531693357, seats: 2 },
    { vehicleHash: 4113404654, seats: 2 },
    { vehicleHash: 821121576, seats: 2 },
    { vehicleHash: 2613313775, seats: 2 },
    { vehicleHash: 2598648200, seats: 2 },
    { vehicleHash: 1923534526, seats: 2 },
    { vehicleHash: 2670883828, seats: 2 },
    { vehicleHash: 4256087847, seats: 4 },
    { vehicleHash: 3852738056, seats: 2 },
    { vehicleHash: 3853757601, seats: 2 },
    { vehicleHash: 3061199846, seats: 2 },
    { vehicleHash: 4171974011, seats: 2 },
    { vehicleHash: 471034616, seats: 0 },
    { vehicleHash: 3452201761, seats: 6 },
    { vehicleHash: 3829141989, seats: 2 },
    { vehicleHash: 2960513480, seats: 0 },
    { vehicleHash: 4165683409, seats: 2 },
    { vehicleHash: 3553846961, seats: 4 },
    { vehicleHash: 3431608412, seats: 4 },
    { vehicleHash: 1835260592, seats: 0 },
    { vehicleHash: 1539159908, seats: 0 },
    { vehicleHash: 3228633070, seats: 1 },
    { vehicleHash: 723973206, seats: 2 },
    { vehicleHash: 3968823444, seats: 2 },
    { vehicleHash: 237764926, seats: 4 },
    { vehicleHash: 3379262425, seats: 2 },
    { vehicleHash: 3393804037, seats: 4 },
    { vehicleHash: 1233534620, seats: 2 },
    { vehicleHash: 3681241380, seats: 4 },
    { vehicleHash: 349315417, seats: 2 },
    { vehicleHash: 1923400478, seats: 2 },
    { vehicleHash: 3893323758, seats: 2 },
    { vehicleHash: 1039032026, seats: 2 },
    { vehicleHash: 3703315515, seats: 2 }
];
exports.vehicleModelSeats = vehicleModelSeats;
const vehicleClasses = [
    { vehicleHash: 1032823388, vehicleClass: 6 },
    { vehicleHash: 2833484545, vehicleClass: 6 },
    { vehicleHash: 3950024287, vehicleClass: 0 },
    { vehicleHash: 2485144969, vehicleClass: 1 },
    { vehicleHash: 2487343317, vehicleClass: 1 },
    { vehicleHash: 524108981, vehicleClass: 11 },
    { vehicleHash: 3581397346, vehicleClass: 17 },
    { vehicleHash: 3087536137, vehicleClass: 11 },
    { vehicleHash: 2818520053, vehicleClass: 11 },
    { vehicleHash: 2657817814, vehicleClass: 11 },
    { vehicleHash: 3517691494, vehicleClass: 11 },
    { vehicleHash: 2222034228, vehicleClass: 17 },
    { vehicleHash: 1283517198, vehicleClass: 17 },
    { vehicleHash: 2391954683, vehicleClass: 1 },
    { vehicleHash: 1560980623, vehicleClass: 11 },
    { vehicleHash: 1171614426, vehicleClass: 18 },
    { vehicleHash: 3471458123, vehicleClass: 19 },
    { vehicleHash: 1074326203, vehicleClass: 19 },
    { vehicleHash: 3486135912, vehicleClass: 2 },
    { vehicleHash: 142944341, vehicleClass: 2 },
    { vehicleHash: 850565707, vehicleClass: 2 },
    { vehicleHash: 3253274834, vehicleClass: 6 },
    { vehicleHash: 2053223216, vehicleClass: 20 },
    { vehicleHash: 1126868326, vehicleClass: 9 },
    { vehicleHash: 850991848, vehicleClass: 20 },
    { vehicleHash: 2166734073, vehicleClass: 9 },
    { vehicleHash: 4246935337, vehicleClass: 9 },
    { vehicleHash: 3025077634, vehicleClass: 9 },
    { vehicleHash: 4278019151, vehicleClass: 12 },
    { vehicleHash: 2072156101, vehicleClass: 12 },
    { vehicleHash: 1739845664, vehicleClass: 12 },
    { vehicleHash: 2307837162, vehicleClass: 12 },
    { vehicleHash: 4061868990, vehicleClass: 12 },
    { vehicleHash: 121658888, vehicleClass: 12 },
    { vehicleHash: 1069929536, vehicleClass: 12 },
    { vehicleHash: 2859047862, vehicleClass: 9 },
    { vehicleHash: 3612755468, vehicleClass: 4 },
    { vehicleHash: 3990165190, vehicleClass: 6 },
    { vehicleHash: 736902334, vehicleClass: 6 },
    { vehicleHash: 1886712733, vehicleClass: 10 },
    { vehicleHash: 2598821281, vehicleClass: 7 },
    { vehicleHash: 4143991942, vehicleClass: 16 },
    { vehicleHash: 2948279460, vehicleClass: 12 },
    { vehicleHash: 3387490166, vehicleClass: 12 },
    { vehicleHash: 2551651283, vehicleClass: 12 },
    { vehicleHash: 893081117, vehicleClass: 12 },
    { vehicleHash: 1132262048, vehicleClass: 12 },
    { vehicleHash: 2006918058, vehicleClass: 2 },
    { vehicleHash: 3505073125, vehicleClass: 2 },
    { vehicleHash: 456714581, vehicleClass: 18 },
    { vehicleHash: 2549763894, vehicleClass: 12 },
    { vehicleHash: 3334677549, vehicleClass: 21 },
    { vehicleHash: 1147287684, vehicleClass: 11 },
    { vehicleHash: 3757070668, vehicleClass: 11 },
    { vehicleHash: 1876516712, vehicleClass: 12 },
    { vehicleHash: 2072687711, vehicleClass: 6 },
    { vehicleHash: 2983812512, vehicleClass: 7 },
    { vehicleHash: 3249425686, vehicleClass: 6 },
    { vehicleHash: 330661258, vehicleClass: 3 },
    { vehicleHash: 108773431, vehicleClass: 6 },
    { vehicleHash: 3288047904, vehicleClass: 10 },
    { vehicleHash: 2751205197, vehicleClass: 2 },
    { vehicleHash: 3164157193, vehicleClass: 0 },
    { vehicleHash: 1682114128, vehicleClass: 0 },
    { vehicleHash: 2633113103, vehicleClass: 9 },
    { vehicleHash: 534258863, vehicleClass: 9 },
    { vehicleHash: 37348240, vehicleClass: 4 },
    { vehicleHash: 1770332643, vehicleClass: 9 },
    { vehicleHash: 1177543287, vehicleClass: 2 },
    { vehicleHash: 3900892662, vehicleClass: 2 },
    { vehicleHash: 2164484578, vehicleClass: 10 },
    { vehicleHash: 2589662668, vehicleClass: 10 },
    { vehicleHash: 3410276810, vehicleClass: 11 },
    { vehicleHash: 80636076, vehicleClass: 4 },
    { vehicleHash: 3609690755, vehicleClass: 1 },
    { vehicleHash: 2411965148, vehicleClass: 1 },
    { vehicleHash: 3053254478, vehicleClass: 1 },
    { vehicleHash: 3003014393, vehicleClass: 7 },
    { vehicleHash: 4289813342, vehicleClass: 3 },
    { vehicleHash: 3728579874, vehicleClass: 6 },
    { vehicleHash: 3703357000, vehicleClass: 3 },
    { vehicleHash: 1127131465, vehicleClass: 18 },
    { vehicleHash: 2647026068, vehicleClass: 18 },
    { vehicleHash: 3903372712, vehicleClass: 3 },
    { vehicleHash: 4205676014, vehicleClass: 3 },
    { vehicleHash: 2299640309, vehicleClass: 6 },
    { vehicleHash: 1938952078, vehicleClass: 18 },
    { vehicleHash: 1353720154, vehicleClass: 10 },
    { vehicleHash: 1491375716, vehicleClass: 11 },
    { vehicleHash: 3157435195, vehicleClass: 2 },
    { vehicleHash: 499169875, vehicleClass: 6 },
    { vehicleHash: 1909141499, vehicleClass: 1 },
    { vehicleHash: 2016857647, vehicleClass: 6 },
    { vehicleHash: 2519238556, vehicleClass: 2 },
    { vehicleHash: 2494797253, vehicleClass: 4 },
    { vehicleHash: 884422927, vehicleClass: 2 },
    { vehicleHash: 1518533038, vehicleClass: 20 },
    { vehicleHash: 444583674, vehicleClass: 10 },
    { vehicleHash: 418536135, vehicleClass: 7 },
    { vehicleHash: 3005245074, vehicleClass: 1 },
    { vehicleHash: 886934177, vehicleClass: 1 },
    { vehicleHash: 3117103977, vehicleClass: 0 },
    { vehicleHash: 3670438162, vehicleClass: 3 },
    { vehicleHash: 4174679674, vehicleClass: 12 },
    { vehicleHash: 1051415893, vehicleClass: 5 },
    { vehicleHash: 544021352, vehicleClass: 6 },
    { vehicleHash: 1269098716, vehicleClass: 2 },
    { vehicleHash: 469291905, vehicleClass: 18 },
    { vehicleHash: 2170765704, vehicleClass: 5 },
    { vehicleHash: 914654722, vehicleClass: 2 },
    { vehicleHash: 3546958660, vehicleClass: 2 },
    { vehicleHash: 2230595153, vehicleClass: 9 },
    { vehicleHash: 321739290, vehicleClass: 19 },
    { vehicleHash: 3984502180, vehicleClass: 12 },
    { vehicleHash: 3510150843, vehicleClass: 10 },
    { vehicleHash: 475220373, vehicleClass: 10 },
    { vehicleHash: 3861591579, vehicleClass: 5 },
    { vehicleHash: 1783355638, vehicleClass: 11 },
    { vehicleHash: 904750859, vehicleClass: 20 },
    { vehicleHash: 3244501995, vehicleClass: 20 },
    { vehicleHash: 1348744438, vehicleClass: 3 },
    { vehicleHash: 3783366066, vehicleClass: 3 },
    { vehicleHash: 569305213, vehicleClass: 20 },
    { vehicleHash: 3486509883, vehicleClass: 2 },
    { vehicleHash: 2287941233, vehicleClass: 18 },
    { vehicleHash: 3917501776, vehicleClass: 6 },
    { vehicleHash: 1830407356, vehicleClass: 5 },
    { vehicleHash: 2157618379, vehicleClass: 20 },
    { vehicleHash: 2199527893, vehicleClass: 4 },
    { vehicleHash: 1507916787, vehicleClass: 4 },
    { vehicleHash: 2112052861, vehicleClass: 20 },
    { vehicleHash: 2046537925, vehicleClass: 18 },
    { vehicleHash: 2321795001, vehicleClass: 18 },
    { vehicleHash: 2667966721, vehicleClass: 18 },
    { vehicleHash: 1912215274, vehicleClass: 18 },
    { vehicleHash: 2758042359, vehicleClass: 18 },
    { vehicleHash: 2515846680, vehicleClass: 18 },
    { vehicleHash: 4175309224, vehicleClass: 12 },
    { vehicleHash: 943752001, vehicleClass: 12 },
    { vehicleHash: 2844316578, vehicleClass: 0 },
    { vehicleHash: 741586030, vehicleClass: 18 },
    { vehicleHash: 2411098011, vehicleClass: 1 },
    { vehicleHash: 3144368207, vehicleClass: 1 },
    { vehicleHash: 356391690, vehicleClass: 11 },
    { vehicleHash: 1645267888, vehicleClass: 9 },
    { vehicleHash: 1933662059, vehicleClass: 9 },
    { vehicleHash: 2360515092, vehicleClass: 6 },
    { vehicleHash: 1737773231, vehicleClass: 6 },
    { vehicleHash: 2643899483, vehicleClass: 2 },
    { vehicleHash: 3627815886, vehicleClass: 4 },
    { vehicleHash: 3087195462, vehicleClass: 9 },
    { vehicleHash: 4280472072, vehicleClass: 1 },
    { vehicleHash: 2249373259, vehicleClass: 9 },
    { vehicleHash: 3196165219, vehicleClass: 17 },
    { vehicleHash: 4067225593, vehicleClass: 4 },
    { vehicleHash: 1162065741, vehicleClass: 12 },
    { vehicleHash: 2518351607, vehicleClass: 12 },
    { vehicleHash: 782665360, vehicleClass: 19 },
    { vehicleHash: 3089277354, vehicleClass: 18 },
    { vehicleHash: 3448987385, vehicleClass: 11 },
    { vehicleHash: 2136773105, vehicleClass: 2 },
    { vehicleHash: 627094268, vehicleClass: 1 },
    { vehicleHash: 2609945748, vehicleClass: 4 },
    { vehicleHash: 3695398481, vehicleClass: 11 },
    { vehicleHash: 734217681, vehicleClass: 11 },
    { vehicleHash: 3105951696, vehicleClass: 9 },
    { vehicleHash: 989381445, vehicleClass: 9 },
    { vehicleHash: 3039514899, vehicleClass: 1 },
    { vehicleHash: 3548084598, vehicleClass: 6 },
    { vehicleHash: 2594165727, vehicleClass: 11 },
    { vehicleHash: 1221512915, vehicleClass: 2 },
    { vehicleHash: 1349725314, vehicleClass: 3 },
    { vehicleHash: 873639469, vehicleClass: 3 },
    { vehicleHash: 3172678083, vehicleClass: 3 },
    { vehicleHash: 3101863448, vehicleClass: 3 },
    { vehicleHash: 1337041428, vehicleClass: 2 },
    { vehicleHash: 2611638396, vehicleClass: 18 },
    { vehicleHash: 1922257928, vehicleClass: 18 },
    { vehicleHash: 3484649228, vehicleClass: 12 },
    { vehicleHash: 728614474, vehicleClass: 12 },
    { vehicleHash: 2817386317, vehicleClass: 1 },
    { vehicleHash: 1545842587, vehicleClass: 5 },
    { vehicleHash: 2196019706, vehicleClass: 5 },
    { vehicleHash: 1747439474, vehicleClass: 20 },
    { vehicleHash: 4080511798, vehicleClass: 20 },
    { vehicleHash: 1723137093, vehicleClass: 1 },
    { vehicleHash: 970598228, vehicleClass: 6 },
    { vehicleHash: 1123216662, vehicleClass: 1 },
    { vehicleHash: 384071873, vehicleClass: 6 },
    { vehicleHash: 699456151, vehicleClass: 12 },
    { vehicleHash: 2983726598, vehicleClass: 12 },
    { vehicleHash: 2400073108, vehicleClass: 1 },
    { vehicleHash: 1951180813, vehicleClass: 12 },
    { vehicleHash: 3286105550, vehicleClass: 1 },
    { vehicleHash: 3338918751, vehicleClass: 17 },
    { vehicleHash: 1917016601, vehicleClass: 17 },
    { vehicleHash: 1641462412, vehicleClass: 11 },
    { vehicleHash: 2218488798, vehicleClass: 11 },
    { vehicleHash: 1445631933, vehicleClass: 11 },
    { vehicleHash: 1019737494, vehicleClass: 11 },
    { vehicleHash: 3895125590, vehicleClass: 11 },
    { vehicleHash: 48339065, vehicleClass: 10 },
    { vehicleHash: 3347205726, vehicleClass: 10 },
    { vehicleHash: 464687292, vehicleClass: 5 },
    { vehicleHash: 1531094468, vehicleClass: 5 },
    { vehicleHash: 1762279763, vehicleClass: 5 },
    { vehicleHash: 2261744861, vehicleClass: 5 },
    { vehicleHash: 1941029835, vehicleClass: 17 },
    { vehicleHash: 2971866336, vehicleClass: 11 },
    { vehicleHash: 3852654278, vehicleClass: 11 },
    { vehicleHash: 516990260, vehicleClass: 11 },
    { vehicleHash: 887537515, vehicleClass: 11 },
    { vehicleHash: 2132890591, vehicleClass: 11 },
    { vehicleHash: 523724515, vehicleClass: 4 },
    { vehicleHash: 1777363799, vehicleClass: 1 },
    { vehicleHash: 2333339779, vehicleClass: 1 },
    { vehicleHash: 65402552, vehicleClass: 12 },
    { vehicleHash: 758895617, vehicleClass: 5 },
    { vehicleHash: 788045382, vehicleClass: 8 },
    { vehicleHash: 2841686334, vehicleClass: 8 },
    { vehicleHash: 4108429845, vehicleClass: 13 },
    { vehicleHash: 1127861609, vehicleClass: 13 },
    { vehicleHash: 3061159916, vehicleClass: 13 },
    { vehicleHash: 3894672200, vehicleClass: 13 },
    { vehicleHash: 3458454463, vehicleClass: 13 },
    { vehicleHash: 448402357, vehicleClass: 13 },
    { vehicleHash: 1131912276, vehicleClass: 13 },
    { vehicleHash: 4260343491, vehicleClass: 18 },
    { vehicleHash: 1672195559, vehicleClass: 8 },
    { vehicleHash: 11251904, vehicleClass: 8 },
    { vehicleHash: 2154536131, vehicleClass: 8 },
    { vehicleHash: 4180675781, vehicleClass: 8 },
    { vehicleHash: 3403504941, vehicleClass: 8 },
    { vehicleHash: 3401388520, vehicleClass: 8 },
    { vehicleHash: 2006142190, vehicleClass: 8 },
    { vehicleHash: 2623969160, vehicleClass: 8 },
    { vehicleHash: 3385765638, vehicleClass: 8 },
    { vehicleHash: 4154065143, vehicleClass: 8 },
    { vehicleHash: 3469130167, vehicleClass: 4 },
    { vehicleHash: 55628203, vehicleClass: 8 },
    { vehicleHash: 301427732, vehicleClass: 8 },
    { vehicleHash: 837858166, vehicleClass: 15 },
    { vehicleHash: 788747387, vehicleClass: 15 },
    { vehicleHash: 745926877, vehicleClass: 15 },
    { vehicleHash: 4244420235, vehicleClass: 15 },
    { vehicleHash: 1621617168, vehicleClass: 15 },
    { vehicleHash: 1394036463, vehicleClass: 15 },
    { vehicleHash: 1044954915, vehicleClass: 15 },
    { vehicleHash: 353883353, vehicleClass: 15 },
    { vehicleHash: 2634305738, vehicleClass: 15 },
    { vehicleHash: 3660088182, vehicleClass: 8 },
    { vehicleHash: 744705981, vehicleClass: 15 },
    { vehicleHash: 1949211328, vehicleClass: 15 },
    { vehicleHash: 3650256867, vehicleClass: 16 },
    { vehicleHash: 970356638, vehicleClass: 16 },
    { vehicleHash: 2172210288, vehicleClass: 16 },
    { vehicleHash: 2548391185, vehicleClass: 16 },
    { vehicleHash: 1058115860, vehicleClass: 16 },
    { vehicleHash: 3080461301, vehicleClass: 16 },
    { vehicleHash: 621481054, vehicleClass: 16 },
    { vehicleHash: 1981688531, vehicleClass: 16 },
    { vehicleHash: 3013282534, vehicleClass: 16 },
    { vehicleHash: 368211810, vehicleClass: 16 },
    { vehicleHash: 400514754, vehicleClass: 14 },
    { vehicleHash: 3251507587, vehicleClass: 14 },
    { vehicleHash: 1033245328, vehicleClass: 14 },
    { vehicleHash: 276773164, vehicleClass: 14 },
    { vehicleHash: 861409633, vehicleClass: 14 },
    { vehicleHash: 3806844075, vehicleClass: 14 },
    { vehicleHash: 290013743, vehicleClass: 14 },
    { vehicleHash: 3264692260, vehicleClass: 14 },
    { vehicleHash: 3678636260, vehicleClass: 14 },
    { vehicleHash: 771711535, vehicleClass: 14 },
    { vehicleHash: 184361638, vehicleClass: 21 },
    { vehicleHash: 1030400667, vehicleClass: 21 },
    { vehicleHash: 920453016, vehicleClass: 21 },
    { vehicleHash: 240201337, vehicleClass: 21 },
    { vehicleHash: 642617954, vehicleClass: 21 },
    { vehicleHash: 586013744, vehicleClass: 21 },
    { vehicleHash: 868868440, vehicleClass: 21 },
    { vehicleHash: 2154757102, vehicleClass: 11 },
    { vehicleHash: 3417488910, vehicleClass: 11 },
    { vehicleHash: 2715434129, vehicleClass: 11 },
    { vehicleHash: 2236089197, vehicleClass: 11 },
    { vehicleHash: 2524324030, vehicleClass: 11 },
    { vehicleHash: 390902130, vehicleClass: 11 },
    { vehicleHash: 3564062519, vehicleClass: 11 },
    { vehicleHash: 2016027501, vehicleClass: 11 },
    { vehicleHash: 2078290630, vehicleClass: 11 },
    { vehicleHash: 1784254509, vehicleClass: 11 },
    { vehicleHash: 2091594960, vehicleClass: 11 },
    { vehicleHash: 2942498482, vehicleClass: 11 },
    { vehicleHash: 712162987, vehicleClass: 11 },
    { vehicleHash: 2621610858, vehicleClass: 16 },
    { vehicleHash: 3078201489, vehicleClass: 7 },
    { vehicleHash: 2672523198, vehicleClass: 7 },
    { vehicleHash: 338562499, vehicleClass: 7 },
    { vehicleHash: 4012021193, vehicleClass: 14 },
    { vehicleHash: 3945366167, vehicleClass: 9 },
    { vehicleHash: 231083307, vehicleClass: 14 },
    { vehicleHash: 92612664, vehicleClass: 9 },
    { vehicleHash: 1488164764, vehicleClass: 12 },
    { vehicleHash: 117401876, vehicleClass: 5 },
    { vehicleHash: 2997294755, vehicleClass: 6 },
    { vehicleHash: 408192225, vehicleClass: 7 },
    { vehicleHash: 767087018, vehicleClass: 6 },
    { vehicleHash: 1341619767, vehicleClass: 16 },
    { vehicleHash: 2891838741, vehicleClass: 7 },
    { vehicleHash: 4152024626, vehicleClass: 6 },
    { vehicleHash: 486987393, vehicleClass: 2 },
    { vehicleHash: 1836027715, vehicleClass: 8 },
    { vehicleHash: 841808271, vehicleClass: 0 },
    { vehicleHash: 1373123368, vehicleClass: 1 },
    { vehicleHash: 3089165662, vehicleClass: 4 },
    { vehicleHash: 75131841, vehicleClass: 1 },
    { vehicleHash: 3863274624, vehicleClass: 0 },
    { vehicleHash: 3057713523, vehicleClass: 9 },
    { vehicleHash: 1078682497, vehicleClass: 5 },
    { vehicleHash: 3449006043, vehicleClass: 9 },
    { vehicleHash: 743478836, vehicleClass: 8 },
    { vehicleHash: 165154707, vehicleClass: 16 },
    { vehicleHash: 1824333165, vehicleClass: 16 },
    { vehicleHash: 1011753235, vehicleClass: 5 },
    { vehicleHash: 3955379698, vehicleClass: 15 },
    { vehicleHash: 4135840458, vehicleClass: 8 },
    { vehicleHash: 1265391242, vehicleClass: 8 },
    { vehicleHash: 3205927392, vehicleClass: 6 },
    { vehicleHash: 3188613414, vehicleClass: 6 },
    { vehicleHash: 3663206819, vehicleClass: 6 },
    { vehicleHash: 3705788919, vehicleClass: 4 },
    { vehicleHash: 729783779, vehicleClass: 4 },
    { vehicleHash: 2242229361, vehicleClass: 20 },
    { vehicleHash: 1077420264, vehicleClass: 16 },
    { vehicleHash: 1956216962, vehicleClass: 11 },
    { vehicleHash: 941800958, vehicleClass: 5 },
    { vehicleHash: 444171386, vehicleClass: 12 },
    { vehicleHash: 970385471, vehicleClass: 16 },
    { vehicleHash: 2434067162, vehicleClass: 9 },
    { vehicleHash: 2071877360, vehicleClass: 9 },
    { vehicleHash: 296357396, vehicleClass: 12 },
    { vehicleHash: 2198148358, vehicleClass: 9 },
    { vehicleHash: 509498602, vehicleClass: 14 },
    { vehicleHash: 4212341271, vehicleClass: 15 },
    { vehicleHash: 1753414259, vehicleClass: 8 },
    { vehicleHash: 2186977100, vehicleClass: 10 },
    { vehicleHash: 640818791, vehicleClass: 8 },
    { vehicleHash: 2922118804, vehicleClass: 6 },
    { vehicleHash: 410882957, vehicleClass: 6 },
    { vehicleHash: 3039269212, vehicleClass: 17 },
    { vehicleHash: 630371791, vehicleClass: 19 },
    { vehicleHash: 2694714877, vehicleClass: 15 },
    { vehicleHash: 833469436, vehicleClass: 4 },
    { vehicleHash: 1075432268, vehicleClass: 15 },
    { vehicleHash: 3080673438, vehicleClass: 16 },
    { vehicleHash: 2728226064, vehicleClass: 5 },
    { vehicleHash: 1987142870, vehicleClass: 7 },
    { vehicleHash: 3796912450, vehicleClass: 4 },
    { vehicleHash: 1581459400, vehicleClass: 3 },
    { vehicleHash: 784565758, vehicleClass: 4 },
    { vehicleHash: 2941886209, vehicleClass: 8 },
    { vehicleHash: 1663218586, vehicleClass: 7 },
    { vehicleHash: 2815302597, vehicleClass: 9 },
    { vehicleHash: 1070967343, vehicleClass: 14 },
    { vehicleHash: 349605904, vehicleClass: 4 },
    { vehicleHash: 2175389151, vehicleClass: 4 },
    { vehicleHash: 2504420315, vehicleClass: 4 },
    { vehicleHash: 525509695, vehicleClass: 4 },
    { vehicleHash: 1896491931, vehicleClass: 4 },
    { vehicleHash: 2254540506, vehicleClass: 1 },
    { vehicleHash: 2933279331, vehicleClass: 4 },
    { vehicleHash: 3281516360, vehicleClass: 4 },
    { vehicleHash: 2006667053, vehicleClass: 4 },
    { vehicleHash: 2068293287, vehicleClass: 4 },
    { vehicleHash: 3463132580, vehicleClass: 5 },
    { vehicleHash: 1102544804, vehicleClass: 6 },
    { vehicleHash: 2351681756, vehicleClass: 4 },
    { vehicleHash: 2634021974, vehicleClass: 5 },
    { vehicleHash: 4180339789, vehicleClass: 1 },
    { vehicleHash: 2809443750, vehicleClass: 6 },
    { vehicleHash: 1489967196, vehicleClass: 6 },
    { vehicleHash: 3406724313, vehicleClass: 1 },
    { vehicleHash: 1922255844, vehicleClass: 1 },
    { vehicleHash: 906642318, vehicleClass: 1 },
    { vehicleHash: 704435172, vehicleClass: 1 },
    { vehicleHash: 2264796000, vehicleClass: 1 },
    { vehicleHash: 3690124666, vehicleClass: 1 },
    { vehicleHash: 1878062887, vehicleClass: 2 },
    { vehicleHash: 634118882, vehicleClass: 2 },
    { vehicleHash: 470404958, vehicleClass: 2 },
    { vehicleHash: 666166960, vehicleClass: 2 },
    { vehicleHash: 908897389, vehicleClass: 14 },
    { vehicleHash: 3983945033, vehicleClass: 14 },
    { vehicleHash: 867467158, vehicleClass: 14 },
    { vehicleHash: 1448677353, vehicleClass: 14 },
    { vehicleHash: 437538602, vehicleClass: 14 },
    { vehicleHash: 2025593404, vehicleClass: 15 },
    { vehicleHash: 710198397, vehicleClass: 15 },
    { vehicleHash: 2623428164, vehicleClass: 15 },
    { vehicleHash: 1543134283, vehicleClass: 15 },
    { vehicleHash: 972671128, vehicleClass: 4 },
    { vehicleHash: 3999278268, vehicleClass: 7 },
    { vehicleHash: 633712403, vehicleClass: 7 },
    { vehicleHash: 3692679425, vehicleClass: 5 },
    { vehicleHash: 2255212070, vehicleClass: 4 },
    { vehicleHash: 3168702960, vehicleClass: 12 },
    { vehicleHash: 223258115, vehicleClass: 4 },
    { vehicleHash: 1119641113, vehicleClass: 4 },
    { vehicleHash: 2497353967, vehicleClass: 5 },
    { vehicleHash: 3395457658, vehicleClass: 4 },
    { vehicleHash: 16646064, vehicleClass: 4 },
    { vehicleHash: 2999939664, vehicleClass: 16 },
    { vehicleHash: 1203490606, vehicleClass: 2 },
    { vehicleHash: 3862958888, vehicleClass: 2 },
    { vehicleHash: 2537130571, vehicleClass: 6 },
    { vehicleHash: 1426219628, vehicleClass: 7 },
    { vehicleHash: 1274868363, vehicleClass: 6 },
    { vehicleHash: 2465164804, vehicleClass: 7 },
    { vehicleHash: 3989239879, vehicleClass: 17 },
    { vehicleHash: 1475773103, vehicleClass: 12 },
    { vehicleHash: 2449479409, vehicleClass: 15 },
    { vehicleHash: 2123327359, vehicleClass: 7 },
    { vehicleHash: 234062309, vehicleClass: 7 },
    { vehicleHash: 2194326579, vehicleClass: 14 },
    { vehicleHash: 2364918497, vehicleClass: 3 },
    { vehicleHash: 482197771, vehicleClass: 6 },
    { vehicleHash: 741090084, vehicleClass: 8 },
    { vehicleHash: 2067820283, vehicleClass: 7 },
    { vehicleHash: 819197656, vehicleClass: 7 },
    { vehicleHash: 3517794615, vehicleClass: 6 },
    { vehicleHash: 3062131285, vehicleClass: 7 },
    { vehicleHash: 683047626, vehicleClass: 2 },
    { vehicleHash: 101905590, vehicleClass: 9 },
    { vehicleHash: 3631668194, vehicleClass: 9 },
    { vehicleHash: 2191146052, vehicleClass: 17 },
    { vehicleHash: 390201602, vehicleClass: 8 },
    { vehicleHash: 86520421, vehicleClass: 8 },
    { vehicleHash: 1887331236, vehicleClass: 6 },
    { vehicleHash: 1549126457, vehicleClass: 0 },
    { vehicleHash: 3223586949, vehicleClass: 6 },
    { vehicleHash: 2736567667, vehicleClass: 5 },
    { vehicleHash: 3005788552, vehicleClass: 8 },
    { vehicleHash: 2452219115, vehicleClass: 8 },
    { vehicleHash: 3620039993, vehicleClass: 6 },
    { vehicleHash: 3685342204, vehicleClass: 8 },
    { vehicleHash: 2179174271, vehicleClass: 8 },
    { vehicleHash: 1491277511, vehicleClass: 8 },
    { vehicleHash: 1026149675, vehicleClass: 12 },
    { vehicleHash: 4039289119, vehicleClass: 8 },
    { vehicleHash: 2688780135, vehicleClass: 8 },
    { vehicleHash: 6774487, vehicleClass: 8 },
    { vehicleHash: 2035069708, vehicleClass: 8 },
    { vehicleHash: 3676349299, vehicleClass: 8 },
    { vehicleHash: 3285698347, vehicleClass: 8 },
    { vehicleHash: 3724934023, vehicleClass: 8 },
    { vehicleHash: 822018448, vehicleClass: 8 },
    { vehicleHash: 2890830793, vehicleClass: 8 },
    { vehicleHash: 1873600305, vehicleClass: 8 },
    { vehicleHash: 3889340782, vehicleClass: 8 },
    { vehicleHash: 2771538552, vehicleClass: 8 },
    { vehicleHash: 3854198872, vehicleClass: 9 },
    { vehicleHash: 196747873, vehicleClass: 6 },
    { vehicleHash: 272929391, vehicleClass: 7 },
    { vehicleHash: 2246633323, vehicleClass: 7 },
    { vehicleHash: 3812247419, vehicleClass: 7 },
    { vehicleHash: 1034187331, vehicleClass: 7 },
    { vehicleHash: 1093792632, vehicleClass: 7 },
    { vehicleHash: 1886268224, vehicleClass: 6 },
    { vehicleHash: 1074745671, vehicleClass: 6 },
    { vehicleHash: 4055125828, vehicleClass: 8 },
    { vehicleHash: 1790834270, vehicleClass: 8 },
    { vehicleHash: 2704629607, vehicleClass: 9 },
    { vehicleHash: 941494461, vehicleClass: 4 },
    { vehicleHash: 3467805257, vehicleClass: 9 },
    { vehicleHash: 3982671785, vehicleClass: 9 },
    { vehicleHash: 2645431192, vehicleClass: 20 },
    { vehicleHash: 989294410, vehicleClass: 7 },
    { vehicleHash: 2536829930, vehicleClass: 7 },
    { vehicleHash: 682434785, vehicleClass: 12 },
    { vehicleHash: 2382949506, vehicleClass: 17 },
    { vehicleHash: 1180875963, vehicleClass: 9 },
    { vehicleHash: 627535535, vehicleClass: 8 },
    { vehicleHash: 3537231886, vehicleClass: 8 },
    { vehicleHash: 2272483501, vehicleClass: 6 },
    { vehicleHash: 777714999, vehicleClass: 4 },
    { vehicleHash: 3312836369, vehicleClass: 5 },
    { vehicleHash: 2889029532, vehicleClass: 5 },
    { vehicleHash: 1234311532, vehicleClass: 7 },
    { vehicleHash: 719660200, vehicleClass: 6 },
    { vehicleHash: 3194418602, vehicleClass: 11 },
    { vehicleHash: 917809321, vehicleClass: 7 },
    { vehicleHash: 3525819835, vehicleClass: 11 },
    { vehicleHash: 1939284556, vehicleClass: 7 },
    { vehicleHash: 177270108, vehicleClass: 20 },
    { vehicleHash: 433954513, vehicleClass: 9 },
    { vehicleHash: 223240013, vehicleClass: 5 },
    { vehicleHash: 1504306544, vehicleClass: 5 },
    { vehicleHash: 387748548, vehicleClass: 20 },
    { vehicleHash: 1502869817, vehicleClass: 11 },
    { vehicleHash: 1356124575, vehicleClass: 9 },
    { vehicleHash: 2370534026, vehicleClass: 9 },
    { vehicleHash: 562680400, vehicleClass: 19 },
    { vehicleHash: 3084515313, vehicleClass: 4 },
    { vehicleHash: 1897744184, vehicleClass: 9 },
    { vehicleHash: 2413121211, vehicleClass: 19 },
    { vehicleHash: 4262731174, vehicleClass: 19 },
    { vehicleHash: 159274291, vehicleClass: 5 },
    { vehicleHash: 884483972, vehicleClass: 8 },
    { vehicleHash: 3052358707, vehicleClass: 7 },
    { vehicleHash: 4262088844, vehicleClass: 16 },
    { vehicleHash: 2771347558, vehicleClass: 16 },
    { vehicleHash: 3902291871, vehicleClass: 16 },
    { vehicleHash: 1043222410, vehicleClass: 16 },
    { vehicleHash: 2310691317, vehicleClass: 15 },
    { vehicleHash: 4252008158, vehicleClass: 15 },
    { vehicleHash: 2531412055, vehicleClass: 16 },
    { vehicleHash: 3319621991, vehicleClass: 16 },
    { vehicleHash: 2908775872, vehicleClass: 16 },
    { vehicleHash: 3287439187, vehicleClass: 16 },
    { vehicleHash: 3545667823, vehicleClass: 16 },
    { vehicleHash: 2594093022, vehicleClass: 16 },
    { vehicleHash: 1036591958, vehicleClass: 16 },
    { vehicleHash: 1565978651, vehicleClass: 16 },
    { vehicleHash: 2049897956, vehicleClass: 5 },
    { vehicleHash: 1841130506, vehicleClass: 5 },
    { vehicleHash: 1392481335, vehicleClass: 7 },
    { vehicleHash: 3296789504, vehicleClass: 7 },
    { vehicleHash: 838982985, vehicleClass: 5 },
    { vehicleHash: 3903371924, vehicleClass: 5 },
    { vehicleHash: 661493923, vehicleClass: 6 },
    { vehicleHash: 2765724541, vehicleClass: 6 },
    { vehicleHash: 2762269779, vehicleClass: 9 },
    { vehicleHash: 1352136073, vehicleClass: 7 },
    { vehicleHash: 3981782132, vehicleClass: 7 },
    { vehicleHash: 903794909, vehicleClass: 5 },
    { vehicleHash: 2215179066, vehicleClass: 5 },
    { vehicleHash: 1561920505, vehicleClass: 6 },
    { vehicleHash: 2445973230, vehicleClass: 6 },
    { vehicleHash: 1104234922, vehicleClass: 6 },
    { vehicleHash: 2859440138, vehicleClass: 19 },
    { vehicleHash: 4081974053, vehicleClass: 19 },
    { vehicleHash: 447548909, vehicleClass: 16 },
    { vehicleHash: 1181327175, vehicleClass: 15 },
    { vehicleHash: 1483171323, vehicleClass: 5 },
    { vehicleHash: 886810209, vehicleClass: 5 },
    { vehicleHash: 3602674979, vehicleClass: 19 },
    { vehicleHash: 2601952180, vehicleClass: 18 },
    { vehicleHash: 2176659152, vehicleClass: 16 },
    { vehicleHash: 408970549, vehicleClass: 16 },
    { vehicleHash: 1489874736, vehicleClass: 19 },
    { vehicleHash: 1871995513, vehicleClass: 4 },
    { vehicleHash: 15219735, vehicleClass: 4 },
    { vehicleHash: 600450546, vehicleClass: 4 },
    { vehicleHash: 1741861769, vehicleClass: 6 },
    { vehicleHash: 3884762073, vehicleClass: 6 },
    { vehicleHash: 867799010, vehicleClass: 6 },
    { vehicleHash: 4173521127, vehicleClass: 9 },
    { vehicleHash: 2174267100, vehicleClass: 7 },
    { vehicleHash: 3306466016, vehicleClass: 5 },
    { vehicleHash: 4080061290, vehicleClass: 6 },
    { vehicleHash: 1254014755, vehicleClass: 9 },
    { vehicleHash: 1115909093, vehicleClass: 6 },
    { vehicleHash: 3568198617, vehicleClass: 15 },
    { vehicleHash: 3035832600, vehicleClass: 6 },
    { vehicleHash: 3027423925, vehicleClass: 4 },
    { vehicleHash: 1046206681, vehicleClass: 5 },
    { vehicleHash: 1617472902, vehicleClass: 5 },
    { vehicleHash: 3308022675, vehicleClass: 4 },
    { vehicleHash: 3918533058, vehicleClass: 7 },
    { vehicleHash: 1031562256, vehicleClass: 7 },
    { vehicleHash: 1909189272, vehicleClass: 6 },
    { vehicleHash: 931280609, vehicleClass: 0 },
    { vehicleHash: 3160260734, vehicleClass: 7 },
    { vehicleHash: 321186144, vehicleClass: 1 },
    { vehicleHash: 3656405053, vehicleClass: 7 },
    { vehicleHash: 1692272545, vehicleClass: 16 },
    { vehicleHash: 2306538597, vehicleClass: 20 },
    { vehicleHash: 345756458, vehicleClass: 17 },
    { vehicleHash: 2069146067, vehicleClass: 8 },
    { vehicleHash: 1653666139, vehicleClass: 20 },
    { vehicleHash: 219613597, vehicleClass: 12 },
    { vehicleHash: 4240635011, vehicleClass: 9 },
    { vehicleHash: 1945374990, vehicleClass: 20 },
    { vehicleHash: 2044532910, vehicleClass: 9 },
    { vehicleHash: 3987008919, vehicleClass: 16 },
    { vehicleHash: 500482303, vehicleClass: 5 },
    { vehicleHash: 3874056184, vehicleClass: 2 },
    { vehicleHash: 2370166601, vehicleClass: 4 },
    { vehicleHash: 840387324, vehicleClass: 9 },
    { vehicleHash: 3579220348, vehicleClass: 9 },
    { vehicleHash: 1742022738, vehicleClass: 4 },
    { vehicleHash: 1239571361, vehicleClass: 0 },
    { vehicleHash: 679453769, vehicleClass: 20 },
    { vehicleHash: 1909700336, vehicleClass: 20 },
    { vehicleHash: 2482017624, vehicleClass: 8 },
    { vehicleHash: 3001042683, vehicleClass: 4 },
    { vehicleHash: 2920466844, vehicleClass: 8 },
    { vehicleHash: 2550461639, vehicleClass: 4 },
    { vehicleHash: 2233918197, vehicleClass: 4 },
    { vehicleHash: 373261600, vehicleClass: 4 },
    { vehicleHash: 2139203625, vehicleClass: 9 },
    { vehicleHash: 2403970600, vehicleClass: 9 },
    { vehicleHash: 2038858402, vehicleClass: 9 },
    { vehicleHash: 4267640610, vehicleClass: 8 },
    { vehicleHash: 3606777648, vehicleClass: 4 },
    { vehicleHash: 2919906639, vehicleClass: 4 },
    { vehicleHash: 668439077, vehicleClass: 9 },
    { vehicleHash: 2600885406, vehicleClass: 9 },
    { vehicleHash: 2252616474, vehicleClass: 9 },
    { vehicleHash: 4008920556, vehicleClass: 9 },
    { vehicleHash: 3963499524, vehicleClass: 6 },
    { vehicleHash: 3493417227, vehicleClass: 20 },
    { vehicleHash: 1009171724, vehicleClass: 4 },
    { vehicleHash: 1721676810, vehicleClass: 9 },
    { vehicleHash: 1456744817, vehicleClass: 4 },
    { vehicleHash: 3147997943, vehicleClass: 19 },
    { vehicleHash: 1542143200, vehicleClass: 19 },
    { vehicleHash: 3715219435, vehicleClass: 19 },
    { vehicleHash: 628003514, vehicleClass: 0 },
    { vehicleHash: 1537277726, vehicleClass: 0 },
    { vehicleHash: 2728360112, vehicleClass: 4 },
    { vehicleHash: 1591739866, vehicleClass: 7 },
    { vehicleHash: 4245851645, vehicleClass: 4 },
    { vehicleHash: 444994115, vehicleClass: 4 },
    { vehicleHash: 1637620610, vehicleClass: 4 },
    { vehicleHash: 3539435063, vehicleClass: 4 },
    { vehicleHash: 3126015148, vehicleClass: 2 },
    { vehicleHash: 1279262537, vehicleClass: 4 },
    { vehicleHash: 3787471536, vehicleClass: 6 },
    { vehicleHash: 2198276962, vehicleClass: 4 },
    { vehicleHash: 540101442, vehicleClass: 6 },
    { vehicleHash: 3188846534, vehicleClass: 6 },
    { vehicleHash: 2816263004, vehicleClass: 6 },
    { vehicleHash: 3847255899, vehicleClass: 6 },
    { vehicleHash: 1416466158, vehicleClass: 6 },
    { vehicleHash: 4086055493, vehicleClass: 6 },
    { vehicleHash: 916547552, vehicleClass: 8 },
    { vehicleHash: 2674840994, vehicleClass: 6 },
    { vehicleHash: 3630826055, vehicleClass: 7 },
    { vehicleHash: 2490551588, vehicleClass: 4 },
    { vehicleHash: 1934384720, vehicleClass: 4 },
    { vehicleHash: 3970348707, vehicleClass: 7 },
    { vehicleHash: 2945871676, vehicleClass: 9 },
    { vehicleHash: 1044193113, vehicleClass: 7 },
    { vehicleHash: 2465530446, vehicleClass: 2 },
    { vehicleHash: 3612858749, vehicleClass: 7 },
    { vehicleHash: 1854776567, vehicleClass: 6 },
    { vehicleHash: 3353694737, vehicleClass: 6 },
    { vehicleHash: 1323778901, vehicleClass: 7 },
    { vehicleHash: 3932816511, vehicleClass: 9 },
    { vehicleHash: 310284501, vehicleClass: 5 },
    { vehicleHash: 722226637, vehicleClass: 4 },
    { vehicleHash: 3412338231, vehicleClass: 5 },
    { vehicleHash: 1862507111, vehicleClass: 5 },
    { vehicleHash: 686471183, vehicleClass: 6 },
    { vehicleHash: 3040635986, vehicleClass: 19 },
    { vehicleHash: 2031587082, vehicleClass: 5 },
    { vehicleHash: 408825843, vehicleClass: 9 },
    { vehicleHash: 1693751655, vehicleClass: 4 },
    { vehicleHash: 301304410, vehicleClass: 8 },
    { vehicleHash: 394110044, vehicleClass: 5 },
    { vehicleHash: 872704284, vehicleClass: 6 },
    { vehicleHash: 2538945576, vehicleClass: 9 },
    { vehicleHash: 987469656, vehicleClass: 6 },
    { vehicleHash: 1284356689, vehicleClass: 9 },
    { vehicleHash: 340154634, vehicleClass: 22 },
    { vehicleHash: 2334210311, vehicleClass: 22 },
    { vehicleHash: 83136452, vehicleClass: 2 },
    { vehicleHash: 740289177, vehicleClass: 9 },
    { vehicleHash: 960812448, vehicleClass: 7 },
    { vehicleHash: 1456336509, vehicleClass: 6 },
    { vehicleHash: 3460613305, vehicleClass: 6 },
    { vehicleHash: 1118611807, vehicleClass: 0 },
    { vehicleHash: 409049982, vehicleClass: 0 },
    { vehicleHash: 3162245632, vehicleClass: 6 },
    { vehicleHash: 1492612435, vehicleClass: 22 },
    { vehicleHash: 2566281822, vehicleClass: 6 },
    { vehicleHash: 2936769864, vehicleClass: 7 },
    { vehicleHash: 3663644634, vehicleClass: 6 },
    { vehicleHash: 3456868130, vehicleClass: 2 },
    { vehicleHash: 67753863, vehicleClass: 9 },
    { vehicleHash: 2196012677, vehicleClass: 0 },
    { vehicleHash: 2172320429, vehicleClass: 4 },
    { vehicleHash: 2134119907, vehicleClass: 4 },
    { vehicleHash: 1802742206, vehicleClass: 12 },
    { vehicleHash: 3381377750, vehicleClass: 1 },
    { vehicleHash: 2484160806, vehicleClass: 2 },
    { vehicleHash: 1181339704, vehicleClass: 22 },
    { vehicleHash: 1107404867, vehicleClass: 5 },
    { vehicleHash: 1717532765, vehicleClass: 4 },
    { vehicleHash: 2802050217, vehicleClass: 6 },
    { vehicleHash: 4192631813, vehicleClass: 2 },
    { vehicleHash: 3314393930, vehicleClass: 14 },
    { vehicleHash: 295054921, vehicleClass: 15 },
    { vehicleHash: 3145241962, vehicleClass: 6 },
    { vehicleHash: 3437611258, vehicleClass: 6 },
    { vehicleHash: 1455990255, vehicleClass: 5 },
    { vehicleHash: 3249056020, vehicleClass: 11 },
    { vehicleHash: 1644055914, vehicleClass: 0 },
    { vehicleHash: 2014313426, vehicleClass: 19 },
    { vehicleHash: 3929093893, vehicleClass: 16 },
    { vehicleHash: 4018222598, vehicleClass: 14 },
    { vehicleHash: 2588363614, vehicleClass: 14 },
    { vehicleHash: 1429622905, vehicleClass: 0 },
    { vehicleHash: 298565713, vehicleClass: 9 },
    { vehicleHash: 1861786828, vehicleClass: 14 },
    { vehicleHash: 1229411063, vehicleClass: 15 },
    { vehicleHash: 1593933419, vehicleClass: 15 },
    { vehicleHash: 4084658662, vehicleClass: 9 },
    { vehicleHash: 1086534307, vehicleClass: 8 },
    { vehicleHash: 1336872304, vehicleClass: 14 },
    { vehicleHash: 3186376089, vehicleClass: 21 },
    { vehicleHash: 2568944644, vehicleClass: 6 },
    { vehicleHash: 426742808, vehicleClass: 4 },
    { vehicleHash: 736672010, vehicleClass: 4 },
    { vehicleHash: 2038480341, vehicleClass: 6 },
    { vehicleHash: 2787736776, vehicleClass: 6 },
    { vehicleHash: 3842363289, vehicleClass: 6 },
    { vehicleHash: 4003946083, vehicleClass: 6 },
    { vehicleHash: 3050505892, vehicleClass: 1 },
    { vehicleHash: 1304459735, vehicleClass: 6 },
    { vehicleHash: 2754593701, vehicleClass: 6 },
    { vehicleHash: 1377217886, vehicleClass: 6 },
    { vehicleHash: 3101054893, vehicleClass: 6 },
    { vehicleHash: 1755697647, vehicleClass: 6 },
    { vehicleHash: 2712905841, vehicleClass: 6 },
    { vehicleHash: 2436313176, vehicleClass: 6 },
    { vehicleHash: 1416471345, vehicleClass: 3 },
    { vehicleHash: 579912970, vehicleClass: 1 },
    { vehicleHash: 1353120668, vehicleClass: 8 },
    { vehicleHash: 1993851908, vehicleClass: 8 },
    { vehicleHash: 3379732821, vehicleClass: 7 },
    { vehicleHash: 2767531027, vehicleClass: 1 },
    { vehicleHash: 662793086, vehicleClass: 2 },
    { vehicleHash: 629969764, vehicleClass: 2 },
    { vehicleHash: 359875117, vehicleClass: 2 },
    { vehicleHash: 3675036420, vehicleClass: 4 },
    { vehicleHash: 1141395928, vehicleClass: 6 },
    { vehicleHash: 1532171089, vehicleClass: 1 },
    { vehicleHash: 2850852987, vehicleClass: 7 },
    { vehicleHash: 461465043, vehicleClass: 2 },
    { vehicleHash: 3624880708, vehicleClass: 9 },
    { vehicleHash: 655665811, vehicleClass: 7 },
    { vehicleHash: 4033620423, vehicleClass: 2 },
    { vehicleHash: 1486521356, vehicleClass: 12 },
    { vehicleHash: 1343932732, vehicleClass: 20 },
    { vehicleHash: 3789743831, vehicleClass: 6 },
    { vehicleHash: 2938086457, vehicleClass: 6 },
    { vehicleHash: 1706945532, vehicleClass: 4 },
    { vehicleHash: 15214558, vehicleClass: 0 },
    { vehicleHash: 3540279623, vehicleClass: 6 },
    { vehicleHash: 3526730918, vehicleClass: 9 },
    { vehicleHash: 4230891418, vehicleClass: 3 },
    { vehicleHash: 4000288633, vehicleClass: 3 },
    { vehicleHash: 4129572538, vehicleClass: 7 },
    { vehicleHash: 2536587772, vehicleClass: 4 },
    { vehicleHash: 4284049613, vehicleClass: 7 },
    { vehicleHash: 3400983137, vehicleClass: 6 },
    { vehicleHash: 274946574, vehicleClass: 6 },
    { vehicleHash: 2439462158, vehicleClass: 1 },
    { vehicleHash: 3817135397, vehicleClass: 15 },
    { vehicleHash: 40817712, vehicleClass: 4 },
    { vehicleHash: 775514032, vehicleClass: 6 },
    { vehicleHash: 3300595976, vehicleClass: 4 },
    { vehicleHash: 3833117047, vehicleClass: 4 },
    { vehicleHash: 2361724968, vehicleClass: 4 },
    { vehicleHash: 1550581940, vehicleClass: 2 },
    { vehicleHash: 268758436, vehicleClass: 4 },
    { vehicleHash: 4163619118, vehicleClass: 6 },
    { vehicleHash: 669204833, vehicleClass: 7 },
    { vehicleHash: 996383885, vehicleClass: 9 },
    { vehicleHash: 2100457220, vehicleClass: 6 },
    { vehicleHash: 1076201208, vehicleClass: 6 },
    { vehicleHash: 1748565021, vehicleClass: 7 },
    { vehicleHash: 3045179290, vehicleClass: 4 },
    { vehicleHash: 2908631255, vehicleClass: 8 },
    { vehicleHash: 2667889793, vehicleClass: 12 },
    { vehicleHash: 2718380883, vehicleClass: 17 },
    { vehicleHash: 1384502824, vehicleClass: 8 },
    { vehicleHash: 3259477733, vehicleClass: 12 },
    { vehicleHash: 2336777441, vehicleClass: 16 },
    { vehicleHash: 2311345272, vehicleClass: 13 },
    { vehicleHash: 3397143273, vehicleClass: 13 },
    { vehicleHash: 239897677, vehicleClass: 16 },
    { vehicleHash: 802856453, vehicleClass: 9 },
    { vehicleHash: 610429990, vehicleClass: 6 },
    { vehicleHash: 3758861739, vehicleClass: 9 },
    { vehicleHash: 1447690049, vehicleClass: 6 },
    { vehicleHash: 3315674721, vehicleClass: 4 },
    { vehicleHash: 191916658, vehicleClass: 16 },
    { vehicleHash: 3640468689, vehicleClass: 4 },
    { vehicleHash: 1336514315, vehicleClass: 6 },
    { vehicleHash: 3868033424, vehicleClass: 16 },
    { vehicleHash: 4225674290, vehicleClass: 16 },
    { vehicleHash: 165968051, vehicleClass: 4 },
    { vehicleHash: 4250167832, vehicleClass: 12 },
    { vehicleHash: 2635962482, vehicleClass: 15 },
    { vehicleHash: 2531292011, vehicleClass: 9 },
    { vehicleHash: 2620582743, vehicleClass: 18 },
    { vehicleHash: 2922168362, vehicleClass: 2 },
    { vehicleHash: 167522317, vehicleClass: 9 },
    { vehicleHash: 4116524922, vehicleClass: 4 },
    { vehicleHash: 3526923154, vehicleClass: 2 },
    { vehicleHash: 728350375, vehicleClass: 20 },
    { vehicleHash: 3392937977, vehicleClass: 11 },
    { vehicleHash: 3623402354, vehicleClass: 11 },
    { vehicleHash: 3816328113, vehicleClass: 1 },
    { vehicleHash: 372621319, vehicleClass: 4 },
    { vehicleHash: 3265236814, vehicleClass: 2 },
    { vehicleHash: 2815031719, vehicleClass: 3 },
    { vehicleHash: 2531693357, vehicleClass: 6 },
    { vehicleHash: 4113404654, vehicleClass: 6 },
    { vehicleHash: 821121576, vehicleClass: 6 },
    { vehicleHash: 2613313775, vehicleClass: 4 },
    { vehicleHash: 2598648200, vehicleClass: 6 },
    { vehicleHash: 1923534526, vehicleClass: 6 },
    { vehicleHash: 2670883828, vehicleClass: 6 },
    { vehicleHash: 4256087847, vehicleClass: 2 },
    { vehicleHash: 3852738056, vehicleClass: 21 },
    { vehicleHash: 3853757601, vehicleClass: 4 },
    { vehicleHash: 3061199846, vehicleClass: 18 },
    { vehicleHash: 4171974011, vehicleClass: 7 },
    { vehicleHash: 471034616, vehicleClass: 11 },
    { vehicleHash: 3452201761, vehicleClass: 12 },
    { vehicleHash: 3829141989, vehicleClass: 3 },
    { vehicleHash: 2960513480, vehicleClass: 11 },
    { vehicleHash: 4165683409, vehicleClass: 20 },
    { vehicleHash: 3553846961, vehicleClass: 1 },
    { vehicleHash: 3431608412, vehicleClass: 2 },
    { vehicleHash: 1835260592, vehicleClass: 11 },
    { vehicleHash: 1539159908, vehicleClass: 11 },
    { vehicleHash: 3228633070, vehicleClass: 14 },
    { vehicleHash: 723973206, vehicleClass: 4 },
    { vehicleHash: 3968823444, vehicleClass: 4 },
    { vehicleHash: 237764926, vehicleClass: 6 },
    { vehicleHash: 3379262425, vehicleClass: 4 },
    { vehicleHash: 3393804037, vehicleClass: 16 },
    { vehicleHash: 1233534620, vehicleClass: 9 },
    { vehicleHash: 3681241380, vehicleClass: 16 },
    { vehicleHash: 349315417, vehicleClass: 4 },
    { vehicleHash: 1923400478, vehicleClass: 4 },
    { vehicleHash: 3893323758, vehicleClass: 4 },
    { vehicleHash: 1039032026, vehicleClass: 6 },
    { vehicleHash: 3703315515, vehicleClass: 6 }
];
exports.vehicleClasses = vehicleClasses;


/***/ },

/***/ "./source/server/assets/Weapons.assets.ts"
/*!************************************************!*\
  !*** ./source/server/assets/Weapons.assets.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deathReasons = exports.weaponUnhash = exports.weaponHash = void 0;
const weaponHash = {
    unarmed: 2725352035,
    knife: 2578778090,
    nightstick: 1737195953,
    hammer: 1317494643,
    bat: 2508868239,
    crowbar: 2227010557,
    golfclub: 1141786504,
    bottle: 4192643659,
    dagger: 2460120199,
    hatchet: 4191993645,
    knuckleduster: 3638508604,
    machete: 3713923289,
    flashlight: 2343591895,
    switchblade: 3756226112,
    poolcue: 2484171525,
    wrench: 419712736,
    battleaxe: 3441901897,
    pistol: 453432689,
    pistolmk2: 3219281620,
    combatpistol: 1593441988,
    pistol50: 2578377531,
    snspistol: 3218215474,
    heavypistol: 3523564046,
    vintagepistol: 137902532,
    marksmanpistol: 3696079510,
    revolver: 3249783761,
    appistol: 584646201,
    stungun: 911657153,
    flaregun: 1198879012,
    microsmg: 324215364,
    machinepistol: 3675956304,
    smg: 736523883,
    smg_mk2: 2024373456,
    assaultsmg: 4024951519,
    combatpdw: 171789620,
    mg: 2634544996,
    combatmg: 2144741730,
    combatmgmk2: 3686625920,
    gusenberg: 1627465347,
    minismg: 3173288789,
    assaultrifle: 3220176749,
    assaultrifle_mk2: 961495388,
    carbinerifle: 2210333304,
    carbinerifle_mk2: 4208062921,
    advancedrifle: 2937143193,
    specialcarbine: 3231910285,
    bullpuprifle: 2132975508,
    compactrifle: 1649403952,
    sniperrifle: 100416529,
    heavysniper: 205991906,
    heavysnipermk2: 177293209,
    marksmanrifle: 3342088282,
    pumpshotgun: 487013001,
    sawnoffshotgun: 2017895192,
    bullpupshotgun: 2640438543,
    assaultshotgun: 3800352039,
    mukset: 2828843422,
    heavyshotgun: 984333226,
    doublebarrelshotgun: 4019527611,
    autoshotgun: 317205821,
    grenadelauncher: 2726580491,
    rpg: 2982836145,
    minigun: 1119849093,
    firework: 2138347493,
    railgun: 1834241177,
    hominglauncher: 1672152130,
    grenadelaunchersmoke: 1305664598,
    compactlauncher: 125959754,
    grenade: 2481070269,
    stickybomb: 741814745,
    proximitymine: 2874559379,
    bzgas: 2694266206,
    molotov: 615608432,
    fireextinguisher: 101631238,
    petrolcan: 883325847,
    flare: 1233104067,
    ball: 600439132,
    snowball: 126349499,
    smokegrenade: 4256991824,
    pipebomb: 3125143736,
    parachute: 4222310262
};
exports.weaponHash = weaponHash;
const weaponUnhash = {
    2725352035: "weapon_unarmed",
    2578778090: "weapon_knife",
    1737195953: "weapon_nightstick",
    1317494643: "weapon_hammer",
    2508868239: "weapon_bat",
    2227010557: "weapon_crowbar",
    1141786504: "weapon_golfclub",
    4192643659: "weapon_bottle",
    2460120199: "weapon_dagger",
    4191993645: "weapon_hatchet",
    3638508604: "weapon_knuckleduster",
    3713923289: "weapon_machete",
    2343591895: "weapon_flashlight",
    3756226112: "weapon_switchblade",
    2484171525: "weapon_poolcue",
    419712736: "weapon_wrench",
    3441901897: "weapon_battleaxe",
    453432689: "weapon_pistol",
    3219281620: "weapon_pistol_mk2",
    1593441988: "weapon_combatpistol",
    2578377531: "weapon_pistol50",
    3218215474: "weapon_snspistol",
    3523564046: "weapon_heavypistol",
    137902532: "weapon_vintagepistol",
    3696079510: "weapon_marksmanpistol",
    3249783761: "weapon_revolver",
    584646201: "weapon_appistol",
    911657153: "weapon_stungun",
    1198879012: "weapon_flaregun",
    324215364: "weapon_microsmg",
    3675956304: "weapon_machinepistol",
    736523883: "weapon_smg",
    2024373456: "weapon_smgmk2",
    4024951519: "weapon_assaultsmg",
    171789620: "weapon_combatpdw",
    2634544996: "weapon_mg",
    2144741730: "weapon_combatmg",
    3686625920: "weapon_combatmgmk2",
    1627465347: "weapon_gusenberg",
    3173288789: "weapon_minismg",
    3220176749: "weapon_assaultrifle",
    961495388: "weapon_assaultriflemk2",
    2210333304: "weapon_carbinerifle",
    4208062921: "weapon_carbineriflemk2",
    2937143193: "weapon_advancedrifle",
    3231910285: "weapon_specialcarbine",
    2132975508: "weapon_bullpuprifle",
    1649403952: "weapon_compactrifle",
    100416529: "weapon_sniperrifle",
    205991906: "weapon_heavysniper",
    177293209: "weapon_heavysnipermk2",
    3342088282: "weapon_marksmanrifle",
    487013001: "weapon_pumpshotgun",
    2017895192: "weapon_sawnoffshotgun",
    2640438543: "weapon_bullpupshotgun",
    3800352039: "weapon_assaultshotgun",
    2828843422: "weapon_musket",
    984333226: "weapon_heavyshotgun",
    4019527611: "weapon_doublebarrelshotgun",
    317205821: "weapon_autoshotgun",
    2726580491: "weapon_grenadelauncher",
    2982836145: "weapon_rpg",
    1119849093: "weapon_minigun",
    2138347493: "weapon_firework",
    1834241177: "weapon_railgun",
    1672152130: "weapon_hominglauncher",
    1305664598: "weapon_grenadelaunchersmoke",
    125959754: "weapon_compactlauncher",
    2481070269: "weapon_grenade",
    741814745: "weapon_stickybomb",
    2874559379: "weapon_proximitymine",
    2694266206: "weapon_bzgas",
    615608432: "weapon_molotov",
    101631238: "weapon_fireextinguisher",
    883325847: "weapon_petrolcan",
    1233104067: "weapon_flare",
    600439132: "weapon_ball",
    126349499: "weapon_snowball",
    4256991824: "weapon_smokegrenade",
    3125143736: "weapon_pipebomb",
    4222310262: "weapon_parachute"
};
exports.weaponUnhash = weaponUnhash;
const deathReasons = {
    "2460120199": "Antique Cavalry Dagger",
    "2508868239": "Baseball Bat",
    "4192643659": "Bottle",
    "2227010557": "Crowbar",
    "2725352035": "Fist",
    "2343591895": "Flashlight",
    "1141786504": "Golf Club",
    "1317494643": "Hammer",
    "4191993645": "Hatchet",
    "3638508604": "Knuckle",
    "2578778090": "Knife",
    "3713923289": "Machete",
    "3756226112": "Switchblade",
    "1737195953": "Nightstick",
    "419712736": "Pipe Wrench",
    "3441901897": "Battle Axe",
    "2484171525": "Pool Cue",
    "940833800": "Stone Hatchet",
    "453432689": "Pistol",
    "3219281620": "Pistol MK2",
    "1593441988": "Combat Pistol",
    "584646201": "AP Pistol",
    "911657153": "Stun Gun",
    "2578377531": "Pistol .50",
    "3218215474": "SNS Pistol",
    "2285322324": "SNS Pistol MK2",
    "3523564046": "Heavy Pistol",
    "137902532": "Vintage Pistol",
    "1198879012": "Flare Gun",
    "3696079510": "Marksman Pistol",
    "3249783761": "Heavy Revolver",
    "3415619887": "Heavy Revolver MK2",
    "2548703416": "Double Action",
    "2939590305": "Up-n-Atomizer",
    "324215364": "Micro SMG",
    "736523883": "SMG",
    "2024373456": "SMG MK2",
    "4024951519": "Assault SMG",
    "171789620": "Combat PDW",
    "3675956304": "Machine Pistol",
    "3173288789": "Mini SMG",
    "1198256469": "Unholy Hellbringer",
    "487013001": "Pump Shotgun",
    "1432025498": "Pump Shotgun MK2",
    "2017895192": "Sawed-Off Shotgun",
    "3800352039": "Assault Shotgun",
    "2640438543": "Bullpup Shotgun",
    "2828843422": "Musket",
    "984333226": "Heavy Shotgun",
    "4019527611": "Double Barrel Shotgun",
    "317205821": "Sweeper Shotgun",
    "3220176749": "Assault Rifle",
    "961495388": "Assault Rifle MK2",
    "2210333304": "Carbine Rifle",
    "4208062921": "Carbine Rifle MK2",
    "2937143193": "Advanced Rifle",
    "3231910285": "Special Carbine",
    "2526821735": "Special Carbine MK2",
    "2132975508": "Bullpup Rifle",
    "2228681469": "Bullpup Rifle MK2",
    "1649403952": "Compact Rifle",
    "2634544996": "MG",
    "2144741730": "Combat MG",
    "3686625920": "Combat MG MK2",
    "1627465347": "Gusenberg Sweeper",
    "100416529": "Sniper Rifle",
    "205991906": "Heavy Sniper",
    "177293209": "Heavy Sniper MK2",
    "3342088282": "Marksman Rifle",
    "1785463520": "Marksman Rifle MK2",
    "2982836145": "RPG",
    "2726580491": "Grenade Launcher",
    "1305664598": "Smoke Grenade Launcher",
    "1119849093": "Minigun",
    "2138347493": "Firework Launcher",
    "1834241177": "Railgun",
    "1672152130": "Homing Launcher",
    "125959754": "Compact Grenade Launcher",
    "3056410471": "Ray Minigun",
    "2481070269": "Grenade",
    "2694266206": "BZ Gas",
    "4256991824": "Smoke Grenade",
    "1233104067": "Flare",
    "615608432": "Molotov",
    "741814745": "Sticky Bomb",
    "2874559379": "Proximity Mine",
    "126349499": "Snowball",
    "3125143736": "Pipe Bomb",
    "600439132": "Baseball",
    "883325847": "Jerry Can",
    "101631238": "Fire Extinguisher",
    "4222310262": "Parachute",
    "2461879995": "Electric Fence",
    "3425972830": "Hit by Water Cannon",
    "133987706": "Rammed by Car",
    "2741846334": "Run Over by Car",
    "3452007600": "Fall",
    "4194021054": "Animal",
    "324506233": "Airstrike Rocket",
    "2339582971": "Bleeding",
    "2294779575": "Briefcase",
    "28811031": "Briefcase 02",
    "148160082": "Cougar",
    "1223143800": "Barbed Wire",
    "4284007675": "Drowning",
    "1936677264": "Drowning In Vehicle",
    "539292904": "Explosion",
    "910830060": "Exhaustion",
    "3750660587": "Fire",
    "341774354": "Heli Crash",
    "3204302209": "Vehicle Rocket",
    "2282558706": "Vehicle Akula Barrage",
    "431576697": "Vehicle Akula Minigun",
    "2092838988": "Vehicle Akula Missile",
    "476907586": "Vehicle Akula Turret Dual",
    "3048454573": "Vehicle Akula Turret Single",
    "328167896": "Vehicle APC Cannon",
    "190244068": "Vehicle APC MG",
    "1151689097": "Vehicle APC Missile",
    "3293463361": "Vehicle Ardent MG",
    "2556895291": "Vehicle Avenger Cannon",
    "2756453005": "Vehicle Barrage Rear GL",
    "1200179045": "Vehicle Barrage Rear MG",
    "525623141": "Vehicle Barrage Rear Minigun",
    "4148791700": "Vehicle Barrage Top MG",
    "1000258817": "Vehicle Barrage Top Minigun",
    "3628350041": "Vehicle Bombushka Cannon",
    "741027160": "Vehicle Bombushka Dual MG",
    "3959029566": "Vehicle Cannon Blazer",
    "1817275304": "Vehicle Caracara MG",
    "1338760315": "Vehicle Caracara Minigun",
    "2722615358": "Vehicle Cherno Missile",
    "3936892403": "Vehicle Comet MG",
    "2600428406": "Vehicle Deluxo MG",
    "3036244276": "Vehicle Deluxo Missile",
    "1595421922": "Vehicle Dogfighter MG",
    "3393648765": "Vehicle Dogfighter Missile",
    "2700898573": "Vehicle Dune Grenade Launcher",
    "3507816399": "Vehicle Dune MG",
    "1416047217": "Vehicle Dune Minigun",
    "1566990507": "Vehicle Enemy Laser",
    "1987049393": "Vehicle Hacker Missile",
    "2011877270": "Vehicle Hacker Missile Homing",
    "1331922171": "Vehicle Halftrack Dual MG",
    "1226518132": "Vehicle Halftrack Quad MG",
    "855547631": "Vehicle Havok Minigun",
    "785467445": "Vehicle Hunter Barrage",
    "704686874": "Vehicle Hunter Cannon",
    "1119518887": "Vehicle Hunter MG",
    "153396725": "Vehicle Hunter Missile",
    "2861067768": "Vehicle Insurgent Minigun",
    "507170720": "Vehicle Khanjali Cannon",
    "2206953837": "Vehicle Khanjali Cannon Heavy",
    "394659298": "Vehicle Khanjali GL",
    "711953949": "Vehicle Khanjali MG",
    "3754621092": "Vehicle Menacer MG",
    "3303022956": "Vehicle Microlight MG",
    "3846072740": "Vehicle Mobileops Cannon",
    "3857952303": "Vehicle Mogul Dual Nose",
    "3123149825": "Vehicle Mogul Dual Turret",
    "4128808778": "Vehicle Mogul Nose",
    "3808236382": "Vehicle Mogul Turret",
    "2220197671": "Vehicle Mule4 MG",
    "1198717003": "Vehicle Mule4 Missile",
    "3708963429": "Vehicle Mule4 Turret GL",
    "2786772340": "Vehicle Nightshark MG",
    "1097917585": "Vehicle Nose Turret Valkyrie",
    "3643944669": "Vehicle Oppressor MG",
    "2344076862": "Vehicle Oppressor Missile",
    "3595383913": "Vehicle Oppressor2 Cannon",
    "3796180438": "Vehicle Oppressor2 MG",
    "1966766321": "Vehicle Oppressor2 Missile",
    "3473446624": "Vehicle Plane Rocket",
    "1186503822": "Vehicle Player Buzzard",
    "3800181289": "Vehicle Player Lazer",
    "1638077257": "Vehicle Player Savage",
    "2456521956": "Vehicle Pounder2 Barrage",
    "2467888918": "Vehicle Pounder2 GL",
    "2263283790": "Vehicle Pounder2 Mini",
    "162065050": "Vehicle Pounder2 Missile",
    "3530961278": "Vehicle Radar",
    "3177079402": "Vehicle Revolter MG",
    "3878337474": "Vehicle Rogue Cannon",
    "158495693": "Vehicle Rogue MG",
    "1820910717": "Vehicle Rogue Missile",
    "50118905": "Vehicle Ruiner Bullet",
    "84788907": "Vehicle Ruiner Rocket",
    "3946965070": "Vehicle Savestra MG",
    "231629074": "Vehicle Scramjet MG",
    "3169388763": "Vehicle Scramjet Missile",
    "1371067624": "Vehicle Seabreeze MG",
    "3450622333": "Vehicle Searchlight",
    "4171469727": "Vehicle Space Rocket",
    "3355244860": "Vehicle Speedo4 MG",
    "3595964737": "Vehicle Speedo4 Turret MG",
    "2667462330": "Vehicle Speedo4 Turret Mini",
    "968648323": "Vehicle Strikeforce Barrage",
    "955522731": "Vehicle Strikeforce Cannon",
    "519052682": "Vehicle Strikeforce Missile",
    "1176362416": "Vehicle Subcar MG",
    "3565779982": "Vehicle Subcar Missile",
    "3884172218": "Vehicle Subcar Torpedo",
    "1744687076": "Vehicle Tampa Dual Minigun",
    "3670375085": "Vehicle Tampa Fixed Minigun",
    "2656583842": "Vehicle Tampa Missile",
    "1015268368": "Vehicle Tampa Mortar",
    "1945616459": "Vehicle Tank",
    "3683206664": "Vehicle Technical Minigun",
    "1697521053": "Vehicle Thruster MG",
    "1177935125": "Vehicle Thruster Missile",
    "2156678476": "Vehicle Trailer Dualaa",
    "341154295": "Vehicle Trailer Missile",
    "1192341548": "Vehicle Trailer Quad MG",
    "2966510603": "Vehicle Tula Dual MG",
    "1217122433": "Vehicle Tula MG",
    "376489128": "Vehicle Tula Minigun",
    "1100844565": "Vehicle Tula Nose MG",
    "3041872152": "Vehicle Turret Boxville",
    "1155224728": "Vehicle Turret Insurgent",
    "729375873": "Vehicle Turret Limo",
    "2144528907": "Vehicle Turret Technical",
    "2756787765": "Vehicle Turret Valkyrie",
    "4094131943": "Vehicle Vigilante MG",
    "1347266149": "Vehicle Vigilante Missile",
    "2275421702": "Vehicle Viseris MG",
    "1150790720": "Vehicle Volatol Dual MG",
    "1741783703": "Vehicle Water Cannon"
};
exports.deathReasons = deathReasons;


/***/ },

/***/ "./source/server/classes/CEFEvent.class.ts"
/*!*************************************************!*\
  !*** ./source/server/classes/CEFEvent.class.ts ***!
  \*************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CefEvent = void 0;
class Cef_Event {
    eventsInMemory = [];
    constructor() {
        this.eventsInMemory = [];
        console.log("Cef event handler initialised!");
    }
    get poolSize() {
        return this.eventsInMemory.length;
    }
    register(page, pointer, handler // Allow any type for handler when page and pointer are provided as strings
    ) {
        if (!this.eventsInMemory.some((event) => event.target === page && event.name === pointer)) {
            const _event = new mp.Event(`server::${page}:${pointer}`, handler);
            this.eventsInMemory.push({ target: page, name: pointer, handler, _event });
            return _event;
        }
        else {
            console.log("------------------------------------------------------------");
            throw new Error(`Event: "${page}", "${pointer}" was found duplicated`);
        }
    }
    startPage(player, pageName) {
        player.call("client::cef:start", [pageName]);
    }
    /**
     * Removes page events that were registered using .register
     * @param page page which you'd like to remove events from
     * @returns void
     */
    remove(page) {
        const targetInEvent = this.eventsInMemory.find((x) => x.target === page);
        if (!targetInEvent)
            return;
        if (targetInEvent._event) {
            targetInEvent._event.destroy();
        }
        this.eventsInMemory.splice(this.eventsInMemory.indexOf(targetInEvent), 1);
    }
    /**
     * Updates page:pointer handler.
     * @param page page name which to update handler from
     * @param pointer page pointer which to update handle
     * @param handler new handle that you'd like to attach
     */
    updateHandler(page, pointer, handler) {
        const index = this.eventsInMemory.findIndex((event) => event.target === page && event.name === pointer);
        if (index !== -1) {
            this.eventsInMemory[index].handler = handler;
        }
    }
    /**
     * Emits a CEF(frontend) event, such as when sending data to a specified page given
     * @example
     * ```
     * Cef_Event.emit(mp.players.at(0), "hud", "setData", {level: 1});
     * ```
     * @param player The player to emit data to
     * @param page Which page to update
     * @param pointer Which pointer to call
     * @param data Data to send
     * @returns void
     */
    emit(player, page, pointer, data) {
        if (!mp.players.exists(player))
            return;
        const eventName = `cef::${page}:${String(pointer)}`;
        return player.call("client::eventManager", [eventName, data]);
    }
    /**
     * Emits a CEF(frontend) event, such as when sending data to a specified page given
     * Same as .emit but supports async
     * @example
     * ```
     * await Cef_Event.emitAsync(mp.players.at(0), "hud", "setData", {level: 1});
     * ```
     * @param player The player to emit data to
     * @param target Which page to update
     * @param pointer Which pointer to call
     * @param obj Data to send
     * @returns void
     */
    async emitAsync(player, target, pointer, obj) {
        if (!mp.players.exists(player))
            return;
        const eventName = `cef::${target}:${String(pointer)}`;
        return player.call("client::eventManager", [eventName, obj]);
    }
}
const CefEvent = new Cef_Event();
exports.CefEvent = CefEvent;


/***/ },

/***/ "./source/server/classes/Command.class.ts"
/*!************************************************!*\
  !*** ./source/server/classes/Command.class.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandRegistry = void 0;
const CEFEvent_class_1 = __webpack_require__(/*! ./CEFEvent.class */ "./source/server/classes/CEFEvent.class.ts");
class _CommandRegistry {
    notFoundMessageEnabled;
    _notFoundMessage;
    _commands;
    _aliasToCommand;
    constructor() {
        this.notFoundMessageEnabled = true;
        this._notFoundMessage = "404 not found.";
        this._commands = new Map();
        this._aliasToCommand = new Map();
    }
    // Properties
    // get notFoundMessage() {
    //     return this._notFoundMessage;
    // }
    //
    // set notFoundMessage(message) {
    //     if (!message || message.length === 0) {
    //         throw new Error("message must be a non-empty string");
    //     }
    //
    //     this._notFoundMessage = message;
    // }
    // Functions
    commandNotFound(_player, _commandName) {
        if (this.notFoundMessageEnabled) {
            return;
        }
    }
    add(command) {
        if (!command) {
            throw new Error("No command information was passed");
        }
        const { name, aliases = [], adminlevel = 0, description, run } = command;
        if (!name || name.length === 0) {
            throw new Error("Cannot register commands without a name");
        }
        else if (!aliases || !Array.isArray(aliases)) {
            throw new Error("Cannot register commands with non-array aliases property");
        }
        else if (typeof run !== "function") {
            throw new Error("Cannot register commands with non-function run property");
        }
        // Make sure every name exists only once
        const nameLowercase = name.toLowerCase();
        if (this._commands.has(nameLowercase) || this._aliasToCommand.has(nameLowercase)) {
            throw new Error(`A command named "${nameLowercase}" already exists`);
        }
        // Make sure aliases are all lowercase strings
        const fixedAliases = aliases.filter((alias) => typeof alias === "string" && alias.length !== 0).map((alias) => alias.toLowerCase());
        // Register command
        this._commands.set(nameLowercase, {
            name: nameLowercase,
            aliases: fixedAliases,
            adminlevel: adminlevel,
            description: description,
            run
        });
        // Register aliases
        const aliasSet = new Set(fixedAliases);
        for (const alias of aliasSet) {
            if (this._commands.has(alias) || this._aliasToCommand.has(alias)) {
                throw new Error(`A command named "${alias}" already exists`);
            }
            this._aliasToCommand.set(alias, nameLowercase);
        }
    }
    getallCommands() {
        return [...this._commands.values()];
    }
    // getNames() {
    //     return [...this._commands.keys()];
    // }
    //
    // getNamesWithAliases() {
    //     return [...this._commands.keys(), ...this._aliasToCommand.keys()];
    // }
    find(commandName) {
        if (!commandName || commandName.length === 0) {
            throw new Error("Command name cannot be empty");
        }
        commandName = commandName.toLowerCase();
        // Try to find by name
        const command = this._commands.get(commandName);
        if (command) {
            return command;
        }
        // Finding by name failed, try to find by alias
        const aliasCommand = this._aliasToCommand.get(commandName);
        if (!aliasCommand)
            return null;
        return this._commands.get(aliasCommand);
    }
    reloadCommands(player) {
        if (!player || !mp.players.exists(player) || !player.account)
            return;
        const scriptCommands = exports.CommandRegistry.getallCommands();
        const commandList = (player.account.adminlevel ?? 0) <= 0 ? scriptCommands.filter((x) => !x.adminlevel).map((x) => `/${x.name}`) : scriptCommands.map((x) => `/${x.name}`);
        CEFEvent_class_1.CefEvent.emit(player, "chat", "setCommands", commandList);
    }
}
exports.CommandRegistry = new _CommandRegistry();


/***/ },

/***/ "./source/server/classes/Interaction.class.ts"
/*!****************************************************!*\
  !*** ./source/server/classes/Interaction.class.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InteractionMenu = void 0;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
class InteractionMenu {
    player = null;
    acceptEvent = null;
    refuseEvent = null;
    constructor() {
        this.player = null;
        this.acceptEvent = null;
        this.refuseEvent = null;
        this.clearPromiseEvents();
    }
    /**
     * Display interaction menu to a player.
     * @param player the player which to show the interaction menu to
     * @param data Interaction menu data
     * @returns 'id' from the item player selected
     */
    new(player, data) {
        this.player = player;
        player.call("client::cef:start", ["interactionMenu"]);
        _api_1.RAGERP.cef.emit(player, "hud", "setInteraction", data);
        return new Promise((resolve) => {
            if (this.player?.id !== player.id)
                return;
            const onAccept = (player, answer) => {
                if (this.player && this.player.id === player.id) {
                    answer = JSON.parse(answer);
                    this.clearPromiseEvents();
                    resolve(parseInt(answer));
                }
            };
            const onReject = (player, _cef) => {
                console.log("rejected");
                if (!this.player || this.player.id !== player.id)
                    return;
                this.closeMenu(player);
                resolve(null);
            };
            this.setPromiseEvents(onAccept, onReject);
        });
    }
    /**
     * Set events which alter on will be triggered depending what player selects in the interaction menu.
     * @param accept
     * @param reject
     */
    setPromiseEvents(accept, reject) {
        this.acceptEvent = new mp.Event("server::hud:interactResult", accept);
        this.refuseEvent = new mp.Event("client::cef:close", reject);
    }
    /**
     *
     */
    clearPromiseEvents() {
        if (this.acceptEvent)
            this.acceptEvent.destroy();
        if (this.refuseEvent)
            this.refuseEvent.destroy();
    }
    /**
     * Close interaction menu for local player.
     * @returns void
     */
    closeMenu(player) {
        if (!mp.players.exists(player))
            return;
        this.clearPromiseEvents();
        player.call("client::cef:close");
    }
}
exports.InteractionMenu = InteractionMenu;


/***/ },

/***/ "./source/server/classes/InteractionProgress.class.ts"
/*!************************************************************!*\
  !*** ./source/server/classes/InteractionProgress.class.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InteractProgressBar = void 0;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
/**
 * Represents a progress bar that appears when a player interacts with an item.
 */
class InteractProgressBar {
    item;
    animDict;
    animName;
    flag;
    attachObject;
    timeout = null;
    /**
     * Creates an instance of InteractProgressBar.
     * @param {PlayerMp} player - The player interacting with the item.
     * @param {string} description - The description of the progress bar.
     * @param {number} time - The duration of the progress bar in seconds.
     * @param {IUsingItemData} data - The data related to the item being used.
     * @param {() => void} onFinish - Callback function to execute when the progress bar finishes.
     */
    constructor(player, description, time, data, onFinish) {
        this.item = data.item;
        this.animDict = data.animDict;
        this.animName = data.animName;
        this.flag = data.flag;
        this.attachObject = data.attachObject;
        this.new(player, description, time, data, onFinish);
    }
    /**
     * Initializes and displays the progress bar for the player.
     * @param {PlayerMp} player - The player interacting with the item.
     * @param {string} description - The description of the progress bar.
     * @param {number} time - The duration of the progress bar in seconds.
     * @param {IUsingItemData} data - The data related to the item being used.
     * @param {() => void} onFinish - Callback function to execute when the progress bar finishes.
     */
    new(player, description, time, data, onFinish) {
        try {
            const buttonData = {
                button: "Esc",
                autoStart: true,
                time: time,
                count: -1,
                image: data.item.image.replace(".svg", ""),
                rarity: 1,
                header: data.item.name,
                description
            };
            _api_1.RAGERP.cef.emit(player, "hud", "showInteractionButton", buttonData);
            player.setOwnVariable("usingItem", true);
            if (data.animDict && data.animName && typeof data.flag !== "undefined") {
                player.playAnimation(data.animDict, data.animName, 2.0, data.flag);
            }
            if (data.attachObject) {
                player.attachObject(data.attachObject, true);
            }
            this.timeout = setTimeout(() => {
                if (!mp.players.exists(player) || !player.character || !player.character.inventory)
                    return;
                if (data.animDict && data.animName) {
                    player.stopAnimation();
                }
                if (data.attachObject) {
                    player.attachObject(data.attachObject, false);
                }
                player.call("client::control:disablePauseMenu", [false]);
                player.setOwnVariable("usingItem", false);
                if (!player.character.inventory.getItemByUUID(data.item.hash)) {
                    return;
                }
                onFinish();
                player.character.inventory.progressBar = null;
            }, time * 1000);
        }
        catch (err) {
            console.error("error at progressbar.new | ", err);
        }
    }
    /**
     * Cancels the progress bar and resets the player's state.
     * @param {PlayerMp} player - The player interacting with the item.
     */
    onCancel(player) {
        if (!mp.players.exists(player) || !player.character || !player.character.inventory)
            return;
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.animDict && this.animName) {
            player.stopAnimation();
        }
        if (this.attachObject) {
            player.attachObject(this.attachObject, false);
        }
        _api_1.RAGERP.cef.emit(player, "hud", "showInteractionButton", null);
        player.setOwnVariable("usingItem", false);
        player.character.inventory.progressBar = null;
    }
}
exports.InteractProgressBar = InteractProgressBar;


/***/ },

/***/ "./source/server/classes/NativeMenu.class.ts"
/*!***************************************************!*\
  !*** ./source/server/classes/NativeMenu.class.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NativeMenu = void 0;
const CEFEvent_class_1 = __webpack_require__(/*! @classes/CEFEvent.class */ "./source/server/classes/CEFEvent.class.ts");
/**
 * Represents a native menu for a player.
 */
class NativeMenu {
    /** The unique identifier for the menu. */
    id;
    /** The header title of the menu. */
    header;
    /** The description of the menu. */
    desc;
    /** The player who owns the menu. */
    player;
    /** The items displayed in the menu. */
    items = [];
    /** The event triggered when an item is selected. */
    onSelectEvent = null;
    /** The event triggered when a checkbox item is changed. */
    onCheckboxEvent = null;
    /** The event triggered when a switch item is toggled. */
    onSwitchEvent = null;
    /**
     * Creates a new NativeMenu instance.
     *
     * @param player - The player who owns the menu.
     * @param id - The unique identifier for the menu.
     * @param header - The header title of the menu.
     * @param desc - The description of the menu.
     * @param items - The items displayed in the menu.
     */
    constructor(player, id, header, desc, items) {
        this.id = id;
        this.header = header;
        this.desc = desc;
        this.items = items;
        this.player = player;
        CEFEvent_class_1.CefEvent.emit(this.player, "nativemenu", "setData", { id: this.id, isActive: true, header: { title: this.header, desc: this.desc }, items: this.items });
        CEFEvent_class_1.CefEvent.startPage(this.player, "nativemenu");
    }
    /**
     * Handles the selection of an item in the menu.
     *
     * @param target - The player who selected the item.
     * @returns A promise that resolves with the selected item's data, or null if the player is not valid.
     */
    onItemSelected(target) {
        return new Promise((res) => {
            if (!this.player || !mp.players.exists(this.player) || this.player.id !== target.id) {
                return;
            }
            this.onSelectEvent = new mp.Event("server::nativemenu:onSelectItem", (player, data) => {
                if (!this.player || this.player.id !== player.id)
                    return;
                res(data);
                this.destroy(player);
            });
        });
    }
    /**
     * Destroys the menu and cleans up associated events.
     *
     * @param player - The player for whom the menu is being destroyed.
     */
    destroy(player) {
        this.onSelectEvent?.destroy();
        this.onCheckboxEvent?.destroy();
        this.onSwitchEvent?.destroy();
        CEFEvent_class_1.CefEvent.emit(player, "nativemenu", "setData", { id: -1, isActive: false, header: { title: "", desc: "" }, items: [] });
        player.call("client::cef:close");
        player.nativemenu = null;
    }
}
exports.NativeMenu = NativeMenu;


/***/ },

/***/ "./source/server/classes/Point.class.ts"
/*!**********************************************!*\
  !*** ./source/server/classes/Point.class.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DynamicPoint = exports.dynamicPointPool = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
exports.dynamicPointPool = [];
class DynamicPoint {
    id;
    position;
    dimension;
    onKeyPress;
    pointShape = null;
    textLabel = null;
    blip = null;
    marker = null;
    /**
     * Creates an instance of DynamicPoint.
     * @param {Vector3} position - The position of the dynamic point.
     * @param {number} range - The range of the point shape.
     * @param {number} dimension - The dimension of the point.
     * @param {IPointHandlers} handlers - The handlers for point events.
     * @param {ILabelData} [label] - Optional label data.
     */
    constructor(position, range, dimension, handlers, label) {
        this.id = (0, uuid_1.v4)();
        this.dimension = dimension || 0;
        this.position = position;
        this.pointShape = mp.colshapes.newSphere(position.x, position.y, position.z, range, this.dimension);
        if (label) {
            this.textLabel = mp.labels.new(label.text, label.position ? label.position : position, {
                ...label.options
            });
        }
        this.pointShape.enterHandler = handlers.enterHandler;
        this.pointShape.exitHandler = handlers.exitHandler;
        this.onKeyPress = handlers.onKeyPress;
        exports.dynamicPointPool.push(this);
    }
    /**
     * Creates a text label.
     * @param {string} text - The text for the label.
     * @param {Vector3} [position] - Optional, if no position is set then the point position will be used.
     * @param {object} [options] - Label options, such as font, color, los, etc.
     * @param {number} [options.font] - The font of the label.
     * @param {RGBA} [options.color] - The color of the label.
     * @param {number} [options.dimension] - The dimension of the label.
     * @param {number} [options.drawDistance] - The draw distance of the label.
     * @param {boolean} [options.los] - Line of sight for the label.
     * @returns {void}
     */
    createLabel(text, position, options) {
        if (this.textLabel && mp.labels.exists(this.textLabel)) {
            this.textLabel.text = text;
            if (position)
                this.textLabel.position = position;
            return;
        }
        this.textLabel = mp.labels.new(text, position ? position : this.position, {
            ...options
        });
    }
    /**
     * Updates the text of the label.
     * @param {string} text - The new text to update the label.
     */
    updateLabel(text) {
        if (this.textLabel && mp.labels.exists(this.textLabel))
            this.textLabel.text = text;
    }
    /**
     * Destroys the label.
     */
    destroyLabel() {
        if (!this.textLabel || !mp.labels.exists(this.textLabel))
            return;
        this.textLabel.destroy();
        this.textLabel = null;
    }
    /**
     * Checks if a dynamic point exists.
     * @param {DynamicPoint} point - The dynamic point to check.
     * @returns {DynamicPoint | undefined} - The found dynamic point or undefined.
     */
    exists(point) {
        return exports.dynamicPointPool.find((x) => x.id === point.id);
    }
    /**
     * Destroys the dynamic point.
     */
    destroy() {
        if (this.pointShape && mp.colshapes.exists(this.pointShape)) {
            this.pointShape.destroy();
            this.pointShape = null;
        }
        if (this.textLabel && mp.labels.exists(this.textLabel)) {
            this.textLabel.destroy();
            this.textLabel = null;
        }
        if (this.marker && mp.markers.exists(this.marker)) {
            this.marker.destroy();
            this.marker = null;
        }
        if (this.blip && mp.blips.exists(this.blip)) {
            this.blip.destroy();
            this.blip = null;
        }
        let point = exports.dynamicPointPool.find((x) => x.id === this.id);
        if (!point)
            return;
        exports.dynamicPointPool.splice(exports.dynamicPointPool.indexOf(point), 1);
    }
    /**
     * Creates a new blip based on the provided data.
     * @param {IBlipData} data - The data used to create the blip.
     */
    createBlip(data) {
        this.blip = mp.blips.new(data.sprite, data.position, data.options);
    }
    /**
     * Destroys the current blip if it exists.
     */
    destroyBlip() {
        if (this.blip && mp.blips.exists(this.blip)) {
            this.blip.destroy();
            this.blip = null;
        }
    }
    /**
     * Creates a new marker based on the provided data.
     * @param {IMarkerData} data - The data used to create the marker.
     */
    createMarker(data) {
        this.marker = mp.markers.new(data.type, data.position, data.scale, data.options);
    }
    /**
     * Destroys the current marker if it exists.
     */
    destroyMarker() {
        if (this.marker && mp.markers.exists(this.marker)) {
            this.marker.destroy();
            this.marker = null;
        }
    }
    /**
     * Gets the nearest dynamic point to a player.
     * @param {PlayerMp} player - The player to check proximity.
     * @returns {DynamicPoint | null} - The nearest dynamic point or null if none found.
     */
    static getNearestPoint(player) {
        let found_point = null;
        for (let i = 0; i < exports.dynamicPointPool.length; i++) {
            let point = exports.dynamicPointPool[i];
            if (!point.pointShape || !mp.colshapes.exists(point.pointShape))
                continue;
            if (player.dimension === point.dimension && point.pointShape.isPointWithin(player.position)) {
                found_point = point;
                break;
            }
        }
        return found_point;
    }
    /**
     * Creates a new dynamic point.
     * @param {Vector3} position - The position of the dynamic point.
     * @param {number} range - The range of the point shape.
     * @param {number} dimension - The dimension of the point.
     * @param {IPointHandlers} handlers - The handlers for point events.
     * @param {ILabelData} [label] - Optional label data.
     * @returns {DynamicPoint} - The created dynamic point.
     */
    static new(position, range, dimension, handlers, label) {
        return new DynamicPoint(position, range, dimension, handlers, label);
    }
}
exports.DynamicPoint = DynamicPoint;


/***/ },

/***/ "./source/server/classes/Vehicle.class.ts"
/*!************************************************!*\
  !*** ./source/server/classes/Vehicle.class.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.vehicleManager = exports.Vehicle = exports.vehiclePool = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Vehicle_assets_1 = __webpack_require__(/*! @assets/Vehicle.assets */ "./source/server/assets/Vehicle.assets.ts");
const Vehicle_entity_1 = __webpack_require__(/*! @entities/Vehicle.entity */ "./source/server/database/entity/Vehicle.entity.ts");
const defaultVehicleData = {
    locked: false,
    engine: false,
    numberplate: "",
    fuel: 50,
    keyhole: (0, uuid_1.v4)(),
    sqlid: null,
    faction: null,
    primaryColor: [255, 255, 255],
    secondaryColor: [255, 255, 255],
    owner: null,
    ownerName: null,
    trunkState: false,
    hoodState: false,
    price: 0,
    inventory: null,
    impoundState: 0
};
const defaultVehicleMods = {
    tunningMods: {},
    plateColor: 0,
    wheelType: -1,
    wheelMod: 0,
    neonColor: null,
    hasNeon: false,
    primaryColorType: 0,
    secondaryColorType: 0,
    smokecolor: { r: 255, g: 255, b: 255 },
    dashboardcolor: 0,
    interiorcolor: 0,
    dirtlevel: 0,
    windows: { 0: false, 1: false, 2: false, 3: false }
};
/** A list of all vehicles. */
const vehiclePool = [];
exports.vehiclePool = vehiclePool;
class Vehicle {
    /** The type of the vehicle. */
    type;
    /** The vehicle object from the game engine. */
    _vehicle;
    /** Data associated with the vehicle. */
    _data = defaultVehicleData;
    /** Modifications applied to the vehicle. */
    _mods = defaultVehicleMods;
    /** Indicates if the vehicle is wanted by the police. */
    isWanted = false;
    /** The type of tyre used by the vehicle. */
    tyre_type;
    /**
     * Creates an instance of Vehicle.
     * @param {RageShared.Vehicles.Enums.VEHICLETYPES} type - The type of the vehicle.
     * @param {string | number} model - The model of the vehicle.
     * @param {Vector3} position - The position where the vehicle spawns.
     * @param {number} heading - The heading (direction) the vehicle faces.
     * @param {number} dimension - The dimension in which the vehicle exists.
     * @param {RageShared.Vehicles.Interfaces.IVehicleData} [data=defaultVehicleData] - The data associated with the vehicle.
     * @param {RageShared.Vehicles.Interfaces.IVehicleMods | null} [mods=null] - The modifications applied to the vehicle.
     */
    constructor(type, model, position, heading, dimension, data = defaultVehicleData, mods = null) {
        this._vehicle = mp.vehicles.new(typeof model === "string" ? mp.joaat(model) : model, position, {
            dimension,
            numberPlate: data.numberplate ?? "",
            locked: data.locked,
            engine: data.engine,
            heading: heading,
            color: [data.primaryColor, data.secondaryColor]
        });
        this.type = type;
        this._data = data;
        this._mods = mods ? mods : defaultVehicleMods;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                this.setData(key, value);
            }
        }
        for (const key in this._mods) {
            if (this._mods.hasOwnProperty(key)) {
                const value = this._mods[key];
                this.setMod(key, value);
            }
        }
        if (this.isValid()) {
            this.createMods();
        }
        vehiclePool.push(this);
    }
    /**
     * Sets a modification on the vehicle.
     * @param {keyof RageShared.Vehicles.Interfaces.IVehicleMods} key - The key of the modification.
     * @param {RageShared.Vehicles.Interfaces.IVehicleMods[keyof RageShared.Vehicles.Interfaces.IVehicleMods]} value - The value of the modification.
     */
    setMod(key, value) {
        this._mods[key] = value;
        if (this._vehicle && mp.vehicles.exists(this._vehicle)) {
            if (key !== "tunningMods") {
                this._vehicle.setVariable(key, value);
            }
            if (key === "windows") {
                mp.players.callInRange(this._vehicle.position, mp.config["stream-distance"], "client::vehicle:setWindowState", [this._vehicle.id, value]);
            }
            if (key === "dirtlevel") {
                mp.players.callInRange(this._vehicle.position, mp.config["stream-distance"], "client::vehicle:setDirtLevel", [this._vehicle.id, value]);
            }
        }
    }
    /**
     * Gets a modification from the vehicle.
     * @param {keyof RageShared.Vehicles.Interfaces.IVehicleMods} key - The key of the modification.
     * @returns {RageShared.Vehicles.Interfaces.IVehicleMods[keyof RageShared.Vehicles.Interfaces.IVehicleMods]} - The value of the modification.
     */
    getMod(key) {
        return this._mods[key];
    }
    /**
     * Gets data from the vehicle.
     * @param {keyof RageShared.Vehicles.Interfaces.IVehicleData} key - The key of the data.
     * @returns {RageShared.Vehicles.Interfaces.IVehicleData[keyof RageShared.Vehicles.Interfaces.IVehicleData]} - The value of the data.
     */
    getData(key) {
        return this._data[key];
    }
    /**
     * Sets data on the vehicle.
     * @param {keyof RageShared.Vehicles.Interfaces.IVehicleData} key - The key of the data.
     * @param {RageShared.Vehicles.Interfaces.IVehicleData[keyof RageShared.Vehicles.Interfaces.IVehicleData]} value - The value of the data.
     */
    setData(key, value) {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return;
        console.log(`[VEHICLEDATA]:: ${this._vehicle.id} setting ${key} to ${value}`);
        this._data[key] = value;
        this._vehicle.setVariable(key, value);
        switch (key) {
            case "engine": {
                this._vehicle.engine = typeof value === "boolean" ? value : false;
                break;
            }
            case "locked": {
                this._vehicle.locked = typeof value === "boolean" ? value : false;
                break;
            }
            case "hoodState": {
                mp.players.callInRange(this._vehicle.position, mp.config["stream-distance"], "client::vehicle:setHoodState", [this._vehicle.id, value]);
                break;
            }
            case "trunkState": {
                mp.players.callInRange(this._vehicle.position, mp.config["stream-distance"], "client::vehicle:setTrunkState", [this._vehicle.id, value]);
                break;
            }
            case "primaryColor": {
                this._vehicle.setColorRGB(...this.getData("primaryColor"), ...this._vehicle.getColorRGB(1));
                break;
            }
            case "secondaryColor": {
                this._vehicle.setColorRGB(...this._vehicle.getColorRGB(0), ...this.getData("secondaryColor"));
                break;
            }
            case "numberplate": {
                this._vehicle.numberPlate = value;
                break;
            }
            default: {
                break;
            }
        }
    }
    /**
     * Gets the model of the vehicle.
     * @returns {number} - The model of the vehicle.
     */
    getId() {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return null;
        return this._vehicle.id;
    }
    /**
     * Gets the model of the vehicle.
     * @returns {number} - The model of the vehicle.
     */
    getModel() {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return 0;
        return this._vehicle.model;
    }
    /**
     * Gets the type of the vehicle.
     * @returns {RageShared.Vehicles.Enums.VEHICLETYPES} - The type of the vehicle.
     */
    getType() {
        return this.type;
    }
    /**
     * Gets the model name of the vehicle.
     * @param {PlayerMp} player - The player requesting the model name.
     * @returns {Promise<string | null>} - The model name of the vehicle.
     */
    async getModelName(player) {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return null;
        let result = await player.callProc("client::proc:getVehicleModelName", [this._vehicle.id]);
        return result;
    }
    /**
     * Gets the passengers of the vehicle.
     * @param {number} vehicleModelHash - The model hash requesting data.
     * @returns {number} - The number of passengers the vehicle can hold.
     */
    getPassengers(vehicleModelHash) {
        const vehicleData = Vehicle_assets_1.vehicleModelSeats.find((x) => x.vehicleHash === vehicleModelHash);
        return vehicleData?.seats ?? 0;
    }
    /**
     * Gets the faction of the vehicle.
     * @returns {string | null} - The faction of the vehicle.
     */
    getFaction() {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return null;
        if (this.type !== 2 /* RageShared.Vehicles.Enums.VEHICLETYPES.FACTION */)
            return null;
        return this._data.faction;
    }
    /**
     * Gets the owner name of vehicle.
     * @returns {string | null} - The owner of the vehicle.
     */
    getOwner() {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return null;
        if (this.type !== 1 /* RageShared.Vehicles.Enums.VEHICLETYPES.OWNED */)
            return null;
        return this._data.ownerName;
    }
    /**
     * Gets the SQL ID of the vehicle.
     * @returns {number | null} - The SQL ID of the vehicle.
     */
    getSQL() {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return null;
        return this._data.sqlid;
    }
    /**
     * Checks if the vehicle is valid.
     * @returns {boolean} - Whether the vehicle is valid.
     */
    isValid() {
        return ![
            5 /* RageShared.Vehicles.Enums.VEHICLETYPES.ADMIN */,
            3 /* RageShared.Vehicles.Enums.VEHICLETYPES.RENTAL */,
            4 /* RageShared.Vehicles.Enums.VEHICLETYPES.JOB */,
            0 /* RageShared.Vehicles.Enums.VEHICLETYPES.NONE */
        ].includes(this.type);
    }
    /**
     * Destroys the vehicle.
     */
    destroy() {
        if (this._vehicle && mp.vehicles.exists(this._vehicle)) {
            this._vehicle.destroy();
        }
        const findIndex = vehiclePool.indexOf(this);
        if (findIndex !== -1) {
            vehiclePool.splice(findIndex, 1);
        }
    }
    /**
     * Sets the modification color of the vehicle.
     */
    setModColor() {
        if (!this._vehicle || !mp.vehicles.exists(this._vehicle))
            return;
        mp.players.forEachInRange(this._vehicle.position, mp.config["stream-distance"], (entity) => {
            if (entity && mp.players.exists(entity) && entity.getVariable("loggedin")) {
                entity.call("client::vehicle:setModColor", [this._vehicle.id]);
            }
        });
    }
    /**
     * Applies vehicle modifications.
     */
    createMods() {
        try {
            if (!mp.vehicles.exists(this._vehicle))
                return;
            this._vehicle.neonEnabled = false;
            this._vehicle.windowTint = 0;
            for (let i = 0; i < 80; i++)
                this._vehicle.setMod(i, -1);
            if (this._mods.plateColor !== null && typeof this._mods.plateColor === "number") {
                this._vehicle.numberPlateType = this._mods.plateColor;
            }
            if (this._mods.wheelType !== null && typeof this._mods.wheelType === "number") {
                this._vehicle.wheelType = this._mods.wheelType;
            }
            if (this._mods.hasNeon && this._mods.neonColor) {
                this._vehicle.setNeonColor(...this._mods.neonColor);
            }
            if (this._data.primaryColor) {
                let [oldr, oldg, oldb] = this._vehicle.getColorRGB(1);
                this._vehicle.setColorRGB(this._data.primaryColor[0], this._data.primaryColor[1], this._data.primaryColor[2], oldr, oldg, oldb);
            }
            if (this._data.secondaryColor) {
                let [oldr, oldg, oldb] = this._vehicle.getColorRGB(0);
                this._vehicle.setColorRGB(oldr, oldg, oldb, this._data.secondaryColor[0], this._data.secondaryColor[1], this._data.secondaryColor[2]);
            }
            this.setModColor();
            if (this._mods.tunningMods) {
                let vehiclemods = this._mods.tunningMods;
                for (let tune in vehiclemods) {
                    const modIndex = parseInt(tune);
                    if (isNaN(modIndex))
                        continue;
                    if (modIndex >= 100)
                        continue;
                    if (modIndex === 18)
                        this._vehicle.setVariable("boost", 1.3);
                    if (modIndex === 55 /* RageShared.Vehicles.Enums.VEHICLEMODS.WINDOW_TINT */) {
                        this._vehicle.windowTint = vehiclemods[modIndex];
                    }
                    else
                        this._vehicle.setMod(parseInt(tune), vehiclemods[modIndex]);
                }
            }
        }
        catch (err) {
            console.log("createMods err: ", err);
        }
    }
    /**
     * Reloads the modifications on the vehicle.
     */
    reloadMods() {
        this.createMods();
    }
    /**
     * Gets an item slot component by its hash key.
     * @param {string} hashKey - The hash key of the item.
     * @returns {{ slot: number; item: any } | null} - The item slot component.
     */
    getItemSlotComponentByHash(hashKey) {
        const inventory = this.getData("inventory");
        if (!inventory)
            return null;
        let foundItem = null;
        for (const [key, value] of Object.entries(inventory)) {
            if (!value.hash)
                continue;
            if (value.hash === hashKey) {
                foundItem = { slot: parseInt(key), item: value };
                break;
            }
        }
        return foundItem;
    }
    /**
     * Inserts a vehicle into the database.
     * @param {VehicleMp} vehicle - The vehicle to insert.
     * @param {string} modelName - The model name of the vehicle.
     * @param {number} price - The price of the vehicle.
     */
    async insertVehicle(vehicle, modelName, price) {
        const serverVehicle = vehicleManager.at(vehicle.id);
        if (!serverVehicle)
            return;
        let vehicleEntity = new Vehicle_entity_1.VehicleEntity();
        vehicleEntity.modelname = modelName;
        vehicleEntity.class = Vehicle_assets_1.vehicleClasses.find((x) => x.vehicleHash === vehicle.model)?.vehicleClass ?? 0;
        vehicleEntity.fuel = serverVehicle.getData("fuel");
        vehicleEntity.price = price;
        vehicleEntity.primaryColor = vehicle.getColorRGB(0);
        vehicleEntity.secondaryColor = vehicle.getColorRGB(1);
        vehicleEntity.owner_id = serverVehicle.getData("owner");
        vehicleEntity.owner_name = serverVehicle.getData("ownerName");
        vehicleEntity.model = vehicle.model;
        vehicleEntity.plate = vehicle.numberPlate;
        vehicleEntity.is_locked = vehicle.locked ? 1 : 0;
        vehicleEntity.dimension = vehicle.dimension;
        vehicleEntity.isWanted = serverVehicle.isWanted ? 1 : 0;
        vehicleEntity.position = { x: vehicle.position.x, y: vehicle.position.y, z: vehicle.position.z, a: vehicle.heading };
        vehicleEntity.keyhole = serverVehicle.getData("keyhole");
        vehicleEntity.modifications = { 18: -1 };
        await _api_1.RAGERP.database.getRepository(Vehicle_entity_1.VehicleEntity).save(vehicleEntity);
    }
    /**
     * Checks if a vehicle class is a windowed vehicle.
     * @param {number} vehicleClass - The class of the vehicle.
     * @returns {boolean} - Whether the vehicle class is windowed.
     */
    isWindowedVehicle(vehicleClass) {
        return ![
            14 /* RageShared.Vehicles.Enums.VEHICLE_CLASS.BOATS */,
            13 /* RageShared.Vehicles.Enums.VEHICLE_CLASS.CYCLES */,
            11 /* RageShared.Vehicles.Enums.VEHICLE_CLASS.UTILITY */,
            8 /* RageShared.Vehicles.Enums.VEHICLE_CLASS.MOTORCYCLES */,
            22 /* RageShared.Vehicles.Enums.VEHICLE_CLASS.OPEN_WHEEL */
        ].includes(vehicleClass);
    }
}
exports.Vehicle = Vehicle;
const vehicleManager = {
    /**
     * Saves the vehicle to the database.
     * @param {VehicleMp} vehicle - The vehicle to save.
     */
    async saveVehicle(vehicle) {
        const serverVehicle = vehicleManager.at(vehicle.id);
        if (!serverVehicle || !serverVehicle.isValid() || !serverVehicle._vehicle || !mp.vehicles.exists(serverVehicle._vehicle))
            return;
        const vehicleSQL = serverVehicle.getData("sqlid");
        if (vehicleSQL === null)
            return;
        await _api_1.RAGERP.database.getRepository(Vehicle_entity_1.VehicleEntity).update({ id: vehicleSQL }, {
            owner_id: serverVehicle.getData("owner"),
            owner_name: serverVehicle.getData("ownerName"),
            model: serverVehicle._vehicle.model,
            fuel: serverVehicle.getData("fuel"),
            plate: serverVehicle.getData("numberplate"),
            neon: serverVehicle._mods.hasNeon ? 1 : 0,
            neonColor: serverVehicle._mods.neonColor ? serverVehicle._mods.neonColor : [255, 255, 255],
            primaryColor: serverVehicle.getData("primaryColor"),
            secondaryColor: serverVehicle.getData("secondaryColor"),
            plate_color: serverVehicle._mods.plateColor ?? 0,
            is_locked: serverVehicle.getData("locked") ? 1 : 0,
            dimension: vehicle.dimension,
            isWanted: serverVehicle.isWanted ? 1 : 0,
            position: { x: vehicle.position.x, y: vehicle.position.y, z: vehicle.position.z, a: vehicle.heading },
            wheelmods: {
                color: 0,
                mod: serverVehicle._mods.wheelMod,
                type: serverVehicle._mods.wheelType
            },
            modifications: serverVehicle.getMod("tunningMods"),
            primaryColorType: serverVehicle.getMod("primaryColorType"),
            secondaryColorType: serverVehicle.getMod("secondaryColorType"),
            keyhole: serverVehicle.getData("keyhole"),
            impoundState: serverVehicle.getData("impoundState")
        });
    },
    /**
     * Finds a vehicle by ragemp vehicle api ID.
     * @param {number} id - The ID of the vehicle.
     * @returns {Vehicle | null} - The found vehicle or null.
     */
    at(id) {
        let foundvehicle = null;
        for (const vehicle of vehiclePool) {
            if (vehicle._vehicle && mp.vehicles.exists(vehicle._vehicle) && vehicle._vehicle.id === id) {
                foundvehicle = vehicle;
                break;
            }
        }
        return foundvehicle;
    },
    /**
     * Finds a vehicle by its SQL ID.
     * @param {number} id - The SQL ID of the vehicle.
     * @returns {Vehicle | null} - The found vehicle or null.
     */
    atSQL(id) {
        let foundvehicle = null;
        for (const vehicle of vehiclePool) {
            if (vehicle._vehicle && mp.vehicles.exists(vehicle._vehicle) && vehicle.getData("sqlid") === id) {
                foundvehicle = vehicle;
                break;
            }
        }
        return foundvehicle;
    },
    /**
     * Checks if a vehicle is in the world.
     * @param {number} id - The ID of the vehicle.
     * @param {boolean} [isOwned=false] - Whether the vehicle is owned.
     * @returns {VehicleMp | null} - The found vehicle or null.
     */
    isInWorld(id, isOwned = false) {
        const vehicle = vehicleManager.atSQL(id);
        if (vehicle && vehicle._vehicle)
            return vehicle._vehicle;
        return null;
    },
    /**
     * Gets the nearest vehicle to a player within a certain radius.
     * @param {PlayerMp} player - The player to find the nearest vehicle to.
     * @param {number} radius - The radius to search within.
     * @returns {Vehicle | null} - The nearest vehicle or null.
     */
    getNearest(player, radius) {
        for (const vehicle of vehiclePool) {
            if (vehicle && vehicle._vehicle && mp.vehicles.exists(vehicle._vehicle)) {
                if (_api_1.RAGERP.utils.distanceToPos(player.position, vehicle._vehicle.position) > radius)
                    continue;
                return vehicle;
            }
        }
        return null;
    }
};
exports.vehicleManager = vehicleManager;


/***/ },

/***/ "./source/server/classes/WorldManager.class.ts"
/*!*****************************************************!*\
  !*** ./source/server/classes/WorldManager.class.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldManager = void 0;
class _WorldManager {
    dateNow = new Date();
    secondTimerInterval;
    minuteTimerInterval;
    hourTimerInterval;
    constructor() {
        // this.secondTimerInterval = setInterval(this.secondTimer.bind(this), 1_000);
        // this.minuteTimerInterval = setInterval(this.secondTimer.bind(this), 60 * 1000);
        // this.hourTimerInterval = setInterval(this.secondTimer.bind(this), 1_000);
    }
    secondTimer() {
        const date = this.dateNow;
        const [hours, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
        mp.world.time.set(hours, minute, second);
    }
    minuteTimer() { }
    hourTimer() { }
}
exports.WorldManager = new _WorldManager();


/***/ },

/***/ "./source/server/commands/Admin.commands.ts"
/*!**************************************************!*\
  !*** ./source/server/commands/Admin.commands.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Account_entity_1 = __webpack_require__(/*! @entities/Account.entity */ "./source/server/database/entity/Account.entity.ts");
const Ban_entity_1 = __webpack_require__(/*! @entities/Ban.entity */ "./source/server/database/entity/Ban.entity.ts");
const Items_module_1 = __webpack_require__(/*! @modules/inventory/Items.module */ "./source/server/modules/inventory/Items.module.ts");
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const Admin_asset_1 = __webpack_require__(/*! @assets/Admin.asset */ "./source/server/assets/Admin.asset.ts");
const NativeMenu_class_1 = __webpack_require__(/*! @classes/NativeMenu.class */ "./source/server/classes/NativeMenu.class.ts");
_api_1.RAGERP.commands.add({
    name: "goto",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player, fulltext, targetorpos) => {
        const showAvailableLocations = () => {
            _api_1.RAGERP.chat.sendSyntaxError(player, "/goto [player/location]");
            const keys = Object.keys(Admin_asset_1.adminTeleports);
            for (let i = 0; i < keys.length; i += 8) {
                const chunk = keys.slice(i, i + 8);
                player.outputChatBox(`${"!{#ffd200}" /* RageShared.Enums.STRINGCOLORS.YELLOW */}Available locations: ${"!{#afafaf}" /* RageShared.Enums.STRINGCOLORS.GREY */} ${chunk.join(", ")}`);
            }
        };
        if (!fulltext.length || !targetorpos.length) {
            showAvailableLocations();
            return;
        }
        const targetplayer = mp.players.getPlayerByName(targetorpos);
        if (targetplayer && mp.players.exists(targetplayer)) {
            player.position = targetplayer.position;
            player.dimension = targetplayer.dimension;
            player.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `You teleported to ${targetplayer.name}`);
        }
        else {
            const targetpos = Admin_asset_1.adminTeleports[targetorpos];
            if (targetpos) {
                player.position = targetpos;
                player.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `You teleported to ${targetorpos}`);
            }
            else {
                showAvailableLocations();
            }
        }
    }
});
_api_1.RAGERP.commands.add({
    name: "gethere",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player, fulltext, target) => {
        if (!fulltext.length || !target.length) {
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/gethere [player]");
        }
        const targetplayer = mp.players.getPlayerByName(target);
        if (!targetplayer || !mp.players.exists(targetplayer) || !targetplayer.character) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        }
        if (targetplayer.vehicle) {
            targetplayer.vehicle.position = player.position;
            targetplayer.vehicle.dimension = player.dimension;
        }
        targetplayer.position = player.position;
        targetplayer.dimension = player.dimension;
        targetplayer.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `Admin ${player.name} has teleported you to their position.`);
        player.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `You teleported ${targetplayer.name} to your position.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "ah",
    aliases: ["adminhelp", "admincmds", "acmds"],
    adminlevel: 1,
    run: (player) => {
        const adminCommandsByLevel = {};
        const adminLevels = {
            1: "!{#14AA0B}LEVEL 1",
            2: "!{#14AA0B}LEVEL 2",
            3: "!{#14AA0B}LEVEL 3",
            4: "!{#0C66D8}LEVEL 4",
            5: "!{#0C66D8}LEVEL 5",
            6: "!{#fa0339}LEVEL 6"
        };
        _api_1.RAGERP.commands
            .getallCommands()
            .filter((cmd) => {
            return player.account && typeof cmd.adminlevel === "number" && cmd.adminlevel > 0 && cmd.adminlevel <= player.account.adminlevel;
        })
            .forEach((cmd) => {
            if (!cmd.adminlevel)
                return;
            if (!adminCommandsByLevel[cmd.adminlevel]) {
                adminCommandsByLevel[cmd.adminlevel] = [];
            }
            adminCommandsByLevel[cmd.adminlevel].push(`/${cmd.name}`);
        });
        player.outputChatBox("!{red}____________[ADMIN COMMANDS]____________");
        for (const level in adminCommandsByLevel) {
            if (adminCommandsByLevel.hasOwnProperty(level)) {
                const commands = adminCommandsByLevel[level];
                const itemsPerLog = 5;
                for (let i = 0; i < commands.length; i += itemsPerLog) {
                    const endIndex = Math.min(i + itemsPerLog, commands.length);
                    const currentItems = commands.slice(i, endIndex);
                    player.outputChatBox(`${adminLevels[level]}!{white}: ${currentItems.join(", ")}`);
                }
            }
        }
    }
});
_api_1.RAGERP.commands.add({
    name: "a",
    aliases: ["adminchat"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player, fulltext) => {
        if (!fulltext.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/a [text]");
        const admins = mp.players.toArray().filter((x) => x.account && x.account.adminlevel > 0);
        admins.forEach((admin) => {
            admin.outputChatBox(`!{#ffff00}[A] ${player.name}: ${fulltext}`);
        });
    }
});
_api_1.RAGERP.commands.add({
    name: "admins",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player) => {
        player.outputChatBox(`${"!{#32cd32}" /* RageShared.Enums.STRINGCOLORS.GREEN */}____________[ONLINE ADMINS]____________`);
        mp.players.forEach((target) => {
            if (target && target.account && target.account.adminlevel) {
                player.outputChatBox(`${target.name} as level ${target.account.adminlevel} admin.`);
            }
        });
    }
});
_api_1.RAGERP.commands.add({
    name: "veh",
    aliases: ["vehicle", "spawnveh", "spawncar"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player, fullText, vehicleModel) => {
        if (!fullText.length || !vehicleModel.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/veh [vehiclemodel]");
        const vehicle = new _api_1.RAGERP.entities.vehicles.new(5 /* RageShared.Vehicles.Enums.VEHICLETYPES.ADMIN */, vehicleModel, player.position, player.heading, player.dimension);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Successfully spawned ${vehicleModel} (${vehicle.getId()})`);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} (${player.id}) has spawned a vehicle (Model: ${vehicleModel} | ID: ${vehicle.getId()}).`);
    }
});
_api_1.RAGERP.commands.add({
    name: "dim",
    aliases: ["setdimension", "setdim"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player, fullText, target, dimension) => {
        if (!fullText.length || !target.length || !dimension.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");
        const parseTarget = parseInt(target);
        if (isNaN(parseTarget))
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");
        const parseDimension = parseInt(dimension);
        if (isNaN(parseDimension))
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");
        const targetPlayer = mp.players.at(parseTarget);
        if (!targetPlayer || !mp.players.exists(targetPlayer))
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/setdimension [target] [dimension]");
        targetPlayer.dimension = parseDimension;
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You've successfully changed ${targetPlayer.name} dimension to ${parseDimension}`);
        targetPlayer.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `Administrator ${player.name} changed your dimension to ${parseDimension}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "makeadmin",
    aliases: ["setadmin"],
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    description: "Make a player admin",
    run: async (player, fullText, target, level) => {
        if (!fullText.length || !target.length || !level.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/makeadmin [target] [level]");
        const targetId = parseInt(target);
        const adminLevel = parseInt(level);
        if (adminLevel < 0 || adminLevel > 6)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Admin level must be between 0 and 6");
        const targetPlayer = mp.players.at(targetId);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.account)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        targetPlayer.account.adminlevel = adminLevel;
        targetPlayer.setVariable("adminLevel", adminLevel);
        await _api_1.RAGERP.database.getRepository(Account_entity_1.AccountEntity).update(targetPlayer.account.id, { adminlevel: adminLevel });
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You've successfully made ${targetPlayer.name} an admin level ${adminLevel}`);
        targetPlayer.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `${player.name} has made you an admin level ${adminLevel}`);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, adminLevel > 0
            ? `AdmWarn: ${player.name} (${player.id}) has made ${targetPlayer.name} (${targetPlayer.id}) a level ${adminLevel} admin.`
            : `AdmWarn: ${player.name} (${player.id}) has removed ${targetPlayer.name} admin level.`);
        _api_1.RAGERP.commands.reloadCommands(targetPlayer);
    }
});
_api_1.RAGERP.commands.add({
    name: "spectate",
    aliases: ["spec"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Spectate a player",
    run: (player, fullText, target) => {
        if (fullText.length === 0)
            return player.outputChatBox("Usage: /spectate [target/off]");
        const parsedTarget = parseInt(target);
        if (isNaN(parsedTarget) && target === "off") {
            player.call("client::spectate:stop");
            player.setVariable("isSpectating", false);
            if (player.lastPosition)
                player.position = player.lastPosition;
            return;
        }
        const targetPlayer = mp.players.at(parsedTarget);
        if (!targetPlayer || !mp.players.exists(targetPlayer))
            return;
        if (targetPlayer.id === player.id)
            return player.outputChatBox("You can't spectate yourself.");
        if (!player || !mp.players.exists(player))
            return;
        if (player.getVariable("isSpectating")) {
            player.call("client::spectate:stop");
            if (player.lastPosition)
                player.position = player.lastPosition;
        }
        else {
            player.lastPosition = player.position;
            player.position = new mp.Vector3(targetPlayer.position.x, targetPlayer.position.y, targetPlayer.position.z - 15);
            if (!player || !mp.players.exists(player) || !targetPlayer || !mp.players.exists(targetPlayer))
                return;
            player.call("client::spectate:start", [target]);
        }
        player.setVariable("isSpectating", !player.getVariable("isSpectating"));
    }
});
_api_1.RAGERP.commands.add({
    name: "destroyveh",
    aliases: ["destroyvehicles", "destroycar", "destroycars"],
    description: "Destroy admin spawned vehicles",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    run: (player) => {
        if (player.vehicle) {
            const vehicleData = _api_1.RAGERP.entities.vehicles.manager.at(player.vehicle.id);
            if (!vehicleData)
                return;
            vehicleData.destroy();
            return;
        }
        const adminVehicles = _api_1.RAGERP.entities.vehicles.pool.filter((x) => x.type === 5 /* RageShared.Vehicles.Enums.VEHICLETYPES.ADMIN */);
        adminVehicles.forEach((vehicle) => vehicle.destroy());
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You've successfully deleted all admin spawned vehicles.`);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} (${player.id}) has destroyed all admin spawned vehicles.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "revive",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Revive a player",
    run: async (player, fulltext, target) => {
        if (!fulltext.length || !target.length)
            return player.outputChatBox("Usage: /revive [targetplayer]");
        const parseTarget = parseInt(target);
        if (isNaN(parseTarget))
            return player.outputChatBox("Usage: /revive [targetplayer]");
        const targetPlayer = mp.players.getPlayerByName(target);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.character)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        if (targetPlayer.character.deathState !== 1 /* RageShared.Players.Enums.DEATH_STATES.STATE_INJURED */)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "That player is not injured.");
        targetPlayer.spawn(targetPlayer.position);
        targetPlayer.character.deathState = 0 /* RageShared.Players.Enums.DEATH_STATES.STATE_NONE */;
        targetPlayer.character.setStoreData(player, "isDead", false);
        targetPlayer.setVariable("isDead", false);
        targetPlayer.stopScreenEffect("DeathFailMPIn");
        targetPlayer.stopAnimation();
        await targetPlayer.character.save(targetPlayer);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You successfully revived ${targetPlayer.name}`);
        targetPlayer.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You were revived by admin ${player.name}`);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} (${player.id}) has revived player ${targetPlayer.name} (${targetPlayer.id}).`);
    }
});
_api_1.RAGERP.commands.add({
    name: "givemoney",
    aliases: ["givecash"],
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, target, amount) => {
        if (!fulltext.length || !target.length || !amount.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/givemoney [player] [amount]");
        const targetPlayer = mp.players.getPlayerByName(target);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.character)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        const money = parseInt(amount);
        if (isNaN(money) || money > 50000000)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid amount of money specified.");
        targetPlayer.giveMoney(money);
        targetPlayer.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, `You received ${money} cash from admin ${player.name}`);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} (${player.id}) has given ${targetPlayer.name} (${targetPlayer.id}) $${money}.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "giveclothes",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, target, item, comp, drawable, texture) => {
        if (!fulltext.length || !target.length || !item.length || !comp.length || !drawable.length || !texture.length) {
            player.outputChatBox(`Usage: /giveclothes [player] [cloth_name] [component] [drawable] [texture]`);
            player.outputChatBox(`Clothing Names: ${Object.values(Items_module_1.inventoryAssets.items)
                .filter((x) => x.typeCategory === 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */)
                .map((e) => e.type.toLowerCase())
                .join(", ")}`);
            return;
        }
        const targetplayer = mp.players.getPlayerByName(target);
        if (!targetplayer || !mp.players.exists(targetplayer) || !targetplayer.character || !targetplayer.character.inventory)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        const itemData = targetplayer.character.inventory.addClothingItem(item, { component: parseInt(comp), drawable: parseInt(drawable), texture: parseInt(texture) });
        targetplayer.showNotify(itemData ? "success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */ : "error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, itemData ? `You received a ${itemData.name}` : `An error occurred giving u the item.`);
        player.showNotify(itemData ? "success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */ : "error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, itemData ? `You gave a ${itemData.name} to ${targetplayer.name} (${targetplayer.id})` : `An error occurred giving the item to ${targetplayer.name}.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "giveitem",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, target, item, count) => {
        if (!fulltext.length || !target.length || !item.length)
            return player.outputChatBox("Usage: /giveitem [player] [item type] [count]");
        const targetplayer = mp.players.getPlayerByName(target);
        if (!targetplayer || !mp.players.exists(targetplayer) || !targetplayer.character || !targetplayer.character.inventory) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        }
        const itemData = targetplayer.character.inventory.addItem(item);
        if (itemData) {
            itemData.count = isNaN(parseInt(count)) ? 0 : parseInt(count);
            if (!itemData.options.includes("split") && itemData.count > 1)
                itemData.options.push("split");
        }
        targetplayer.showNotify(itemData ? "success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */ : "error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, itemData ? `You received a ${itemData.name} (x${itemData.count}) from admin ${player.name}` : `An error occurred giving u the item.`);
        player.showNotify(itemData ? "success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */ : "error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, itemData ? `You spawned a ${itemData.name} (x${itemData.count}) to ${targetplayer.name} (${targetplayer.id})` : `An error occurred giving the item.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "spawnitem",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: async (player) => {
        const filteredItems = Object.values(Items_module_1.inventoryAssets.items).filter(item => item.typeCategory !== 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */ &&
            item.typeCategory !== 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */);
        const menuItems = filteredItems.map((item, index) => ({
            uid: index,
            type: 0 /* RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT */,
            name: item.name,
        }));
        player.nativemenu = new NativeMenu_class_1.NativeMenu(player, 1, "Item Spawn", "Select an item to spawn", menuItems);
        try {
            const selectedData = await player.nativemenu.onItemSelected(player);
            if (!selectedData) {
                player.nativemenu?.destroy(player);
                return;
            }
            const selectedItemData = _api_1.RAGERP.utils.parseObject(selectedData);
            const selectedItem = filteredItems.find(item => item.name === selectedItemData.name);
            if (!selectedItem) {
                player.nativemenu?.destroy(player);
                return;
            }
            player.character?.inventory?.addItem(selectedItem.type);
            player.nativemenu?.destroy(player);
            _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `${player.name} has spawned a ${selectedItemData.name}`);
        }
        catch (error) {
            console.error("Error handling menu selection:", error);
            player.nativemenu?.destroy(player);
        }
    }
});
_api_1.RAGERP.commands.add({
    name: "listplayers",
    aliases: ["players", "online"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "List all online players",
    run: (player) => {
        player.outputChatBox(`${"!{#32cd32}" /* RageShared.Enums.STRINGCOLORS.GREEN */}____________[ONLINE PLAYERS]____________`);
        mp.players.forEach((p) => {
            if (p && mp.players.exists(p)) {
                const charName = p.character?.name ?? "N/A";
                player.outputChatBox(`ID ${p.id} | ${p.name} | ${charName} | Ping: ${p.ping} | Dim: ${p.dimension}`);
            }
        });
        player.outputChatBox(`${"!{#32cd32}" /* RageShared.Enums.STRINGCOLORS.GREEN */}Total: ${mp.players.length} players`);
    }
});
_api_1.RAGERP.commands.add({
    name: "kick",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Kick a player",
    run: (player, fulltext, target, ...reasonParts) => {
        if (!target)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/kick [player_id] [reason]");
        const targetId = parseInt(target);
        if (isNaN(targetId))
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/kick [player_id] [reason]");
        const targetPlayer = mp.players.at(targetId);
        if (!targetPlayer || !mp.players.exists(targetPlayer))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player.");
        const reason = reasonParts.join(" ") || "No reason specified";
        targetPlayer.outputChatBox(`!{#ff0000}You have been kicked by ${player.name}: ${reason}`);
        setTimeout(() => {
            if (mp.players.exists(targetPlayer))
                targetPlayer.kick(reason);
        }, 500);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} kicked ${targetPlayer.name} (${targetPlayer.id}). Reason: ${reason}`);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Kicked ${targetPlayer.name}.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "ban",
    adminlevel: 2 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_TWO */,
    description: "Ban a player",
    run: async (player, fulltext, target, ...reasonParts) => {
        if (!target)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/ban [player_id] [reason] [duration_hours optional]");
        const targetId = parseInt(target);
        if (isNaN(targetId))
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/ban [player_id] [reason]");
        const targetPlayer = mp.players.at(targetId);
        if (!targetPlayer || !mp.players.exists(targetPlayer) || !targetPlayer.account) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player.");
        }
        const reason = reasonParts.join(" ") || "No reason specified";
        const ban = new Ban_entity_1.BanEntity();
        ban.username = targetPlayer.account.username;
        ban.ip = targetPlayer.ip;
        ban.serial = targetPlayer.serial ?? null;
        ban.rsgId = targetPlayer.socialClub ?? null;
        ban.reason = reason;
        ban.bannedBy = player.name;
        ban.bannedByLevel = player.account?.adminlevel ?? 0;
        ban.lifttime = null;
        await _api_1.RAGERP.database.getRepository(Ban_entity_1.BanEntity).save(ban);
        targetPlayer.outputChatBox(`!{#ff0000}You have been banned by ${player.name}: ${reason}`);
        setTimeout(() => {
            if (mp.players.exists(targetPlayer))
                targetPlayer.kick(`Banned: ${reason}`);
        }, 500);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} banned ${targetPlayer.name}. Reason: ${reason}`);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Banned ${targetPlayer.name}.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "unban",
    adminlevel: 2 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_TWO */,
    description: "Unban a player by username",
    run: async (player, fulltext, identifier) => {
        if (!identifier)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/unban [username]");
        const ban = await _api_1.RAGERP.database.getRepository(Ban_entity_1.BanEntity).findOne({ where: { username: identifier } });
        if (!ban)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `No ban found for "${identifier}".`);
        await _api_1.RAGERP.database.getRepository(Ban_entity_1.BanEntity).remove(ban);
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} unbanned ${identifier}.`);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Unbanned ${identifier}.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "vanish",
    aliases: ["invisible"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Toggle invisibility",
    run: (player) => {
        const isVanished = player.getVariable("vanished") ?? false;
        player.setVariable("vanished", !isVanished);
        if (!isVanished) {
            player.alpha = 0;
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Vanish ON — you are invisible.");
        }
        else {
            player.alpha = 255;
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Vanish OFF — you are visible.");
        }
        _api_1.RAGERP.chat.sendAdminWarning(4284696575 /* RageShared.Enums.HEXCOLORS.LIGHTRED */, `AdmWarn: ${player.name} toggled vanish ${!isVanished ? "ON" : "OFF"}.`);
    }
});
_api_1.RAGERP.commands.add({
    name: "bird",
    aliases: ["freecam"],
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Toggle bird's-eye freecam (uses noclip)",
    run: (player) => {
        const isNoclip = player.getVariable("noclip") ?? false;
        if (isNoclip) {
            player.setVariable("noclip", false);
            player.call("client::noclip:stop");
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Bird mode OFF.");
        }
        else {
            player.setVariable("noclip", true);
            player.alpha = 0;
            player.setVariable("adminLevel", player.account?.adminlevel ?? 1);
            mp.players.forEach((p) => {
                if (p.id !== player.id && mp.players.exists(p)) {
                    p.call("client::player:noclip", [player.id, true]);
                }
            });
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Bird mode ON. Press F5 or use /birdoff to exit.");
        }
    }
});
_api_1.RAGERP.commands.add({
    name: "birdoff",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Disable bird mode",
    run: (player) => {
        player.setVariable("noclip", false);
        player.call("client::noclip:stop");
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Bird mode OFF.");
    }
});
_api_1.RAGERP.commands.add({
    name: "specoff",
    adminlevel: 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */,
    description: "Stop spectating",
    run: (player) => {
        player.call("client::spectate:stop");
        player.setVariable("isSpectating", false);
        if (player.lastPosition)
            player.position = player.lastPosition;
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Stopped spectating.");
    }
});


/***/ },

/***/ "./source/server/commands/ArenaDev.commands.ts"
/*!*****************************************************!*\
  !*** ./source/server/commands/ArenaDev.commands.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const ArenaPresets_asset_1 = __webpack_require__(/*! @arena/ArenaPresets.asset */ "./source/server/arena/ArenaPresets.asset.ts");
const Arena_module_1 = __webpack_require__(/*! @arena/Arena.module */ "./source/server/arena/Arena.module.ts");
let attachEditorEditing = false;
const ATTACHMENTS_FILE = path.join(process.cwd(), "attachments.txt");
const arenaMarkedPresets = new Map();
const ADMIN_DEV = 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */;
_api_1.RAGERP.commands.add({
    name: "pos",
    description: "Print current position (x, y, z, heading, dimension)",
    adminlevel: ADMIN_DEV,
    run: (player) => {
        const { x, y, z } = player.position;
        const heading = player.heading;
        const dim = player.dimension;
        player.outputChatBox(`Position: x=${x.toFixed(2)} y=${y.toFixed(2)} z=${z.toFixed(2)} heading=${heading.toFixed(2)} dimension=${dim}`);
        console.log(`[POS] ${player.name}: x=${x} y=${y} z=${z} heading=${heading} dimension=${dim}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "tp",
    description: "Teleport to x y z",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, x, y, z) => {
        if (!x || !y || !z)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/tp <x> <y> <z>");
        const px = parseFloat(x);
        const py = parseFloat(y);
        const pz = parseFloat(z);
        if (isNaN(px) || isNaN(py) || isNaN(pz))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid coordinates.");
        player.position = new mp.Vector3(px, py, pz);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Teleported to ${px.toFixed(1)}, ${py.toFixed(1)}, ${pz.toFixed(1)}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "mydim",
    description: "Set your own dimension (setdim is admin command for others)",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, id) => {
        if (!id)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/mydim <id>");
        const dim = parseInt(id, 10);
        if (isNaN(dim) || dim < 0)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid dimension ID.");
        player.dimension = dim;
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Dimension set to ${dim}`);
    }
});
const hopoutsMarkCmd = {
    name: "arena_mark",
    aliases: ["hopouts_mark"],
    description: "Mark a point for Hopouts location (e.g. /arena_mark vespucci_canal center)",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, presetId, markType) => {
        if (!presetId || !markType)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/arena_mark <locationId> <center|redspawn|bluespawn|redcar|bluecar|safenode>");
        const type = markType.toLowerCase();
        const valid = ["center", "redspawn", "bluespawn", "redcar", "bluecar", "safenode"];
        if (!valid.includes(type))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `Invalid type. Use: ${valid.join(", ")}`);
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
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `[${presetId}] safenode #${preset.safeNodes.length} marked`);
        }
        else {
            const point = { x, y, z, heading };
            if (type === "center")
                preset.center = point;
            else if (type === "redspawn")
                preset.redspawn = point;
            else if (type === "bluespawn")
                preset.bluespawn = point;
            else if (type === "redcar")
                preset.redcar = point;
            else if (type === "bluecar")
                preset.bluecar = point;
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `[${presetId}] ${type} marked`);
        }
    }
};
_api_1.RAGERP.commands.add(hopoutsMarkCmd);
_api_1.RAGERP.commands.add({
    name: "arena_export",
    description: "Export Hopouts location preset as JSON",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, presetId) => {
        if (!presetId)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/arena_export <presetId>");
        const preset = arenaMarkedPresets.get(presetId);
        if (!preset)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `No points marked for preset "${presetId}". Use /arena_mark first.`);
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
        console.log(`\n--- Hopouts location: ${presetId} ---\n${json}\n---`);
        player.outputChatBox(`${"!{#32cd32}" /* RageShared.Enums.STRINGCOLORS.GREEN */}[${presetId}] Exported. Check server console for JSON.`);
    }
});
const hopoutsSaveCmd = {
    name: "arena_save",
    aliases: ["hopouts_save"],
    description: "Save Hopouts location (e.g. /arena_save vespucci_canal \"Vespucci Canal\")",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, presetId, presetName) => {
        if (!presetId)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/arena_save <locationId> [displayName]");
        const preset = arenaMarkedPresets.get(presetId);
        if (!preset)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `No points marked for preset "${presetId}". Use /arena_mark first.`);
        if (!preset.center || !preset.redspawn || !preset.bluespawn || !preset.redcar || !preset.bluecar) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Mark center, redspawn, bluespawn, redcar, bluecar first.");
        }
        const name = (presetName && presetName.trim()) || presetId;
        const toSave = {
            id: presetId,
            name,
            center: preset.center,
            redSpawn: preset.redspawn,
            blueSpawn: preset.bluespawn,
            redCar: preset.redcar,
            blueCar: preset.bluecar,
            safeNodes: preset.safeNodes && preset.safeNodes.length > 0 ? preset.safeNodes : undefined
        };
        if ((0, ArenaPresets_asset_1.saveArenaPreset)(toSave)) {
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Hopouts location "${name}" saved.`);
        }
        else {
            player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Failed to save Hopouts location.");
        }
    }
};
_api_1.RAGERP.commands.add(hopoutsSaveCmd);
_api_1.RAGERP.commands.add({
    name: "hopouts_locations",
    aliases: ["arena_locations"],
    description: "List available Hopouts locations",
    run: (player) => {
        const presets = (0, ArenaPresets_asset_1.getArenaPresets)();
        if (presets.length === 0) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "No Hopouts locations. Use /arena_mark and /arena_save to create.");
        }
        const list = presets.map((p) => `${p.name} (${p.id})`).join(", ");
        player.outputChatBox(`${"!{#32cd32}" /* RageShared.Enums.STRINGCOLORS.GREEN */}Hopouts locations: ${list}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "hopouts_solo",
    aliases: ["arena_solo"],
    description: "Start a solo Hopouts match for testing (no queue)",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, presetId) => {
        if (!player.character)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "No character loaded.");
        if ((0, Arena_module_1.startSoloMatch)(player, presetId?.trim() || undefined)) {
            player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Solo Hopouts match started.");
        }
        else {
            player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Cannot start. Already in match, or no Hopouts locations. Use /arena_mark and /arena_save first.");
        }
    }
});
// Attachments editor (based on https://github.com/1PepeCortez/Attachments-editor)
_api_1.RAGERP.commands.add({
    name: "attach",
    description: "Start attach editor: /attach [object_name] (e.g. prop_cs_beer_bot_02)",
    adminlevel: ADMIN_DEV,
    run: (player, _fulltext, objectName) => {
        if (attachEditorEditing)
            return player.outputChatBox("!{#ff0000}Already editing an object!");
        if (!objectName || !objectName.trim())
            return player.outputChatBox("!{#ff0000}/attach [object_name]");
        player.call("attachObject", [objectName.trim()]);
        attachEditorEditing = true;
    }
});
mp.events.add("startEditAttachServer", () => {
    attachEditorEditing = true;
});
mp.events.add("finishAttach", (player, objectJson) => {
    attachEditorEditing = false;
    try {
        const data = JSON.parse(objectJson);
        if (data.cancel === true)
            return;
        const line = `[ '${data.bodyName}', ${data.boneIndex}, '${data.object}', ${data.body}, ${data.x.toFixed(4)}, ${data.y.toFixed(4)}, ${data.z.toFixed(4)}, ${data.rx.toFixed(4)}, ${data.ry.toFixed(4)}, ${data.rz.toFixed(4)} ],\r\n`;
        player.outputChatBox(line);
        fs.appendFile(ATTACHMENTS_FILE, line, (err) => {
            if (err)
                console.error("[AttachEditor] Failed to save:", err.message);
        });
    }
    catch {
        // ignore parse errors
    }
});


/***/ },

/***/ "./source/server/commands/Dev.commands.ts"
/*!************************************************!*\
  !*** ./source/server/commands/Dev.commands.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Assets_module_1 = __webpack_require__(/*! @modules/inventory/Assets.module */ "./source/server/modules/inventory/Assets.module.ts");
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const NativeMenu_class_1 = __webpack_require__(/*! @classes/NativeMenu.class */ "./source/server/classes/NativeMenu.class.ts");
_api_1.RAGERP.commands.add({
    name: "gotopos",
    description: "Teleport to a x y z",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, x, y, z) => {
        if (!fulltext.length || !x.length || !y.length || !z.length)
            return player.outputChatBox("Usage: /gotopos [x] [y] [z]");
        player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
    }
});
_api_1.RAGERP.commands.add({
    name: "savepos",
    aliases: ["getpos", "mypos"],
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player) => {
        const [{ x, y, z }, heading] = [player.position, player.heading];
        console.log(`Position: new mp.Vector3(${x}, ${y}, ${z})`);
        console.log(`Heading: ${heading}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "settime",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, time) => {
        mp.world.time.set(parseInt(time), 0, 0);
    }
});
_api_1.RAGERP.commands.add({
    name: "sethealth",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, health) => {
        player.health = parseInt(health);
    }
});
_api_1.RAGERP.commands.add({
    name: "clearinventory",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, targetid) => {
        if (!targetid.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/clearinventory [playerid]");
        let target = mp.players.at(parseInt(targetid));
        if (!target || !mp.players.exists(target) || !target.character || !target.character.inventory)
            return;
        target.character.inventory.items = {
            pockets: Assets_module_1.inventorydataPresset.pockets,
            clothes: Assets_module_1.inventorydataPresset.clothes
        };
        target.character.inventory.quickUse = Assets_module_1.inventorydataPresset.quickUse;
        target.character.inventory.reloadClothes(target);
    }
});
// RAGERP.commands.add({
//     name: "giveweapon",
//     adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
//     run: (player: PlayerMp, fulltext, weapon: RageShared.Inventory.Enums.ITEM_TYPES) => {
//         if (!player.character || !player.character.inventory) return;
//         const itemData = player.character.inventory.addItem(weapon);
//         if (!itemData || itemData.typeCategory !== RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON) return;
//         player.showNotify(
//             itemData ? RageShared.Enums.NotifyType.TYPE_SUCCESS : RageShared.Enums.NotifyType.TYPE_ERROR,
//             itemData ? `You received a ${itemData.name}` : `An error occurred giving u the item.`
//         );
//     }
// });
_api_1.RAGERP.commands.add({
    name: "setpage",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player, fulltext, pagename) => {
        _api_1.RAGERP.cef.emit(player, "system", "setPage", pagename);
    }
});
_api_1.RAGERP.commands.add({
    name: "reloadclientside",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player) => {
        //@ts-ignore
        mp.players.reloadResources();
    }
});
_api_1.RAGERP.commands.add({
    name: "testbbb",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: (player) => {
        //@ts-ignore
        player.call("testcambro");
    }
});
_api_1.RAGERP.commands.add({
    name: "testnativemenu",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: async (player) => {
        player.nativemenu = new NativeMenu_class_1.NativeMenu(player, 0, "Hello World", "This is a description", [
            { name: "test", type: 0 /* RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT */, uid: 123 },
            { name: "test 2", type: 0 /* RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT */, uid: 1232 },
            { name: "test 3", type: 0 /* RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT */, uid: 1232 }
        ]);
        player.nativemenu.onItemSelected(player).then((res) => {
            if (!res)
                return player.nativemenu?.destroy(player);
            const data = _api_1.RAGERP.utils.parseObject(res);
            console.log("onItemSelected called, with result: ", data);
            switch (data.listitem) {
                case 0: {
                    console.log("player selected the first item in native menu");
                    return;
                }
                default: {
                    return console.log(`player selected index ${data.listitem} | name: ${data.name} | uid: ${data.uid}`);
                }
            }
        });
    }
});
_api_1.RAGERP.commands.add({
    name: "testitem",
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    run: async (player) => {
        if (!player.character || !player.character.inventory)
            return;
        const items = player.character.inventory.getItemsInCategoryByType([index_1.RageShared.Inventory.Enums.INVENTORY_CATEGORIES.POCKETS], "weapon_pistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL */);
        if (!items.length)
            return;
        player.character.inventory.startUsingItem(player, "Press ESC to cancel this action", 5, {
            item: items[0],
            animDict: "mini@repair",
            animName: "fixing_a_player",
            flag: 16,
            attachObject: "item_toolbox"
        }, async () => {
            console.log("Hello world!");
        });
    }
});
_api_1.RAGERP.commands.add({
    adminlevel: 6 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX */,
    name: "testattach",
    run: (player, fullText, item, isAttach) => {
        player.attachObject(item, parseInt(isAttach) !== 0);
    }
});


/***/ },

/***/ "./source/server/commands/Freeroam.commands.ts"
/*!*****************************************************!*\
  !*** ./source/server/commands/Freeroam.commands.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Weapons_assets_1 = __webpack_require__(/*! @assets/Weapons.assets */ "./source/server/assets/Weapons.assets.ts");
/**
 * Freeroam mode: players can set their own dimension, spawn vehicles, and spawn weapons for FFA.
 */
_api_1.RAGERP.commands.add({
    name: "freeroam",
    aliases: ["ffa", "fr"],
    description: "Show freeroam commands",
    run: (player) => {
        player.outputChatBox(`${"!{#32cd32}" /* RageShared.Enums.STRINGCOLORS.GREEN */}--- Freeroam / FFA ---`);
        player.outputChatBox(`${"!{#ffffff}" /* RageShared.Enums.STRINGCOLORS.WHITE */}/fdim <id> - Set your dimension (private instance)`);
        player.outputChatBox(`${"!{#ffffff}" /* RageShared.Enums.STRINGCOLORS.WHITE */}/fveh <model> - Spawn vehicle (e.g. sultan, infernus)`);
        player.outputChatBox(`${"!{#ffffff}" /* RageShared.Enums.STRINGCOLORS.WHITE */}/fgun <weapon> - Give weapon (e.g. pistol, assaultrifle)`);
        player.outputChatBox(`${"!{#ffffff}" /* RageShared.Enums.STRINGCOLORS.WHITE */}/poligon - Teleport to shooting range`);
    }
});
const SHOOTING_RANGE_POS = new mp.Vector3(821.5705, -2163.812, 29.656);
_api_1.RAGERP.commands.add({
    name: "poligon",
    aliases: ["shootingrange", "range"],
    description: "Teleport to shooting range (45 targets, Assault Rifle + Carbine Rifle)",
    run: (player) => {
        if (!player.getVariable("loggedin"))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You must be logged in.");
        player.giveWeaponEx(Weapons_assets_1.weaponHash.assaultrifle, 1000, 30);
        player.giveWeaponEx(Weapons_assets_1.weaponHash.carbinerifle, 1000, 30);
        player.position = SHOOTING_RANGE_POS;
        player.call("client::shootingrange:start");
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Shooting range started! Hit 45 targets.");
    }
});
mp.events.add("FinishedPoligon", (player, points) => {
    player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Shooting range complete! Score: ${points} points`);
});
_api_1.RAGERP.commands.add({
    name: "fdim",
    aliases: ["dimension"],
    description: "Set your dimension (private instance for you and your group)",
    run: (player, _fulltext, id) => {
        if (!player.getVariable("loggedin"))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You must be logged in.");
        if (!id)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/fdim <id>");
        const dim = parseInt(id, 10);
        if (isNaN(dim) || dim < 0)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid dimension ID (use 0 or positive number).");
        player.dimension = dim;
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Dimension set to ${dim}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "fveh",
    aliases: ["fcar"],
    description: "Spawn a vehicle (e.g. /fveh sultan, /fveh infernus)",
    run: (player, _fulltext, model) => {
        if (!player.getVariable("loggedin"))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You must be logged in.");
        if (!model || !model.trim())
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/fveh <model>");
        const modelName = model.trim().toLowerCase().replace(/^vehicle_/, "");
        const hash = mp.joaat(modelName);
        if (hash === 0 || hash === mp.joaat("null")) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `Unknown vehicle model: ${model}`);
        }
        const vehicle = new _api_1.RAGERP.entities.vehicles.new(6 /* RageShared.Vehicles.Enums.VEHICLETYPES.FREEROAM */, modelName, player.position, player.heading, player.dimension);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Spawned ${modelName}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "fgun",
    aliases: ["fweapon", "weapon", "gun", "wep"],
    description: "Give yourself a weapon (e.g. /fgun pistol, /weapon assaultrifle)",
    run: (player, _fulltext, weaponName) => {
        if (!player.getVariable("loggedin"))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You must be logged in.");
        if (!weaponName || !weaponName.trim())
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/fgun <weapon>");
        const name = weaponName.trim().toLowerCase().replace(/^weapon_/, "").replace(/\s+/g, "_").replace(/-/g, "_");
        const hash = Weapons_assets_1.weaponHash[name] ?? mp.joaat(`weapon_${name}`);
        if (!hash || hash === mp.joaat("weapon_unarmed")) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, `Unknown weapon: ${weaponName}. Try: pistol, smg, assaultrifle, shotgun, sniperrifle`);
        }
        const ammo = 999;
        player.giveWeaponEx(hash, ammo, 30);
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Gave ${weaponName}`);
    }
});


/***/ },

/***/ "./source/server/commands/Player.commands.ts"
/*!***************************************************!*\
  !*** ./source/server/commands/Player.commands.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const utils_module_1 = __webpack_require__(/*! @shared/utils.module */ "./source/shared/utils.module.ts");
_api_1.RAGERP.commands.add({
    name: "me",
    run: (player, fulltext) => {
        if (!fulltext.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/me [action text]");
        player.setEmoteText([194, 162, 218, 255], `** ${fulltext}`, 7);
        _api_1.RAGERP.chat.sendNearbyMessage(player.position, 15, `!{#C2A2DA}** ${player.getRoleplayName()} ${fulltext}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "w",
    aliases: ["whisper"],
    run: (player, fulltext, targetid, ...text) => {
        if (!fulltext.length || !targetid.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/w(hisper) [playerid] [message]");
        const target = mp.players.getPlayerByName(targetid);
        if (!target || !mp.players.exists(target) || !target.getVariable("loggedin"))
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Invalid player specified.");
        if (target.id === player.id)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You can't whisper yourself.");
        if (utils_module_1.Utils.distanceToPos(player.position, target.position) > 2.5)
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "That player is far away from you.");
        player.setEmoteText([194, 162, 218, 255], `* mutters something to ${target.getRoleplayName()}`, 7);
        _api_1.RAGERP.chat.sendNearbyMessage(player.position, 15, `!{#C2A2DA}** ${player.getRoleplayName()} whispers something to ${target.getRoleplayName()}`);
        player.outputChatBox(`!{#FFFF00}Whisper to: ${target.getRoleplayName()}: ${text.join(" ")}`);
        target.outputChatBox(`!{#FFFF00}${player.getRoleplayName()} whispers: ${text.join(" ")}`);
    }
});
_api_1.RAGERP.commands.add({
    name: "do",
    run: (player, fulltext) => {
        if (!fulltext.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/do [describe action text]");
        player.setEmoteText([194, 162, 218, 255], `** ${fulltext}`, 7);
        _api_1.RAGERP.chat.sendNearbyMessage(player.position, 15, `!{#C2A2DA}** ${fulltext} ((${player.getRoleplayName()}))`);
    }
});
_api_1.RAGERP.commands.add({
    name: "b",
    description: "Local ooc chat",
    run: (player, fulltext) => {
        if (!fulltext.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/b [message]");
        _api_1.RAGERP.chat.sendNearbyMessage(player.position, 15, `!{#afafaf}(( ${player.name} [${player.id}]: ${fulltext} ))`);
    }
});
_api_1.RAGERP.commands.add({
    name: "shout",
    aliases: ["s"],
    description: "Shoutout a message",
    run: (player, fulltext) => {
        if (!fulltext.length)
            return _api_1.RAGERP.chat.sendSyntaxError(player, "/s(hout) [text]");
        player.setEmoteText([255, 255, 255, 255], `(Shouts) ${fulltext}!`, 5);
        _api_1.RAGERP.chat.sendNearbyMessage(player.position, 20.0, `${player.getRoleplayName()} shouts: ${fulltext}!`);
    }
});


/***/ },

/***/ "./source/server/commands/index.ts"
/*!*****************************************!*\
  !*** ./source/server/commands/index.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./Admin.commands */ "./source/server/commands/Admin.commands.ts");
__webpack_require__(/*! ./Dev.commands */ "./source/server/commands/Dev.commands.ts");
__webpack_require__(/*! ./Player.commands */ "./source/server/commands/Player.commands.ts");
__webpack_require__(/*! ./ArenaDev.commands */ "./source/server/commands/ArenaDev.commands.ts");
__webpack_require__(/*! ./Freeroam.commands */ "./source/server/commands/Freeroam.commands.ts");


/***/ },

/***/ "./source/server/database/Database.module.ts"
/*!***************************************************!*\
  !*** ./source/server/database/Database.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainDataSource = void 0;
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const Account_entity_1 = __webpack_require__(/*! ./entity/Account.entity */ "./source/server/database/entity/Account.entity.ts");
const Character_entity_1 = __webpack_require__(/*! ./entity/Character.entity */ "./source/server/database/entity/Character.entity.ts");
const Logger_module_1 = __webpack_require__(/*! ./Logger.module */ "./source/server/database/Logger.module.ts");
const Ban_entity_1 = __webpack_require__(/*! ./entity/Ban.entity */ "./source/server/database/entity/Ban.entity.ts");
const dotenv = __importStar(__webpack_require__(/*! dotenv */ "dotenv"));
const Inventory_entity_1 = __webpack_require__(/*! ./entity/Inventory.entity */ "./source/server/database/entity/Inventory.entity.ts");
const Vehicle_entity_1 = __webpack_require__(/*! ./entity/Vehicle.entity */ "./source/server/database/entity/Vehicle.entity.ts");
const Bank_entity_1 = __webpack_require__(/*! @entities/Bank.entity */ "./source/server/database/entity/Bank.entity.ts");
const WeaponPreset_entity_1 = __webpack_require__(/*! ./entity/WeaponPreset.entity */ "./source/server/database/entity/WeaponPreset.entity.ts");
dotenv.config();
let beta = true;
const config = {
    connectionLimit: 100,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: !beta ? process.env.DB_BETA_PASSWORD : process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 5432
};
const loggerConfig = {
    queryLogFilePath: "./dblogs/query-log.log",
    errorLogFilePath: "./dblogs/error.log",
    defaultLogFilePath: "./dblogs/default-log.log"
};
exports.MainDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    database: config.database,
    synchronize: true,
    connectTimeoutMS: config.connectTimeout,
    logging: ["error"],
    entities: [Account_entity_1.AccountEntity, Character_entity_1.CharacterEntity, Bank_entity_1.BankAccountEntity, Ban_entity_1.BanEntity, Inventory_entity_1.InventoryItemsEntity, Vehicle_entity_1.VehicleEntity, WeaponPreset_entity_1.WeaponPresetEntity],
    migrations: [],
    subscribers: [],
    logger: Logger_module_1.DatabaseLogger.getInstance(loggerConfig)
});


/***/ },

/***/ "./source/server/database/Logger.module.ts"
/*!*************************************************!*\
  !*** ./source/server/database/Logger.module.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseLogger = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const createFile = (filename) => {
    fs.open(filename, "r", (err, fd) => {
        if (err) {
            fs.writeFile(filename, "", (err) => {
                if (err)
                    console.log(err);
                else
                    console.log("The file was saved!");
            });
        }
        else {
            console.log("The file exists!");
        }
    });
};
const saveFile = (name, log) => {
    fs.appendFile("" + name + ".log", `${log}\n`, (err) => {
        if (err) {
            createFile(name);
            return console.log(err);
        }
    });
};
class DatabaseLogger {
    static instance;
    config;
    constructor(config) {
        this.config = config;
    }
    static getInstance(config) {
        if (!DatabaseLogger.instance) {
            DatabaseLogger.instance = new DatabaseLogger(config);
        }
        return DatabaseLogger.instance;
    }
    logQuery(query, parameters, queryRunner) {
        const logMessage = `-------------------------------------------------------------------------\n\Query: ${query}\nParameters: ${parameters}\n-------------------------------------------------------------------------\n`;
        try {
            fs.appendFileSync(this.config.queryLogFilePath, logMessage);
        }
        catch (err) {
            createFile(this.config.queryLogFilePath);
        }
    }
    logQueryError(error, query, parameters, queryRunner) {
        const logMessage = `-------------------------------------------------------------------------\nDate: [${new Date()}]\nQuery: ${query}\nParameters: ${parameters}\n${error}\n-------------------------------------------------------------------------\n`;
        try {
            fs.appendFileSync(this.config.errorLogFilePath, logMessage);
        }
        catch (err) {
            createFile(this.config.errorLogFilePath);
        }
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        // throw new Error('Method not implemented.');
    }
    logSchemaBuild(message, queryRunner) {
        // throw new Error('Method not implemented.');
    }
    logMigration(message, queryRunner) {
        // throw new Error('Method not implemented.');
    }
    log(level, message, queryRunner) {
        const logMessage = `${level} | ${message} | ${queryRunner}\n`;
        try {
            fs.appendFileSync(this.config.defaultLogFilePath, logMessage);
        }
        catch (err) {
            createFile(this.config.defaultLogFilePath);
        }
    }
}
exports.DatabaseLogger = DatabaseLogger;


/***/ },

/***/ "./source/server/database/entity/Account.entity.ts"
/*!*********************************************************!*\
  !*** ./source/server/database/entity/Account.entity.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const Character_entity_1 = __webpack_require__(/*! ./Character.entity */ "./source/server/database/entity/Character.entity.ts");
let AccountEntity = class AccountEntity {
    id;
    adminlevel = 0;
    username;
    password;
    email;
    socialClubId;
    characters;
};
exports.AccountEntity = AccountEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AccountEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "adminlevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 129 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 52 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 52 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "socialClubId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Character_entity_1.CharacterEntity, (char) => char.account),
    __metadata("design:type", Array)
], AccountEntity.prototype, "characters", void 0);
exports.AccountEntity = AccountEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "accounts" })
], AccountEntity);


/***/ },

/***/ "./source/server/database/entity/Ban.entity.ts"
/*!*****************************************************!*\
  !*** ./source/server/database/entity/Ban.entity.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BanEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let BanEntity = class BanEntity {
    id;
    ip;
    rsgId;
    username;
    serial;
    reason;
    bannedBy;
    bannedByLevel;
    lifttime;
};
exports.BanEntity = BanEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BanEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "rsgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "serial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "bannedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], BanEntity.prototype, "bannedByLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], BanEntity.prototype, "lifttime", void 0);
exports.BanEntity = BanEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "bans" })
], BanEntity);


/***/ },

/***/ "./source/server/database/entity/Bank.entity.ts"
/*!******************************************************!*\
  !*** ./source/server/database/entity/Bank.entity.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BankAccountEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const Character_entity_1 = __webpack_require__(/*! @entities/Character.entity */ "./source/server/database/entity/Character.entity.ts");
let BankAccountEntity = class BankAccountEntity {
    id;
    isPrimary;
    accountnumber;
    pincode;
    balance;
    accountholder;
    character;
};
exports.BankAccountEntity = BankAccountEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BankAccountEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], BankAccountEntity.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], BankAccountEntity.prototype, "accountnumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], BankAccountEntity.prototype, "pincode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], BankAccountEntity.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "" }),
    __metadata("design:type", String)
], BankAccountEntity.prototype, "accountholder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Character_entity_1.CharacterEntity, (char) => char.bank),
    __metadata("design:type", Character_entity_1.CharacterEntity)
], BankAccountEntity.prototype, "character", void 0);
exports.BankAccountEntity = BankAccountEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "bank_accounts" })
], BankAccountEntity);


/***/ },

/***/ "./source/server/database/entity/Character.entity.ts"
/*!***********************************************************!*\
  !*** ./source/server/database/entity/Character.entity.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CharacterEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const Inventory_entity_1 = __webpack_require__(/*! ./Inventory.entity */ "./source/server/database/entity/Inventory.entity.ts");
const Core_class_1 = __webpack_require__(/*! @modules/inventory/Core.class */ "./source/server/modules/inventory/Core.class.ts");
const CEFEvent_class_1 = __webpack_require__(/*! @classes/CEFEvent.class */ "./source/server/classes/CEFEvent.class.ts");
const Command_class_1 = __webpack_require__(/*! @classes/Command.class */ "./source/server/classes/Command.class.ts");
const Account_entity_1 = __webpack_require__(/*! ./Account.entity */ "./source/server/database/entity/Account.entity.ts");
const Death_utils_1 = __webpack_require__(/*! @events/Death.utils */ "./source/server/serverevents/Death.utils.ts");
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const Bank_entity_1 = __webpack_require__(/*! @entities/Bank.entity */ "./source/server/database/entity/Bank.entity.ts");
let CharacterEntity = class CharacterEntity {
    id;
    account;
    appearance = {
        face: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0 },
        parents: { father: 0, mother: 0, leatherMix: 0, similarity: 0 },
        hair: { head: 0, eyebrows: 0, chest: 0, beard: 0 },
        color: { head: 0, head_secondary: 0, eyebrows: 0, eyes: 0, chest: 0, beard: 0, lipstick: 0 }
    };
    lastlogin = null;
    name;
    gender = 0;
    level = 1;
    position;
    items;
    wantedLevel = 0;
    deathState = 0 /* RageShared.Players.Enums.DEATH_STATES.STATE_NONE */;
    cash = 1500;
    bank;
    inventory = null;
    constructor() { }
    async save(player) { }
    applyAppearance(player) {
        if (!player || !mp.players.exists(player) || !player.character)
            return;
        const data = player.character.appearance;
        const gender = player.model === mp.joaat("mp_m_freemode_01");
        player.setHeadBlend(data.parents.mother, data.parents.father, 4, data.parents.mother, data.parents.father, 0, (data.parents.similarity / 100) * -1, (data.parents.leatherMix / 100) * -1, 0);
        player.setHairColor(data.color.head, typeof data.color.head_secondary === "undefined" ? 0 : data.color.head_secondary);
        if (gender) {
            player.setHeadOverlay(1, [data.hair.beard, 1, data.color.beard, data.color.beard]);
        }
        else {
            player.setHeadOverlay(1, [data.hair.beard, 0, 1, 1]);
            player.setHeadOverlay(10, [data.hair.chest, 0, 1, 1]);
        }
        player.eyeColor = data.color.eyes;
        player.setClothes(2, data.hair.head, 0, 0);
        for (let i = 0; i < 20; i++) {
            player.setFaceFeature(i, data.face[i] / 100);
        }
    }
    loadInventory = function (player) {
        if (!mp.players.exists(player) || !player.character)
            return;
        const inventoryData = player.character.items;
        player.character.inventory = new Core_class_1.Inventory(player, inventoryData.clothes, inventoryData.pockets, inventoryData.quickUse);
        player.character.inventory.loadInventory(player);
    };
    setStoreData(player, key, value) {
        return player.call("client::eventManager", ["cef::player:setPlayerData", key, value]);
    }
    async spawn(player) {
        if (!player || !mp.players.exists(player) || !player.character)
            return;
        const { x, y, z, heading } = player.character.position;
        player.character.applyAppearance(player);
        const clothes = player.character.appearance.clothes;
        if (clothes) {
            player.call("client::wardrobe:applyClothes", [JSON.stringify(clothes)]);
        }
        player.character.loadInventory(player);
        player.character.setStoreData(player, "ping", player.ping);
        player.character.setStoreData(player, "wantedLevel", player.character.wantedLevel);
        player.setVariable("adminLevel", player.account?.adminlevel ?? 0);
        CEFEvent_class_1.CefEvent.emit(player, "player", "setKeybindData", { I: "Open Inventory", ALT: "Interaction" });
        await player.requestCollisionAt(x, y, z).then(() => {
            player.spawn(new mp.Vector3(x, y, z));
        });
        player.heading = heading;
        if (player.character.deathState === 1 /* RageShared.Players.Enums.DEATH_STATES.STATE_INJURED */) {
            (0, Death_utils_1.setPlayerToInjuredState)(player);
        }
        player.outputChatBox(`Welcome to !{red}RAGEMP ROLEPLAY!{white} ${player.name}!`);
        if (player.account?.adminlevel) {
            player.outputChatBox(`>>> You are logged in as !{green}LEVEL ${player.account.adminlevel}!{white} admin!`);
        }
        player.character.setStoreData(player, "cash", player.character.cash);
        !player.character.lastlogin ? (player.character.lastlogin = new Date()) : player.outputChatBox(`Your last login was on ${player.character.lastlogin}`);
        player.character.lastlogin = new Date();
        Command_class_1.CommandRegistry.reloadCommands(player);
    }
    async getData(data) {
        return this[data];
    }
};
exports.CharacterEntity = CharacterEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CharacterEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_entity_1.AccountEntity, (account) => account.id),
    __metadata("design:type", Account_entity_1.AccountEntity)
], CharacterEntity.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: null }),
    __metadata("design:type", Object)
], CharacterEntity.prototype, "appearance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], CharacterEntity.prototype, "lastlogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], CharacterEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], CharacterEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 1 }),
    __metadata("design:type", Number)
], CharacterEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: null }),
    __metadata("design:type", Object)
], CharacterEntity.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Inventory_entity_1.InventoryItemsEntity, (items) => items.character, { cascade: true, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Inventory_entity_1.InventoryItemsEntity)
], CharacterEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], CharacterEntity.prototype, "wantedLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], CharacterEntity.prototype, "deathState", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 1500 }),
    __metadata("design:type", Number)
], CharacterEntity.prototype, "cash", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Bank_entity_1.BankAccountEntity, (bank) => bank.character),
    __metadata("design:type", Array)
], CharacterEntity.prototype, "bank", void 0);
exports.CharacterEntity = CharacterEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "characters" }),
    __metadata("design:paramtypes", [])
], CharacterEntity);


/***/ },

/***/ "./source/server/database/entity/Inventory.entity.ts"
/*!***********************************************************!*\
  !*** ./source/server/database/entity/Inventory.entity.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryItemsEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const Character_entity_1 = __webpack_require__(/*! ./Character.entity */ "./source/server/database/entity/Character.entity.ts");
let InventoryItemsEntity = class InventoryItemsEntity {
    id;
    clothes = {};
    pockets = {};
    quickUse = {};
    character;
};
exports.InventoryItemsEntity = InventoryItemsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventoryItemsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], InventoryItemsEntity.prototype, "clothes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], InventoryItemsEntity.prototype, "pockets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], InventoryItemsEntity.prototype, "quickUse", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Character_entity_1.CharacterEntity, (character) => character.items),
    __metadata("design:type", Character_entity_1.CharacterEntity)
], InventoryItemsEntity.prototype, "character", void 0);
exports.InventoryItemsEntity = InventoryItemsEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "inventory_items" })
], InventoryItemsEntity);


/***/ },

/***/ "./source/server/database/entity/Vehicle.entity.ts"
/*!*********************************************************!*\
  !*** ./source/server/database/entity/Vehicle.entity.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let VehicleEntity = class VehicleEntity {
    id;
    owner_id;
    owner_name;
    model;
    modelname;
    price;
    class;
    fuel;
    primaryColor = [255, 255, 255];
    secondaryColor = [255, 255, 255];
    dashboardColor;
    interiorColor;
    neon;
    neonColor = [255, 255, 255];
    livery;
    extra;
    wheelmods = { type: -1, mod: 0, color: 0 };
    plate;
    plate_color;
    is_locked;
    position;
    modifications;
    primaryColorType;
    secondaryColorType;
    dimension;
    isWanted;
    // @Column({ type: "json" })
    // inventory: any;
    faction = null;
    keyhole = null;
    impoundState = 0;
};
exports.VehicleEntity = VehicleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, nullable: true, default: null }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true, default: null }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "owner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", nullable: true }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "" }),
    __metadata("design:type", String)
], VehicleEntity.prototype, "modelname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 0 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: -1 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 100 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "fuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json" }),
    __metadata("design:type", Array)
], VehicleEntity.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json" }),
    __metadata("design:type", Array)
], VehicleEntity.prototype, "secondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 100 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "dashboardColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 100 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "interiorColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 0 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "neon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Array)
], VehicleEntity.prototype, "neonColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 100 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "livery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 100 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "extra", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json" }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "wheelmods", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 8, default: "" }),
    __metadata("design:type", String)
], VehicleEntity.prototype, "plate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, nullable: true, default: null }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "plate_color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "is_locked", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json" }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "modifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 0 }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "primaryColorType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 0 }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "secondaryColorType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 10, default: 0 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "dimension", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "isWanted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true, default: null }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "faction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 129, nullable: true, default: null }),
    __metadata("design:type", Object)
], VehicleEntity.prototype, "keyhole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 11, default: 0 }),
    __metadata("design:type", Number)
], VehicleEntity.prototype, "impoundState", void 0);
exports.VehicleEntity = VehicleEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "vehicles" })
], VehicleEntity);


/***/ },

/***/ "./source/server/database/entity/WeaponPreset.entity.ts"
/*!**************************************************************!*\
  !*** ./source/server/database/entity/WeaponPreset.entity.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeaponPresetEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const Character_entity_1 = __webpack_require__(/*! ./Character.entity */ "./source/server/database/entity/Character.entity.ts");
let WeaponPresetEntity = class WeaponPresetEntity {
    id;
    character;
    characterId;
    weaponName;
    components = [];
};
exports.WeaponPresetEntity = WeaponPresetEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WeaponPresetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Character_entity_1.CharacterEntity, { onDelete: "CASCADE" }),
    __metadata("design:type", Character_entity_1.CharacterEntity)
], WeaponPresetEntity.prototype, "character", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], WeaponPresetEntity.prototype, "characterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    __metadata("design:type", String)
], WeaponPresetEntity.prototype, "weaponName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: "[]" }),
    __metadata("design:type", Array)
], WeaponPresetEntity.prototype, "components", void 0);
exports.WeaponPresetEntity = WeaponPresetEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "weapon_presets" })
], WeaponPresetEntity);


/***/ },

/***/ "./source/server/modules/Attachments.module.ts"
/*!*****************************************************!*\
  !*** ./source/server/modules/Attachments.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.entityAttachments = void 0;
const entityAttachments = {
    _addAttachment(entity, attachmentHash, remove) {
        let idx = entity._attachments.indexOf(attachmentHash);
        if (idx === -1) {
            if (!remove) {
                entity._attachments.push(attachmentHash);
            }
        }
        else if (remove) {
            entity._attachments.splice(idx, 1);
        }
        entity.setVariable("attachmentsData", serializeAttachments(entity._attachments));
    },
    initFunctions: (entity) => {
        entity._attachments = [];
        entity.addAttachment = function _addAttachmentWrap(attachmentName, remove) {
            let to = typeof attachmentName;
            if (to === "number") {
                entityAttachments._addAttachment(entity, attachmentName, remove);
            }
            else if (to === "string") {
                entityAttachments._addAttachment(entity, mp.joaat(attachmentName), remove);
            }
        };
        entity.hasAttachment = function _hasAttachment(attachmentName) {
            return entity._attachments.indexOf(typeof attachmentName === "string" ? mp.joaat(attachmentName) : attachmentName) !== -1;
        };
    }
};
exports.entityAttachments = entityAttachments;
function serializeAttachments(attachments) {
    return attachments.map((hash) => hash.toString(36)).join("|");
}
mp.events.add("staticAttachments.Add", (player, hash) => {
    player.addAttachment(parseInt(hash, 36), false);
});
mp.events.add("staticAttachments.Remove", (player, hash) => {
    player.addAttachment(parseInt(hash, 36), true);
});
mp.events.add("vstaticAttachments.Add", (player, remoteVehicle, hash) => {
    let vehicle = mp.vehicles.at(remoteVehicle);
    if (vehicle && mp.vehicles.exists(vehicle)) {
        vehicle.addAttachment(parseInt(hash, 36), false);
    }
});
mp.events.add("vstaticAttachments.Remove", (player, remoteVehicle, hash) => {
    let vehicle = mp.vehicles.at(remoteVehicle);
    if (vehicle && mp.vehicles.exists(vehicle)) {
        vehicle.addAttachment(parseInt(hash, 36), true);
    }
});


/***/ },

/***/ "./source/server/modules/Chat.module.ts"
/*!**********************************************!*\
  !*** ./source/server/modules/Chat.module.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Chat = void 0;
exports.Chat = {
    /**
     * Sends a syntax error message to a specific player.
     *
     * @param {PlayerMp} player - The player to whom the message will be sent.
     * @param {string} message - The message that describes the correct usage.
     * @returns {void}
     */
    sendSyntaxError(player, message) {
        return player.outputChatBox(`!{#FF6347}Usage:!{#ffffff} ${message}`);
    },
    /**
     * Sends a message to all players within a certain range of a specific position.
     *
     * @param {Vector3} position - The position from which the range is calculated.
     * @param {number} range - The range within which players will receive the message.
     * @param {string} message - The message to send to players.
     * @returns {void}
     */
    sendNearbyMessage(position, range, message) {
        mp.players.forEachInRange(position, range, (player) => {
            if (player.getVariable("loggedin"))
                player.outputChatBox(message);
        });
    },
    /**
     * Sends a warning message to all admins with a certain level or higher.
     *
     * @param {number} color - The color code (32bit in hexadecimal) for the message.
     * @param {string} message - The warning message to send to admins.
     * @param {RageShared.Enums.ADMIN_LEVELS} [level=RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE] - The minimum admin level required to receive the message.
     * @returns {void}
     */
    sendAdminWarning(color, message, level = 1 /* RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE */) {
        const players = mp.players.toArray().filter((x) => x.account && x.account.adminlevel >= level);
        const padColor = color.toString(16).toUpperCase().padStart(8, "0").slice(0, -2);
        players.forEach((player) => {
            player.outputChatBox(`!{#${padColor}}${message}`);
        });
    }
};


/***/ },

/***/ "./source/server/modules/inventory/Assets.module.ts"
/*!**********************************************************!*\
  !*** ./source/server/modules/inventory/Assets.module.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.backpackDataPreset = exports.inventorydataPresset = exports.backpackWeight = exports.backpackQuality = exports.defaultClothes = void 0;
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const defaultClothes = {
    [0 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_HAT */]: [
        { type: "props", component: 0, drawable: 11, texture: 0 },
        { type: "props", component: 0, drawable: 120, texture: 0 }
    ],
    [1 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_MASK */]: [
        { type: "clothing", component: 1, drawable: 0, texture: 0 },
        { type: "clothing", component: 1, drawable: 0, texture: 0 }
    ],
    [2 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_GLASSES */]: [
        { type: "props", component: 1, drawable: 0, texture: 0 },
        { type: "props", component: 1, drawable: 12, texture: 0 }
    ],
    [3 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_EARRINGS */]: [
        { type: "props", component: 2, drawable: 0, texture: -1 },
        { type: "props", component: 2, drawable: 0, texture: -1 }
    ],
    [4 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_CHAIN */]: [
        { type: "clothing", component: 7, drawable: 0, texture: 0 },
        { type: "clothing", component: 7, drawable: 0, texture: 0 }
    ],
    [5 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_TSHIRT */]: [
        { type: "clothing", component: 8, drawable: 0, texture: -1 },
        { type: "clothing", component: 8, drawable: 0, texture: -1 }
    ],
    [6 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_JACKET */]: [
        { type: "clothing", component: 11, drawable: 15, texture: 0 },
        { type: "clothing", component: 11, drawable: 15, texture: 0 }
    ],
    [7 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_BACKPACK */]: [
        { type: "clothing", component: 5, drawable: 0, texture: 0 },
        { type: "clothing", component: 5, drawable: 0, texture: 0 }
    ],
    [8 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_WALLET */]: [
        { type: "props", component: 12, drawable: 0, texture: 0 },
        { type: "props", component: 12, drawable: 0, texture: 0 }
    ],
    [9 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_ARMOUR */]: [
        { type: "clothing", component: 9, drawable: 0, texture: 0 },
        { type: "clothing", component: 9, drawable: 0, texture: 0 }
    ],
    [10 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_WATCH */]: [
        { type: "props", component: 6, drawable: 0, texture: -1 },
        { type: "props", component: 6, drawable: 0, texture: -1 }
    ],
    [11 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_GLOVES */]: [
        { type: "clothing", component: 3, drawable: 15, texture: 0 },
        { type: "clothing", component: 3, drawable: 15, texture: 0 }
    ],
    [12 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_PANTS */]: [
        { type: "clothing", component: 4, drawable: 21, texture: 0 },
        { type: "clothing", component: 4, drawable: 15, texture: 0 }
    ],
    [13 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_SHOES */]: [
        { type: "clothing", component: 6, drawable: 34, texture: 0 },
        { type: "clothing", component: 6, drawable: 35, texture: 0 }
    ]
};
exports.defaultClothes = defaultClothes;
const backpackQuality = {
    0: 12, //level 0
    1: 24 //level 1
};
exports.backpackQuality = backpackQuality;
const backpackWeight = {
    0: 10.0,
    1: 15.0
};
exports.backpackWeight = backpackWeight;
const inventorydataPresset = {
    clothes: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null,
        12: null,
        13: null
    },
    pockets: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null,
        12: null,
        13: null,
        14: null,
        15: null,
        16: null,
        17: null
    },
    quickUse: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null
    }
};
exports.inventorydataPresset = inventorydataPresset;
const backpackDataPreset = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
    17: null,
    18: null,
    19: null,
    20: null,
    21: null,
    22: null,
    23: null
};
exports.backpackDataPreset = backpackDataPreset;


/***/ },

/***/ "./source/server/modules/inventory/Core.class.ts"
/*!*******************************************************!*\
  !*** ./source/server/modules/inventory/Core.class.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Inventory = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const SplitItem_module_1 = __webpack_require__(/*! ./SplitItem.module */ "./source/server/modules/inventory/SplitItem.module.ts");
const MoveItem_module_1 = __webpack_require__(/*! ./MoveItem.module */ "./source/server/modules/inventory/MoveItem.module.ts");
const UseItem_module_1 = __webpack_require__(/*! ./UseItem.module */ "./source/server/modules/inventory/UseItem.module.ts");
const Quickuse_module_1 = __webpack_require__(/*! ./Quickuse.module */ "./source/server/modules/inventory/Quickuse.module.ts");
const Assets_module_1 = __webpack_require__(/*! ./Assets.module */ "./source/server/modules/inventory/Assets.module.ts");
const Items_module_1 = __webpack_require__(/*! ./Items.module */ "./source/server/modules/inventory/Items.module.ts");
const Inventory_entity_1 = __webpack_require__(/*! @entities/Inventory.entity */ "./source/server/database/entity/Inventory.entity.ts");
const utils_module_1 = __webpack_require__(/*! @shared/utils.module */ "./source/shared/utils.module.ts");
const DropItem_module_1 = __webpack_require__(/*! ./DropItem.module */ "./source/server/modules/inventory/DropItem.module.ts");
const ItemObject_class_1 = __webpack_require__(/*! ./ItemObject.class */ "./source/server/modules/inventory/ItemObject.class.ts");
const maleClothes = __importStar(__webpack_require__(/*! @shared/json/maleTorso.json */ "./source/shared/json/maleTorso.json"));
const femaleClothes = __importStar(__webpack_require__(/*! @shared/json/femaleTorso.json */ "./source/shared/json/femaleTorso.json"));
const InteractionProgress_class_1 = __webpack_require__(/*! @classes/InteractionProgress.class */ "./source/server/classes/InteractionProgress.class.ts");
const torsoDataMale = maleClothes;
const femaleTorsos = femaleClothes;
class InventoryBase {
    _player;
    items = { clothes: {}, pockets: {} };
    quickUse;
    weight = 40.0;
    equippedWeapons = {};
    progressBar = null;
    constructor(p, clothes, pockets, quickUse) {
        this._player = p;
        this.items.clothes = clothes;
        this.items.pockets = pockets;
        this.quickUse = quickUse;
        this.weight = 40.0;
    }
    get player() {
        return this._player;
    }
}
class InventoryItem extends InventoryBase {
    /**
     * Sets a inventory item slot to empty
     * @param component which component to reset the item data to
     * @param slotid slot id to reset the data
     */
    resetItemData(component, slotid) {
        this.items[component][slotid] = null;
    }
    /**
     * Resets a clothing slot back to its default state.
     * @param slot Clothing slot (0-13)
     */
    resetClothingItemData(slot) {
        this.items.clothes[slot] = null;
    }
    /**
     * Get a free available inventory item slot
     * @returns itemIndex (slot index) && type: category type
     */
    getFreeSlot() {
        let type = index_1.RageShared.Inventory.Enums.INVENTORY_CATEGORIES.POCKETS;
        let itemIndex = Object.values(this.items.pockets).findIndex((e) => !e);
        return { itemIndex, type };
    }
    getTotalFreeSlots() {
        return Object.values(this.items.pockets).filter((e) => !e).length;
    }
    getClothingIndex(type) {
        const clothingList = {
            ["hat" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HAT */]: 0,
            ["mask" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MASK */]: 1,
            ["glasses" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GLASSES */]: 2,
            ["earRings" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_EARRINGS */]: 3,
            ["chain" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CHAIN */]: 4,
            ["tShirt" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TSHIRT */]: 5,
            ["top" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TOP */]: 6,
            ["backpack" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BACKPACK */]: 7,
            ["wallet" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_WALLET */]: 8,
            ["armour" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ARMOUR */]: 9,
            ["watch" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_WATCH */]: 10,
            ["gloves" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GLOVES */]: 11,
            ["pants" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PANTS */]: 12,
            ["shoes" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOES */]: 13
        };
        return clothingList[type] ?? -1;
    }
    addItem(type) {
        const itemData = Items_module_1.inventoryAssets.items[type];
        const { itemIndex } = this.getFreeSlot();
        if (!itemData || itemIndex < 0)
            return null;
        this.items.pockets[itemIndex] = { ...itemData, quality: 4, hash: (0, uuid_1.v4)(), count: 1 };
        return this.items.pockets[itemIndex];
    }
    /**
     * Adds a clothing item to player's inventory with the option to equip it right away
     * @param type Clothing type
     * @param data Clothing data, such as component, drawable and texture
     * @param equipNow Whether to equip it right away or not (rewrites current item if any)
     * @returns InventoryItem | null
     */
    addClothingItem(type, data, equipNow = false) {
        const [itemData, itemIndex] = [Items_module_1.inventoryAssets.items[type], equipNow ? this.getFreeSlot().itemIndex : this.getClothingIndex(type)];
        if (!itemData || itemIndex < 0)
            return null;
        const items = equipNow ? this.items.clothes : this.items.pockets;
        items[itemIndex] = { ...itemData, key: `${type} ${JSON.stringify({ ...data })}`, hash: (0, uuid_1.v4)() };
        return items[itemIndex];
    }
    async addPlayerItem(item) {
        try {
            let { itemIndex, type } = this.getFreeSlot();
            if (itemIndex === -1)
                return false;
            this.items[type][itemIndex] = item;
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
    async addPlayerItemEx(item, category, slot) {
        try {
            if (this.items[category][slot] !== null)
                return false;
            this.items[category][slot] = item;
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async addMultipleItems(items) {
        try {
            let itemCount = items.length;
            let { itemIndex, type } = this.getFreeSlot();
            if (itemIndex === -1)
                return false;
            for (let i = 0; i < itemCount; i++) {
                this.items[type][itemIndex] = items[i];
                itemIndex++;
            }
            return true;
        }
        catch (err) {
            console.log(err);
        }
    }
}
class QuickUse extends InventoryItem {
    clearQuickUseSlot() { }
    /**
     * Checks if an item is in quick use by component and id.
     *
     * @param {string} component - The component to check.
     * @param {number} id - The id to check.
     * @returns {number} - The index of the item in quick use or -1 if not found.
     */
    isItemInQuickUse(component, id) {
        for (const index in this.quickUse) {
            const item = this.quickUse[index];
            if (item && item.component === component && item.id === id) {
                return Number(index);
            }
        }
        return -1;
    }
}
class InventoryClothes extends QuickUse {
    /**
     * Returns whether a player is wearing a specified clothing index or not.
     * @param type Clothing Index
     * @returns {boolean}
     */
    isWearingClothingType(type) {
        return this.items.clothes[type]?.isPlaced ?? false;
    }
    /**
     * Updates on-screen ped for a specified player.
     * @param type
     * @param componentid clothing component id
     * @param drawableid clothing drawable id
     * @param texture clothing texture id
     * @param palette clothing palette id
     * @returns void
     */
    updateOnScreenPed(type, componentid, drawableid, texture, palette = 2) {
        if (!this.player || !mp.players.exists(this.player))
            return;
        return this.player.call(type === "prop" ? "client:inventory:updatePedProp" : "client:inventory:updatePedComponent", [componentid, drawableid, texture, palette]);
    }
    /**
     * 'Fixes' player body undershirts (gaps and showing body part issues), special thanks to rootcause for v-besttorso
     * @param player Player to update torso to
     * @param drawable clothing drawable id
     * @param texture clothing texture id
     * @returns void
     */
    updatePlayerTorso(player, drawable, texture) {
        try {
            const freemodeModels = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
            const isMaleModel = player.model === freemodeModels[0];
            const torsoData = isMaleModel ? torsoDataMale : femaleTorsos;
            if (torsoData[drawable]?.[texture]) {
                const { BestTorsoDrawable, BestTorsoTexture } = torsoData[drawable][texture];
                if (BestTorsoDrawable !== undefined && BestTorsoTexture !== undefined && BestTorsoDrawable !== -1) {
                    player.setClothes(3 /* RageEnums.ClothesComponent.TORSO */, BestTorsoDrawable, BestTorsoTexture, 2);
                    this.updateOnScreenPed("clothes", 3 /* RageEnums.ClothesComponent.TORSO */, BestTorsoDrawable, BestTorsoTexture);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    /**
     * Remove props or clothes from given player.
     * @param player the player to remove clothes from
     * @param slotnumber slot number based on INVENTORY_CLOTHING
     * @returns void
     */
    removeClothes(player, slotnumber) {
        if (!player || !mp.players.exists(player) || !player.character || slotnumber === 8 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_WALLET */)
            return;
        const sex = player.character.gender;
        const default_clothes = Assets_module_1.defaultClothes[slotnumber][sex];
        const { type, component, drawable, texture } = default_clothes;
        if (type === "props") {
            player.setProp(component, drawable, texture);
            this.updateOnScreenPed("prop", component, drawable, texture);
        }
        else {
            player.setClothes(component, drawable, texture, 2);
            this.updateOnScreenPed("clothes", component, drawable, texture);
        }
    }
    convertUndershirtToShirt(undershirtid) {
        return -1;
    }
    /**
     * Loads clothes or removes clothes based on the provided data.
     * @param {PlayerMp} player The player to load or remove clothes for.
     * @param {number} slotnumber The slot number indicating the type of clothing.
     * @param {{ component: number; drawable: number; texture: number } | null} data The data containing component, drawable, and texture information, or null to remove clothes.
     * @returns {void}
     */
    loadClothes(player, slotnumber, data) {
        data === null ? this.removeClothes(player, slotnumber) : this.setClothes(player, slotnumber, data);
    }
    /**
     * Sets clothes or props for a player based on the slot number and provided data.
     * @param {PlayerMp} player The player to set clothes or props for.
     * @param {number} slotnumber The slot number indicating the type of clothing or prop.
     * @param {{ component: number; drawable: number; texture: number }} data The data containing component, drawable, and texture information.
     * @returns {void}
     */
    setClothes(player, slotnumber, data) {
        if (!mp.players.exists(player) || !player.getVariable("loggedin") || !player.character || !player.character.inventory)
            return;
        if (typeof data.component == "undefined" || isNaN(data.component) || isNaN(data.drawable) || isNaN(data.texture))
            return;
        const itemData = player.character.inventory.items.clothes[slotnumber];
        if (!itemData)
            return;
        if (itemData.typeCategory === 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */) {
            player.setProp(data.component, data.drawable, data.texture);
            this.updateOnScreenPed("prop", data.component, data.drawable, data.texture);
            return;
        }
        switch (slotnumber) {
            case 5 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_TSHIRT */: {
                if (this.items.clothes[6 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_JACKET */]?.isPlaced) {
                    data = { ...data, drawable: data.drawable, texture: data.texture };
                    player.setClothes(8, data.drawable, data.texture, 2);
                    return;
                }
                let converted = this.convertUndershirtToShirt(data.drawable);
                data = { ...data, drawable: converted, texture: data.texture };
                player.setClothes(11, data.drawable, data.texture, 2);
                this.updatePlayerTorso(player, data.drawable, data.texture);
                this.updateOnScreenPed("clothes", data.component, data.drawable, data.texture, 0);
                return;
            }
            case 6 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_JACKET */: {
                if (itemData.isPlaced) {
                    const shirtData = itemData.key.replace("top" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TOP */, "");
                    const undershirtDrawable = JSON.parse(shirtData);
                    if (typeof undershirtDrawable == "undefined" || typeof undershirtDrawable.drawable == "undefined") {
                        return;
                    }
                    player.setClothes(8, undershirtDrawable.drawable, undershirtDrawable.texture, 2);
                    player.setClothes(data.component, data.drawable, data.texture, 2);
                    this.updatePlayerTorso(player, data.drawable, data.texture);
                    return;
                }
                data = { ...data, component: 11, drawable: data.drawable, texture: data.texture };
                if (typeof data.component == "undefined" || typeof data.drawable == "undefined" || isNaN(data.drawable) || isNaN(data.texture)) {
                    return;
                }
                player.setClothes(3, 15, 0, 0);
                player.setClothes(8, 0, -1, 2);
                player.setClothes(data.component, data.drawable, data.texture, 2);
                this.updatePlayerTorso(player, data.drawable, data.texture);
                this.updateOnScreenPed("clothes", data.component, data.drawable, data.texture, 0);
                return;
            }
            case 7 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_BACKPACK */: {
                player.setClothes(data.component, data.drawable, data.texture, 2);
                this.updateOnScreenPed("clothes", data.component, data.drawable, data.texture, 0);
                return;
            }
            case 9 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_ARMOUR */: {
                if (this.items.clothes[9 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_ARMOUR */]?.isPlaced) {
                    let item = this.items.clothes[9 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_ARMOUR */];
                    player.armour = item.amount ?? 0;
                }
                player.setClothes(data.component, data.drawable, data.texture, 2);
                this.updateOnScreenPed("clothes", data.component, data.drawable, data.texture, 0);
                return;
            }
            default: {
                player.setClothes(data.component, data.drawable, data.texture, 2);
                this.updateOnScreenPed("clothes", data.component, data.drawable, data.texture, 0);
                return;
            }
        }
    }
    /**
     * Reloads clothes for the player based on the items stored in the inventory.
     * @param {PlayerMp} player The player whose clothes need to be reloaded.
     * @returns {void}
     */
    reloadClothes(player) {
        Object.entries(this.items.clothes).forEach(([index, clothing]) => {
            if (!clothing)
                return this.removeClothes(player, parseInt(index));
            const clothingKey = clothing.key?.replace(clothing.type, "");
            const parsedKey = clothingKey ? utils_module_1.Utils.tryParse(clothingKey) : null;
            this.loadClothes(player, parseInt(index), clothing.isPlaced ? parsedKey : null);
        });
    }
    /**
     * Resets all clothes for the player, removing all equipped clothes.
     * @param {PlayerMp} player The player whose clothes need to be reset.
     * @returns {void}
     */
    resetClothes(player) {
        Object.values(this.items.clothes).forEach((e, i) => {
            this.removeClothes(player, i);
        });
    }
    /**
     * Resets all props for the player, removing all equipped props.
     * @param {PlayerMp} player The player whose props need to be reset.
     * @returns {void}
     */
    resetProps(player) {
        Object.values(this.items.clothes)
            .filter((x) => x && x.typeCategory === 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */)
            .forEach((e, i) => {
            this.removeClothes(player, i);
        });
    }
}
class InventoryAction extends InventoryClothes {
    async moveItem(player, data) {
        await (0, MoveItem_module_1.moveInventoryItem)(player, data);
    }
    openItem(player, data) {
        try {
        }
        catch (err) {
            console.log("openInventoryItem err: ", err);
        }
    }
    async useItem(player, data) {
        await (0, UseItem_module_1.useInventoryItem)(player, data);
    }
    deleteItemStack(player, data) {
        if (!player.character || !mp.players.exists(player) || !player.character.inventory)
            return;
        try {
            const { item } = JSON.parse(data);
            const source = player.character.inventory.getItemSlotComponentByHash(item.hash);
            if (!source || !source.component || source.slot === null)
                return;
            const itemData = player.character.inventory.items[source.component][source.slot];
            if (!itemData)
                return;
            const count = itemData.count;
            if (count > 1) {
                player.character.inventory.items[source.component][source.slot] = { ...item, count: count - 1 };
                player.character.inventory.setInventory(player);
            }
            else {
                const fastSlotIndex = Object.values(player.character.inventory.quickUse).findIndex((e) => e && e.component === source.component && utils_module_1.Utils.tryParse(e.id) === source.slot);
                if (fastSlotIndex !== -1) {
                    player.character.inventory.quickUse[fastSlotIndex] = null;
                }
                player.character.inventory.deleteItem(player, item.hash);
            }
            if (source.component === "clothes") {
                player.character.inventory.loadInventory(player);
            }
        }
        catch (err) {
            console.error("deleteInventoryItemStack err: ", err);
        }
    }
    deleteItem(player, uuid) {
        if (!player.character || !mp.players.exists(player) || !player.character.inventory)
            return;
        try {
            const { items, quickUse } = player.character.inventory;
            for (const category in items) {
                if (Object.prototype.hasOwnProperty.call(items, category)) {
                    const categoryItems = items[category];
                    for (const [slot, item] of Object.entries(categoryItems)) {
                        if (!item)
                            continue;
                        if (item.hash === uuid) {
                            const parsedSlot = utils_module_1.Utils.tryParse(slot);
                            const fastSlotIndex = Object.values(quickUse).findIndex((e) => e && e.component === category && utils_module_1.Utils.tryParse(e.id) === parsedSlot);
                            if (fastSlotIndex !== -1) {
                                quickUse[fastSlotIndex] = null;
                            }
                            items[category][parsedSlot] = null;
                            player.character.inventory.setInventory(player);
                            if (category === "clothes") {
                                player.character.inventory.loadInventory(player);
                            }
                            return;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.error("deleteInventoryItem err: ", err);
        }
    }
}
class Inventory extends InventoryAction {
    getItemModel(itemType) {
        const item = Items_module_1.inventoryAssets.items[itemType];
        if (!item)
            return null;
        return item.modelHash;
    }
    getItemAndStack(itemType) {
        return this.getItemsInCategoryByType([index_1.RageShared.Inventory.Enums.INVENTORY_CATEGORIES.POCKETS], itemType);
    }
    /**
     * Get items by hash name.
     * @warning This function will also check if the item count is not maxed out.
     * @param {string} itemHash -> Item hash name
     * @returns -> An array of items.
     */
    getItemsByHashName(itemHash) {
        let foundItems = [];
        for (const getcategory in this.items) {
            let category = getcategory;
            for (const item of Object.values(this.items[category])) {
                if (!item)
                    continue;
                if (item.type !== null && item.count !== item.maxStack && item.type === itemHash) {
                    foundItems.push(item);
                }
            }
        }
        return foundItems;
    }
    /**
     * Get items in the specified categories by their type name.
     *
     * @param {inventoryAssets.INVENTORY_CATEGORIES[]} category - The categories to search within.
     * @param {RageShared.Inventory.Enums.ITEM_TYPES} type - The item type to search for.
     * @returns {RageShared.Inventory.Interfaces.IBaseItem[]} An array of found items.
     */
    getItemsInCategoryByType(category, type) {
        const foundItems = [];
        for (const [categoryName, items] of Object.entries(this.items)) {
            if (!category.includes(categoryName)) {
                continue;
            }
            for (const item of Object.values(items)) {
                if (item && item.type === type) {
                    foundItems.push(item);
                }
            }
        }
        return foundItems;
    }
    /**
     * Get an item by UUID
     * This method also looks for the item in clothes
     * @param hashKey Item hash key (.hash)
     * @returns RageShared.Inventory.Interfaces.IBaseItem | null
     */
    getItemByUUID(hashKey) {
        let item = Object.values(this.items.pockets).find((x) => x && x.hash === hashKey);
        if (!item)
            item = Object.values(this.items.clothes).find((x) => x && x.hash === hashKey);
        return item ?? null;
    }
    /**
     *
     * @param backpackHash backpack hash which the item will be looked on to
     * @param uuid item hash
     * @returns RageShared.Inventory.Interfaces.IBaseItem | null
     */
    getBackpackItemByUUID(backpackHash, uuid) {
        const itemData = this.getItemByUUID(backpackHash);
        if (!itemData || !itemData.items)
            return null;
        const itemInBackpack = Object.values(itemData.items).find((x) => x && x.hash === uuid);
        return itemInBackpack ?? null;
    }
    /**
     * Get the total count of items by the specified item type.
     *
     * @param {RageShared.Inventory.Enums.ITEM_TYPES} itemType - The type of item to count.
     * @returns {{ items: string[], count: number }} An object containing an array of item hashes involved and the total count of the items.
     */
    getAllCountByItemType(itemType) {
        let foundCount = 0;
        let itemsInvolved = [];
        for (const [key, value] of Object.entries(this.items)) {
            if (key === "clothes" || key === "quickUse")
                continue;
            const entryValue = Object.values(value);
            for (let i = 0; i < entryValue.length; i++) {
                const item = entryValue[i];
                if (item && item.type === itemType) {
                    foundCount += item.count;
                    itemsInvolved.push(item.hash);
                }
            }
        }
        return { items: itemsInvolved, count: foundCount };
    }
    getItemSlotComponentByHash(hashKey) {
        let foundItem = null;
        for (const [key, value] of Object.entries(this.items)) {
            for (let i = 0; i < Object.values(value).length; i++) {
                const itemData = value[i];
                if (!itemData)
                    continue;
                if (!itemData.hash)
                    continue;
                if (itemData.hash === hashKey) {
                    foundItem = { component: key, slot: i };
                    break;
                }
            }
        }
        return foundItem;
    }
    async getItemSlotComponentByHashKey(hashKey) {
        for (const [key, value] of Object.entries(this.items)) {
            for (let i = 0; i < Object.values(value).length; i++) {
                const item = value[i];
                if (!item)
                    continue;
                if (item.hash === hashKey) {
                    return { component: key, slot: i };
                }
            }
        }
        return null;
    }
    getCountStack(item) {
        if (item.type === null)
            return -1;
        let presset = Items_module_1.inventoryAssets.items[item.type];
        let count = item.count;
        let result = [];
        let length = Math.ceil(count / presset.maxStack);
        if (length <= 1)
            return [item];
        else
            for (let index = 0; index < length; index++) {
                count -= presset.maxStack;
                if (count > 0)
                    result.push({ ...item, count: presset.maxStack });
                else
                    result.push({ ...item, count: presset.maxStack + count });
            }
        return result;
    }
    loadInventory(player) {
        if (!player || !player.character || !this.items)
            return;
        for (let i = 0; i <= 13; i++) {
            if (this.items.clothes[i]) {
                const playerClothes = this.items.clothes[i];
                if (playerClothes && playerClothes.key && playerClothes.isPlaced && playerClothes.type !== null) {
                    const data = playerClothes.key.replace(playerClothes.type, "");
                    this.loadClothes(player, i, utils_module_1.Utils.tryParse(data));
                }
            }
            else {
                this.removeClothes(player, i);
            }
        }
    }
    setInventory(player) {
        try {
            let data = { pockets: this.items.pockets };
            _api_1.RAGERP.cef.emit(player, "inventory", "setMaxWeight", this.getWeight());
            _api_1.RAGERP.cef.emit(player, "inventory", "setInventory", data);
            _api_1.RAGERP.cef.emit(player, "inventory", "setQuickUseItems", this.quickUse);
            _api_1.RAGERP.cef.emit(player, "inventory", "setClothes", this.items.clothes);
            const droppedItems = ItemObject_class_1.ItemObject.fetchInRange(player, 2);
            const groundItems = {};
            for (let i = 0; i < 24; i++) {
                groundItems[i] = droppedItems[i] ?? null;
            }
            _api_1.RAGERP.cef.emit(player, "inventory", "setDroppedItems", groundItems);
            this.save(player);
        }
        catch (err) {
            console.error("error at inventory.setInventory | ", err);
        }
    }
    async save(player) {
        if (!player.character)
            return;
        await _api_1.RAGERP.database
            .getRepository(Inventory_entity_1.InventoryItemsEntity)
            .update({ id: player.character.items.id }, { pockets: this.items.pockets, clothes: this.items.clothes, quickUse: this.quickUse })
            .catch((err) => console.log(err.message));
    }
    //#region Weapon
    isWeapon(item) {
        return item.typeCategory === 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */;
    }
    isAmmoItem(item) {
        return item.typeCategory === 3 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_AMMO */;
    }
    async reloadWeaponAmmo(player, itemHash) {
        try {
            if (player.fastSlotActive === null || player.fastSlotActive < 0)
                return;
            let ammoHash = player.getVariable("ammoHash");
            const weaponGroup = await player.callProc("client::proc:getWeaponTypeGroup", [player.weapon]);
            if (!weaponGroup || weaponGroup === 3566412288 /* RageShared.Inventory.Enums.WEAPON_GROUP.UNKNOWN */)
                return;
            const ammoTypeMap = {
                [416676503 /* RageShared.Inventory.Enums.WEAPON_GROUP.HANDGUNS */]: "pistol_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOLAMMO */,
                [3337201152 /* RageShared.Inventory.Enums.WEAPON_GROUP.SUBMACHINE */]: "smg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMGAMMO */,
                [860033945 /* RageShared.Inventory.Enums.WEAPON_GROUP.SHOTGUN */]: "shotgun_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOTGUNAMMO */,
                [970310034 /* RageShared.Inventory.Enums.WEAPON_GROUP.ASSAULTRIFLE */]: "rifle_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RIFLEAMMO */,
                [1159398588 /* RageShared.Inventory.Enums.WEAPON_GROUP.LIGHTMACHINE */]: "mg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MGAMMO */,
                [3082541095 /* RageShared.Inventory.Enums.WEAPON_GROUP.SNIPER */]: "rifle_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RIFLEAMMO */
            };
            const expectedItemHash = ammoTypeMap[weaponGroup];
            if (itemHash !== expectedItemHash)
                return;
            const fullAmmo = this.getAllCountByItemType(itemHash);
            if (!fullAmmo || !fullAmmo.items || !fullAmmo.items.length)
                return;
            if (ammoHash) {
                ammoHash.items = fullAmmo.items;
                ammoHash.count = fullAmmo.count;
            }
            else {
                ammoHash = fullAmmo;
            }
            player.setVariable("ammoHash", ammoHash);
            player.setVariable("itemAsAmmo", fullAmmo.items[0]);
            player.setWeaponAmmo(player.weapon, fullAmmo.count);
        }
        catch (err) {
            console.error("error at inventory.reloadWeaponAmmo | ", err);
        }
    }
    hasPistolItem() {
        let pistols = new Set([
            "weapon_pistol",
            "weapon_pistol_mk2",
            "weapon_combatpistol",
            "weapon_appistol",
            "weapon_stungun",
            "weapon_pistol50",
            "weapon_snspistol",
            "weapon_snspistol_mk2",
            "weapon_heavypistol",
            "weapon_vintagepistol",
            "weapon_flaregun",
            "weapon_marksmanpistol",
            "weapon_revolver",
            "weapon_revolvermk2",
            "weapon_doubleaction",
            "weapon_raypistol",
            "weapon_ceramicpistol",
            "weapon_navyrevolver",
            "weapon_gadgetpistol"
        ]);
        for (const [category, categoryItems] of Object.entries(this.items)) {
            if (category === "clothes" || category === "quickUse")
                continue;
            for (const item of Object.values(categoryItems)) {
                if (item === null)
                    continue;
                if (pistols.has(item.type)) {
                    return true;
                }
            }
        }
        return false;
    }
    hasShotgun() {
        let shotguns = new Set([
            "weapon_pumpshotgun",
            "weapon_pumpshotgun_mk2",
            "weapon_sawnoffshotgun",
            "weapon_assaultshotgun",
            "weapon_bullpupshotgun",
            "weapon_mukset",
            "weapon_heavyshotgun",
            "weapon_doublebarrelshotgun",
            "weapon_autoshotgun",
            "weapon_combatshotgun"
        ]);
        for (const [category, categoryItems] of Object.entries(this.items)) {
            if (category === "clothes" || category === "quickUse")
                continue;
            for (const item of Object.values(categoryItems)) {
                if (item === null)
                    continue;
                if (shotguns.has(item.type)) {
                    return true;
                }
            }
        }
        return false;
    }
    hasAssault() {
        const assaultrifles = new Set([
            "weapon_assaultrifle",
            "weapon_assaultrifle_mk2",
            "weapon_carbinerifle",
            "weapon_carbinerifle_mk2",
            "weapon_advancedrifle",
            "weapon_specialcarbine",
            "weapon_specialcarbine_mk2",
            "weapon_bullpuprifle",
            "weapon_bullpuprifle_mk2",
            "weapon_compactrifle"
        ]);
        let foundAssaultRifle = false;
        for (const [category, categoryItems] of Object.entries(this.items)) {
            if (category === "clothes" || category === "quickUse")
                continue;
            for (const itemValue of Object.values(categoryItems)) {
                if (itemValue === null)
                    continue;
                if (assaultrifles.has(itemValue.type)) {
                    foundAssaultRifle = true;
                    break;
                }
            }
        }
        return foundAssaultRifle;
    }
    hasSMG() {
        const smg = new Set(["weapon_microsmg", "weapon_smg", "weapon_smg_mk2", "weapon_assaultsmg", "weapon_combatpdw", "weapon_machinepistol", "weapon_minismg", "weapon_raycarbine"]);
        let foundPistol = false;
        for (const [category, categoryItems] of Object.entries(this.items)) {
            if (category === "clothes" || category === "quickUse")
                continue;
            for (const itemValue of Object.values(categoryItems)) {
                if (itemValue === null)
                    continue;
                if (smg.has(itemValue.type)) {
                    foundPistol = true;
                    break;
                }
            }
        }
        return foundPistol;
    }
    hasWeaponInFastSlot(type) {
        for (const itemInFastSlot of Object.values(this.quickUse)) {
            if (!itemInFastSlot) {
                return false;
            }
            const item = this.items[itemInFastSlot.component][itemInFastSlot.id];
            if (item && item.type === type) {
                return true;
            }
        }
        return false;
    }
    //#endregion
    getWeight() {
        let weight = this.weight;
        if (this.items.clothes[7 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_BACKPACK */]?.isPlaced) {
            weight += Assets_module_1.backpackWeight[this.items.clothes[7 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_BACKPACK */].quality];
        }
        return weight;
    }
    getItemsWeight() {
        let weight = 0;
        let pocketItems = Object.values(this.items["pockets"]);
        for (let i = 0; i < pocketItems.length; i++) {
            const item = pocketItems[i];
            if (item !== null) {
                weight += item.weight;
            }
        }
        return weight;
    }
    checkWeight(newaddition) {
        let totalweight = this.getWeight();
        let takenweight = this.getItemsWeight();
        let difference = totalweight - takenweight;
        if (difference < newaddition)
            return true;
        return false;
    }
    async dropItem(player, itemData) {
        return await (0, DropItem_module_1.dropInventoryItem)(player, itemData).catch((err) => console.log("dropItem: ", err));
    }
    splitStack(player, data) {
        return (0, SplitItem_module_1.splitInventoryItem)(player, data);
    }
    async addCountToPlayerItem(player, item, count) {
        try {
            if (item.type === null)
                return;
            const findItem = this.getItemAndStack(item.type);
            if (findItem && findItem.length) {
                const playerItem = findItem.find((e) => e.count < e.maxStack) || findItem[0];
                const currentCount = playerItem.count;
                const maxStack = playerItem.maxStack;
                const remainingCount = Math.max(0, currentCount + count - maxStack);
                const newCount = Math.min(currentCount + count, maxStack);
                playerItem.count = newCount;
                if (remainingCount > 0) {
                    const newItem = { ...item, hash: (0, uuid_1.v4)(), count: remainingCount };
                    await this.addPlayerItem(newItem);
                }
            }
            else {
                item = { ...item, hash: (0, uuid_1.v4)(), count: count };
                const result = await this.addPlayerItem(item);
                if (!result)
                    return false;
            }
            this.setInventory(player);
            return true;
        }
        catch (err) {
            console.error("An error occurred at inventory.addPlayerItemCount: ", err);
            return false;
        }
    }
    async manageFastSlots(player, event) {
        await (0, Quickuse_module_1.manageInventoryFastSlot)(player, event);
    }
    checkQuickUse(component, slot) {
        let fastSlot = -1;
        for (let [index, e] of Object.entries(this.quickUse)) {
            if (!e)
                continue;
            if (e.component === component && e.id === slot) {
                fastSlot = parseInt(index);
                break;
            }
        }
        return fastSlot;
    }
    startUsingItem(player, description, time, data, handler) {
        this.progressBar = new InteractionProgress_class_1.InteractProgressBar(player, description, time, data, handler);
    }
}
exports.Inventory = Inventory;


/***/ },

/***/ "./source/server/modules/inventory/DropItem.module.ts"
/*!************************************************************!*\
  !*** ./source/server/modules/inventory/DropItem.module.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dropInventoryItem = void 0;
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const ItemObject_class_1 = __webpack_require__(/*! ./ItemObject.class */ "./source/server/modules/inventory/ItemObject.class.ts");
/**
 * Drops an inventory item from the player's inventory.
 *
 * @param {PlayerMp} player - The player dropping the item.
 * @param {string} itemData - The data of the item to drop.
 */
const dropInventoryItem = async (player, itemData) => {
    try {
        if (!player.character || !player.character.inventory)
            return;
        const { item, source } = JSON.parse(itemData);
        if (!item)
            return;
        if (player.vehicle) {
            player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You cannot drop an item while in a vehicle.");
            return;
        }
        const playerItem = source.component === "backpack" && source.viewingBackpack
            ? player.character.inventory.getBackpackItemByUUID(source.viewingBackpack, item.hash)
            : player.character.inventory.getItemByUUID(item.hash);
        if (!playerItem) {
            player.character.inventory.setInventory(player);
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "The item you're trying to drop is invalid.");
        }
        if (source.component === "clothes" && item.type === "armour" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ARMOUR */ && item.isPlaced) {
            player.armour = 0;
        }
        const itemInQuickUse = player.character.inventory.isItemInQuickUse(source.component, parseInt(source.slot));
        if (itemInQuickUse !== -1) {
            player.character.inventory.quickUse[itemInQuickUse] = null;
            if (player.fastSlotActive === itemInQuickUse) {
                player.removeAllWeapons();
                player.setVariable("ammoHash", null);
                player.setVariable("itemAsAmmo", null);
                player.fastSlotActive = null;
            }
        }
        if (player.character.inventory.isAmmoItem(playerItem)) {
            let ammoHash = player.getVariable("ammoHash");
            if (ammoHash?.items.includes(playerItem.hash)) {
                ammoHash.items.splice(ammoHash.items.indexOf(playerItem.hash), 1);
                player.setWeaponAmmo(player.weapon, player.weaponAmmo - playerItem.count);
                player.setVariable("ammoHash", ammoHash);
                player.setVariable("itemAsAmmo", ammoHash.items.length ? ammoHash.items[0] : null);
            }
        }
        const { x, y, z } = player.position;
        new ItemObject_class_1.ItemObject({
            hash: playerItem.hash,
            coords: new mp.Vector3(x, y, z - 1),
            rotation: player.character.inventory.isWeapon(playerItem) ? new mp.Vector3(-90, 0, 0) : new mp.Vector3(0, 0, 0),
            collision: false,
            range: 10,
            itemData: { ...playerItem, isPlaced: false }
        });
        if (source.component === "pockets") {
            player.character.inventory.resetItemData(source.component, parseInt(source.slot));
        }
        else if (source.component === "backpack") {
            if (!source.viewingBackpack)
                return;
            const itemData = player.character.inventory.getItemByUUID(source.viewingBackpack);
            if (!itemData || !itemData.items)
                return;
            itemData.items[parseInt(source.slot)] = null;
        }
        else {
            player.character.inventory.resetClothingItemData(parseInt(source.slot));
            player.character.inventory.reloadClothes(player);
        }
        player.character.inventory.setInventory(player);
    }
    catch (err) {
        console.log("dropInventoryItem error: ", err);
    }
};
exports.dropInventoryItem = dropInventoryItem;


/***/ },

/***/ "./source/server/modules/inventory/ItemObject.class.ts"
/*!*************************************************************!*\
  !*** ./source/server/modules/inventory/ItemObject.class.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemObject = void 0;
/**
 * Class representing an item object in the game.
 */
class ItemObject {
    /** Map to store all item objects by their hash. */
    static List = new Map();
    /** The unique identifier for the item object. */
    hash;
    /** The game object representing the item, if it exists. */
    object = null;
    /** The dimension in which the item object exists. */
    dimension;
    /** The coordinates of the item object. */
    coords;
    /** The rotation of the item object. */
    rotation;
    /** Whether the item object has collision enabled. */
    collision;
    /** The range within which the item object is active. */
    range;
    /** The data of the item associated with the object. */
    itemData;
    /** Timeout for removing the item object after a certain period. */
    timeout = null;
    /**
     * Creates an instance of ItemObject.
     * @param data - The data to initialize the item object.
     */
    constructor(data) {
        this.dimension = data.dimension || 0;
        this.coords = data.coords;
        this.rotation = data.rotation;
        this.collision = data.collision;
        this.range = data.range;
        this.itemData = data.itemData;
        this.hash = this.itemData.hash;
        this.object = mp.objects.new(mp.joaat(this.itemData.modelHash ?? "prop_food_bag1"), this.coords, {
            rotation: new mp.Vector3(data.rotation.x, data.rotation.y, data.rotation.z)
        });
        this.update();
        this.timeout = setTimeout(() => {
            if (ItemObject.List.has(this.hash)) {
                this.remove();
            }
        }, 300000);
        ItemObject.List.set(this.hash, this);
    }
    /**
     * Updates the item object properties in the game.
     */
    async update() {
        if (!this.object || !mp.objects.exists(this.object))
            return;
        this.object.setVariables({ is_item: true, itemData: JSON.stringify(this.itemData) });
    }
    /**
     * Removes the item object from the game and clears the timeout.
     */
    remove() {
        if (this.object && mp.objects.exists(this.object)) {
            this.object.destroy();
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        ItemObject.List.delete(this.hash);
    }
    /**
     * Fetches item objects within a certain range of a player.
     * @param player - The player to check the range from.
     * @param range - The range within which to fetch item objects. Defaults to 1.
     * @returns An array of item objects within the specified range.
     */
    static fetchInRange(player, range = 1) {
        const result = [];
        for (const item of ItemObject.List.values()) {
            if (player.dist(item.coords) <= range) {
                result.push(item.itemData);
            }
        }
        return result;
    }
    /**
     * Retrieves an item object by its hash.
     * @param hash - The hash of the item object to retrieve.
     * @returns The item object with the specified hash, or null if not found.
     */
    static getItem(hash) {
        const item = ItemObject.List.get(hash);
        return item ? item.itemData : null;
    }
    /**
     * Deletes a dropped item object by its hash.
     * @param hash - The hash of the item object to delete.
     */
    static deleteDroppedItemByHash(hash) {
        const item = ItemObject.List.get(hash);
        if (item)
            item.remove();
    }
}
exports.ItemObject = ItemObject;


/***/ },

/***/ "./source/server/modules/inventory/Items.module.ts"
/*!*********************************************************!*\
  !*** ./source/server/modules/inventory/Items.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inventoryAssets = void 0;
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
var inventoryAssets;
(function (inventoryAssets) {
    inventoryAssets.items = {
        ["hat" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HAT */]: {
            type: "hat" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HAT */,
            typeCategory: 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */,
            hash: "",
            key: "",
            quality: -1,
            image: "hat.svg",
            render: "hat.svg",
            name: "Hat",
            description: "Headgear.",
            count: 1,
            weight: 0.3,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            modelHash: "prop_proxy_hat_01",
            gender: null,
            isPlaced: false
        },
        ["mask" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MASK */]: {
            type: "mask" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MASK */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "mask.svg",
            render: "mask.svg",
            name: "Mask",
            description: "Completely hides your face.",
            count: 1,
            weight: 0.3,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "p_orleans_mask_s"
        },
        ["glasses" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GLASSES */]: {
            type: "glasses" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GLASSES */,
            typeCategory: 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */,
            hash: "",
            key: "",
            quality: -1,
            image: "glasses.svg",
            render: "glasses.svg",
            name: "Glasses",
            description: "",
            count: 1,
            weight: 0.1,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_cs_sol_glasses"
        },
        ["earRings" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_EARRINGS */]: {
            type: "earRings" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_EARRINGS */,
            typeCategory: 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */,
            hash: "",
            key: "",
            quality: -1,
            image: "earRings.svg",
            render: "earRings.svg",
            name: "Earrings",
            description: "",
            count: 1,
            weight: 0.05,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "p_tmom_earrings_s"
        },
        ["chain" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CHAIN */]: {
            type: "chain" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CHAIN */,
            typeCategory: 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */,
            hash: "",
            key: "",
            quality: -1,
            image: "chain.svg",
            render: "chain.svg",
            name: "Chain",
            description: "Perfect accessory to flex.",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "vw_prop_vw_backpack_01a"
        },
        ["tShirt" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TSHIRT */]: {
            type: "tShirt" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TSHIRT */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "tShirt.svg",
            render: "tShirt.svg",
            name: "T-shirt",
            description: "",
            count: 1,
            weight: 0.3,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_ld_tshirt_01"
        },
        ["top" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TOP */]: {
            type: "top" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TOP */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "top.svg",
            render: "top.svg",
            name: "Jacket",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_ld_shirt_01"
        },
        ["armour" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ARMOUR */]: {
            type: "armour" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ARMOUR */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "armour.svg",
            render: "armour.svg",
            name: "Body armor",
            description: "Provides protection for the upper torso.",
            count: 1,
            weight: 10,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_bodyarmour_03",
            amount: 100
        },
        ["watch" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_WATCH */]: {
            type: "watch" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_WATCH */,
            typeCategory: 1 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_PROP */,
            hash: "",
            key: "",
            quality: -1,
            image: "watch.svg",
            render: "watch.svg",
            name: "Watch",
            description: "Wristwatch.",
            count: 1,
            weight: 0.1,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "vw_prop_vw_backpack_01a"
        },
        ["gloves" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GLOVES */]: {
            type: "gloves" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GLOVES */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "gloves.svg",
            render: "gloves.svg",
            name: "Gloves",
            description: "",
            count: 1,
            weight: 0.1,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "vw_prop_vw_backpack_01a"
        },
        ["pants" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PANTS */]: {
            type: "pants" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PANTS */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "pants.svg",
            render: "pants.svg",
            name: "Pants",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 1,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "bkr_prop_duffel_bag_01a"
        },
        ["shoes" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOES */]: {
            type: "shoes" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOES */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: -1,
            image: "shoes.svg",
            render: "shoes.svg",
            name: "Shoes",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 10,
            options: ["putOn", "drop", "trade"],
            gender: null,
            isPlaced: false,
            modelHash: "v_res_fa_shoebox4"
        },
        ["backpack" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BACKPACK */]: {
            type: "backpack" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BACKPACK */,
            typeCategory: 0 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_CLOTHING */,
            hash: "",
            key: "",
            quality: 0,
            image: "backpack.svg",
            render: "backpack.svg",
            name: "Backpack",
            description: "Increases inventory capacity.",
            count: 1,
            weight: 5,
            maxStack: 1,
            isPlaced: false,
            options: ["open", "putOn", "drop", "trade"],
            gender: null,
            modelHash: "vw_prop_vw_backpack_01a",
            items: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
                9: null,
                10: null,
                11: null,
                12: null,
                13: null,
                14: null,
                15: null,
                16: null,
                17: null,
                18: null,
                19: null,
                20: null,
                21: null,
                22: null,
                23: null
            }
        },
        ["weapon_dagger" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_DAGGER */]: {
            type: "weapon_dagger" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_DAGGER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "dagger.svg",
            render: "dagger.svg",
            name: "dagger",
            description: "",
            count: 1,
            weight: 0.6,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_dagger"
        },
        ["weapon_bat" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BAT */]: {
            type: "weapon_bat" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BAT */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "bat.svg",
            render: "bat.svg",
            name: "bat",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_bat"
        },
        ["weapon_bottle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BOTTLE */]: {
            type: "weapon_bottle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BOTTLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "bottle.svg",
            render: "bottle.svg",
            name: "bottle",
            description: "",
            count: 1,
            weight: 0.3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_bottle"
        },
        ["weapon_crowbar" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CROWBAR */]: {
            type: "weapon_crowbar" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CROWBAR */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "crowbar.svg",
            render: "crowbar.svg",
            name: "crowbar",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_crowbar"
        },
        ["weapon_flashlight" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FLASHLIGHT */]: {
            type: "weapon_flashlight" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FLASHLIGHT */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "flashlight.svg",
            render: "flashlight.svg",
            name: "flashlight",
            description: "",
            count: 1,
            weight: 0.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "WEAPON_FLASHLIGHT"
        },
        ["weapon_golfclub" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GOLFCLUB */]: {
            type: "weapon_golfclub" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GOLFCLUB */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "golfclub.svg",
            render: "golfclub.svg",
            name: "golfclub",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_gclub"
        },
        ["weapon_hammer" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HAMMER */]: {
            type: "weapon_hammer" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HAMMER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "hammer.svg",
            render: "hammer.svg",
            name: "hammer",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_hammer"
        },
        ["weapon_hatchet" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HATCHET */]: {
            type: "weapon_hatchet" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HATCHET */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "hatchet.svg",
            render: "hatchet.svg",
            name: "hatchet",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_hatchet"
        },
        ["weapon_knuckleduster" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_KNUCKLEDUSTER */]: {
            type: "weapon_knuckleduster" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_KNUCKLEDUSTER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "knuckle.svg",
            render: "knuckle.svg",
            name: "knuckle",
            description: "",
            count: 1,
            weight: 0.3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "WEAPON_KNUCKLE"
        },
        ["weapon_knife" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_KNIFE */]: {
            type: "weapon_knife" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_KNIFE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "knife.svg",
            render: "knife.svg",
            name: "knife",
            description: "",
            count: 1,
            weight: 0.6,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_knife_01"
        },
        ["weapon_machete" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MACHETE */]: {
            type: "weapon_machete" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MACHETE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "machete.svg",
            render: "machete.svg",
            name: "machete",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_ld_w_me_machette"
        },
        ["weapon_switchblade" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SWITCHBLADE */]: {
            type: "weapon_switchblade" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SWITCHBLADE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "switchblade.svg",
            render: "switchblade.svg",
            name: "switchblade",
            description: "",
            count: 1,
            weight: 0.3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "WEAPON_SWITCHBLADE"
        },
        ["weapon_nightstick" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_NIGHTSTICK */]: {
            type: "weapon_nightstick" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_NIGHTSTICK */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "nightstick.svg",
            render: "nightstick.svg",
            name: "nightstick",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_me_nightstick"
        },
        ["weapon_wrench" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_WRENCH */]: {
            type: "weapon_wrench" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_WRENCH */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "wrench.svg",
            render: "wrench.svg",
            name: "wrench",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_tool_wrench"
        },
        ["weapon_battleaxe" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BATTLEAXE */]: {
            type: "weapon_battleaxe" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BATTLEAXE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "battleaxe.svg",
            render: "battleaxe.svg",
            name: "battleaxe",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_ld_fireaxe"
        },
        ["weapon_poolcue" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_POOLCUE */]: {
            type: "weapon_poolcue" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_POOLCUE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "poolcue.svg",
            render: "poolcue.svg",
            name: "poolcue",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_pool_cue"
        },
        ["weapon_pistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL */]: {
            type: "weapon_pistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "pistol.svg",
            render: "pistol.svg",
            name: "Pistol",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_pistol_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL_MK2 */]: {
            type: "weapon_pistol_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "pistolmk2.svg",
            render: "pistolmk2.svg",
            name: "MK2 Pistol",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_combatpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATPISTOL */]: {
            type: "weapon_combatpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "combatpistol.svg",
            render: "combatpistol.svg",
            name: "Combat Pistol",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_combatpistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_appistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_APPISTOL */]: {
            type: "weapon_appistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_APPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "appistol.svg",
            render: "appistol.svg",
            name: "Pistol AP",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_appistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_stungun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_STUNGUN */]: {
            type: "weapon_stungun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_STUNGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "stungun.svg",
            render: "stungun.svg",
            name: "Stungun",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_stungun"
        },
        ["weapon_pistol50" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL50 */]: {
            type: "weapon_pistol50" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL50 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "pistol50.svg",
            render: "pistol50.svg",
            name: "Pistol 50",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_pistol50",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_snspistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNSPISTOL */]: {
            type: "weapon_snspistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNSPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "snspistol.svg",
            render: "snspistol.svg",
            name: "SNS Pistol",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_sns_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_snspistol_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNSPISTOL_MK2 */]: {
            type: "weapon_snspistol_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNSPISTOL_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "snspistolmk2.svg",
            render: "snspistolmk2.svg",
            name: "MK2 SNS Pistol",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_sns_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_heavypistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYPISTOL */]: {
            type: "weapon_heavypistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "heavypistol.svg",
            render: "heavypistol.svg",
            name: "Heavy Pistol",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_heavypistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_vintagepistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_VINTAGEPISTOL */]: {
            type: "weapon_vintagepistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_VINTAGEPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "vintagepistol.svg",
            render: "vintagepistol.svg",
            name: "Vintage Pistol",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_vintage_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_flaregun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FLAREGUN */]: {
            type: "weapon_flaregun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FLAREGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "flaregun.svg",
            render: "flaregun.svg",
            name: "Flaregun",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_flaregun",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_marksmanpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MARKSMANPISTOL */]: {
            type: "weapon_marksmanpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MARKSMANPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "marksmanpistol.svg",
            render: "marksmanpistol.svg",
            name: "Marksman Pistol",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_marksmanpistol ",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_revolver" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_REVOLVER */]: {
            type: "weapon_revolver" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_REVOLVER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "revolver.svg",
            render: "heavyrevolver.svg",
            name: "revolver",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_revolver",
            ammoType: "REVOLVERAMMO"
        },
        ["weapon_revolvermk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_REVOLVERMK2 */]: {
            type: "weapon_revolvermk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_REVOLVERMK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "revolvermk2.svg",
            render: "revolvermk2.svg",
            name: "revolvermk2",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_revolver",
            ammoType: "REVOLVERAMMO"
        },
        ["weapon_doubleaction" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_DOUBLEACTION */]: {
            type: "weapon_doubleaction" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_DOUBLEACTION */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "doubleaction.svg",
            render: "doubleaction.svg",
            name: "doubleaction",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_space_pistol",
            ammoType: "REVOLVERAMMO"
        },
        ["weapon_raypistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RAYPISTOL */]: {
            type: "weapon_raypistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RAYPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "raypistol.svg",
            render: "raypistol.svg",
            name: "raypistol",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_space_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_ceramicpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CERAMICPISTOL */]: {
            type: "weapon_ceramicpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CERAMICPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "ceramicpistol.svg",
            render: "ceramicpistol.svg",
            name: "ceramicpistol",
            description: "",
            count: 1,
            weight: 1.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_space_pistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_navyrevolver" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_NAVYREVOLVER */]: {
            type: "weapon_navyrevolver" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_NAVYREVOLVER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "navyrevolver.svg",
            render: "navyrevolver.svg",
            name: "navyrevolver",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_space_pistol",
            ammoType: "REVOLVERAMMO"
        },
        ["weapon_gadgetpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GADGETPISTOL */]: {
            type: "weapon_gadgetpistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GADGETPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "gadgetpistol.svg",
            render: "gadgetpistol.svg",
            name: "gadgetpistol",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_heavypistol",
            ammoType: "PISTOLAMMO"
        },
        ["weapon_stungunmp" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_STUNGUNMP */]: {
            type: "weapon_stungunmp" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_STUNGUNMP */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "stungun.svg",
            render: "stungun.svg",
            name: "stungun",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_pi_stungun"
        },
        ["weapon_microsmg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MICROSMG */]: {
            type: "weapon_microsmg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MICROSMG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "microsmg.svg",
            render: "microsmg.svg",
            name: "microsmg",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sb_microsmg",
            ammoType: "SMGAMMO"
        },
        ["weapon_smg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMG */]: {
            type: "weapon_smg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "smg.svg",
            render: "smg.svg",
            name: "smg",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sb_smg",
            ammoType: "SMGAMMO"
        },
        ["weapon_smg_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMG_MK2 */]: {
            type: "weapon_smg_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMG_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "smgmk2.svg",
            render: "smgmk2.svg",
            name: "smgmk2",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sb_smg",
            ammoType: "SMGAMMO"
        },
        ["weapon_assaultsmg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTSMG */]: {
            type: "weapon_assaultsmg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTSMG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "assaultsmg.svg",
            render: "assaultsmg.svg",
            name: "assaultsmg",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sb_assaultsmg",
            ammoType: "SMGAMMO"
        },
        ["weapon_combatpdw" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATPDW */]: {
            type: "weapon_combatpdw" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATPDW */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "combatpdw.svg",
            render: "combatpdw.svg",
            name: "combatpdw",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "WEAPON_COMBATPDW",
            ammoType: "SMGAMMO"
        },
        ["weapon_machinepistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MACHINEPISTOL */]: {
            type: "weapon_machinepistol" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MACHINEPISTOL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "machinepistol.svg",
            render: "machinepistol.svg",
            name: "machinepistol",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "WEAPON_MACHINEPISTOL",
            ammoType: "SMGAMMO"
        },
        ["weapon_minismg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MINISMG */]: {
            type: "weapon_minismg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MINISMG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "minismg.svg",
            render: "minismg.svg",
            name: "minismg",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "WEAPON_MINISMG",
            ammoType: "SMGAMMO"
        },
        ["weapon_raycarbine" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RAYCARBINE */]: {
            type: "weapon_raycarbine" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RAYCARBINE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "raycarbine.svg",
            render: "raycarbine.svg",
            name: "raycarbine",
            description: "",
            count: 1,
            weight: 2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_carbinerifle",
            ammoType: "SMGAMMO"
        },
        ["weapon_pumpshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PUMPSHOTGUN */]: {
            type: "weapon_pumpshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PUMPSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "pumpshotgun.svg",
            render: "pumpshotgun.svg",
            name: "pumpshotgun",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_pumpshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_pumpshotgun_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PUMPSHOTGUN_MK2 */]: {
            type: "weapon_pumpshotgun_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PUMPSHOTGUN_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "pumpshotgunmk2.svg",
            render: "pumpshotgunmk2.svg",
            name: "pumpshotgunmk2",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_pumpshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_sawnoffshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SAWNOFFSHOTGUN */]: {
            type: "weapon_sawnoffshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SAWNOFFSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "sawnoffshotgun.svg",
            render: "sawnoffshotgun.svg",
            name: "sawnoffshotgun",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_sawnoff",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_assaultshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTSHOTGUN */]: {
            type: "weapon_assaultshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "assaultshotgun.svg",
            render: "assaultshotgun.svg",
            name: "assaultshotgun",
            description: "",
            count: 1,
            weight: 7,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_assaultshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_bullpupshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BULLPUPSHOTGUN */]: {
            type: "weapon_bullpupshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BULLPUPSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "bullpupshotgun.svg",
            render: "bullpupshotgun.svg",
            name: "bullpupshotgun",
            description: "",
            count: 1,
            weight: 7,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_bullpupshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_mukset" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MUKSET */]: {
            type: "weapon_mukset" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MUKSET */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "musket.svg",
            render: "musket.svg",
            name: "musket",
            description: "",
            count: 1,
            weight: 4.5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_musket",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_heavyshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYSHOTGUN */]: {
            type: "weapon_heavyshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "heavyshotgun.svg",
            render: "heavyshotgun.svg",
            name: "heavyshotgun",
            description: "",
            count: 1,
            weight: 7,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_heavyshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_dbshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_DBSHOTGUN */]: {
            type: "weapon_dbshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_DBSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "dbshotgun.svg",
            render: "dbshotgun.svg",
            name: "dbshotgun",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_assaultshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_autoshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_AUTOSHOTGUN */]: {
            type: "weapon_autoshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_AUTOSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "autoshotgun.svg",
            render: "autoshotgun.svg",
            name: "autoshotgun",
            description: "",
            count: 1,
            weight: 7,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_assaultshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_combatshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATSHOTGUN */]: {
            type: "weapon_combatshotgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATSHOTGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "combatshotgun.svg",
            render: "combatshotgun.svg",
            name: "combatshotgun",
            description: "",
            count: 1,
            weight: 7,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sg_assaultshotgun",
            ammoType: "SHOTGUNAMMO"
        },
        ["weapon_assaultrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTRIFLE */]: {
            type: "weapon_assaultrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "assaultrifle.svg",
            render: "assaultrifle.svg",
            name: "assaultrifle",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_assaultrifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_assaultrifle_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTRIFLE_MK2 */]: {
            type: "weapon_assaultrifle_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ASSAULTRIFLE_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "assaultriflemk2.svg",
            render: "assaultriflemk2.svg",
            name: "assaultriflemk2",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_assaultrifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_carbinerifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CARBINERIFLE */]: {
            type: "weapon_carbinerifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CARBINERIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "carbinerifle.svg",
            render: "carbinerifle.svg",
            name: "carbinerifle",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_carbinerifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_carbinerifle_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CARBINERIFLE_MK2 */]: {
            type: "weapon_carbinerifle_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_CARBINERIFLE_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "carbineriflemk2.svg",
            render: "carbineriflemk2.svg",
            name: "carbineriflemk2",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_carbinerifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_advancedrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ADVANCEDRIFLE */]: {
            type: "weapon_advancedrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_ADVANCEDRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "advancedrifle.svg",
            render: "advancedrifle.svg",
            name: "advancedrifle",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_advancedrifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_specialcarbine" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SPECIALCARBINE */]: {
            type: "weapon_specialcarbine" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SPECIALCARBINE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "specialcarbine.svg",
            render: "specialcarbine.svg",
            name: "specialcarbine",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_specialcarbine",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_specialcarbine_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SPECIALCARBINE_MK2 */]: {
            type: "weapon_specialcarbine_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SPECIALCARBINE_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "specialcarbinemk2.svg",
            render: "specialcarbinemk2.svg",
            name: "specialcarbinemk2",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_specialcarbine",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_bullpuprifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BULLPUPRIFLE */]: {
            type: "weapon_bullpuprifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BULLPUPRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "bullpuprifle.svg",
            render: "bullpuprifle.svg",
            name: "bullpuprifle",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_bullpuprifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_bullpuprifle_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BULLPUPRIFLE_MK2 */]: {
            type: "weapon_bullpuprifle_mk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BULLPUPRIFLE_MK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "bullpupriflemk2.svg",
            render: "bullpupriflemk2.svg",
            name: "bullpupriflemk2",
            description: "",
            count: 1,
            weight: 4,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_bullpuprifle",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_compactrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMPACTRIFLE */]: {
            type: "weapon_compactrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMPACTRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "compactrifle.svg",
            render: "compactrifle.svg",
            name: "compactrifle",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_assaultrifle_smg",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_militaryrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MILITARYRIFLE */]: {
            type: "weapon_militaryrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MILITARYRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "militaryrifle.svg",
            render: "militaryrifle.svg",
            name: "militaryrifle",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_assaultrifle_smg",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_heavyrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYRIFLE */]: {
            type: "weapon_heavyrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "heavyrifle.svg",
            render: "heavyrifle.svg",
            name: "heavyrifle",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_assaultrifle_smg",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_tacticalrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TACTICALRIFLE */]: {
            type: "weapon_tacticalrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_TACTICALRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "tacticalrifle.svg",
            render: "tacticalrifle.svg",
            name: "tacticalrifle",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_assaultrifle_smg",
            ammoType: "RIFLEAMMO"
        },
        ["weapon_mg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MG */]: {
            type: "weapon_mg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "mg.svg",
            render: "mg.svg",
            name: "mg",
            description: "",
            count: 1,
            weight: 15,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_mg_mg",
            ammoType: "LMGAMMO"
        },
        ["weapon_combatmg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATMG */]: {
            type: "weapon_combatmg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATMG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "combatmg.svg",
            render: "combatmg.svg",
            name: "combatmg",
            description: "",
            count: 1,
            weight: 15,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_mg_combatmg",
            ammoType: "LMGAMMO"
        },
        ["weapon_combatmgmk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATMGMK2 */]: {
            type: "weapon_combatmgmk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMBATMGMK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "combatmgmk2.svg",
            render: "combatmgmk2.svg",
            name: "combatmgmk2",
            description: "",
            count: 1,
            weight: 15,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_mg_combatmg",
            ammoType: "LMGAMMO"
        },
        ["weapon_gusenberg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GUSENBERG */]: {
            type: "weapon_gusenberg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GUSENBERG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "gusenberg.svg",
            render: "gusenberg.svg",
            name: "gusenberg",
            description: "",
            count: 1,
            weight: 15,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sb_gusenberg",
            ammoType: "LMGAMMO"
        },
        ["weapon_sniperrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNIPERRIFLE */]: {
            type: "weapon_sniperrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNIPERRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "sniperrifle.svg",
            render: "sniperrifle.svg",
            name: "sniperrifle",
            description: "",
            count: 1,
            weight: 10,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sr_sniperrifle",
            ammoType: "SNIPERAMMO"
        },
        ["weapon_heavysniper" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYSNIPER */]: {
            type: "weapon_heavysniper" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYSNIPER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "heavysniper.svg",
            render: "heavysniper.svg",
            name: "heavysniper",
            description: "",
            count: 1,
            weight: 15,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sr_heavysniper",
            ammoType: "SNIPERAMMO"
        },
        ["weapon_heavysnipermk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYSNIPERMK2 */]: {
            type: "weapon_heavysnipermk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HEAVYSNIPERMK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "heavysnipermk2.svg",
            render: "heavysnipermk2.svg",
            name: "heavysnipermk2",
            description: "",
            count: 1,
            weight: 15,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sr_heavysniper",
            ammoType: "SNIPERAMMO"
        },
        ["weapon_marksmanrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MARKSMANRIFLE */]: {
            type: "weapon_marksmanrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MARKSMANRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "marksmanrifle.svg",
            render: "marksmanrifle.svg",
            name: "marksmanrifle",
            description: "",
            count: 1,
            weight: 8,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sr_marksmanrifle",
            ammoType: "SNIPERAMMO"
        },
        ["weapon_marksmanriflemk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MARKSMANRIFLEMK2 */]: {
            type: "weapon_marksmanriflemk2" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MARKSMANRIFLEMK2 */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "marksmanriflemk2.svg",
            render: "marksmanriflemk2.svg",
            name: "marksmanriflemk2",
            description: "",
            count: 1,
            weight: 8,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sr_marksmanrifle",
            ammoType: "SNIPERAMMO"
        },
        ["weapon_precisionrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PRECISIONRIFLE */]: {
            type: "weapon_precisionrifle" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PRECISIONRIFLE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "precisionrifle.svg",
            render: "precisionrifle.svg",
            name: "precisionrifle",
            description: "",
            count: 1,
            weight: 8,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_sr_marksmanrifle",
            ammoType: "SNIPERAMMO"
        },
        ["weapon_compactlauncher" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMPACTLAUNCHER */]: {
            type: "weapon_compactlauncher" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_COMPACTLAUNCHER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "compactlauncher.svg",
            render: "compactlauncher.svg",
            name: "compactlauncher",
            description: "",
            count: 1,
            weight: 3,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_lr_grenadelauncher",
            ammoType: ""
        },
        ["weapon_firework" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FIREWORK */]: {
            type: "weapon_firework" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FIREWORK */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "firework.svg",
            render: "firework.svg",
            name: "firework",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_lr_firework",
            ammoType: ""
        },
        ["weapon_grenadelaunchersmoke" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GRENADELAUNCHERSMOKE */]: {
            type: "weapon_grenadelaunchersmoke" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GRENADELAUNCHERSMOKE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "granadelaunchersmoke.svg",
            render: "granadelaunchersmoke.svg",
            name: "granadelaunchersmoke",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_lr_grenadelauncher",
            ammoType: ""
        },
        ["weapon_grenadelauncher" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GRENADELAUNCHER */]: {
            type: "weapon_grenadelauncher" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GRENADELAUNCHER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "grenadelauncher.svg",
            render: "grenadelauncher.svg",
            name: "grenadelauncher",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_lr_grenadelauncher",
            ammoType: ""
        },
        ["weapon_hominglauncher" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HOMINGLAUNCHER */]: {
            type: "weapon_hominglauncher" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_HOMINGLAUNCHER */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "hominglauncher.svg",
            render: "hominglauncher.svg",
            name: "hominglauncher",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_lr_homing",
            ammoType: ""
        },
        ["weapon_minigun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MINIGUN */]: {
            type: "weapon_minigun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MINIGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "minigun.svg",
            render: "minigun.svg",
            name: "minigun",
            description: "",
            count: 1,
            weight: 10,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_mg_minigun",
            ammoType: ""
        },
        ["weapon_railgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RAILGUN */]: {
            type: "weapon_railgun" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RAILGUN */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "railgun.svg",
            render: "railgun.svg",
            name: "railgun",
            description: "",
            count: 1,
            weight: 6,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ar_railgun",
            ammoType: ""
        },
        ["weapon_rpg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RPG */]: {
            type: "weapon_rpg" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RPG */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "rpg.svg",
            render: "rpg.svg",
            name: "rpg",
            description: "",
            count: 1,
            weight: 5,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_lr_rpg",
            ammoType: ""
        },
        ["weapon_ball" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BALL */]: {
            type: "weapon_ball" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BALL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "ball.svg",
            render: "ball.svg",
            name: "ball",
            description: "",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_golf_ball"
        },
        ["weapon_bzgas" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BZGAS */]: {
            type: "weapon_bzgas" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_BZGAS */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "bzgas.svg",
            render: "bzgas.svg",
            name: "bzgas",
            description: "",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_gas_grenade"
        },
        ["weapon_smokegrenade" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMOKEGRENADE */]: {
            type: "weapon_smokegrenade" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMOKEGRENADE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "smokegrenade.svg",
            render: "smokegrenade.svg",
            name: "smokegrenade",
            description: "",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_gas_grenade"
        },
        ["weapon_flare" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FLARE */]: {
            type: "weapon_flare" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_FLARE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "flare.svg",
            render: "flare.svg",
            name: "flare",
            description: "",
            count: 1,
            weight: 0.1,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_am_flare"
        },
        ["weapon_grenade" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GRENADE */]: {
            type: "weapon_grenade" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_GRENADE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "grenade.svg",
            render: "grenade.svg",
            name: "grenade",
            description: "",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ex_grenadefrag"
        },
        ["weapon_molotov" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MOLOTOV */]: {
            type: "weapon_molotov" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MOLOTOV */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "molotov.svg",
            render: "molotov.svg",
            name: "molotov",
            description: "",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ex_molotov"
        },
        ["weapon_proximitymine" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PROXIMITYMINE */]: {
            type: "weapon_proximitymine" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PROXIMITYMINE */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "proximymine.svg",
            render: "proximymine.svg",
            name: "proximymine",
            description: "",
            count: 1,
            weight: 12,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ex_apmine"
        },
        ["weapon_pipebomb" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PIPEBOMB */]: {
            type: "weapon_pipebomb" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PIPEBOMB */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "pipebomb.svg",
            render: "pipebomb.svg",
            name: "pipebomb",
            description: "",
            count: 1,
            weight: 10,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_bomb_01_s"
        },
        ["weapon_snowball" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNOWBALL */]: {
            type: "weapon_snowball" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SNOWBALL */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "snowball.svg",
            render: "snowball.svg",
            name: "snowball",
            description: "",
            count: 1,
            weight: 0.2,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "w_ex_snowball"
        },
        ["weapon_stickybomb" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_STICKYBOMB */]: {
            type: "weapon_stickybomb" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_STICKYBOMB */,
            typeCategory: 2 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_WEAPON */,
            hash: "",
            key: "",
            quality: 0,
            image: "stickybomb.svg",
            render: "stickybomb.svg",
            name: "stickybomb",
            description: "",
            count: 1,
            weight: 10,
            maxStack: 1,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_bomb_01_s"
        },
        ["pistol_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOLAMMO */]: {
            type: "pistol_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOLAMMO */,
            typeCategory: 3 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_AMMO */,
            hash: "",
            key: "",
            quality: 0,
            image: "pistol_ammo.svg",
            render: "pistol_ammo.svg",
            name: "Pistol Ammo",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 60,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_box_ammo01a"
        },
        ["smg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMGAMMO */]: {
            type: "smg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMGAMMO */,
            typeCategory: 3 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_AMMO */,
            hash: "",
            key: "",
            quality: 0,
            image: "smg_ammo.svg",
            render: "smg_ammo.svg",
            name: "SMG Ammo",
            description: "Ammunition to be used on Sub Machine Guns",
            count: 1,
            weight: 1,
            maxStack: 60,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_box_ammo01a"
        },
        ["shotgun_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOTGUNAMMO */]: {
            type: "shotgun_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOTGUNAMMO */,
            typeCategory: 3 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_AMMO */,
            hash: "",
            key: "",
            quality: 0,
            image: "shotgun_ammo.svg",
            render: "shotgun_ammo.svg",
            name: "Shotgun Ammo",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 30,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_box_ammo01a"
        },
        ["mg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MGAMMO */]: {
            type: "mg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MGAMMO */,
            typeCategory: 3 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_AMMO */,
            hash: "",
            key: "",
            quality: 0,
            image: "mg_ammo.svg",
            render: "mg_ammo.svg",
            name: "Machine Gun Ammo",
            description: "",
            count: 1,
            weight: 10,
            maxStack: 100,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_box_ammo01a"
        },
        ["rifle_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RIFLEAMMO */]: {
            type: "rifle_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RIFLEAMMO */,
            typeCategory: 3 /* RageShared.Inventory.Enums.ITEM_TYPE_CATEGORY.TYPE_AMMO */,
            hash: "",
            key: "",
            quality: 0,
            image: "rifle_ammo.svg",
            render: "rifle_ammo.svg",
            name: "Rifle Ammo",
            description: "",
            count: 1,
            weight: 1,
            maxStack: 100,
            options: ["drop", "trade", "fast"],
            gender: null,
            isPlaced: false,
            modelHash: "prop_box_ammo01a"
        }
    };
})(inventoryAssets || (exports.inventoryAssets = inventoryAssets = {}));


/***/ },

/***/ "./source/server/modules/inventory/MoveItem.module.ts"
/*!************************************************************!*\
  !*** ./source/server/modules/inventory/MoveItem.module.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.moveInventoryItem = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const ItemObject_class_1 = __webpack_require__(/*! ./ItemObject.class */ "./source/server/modules/inventory/ItemObject.class.ts");
const utils_module_1 = __webpack_require__(/*! @shared/utils.module */ "./source/shared/utils.module.ts");
async function moveBackpackItem(player, data) {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    const { source, target, backpackHash } = utils_module_1.Utils.parseObject(data);
    const draggedFrom = source;
    const droppedTo = target;
    if (!backpackHash)
        return player.character.inventory.setInventory(player);
    const backpackData = player.character.inventory.getItemByUUID(backpackHash);
    if (!backpackData || !backpackData.items)
        return player.character.inventory.setInventory(player);
    const fromIndex = parseInt(draggedFrom.slot);
    const toIndex = parseInt(droppedTo.slot);
    if (droppedTo.component === "backpack") {
        const draggedFromItemData = draggedFrom.component === "backpack"
            ? backpackData.items[fromIndex]
            : player.character.inventory.items[draggedFrom.component][fromIndex];
        if (!draggedFromItemData) {
            player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You're trying to move an invalid item.");
            return player.character.inventory.setInventory(player);
        }
        const droptoItemData = backpackData.items[toIndex];
        if (draggedFrom.component === "backpack") {
            backpackData.items[toIndex] = draggedFromItemData;
            backpackData.items[fromIndex] = droptoItemData || null;
        }
        else {
            backpackData.items[toIndex] = { ...draggedFromItemData, isPlaced: false };
            player.character.inventory.items[draggedFrom.component][fromIndex] = droptoItemData || null;
            if (draggedFrom.component === "clothes") {
                player.character.inventory.reloadClothes(player);
            }
        }
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, droptoItemData ? "You swapped items." : "Item moved.");
        player.character.inventory.setInventory(player);
        return;
    }
    const droptoItemData = player.character.inventory.items[droppedTo.component][toIndex];
    const dragFromItemData = backpackData.items[fromIndex];
    player.character.inventory.items[droppedTo.component][toIndex] = dragFromItemData
        ? { ...dragFromItemData, isPlaced: droppedTo.component === "clothes" ? true : false }
        : null;
    backpackData.items[fromIndex] = droptoItemData || null;
    if (droppedTo.component === "clothes") {
        player.character.inventory.reloadClothes(player);
    }
    player.character.inventory.setInventory(player);
}
async function moveQuickuseItem(player, data) {
    if (!player.character || !player.character.inventory)
        return;
    const { item, source, target } = JSON.parse(data);
    const playerItem = player.character.inventory.getItemByUUID(item.hash);
    if (!playerItem) {
        player.character.inventory.setInventory(player);
        return;
    }
    const draggedFrom = source;
    const droppedTo = target;
    if (droppedTo.component === "quickUse" && draggedFrom.component === "quickUse") {
        const dropToItemData = player.character.inventory.quickUse[parseInt(droppedTo.slot)];
        const dragFromItemData = player.character.inventory.quickUse[parseInt(draggedFrom.slot)];
        if (!dragFromItemData)
            return;
        if (!dropToItemData) {
            player.character.inventory.quickUse[parseInt(droppedTo.slot)] = dragFromItemData;
            player.character.inventory.quickUse[parseInt(draggedFrom.slot)] = null;
            if (player.fastSlotActive == parseInt(draggedFrom.slot)) {
                player.fastSlotActive = parseInt(droppedTo.slot);
            }
            player.character.inventory.setInventory(player);
            return;
        }
        player.character.inventory.quickUse[parseInt(droppedTo.slot)] = { ...dragFromItemData };
        player.character.inventory.quickUse[parseInt(draggedFrom.slot)] = { ...dropToItemData };
        player.character.inventory.setInventory(player);
        return;
    }
    if (droppedTo.component === "quickUse") {
        if (player.character.inventory.isWeapon(playerItem)) {
            if (player.character.inventory.hasWeaponInFastSlot(playerItem.type)) {
                player.character.inventory.quickUse[parseInt(droppedTo.slot)] = null;
                player.character.inventory.setInventory(player);
                return;
            }
            player.character.inventory.equippedWeapons[parseInt(droppedTo.slot)] = {
                isActive: false,
                weaponhash: mp.joaat(item.type)
            };
            player.character.inventory.quickUse[parseInt(droppedTo.slot)] = { component: draggedFrom.component, id: parseInt(draggedFrom.slot) };
            player.character.inventory.setInventory(player);
            return;
        }
        player.character.inventory.quickUse[parseInt(droppedTo.slot)] = { component: draggedFrom.component, id: parseInt(draggedFrom.slot) };
        player.character.inventory.setInventory(player);
        return;
    }
    if (droppedTo.component === "pockets" && player.character.inventory.isWeapon(playerItem)) {
        player.removeAllWeapons();
        player.character.inventory.quickUse[parseInt(draggedFrom.slot)] = null;
        player.character.inventory.setInventory(player);
    }
}
async function moveClothingItem(player, data) {
    try {
        if (!mp.players.exists(player) || !player.character?.inventory)
            return;
        const { item, source, target } = JSON.parse(data);
        const draggedFrom = source;
        const droppedTo = target;
        const inventory = player.character.inventory;
        const notifyPlayer = (type, message) => {
            player.showNotify(type, message);
        };
        if (draggedFrom.component === "clothes" && droppedTo.component !== "clothes") {
            const draggedFromSlotData = inventory.items[draggedFrom.component][draggedFrom.slot];
            const droppedToSlotData = inventory.items[droppedTo.component][droppedTo.slot];
            if (!draggedFromSlotData)
                return;
            if (!droppedToSlotData) {
                inventory.items[droppedTo.component][droppedTo.slot] = { ...draggedFromSlotData, isPlaced: false };
                inventory.resetClothingItemData(draggedFrom.slot);
                inventory.loadClothes(player, draggedFrom.slot, null);
                inventory.setInventory(player);
                notifyPlayer("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You unequipped ${draggedFromSlotData.name}`);
                return;
            }
            notifyPlayer("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, "There was an item at dropped slot, swapping them up!");
            const droppedToItem = { ...droppedToSlotData };
            inventory.items[droppedTo.component][droppedTo.slot] = { ...draggedFromSlotData, isPlaced: false };
            inventory.items[draggedFrom.component][draggedFrom.slot] = { ...droppedToItem, isPlaced: true };
            inventory.loadClothes(player, draggedFrom.slot, JSON.parse(droppedToItem.key.replace(droppedToItem.type, "")));
            inventory.setInventory(player);
            return;
        }
        if (droppedTo.component === "clothes" && draggedFrom.component !== "clothes") {
            const draggedFromData = draggedFrom.component === "groundItems" ? ItemObject_class_1.ItemObject.getItem(item.hash) : inventory.items[draggedFrom.component][draggedFrom.slot];
            if (!draggedFromData)
                return;
            const droppedToData = inventory.items[droppedTo.component][droppedTo.slot];
            if (draggedFrom.component === "groundItems") {
                console.log("what u want?", draggedFromData);
                inventory.items.clothes[droppedTo.slot] = { ...draggedFromData, isPlaced: true };
                ItemObject_class_1.ItemObject.deleteDroppedItemByHash(item.hash);
                inventory.loadClothes(player, droppedTo.slot, JSON.parse(draggedFromData.key.replace(draggedFromData.type, "")));
                notifyPlayer("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You equipped ${draggedFromData.name}`);
                inventory.setInventory(player);
                return;
            }
            if (droppedToData && droppedToData.isPlaced) {
                const oldClothes = { ...droppedToData, isPlaced: false };
                inventory.items[droppedTo.component][droppedTo.slot] = { ...draggedFromData, isPlaced: true };
                inventory.items[draggedFrom.component][draggedFrom.slot] = oldClothes;
                notifyPlayer("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "You swapped clothes");
                inventory.loadClothes(player, droppedTo.slot, JSON.parse(draggedFromData.key.replace(draggedFromData.type, "")));
            }
            else {
                inventory.items[droppedTo.component][droppedTo.slot] = { ...draggedFromData, isPlaced: true };
                inventory.items[draggedFrom.component][draggedFrom.slot] = null;
                inventory.loadClothes(player, droppedTo.slot, JSON.parse(draggedFromData.key.replace(draggedFromData.type, "")));
                notifyPlayer("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `You equipped ${draggedFromData.name}`);
            }
            inventory.setInventory(player);
        }
    }
    catch (err) {
        console.error("moveClothingItem error: ", err);
    }
}
const moveInventoryItem = async (player, data) => {
    try {
        if (!mp.players.exists(player) || !player.character || !player.character.inventory)
            return;
        const { item, source, target } = utils_module_1.Utils.parseObject(data);
        const draggedFrom = source;
        const droppedTo = target;
        switch (true) {
            case draggedFrom.component === "backpack" || droppedTo.component === "backpack": {
                await moveBackpackItem(player, data);
                return;
            }
            case draggedFrom.component === "groundItems" || droppedTo.component === "groundItems": {
                if (droppedTo.component === "groundItems")
                    return;
                const droppedItem = ItemObject_class_1.ItemObject.List.get(item.hash);
                if (!droppedItem)
                    return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Couldnt find that item on the ground");
                droppedItem.remove();
                player.character.inventory.items[droppedTo.component][parseInt(droppedTo.slot)] = {
                    ...item,
                    isPlaced: droppedTo.component === "clothes" ? true : false,
                    hash: (0, uuid_1.v4)()
                };
                if (droppedTo.component === "clothes")
                    player.character.inventory.reloadClothes(player);
                player.character.inventory.setInventory(player);
                return;
            }
            case draggedFrom.component === "clothes" || droppedTo.component === "clothes": {
                await moveClothingItem(player, data);
                return;
            }
            case draggedFrom.component === "quickUse" || droppedTo.component === "quickUse": {
                await moveQuickuseItem(player, data);
                return;
            }
            case draggedFrom.component === droppedTo.component && droppedTo.item && item.type === droppedTo.item.type: {
                let difference = 0;
                let targetItem = player.character.inventory.items[droppedTo.component][parseInt(droppedTo.slot)];
                let sourceItem = player.character.inventory.items[draggedFrom.component][parseInt(draggedFrom.slot)];
                if (!targetItem || !sourceItem)
                    return;
                let targetItemCount = targetItem.count;
                let sourceItemCount = sourceItem.count;
                if (targetItemCount + sourceItemCount > targetItem.maxStack) {
                    difference = targetItem?.count + sourceItem.count - targetItem.maxStack;
                    targetItem.count = targetItem.maxStack;
                    if (sourceItem.count <= 0) {
                        sourceItem = null;
                    }
                    else {
                        sourceItem.count = difference;
                    }
                }
                else {
                    targetItem.count += sourceItem.count;
                    player.character.inventory.items[draggedFrom.component][parseInt(draggedFrom.slot)] = null;
                }
                if (droppedTo.item.type && player.character.inventory.isAmmoItem(droppedTo.item)) {
                    await player.character.inventory.reloadWeaponAmmo(player, droppedTo.item.type);
                }
                break;
            }
            default: {
                if (item.type && droppedTo.item && droppedTo.item.type === item.type) {
                    if (item.count + droppedTo.item.count <= item.maxStack) {
                        item.count = item.count + droppedTo.item.count;
                        player.character.inventory.items[droppedTo.component][parseInt(droppedTo.slot)] = item;
                        player.character.inventory.items[draggedFrom.component][parseInt(draggedFrom.slot)] = null;
                        if (player.character.inventory.isAmmoItem(item) || player.character.inventory.isAmmoItem(droppedTo.item)) {
                            player.character.inventory.reloadWeaponAmmo(player, item.type);
                        }
                    }
                }
                else {
                    const [draggedItemInQuickUse, dropToItemInQuickUse] = [
                        player.character.inventory.checkQuickUse(draggedFrom.component, parseInt(draggedFrom.slot)),
                        player.character.inventory.checkQuickUse(droppedTo.component, parseInt(droppedTo.slot))
                    ];
                    if (draggedItemInQuickUse !== -1) {
                        player.character.inventory.quickUse[draggedItemInQuickUse] = { component: droppedTo.component, id: parseInt(droppedTo.slot) };
                    }
                    if (dropToItemInQuickUse !== -1) {
                        player.character.inventory.quickUse[dropToItemInQuickUse] = { component: draggedFrom.component, id: parseInt(draggedFrom.slot) };
                    }
                    player.character.inventory.items[draggedFrom.component][parseInt(draggedFrom.slot)] = droppedTo.item;
                    player.character.inventory.items[droppedTo.component][parseInt(droppedTo.slot)] = item;
                }
                break;
            }
        }
        player.character.inventory.setInventory(player);
    }
    catch (err) {
        console.log("moveItemToTrunk err: ", err);
    }
};
exports.moveInventoryItem = moveInventoryItem;


/***/ },

/***/ "./source/server/modules/inventory/Quickuse.module.ts"
/*!************************************************************!*\
  !*** ./source/server/modules/inventory/Quickuse.module.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.manageInventoryFastSlot = void 0;
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
const Weapons_assets_1 = __webpack_require__(/*! @assets/Weapons.assets */ "./source/server/assets/Weapons.assets.ts");
const Items_module_1 = __webpack_require__(/*! ./Items.module */ "./source/server/modules/inventory/Items.module.ts");
async function giveWeaponByType(player, item, weaponGroup, itemType) {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    if (item.type === null)
        return;
    const fullAmmo = player.character.inventory.getAllCountByItemType(itemType);
    if (fullAmmo && fullAmmo.items.length) {
        const ammoCount = fullAmmo.count;
        player.giveWeaponEx(mp.joaat(item.type), ammoCount, item.ammoInClip);
        player.setVariable("ammoHash", fullAmmo);
        player.setVariable("itemAsAmmo", fullAmmo.items[0]);
    }
    else {
        player.giveWeaponEx(mp.joaat(item.type), 0);
        player.setVariable("ammoHash", null);
        player.setVariable("itemAsAmmo", null);
    }
}
const manageInventoryFastSlot = async (player, event) => {
    try {
        if (!mp.players.exists(player) || !player.character || !player.character.inventory)
            return;
        if (event.indexOf("k_fastslot") === -1)
            return;
        const key = parseInt(event[event.length - 1]);
        const fastslot = player.character.inventory.quickUse[key - 1];
        if (!fastslot)
            return null;
        const item = player.character.inventory.items[fastslot.component][fastslot.id];
        if (!item)
            return;
        if (player.character.inventory.isWeapon(item) && item.type) {
            if (player.cdata.quckUseDelay === true)
                return;
            if (player.weapon !== mp.joaat(item.type)) {
                player.removeAllWeapons();
                const weaponGroup = await player.callProc("client::proc:getWeaponTypeGroup", [mp.joaat(item.type)]);
                player.fastSlotActive = key - 1;
                if (weaponGroup) {
                    switch (weaponGroup) {
                        case 3566412288 /* RageShared.Inventory.Enums.WEAPON_GROUP.UNKNOWN */: {
                            player.giveWeaponEx(mp.joaat(item.type), 0);
                            return;
                        }
                        case 416676503 /* RageShared.Inventory.Enums.WEAPON_GROUP.HANDGUNS */: {
                            await giveWeaponByType(player, item, weaponGroup, "pistol_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOLAMMO */);
                            break;
                        }
                        case 3337201152 /* RageShared.Inventory.Enums.WEAPON_GROUP.SUBMACHINE */: {
                            await giveWeaponByType(player, item, weaponGroup, "smg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SMGAMMO */);
                            break;
                        }
                        case 860033945 /* RageShared.Inventory.Enums.WEAPON_GROUP.SHOTGUN */: {
                            await giveWeaponByType(player, item, weaponGroup, "shotgun_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_SHOTGUNAMMO */);
                            break;
                        }
                        case 970310034 /* RageShared.Inventory.Enums.WEAPON_GROUP.ASSAULTRIFLE */: {
                            await giveWeaponByType(player, item, weaponGroup, "rifle_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RIFLEAMMO */);
                            break;
                        }
                        case 1159398588 /* RageShared.Inventory.Enums.WEAPON_GROUP.LIGHTMACHINE */: {
                            await giveWeaponByType(player, item, weaponGroup, "mg_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_MGAMMO */);
                            break;
                        }
                        case 3082541095 /* RageShared.Inventory.Enums.WEAPON_GROUP.SNIPER */: {
                            await giveWeaponByType(player, item, weaponGroup, "rifle_ammo" /* RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_RIFLEAMMO */);
                            break;
                        }
                        default:
                            return;
                    }
                }
                player.setVariable("ammoType", Items_module_1.inventoryAssets.items[item.type].ammoType || "pistol");
                player.cdata.quckUseDelay = true;
                player.cdata.qucikSlotTimeout = setTimeout(() => {
                    if (!mp.players.exists(player))
                        return;
                    player.cdata.quckUseDelay = false;
                    clearTimeout(player.cdata.qucikSlotTimeout);
                }, 3000);
            }
            else {
                const currentAmmoInClip = await player.callProc("client::proc:getAmmoInClip", [player.weapon]);
                if (currentAmmoInClip >= 0) {
                    item.ammoInClip = currentAmmoInClip;
                    console.log(`Ammo in clip for ${player.name} is ${currentAmmoInClip} || ${item.ammoInClip}`);
                }
                // player.removeAllWeaponComponents(item.type);
                player.removeAllWeapons();
                player.setVariable("ammoHash", null);
                player.fastSlotActive = null;
                player.giveWeapon(Weapons_assets_1.weaponHash["unarmed"], 0);
            }
            return;
        }
        player.character.inventory.useItem(player, JSON.stringify({ item: item, source: { component: fastslot.component, slot: fastslot.id } }));
    }
    catch (err) {
        console.log("manageInventoryFastSlot err: ", err);
    }
};
exports.manageInventoryFastSlot = manageInventoryFastSlot;


/***/ },

/***/ "./source/server/modules/inventory/SplitItem.module.ts"
/*!*************************************************************!*\
  !*** ./source/server/modules/inventory/SplitItem.module.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitInventoryItem = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const splitInventoryItem = (player, data) => {
    try {
        if (!mp.players.exists(player) || !player.character || !player.character.inventory)
            return;
        let { item, source, target } = JSON.parse(data);
        if (item.type === null)
            return;
        player.character.inventory.items[source.component][source.slot] = { ...item, type: item.type, count: item.count - target.count };
        player.character.inventory.items[target.component][target.slot] = { ...item, type: item.type, count: target.count, hash: (0, uuid_1.v4)() };
        if (player.character.inventory.isAmmoItem(item)) {
            player.character.inventory.reloadWeaponAmmo(player, item.type);
        }
        player.character.inventory.setInventory(player);
    }
    catch (err) {
        console.log("splitInventoryItem err: ", err);
    }
};
exports.splitInventoryItem = splitInventoryItem;


/***/ },

/***/ "./source/server/modules/inventory/UseItem.module.ts"
/*!***********************************************************!*\
  !*** ./source/server/modules/inventory/UseItem.module.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useInventoryItem = void 0;
/**
 * A function to handle inventory item usage.
 *
 * @param player the player consuming the item
 * @param data item data such as from where item is coming from and which slot
 * @returns void
 */
const useInventoryItem = async (player, data) => {
    try {
        if (!mp.players.exists(player) || !player.character || !player.character.inventory)
            return;
        const { item, source } = JSON.parse(data);
        switch (item.type) {
            default:
                return;
        }
    }
    catch (err) {
        console.log("useInventoryItem err: ", err);
    }
};
exports.useInventoryItem = useInventoryItem;


/***/ },

/***/ "./source/server/prototype/Player.prototype.ts"
/*!*****************************************************!*\
  !*** ./source/server/prototype/Player.prototype.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const index_1 = __webpack_require__(/*! @shared/index */ "./source/shared/index.ts");
/**
 * Gets a player by their name or ID.
 * @param {string} stringornumber - The name or ID of the player.
 * @returns {PlayerMp | undefined} The player if found, otherwise undefined.
 */
mp.players.getPlayerByName = function (stringornumber) {
    if (!isNaN(parseInt(stringornumber))) {
        return mp.players.at(parseInt(stringornumber));
    }
    else {
        if (stringornumber.length < 3)
            return undefined;
        const players = mp.players.toArray();
        for (const player of players) {
            const [firstname] = player.name.split(" ");
            if (!firstname.toLowerCase().includes(stringornumber.toLowerCase()))
                continue;
            return player;
        }
    }
};
/**
 * Displays a notification to the player.
 * @param {RageShared.Enums.NotifyType} type - The type of notification.
 * @param {string} message - The message to display.
 * @param {"light" | "dark" | "colored"} [skin="dark"] - The skin style of the notification.
 */
mp.Player.prototype.showNotify = function (type, message, skin = "dark") {
    return _api_1.RAGERP.cef.emit(this, "notify", "show", { type, message, skin });
};
/**
 * Gets the admin level of the player.
 * @returns {number} The admin level of the player.
 */
mp.Player.prototype.getAdminLevel = function () {
    if (!this || !mp.players.exists(this) || !this.account)
        return 0;
    return this.account.adminlevel;
};
/**
 * Gives a weapon to the player.
 * @param {number} weapon - The weapon hash.
 * @param {number} totalAmmo - The total ammo for the weapon.
 * @param {number} [ammoInClip] - The ammo in the clip (optional).
 */
mp.Player.prototype.giveWeaponEx = function (weapon, totalAmmo, ammoInClip) {
    this.call("client::weapon:giveWeapon", [weapon, totalAmmo, ammoInClip]);
};
/**
 * Gets the player's roleplay name, optionally checking if they are wearing a mask.
 * @param {boolean} [checkmask=true] - Whether to check if the player is wearing a mask.
 * @returns {string} The roleplay name of the player.
 */
mp.Player.prototype.getRoleplayName = function (checkmask = true) {
    const player = this;
    if (!player || !mp.players.exists(player) || !player.character)
        return "Unknown";
    if (checkmask && player.character.inventory && player.character.inventory.isWearingClothingType(1 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_MASK */)) {
        const itemData = player.character.inventory.items.clothes[1 /* RageShared.Inventory.Enums.INVENTORY_CLOTHING.TYPE_MASK */];
        if (!itemData)
            return player.name;
        return `Stranger ${itemData.hash.split("-")[0]}`;
    }
    return this.name;
};
/**
 * Requests collision at a specific location.
 * @param {number} x - The X coordinate.
 * @param {number} y - The Y coordinate.
 * @param {number} z - The Z coordinate.
 * @returns {Promise<void>} A promise that resolves when the collision is requested.
 */
mp.Player.prototype.requestCollisionAt = async function (x, y, z) {
    return await this.callProc("client::proc:requestCollisionAt", [x, y, z]);
};
/**
 * Starts a screen effect for the player.
 * @param {string} effectName - The name of the effect.
 * @param {number} [duration=3000] - The duration of the effect in milliseconds.
 * @param {boolean} [looped=true] - Whether the effect should be looped.
 */
mp.Player.prototype.startScreenEffect = function (effectName, duration = 3000, looped = true) {
    this.call("client::effects:startScreenEffect", [effectName, duration, looped]);
};
/**
 * Stops a screen effect for the player.
 * @param {string} effectName - The name of the effect.
 */
mp.Player.prototype.stopScreenEffect = function (effectName) {
    this.call("client::effects:stopScreenEffect", [effectName]);
};
/**
 * Sets the emote text for the player.
 * @param {Array4d} color - The color of the text.
 * @param {string} text - The emote text.
 * @param {number} [time=7] - The duration in seconds the text will be displayed.
 */
mp.Player.prototype.setEmoteText = function (color, text, time = 7) {
    this.setVariable("emoteTextData", JSON.stringify({ color, text }));
    if (this.emoteTimeout) {
        clearTimeout(this.emoteTimeout);
        this.emoteTimeout = null;
    }
    this.emoteTimeout = setTimeout(() => {
        this.setVariable("emoteTextData", null);
        clearTimeout(this.emoteTimeout);
        this.emoteTimeout = null;
    }, time * 1_000);
};
/**
 * Gives money to the player.
 * @param {number} amount - The amount of money to give.
 * @param {string} [logMessage] - An optional log message.
 */
mp.Player.prototype.giveMoney = function (amount, logMessage) {
    if (!mp.players.exists(this) || !this.getVariable("loggedin") || !this.character)
        return;
    this.character.cash = this.character.cash + amount;
    this.character.setStoreData(this, "cash", this.character.cash);
};
mp.Player.prototype.attachObject = function (name, attached) {
    this.call("client::attachments:attach", [name, attached]);
};


/***/ },

/***/ "./source/server/serverevents/Arena.event.ts"
/*!***************************************************!*\
  !*** ./source/server/serverevents/Arena.event.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Arena_module_1 = __webpack_require__(/*! @arena/Arena.module */ "./source/server/arena/Arena.module.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! @arena/ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const ArenaConfig_1 = __webpack_require__(/*! @arena/ArenaConfig */ "./source/server/arena/ArenaConfig.ts");
_api_1.RAGERP.cef.register("arena", "joinQueue", async (player, data) => {
    let size = 2;
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed && typeof parsed === "object" && parsed.size) {
            const s = Number(parsed.size);
            if (ArenaConfig_1.QUEUE_SIZES.includes(s))
                size = s;
        }
        else if (typeof parsed === "number") {
            if (ArenaConfig_1.QUEUE_SIZES.includes(parsed))
                size = parsed;
        }
    }
    catch { /* use default */ }
    if ((0, Arena_module_1.joinQueue)(player, size)) {
        _api_1.RAGERP.cef.emit(player, "system", "setPage", "arena_lobby");
    }
});
_api_1.RAGERP.cef.register("arena", "leaveQueue", async (player) => {
    (0, Arena_module_1.leaveQueue)(player);
    _api_1.RAGERP.cef.startPage(player, "mainmenu");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "mainmenu");
});
_api_1.RAGERP.cef.register("arena", "leaveMatch", async (player) => {
    if ((0, ArenaMatch_manager_1.leaveMatch)(player)) {
        player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Left arena match.");
    }
});
_api_1.RAGERP.cef.register("arena", "vote", async (player, data) => {
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        const mapId = typeof parsed === "object" && parsed?.mapId ? String(parsed.mapId) : null;
        if (mapId)
            (0, Arena_module_1.vote)(player, mapId);
    }
    catch {
        console.warn("[arena:vote] Invalid vote data:", data);
    }
});


/***/ },

/***/ "./source/server/serverevents/Auth.event.ts"
/*!**************************************************!*\
  !*** ./source/server/serverevents/Auth.event.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const crypto_1 = __importDefault(__webpack_require__(/*! crypto */ "crypto"));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Account_entity_1 = __webpack_require__(/*! @entities/Account.entity */ "./source/server/database/entity/Account.entity.ts");
const Character_entity_1 = __webpack_require__(/*! @entities/Character.entity */ "./source/server/database/entity/Character.entity.ts");
const Character_event_1 = __webpack_require__(/*! ./Character.event */ "./source/server/serverevents/Character.event.ts");
function hashPassword(text) {
    return crypto_1.default.createHash("sha256").update(text).digest("hex");
}
_api_1.RAGERP.cef.register("auth", "register", async (player, data) => {
    const { username, email, password, confirmPassword } = _api_1.RAGERP.utils.parseObject(data);
    if (username.length < 4 || username.length > 32)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Your username must be between 4 and 32 characters.");
    if (password.length < 5)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Your password must contain at least 5 characters.");
    if (password !== confirmPassword)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Password mismatch.");
    const accountExists = await _api_1.RAGERP.database.getRepository(Account_entity_1.AccountEntity).findOne({ where: { username, email } });
    if (accountExists)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Account username or email exists.");
    const accountData = new Account_entity_1.AccountEntity();
    accountData.username = username.toLowerCase();
    accountData.password = hashPassword(password);
    accountData.socialClubId = player.rgscId;
    accountData.email = email;
    accountData.characters = [];
    const result = await _api_1.RAGERP.database.getRepository(Account_entity_1.AccountEntity).save(accountData);
    if (!result) {
        player.showNotify("info" /* RageShared.Enums.NotifyType.TYPE_INFO */, "An error occurred creating your account, please contact an admin.");
        return;
    }
    player.account = result;
    player.name = player.account.username;
    player.call("client::auth:destroyCamera");
    player.call("client::creator:start");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "creator");
});
_api_1.RAGERP.cef.register("auth", "loginPlayer", async (player, data) => {
    const { username, password } = _api_1.RAGERP.utils.parseObject(data);
    const accountData = await _api_1.RAGERP.database.getRepository(Account_entity_1.AccountEntity).findOne({ where: { username: username.toLowerCase() } });
    if (!accountData)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "We could not find that account!");
    if (hashPassword(password) !== accountData.password)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "Wrong password.");
    player.account = accountData;
    player.name = player.account.username;
    const characters = await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).find({
        where: { account: { id: accountData.id } },
        relations: ["items", "bank"],
        take: 1
    });
    if (characters.length > 0) {
        await (0, Character_event_1.spawnWithCharacter)(player, characters[0]);
        _api_1.RAGERP.cef.startPage(player, "mainmenu");
        _api_1.RAGERP.cef.emit(player, "system", "setPage", "mainmenu");
        _api_1.RAGERP.cef.emit(player, "mainmenu", "setPlayerData", { name: characters[0].name });
    }
    else {
        player.call("client::auth:destroyCamera");
        player.call("client::creator:start");
        _api_1.RAGERP.cef.emit(player, "system", "setPage", "creator");
    }
});


/***/ },

/***/ "./source/server/serverevents/Character.event.ts"
/*!*******************************************************!*\
  !*** ./source/server/serverevents/Character.event.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.spawnWithCharacter = spawnWithCharacter;
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Character_entity_1 = __webpack_require__(/*! @entities/Character.entity */ "./source/server/database/entity/Character.entity.ts");
const Inventory_entity_1 = __webpack_require__(/*! @entities/Inventory.entity */ "./source/server/database/entity/Inventory.entity.ts");
const Assets_module_1 = __webpack_require__(/*! @modules/inventory/Assets.module */ "./source/server/modules/inventory/Assets.module.ts");
const Core_class_1 = __webpack_require__(/*! @modules/inventory/Core.class */ "./source/server/modules/inventory/Core.class.ts");
async function spawnWithCharacter(player, character) {
    player.character = character;
    player.setVariable("loggedin", true);
    player.call("client::auth:destroyCamera");
    player.call("client::cef:close");
    player.model = character.gender === 0 ? mp.joaat("mp_m_freemode_01") : mp.joaat("mp_f_freemode_01");
    player.name = character.name;
    await character.spawn(player);
    player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, `Welcome, ${character.name}!`);
}
/**
 * When a player changes navigation in character creator, example going from general data to appearance
 */
_api_1.RAGERP.cef.register("creator", "navigation", async (player, name) => {
    name = JSON.parse(name);
    const cameraName = "creator_" + name;
    player.call("client::creator:changeCamera", [cameraName]);
    player.call("client::creator:changeCategory", [cameraName]);
});
/**
 * Executed when a player selects a character to spawn with (kept for compatibility)
 */
_api_1.RAGERP.cef.register("character", "select", async (player, data) => {
    const id = JSON.parse(data);
    const character = await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).findOne({ where: { id }, relations: ["items", "bank"] });
    if (!character)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "An error occurred selecting your character.");
    await spawnWithCharacter(player, character);
});
/**
 * Executes when a player choose to create a new character
 */
_api_1.RAGERP.cef.register("character", "create", async (player) => {
    player.call("client::auth:destroyCamera");
    player.call("client::creator:start");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "creator");
});
/**
 * Executes when a player finishes creating a character.
 */
_api_1.RAGERP.cef.register("creator", "create", async (player, data) => {
    if (!player.account)
        return player.kick("An error has occurred!");
    const parseData = _api_1.RAGERP.utils.parseObject(data);
    const fullname = `${parseData.name.firstname} ${parseData.name.lastname}`;
    const nameisTaken = await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).findOne({ where: { name: fullname } });
    if (nameisTaken)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "We're sorry but that name is already taken, choose another one.");
    const { sex, parents, hair, face, color } = parseData;
    const characterLimit = await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).find({ where: { account: { id: player.account.id } }, take: 1 });
    if (characterLimit.length >= 1)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You already have a character. One character per account.");
    const characterData = new Character_entity_1.CharacterEntity();
    characterData.account = player.account;
    characterData.appearance = { color, face, hair, parents };
    characterData.name = fullname;
    characterData.gender = sex;
    characterData.position = {
        x: 213.0,
        y: -810.0,
        z: 30.73,
        heading: 160.0
    };
    const inv = Assets_module_1.inventorydataPresset;
    characterData.inventory = new Core_class_1.Inventory(player, inv.clothes, inv.pockets, inv.quickUse);
    const inventoryItems = new Inventory_entity_1.InventoryItemsEntity();
    inventoryItems.clothes = characterData.inventory.items.clothes;
    inventoryItems.pockets = characterData.inventory.items.pockets;
    inventoryItems.quickUse = characterData.inventory.quickUse;
    inventoryItems.character = characterData;
    characterData.items = inventoryItems;
    const result = await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).save(characterData);
    if (!result)
        return;
    player.name = fullname;
    player.character = result;
    player.setVariable("loggedin", true);
    player.call("client::creator:destroycam");
    player.call("client::cef:close");
    await player.character.spawn(player);
});


/***/ },

/***/ "./source/server/serverevents/Chat.event.ts"
/*!**************************************************!*\
  !*** ./source/server/serverevents/Chat.event.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Command_class_1 = __webpack_require__(/*! @classes/Command.class */ "./source/server/classes/Command.class.ts");
const invokeCommand = async (player, message) => {
    message = message.substring(1);
    message = message.trim();
    const args = message.split(/ +/);
    const name = args.shift();
    if (!name)
        return;
    const fullText = message.substring(name.length + 1); // +1 for the space after command name
    // Check if command exists
    const command = Command_class_1.CommandRegistry.find(name);
    if (!command) {
        if (Command_class_1.CommandRegistry.notFoundMessageEnabled) {
            Command_class_1.CommandRegistry.commandNotFound(player, name);
        }
        return;
    }
    const cancel = { cancel: false };
    // CommandEvents.emit('receive', player, command, fullText, args, cancel);
    // Handle cancellation
    if (cancel && cancel.cancel) {
        return;
    }
    try {
        // Handle run
        if (command.adminlevel && command.adminlevel > player.getAdminLevel()) {
            return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You are not authorized to use this command.");
        }
        if (command.run.constructor.name === "AsyncFunction") {
            await command.run(player, fullText, ...args);
        }
        else {
            command.run(player, fullText, ...args);
        }
    }
    catch (e) {
        console.error(e);
    }
};
const LOCAL_CHAT_RANGE = 50;
const CHAT_PREFIXES = ["/global", "/team", "/local", "/admin"];
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function parseChatScope(message) {
    const trimmed = message.trim();
    const lower = trimmed.toLowerCase();
    for (const prefix of CHAT_PREFIXES) {
        if (lower === prefix || lower.startsWith(prefix + " ")) {
            const msg = trimmed.slice(prefix.length).trim();
            return { scope: prefix.slice(1), msg };
        }
    }
    return null;
}
const sendChatMessage = (player, msg, scope = "local") => {
    try {
        msg = msg.trim();
    }
    catch {
        msg = msg;
    }
    if (msg.length <= 0)
        return;
    const safeMsg = escapeHtml(msg);
    const safeName = escapeHtml(player.getRoleplayName());
    const scopeTag = scope === "all" ? "[GLOBAL]" : scope === "team" ? "[TEAM]" : scope === "admin" ? "[ADMIN]" : "[LOCAL]";
    const formatted = `<span class="chat-scope">${scopeTag}</span> ${safeName}: ${safeMsg}`;
    switch (scope) {
        case "all":
            mp.players.forEach((target) => {
                if (target.getVariable("loggedin"))
                    target.call("client::chat:newMessage", [formatted]);
            });
            break;
        case "team": {
            const playerTeam = player.getVariable("currentTeam");
            mp.players.forEach((target) => {
                if (target.getVariable("loggedin") && target.getVariable("currentTeam") === playerTeam) {
                    target.call("client::chat:newMessage", [formatted]);
                }
            });
            break;
        }
        case "admin": {
            const adminLevel = player.getAdminLevel();
            mp.players.forEach((target) => {
                if (target.getVariable("loggedin") && target.getAdminLevel() >= 1) {
                    target.call("client::chat:newMessage", [formatted]);
                }
            });
            break;
        }
        case "local":
        default:
            mp.players.forEachInRange(player.position, LOCAL_CHAT_RANGE, (target) => {
                if (target.getVariable("loggedin"))
                    target.call("client::chat:newMessage", [formatted]);
            });
            break;
    }
};
const invokeMessage = async (player, data) => {
    let message;
    try {
        const parsed = JSON.parse(data);
        message = Array.isArray(parsed) ? parsed[0] : parsed;
    }
    catch {
        message = data;
    }
    player.call("client::chat:close");
    if (message.length <= 0)
        return;
    const chatScope = parseChatScope(message);
    if (chatScope) {
        return sendChatMessage(player, chatScope.msg, chatScope.scope);
    }
    if (message[0] === "/" && message.length > 1) {
        return invokeCommand(player, message);
    }
    return sendChatMessage(player, message, "local");
};
mp.events.add("server::chat:sendMessage", invokeMessage);


/***/ },

/***/ "./source/server/serverevents/DamageSync.event.ts"
/*!********************************************************!*\
  !*** ./source/server/serverevents/DamageSync.event.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Server-authoritative damage sync.
 * Receives hit reports from clients, validates, applies bone/weapon/distance damage,
 * blocks team damage in arena, and notifies victim + shooter.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_module_1 = __webpack_require__(/*! @shared/utils.module */ "./source/shared/utils.module.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! @arena/ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const DEFAULT_BONE_MULT = 1;
const DEFAULT_WEAPON_BASE = 28;
const DEFAULT_WEAPON_MIN = 10;
const DAMAGE_RANGE_DIVISOR = 40;
const boneMultipliers = {
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
// baseDamage and minDamage (sync uses /10 scale)
const weaponDamage = {
    [String(mp.joaat("weapon_pistol"))]: { base: 20, min: 10 },
    [String(mp.joaat("weapon_pistol_mk2"))]: { base: 20, min: 10 },
    [String(mp.joaat("weapon_combatpistol"))]: { base: 20, min: 10 },
    [String(mp.joaat("weapon_heavypistol"))]: { base: 20, min: 10 },
    [String(mp.joaat("weapon_appistol"))]: { base: 20, min: 10 },
    [String(mp.joaat("weapon_pistol50"))]: { base: 20, min: 10 },
    [String(mp.joaat("weapon_microsmg"))]: { base: 20, min: 8 },
    [String(mp.joaat("weapon_smg"))]: { base: 20, min: 8 },
    [String(mp.joaat("weapon_assaultrifle"))]: { base: 28, min: 10 },
    [String(mp.joaat("weapon_assaultrifle_mk2"))]: { base: 23, min: 10 },
    [String(mp.joaat("weapon_carbinerifle"))]: { base: 23, min: 6 },
    [String(mp.joaat("weapon_specialcarbine"))]: { base: 23, min: 10 },
    [String(mp.joaat("weapon_sniperrifle"))]: { base: 40, min: 5 },
    [String(mp.joaat("weapon_heavysniper"))]: { base: 40, min: 5 },
    [String(mp.joaat("weapon_pumpshotgun"))]: { base: 30, min: 5 },
    [String(mp.joaat("weapon_sawnoffshotgun"))]: { base: 30, min: 5 },
    [String(mp.joaat("weapon_mg"))]: { base: 13, min: 5 }
};
function getBoneMultiplier(bone) {
    return boneMultipliers[bone] ?? DEFAULT_BONE_MULT;
}
function getWeaponDamage(weaponHash, distance) {
    const w = weaponDamage[weaponHash] ?? { base: DEFAULT_WEAPON_BASE, min: DEFAULT_WEAPON_MIN };
    let dmg = w.base / (distance / DAMAGE_RANGE_DIVISOR);
    if (dmg > w.base)
        dmg = w.base;
    if (dmg < w.min)
        dmg = w.min;
    return Math.round(dmg * 10) / 10;
}
mp.events.add("server:PlayerHit", (shooter, victimId, targetBone, weaponHash) => {
    if (!shooter || !mp.players.exists(shooter))
        return;
    const victim = mp.players.at(victimId);
    if (!victim || !mp.players.exists(victim))
        return;
    if (shooter.id === victim.id)
        return;
    // Arena: no team damage
    const match = (0, ArenaMatch_manager_1.getMatchByPlayer)(victim);
    if (match) {
        const victimTeam = (0, ArenaMatch_manager_1.getTeam)(match, victim.id);
        const shooterTeam = (0, ArenaMatch_manager_1.getTeam)(match, shooter.id);
        if (victimTeam && shooterTeam && victimTeam === shooterTeam)
            return;
        // Must be in same dimension
        if (shooter.dimension !== victim.dimension)
            return;
    }
    const distance = utils_module_1.Utils.distanceToPos(shooter.position, victim.position);
    const weaponDmg = getWeaponDamage(weaponHash, Math.max(1, distance));
    const boneMult = getBoneMultiplier(targetBone);
    const finalDamage = weaponDmg * boneMult;
    const from = shooter.position;
    victim.call("client:GiveDamage", [finalDamage, from.x, from.y, from.z]);
    // Headshot: use body multiplier for damage calc but mark as head for hitmarker
    const isHead = targetBone === "Head";
    const hitStatus = isHead ? 3 : victim.armour > 0 ? 2 : 1; // 1=health, 2=armour, 3=head
    shooter.call("client:ShowHitmarker", [finalDamage, victim.position.x, victim.position.y, victim.position.z, hitStatus]);
});


/***/ },

/***/ "./source/server/serverevents/Death.event.ts"
/*!***************************************************!*\
  !*** ./source/server/serverevents/Death.event.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const PlayerSpawn_asset_1 = __webpack_require__(/*! @assets/PlayerSpawn.asset */ "./source/server/assets/PlayerSpawn.asset.ts");
const utils_module_1 = __webpack_require__(/*! @shared/utils.module */ "./source/shared/utils.module.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! @arena/ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const Death_utils_1 = __webpack_require__(/*! ./Death.utils */ "./source/server/serverevents/Death.utils.ts");
function findClosestHospital(player) {
    let closestSpawn = null;
    let closestDistance = Infinity;
    for (const spawn of PlayerSpawn_asset_1.hospitalSpawns) {
        const distance = utils_module_1.Utils.distanceToPos(player.position, spawn.position);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSpawn = spawn;
        }
    }
    return closestSpawn;
}
function playerAcceptedDeath(player) {
    if (!player || !mp.players.exists(player) || !player.character)
        return;
    const hospitalData = findClosestHospital(player);
    if (!hospitalData) {
        const randomHospital = utils_module_1.Utils.getRandomFromArray(PlayerSpawn_asset_1.hospitalSpawns);
        player.spawn(randomHospital.position);
        player.heading = randomHospital.heading;
        return;
    }
    player.character.setStoreData(player, "isDead", false);
    player.character.setStoreData(player, "deathTime", 30);
    player.setVariable("isDead", false);
    player.setOwnVariable("deathAnim", null);
    player.spawn(hospitalData.position);
    player.heading = hospitalData.heading;
    player.character.deathState = 0 /* RageShared.Players.Enums.DEATH_STATES.STATE_NONE */;
    player.stopScreenEffect("DeathFailMPIn");
}
function playerDeath(player, _reason, killer) {
    if (!player || !mp.players.exists(player) || !player.character)
        return;
    if ((0, ArenaMatch_manager_1.isPlayerInArenaMatch)(player) && (0, ArenaMatch_manager_1.handleArenaDeath)(player, killer)) {
        return;
    }
    if (player.character.deathState === 0 /* RageShared.Players.Enums.DEATH_STATES.STATE_NONE */) {
        player.spawn(player.position);
        (0, Death_utils_1.setPlayerToInjuredState)(player);
        player.character.save(player);
        return;
    }
    playerAcceptedDeath(player);
    return;
}
mp.events.add("playerDeath", playerDeath);
mp.events.add("server::player:acceptDeath", playerAcceptedDeath);


/***/ },

/***/ "./source/server/serverevents/Death.utils.ts"
/*!***************************************************!*\
  !*** ./source/server/serverevents/Death.utils.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setPlayerToInjuredState = setPlayerToInjuredState;
const randomDeathAnimations = [
    { dict: "missfinale_c1@", anim: "lying_dead_player0" },
    { dict: "missprologueig_6", anim: "lying_dead_brad" },
    { dict: "misslamar1dead_body", anim: "dead_idle" }
];
function setPlayerToInjuredState(player) {
    if (!player || !mp.players.exists(player) || !player.character)
        return;
    player.character.deathState = 1 /* RageShared.Players.Enums.DEATH_STATES.STATE_INJURED */;
    player.character.setStoreData(player, "isDead", true);
    player.setVariable("isDead", true);
    const randomDeath = randomDeathAnimations[Math.floor(Math.random() * randomDeathAnimations.length)];
    player.playAnimation(randomDeath.dict, randomDeath.anim, 2, 9);
    player.setOwnVariable("deathAnim", { anim: randomDeath.anim, dict: randomDeath.dict });
    player.startScreenEffect("DeathFailMPIn", 0, true);
}


/***/ },

/***/ "./source/server/serverevents/Inventory.event.ts"
/*!*******************************************************!*\
  !*** ./source/server/serverevents/Inventory.event.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "onMoveItem", async (player, data) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    await player.character.inventory.moveItem(player, data);
});
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "onUseItem", (player, data) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    player.character.inventory.useItem(player, data);
});
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "onSplitItem", (player, data) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    player.character.inventory.splitStack(player, data);
});
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "onDropItem", async (player, itemData) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    await player.character.inventory.dropItem(player, itemData);
});
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "deleteItem", (player, itemData) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    player.character.inventory.deleteItem(player, itemData);
});
//-------------------------------------------------------//
mp.events.add("server::player:loadInventory", (player) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    player.character.inventory.setInventory(player);
});
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "onGiveItemAway", (player) => player.call("client::inventory:deletePedScreen"));
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "confirmItemDrop", (player) => player.call("client::inventory:deletePedScreen"));
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "openItem", (player, data) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    player.character.inventory.openItem(player, data);
});
//-------------------------------------------------------//
mp.events.add("server::inventory:quickUse", async (player, event) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory)
        return;
    await player.character.inventory.manageFastSlots(player, event);
});
//-------------------------------------------------------//
_api_1.RAGERP.cef.register("inventory", "cancelAction", (player) => {
    if (!mp.players.exists(player) || !player.character || !player.character.inventory || !player.character.inventory.progressBar)
        return;
    player.character.inventory.progressBar.onCancel(player);
});
//-------------------------------------------------------//
mp.events.add("server::player:weaponShot", async (player) => {
    try {
        if (!player || !mp.players.exists(player) || !player.character || !player.character.inventory)
            return;
        let ammoHash = player.getVariable("ammoHash");
        let loadedin = player.getVariable("itemAsAmmo");
        if (!ammoHash || !loadedin)
            return;
        let findAmmoItem = player.character.inventory.getItemByUUID(loadedin);
        if (!findAmmoItem)
            return;
        findAmmoItem.count--;
        if (findAmmoItem.count === 0) {
            let finditem = await player.character.inventory.getItemSlotComponentByHashKey(loadedin);
            if (finditem) {
                player.character.inventory.items[finditem.component][finditem.slot] = null;
                player.character.inventory.setInventory(player);
            }
            ammoHash.items.splice(ammoHash.items.indexOf(loadedin), 1);
            if (ammoHash.items.length) {
                player.setVariable("itemAsAmmo", ammoHash.items[0]);
                player.setVariable("ammoHash", ammoHash);
            }
            else {
                player.setVariable("itemAsAmmo", null);
                player.setVariable("ammoHash", null);
            }
        }
    }
    catch (err) {
        console.error("server::player:weaponShot: err", err);
    }
});


/***/ },

/***/ "./source/server/serverevents/MainMenu.event.ts"
/*!******************************************************!*\
  !*** ./source/server/serverevents/MainMenu.event.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Arena_module_1 = __webpack_require__(/*! @arena/Arena.module */ "./source/server/arena/Arena.module.ts");
const ArenaPresets_asset_1 = __webpack_require__(/*! @arena/ArenaPresets.asset */ "./source/server/arena/ArenaPresets.asset.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! @arena/ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const Character_entity_1 = __webpack_require__(/*! @entities/Character.entity */ "./source/server/database/entity/Character.entity.ts");
const ArenaConfig_1 = __webpack_require__(/*! @arena/ArenaConfig */ "./source/server/arena/ArenaConfig.ts");
_api_1.RAGERP.cef.register("mainmenu", "playFreeroam", async (player) => {
    if (!player.character) {
        _api_1.RAGERP.cef.emit(player, "mainmenu", "playError", { message: "No character loaded." });
        return;
    }
    if ((0, ArenaMatch_manager_1.isPlayerInArenaMatch)(player)) {
        (0, ArenaMatch_manager_1.leaveMatch)(player, false);
    }
    const LEGION_SQUARE = { x: 213.0, y: -810.0, z: 30.73, heading: 160.0 };
    player.dimension = 0;
    player.setVariable("isSpectating", false);
    player.call("client::player:freeze", [false]);
    player.call("client::arena:zoneClear");
    player.call("client::arena:clearTeam");
    player.spawn(new mp.Vector3(LEGION_SQUARE.x, LEGION_SQUARE.y, LEGION_SQUARE.z));
    player.heading = LEGION_SQUARE.heading;
    await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).update(player.character.id, {
        position: LEGION_SQUARE,
        lastlogin: player.character.lastlogin,
        deathState: player.character.deathState,
        cash: player.character.cash
    });
    player.call("client::cef:close");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "hud");
});
_api_1.RAGERP.cef.register("mainmenu", "openSettings", (player) => {
    _api_1.RAGERP.cef.startPage(player, "settings");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "settings");
});
_api_1.RAGERP.cef.register("mainmenu", "getArenaMaps", (player) => {
    const presets = (0, ArenaPresets_asset_1.getArenaPresets)();
    _api_1.RAGERP.cef.emit(player, "mainmenu", "setArenaMaps", {
        maps: presets.map((p) => ({ id: p.id, name: p.name }))
    });
});
_api_1.RAGERP.cef.register("mainmenu", "playArena", async (player, data) => {
    if (!player.character) {
        _api_1.RAGERP.cef.emit(player, "mainmenu", "playError", { message: "No character loaded." });
        return;
    }
    let size = 2;
    let mapId;
    try {
        const parsed = data ? (typeof data === "string" ? JSON.parse(data) : data) : null;
        if (parsed && typeof parsed === "object" && parsed.size) {
            const s = Number(parsed.size);
            if (ArenaConfig_1.QUEUE_SIZES.includes(s))
                size = s;
        }
        if (parsed && typeof parsed === "object" && parsed.map) {
            mapId = String(parsed.map);
        }
    }
    catch { /* default */ }
    if ((0, Arena_module_1.joinQueue)(player, size, mapId)) {
        _api_1.RAGERP.cef.startPage(player, "arena_lobby");
        _api_1.RAGERP.cef.emit(player, "system", "setPage", "arena_lobby");
    }
    else {
        _api_1.RAGERP.cef.emit(player, "mainmenu", "playError", { message: "Could not join queue. You may already be in it." });
    }
});


/***/ },

/***/ "./source/server/serverevents/Player.event.ts"
/*!****************************************************!*\
  !*** ./source/server/serverevents/Player.event.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Ban_entity_1 = __webpack_require__(/*! @entities/Ban.entity */ "./source/server/database/entity/Ban.entity.ts");
const Character_entity_1 = __webpack_require__(/*! @entities/Character.entity */ "./source/server/database/entity/Character.entity.ts");
const Attachments_module_1 = __webpack_require__(/*! @modules/Attachments.module */ "./source/server/modules/Attachments.module.ts");
const ArenaMatch_manager_1 = __webpack_require__(/*! @arena/ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
const LEGION_SQUARE = { x: 213.0, y: -810.0, z: 30.73, heading: 160.0 };
async function onPlayerJoin(player) {
    try {
        const banData = await _api_1.RAGERP.database.getRepository(Ban_entity_1.BanEntity).findOne({
            where: [{ serial: player.serial }, { ip: player.ip }, { username: player.name }, { rsgId: player.rgscId }]
        });
        if (banData) {
            if (_api_1.RAGERP.utils.hasDatePassedTimestamp(parseInt(banData.lifttime))) {
                await _api_1.RAGERP.database.getRepository(Ban_entity_1.BanEntity).delete({ id: banData.id });
            }
            else {
                player.kick(`Banned: ${banData.reason}`);
                return;
            }
        }
        player.account = null;
        player.character = null;
        player.lastPosition = null;
        player.emoteTimeout = null;
        player.setVariable("loggedin", false);
        player.setVariable("isSpectating", false);
        player.setVariable("adminLevel", 0);
        player.setVariable("emoteText", null);
        player.cdata = {};
    }
    catch (err) {
        console.error(err);
    }
}
async function onPlayerQuit(player) {
    if ((0, ArenaMatch_manager_1.isPlayerInArenaMatch)(player)) {
        (0, ArenaMatch_manager_1.leaveMatch)(player);
    }
    const character = player.character;
    if (!character)
        return;
    if (player.dimension !== 0) {
        await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).update(character.id, {
            position: LEGION_SQUARE,
            lastlogin: character.lastlogin,
            deathState: character.deathState,
            cash: character.cash
        });
    }
    else {
        const lastPosition = { ...player.position };
        await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).update(character.id, {
            position: { x: lastPosition.x, y: lastPosition.y, z: lastPosition.z, heading: player.heading },
            lastlogin: character.lastlogin,
            deathState: character.deathState,
            cash: character.cash
        });
    }
}
mp.events.add({
    "playerQuit": onPlayerQuit,
    "playerJoin": onPlayerJoin
});
mp.events.add("server::spectate:stop", async (player) => {
    if (!player || !mp.players.exists(player))
        return;
    player.setVariable("isSpectating", false);
    player.call("client::spectate:stop");
});
mp.events.add("server::player:noclip", (player, status) => {
    player.setVariable("noclip", status);
    mp.players.forEachInRange(player.position, mp.config["stream-distance"], (nearbyPlayer) => {
        nearbyPlayer.call("client::player:noclip", [player.id, status]);
    });
});
mp.events.add("entityCreated", (entity) => {
    if (["vehicle", "player"].includes(entity.type)) {
        Attachments_module_1.entityAttachments.initFunctions(entity);
    }
});
_api_1.RAGERP.cef.register("settings", "changePassword", (player) => { });


/***/ },

/***/ "./source/server/serverevents/PlayerMenu.event.ts"
/*!********************************************************!*\
  !*** ./source/server/serverevents/PlayerMenu.event.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
mp.events.add("server::playerMenu:close", (player) => {
    if (!player || !mp.players.exists(player))
        return;
    player.call("client::cef:close");
});
mp.events.add("server::player:setCefPage", (player, pageName) => {
    if (!player || !mp.players.exists(player))
        return;
    if (pageName !== "playerMenu")
        return;
    const players = mp.players.toArray().map((p) => ({
        id: p.id,
        name: p.name,
        ping: p.ping
    }));
    _api_1.RAGERP.cef.emit(player, "playerList", "setPlayers", players);
});


/***/ },

/***/ "./source/server/serverevents/Point.event.ts"
/*!***************************************************!*\
  !*** ./source/server/serverevents/Point.event.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Point_class_1 = __webpack_require__(/*! @classes/Point.class */ "./source/server/classes/Point.class.ts");
mp.events.add("server::player:pressE", async (player) => {
    try {
        if (!mp.players.exists(player))
            return;
        const point = Point_class_1.DynamicPoint.getNearestPoint(player);
        if (!point)
            return;
        point.onKeyPress.constructor.name === "AsyncFunction" ? await point.onKeyPress(player) : point.onKeyPress(player);
    }
    catch (err) {
        console.error("dynamic point event err: ", err);
    }
});
mp.events.add("playerEnterColshape", (player, shape) => {
    if (typeof shape.enterHandler !== "undefined")
        shape.enterHandler(player);
});
mp.events.add("playerExitColshape", (player, shape) => {
    if (typeof shape.exitHandler !== "undefined")
        shape.exitHandler(player);
});


/***/ },

/***/ "./source/server/serverevents/Server.event.ts"
/*!****************************************************!*\
  !*** ./source/server/serverevents/Server.event.ts ***!
  \****************************************************/
() {


mp.events.add("server::client:debug", (player, message, ...args) => {
    if (!process.env.DEBUG_MODE)
        return;
    console.log(message, ...args);
});


/***/ },

/***/ "./source/server/serverevents/Vehicle.event.ts"
/*!*****************************************************!*\
  !*** ./source/server/serverevents/Vehicle.event.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Interaction_class_1 = __webpack_require__(/*! @classes/Interaction.class */ "./source/server/classes/Interaction.class.ts");
/**
 * This events are triggered from client-side
 */
mp.events.add("server::vehicle:setTrunkState", (player, vehicleid, state) => {
    const vehicle = _api_1.RAGERP.entities.vehicles.at(vehicleid);
    if (!vehicle || !mp.vehicles.exists(vehicle._vehicle))
        return;
    vehicle.setData("trunkState", state);
});
mp.events.add("server::vehicle:setHoodState", (player, vehicleid, state) => {
    const vehicle = _api_1.RAGERP.entities.vehicles.at(vehicleid);
    if (!vehicle || mp.vehicles.exists(vehicle._vehicle))
        return;
    vehicle.setData("hoodState", state);
});
mp.events.add("server::interaction:vehicle", async (player, vehicleId) => {
    const vehicle = _api_1.RAGERP.entities.vehicles.at(vehicleId);
    if (!vehicle || !vehicle._vehicle)
        return;
    player.interactionMenu = new Interaction_class_1.InteractionMenu();
    let interactionData;
    player.vehicle && player.vehicle.id === vehicleId
        ? (interactionData = [
            { id: 0, text: "Toggle Hood", type: 0 },
            { id: 1, text: "Toggle Trunk", type: 1 },
            { id: 2, text: "Lock Vehicle", type: 2 },
            { id: 3, text: `${player.vehicle.engine ? "Turn off Engine" : "Turn on Engine"}`, type: 3 }
        ])
        : (interactionData = [
            { id: 0, text: "Toggle Hood", type: 0 },
            { id: 1, text: "Toggle Trunk", type: 1 },
            { id: 2, text: "Lock Vehicle", type: 2 }
        ]);
    const result = await player.interactionMenu.new(player, { isActive: true, items: interactionData });
    if (result === null)
        return player.interactionMenu?.closeMenu(player);
    switch (result) {
        case 0: {
            vehicle.setData("hoodState", !vehicle.getData("hoodState"));
            break;
        }
        case 1: {
            vehicle.setData("trunkState", !vehicle.getData("trunkState"));
            break;
        }
        case 2: {
            vehicle.setData("locked", !vehicle.getData("locked"));
            break;
        }
        case 3: {
            vehicle.setData("engine", !vehicle.getData("engine"));
            break;
        }
        default:
            return player.interactionMenu?.closeMenu(player);
    }
    player.interactionMenu?.closeMenu(player);
});


/***/ },

/***/ "./source/server/serverevents/Wardrobe.event.ts"
/*!******************************************************!*\
  !*** ./source/server/serverevents/Wardrobe.event.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
const Character_entity_1 = __webpack_require__(/*! @entities/Character.entity */ "./source/server/database/entity/Character.entity.ts");
const CEFEvent_class_1 = __webpack_require__(/*! @classes/CEFEvent.class */ "./source/server/classes/CEFEvent.class.ts");
function getClothesForPlayer(player) {
    const clothes = player.character?.appearance?.clothes ?? {
        hats: { drawable: 0, texture: 0 },
        masks: { drawable: 0, texture: 0 },
        tops: { drawable: 15, texture: 0 },
        pants: { drawable: 21, texture: 0 },
        shoes: { drawable: 34, texture: 0 }
    };
    if (player.character?.gender === 1) {
        clothes.pants = clothes.pants ?? { drawable: 15, texture: 0 };
        clothes.shoes = clothes.shoes ?? { drawable: 35, texture: 0 };
    }
    return clothes;
}
function openWardrobe(player) {
    if (!player.character)
        return player.showNotify("error" /* RageShared.Enums.NotifyType.TYPE_ERROR */, "You must be logged in.");
    const clothes = getClothesForPlayer(player);
    CEFEvent_class_1.CefEvent.emit(player, "wardrobe", "setClothes", clothes);
    _api_1.RAGERP.cef.startPage(player, "wardrobe");
    _api_1.RAGERP.cef.emit(player, "system", "setPage", "wardrobe");
}
_api_1.RAGERP.commands.add({
    name: "clothing",
    aliases: ["clothes"],
    description: "Open clothing menu to change clothes",
    run: (player) => openWardrobe(player)
});
_api_1.RAGERP.cef.register("wardrobe", "open", async (player) => openWardrobe(player));
_api_1.RAGERP.cef.register("wardrobe", "getClothes", async (player) => {
    if (!player.character)
        return;
    const clothes = getClothesForPlayer(player);
    CEFEvent_class_1.CefEvent.emit(player, "wardrobe", "setClothes", clothes);
});
_api_1.RAGERP.cef.register("wardrobe", "save", async (player, data) => {
    if (!player.character)
        return;
    const clothes = _api_1.RAGERP.utils.parseObject(data);
    player.character.appearance.clothes = clothes;
    await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).update(player.character.id, {
        appearance: player.character.appearance
    });
    player.call("client::wardrobe:applyClothes", [JSON.stringify(clothes)]);
    player.call("client::cef:close");
    player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Outfit saved!");
});
_api_1.RAGERP.cef.register("wardrobe", "saveInline", async (player, data) => {
    if (!player.character)
        return;
    const clothes = _api_1.RAGERP.utils.parseObject(data);
    player.character.appearance.clothes = clothes;
    await _api_1.RAGERP.database.getRepository(Character_entity_1.CharacterEntity).update(player.character.id, {
        appearance: player.character.appearance
    });
    player.call("client::wardrobe:applyClothes", [JSON.stringify(clothes)]);
    player.showNotify("success" /* RageShared.Enums.NotifyType.TYPE_SUCCESS */, "Outfit saved!");
});
_api_1.RAGERP.cef.register("wardrobe", "close", async (player) => {
    player.call("client::cef:close");
});


/***/ },

/***/ "./source/shared/index.ts"
/*!********************************!*\
  !*** ./source/shared/index.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RageShared = void 0;
var RageShared;
(function (RageShared) {
    let Inventory;
    (function (Inventory) {
        let Enums;
        (function (Enums) {
            Enums.INVENTORY_EQUIPMENTS = {
                hat: "0",
                mask: "1",
                glasses: "2",
                earRings: "3",
                chain: "4",
                tShirt: "5",
                top: "6",
                backpack: "7",
                wallet: "8",
                armour: "9",
                watch: "10",
                gloves: "11",
                pants: "12",
                shoes: "13"
            };
            let INVENTORY_CATEGORIES;
            (function (INVENTORY_CATEGORIES) {
                INVENTORY_CATEGORIES["CLOTHES"] = "clothes";
                INVENTORY_CATEGORIES["POCKETS"] = "pockets";
            })(INVENTORY_CATEGORIES = Enums.INVENTORY_CATEGORIES || (Enums.INVENTORY_CATEGORIES = {}));
        })(Enums = Inventory.Enums || (Inventory.Enums = {}));
    })(Inventory = RageShared.Inventory || (RageShared.Inventory = {}));
})(RageShared || (exports.RageShared = RageShared = {}));


/***/ },

/***/ "./source/shared/utils.module.ts"
/*!***************************************!*\
  !*** ./source/shared/utils.module.ts ***!
  \***************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
/**
 * Utility functions used throughout the client and server side
 */
exports.Utils = {
    /**
     * Delays execution for a specified number of milliseconds.
     * @param {number} ms - The number of milliseconds to sleep.
     * @returns {Promise<void>} A promise that resolves after the specified delay.
     */
    sleep: function (ms) {
        return new Promise((res) => setTimeout(res, ms));
    },
    /**
     * Checks if the current date has passed a given timestamp.
     * @param {number} timestamp - The timestamp to compare against the current date.
     * @returns {boolean} True if the current date has passed the timestamp, otherwise false.
     */
    hasDatePassedTimestamp: function (timestamp) {
        const currentTimestamp = Date.now();
        return currentTimestamp > timestamp;
    },
    /**
     * Attempts to parse a JSON string.
     * @param {any} obj - The object to parse.
     * @returns {any} The parsed object if successful, otherwise the original object.
     */
    tryParse: function (obj) {
        try {
            return JSON.parse(obj);
        }
        catch (_err) {
            return obj;
        }
    },
    /**
     * Merges two objects into one.
     * @template T
     * @param {T} obj1 - The first object.
     * @param {T} obj2 - The second object.
     * @returns {T} A new object containing properties from both input objects.
     */
    mergeObjects: function (obj1, obj2) {
        const newObj = {};
        Object.keys(obj1).forEach((key) => {
            newObj[key] = obj1[key];
        });
        let startIndex = Object.keys(obj1).length + 1;
        Object.keys(obj2).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(newObj, key)) {
                newObj[(startIndex++).toString()] = obj2[key];
            }
            else {
                newObj[key] = obj2[key];
            }
        });
        return newObj;
    },
    /**
     * Calculates the distance between two 3D points.
     * @param {Vector3} first - The first point.
     * @param {Vector3} second - The second point.
     * @returns {number} The distance between the two points.
     */
    distanceToPos: function (first, second) {
        return Math.abs(Math.sqrt(Math.pow(second.x - first.x, 2) + Math.pow(second.y - first.y, 2) + Math.pow(second.z - first.z, 2)));
    },
    /**
     * Converts an object to a JSON string.
     * @template T
     * @param {T} obj - The object to stringify.
     * @returns {StringifiedObject<T>} The JSON string representation of the object.
     */
    stringifyObject: function (obj) {
        return JSON.stringify(obj);
    },
    /**
     * Parses a JSON string back into an object.
     * @template T
     * @param {StringifiedObject<T>} str - The JSON string to parse.
     * @returns {T} The parsed object.
     */
    parseObject: function (str) {
        return JSON.parse(str);
    },
    /**
     * Sends a debug message to the server.
     * @param {string} message - The debug message.
     * @param {...any} args - Additional arguments to include with the message.
     */
    clientDebug: function (message, ...args) {
        //@ts-ignore
        mp.events.callRemote("server::client:debug", message, ...args);
    },
    /**
     * Returns a random element from an array.
     * @template T
     * @param {Array<T>} array - The array to sample from.
     * @returns {T} A random element from the array.
     */
    getRandomFromArray: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    /**
     * Converts a hexadecimal string representation of a floating-point number to a JavaScript float.
     *
     * @param {string} str - The hexadecimal string (without the "0x" prefix) representing the floating-point number.
     * @returns {number} - The corresponding floating-point number, or 0 if the input is invalid.
     */
    parseHexAsFloat: function (str) {
        let int = parseInt("0x" + str, 16);
        if (isNaN(int)) {
            return 0;
        }
        const sign = int >>> 31 ? -1 : 1;
        const exp = ((int >>> 23) & 0xff) - 127;
        const mantiss = (int & 0x7fffff) + 0x800000;
        return sign * mantiss * Math.pow(2, exp - 23);
    }
};


/***/ },

/***/ "colorette"
/*!****************************!*\
  !*** external "colorette" ***!
  \****************************/
(module) {

module.exports = require("colorette");

/***/ },

/***/ "dotenv"
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
(module) {

module.exports = require("dotenv");

/***/ },

/***/ "reflect-metadata"
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
(module) {

module.exports = require("reflect-metadata");

/***/ },

/***/ "typeorm"
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
(module) {

module.exports = require("typeorm");

/***/ },

/***/ "uuid"
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
(module) {

module.exports = require("uuid");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

module.exports = require("crypto");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

module.exports = require("path");

/***/ },

/***/ "./source/shared/json/femaleTorso.json"
/*!*********************************************!*\
  !*** ./source/shared/json/femaleTorso.json ***!
  \*********************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"0":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"1":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"2":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"3":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"4":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"5":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"6":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"7":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"8":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"9":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"10":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"11":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"12":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"13":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"14":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"15":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"16":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"17":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"18":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"19":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"20":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"21":{"0":{"BestTorsoDrawable":16,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":16,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":16,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":16,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":16,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":16,"BestTorsoTexture":5}},"22":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"23":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"24":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"25":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"26":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"27":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"28":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"29":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"30":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"31":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"32":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"33":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"34":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"35":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"36":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"37":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"38":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"39":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"40":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"41":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"42":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"43":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"44":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"45":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"46":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"47":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"48":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"49":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"50":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"51":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"52":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"53":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"54":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"55":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"56":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"57":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"58":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"59":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"60":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"61":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"62":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"63":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"64":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"65":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"66":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"67":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"68":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"69":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"70":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"71":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"72":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"73":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"74":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"75":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"76":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"77":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"78":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"79":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"80":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"81":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"82":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"83":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"84":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"85":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"86":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"87":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"88":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"89":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"90":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"91":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"92":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"93":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"94":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"95":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"96":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"97":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"98":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"99":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"100":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"101":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"102":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"103":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"104":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"105":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"106":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"107":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"108":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"109":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"110":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"111":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"112":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"113":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"114":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"115":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"116":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"117":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"118":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"119":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"120":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"16":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"121":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"122":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"123":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"124":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"125":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"126":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"127":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"128":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"129":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"130":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"131":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"132":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"133":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"134":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"135":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"136":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"137":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"138":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"139":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"140":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"141":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"142":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"143":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"144":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"145":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"146":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"147":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"148":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"149":{"0":{"BestTorsoDrawable":128,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":128,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":128,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":128,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":128,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":128,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":128,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":128,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":128,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":128,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":128,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":128,"BestTorsoTexture":11},"12":{"BestTorsoDrawable":128,"BestTorsoTexture":12},"13":{"BestTorsoDrawable":128,"BestTorsoTexture":13},"14":{"BestTorsoDrawable":128,"BestTorsoTexture":14},"15":{"BestTorsoDrawable":128,"BestTorsoTexture":15}},"150":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"151":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"152":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"153":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"154":{"0":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":129,"BestTorsoTexture":0}},"155":{"0":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":130,"BestTorsoTexture":0}},"156":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"157":{"0":{"BestTorsoDrawable":132,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":132,"BestTorsoTexture":0}},"158":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"159":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"160":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"161":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"162":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"163":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"164":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"165":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"166":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"167":{"0":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":129,"BestTorsoTexture":0}},"168":{"0":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":161,"BestTorsoTexture":0}},"169":{"0":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":153,"BestTorsoTexture":0}},"170":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"171":{"0":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":153,"BestTorsoTexture":0}},"172":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"173":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"174":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"175":{"0":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":129,"BestTorsoTexture":0}},"176":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"177":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"178":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"179":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"180":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"181":{"0":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":129,"BestTorsoTexture":0}},"182":{"0":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":130,"BestTorsoTexture":0}},"183":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"184":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"185":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"186":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"187":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"188":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"189":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"190":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"191":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"192":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"193":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"194":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"195":{"0":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":153,"BestTorsoTexture":0}},"196":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"197":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"198":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"199":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"200":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"201":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"202":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"203":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"204":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"205":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"206":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"207":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"208":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"209":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"210":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"211":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"212":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"213":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"214":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"215":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"216":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"217":{"0":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"218":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"219":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"220":{"0":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":129,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"221":{"0":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":161,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"222":{"0":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":153,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"223":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"224":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"225":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"226":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"227":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"228":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"229":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"230":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"231":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"232":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"233":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"234":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"235":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"236":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"237":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"238":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"239":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"240":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"241":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"242":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"243":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"244":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"245":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"246":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"247":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"248":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"249":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"250":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"251":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"252":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"253":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"254":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"255":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"256":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"257":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"258":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"259":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"260":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"261":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"262":{"0":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":7,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":7,"BestTorsoTexture":0}},"263":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"264":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"24":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"25":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"265":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"266":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"267":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"268":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"24":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"25":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"269":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"270":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"271":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"272":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"273":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"274":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"275":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"276":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"277":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"278":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"279":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"280":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"281":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"282":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"283":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"284":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"285":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"286":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"287":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"288":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"289":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"290":{"0":{"BestTorsoDrawable":205,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":205,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":205,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":205,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":205,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":205,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":205,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":205,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":205,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":205,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":205,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":205,"BestTorsoTexture":11}},"291":{"0":{"BestTorsoDrawable":206,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":206,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":206,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":206,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":206,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":206,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":206,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":206,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":206,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":206,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":206,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":206,"BestTorsoTexture":11},"12":{"BestTorsoDrawable":206,"BestTorsoTexture":12},"13":{"BestTorsoDrawable":206,"BestTorsoTexture":13},"14":{"BestTorsoDrawable":206,"BestTorsoTexture":14},"15":{"BestTorsoDrawable":206,"BestTorsoTexture":15},"16":{"BestTorsoDrawable":206,"BestTorsoTexture":16},"17":{"BestTorsoDrawable":206,"BestTorsoTexture":17}},"292":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"293":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"294":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"295":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"296":{"0":{"BestTorsoDrawable":207,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":207,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":207,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":207,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":207,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":207,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":207,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":207,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":207,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":207,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":207,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":207,"BestTorsoTexture":11}},"297":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"298":{"0":{"BestTorsoDrawable":18,"BestTorsoTexture":0}},"299":{"0":{"BestTorsoDrawable":208,"BestTorsoTexture":0}},"300":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"301":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"302":{"0":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":131,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":131,"BestTorsoTexture":0}},"303":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"304":{"0":{"BestTorsoDrawable":209,"BestTorsoTexture":0}},"305":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"306":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"307":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"308":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"309":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"310":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"311":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"312":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"313":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"314":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"315":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"316":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"317":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"318":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"319":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"320":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"321":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"322":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"323":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"324":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"325":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"326":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"327":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"328":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"329":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"330":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"331":{"0":{"BestTorsoDrawable":18,"BestTorsoTexture":0}},"332":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"333":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"334":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"335":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"336":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"337":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"338":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"339":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"340":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"341":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"342":{"0":{"BestTorsoDrawable":130,"BestTorsoTexture":0}},"343":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"344":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"345":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"346":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"347":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"348":{"0":{"BestTorsoDrawable":210,"BestTorsoTexture":0}},"349":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"350":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"351":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"352":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"353":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"354":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"16":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"17":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"18":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"19":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"24":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"355":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"356":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"357":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"358":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"359":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"360":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"361":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"362":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"363":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"364":{"0":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":229,"BestTorsoTexture":0}},"365":{"0":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":229,"BestTorsoTexture":0}},"366":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"367":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"368":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"369":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"370":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"371":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"372":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":9,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"373":{"0":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":229,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":229,"BestTorsoTexture":0}},"374":{"0":{"BestTorsoDrawable":9,"BestTorsoTexture":0}},"375":{"0":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":130,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":130,"BestTorsoTexture":0}},"376":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"377":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"378":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"379":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"380":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0}}}');

/***/ },

/***/ "./source/shared/json/maleTorso.json"
/*!*******************************************!*\
  !*** ./source/shared/json/maleTorso.json ***!
  \*******************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"0":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"1":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"2":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"3":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"11":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"4":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"5":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"6":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"7":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"8":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"9":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"10":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"11":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"12":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"13":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"14":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"15":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"16":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"17":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"18":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"19":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"20":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"21":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"22":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"23":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"24":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"25":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"26":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"27":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"28":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"29":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"30":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"31":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"32":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"33":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"34":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"35":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"36":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"37":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"38":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"39":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"40":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"41":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"42":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"43":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"44":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"45":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"46":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"47":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"48":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"49":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"50":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"51":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"52":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"53":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"54":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"55":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"56":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"57":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"58":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"59":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"60":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"61":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"62":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"63":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"64":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"65":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"66":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"67":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"68":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"69":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"70":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"71":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"72":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"73":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"74":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"75":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"76":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"77":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"78":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"79":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"80":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"81":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"82":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"83":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"84":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"85":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"86":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"87":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"88":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"89":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"90":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"91":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"92":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"93":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"94":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"95":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"96":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"97":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"98":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"99":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"100":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"101":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"102":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"103":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"104":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"105":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"106":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"107":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"108":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"109":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"110":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"111":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"112":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"113":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"114":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"115":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"116":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"117":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"118":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"119":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"120":{"0":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":15,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":15,"BestTorsoTexture":0}},"121":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"122":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"123":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"124":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"125":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"126":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"127":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"128":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"129":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"130":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"131":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"132":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"133":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"134":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"135":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"136":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"137":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"138":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"139":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"140":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"141":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"142":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"143":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"144":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"145":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"146":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"147":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"148":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"149":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"150":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"151":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"152":{"0":{"BestTorsoDrawable":111,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":111,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":111,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":111,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":111,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":111,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":111,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":111,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":111,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":111,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":111,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":111,"BestTorsoTexture":11},"12":{"BestTorsoDrawable":111,"BestTorsoTexture":12},"13":{"BestTorsoDrawable":111,"BestTorsoTexture":13},"14":{"BestTorsoDrawable":111,"BestTorsoTexture":14},"15":{"BestTorsoDrawable":111,"BestTorsoTexture":15}},"153":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"154":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"155":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"156":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"157":{"0":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":112,"BestTorsoTexture":0}},"158":{"0":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":113,"BestTorsoTexture":0}},"159":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"160":{"0":{"BestTorsoDrawable":115,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":115,"BestTorsoTexture":0}},"161":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"162":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"163":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"164":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"165":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"166":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"167":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"168":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0}},"169":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"170":{"0":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":112,"BestTorsoTexture":0}},"171":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"172":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"173":{"0":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":112,"BestTorsoTexture":0}},"174":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"175":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"176":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"177":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"178":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"179":{"0":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":112,"BestTorsoTexture":0}},"180":{"0":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":113,"BestTorsoTexture":0}},"181":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"182":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"183":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"184":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"185":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"186":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"9":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"10":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"187":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"188":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"189":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"190":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"191":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"192":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"193":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"194":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"195":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"196":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"197":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"198":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"199":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"200":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"201":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"202":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"203":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"204":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"205":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"206":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"207":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"208":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"209":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"210":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"211":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"212":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"213":{"0":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":113,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"214":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"215":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"216":{"0":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":112,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"217":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"218":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"219":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"220":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"221":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"222":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"223":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"224":{"0":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":12,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"13":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"14":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"15":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"225":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"226":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"227":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"228":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"229":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"230":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"231":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"232":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"233":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"234":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"235":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"236":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"237":{"0":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":5,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":5,"BestTorsoTexture":0}},"238":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"239":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"21":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"22":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"23":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"240":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"241":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"242":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"243":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"244":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"245":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"246":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"247":{"0":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":114,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":114,"BestTorsoTexture":0}},"248":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"249":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"250":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"251":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"252":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"253":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"254":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"255":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"256":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"257":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"258":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"259":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"260":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"261":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"262":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"263":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"264":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"265":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"266":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"267":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"268":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"269":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"270":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"271":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"272":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"273":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"274":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"275":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"276":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"277":{"0":{"BestTorsoDrawable":164,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":164,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":164,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":164,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":164,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":164,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":164,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":164,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":164,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":164,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":164,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":164,"BestTorsoTexture":11}},"278":{"0":{"BestTorsoDrawable":165,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":165,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":165,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":165,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":165,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":165,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":165,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":165,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":165,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":165,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":165,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":165,"BestTorsoTexture":11},"12":{"BestTorsoDrawable":165,"BestTorsoTexture":12},"13":{"BestTorsoDrawable":165,"BestTorsoTexture":13},"14":{"BestTorsoDrawable":165,"BestTorsoTexture":14},"15":{"BestTorsoDrawable":165,"BestTorsoTexture":15},"16":{"BestTorsoDrawable":165,"BestTorsoTexture":16},"17":{"BestTorsoDrawable":165,"BestTorsoTexture":17}},"279":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"280":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"281":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"282":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"283":{"0":{"BestTorsoDrawable":166,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":166,"BestTorsoTexture":1},"2":{"BestTorsoDrawable":166,"BestTorsoTexture":2},"3":{"BestTorsoDrawable":166,"BestTorsoTexture":3},"4":{"BestTorsoDrawable":166,"BestTorsoTexture":4},"5":{"BestTorsoDrawable":166,"BestTorsoTexture":5},"6":{"BestTorsoDrawable":166,"BestTorsoTexture":6},"7":{"BestTorsoDrawable":166,"BestTorsoTexture":7},"8":{"BestTorsoDrawable":166,"BestTorsoTexture":8},"9":{"BestTorsoDrawable":166,"BestTorsoTexture":9},"10":{"BestTorsoDrawable":166,"BestTorsoTexture":10},"11":{"BestTorsoDrawable":166,"BestTorsoTexture":11}},"284":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"285":{"0":{"BestTorsoDrawable":17,"BestTorsoTexture":0}},"286":{"0":{"BestTorsoDrawable":167,"BestTorsoTexture":0}},"287":{"0":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":3,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":3,"BestTorsoTexture":0}},"288":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"289":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"290":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"291":{"0":{"BestTorsoDrawable":168,"BestTorsoTexture":0}},"292":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"293":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"294":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"295":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"296":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"297":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"298":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"299":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"300":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"301":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"302":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"303":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"304":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"305":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"306":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"307":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"308":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"309":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":144,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"310":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"311":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"312":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"313":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"314":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"315":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"316":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"317":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"318":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"319":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"320":{"0":{"BestTorsoDrawable":17,"BestTorsoTexture":0}},"321":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"322":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"323":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"324":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"325":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"326":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"327":{"0":{"BestTorsoDrawable":113,"BestTorsoTexture":0}},"328":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"329":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"330":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"331":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"332":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"333":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"334":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"335":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":8,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"336":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"337":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"338":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"339":{"0":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":14,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":14,"BestTorsoTexture":0}},"340":{"0":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"1":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"2":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"3":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"4":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"5":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"6":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"7":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1},"8":{"BestTorsoDrawable":-1,"BestTorsoTexture":-1}},"341":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"342":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"343":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"344":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"345":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"346":{"0":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":184,"BestTorsoTexture":0}},"347":{"0":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":184,"BestTorsoTexture":0}},"348":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"349":{"0":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":1,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":1,"BestTorsoTexture":0}},"350":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"351":{"0":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":0,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":0,"BestTorsoTexture":0}},"352":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"353":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":4,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"354":{"0":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":11,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":11,"BestTorsoTexture":0}},"355":{"0":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"10":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"11":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"12":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"13":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"14":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"15":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"16":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"17":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"18":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"19":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"20":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"21":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"22":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"23":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"24":{"BestTorsoDrawable":184,"BestTorsoTexture":0},"25":{"BestTorsoDrawable":184,"BestTorsoTexture":0}},"356":{"0":{"BestTorsoDrawable":8,"BestTorsoTexture":0}},"357":{"0":{"BestTorsoDrawable":2,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":2,"BestTorsoTexture":0}},"358":{"0":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"1":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"2":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"3":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"4":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"5":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"6":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"7":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"8":{"BestTorsoDrawable":6,"BestTorsoTexture":0},"9":{"BestTorsoDrawable":6,"BestTorsoTexture":0}},"359":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"360":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}},"361":{"0":{"BestTorsoDrawable":4,"BestTorsoTexture":0}}}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./source/server/index.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
/*

        ██████╗  █████╗  ██████╗ ███████╗███╗   ███╗██████╗     ██████╗ ██████╗      ██████╗  █████╗ ███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ███████╗
        ██╔══██╗██╔══██╗██╔════╝ ██╔════╝████╗ ████║██╔══██╗    ██╔══██╗██╔══██╗    ██╔════╝ ██╔══██╗████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗██╔════╝
        ██████╔╝███████║██║  ███╗█████╗  ██╔████╔██║██████╔╝    ██████╔╝██████╔╝    ██║  ███╗███████║██╔████╔██║█████╗  ██╔████╔██║██║   ██║██║  ██║█████╗
        ██╔══██╗██╔══██║██║   ██║██╔══╝  ██║╚██╔╝██║██╔═══╝     ██╔══██╗██╔═══╝     ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝
        ██║  ██║██║  ██║╚██████╔╝███████╗██║ ╚═╝ ██║██║         ██║  ██║██║         ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗
        ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝         ╚═╝  ╚═╝╚═╝          ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
                                                                        Author: shr0x
                                                                      ~How beasts do it~

*/
const _api_1 = __webpack_require__(/*! @api */ "./source/server/api/index.ts");
//---------------------------------------//
__webpack_require__(/*! @commands/index */ "./source/server/commands/index.ts");
//---------------------------------------//
__webpack_require__(/*! @prototype/Player.prototype */ "./source/server/prototype/Player.prototype.ts");
//---------------------------------------//
__webpack_require__(/*! @classes/WorldManager.class */ "./source/server/classes/WorldManager.class.ts");
//---------------------------------------//
__webpack_require__(/*! @events/Auth.event */ "./source/server/serverevents/Auth.event.ts");
__webpack_require__(/*! @events/Chat.event */ "./source/server/serverevents/Chat.event.ts");
__webpack_require__(/*! @events/Server.event */ "./source/server/serverevents/Server.event.ts");
__webpack_require__(/*! @events/Character.event */ "./source/server/serverevents/Character.event.ts");
__webpack_require__(/*! @events/Player.event */ "./source/server/serverevents/Player.event.ts");
__webpack_require__(/*! @events/Inventory.event */ "./source/server/serverevents/Inventory.event.ts");
__webpack_require__(/*! @events/Death.event */ "./source/server/serverevents/Death.event.ts");
__webpack_require__(/*! @events/DamageSync.event */ "./source/server/serverevents/DamageSync.event.ts");
__webpack_require__(/*! @events/Vehicle.event */ "./source/server/serverevents/Vehicle.event.ts");
__webpack_require__(/*! @events/Point.event */ "./source/server/serverevents/Point.event.ts");
__webpack_require__(/*! @events/Wardrobe.event */ "./source/server/serverevents/Wardrobe.event.ts");
__webpack_require__(/*! @events/MainMenu.event */ "./source/server/serverevents/MainMenu.event.ts");
__webpack_require__(/*! @events/PlayerMenu.event */ "./source/server/serverevents/PlayerMenu.event.ts");
__webpack_require__(/*! @arena/ArenaMatch.manager */ "./source/server/arena/ArenaMatch.manager.ts");
__webpack_require__(/*! @events/Arena.event */ "./source/server/serverevents/Arena.event.ts");
//---------------------------------------//
const colorette_1 = __webpack_require__(/*! colorette */ "colorette");
//---------------------------------------//
async function initGamemode() {
    mp.events.delayInitialization = true;
    await _api_1.RAGERP.database
        .initialize()
        .then(() => console.log("Database connected!"))
        .catch((err) => {
        throw new Error(err);
    });
    console.log((0, colorette_1.yellow)("======================================================================================================"));
    console.log((0, colorette_1.green)(" ██████╗  █████╗ ███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ███████╗    ██╗███╗   ██╗██╗████████╗"));
    console.log((0, colorette_1.green)("██╔════╝ ██╔══██╗████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗██╔════╝    ██║████╗  ██║██║╚══██╔══╝"));
    console.log((0, colorette_1.green)("██║  ███╗███████║██╔████╔██║█████╗  ██╔████╔██║██║   ██║██║  ██║█████╗      ██║██╔██╗ ██║██║   ██║   "));
    console.log((0, colorette_1.green)("██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝      ██║██║╚██╗██║██║   ██║   "));
    console.log((0, colorette_1.green)("╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗    ██║██║ ╚████║██║   ██║   "));
    console.log((0, colorette_1.green)(" ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝    ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   "));
    console.log((0, colorette_1.yellow)("======================================================================================================"));
    //@ts-ignore
    console.log((0, colorette_1.blue)(`Server Events: ${Object.values(mp.events.binded).length}`));
    console.log((0, colorette_1.blue)(`Cef Events: ${_api_1.RAGERP.cef.poolSize}`));
    console.log((0, colorette_1.blue)(`Total Commands: ${_api_1.RAGERP.commands._commands.size}`));
    mp.events.delayInitialization = false;
}
(async () => {
    await initGamemode().then(() => console.log("[SHROX FRAMEWORK] Gamemode Initialized"));
})();

})();

/******/ })()
;
//# sourceMappingURL=index.js.map