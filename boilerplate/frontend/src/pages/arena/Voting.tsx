import * as React from "react";
import { observer } from "mobx-react-lite";
import EventManager from "utils/EventManager.util";
import { createComponent } from "src/hoc/registerComponent";
import { arenaStore } from "store/Arena.store";
import style from "./arena.module.scss";

const HopoutsVoting: React.FC = observer(() => {
    const { lobby } = arenaStore;

    const handleVote = React.useCallback((mapId: string) => {
        EventManager.emitServer("arena", "vote", { mapId });
    }, []);

    return (
        <div className={style.arena}>
            <div className={style.header}>
                PICK A LOCATION
                <span className={style.desc}>
                    {lobby.countdown > 0 ? `Voting ends in ${lobby.countdown}s` : "Select where to play"}
                </span>
            </div>

            <div className={style.voteMaps}>
                {lobby.voteMaps.map((m) => (
                    <div
                        key={m.id}
                        className={`${style.mapCard} ${lobby.myVote === m.id ? style.mapCardSelected : ""}`}
                        onClick={() => handleVote(m.id)}
                    >
                        <span className={style.mapName}>{m.name}</span>
                        <span className={style.voteCount}>{m.votes} votes</span>
                        {lobby.myVote === m.id && <span className={style.voteCheck}>✓</span>}
                    </div>
                ))}
            </div>

            {lobby.countdown > 0 && <div className={style.timer}>{lobby.countdown}</div>}
        </div>
    );
});

export default createComponent({
    props: {},
    component: HopoutsVoting,
    pageName: "arena_voting"
});
