import * as React from "react";
import { observer } from "mobx-react-lite";
import EventManager from "utils/EventManager.util";
import { createComponent } from "src/hoc/registerComponent";
import { playerStore } from "store/Player.store";
import { IconSkull, IconUsers, IconGun, IconUser } from "src/components/ui/Icons";
import style from "./mainmenu.module.scss";
import LoadoutPanel from "../loadout/LoadoutPanel";
import ClothingPanel from "../clothing/ClothingPanel";

const GAME_MODES = [
    { id: "hopouts", label: "HOP OUTS", Icon: IconSkull },
    { id: "ffa", label: "FREE FOR ALL", Icon: IconUsers },
    { id: "gungame", label: "GUN GAME", Icon: IconGun }
] as const;

const HOP_OUT_SIZES = [2, 3, 4, 5] as const;

const FALLBACK_MAPS = [
    { id: "camp", name: "CAMP", players: "0 / 30", status: "OPEN" },
    { id: "island", name: "ISLAND", players: "0 / 30", status: "OPEN" },
    { id: "sawmill", name: "SAWMILL", players: "0 / 30", status: "OPEN" }
];

const MainMenu: React.FC = observer(() => {
    const [loading, setLoading] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [activeNav, setActiveNav] = React.useState<"play" | "connect" | "ranking" | "loadout" | "clothing">("play");
    const [gameMode, setGameMode] = React.useState<(typeof GAME_MODES)[number]["id"]>("hopouts");
    const [queueSize, setQueueSize] = React.useState<(typeof HOP_OUT_SIZES)[number]>(2);
    const [arenaMaps, setArenaMaps] = React.useState<{ id: string; name: string }[]>([]);
    const [selectedMap, setSelectedMap] = React.useState<string>("");
    const [playerName, setPlayerName] = React.useState<string>("Player");

    React.useEffect(() => {
        EventManager.addHandler("mainmenu", "playError", (data: { message: string }) => {
            setLoading(null);
            setError(data.message);
            setTimeout(() => setError(null), 5000);
        });
        EventManager.addHandler("mainmenu", "setPlayerData", (data: { name: string }) => {
            setPlayerName(data.name || "Player");
        });
        EventManager.addHandler("mainmenu", "setArenaMaps", (data: { maps: { id: string; name: string }[] }) => {
            const maps = data?.maps ?? [];
            setArenaMaps(maps);
            if (maps.length > 0) {
                setSelectedMap((prev) => prev || maps[0].id);
            }
        });
        EventManager.emitServer("mainmenu", "getArenaMaps");
        return () => EventManager.removeTargetHandlers("mainmenu");
    }, []);

    const handleQueue = React.useCallback(() => {
        setError(null);
        setLoading("arena");
        const payload: { mode: string; map?: string; size?: number } = { mode: gameMode, map: selectedMap };
        if (gameMode === "hopouts") payload.size = queueSize;
        EventManager.emitServer("mainmenu", "playArena", JSON.stringify(payload));
        setTimeout(() => setLoading(null), 3000);
    }, [gameMode, selectedMap, queueSize]);

    const handleFreeroam = React.useCallback(() => {
        setError(null);
        setLoading("freeroam");
        EventManager.emitServer("mainmenu", "playFreeroam");
        setTimeout(() => setLoading(null), 2000);
    }, []);

    const openSettings = React.useCallback(() => {
        EventManager.emitServer("mainmenu", "openSettings");
    }, []);

    const isLoading = loading !== null;
    const mapOptions = arenaMaps.length
        ? arenaMaps.map((m) => ({ id: m.id, name: m.name, players: "0 / 30", status: "OPEN" }))
        : FALLBACK_MAPS;
    const displayName = playerName && playerName !== "Player" ? playerName : (playerStore.data.id ? `Player [${playerStore.data.id}]` : "Player");
    const playersLabel = gameMode === "hopouts" ? String(queueSize * 2) : "FREE";

    return (
        <div className={cn(style.lobby, activeNav === "clothing" && style.sceneMode)}>
            <header className={style.navBar}>
                <div className={style.navLeft}>
                    <div className={style.logo}>
                        <span className={style.logoMain}>ARENA</span>
                        <span className={style.logoSub}>ENTER HIDEOUT</span>
                    </div>
                    <nav className={style.navLinks}>
                        <button className={cn(style.navLink, activeNav === "play" && style.active)} onClick={() => setActiveNav("play")}>
                            PLAY
                        </button>
                        <button className={cn(style.navLink, activeNav === "connect" && style.active)} onClick={() => setActiveNav("connect")}>
                            CONNECT THE MATCH
                        </button>
                        <button className={cn(style.navLink, activeNav === "ranking" && style.active)} onClick={() => setActiveNav("ranking")}>
                            GLOBAL RANKING
                        </button>
                        <button className={cn(style.navLink, activeNav === "loadout" && style.active)} onClick={() => setActiveNav("loadout")}>
                            LOADOUT
                        </button>
                        <button className={cn(style.navLink, activeNav === "clothing" && style.active)} onClick={() => setActiveNav("clothing")}>
                            CLOTHING
                        </button>
                    </nav>
                </div>
                <div className={style.navRight}>
                    <button className={style.navLink} onClick={openSettings}>
                        SETTINGS
                    </button>
                    <div className={style.playerBadge}>
                        <span className={style.gems}>0 GEMS</span>
                        <span className={style.playerName}>{displayName}</span>
                    </div>
                    <button className={style.leaveBtn}>LEAVE THE ARENA →</button>
                </div>
            </header>

            {activeNav === "play" && (
                <main className={style.mainContent}>
                    <aside className={style.modeColumn}>
                        <div className={style.modeList}>
                            {GAME_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    className={cn(style.modeCard, gameMode === mode.id && style.modeCardActive)}
                                    onClick={() => setGameMode(mode.id)}
                                >
                                    <div className={style.modeThumb} />
                                    <div className={style.modeMeta}>
                                        <span className={style.modeName}>{mode.label}</span>
                                        <span className={style.modeHint}>PVP PLAYLIST</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {gameMode === "hopouts" && (
                            <div className={style.sizeList}>
                                {HOP_OUT_SIZES.map((size) => (
                                    <button
                                        key={size}
                                        className={cn(style.sizeCard, queueSize === size && style.sizeCardActive)}
                                        onClick={() => setQueueSize(size)}
                                    >
                                        <div className={style.sizeLabel}>{size}V{size}</div>
                                        <div className={style.sizeSub}>HOP OUTS</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </aside>

                    <div className={style.mapGrid}>
                        {mapOptions.map((map) => (
                            <button
                                key={map.id}
                                className={cn(style.mapCard, selectedMap === map.id && style.mapCardActive)}
                                onClick={() => setSelectedMap(map.id)}
                            >
                                <div className={style.mapPlayers}>
                                    <IconUser size="1em" /> {map.players}
                                </div>
                                <div className={style.mapStatus}>{map.status}</div>
                                <div className={style.mapName}>{map.name}</div>
                            </button>
                        ))}
                    </div>

                    <aside className={style.createPanel}>
                        <h2 className={style.createTitle}>CREATE A MATCH</h2>
                        <p className={style.createDesc}>CREATE A PRIVATE ROOM TO COMPETE WITH YOUR FRIENDS OR JUST TO PRACTICE</p>
                        <div className={style.createSettings}>
                            <div className={style.settingRow}>
                                <span className={style.settingLabel}>MAP:</span>
                                <span className={style.settingValue}>{mapOptions.find((m) => m.id === selectedMap)?.name ?? "SAWMILL"}</span>
                            </div>
                            <div className={style.settingRow}>
                                <span className={style.settingLabel}>PLAYERS:</span>
                                <span className={style.settingValue}>{playersLabel}</span>
                            </div>
                            <div className={style.settingRow}>
                                <span className={style.settingLabel}>RATE:</span>
                                <span className={style.settingValue}>500</span>
                            </div>
                            <div className={style.settingRow}>
                                <span className={style.settingLabel}>WEAPON:</span>
                                <span className={style.settingValue}>RANDOM</span>
                            </div>
                            <div className={style.settingRow}>
                                <span className={style.settingLabel}>MODE:</span>
                                <span className={style.settingValue}>{GAME_MODES.find((m) => m.id === gameMode)?.label ?? "HOP OUTS"}</span>
                            </div>
                            <div className={style.settingRow}>
                                <span className={style.settingLabel}>ROUNDS:</span>
                                <span className={style.settingValue}>3</span>
                            </div>
                        </div>
                        <button className={style.createBtn} onClick={handleQueue} disabled={isLoading}>
                            {loading === "arena" ? "JOINING..." : "CREATE A MATCH"}
                        </button>
                        <button className={style.freeroamBtn} onClick={handleFreeroam} disabled={isLoading}>
                            {loading === "freeroam" ? "..." : "FREEROAM"}
                        </button>
                    </aside>
                </main>
            )}

            {activeNav === "connect" && (
                <div className={style.infoContent}>
                    <div className={style.infoTitle}>CONNECT THE MATCH</div>
                    <div className={style.infoDesc}>
                        Join an existing match by entering a match code shared by a friend.
                        This feature will be available soon.
                    </div>
                </div>
            )}

            {activeNav === "ranking" && (
                <div className={style.infoContent}>
                    <div className={style.infoTitle}>GLOBAL RANKING</div>
                    <div className={style.infoDesc}>
                        Compete in ranked matches to climb the leaderboard.
                        Rankings will be available after the first season begins.
                    </div>
                </div>
            )}

            {activeNav === "loadout" && <LoadoutPanel />}

            {activeNav === "clothing" && <ClothingPanel />}

            {error && (
                <div className={style.errorToast}>
                    {error}
                    <button type="button" className={style.errorClose} onClick={() => setError(null)} aria-label="Dismiss">
                        ×
                    </button>
                </div>
            )}
        </div>
    );
});

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export default createComponent({
    props: {},
    component: MainMenu,
    pageName: "mainmenu"
});
