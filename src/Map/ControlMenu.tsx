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
import useLocalization from "../localization/useLocalization";

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

console.log(WILD_ITEMS);

function ItemSection({
  huntedItem,
  setHuntedItem,
}: {
  huntedItem: string | undefined;
  setHuntedItem: (item: string | undefined) => void;
}) {
  const { L: Loc } = useLocalization();

  const item = huntedItem && ITEM_DIC[huntedItem];
  const [itemSelector, setItemSelector] = useState(false);

  return (
    <>
      <label>
        Find:{" "}
        <button onClick={() => setItemSelector(true)}>
          Select Item: {item ? Loc(item.name) : "Unset"}
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
                <div className={styles.itemSelectName}>{Loc(item.name)}</div>
                <div className={styles.itemSelectDesc}>
                  <TextTag>{Loc(item.desc)}</TextTag>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

type ControlLayerType = {
  children: React.ReactNode;
  title: string;
  category?: string;
};

type Props = {
  layers: ControlLayerType[];
  huntedBeastie: string | undefined;
  setHuntedBeastie: (beastie: string | undefined) => void;
  postgame: boolean;
  setPostgame: (postgame: boolean) => void;
  huntedItem: string | undefined;
  setHuntedItem: (itemId: string | undefined) => void;
};

function ControlMenuInner({
  layers,
  huntedBeastie,
  setHuntedBeastie,
  postgame,
  setPostgame,
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
      (layer) => layersVisible[layer] === false,
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
            <label>
              <input
                type="checkbox"
                checked={layersVisible[layer.title] ?? true}
                onChange={(event) =>
                  setLayer(layer.title, event.currentTarget.checked)
                }
              />{" "}
              {layer.title}
            </label>
            {(layersVisible[layer.title] ?? true) ? (
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
        <label>
          <input
            type="checkbox"
            checked={postgame}
            onChange={(event) => setPostgame(event.currentTarget.checked)}
            id="postgame"
          />{" "}
          Postgame Spawns
        </label>
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
