import * as React from "react";
import EventManager from "utils/EventManager.util";
import { IconGun } from "src/components/ui/Icons";
import style from "./loadout.module.scss";

interface WeaponComp {
    hash: number;
    name: string;
    category: string;
    recoilModifier: number;
}

type WeaponCategory = "pistols" | "rifles" | "shotguns";

interface WeaponDef {
    weaponHash: number;
    weaponName: string;
    displayName: string;
    icon: string;
    accent: string;
    category: WeaponCategory;
    components: WeaponComp[];
}

const WEAPONS: WeaponDef[] = [
    {
        weaponHash: 2578377531, weaponName: "weapon_pistol50", displayName: "Pistol .50", icon: "P50", accent: "#7b3fa0", category: "pistols",
        components: [
            { hash: 580369945, name: "Default Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 3654528394, name: "Extended Clip", category: "clip", recoilModifier: 1.0 },
            { hash: 899381934, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 2805810788, name: "Suppressor", category: "muzzle", recoilModifier: 0.95 },
            { hash: 2008591365, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 3231910285, weaponName: "weapon_specialcarbine", displayName: "Special Carbine", icon: "SC", accent: "#4f6aff", category: "rifles",
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
        weaponHash: 2132975508, weaponName: "weapon_bullpuprifle", displayName: "Bullpup Rifle", icon: "BR", accent: "#2ca58d", category: "rifles",
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
        weaponHash: 4208062921, weaponName: "weapon_carbinerifle_mk2", displayName: "Carbine Rifle Mk II", icon: "CR2", accent: "#c06cff", category: "rifles",
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
        weaponHash: 487013001, weaponName: "weapon_pumpshotgun", displayName: "Pump Shotgun", icon: "PS", accent: "#ff8b5c", category: "shotguns",
        components: [
            { hash: 2076495324, name: "Flashlight", category: "flashlight", recoilModifier: 1.0 },
            { hash: 3859329886, name: "Suppressor", category: "muzzle", recoilModifier: 0.92 },
            { hash: 2732039643, name: "Yusuf Amir Luxury Finish", category: "skin", recoilModifier: 1.0 },
        ]
    },
    {
        weaponHash: 3220176749, weaponName: "weapon_assaultrifle", displayName: "Assault Rifle", icon: "AR", accent: "#ff5c7a", category: "rifles",
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
];

const WEAPON_IMAGES: Record<string, string> = {
    weapon_pistol50: new URL("../../assets/images/hud/weapons/weapon_pistol50.svg", import.meta.url).href,
    weapon_specialcarbine: new URL("../../assets/images/hud/weapons/weapon_specialcarbine.svg", import.meta.url).href,
    weapon_bullpuprifle: new URL("../../assets/images/hud/weapons/weapon_bullpuprifle.svg", import.meta.url).href,
    weapon_carbinerifle_mk2: new URL("../../assets/images/hud/weapons/weapon_carbinerifle_mk2.svg", import.meta.url).href,
    weapon_pumpshotgun: new URL("../../assets/images/hud/weapons/weapon_pumpshotgun.svg", import.meta.url).href,
    weapon_assaultrifle: new URL("../../assets/images/hud/weapons/weapon_assaultrifle.svg", import.meta.url).href,
};

const CATEGORIES = ["clip", "muzzle", "grip", "scope", "barrel", "flashlight", "skin"] as const;
const WEAPON_CATEGORIES: { id: WeaponCategory; label: string }[] = [
    { id: "rifles", label: "RIFLES" },
    { id: "pistols", label: "PISTOLS" },
    { id: "shotguns", label: "SHOTGUNS" }
];

const LoadoutPanel: React.FC = () => {
    const [selectedWeapon, setSelectedWeapon] = React.useState(0);
    const [selectedCategory, setSelectedCategory] = React.useState<WeaponCategory>("rifles");
    const [equipped, setEquipped] = React.useState<Record<string, Record<string, number>>>({});
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        const handler = (data: { presets: { weaponName: string; components: number[] }[] }) => {
            const eq: Record<string, Record<string, number>> = {};
            data.presets.forEach((p) => {
                const wDef = WEAPONS.find((w) => w.weaponName === p.weaponName);
                if (!wDef) return;
                eq[p.weaponName] = {};
                p.components.forEach((ch) => {
                    const comp = wDef.components.find((c) => c.hash === ch);
                    if (comp) eq[p.weaponName][comp.category] = ch;
                });
            });
            setEquipped(eq);
        };
        EventManager.addHandler("loadout", "presetsLoaded", handler);
        EventManager.emitServer("loadout", "getPresets");
        return () => EventManager.removeTargetHandlers("loadout");
    }, []);

    const filteredWeapons = WEAPONS.filter((w) => w.category === selectedCategory);
    const weapon = filteredWeapons[selectedWeapon] ?? filteredWeapons[0] ?? WEAPONS[0];
    const weaponEquipped = equipped[weapon.weaponName] || {};
    const weaponImage = WEAPON_IMAGES[weapon.weaponName];

    const toggleComponent = (comp: WeaponComp) => {
        const newEquipped = { ...equipped };
        if (!newEquipped[weapon.weaponName]) newEquipped[weapon.weaponName] = {};
        const wEq = { ...newEquipped[weapon.weaponName] };

        if (wEq[comp.category] === comp.hash) {
            delete wEq[comp.category];
        } else {
            wEq[comp.category] = comp.hash;
        }
        newEquipped[weapon.weaponName] = wEq;
        setEquipped(newEquipped);
    };

    const savePreset = () => {
        setSaving(true);
        const components = Object.values(weaponEquipped);
        EventManager.emitServer("loadout", "savePreset", JSON.stringify({ weaponName: weapon.weaponName, components }));
        setTimeout(() => setSaving(false), 1000);
    };

    const categoriesForWeapon = CATEGORIES.filter((cat) => weapon.components.some((c) => c.category === cat));

    return (
        <div className={style.loadout}>
            <div className={style.header}>
                <span className={style.title}>WEAPON LOADOUT</span>
                <span className={style.subtitle}>Customize attachments for your arena weapons. Changes apply at the start of each round.</span>
            </div>

            <div className={style.weaponGrid}>
                <div className={style.categoryList}>
                    {WEAPON_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`${style.categoryBtn} ${selectedCategory === cat.id ? style.categoryActive : ""}`}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                setSelectedWeapon(0);
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className={style.weaponList}>
                    {filteredWeapons.map((w, i) => (
                        <button
                            key={w.weaponName}
                            className={`${style.weaponBtn} ${i === selectedWeapon ? style.active : ""}`}
                            onClick={() => setSelectedWeapon(i)}
                        >
                            {WEAPON_IMAGES[w.weaponName] ? (
                                <img className={style.weaponThumb} src={WEAPON_IMAGES[w.weaponName]} alt={w.displayName} />
                            ) : (
                                <span className={style.weaponIcon} style={{ background: w.accent }}>
                                    {w.icon}
                                </span>
                            )}
                            <span className={style.weaponLabel}>{w.displayName}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={style.attachments}>
                <div className={style.weaponHeader}>
                    <div className={style.weaponPreview}>
                        {weaponImage ? (
                            <img className={style.weaponPreviewImg} src={weaponImage} alt={weapon.displayName} />
                        ) : (
                            <IconGun className={style.weaponSvg} />
                        )}
                        <div className={style.weaponTitle}>{weapon.displayName}</div>
                    </div>
                </div>
                {categoriesForWeapon.map((cat) => {
                    const comps = weapon.components.filter((c) => c.category === cat);
                    if (comps.length === 0) return null;
                    return (
                        <div key={cat} className={style.category}>
                            <div className={style.catLabel}>{cat.toUpperCase()}</div>
                            <div className={style.compList}>
                                {comps.map((comp) => {
                                    const isEquipped = weaponEquipped[cat] === comp.hash;
                                    return (
                                        <button
                                            key={comp.hash}
                                            className={`${style.compBtn} ${isEquipped ? style.compActive : ""}`}
                                            onClick={() => toggleComponent(comp)}
                                        >
                                            <span className={style.compName}>{comp.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <button className={style.saveBtn} onClick={savePreset} disabled={saving}>
                    {saving ? "SAVING..." : "SAVE LOADOUT"}
                </button>
            </div>
        </div>
    );
};

export default LoadoutPanel;
