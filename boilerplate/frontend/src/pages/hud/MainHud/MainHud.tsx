import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";
import { entries } from "mobx";

import { hudStore } from "store/Hud.store";
import { playerStore } from "store/Player.store";

import Speedometer from "./components/Speedometer";

import star from "assets/images/hud/icons/star.svg";
import ping from "assets/images/hud/icons/ping.svg";
import users from "assets/images/hud/icons/user.svg";
import ammoicon from "assets/images/hud/icons/ammo.svg";
import areaicon from "assets/images/hud/icons/areaname.svg";
import cashicon from "assets/images/hud/icons/cash.svg";

import style from "./mainhud.module.scss";
import { regExp } from "utils/Helpers.util";

const MainHUD: FC<{ store: typeof hudStore; playerStore: typeof playerStore }> = ({ store, playerStore }) => {
    const getWeaponImage = useMemo(() => {
        return new URL(`../../../assets/images/hud/weapons/${playerStore.data.weapondata?.weapon}.svg`, import.meta.url).href;
    }, [playerStore.data.weapondata]);

    return (
        <div className={style.mainhud}>
            <div className={style.left}>
                <div className={style.areainfo}>
                    <img src={areaicon} alt="" />
                    <div className={style.areadata}>
                        <div className={style.areaname}>{store.areaData.area}</div>
                        <div className={style.streetname}>{store.areaData.street}</div>
                    </div>
                </div>
            </div>

            <div className={style.right}>
                <div className={style.serverBadges}>
                    <div className={`${style.serverBadge} ${style.onlineBadge}`}>
                        <span className={style.onlineLabel}>Online:</span>
                        <span className={style.onlineCount}>{playerStore.nowPlaying}</span>
                    </div>
                    <div className={`${style.serverBadge} ${style.serverNameBadge}`}>HOPOUTS</div>
                </div>

                <div className={style.playerInfo}>
                    <div className={style.id}>ID: {playerStore.data.id}</div>
                    <div className={style.ping}>
                        <img src={ping} alt="" />
                        {playerStore.data.ping}
                    </div>
                    <div className={style.online}>
                        <img src={users} alt="" />
                        {playerStore.nowPlaying}
                    </div>
                </div>

                {playerStore.data.wantedLevel > 0 && (
                    <div className={style.stars}>
                        {Array.from({ length: playerStore.data.wantedLevel }).map((_e, x) => (
                            <img src={star} alt="star" key={x} />
                        ))}
                    </div>
                )}

                {playerStore.data.weapondata && (
                    <div className={style.weaponInfo}>
                        <img src={getWeaponImage} alt="" />
                        <span className={style.ammodata}>
                            <img src={ammoicon} alt="ammo" />
                            {playerStore.data.weapondata.ammo}/{playerStore.data.weapondata.maxammo}
                        </span>
                    </div>
                )}

                <div className={style.cashinfo}>
                    <img src={cashicon} alt="" />
                    ${("" + playerStore.data.cash).replace(regExp.money, "$1,")}
                </div>

                <div className={style.keybindGuide}>
                    {entries(playerStore.keybindGuide).map(([key, label], i) => (
                        <div key={i} className={style.keybind}>
                            <span className={style.key}>{key}</span>
                            <span className={style.label}>{label}</span>
                        </div>
                    ))}
                </div>

                {store.vehicleData.isActive && (
                    <div className={style.speedo}>
                        <Speedometer store={store} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(MainHUD);
