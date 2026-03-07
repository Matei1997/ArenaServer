import { hospitalSpawns } from "@assets/PlayerSpawn.asset";
import { RageShared } from "@shared/index";
import { Utils } from "@shared/utils.module";
import { isPlayerInArenaMatch, handleArenaDeath } from "@arena/ArenaMatch.manager";
import { setPlayerToInjuredState } from "./Death.utils";

function findClosestHospital(player: PlayerMp) {
    let closestSpawn = null;
    let closestDistance = Infinity;
    for (const spawn of hospitalSpawns) {
        const distance = Utils.distanceToPos(player.position, spawn.position);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSpawn = spawn;
        }
    }
    return closestSpawn;
}

function playerAcceptedDeath(player: PlayerMp) {
    if (!player || !mp.players.exists(player) || !player.character) return;
    const hospitalData = findClosestHospital(player);
    if (!hospitalData) {
        const randomHospital = Utils.getRandomFromArray(hospitalSpawns);
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
    player.character.deathState = RageShared.Players.Enums.DEATH_STATES.STATE_NONE;
    player.stopScreenEffect("DeathFailMPIn");
}
function playerDeath(player: PlayerMp, _reason: number, killer: PlayerMp | undefined) {
    if (!player || !mp.players.exists(player) || !player.character) return;

    if (isPlayerInArenaMatch(player) && handleArenaDeath(player, killer)) {
        return;
    }

    if (player.character.deathState === RageShared.Players.Enums.DEATH_STATES.STATE_NONE) {
        player.spawn(player.position);
        setPlayerToInjuredState(player);
        player.character.save(player);
        return;
    }
    playerAcceptedDeath(player);
    return;
}
mp.events.add("playerDeath", playerDeath);
mp.events.add("server::player:acceptDeath", playerAcceptedDeath);
