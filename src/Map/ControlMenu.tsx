import { Fragment, useCallback, useMemo, useState } from "react";
import Control from "react-leaflet-custom-control";

import styles from "./Map.module.css";
import InfoBox from "../shared/InfoBox";
import { LayerGroup } from "react-leaflet";
import BeastieSelect from "../shared/BeastieSelect";
import { SPAWNABLE_BEASTIES } from "./Map";
import { useLocalStorage } from "usehooks-ts";

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
};

function ControlMenuInner({
  layers,
  huntedBeastie,
  setHuntedBeastie,
  postgame,
  setPostgame,
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
