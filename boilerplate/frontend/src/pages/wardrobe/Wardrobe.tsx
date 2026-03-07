import * as React from "react";
import { observer } from "mobx-react-lite";
import CreatorPlayerClothes from "pages/creator/components/Clothing/Clothing";
import EventManager from "utils/EventManager.util";
import { wardrobeStore } from "store/Wardrobe.store";
import { createComponent } from "src/hoc/registerComponent";
import style from "./wardrobe.module.scss";

const Wardrobe: React.FC<{ store: typeof wardrobeStore }> = observer(({ store }) => {
    const handleSave = React.useCallback(() => {
        EventManager.emitServer("wardrobe", "save", store.data.clothes);
    }, [store.data.clothes]);

    const handleClose = React.useCallback(() => {
        EventManager.emitServer("wardrobe", "close");
    }, []);

    return (
        <div className={style.wardrobe}>
            <div className={style.sidebar}>
                <div className={style.header}>
                    <span>Clothing</span>
                    <div className={style.actions}>
                        <button className={style.save} onClick={handleSave}>
                            Save
                        </button>
                        <button className={style.close} onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </div>
                <div className={style.content}>
                    <CreatorPlayerClothes store={store} eventPrefix="wardrobe" compact />
                </div>
            </div>
        </div>
    );
});

export default createComponent({
    props: { store: wardrobeStore },
    component: Wardrobe,
    pageName: "wardrobe",
});
