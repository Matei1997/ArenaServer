import * as React from "react";
import { observer } from "mobx-react-lite";
import EventManager from "utils/EventManager.util";
import { arenaStore } from "store/Arena.store";
import { playerStore } from "store/Player.store";
import { createComponent } from "src/hoc/registerComponent";
import style from "./arenaHud.module.scss";

const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const ArenaHudInner: React.FC = observer(() => {
    const { match, killFeed, matchEnd, mapName, lastKillNotification, lastDeathNotification, scoreboardVisible, roundStart, roundEnd, zone, itemCounts, itemCast, vitals, outOfBounds } = arenaStore;

    if (matchEnd) {
        return (
            <div className={style.results}>
                <div className={style.resultsTitle}>MATCH OVER</div>
                <div className={style.resultsScores}>
                    <div className={style.teamScore}>
                        <span className={style.teamLabel}>RED</span>
                        <span className={style.score}>{matchEnd.redScore}</span>
                    </div>
                    <span className={style.vs}>—</span>
                    <div className={style.teamScore}>
                        <span className={style.teamLabel}>BLUE</span>
                        <span className={style.score}>{matchEnd.blueScore}</span>
                    </div>
                </div>
                <div className={style.winner}>
                    {matchEnd.winner === "draw" ? "DRAW" : `${matchEnd.winner.toUpperCase()} WINS`}
                </div>
                <div className={style.resultsTeams}>
                    <div className={style.teamList}>
                        <div className={style.teamHeader}>RED</div>
                        {matchEnd.redTeam.map((p) => (
                            <div key={p.id} className={style.playerRow}>
                                <span>{p.name}</span>
                                <span className={style.kd}>{p.kills}/{p.deaths}</span>
                            </div>
                        ))}
                    </div>
                    <div className={style.teamList}>
                        <div className={style.teamHeader}>BLUE</div>
                        {matchEnd.blueTeam.map((p) => (
                            <div key={p.id} className={style.playerRow}>
                                <span>{p.name}</span>
                                <span className={style.kd}>{p.kills}/{p.deaths}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!match) return null;

    if (scoreboardVisible) {
        return (
            <div className={style.scoreboardOverlay} onClick={() => (arenaStore.scoreboardVisible = false)}>
                <div className={style.scoreboardPanel} onClick={(e) => e.stopPropagation()}>
                    <div className={style.scoreboardTitle}>SCOREBOARD</div>
                    <div className={style.scoreboardScores}>
                        <span className={style.sbRed}>RED {match.redScore}</span>
                        <span className={style.sbTimer}>Round {match.currentRound} — First to {match.roundsToWin}</span>
                        <span className={style.sbBlue}>BLUE {match.blueScore}</span>
                    </div>
                    <div className={style.scoreboardTeams}>
                        <div className={style.sbTeam}>
                            <div className={style.sbTeamHeader}>RED</div>
                            {match.redTeam.map((p) => (
                                <div key={p.id} className={`${style.sbRow} ${!p.alive ? style.dead : ""}`}>
                                    <span>{p.name}</span>
                                    <span className={style.sbKills}>{p.kills}</span>
                                    <span className={style.sbDeaths}>{p.deaths}</span>
                                </div>
                            ))}
                        </div>
                        <div className={style.sbTeam}>
                            <div className={style.sbTeamHeader}>BLUE</div>
                            {match.blueTeam.map((p) => (
                                <div key={p.id} className={`${style.sbRow} ${!p.alive ? style.dead : ""}`}>
                                    <span>{p.name}</span>
                                    <span className={style.sbKills}>{p.kills}</span>
                                    <span className={style.sbDeaths}>{p.deaths}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={style.scoreboardHint}>CAPS to close</div>
                </div>
            </div>
        );
    }

    const myId = playerStore.data.id;
    const myTeam = match.redTeam.some((p) => p.id === myId) ? "red" : match.blueTeam.some((p) => p.id === myId) ? "blue" : null;
    const teammates = myTeam === "red" ? match.redTeam : myTeam === "blue" ? match.blueTeam : [];

    return (
        <div className={style.arenaHud}>
            {/* Round start/end overlays */}
            {roundStart && (
                <div className={style.roundOverlay}>
                    <div className={style.roundTitle}>ROUND {roundStart.round}</div>
                    <div className={style.roundWeapon}>{roundStart.weaponName}</div>
                    <div className={style.roundScore}>{roundStart.redScore} — {roundStart.blueScore}</div>
                </div>
            )}
            {roundEnd && (
                <div className={style.roundOverlay}>
                    <div className={style.roundTitle}>
                        {roundEnd.winner === "draw" ? "ROUND DRAW" : `${roundEnd.winner.toUpperCase()} WINS ROUND`}
                    </div>
                    <div className={style.roundScore}>{roundEnd.redScore} — {roundEnd.blueScore}</div>
                </div>
            )}

            {/* Top center: scores + round info */}
            <div className={style.topCenter}>
                <div className={style.scores}>
                    <div className={style.teamBadge}>
                        <span className={style.redDot} />
                        <span className={style.teamName}>RED</span>
                        <span className={style.alive}>{match.redAlive} alive</span>
                        <span className={style.score}>{match.redScore}</span>
                    </div>
                    <div className={style.centerInfo}>
                        <div className={style.timer}>{formatTime(match.timeLeft)}</div>
                        <div className={style.roundLabel}>Round {match.currentRound} • FT {match.roundsToWin}</div>
                        {match.weaponName && <div className={style.weaponLabel}>{match.weaponName}</div>}
                    </div>
                    <div className={style.teamBadge}>
                        <span className={style.blueDot} />
                        <span className={style.teamName}>BLUE</span>
                        <span className={style.alive}>{match.blueAlive} alive</span>
                        <span className={style.score}>{match.blueScore}</span>
                    </div>
                </div>
                <div className={style.mapName}>{mapName}</div>
            </div>

            {/* Zone info */}
            {zone && (
                <div className={style.zoneInfo}>
                    <span className={style.zonePhase}>Zone {zone.phase}/{zone.totalPhases}</span>
                    <span className={style.zoneTimer}>{zone.phaseTimeLeft}s</span>
                    <span className={style.zoneRadius}>R:{zone.radius}m</span>
                    {zone.dps > 0 && <span className={style.zoneDps}>{zone.dps} dps</span>}
                </div>
            )}

            {outOfBounds.active && (
                <div className={style.outOfBounds}>
                    RETURN TO PLAYABLE AREA • {outOfBounds.timeLeft}s
                </div>
            )}

            {/* Teammates */}
            <div className={style.topLeft}>
                <div className={style.teammates}>
                    {teammates.map((p) => {
                        const isMe = p.id === myId;
                        const hp = Math.max(0, Math.min(100, p.health ?? (isMe ? vitals.health : 0)));
                        const ap = Math.max(0, Math.min(100, p.armor ?? (isMe ? vitals.armor : 0)));
                        return (
                            <div key={p.id} className={`${style.teammate} ${!p.alive ? style.dead : ""}`}>
                                <span className={style.tmName}>{p.name}{isMe ? " (YOU)" : ""}</span>
                                <span className={style.tmStatus}>{p.alive ? `${p.kills}K` : "DEAD"}</span>
                                <div className={style.tmBarsInline}>
                                    <div className={style.tmBarInline}>
                                        <div className={style.tmBarArmor} style={{ width: `${ap}%` }} />
                                    </div>
                                    <div className={style.tmBarInline}>
                                        <div className={style.tmBarHealth} style={{ width: `${hp}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Kill feed */}
            <div className={style.bottomLeft}>
                <div className={style.killFeed}>
                    {killFeed.map((e, i) => (
                        <div key={`${e.killer}-${e.victim}-${i}`} className={style.killEntry}>
                            <span className={style.killer}>{e.killer}</span>
                            <span className={style.arrow}>→</span>
                            <span className={style.victim}>{e.victim}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kill/death notifications */}
            {(lastKillNotification || lastDeathNotification) && (
                <div className={style.centerNotification}>
                    {lastKillNotification && (
                        <div className={style.killNotif}>
                            <span className={style.killLabel}>ELIMINATED</span>
                            <span className={style.killName}>{lastKillNotification.victim}</span>
                        </div>
                    )}
                    {lastDeathNotification && (
                        <div className={style.deathNotif}>
                            <span className={style.deathLabel}>ELIMINATED BY</span>
                            <span className={style.deathName}>{lastDeathNotification.killer || "Unknown"}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Items (press 5/6 to use) */}
            <div className={style.itemBar}>
                <div className={`${style.itemBtn} ${itemCounts.medkits <= 0 ? style.itemDisabled : ""}`}>
                    <span className={style.itemKey}>5</span>
                    <span className={style.itemIcon}>+</span>
                    <span className={style.itemLabel}>Medkit</span>
                    <span className={style.itemCount}>{itemCounts.medkits}</span>
                </div>
                <div className={`${style.itemBtn} ${itemCounts.plates <= 0 ? style.itemDisabled : ""}`}>
                    <span className={style.itemKey}>6</span>
                    <span className={style.itemIcon}>⛨</span>
                    <span className={style.itemLabel}>Plate</span>
                    <span className={style.itemCount}>{itemCounts.plates}</span>
                </div>
                {itemCast && (
                    <div className={style.castBar}>
                        <div className={style.castLabel}>{itemCast.item === "medkit" ? "Healing..." : "Plating..."}</div>
                        <div className={style.castProgress}>
                            <div
                                className={style.castFill}
                                style={{
                                    animationDuration: `${itemCast.castTime}ms`
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom right: weapon, health, leave */}
            <div className={style.bottomRight}>
                {playerStore.data.weapondata && (
                    <div className={style.weapon}>
                        <span className={style.ammo}>
                            {playerStore.data.weapondata.ammo} / {playerStore.data.weapondata.maxammo}
                        </span>
                    </div>
                )}
                <button
                    className={style.leaveMatchBtn}
                    onClick={() => EventManager.emitServer("arena", "leaveMatch")}
                >
                    LEAVE
                </button>
            </div>
        </div>
    );
});

export default createComponent({
    props: {},
    component: ArenaHudInner,
    pageName: "arena_hud"
});
