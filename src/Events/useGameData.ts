import { useState, useEffect, useMemo } from "react";
import { NoData } from "./Types";

const EVENT_RESPONSE_EXPIRE = 12 * 60 * 60 * 1000;
function updateGameData<T>(
  fetchGameData: () => Promise<T>,
  setGameData: (gameData: T | NoData) => void,
) {
  fetchGameData()
    .then((data) => setGameData(data))
    .catch(() => setGameData(NoData.NoData));
}
export function useGameData<T>(
  fetchGameData: () => Promise<T>,
  storage: string,
  open: boolean,
): [NoData | T, () => void] {
  const storageItem = useMemo(() => {
    const current = localStorage.getItem(storage);
    if (!current) {
      return undefined;
    }
    let currentJson: T;
    try {
      currentJson = JSON.parse(current);
    } catch {
      return undefined;
    }
    return currentJson;
  }, []);

  const [gameData, setGameData] = useState<NoData | T>(
    storageItem ?? NoData.WaitingForResponse,
  );

  const handleSetGameData = (newGameData: NoData | T) => {
    setGameData(newGameData);
    if (newGameData != NoData.NoData) {
      localStorage.setItem(storage, JSON.stringify(newGameData));
      localStorage.setItem(storage + "Expire", String(Date.now()));
    }
  };

  const forceReload = () => {
    if (gameData != NoData.WaitingForResponse) {
      updateGameData(fetchGameData, handleSetGameData);
    }
  };

  useEffect(() => {
    if (gameData == NoData.NoData || gameData == NoData.WaitingForResponse) {
      if (storageItem == undefined) {
        if (!open) {
          return;
        }
        return updateGameData(fetchGameData, handleSetGameData);
      }
      setGameData(storageItem);
    }
    if (!open) {
      return;
    }
    const now = Date.now();
    const response_expire =
      Number(localStorage.getItem(storage + "Expire") ?? 0) +
      EVENT_RESPONSE_EXPIRE;
    if (response_expire < now) {
      updateGameData(fetchGameData, handleSetGameData);
    }
  }, [open]);

  return [gameData, forceReload];
}
