import { Fragment, useCallback, useMemo, useState } from "react";
import Control from "react-leaflet-custom-control";

import styles from "./Map.module.css";
import InfoBox from "../shared/InfoBox";
import { LayerGroup } from "react-leaflet";
import BeastieSelect from "../shared/BeastieSelect";
import { SPAWNABLE_BEASTIES } from "./Map";
import { useLocalStorage } from "usehooks-ts";
import ITEM_DIC from "../data/ItemData";
import Modal from "../shared/Modal";
import { EXTRA_MARKERS } from "../data/WorldData";
import TextTag from "../shared/TextTag";

export function ControlSection({
  header,
  children,
  sectionName,
  visibleSection,
  setVisibleSection,
}: {
  header: string;
  children: React.ReactNode;
  sectionName: string;
  visibleSection: string | undefined;
  setVisibleSection: (section: string | undefined) => void;
}) {
  return (
    <InfoBox
      header={header}
      container={{
        className:
          visibleSection == sectionName
            ? styles.controlSection
            : styles.controlSectionClosed,
      }}
      headerClick={() =>
        setVisibleSection(
          visibleSection == sectionName ? undefined : sectionName,
        )
      }
    >
      <div className={styles.controlSectionChildren}>{children}</div>
    </InfoBox>
  );
}

const WILD_ITEMS = EXTRA_MARKERS.gifts
  .flatMap((gift) => gift.items.map((item) => item[0] as string))
  .filter((item, index, array) => array.indexOf(item) == index)
  .map((itemId) => ITEM_DIC[itemId])
  .sort((item1, item2) => item1.type - item2.type || item1.img - item2.img);

