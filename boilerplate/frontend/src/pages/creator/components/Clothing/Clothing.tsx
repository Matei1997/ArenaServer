import { FC, useCallback, useEffect, useMemo, useState } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import EventManager from "utils/EventManager.util";
import style from "./clothing.module.scss";
import { creatorStore } from "store/CharCreator.store";

type ClothingType = "hats" | "masks" | "tops" | "pants" | "shoes";

interface ClothingStore {
  data: { clothes: Record<ClothingType, { drawable: number; texture: number }> };
}

const CreatorPlayerClothes: FC<{ store: ClothingStore; eventPrefix?: "creator" | "wardrobe"; compact?: boolean }> = ({ store, eventPrefix = "creator", compact = false }) => {
  const [clothingType, setClothingType] = useState<ClothingType>("hats");

  const sendClothingData = useCallback(
    (type: ClothingType, drawable: number, texture: number) => {
      EventManager.emitClient(eventPrefix, "preview", "clothing", type, drawable, texture);
    },
    [eventPrefix]
  );

  useEffect(() => {
    (["hats", "masks", "tops", "pants", "shoes"] as ClothingType[]).forEach((cat) => {
      const opt = store.data.clothes[cat];
      sendClothingData(cat, opt.drawable, opt.texture);
    });
  }, [sendClothingData]);

  const clothingCategories = useMemo<ClothingType[]>(
    () => ["hats", "masks", "tops", "pants", "shoes"],
    []
  );

  // Max values - GTA V freemode has 250+ tops, 100+ pants/shoes, etc.
  const limits = useMemo(
    () => ({
      hats: { maxDrawable: 150, maxTexture: 20 },
      masks: { maxDrawable: 200, maxTexture: 20 },
      tops: { maxDrawable: 250, maxTexture: 25 },
      pants: { maxDrawable: 100, maxTexture: 20 },
      shoes: { maxDrawable: 100, maxTexture: 15 },
    }),
    []
  );

  // Always read current values from the store (MobX-safe)
  const current = store.data.clothes[clothingType];

  return (
    <div className={cn(style.appearance, compact && style.compact)}>
      <div className={style.navigation}>
        {clothingCategories.map((category, index) => (
          <div key={index}>
            <div
              className={cn(style.element, clothingType === category ? style.active : undefined)}
              onClick={() => {
                setClothingType(category);

                // instantly preview the selected category using latest store values
                const opt = store.data.clothes[category];
                sendClothingData(category, opt.drawable, opt.texture);
              }}
            >
              <img
                className={style.img}
                src={`${new URL(`../../../../assets/images/creator/icons/${category}.svg`, import.meta.url).href}`}
                alt={category}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={style.options}>
        <div className={style.title}>
          <span>select {clothingType}</span>
        </div>

        <div className={style.list}>
          {/* DRAWABLE */}
          <div className={style.element}>
            <div className={style.range_element}>
              <span>drawable</span>
              <div className={style.slider}>
                <input
                  type="range"
                  min={0}
                  max={limits[clothingType].maxDrawable}
                  value={current.drawable}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    // update store
                    store.data.clothes[clothingType].drawable = value;

                    // preview
                    sendClothingData(clothingType, value, store.data.clothes[clothingType].texture);
                  }}
                />
              </div>
            </div>
          </div>

          {/* TEXTURE */}
          <div className={style.element}>
            <div className={style.range_element}>
              <span>texture</span>
              <div className={style.slider}>
                <input
                  type="range"
                  min={0}
                  max={limits[clothingType].maxTexture}
                  value={current.texture}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    // update store
                    store.data.clothes[clothingType].texture = value;

                    // preview
                    sendClothingData(clothingType, store.data.clothes[clothingType].drawable, value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(CreatorPlayerClothes);