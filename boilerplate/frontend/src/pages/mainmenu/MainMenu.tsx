import * as React from "react";
import { observer } from "mobx-react-lite";
import EventManager from "utils/EventManager.util";
import { createComponent } from "src/hoc/registerComponent";
import { playerStore } from "store/Player.store";
import { IconSkull, IconUsers, IconGun } from "src/components/ui/Icons";
import style from "./mainmenu.module.scss";
import LoadoutPanel from "../loadout/LoadoutPanel";
import ClothingPanel from "../clothing/ClothingPanel";

const GAME_MODES = [
    { id: "hopouts", label: "HOP OUTS", Icon: IconSkull },
    { id: "ffa", label: "FREE FOR ALL", Icon: IconUsers },
    { id: "gungame", label: "GUN GAME", Icon: IconGun }
] as const;

const HOP_OUT_SIZES = [2, 3, 4, 5] as const;

const MainMenu: React.FC = observer(() => {
    const [loading, setLoading] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [activeNav, setActiveNav] = React.useState<"play" | "connect" | "ranking" | "loadout" | "clothing">("play");
    const [gameMode, setGameMode] = React.useState<(typeof GAME_MODES)[number]["id"]>("hopouts");
    const [queueSize, setQueueSize] = React.useState<(typeof HOP_OUT_SIZES)[number]>(2);
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
        return () => EventManager.removeTargetHandlers("mainmenu");
    }, []);

    const handleQueue = React.useCallback(() => {
        setError(null);
        setLoading("arena");
        const payload: { mode: string; size?: number } = { mode: gameMode };
        if (gameMode === "hopouts") payload.size = queueSize;
        EventManager.emitServer("mainmenu", "playArena", JSON.stringify(payload));
        setTimeout(() => setLoading(null), 3000);
    }, [gameMode, queueSize]);

    const openSettings = React.useCallback(() => {
        EventManager.emitServer("mainmenu", "openSettings");
    }, []);

    const isLoading = loading !== null;
    const displayName = playerName && playerName !== "Player" ? playerName : (playerStore.data.id ? `Player [${playerStore.data.id}]` : "Player");
    const playersLabel = gameMode === "hopouts" ? String(queueSize * 2) : "FREE";
    const modeLabel = GAME_MODES.find((m) => m.id === gameMode)?.label ?? "HOP OUTS";

    React.useEffect(() => {
        EventManager.emitClient("mainmenu", "scene", { showPlayer: activeNav === "clothing" });
        return () => {
            EventManager.emitClient("mainmenu", "scene", { showPlayer: true });
        };
    }, [activeNav]);

    return (
        <div className={cn(style.lobby, activeNav === "clothing" ? style.sceneMode : style.menuMode)}>
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

                    <section className={style.queuePanel}>
                        <div className={style.queueHeader}>
                            <span className={style.queueTitle}>{modeLabel}</span>
                            <span className={style.queueSub}>QUEUE FOR MATCHMAKING</span>
                        </div>
                        <div className={style.queueStats}>
                            <div className={style.queueRow}>
                                <span className={style.queueLabel}>PLAYERS</span>
                                <span className={style.queueValue}>{playersLabel}</span>
                            </div>
                            <div className={style.queueRow}>
                                <span className={style.queueLabel}>MAP</span>
                                <span className={style.queueValue}>RANDOM</span>
                            </div>
                            <div className={style.queueRow}>
                                <span className={style.queueLabel}>WEAPON</span>
                                <span className={style.queueValue}>ROTATION</span>
                            </div>
                        </div>
                        <button className={style.queueBtn} onClick={handleQueue} disabled={isLoading}>
                            {loading === "arena" ? "JOINING..." : "QUEUE"}
                        </button>
                    </section>
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