function ItemSection({
  huntedItem,
  setHuntedItem,
}: {
  huntedItem: string | undefined;
  setHuntedItem: (item: string | undefined) => void;
}) {
  const item = huntedItem && ITEM_DIC[huntedItem];
  const [itemSelector, setItemSelector] = useState(false);

  return (
    <>
      <label>
        Find:{" "}
        <button onClick={() => setItemSelector(true)}>
          Select Item: {item ? item.name : "Unset"}
        </button>
      </label>
      <Modal
        header="Select Item"
        open={itemSelector}
        onClose={() => setItemSelector(false)}
        hashValue="SelectItem"
      >
        <div className={styles.itemSelect}>
          <div
            key={"unset"}
            className={styles.itemSelectItem}
            onClick={() => setHuntedItem(undefined)}
          >
            Unset
          </div>
          {WILD_ITEMS.map((item) => (
            <div
              key={item.id}
              className={styles.itemSelectItem}
              onClick={() => setHuntedItem(item.id)}
            >
              <img src={`/gameassets/sprItems/${item.img}.png`} />
              <div className={styles.itemSelectText}>
                <div className={styles.itemSelectName}>{item.name}</div>
                <div className={styles.itemSelectDesc}>
                  <TextTag>{item.desc}</TextTag>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

type ReactStateBool = React.Dispatch<React.SetStateAction<boolean>>;

function Checkbox({
  checked,
  handleChange,
  text,
}: {
  checked: boolean;
  handleChange: ReactStateBool;
  text: string;
}) {
  const handleChangeActual: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleChange((value) => !value);
  };
  // weird react things that breaks labels on checkboxes on mobile
  return (
    <label
      tabIndex={0}
      className={styles.controlCheckLabel}
      onClick={handleChangeActual}
    >
      <input
        type="checkbox"
        checked={checked}
        /* react yells at your for having checked without onChange */
        onChange={() => {}}
        /* checked value doesn't update properly when clicking directly on the checkbox */
        key={String(checked)}
        tabIndex={-1}
      />
      {text}
    </label>
  );
}

type ControlLayerType = {
  children: React.ReactNode;
  title: string;
  category?: string;
  defaultHidden?: boolean;
};

type Props = {
  layers: ControlLayerType[];
  huntedBeastie: string | undefined;
  setHuntedBeastie: (beastie: string | undefined) => void;
  postgame: boolean;
  setPostgame: ReactStateBool;
  attractSpray: boolean;
  setAttractSpray: ReactStateBool;
  huntedItem: string | undefined;
  setHuntedItem: (itemId: string | undefined) => void;
};

function ControlMenuInner({
  layers,
  huntedBeastie,
  setHuntedBeastie,
  postgame,
  setPostgame,
  attractSpray,
  setAttractSpray,
  huntedItem,
  setHuntedItem,
}: Props) {
  const [visibleSection, setVisibleSection] = useState<string | undefined>(
    undefined,
  );
  const [layersVisible, setLayersVisible] = useLocalStorage<
    Record<string, boolean>
  >("mapLayersVisible", {});
  const setLayer = useCallback(
    (layer: string, visible: boolean) =>
      setLayersVisible((oldLayers) => ({ ...oldLayers, [layer]: visible })),
    [setLayersVisible],
  );

  const categories = layers
    .map((layer) => layer.category)
    .filter((category) => typeof category == "string");
  const categoryLayers: Record<string, string[]> = {};
  for (const category of categories) {
    categoryLayers[category] = [];
    let correctCategory = false;
    for (const layer of layers) {
      if (correctCategory) {
        if (layer.category != undefined && layer.category != category) {
          break;
        }
      } else {
        correctCategory = layer.category == category;
      }
      if (correctCategory) {
        categoryLayers[category].push(layer.title);
      }
    }
  }
  const toggleCategory = (category: string | undefined) => {
    if (category == undefined) {
      return;
    }
    const anyNotVisible = categoryLayers[category].some(
      (layer) =>
        (layersVisible[layer] ??
          (layers.find((l) => l.title == layer)?.defaultHidden
            ? false
            : true)) === false,
    );
    for (const layer of categoryLayers[category]) {
      setLayer(layer, anyNotVisible);
    }
  };

  return (
    <>
      <ControlSection
        header="Markers"
        sectionName="markers"
        visibleSection={visibleSection}
        setVisibleSection={setVisibleSection}
      >
        {layers.map((layer) => (
          <Fragment key={layer.title}>
            {layer.category && (
              <div
                className={styles.controlLayerCategory}
                onClick={() => toggleCategory(layer.category)}
                tabIndex={0}
                role="button"
              >
                {layer.category}
              </div>
            )}
            <Checkbox
              checked={layersVisible[layer.title] ?? !layer.defaultHidden}
              handleChange={(value) =>
                typeof value == "boolean"
                  ? setLayer(layer.title, value)
                  : setLayer(
                      layer.title,
                      value(layersVisible[layer.title] ?? !layer.defaultHidden),
                    )
              }
              text={layer.title}
            />
            {(layersVisible[layer.title] ??
            (layer.defaultHidden ? false : true)) ? (
              <LayerGroup>{layer.children}</LayerGroup>
            ) : undefined}
          </Fragment>
        ))}
      </ControlSection>
      <ControlSection
        header="Beasties"
        sectionName="beasties"
        visibleSection={visibleSection}
        setVisibleSection={setVisibleSection}
      >
        <label>
          Track:{" "}
          <BeastieSelect
            beastieId={huntedBeastie}
            setBeastieId={setHuntedBeastie}
            extraOptionText="Show All"
            extraOption="all"
            isSelectable={(beastie) => SPAWNABLE_BEASTIES.includes(beastie.id)}
            nonSelectableReason="Beastie has no wild habitat."
          />
        </label>
        <Checkbox
          checked={postgame}
          handleChange={setPostgame}
          text="Postgame Spawns"
        />
        <Checkbox
          checked={attractSpray}
          handleChange={setAttractSpray}
          text="Attract Spray"
        />
      </ControlSection>
      <ControlSection
        header="Items"
        sectionName="items"
        visibleSection={visibleSection}
        setVisibleSection={setVisibleSection}
      >
        <ItemSection huntedItem={huntedItem} setHuntedItem={setHuntedItem} />
      </ControlSection>
    </>
  );
}

export function ControlMenu(props: Props) {
  return (
    <Control
      position="topright"
      container={useMemo(() => ({ className: styles.controlContainer }), [])}
    >
      <ControlMenuInner {...props} />
    </Control>
  );
}
